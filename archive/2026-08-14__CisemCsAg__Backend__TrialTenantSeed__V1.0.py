# =============================================================================
# ARCHIVED 2026-08-14 — DO NOT INVOKE
# Superseded by: provisioning function (Steps 3-5 of entity boundary work)
# Reason: manufactured a state the system cannot produce on its own.
#         Both trial tenants are now created through the provisioning function,
#         which tests provisioning as a side effect rather than bypassing it.
# Retained for historical reference only.
# =============================================================================
# =============================================================================
# File           : 2026-08-14__CisemCsAg__Backend__TrialTenantSeed__V1.0.py
# Ratified plan  : Consolidated Brief — Trial Tenants & Isolation Verification §4
# Architectural  : Seeds two visibly synthetic trial tenants to exercise the
#                  identity chain end-to-end for the first time.
#                  TRIAL-1 → tenant-A, TRIAL-2 → tenant-B. No shared membership.
#                  Seeded data is labelled TRIAL and uses @trial.invalid emails
#                  so no one — including the Governor in three months — can
#                  mistake either user for a real customer.
#
#                  Phases:
#                    1. Ensure role_definitions has 'member' code
#                    2. Create customer_accounts (TRIAL-A, TRIAL-B)
#                    3. Create auth users via Supabase admin API
#                    4. Mirror auth UUIDs into public.users (FK requirement)
#                    5. Create user_account_roles rows
#                    6. Write app_metadata.tenant_id via admin API
#                       NOTE: the HTTP claim endpoint (T2) cannot be called by
#                       a new user. The middleware (main.py:252) requires
#                       app_metadata.tenant_id to be present in the JWT to pass
#                       ANY request — including the claim endpoint itself.
#                       This is a bootstrap gap, documented as a finding.
#                       The direct admin write is the ONLY available path.
#                    7. Verify: sign in as trial user, confirm token carries claim
#
#                  Run AFTER teardown if re-seeding. Do not seed twice.
#                  Teardown script: TrialTenantTeardown__V1.0.py
#
# Parent axioms  : AX-SECURITY-01, AX-ENV-01 (AGENTS.md ss15/16)
# Schema deps    : customer_accounts, role_definitions, users, user_account_roles
#                  (see migrations.sql lines 273, 311, 322)
# History:
#   2026-08-14 V1.0 - Created. Do not run until teardown script is tested first.
# =============================================================================
"""
Trial Tenant Seed — Two Tenants, Two Users, No Shared Membership

PRECONDITIONS:
  - SUPABASE_URL and SUPABASE_KEY (service-role) in env
  - Backend running at BACKEND_URL for Phase 7 verification (optional)
  - Teardown script exists and has been read

IDENTIFIERS USED (hardcoded so teardown can find them):
  Tenant A : company_name contains TRIAL-A
  Tenant B : company_name contains TRIAL-B
  User 1   : trial-1@trial.invalid
  User 2   : trial-2@trial.invalid
  Role     : member (upserted if absent)
"""
import os
import sys
import json
import secrets
import urllib.request
import urllib.error

import httpx
from supabase import create_client, Client
from supabase.lib.client_options import SyncClientOptions


# ---------------------------------------------------------------------------
# Constants — change here only, all phases read these
# ---------------------------------------------------------------------------
TENANT_A_NAME   = "TRIAL-A Corp [SYNTHETIC — NOT A CUSTOMER]"
TENANT_B_NAME   = "TRIAL-B Corp [SYNTHETIC — NOT A CUSTOMER]"
USER_1_EMAIL    = "trial-1@trial.invalid"
USER_2_EMAIL    = "trial-2@trial.invalid"
TRIAL_ROLE_CODE = "member"
BACKEND_URL     = os.environ.get("BACKEND_URL", "http://localhost:8000")
CLAIM_ENDPOINT  = BACKEND_URL + "/api/v1/auth/claim"


def build_admin_client() -> Client:
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    if not url or not key:
        print("ERROR: SUPABASE_URL and SUPABASE_KEY must be in env.")
        sys.exit(1)
    http_client = httpx.Client(verify=False)
    opts = SyncClientOptions(httpx_client=http_client)
    return create_client(url, key, options=opts)


def phase_separator(n: int, title: str) -> None:
    print(f"\n{'='*64}")
    print(f"  PHASE {n}: {title}")
    print(f"{'='*64}")


def run_seed() -> None:  # noqa: PLR0912, PLR0915
    admin = build_admin_client()
    seed_record: dict = {}

    # -----------------------------------------------------------------------
    # Phase 1 — Ensure role_definitions has 'member'
    # -----------------------------------------------------------------------
    phase_separator(1, "Ensure role_definitions has 'member'")
    try:
        admin.table("role_definitions").upsert({
            "code": TRIAL_ROLE_CODE,
            "name": "Member",
            "description": "Standard tenant member — upserted by TrialTenantSeed."
        }, on_conflict="code").execute()
        print(f"  OK: role_definitions['member'] present.")
    except Exception as e:
        print(f"  ERROR: could not upsert role_definitions: {e}")
        sys.exit(1)

    # -----------------------------------------------------------------------
    # Phase 2 — Create customer_accounts (two tenants)
    # -----------------------------------------------------------------------
    phase_separator(2, "Create customer_accounts — TRIAL-A and TRIAL-B")
    tenant_ids: dict = {}
    for label, name in [("A", TENANT_A_NAME), ("B", TENANT_B_NAME)]:
        try:
            res = admin.table("customer_accounts").upsert({
                "company_name": name,
                "tax_id": f"TRIAL-{label}-SYNTHETIC",
                "industry": "TRIAL",
                "credit_terms": "TRIAL"
            }, on_conflict="company_name").execute()
            tid = res.data[0]["id"]
            tenant_ids[label] = tid
            print(f"  TRIAL-{label}: customer_account_id={tid}")
        except Exception as e:
            print(f"  ERROR creating TRIAL-{label}: {e}")
            sys.exit(1)
    seed_record["tenant_a_id"] = tenant_ids["A"]
    seed_record["tenant_b_id"] = tenant_ids["B"]

    # -----------------------------------------------------------------------
    # Phase 3 — Create auth users via admin API
    # -----------------------------------------------------------------------
    phase_separator(3, "Create auth users")
    auth_user_ids: dict = {}
    passwords: dict = {}
    for num, email, tenant_label in [
        (1, USER_1_EMAIL, "A"),
        (2, USER_2_EMAIL, "B"),
    ]:
        pw = "Trial!" + secrets.token_urlsafe(10)
        passwords[num] = pw
        try:
            res = admin.auth.admin.create_user({
                "email": email,
                "password": pw,
                "email_confirm": True,
            })
            uid = res.user.id
            auth_user_ids[num] = uid
            print(f"  User {num} ({email}): auth_user_id={uid}  password_prefix={pw[:6]}...")
        except Exception as e:
            # If user already exists (re-seed), look up by email
            print(f"  WARNING: create failed ({e}) — attempting lookup by email")
            try:
                list_res = admin.auth.admin.list_users()
                for u in list_res.users:
                    if u.email == email:
                        auth_user_ids[num] = u.id
                        print(f"  Found existing: auth_user_id={u.id}")
                        break
                if num not in auth_user_ids:
                    print(f"  ERROR: could not find {email} in auth.users")
                    sys.exit(1)
            except Exception as e2:
                print(f"  ERROR: fallback lookup failed: {e2}")
                sys.exit(1)
    seed_record["user_1_id"] = auth_user_ids[1]
    seed_record["user_2_id"] = auth_user_ids[2]

    # -----------------------------------------------------------------------
    # Phase 4 — Mirror auth UUIDs into public.users
    # user_account_roles.user_id is a FK to public.users(id), not auth.users.
    # Without a matching row in public.users, the insert in Phase 5 will fail
    # with a FK constraint violation.
    # See migrations.sql lines 311-319, 324.
    # -----------------------------------------------------------------------
    phase_separator(4, "Mirror auth UUIDs into public.users (FK requirement)")
    print(
        "  NOTE: user_account_roles.user_id references public.users(id),"
        " NOT auth.users."
    )
    print(
        "  This is a schema gap — there is no trigger to sync auth.users →"
        " public.users on signup."
    )
    for num, email in [(1, USER_1_EMAIL), (2, USER_2_EMAIL)]:
        uid = auth_user_ids[num]
        try:
            admin.table("users").upsert({
                "id": uid,
                "email": email,
                "full_name": f"TRIAL-{num} User [SYNTHETIC]",
                "password_hash": "TRIAL__SYNTHETIC__NO_HASH__DO_NOT_USE",
                "is_active": True,
            }, on_conflict="id").execute()
            print(f"  public.users row upserted: id={uid} email={email}")
        except Exception as e:
            print(f"  ERROR upserting public.users for {email}: {e}")
            sys.exit(1)

    # -----------------------------------------------------------------------
    # Phase 5 — Create user_account_roles rows
    # -----------------------------------------------------------------------
    phase_separator(5, "Create user_account_roles")
    roles = [
        (auth_user_ids[1], tenant_ids["A"], 1),
        (auth_user_ids[2], tenant_ids["B"], 2),
    ]
    for uid, tid, num in roles:
        try:
            admin.table("user_account_roles").upsert({
                "user_id": uid,
                "customer_account_id": tid,
                "role_code": TRIAL_ROLE_CODE,
            }, on_conflict="user_id,customer_account_id,role_code").execute()
            print(f"  user_account_roles: user={uid} → tenant={tid} role={TRIAL_ROLE_CODE}")
        except Exception as e:
            print(f"  ERROR creating user_account_roles for user {num}: {e}")
            sys.exit(1)

    # -----------------------------------------------------------------------
    # Phase 6 — Write app_metadata.tenant_id directly via admin API
    # The HTTP endpoint (T2, main.py:319) cannot be called by a new user.
    # The auth middleware (main.py:252) returns 401 for any user without
    # app_metadata.tenant_id already in their JWT — including the claim
    # endpoint itself. This creates an irresolvable bootstrap:
    #   - Can't call /api/v1/auth/claim without tenant_id in token
    #   - Can't get tenant_id in token without calling /api/v1/auth/claim
    # Direct admin write is the only available path for new users.
    # FINDING: /api/v1/auth/claim must be added to the public endpoint list
    # (with its own auth mechanism, e.g. invite token) to close this gap.
    # -----------------------------------------------------------------------
    phase_separator(6, "Write app_metadata.tenant_id via admin API (bootstrap gap)")
    print(
        "  BOOTSTRAP GAP: /api/v1/auth/claim is protected by the same middleware"
        " that requires tenant_id. New users cannot call it. Direct admin write used."
    )
    write_map = [(auth_user_ids[1], tenant_ids["A"]), (auth_user_ids[2], tenant_ids["B"])]
    for uid, tid in write_map:
        try:
            admin.auth.admin.update_user_by_id(uid, {"app_metadata": {"tenant_id": tid}})
            print(f"  WRITTEN: user_id={uid} tenant_id={tid}")
        except Exception as e:
            print(f"  ERROR writing app_metadata for user {uid}: {e}")
            sys.exit(1)

    # -----------------------------------------------------------------------
    # Phase 7 — Verification: sign in as trial user, confirm token carries claim
    # Requires backend to be running at BACKEND_URL.
    # Skipped gracefully if backend is unreachable.
    # -----------------------------------------------------------------------
    phase_separator(7, "Verification — sign in and confirm claim in token")
    for num, email in [(1, USER_1_EMAIL), (2, USER_2_EMAIL)]:
        pw = passwords.get(num)
        if not pw:
            print(f"  SKIP user {num}: password not known (user pre-existed).")
            continue
        try:
            sign_res = admin.auth.sign_in_with_password({"email": email, "password": pw})
            token = sign_res.session.access_token if sign_res.session else None
            if not token:
                print(f"  ERROR: no token returned for {email}")
                continue
            import base64, json as _json
            parts = token.split(".")
            padded = parts[1] + "=" * (4 - len(parts[1]) % 4)
            claims = _json.loads(base64.urlsafe_b64decode(padded))
            tid_in_token = (claims.get("app_metadata") or {}).get("tenant_id")
            if tid_in_token:
                print(f"  PASS user {num} ({email}): tenant_id={tid_in_token} is in token")
            else:
                print(
                    f"  WARN user {num} ({email}): tenant_id absent from token."
                    " User must re-login after claim is written."
                )
        except Exception as e:
            print(f"  SKIP user {num}: {e}")

    # -----------------------------------------------------------------------
    # Summary
    # -----------------------------------------------------------------------
    print("\n" + "="*64)
    print("  SEED COMPLETE")
    print("="*64)
    print(f"  TRIAL-A: customer_account_id={seed_record['tenant_a_id']}")
    print(f"  TRIAL-B: customer_account_id={seed_record['tenant_b_id']}")
    print(f"  User 1 (→ A): auth_user_id={seed_record['user_1_id']}")
    print(f"  User 2 (→ B): auth_user_id={seed_record['user_2_id']}")
    print()
    print("  NEXT: Run TrialTenantTeardown__V1.0.py to confirm teardown works")
    print("  before relying on this seed data for verification tests.")
    print()
    print("  BOOTSTRAP GAP FINDING (recorded):")
    print("  /api/v1/auth/claim is unreachable by new users. It must be added")
    print("  to the public endpoint list with its own auth mechanism before")
    print("  the T2 test can be run end-to-end via HTTP.")


if __name__ == "__main__":
    run_seed()
