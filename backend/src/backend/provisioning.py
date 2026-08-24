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
    company_name,
    user_email:   str,
    supabase_admin,
) -> ProvisioningResult:
    """
    Provision a new tenant for auth_user_id.

    D.1/B1 path: company_name provided -> steps 1-3 then step 4.
    D.1/B3 path: company_name absent  -> steps 1-3 with placeholder, claim withheld.

    Steps:
      1. INSERT customer_accounts (account_type=TENANT)
      2. INSERT public.users (mirror auth UUID)
      3. INSERT user_account_roles (role_code=account_owner)
      4. admin.update_user_by_id -> app_metadata.tenant_id  [C4: one attempt only]

    C1: Step 5 (verification) lives in middleware on first authenticated request.
    """
    if not company_name:
        return _provision_pending_onboarding(auth_user_id, user_email, supabase_admin)
    return _provision_full(auth_user_id, company_name, user_email, supabase_admin)


def _provision_full(auth_user_id, company_name, user_email, supabase_admin):
    package_id = _resolve_package_id(supabase_admin, PROVISIONING_PACKAGE)
    if not package_id:
        return ProvisioningResult(
            status=ProvisioningStatus.FAILED,
            user_id=auth_user_id,
            error=f"Package '{PROVISIONING_PACKAGE}' not found. Run migration 38.",
        )

    tenant_id = None

    # Step 1
    try:
        ca_res = supabase_admin.table("customer_accounts").insert({
            "company_name": company_name,
            "account_type": "TENANT",
            "package_id":   package_id,
        }).execute()
        if not ca_res.data:
            raise RuntimeError("customer_accounts INSERT returned no data.")
        tenant_id = ca_res.data[0]["id"]
    except Exception as exc:
        return ProvisioningResult(status=ProvisioningStatus.FAILED, user_id=auth_user_id,
                                  error=f"Step 1 (customer_accounts): {exc}")

    # Step 2
    try:
        supabase_admin.table("users").insert({"id": auth_user_id, "email": user_email}).execute()
    except Exception as exc:
        record_pending_claim(supabase_admin, auth_user_id, tenant_id, "CLAIM_FAILED",
                             f"Step 2 (public.users) failed after step 1: {exc}")
        return ProvisioningResult(status=ProvisioningStatus.PARTIAL_CLAIM_PENDING,
                                  tenant_id=tenant_id, user_id=auth_user_id, error=str(exc))

    # Step 3
    try:
        supabase_admin.table("user_account_roles").insert({
            "user_id":             auth_user_id,
            "customer_account_id": tenant_id,
            "role_code":           PROVISIONING_ROLE,
        }).execute()
    except Exception as exc:
        record_pending_claim(supabase_admin, auth_user_id, tenant_id, "CLAIM_FAILED",
                             f"Step 3 (user_account_roles) failed after steps 1-2: {exc}")
        return ProvisioningResult(status=ProvisioningStatus.PARTIAL_CLAIM_PENDING,
                                  tenant_id=tenant_id, user_id=auth_user_id, error=str(exc))

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
            }).execute()
    except Exception as exc:
        return ProvisioningResult(status=ProvisioningStatus.FAILED, user_id=auth_user_id,
                                  error=f"PENDING_ONBOARDING provisioning failed: {exc}")

    record_pending_claim(supabase_admin, auth_user_id, tenant_id, "PENDING_ONBOARDING",
                         "company_name absent at signup; claim withheld until onboarding completes.")
    print(f"[provisioning] PENDING_ONBOARDING: tenant_id={tenant_id} user_id={auth_user_id}")
    return ProvisioningResult(status=ProvisioningStatus.PENDING_ONBOARDING,
                              tenant_id=tenant_id, user_id=auth_user_id)
