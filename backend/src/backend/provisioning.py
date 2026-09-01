# =============================================================================
# CISEM Mandatory Code Header
# File           : provisioning.py
# Ratified plan  : Entity boundary work — steps 3-5 (2026-08-14)
# Architectural  : Steps 1-3 are NOT currently atomic.
#                  Each is a separate PostgREST INSERT that commits independently.
#                  A failure at step 2 leaves an orphan customer_accounts row.
#                  A failure at step 3 leaves an orphan tenant + orphan users row.
#                  DEBT (U1.2.38): Replace steps 1-3 with a SECURITY DEFINER
#                  Postgres function called via .rpc() — the only path to genuine
#                  atomicity through the PostgREST client. Migration 39.
#                  Owner: Governor. Fix awaiting ratification (2026-08-14).
#                  Step 4 is fail-fast (C4): one attempt, on failure writes
#                  pending_claims and returns PARTIAL_CLAIM_PENDING.
#                  Verification (C1 correction): removed from provisioning.
#                  Lives in middleware on first authenticated request instead.
#                  Role (C2 correction): account_owner. Taxonomy debt recorded in
#                  migration 38 — two test rows must be formally defined before prod.
#                  Bootstrap (D.1): company_name read from user_metadata (B1 path).
#                  If absent, PENDING_ONBOARDING path (B3 safety net) — claim
#                  withheld until user completes onboarding. B2 rejected (email
#                  domain becomes tenant name that never gets cleaned up).
# Axioms         : AX-SECURITY-01 (AGENTS.md par.15), AX-STATELESS-01 (par.17),
#                  AX-ENV-01 (par.16), U1.2.13 (partial provisioning = silent failure)
# =============================================================================

from enum import Enum
from dataclasses import dataclass
from typing import Optional


class ProvisioningStatus(str, Enum):
    COMPLETE              = "COMPLETE"
    PARTIAL_CLAIM_PENDING = "PARTIAL_CLAIM_PENDING"
    PENDING_ONBOARDING    = "PENDING_ONBOARDING"
    FAILED                = "FAILED"


@dataclass
class ProvisioningResult:
    status:    ProvisioningStatus
    tenant_id: Optional[str] = None
    user_id:   Optional[str] = None
    error:     Optional[str] = None


PROVISIONING_ROLE    = "account_owner"
PROVISIONING_PACKAGE = "starter"


def record_pending_claim(
    supabase_admin,
    auth_user_id: str,
    tenant_id,
    status: str,
    error: str,
) -> None:
    """
    Write a pending_claims row. Operator visibility (U6.2.09).
    Never re-raises: a logging write must never block the caller's response.
    """
    try:
        supabase_admin.table("pending_claims").insert({
            "auth_user_id": auth_user_id,
            "tenant_id":    tenant_id,
            "status":       status,
            "last_error":   (error or "")[:500],
        }).execute()
    except Exception as exc:
        print(f"[provisioning] CRITICAL: could not write pending_claims for {auth_user_id}: {exc}")


def _resolve_package_id(supabase_admin, package_code: str):
    res = (
        supabase_admin
        .table("packages")
        .select("id")
        .eq("code", package_code)
        .limit(1)
        .execute()
    )
    return res.data[0]["id"] if res.data else None


def provision_tenant(
    *,
    auth_user_id: str,
    company_name: str,
    user_email: str,
    account_type: str = "company",
    tax_id: str = None,
    cell_number: str = None,
    country_code: str = "IL",
    currency_code: str = "ILS",
    domain_code: str = "construction_contractor",
    supabase_admin,
) -> ProvisioningResult:
    """
    Provision a new tenant for auth_user_id (A5 Step 1 Onboarding Engine).

    Payload:
      account_type: 'company' | 'private'
      company_name: Legal Name or Full Legal Name
      tax_id: Business Tax ID (HP) or National ID / Passport
      domain_code: Primary business domain code (maps to default service models)
      country_code: IL, US, DE, CN (China supplier hub)
      currency_code: ILS, USD, EUR
    """
    if not company_name:
        return _provision_pending_onboarding(auth_user_id, user_email, supabase_admin)
    return _provision_full(
        auth_user_id=auth_user_id,
        company_name=company_name,
        user_email=user_email,
        account_type=account_type,
        tax_id=tax_id,
        cell_number=cell_number,
        country_code=country_code,
        currency_code=currency_code,
        domain_code=domain_code,
        supabase_admin=supabase_admin
    )


def _provision_full(
    auth_user_id,
    company_name,
    user_email,
    account_type,
    tax_id,
    cell_number,
    country_code,
    currency_code,
    domain_code,
    supabase_admin
):
    package_id = _resolve_package_id(supabase_admin, PROVISIONING_PACKAGE)
    if not package_id:
        return ProvisioningResult(
            status=ProvisioningStatus.FAILED,
            user_id=auth_user_id,
            error=f"Package '{PROVISIONING_PACKAGE}' not found. Run migration 38.",
        )

    tenant_id = None

    # Step 1: Insert customer_accounts with settings JSONB payload
    try:
        settings_payload = {
            "account_mode": account_type or "company",
            "tax_id": tax_id or "",
            "cell_number": cell_number or "",
            "country_code": country_code or "IL",
            "currency_code": currency_code or "ILS",
            "primary_email": user_email,
            "onboarding_step": 1,
            "onboarding_status": "CONFIRMED"
        }

        ca_res = supabase_admin.table("customer_accounts").insert({
            "company_name": company_name,
            "account_type": "customer",
            "tax_id": tax_id or None,
            "package_id": package_id,
            "settings": settings_payload
        }).execute()
        if not ca_res.data:
            raise RuntimeError("customer_accounts INSERT returned no data.")
        tenant_id = ca_res.data[0]["id"]
    except Exception as exc:
        return ProvisioningResult(status=ProvisioningStatus.FAILED, user_id=auth_user_id,
                                  error=f"Step 1 (customer_accounts): {exc}")

    # Step 2: Insert public.users mirror
    try:
        supabase_admin.table("users").insert({"id": auth_user_id, "email": user_email}).execute()
    except Exception as exc:
        record_pending_claim(supabase_admin, auth_user_id, tenant_id, "CLAIM_FAILED",
                             f"Step 2 (public.users) failed after step 1: {exc}")
        return ProvisioningResult(status=ProvisioningStatus.PARTIAL_CLAIM_PENDING,
                                  tenant_id=tenant_id, user_id=auth_user_id, error=str(exc))

    # Step 3: Insert user_account_roles (role_code=account_owner)
    try:
        supabase_admin.table("user_account_roles").insert({
            "user_id":             auth_user_id,
            "customer_account_id": tenant_id,
            "role_code":           PROVISIONING_ROLE,
            "revoked_at":          None,
            "expires_at":          None,
        }).execute()
    except Exception as exc:
        record_pending_claim(supabase_admin, auth_user_id, tenant_id, "CLAIM_FAILED",
                             f"Step 3 (user_account_roles) failed after steps 1-2: {exc}")
        return ProvisioningResult(status=ProvisioningStatus.PARTIAL_CLAIM_PENDING,
                                  tenant_id=tenant_id, user_id=auth_user_id, error=str(exc))

    # Step 3.5: Provision tenant business domain & resolve default archetypes
    try:
        domain_key = domain_code or "construction_contractor"
        supabase_admin.table("tenant_business_domains").insert({
            "customer_account_id": tenant_id,
            "domain_code": domain_key,
            "is_primary": True
        }).execute()

        # Resolve default service model archetypes for this domain
        domain_res = supabase_admin.table("cr_business_domains").select("default_service_models").eq("code", domain_key).execute()
        archetypes = ['SRV', 'MTO']
        if domain_res.data and domain_res.data[0].get("default_service_models"):
            archetypes = domain_res.data[0]["default_service_models"]

        for arch_code in archetypes:
            supabase_admin.table("tenant_service_models").insert({
                "customer_account_id": tenant_id,
                "service_model_code": arch_code,
                "confirmed_at": "NOW()"
            }).execute()
    except Exception as exc:
        print(f"[provisioning] Warning: Domain/Archetype assignment notice: {exc}")

    # Step 4 — one attempt, fail-fast (C4)
    try:
        supabase_admin.auth.admin.update_user_by_id(
            auth_user_id,
            {"app_metadata": {"active_tenant_id": tenant_id, "tenant_id": tenant_id}},
        )
    except Exception as exc:
        error_msg = str(exc)
        record_pending_claim(supabase_admin, auth_user_id, tenant_id, "CLAIM_FAILED",
                             f"Step 4 (app_metadata) failed after steps 1-3: {error_msg}")
        return ProvisioningResult(status=ProvisioningStatus.PARTIAL_CLAIM_PENDING,
                                  tenant_id=tenant_id, user_id=auth_user_id, error=error_msg)

    print(f"[provisioning] COMPLETE: tenant_id={tenant_id} user_id={auth_user_id}")
    return ProvisioningResult(status=ProvisioningStatus.COMPLETE, tenant_id=tenant_id, user_id=auth_user_id)


def _provision_pending_onboarding(auth_user_id, user_email, supabase_admin):
    """B3 safety net: company_name absent. DB rows provisioned; claim withheld."""
    package_id = _resolve_package_id(supabase_admin, PROVISIONING_PACKAGE)
    tenant_id = None
    try:
        ca_res = supabase_admin.table("customer_accounts").insert({
            "company_name": "PENDING_ONBOARDING",
            "account_type": "TENANT",
            "package_id":   package_id,
        }).execute()
        if ca_res.data:
            tenant_id = ca_res.data[0]["id"]
        supabase_admin.table("users").insert({"id": auth_user_id, "email": user_email}).execute()
        if tenant_id:
            supabase_admin.table("user_account_roles").insert({
                "user_id": auth_user_id,
                "customer_account_id": tenant_id,
                "role_code": PROVISIONING_ROLE,
                "revoked_at": None,
                "expires_at": None,
            }).execute()
    except Exception as exc:
        return ProvisioningResult(status=ProvisioningStatus.FAILED, user_id=auth_user_id,
                                  error=f"PENDING_ONBOARDING provisioning failed: {exc}")

    record_pending_claim(supabase_admin, auth_user_id, tenant_id, "PENDING_ONBOARDING",
                         "company_name absent at signup; claim withheld until onboarding completes.")
    print(f"[provisioning] PENDING_ONBOARDING: tenant_id={tenant_id} user_id={auth_user_id}")
    return ProvisioningResult(status=ProvisioningStatus.PENDING_ONBOARDING,
                              tenant_id=tenant_id, user_id=auth_user_id)
