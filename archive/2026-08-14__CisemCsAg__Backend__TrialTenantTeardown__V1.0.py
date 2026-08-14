# =============================================================================
# File           : 2026-08-14__CisemCsAg__Backend__TrialTenantTeardown__V1.0.py
# Ratified plan  : Consolidated Brief — Trial Tenants & Isolation Verification §4
# Architectural  : Removes all rows created by TrialTenantSeed__V1.0.py.
#                  Deletes in dependency order (FK children before parents).
#                  Identifies targets by hardcoded email and company_name
#                  markers — same constants as the seed script.
#                  Idempotent: safe to run if seed was partial or already torn down.
#
#                  Phases:
#                    1. Look up auth user IDs by email
#                    2. Delete user_account_roles rows (FK child of users + customer_accounts)
#                    3. Delete public.users rows (FK parent of user_account_roles)
#                    4. Delete auth users via admin API
#                    5. Delete customer_accounts rows
#                    6. Verify deletion
#
#                  Rule from §4 constraint 3: test this script before relying
#                  on the seed data. A fixture that cannot be removed becomes
#                  production data by default.
#
# Parent axioms  : AX-SECURITY-01, AX-ENV-01 (AGENTS.md ss15/16)
# Schema deps    : customer_accounts, users, user_account_roles, auth.users
# History:
#   2026-08-14 V1.0 - Created. MUST be tested before seed is relied upon.
# =============================================================================
"""
Trial Tenant Teardown — Removes all rows created by TrialTenantSeed__V1.0.py

PRECONDITIONS:
  - SUPABASE_URL and SUPABASE_KEY (service-role) in env

TARGETS (hardcoded to match seed constants):
  Emails  : trial-1@trial.invalid, trial-2@trial.invalid
  Tenants : company_name LIKE '%TRIAL-A%', '%TRIAL-B%'
"""
import os
import sys

import httpx
from supabase import create_client, Client
from supabase.lib.client_options import SyncClientOptions


# ---------------------------------------------------------------------------
# Constants — must match TrialTenantSeed__V1.0.py exactly
# ---------------------------------------------------------------------------
TENANT_A_NAME = "TRIAL-A Corp [SYNTHETIC — NOT A CUSTOMER]"
TENANT_B_NAME = "TRIAL-B Corp [SYNTHETIC — NOT A CUSTOMER]"
TRIAL_EMAILS  = ["trial-1@trial.invalid", "trial-2@trial.invalid"]


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


def run_teardown() -> None:  # noqa: PLR0912, PLR0915
    admin = build_admin_client()
    total_errors = 0

    # -----------------------------------------------------------------------
    # Phase 1 — Resolve auth user IDs from email
    # -----------------------------------------------------------------------
    phase_separator(1, "Resolve trial auth user IDs by email")
    auth_user_ids: list[str] = []
    try:
        list_res = admin.auth.admin.list_users()
        all_users = list_res.users if list_res else []
        for u in all_users:
            if u.email in TRIAL_EMAILS:
                auth_user_ids.append(u.id)
                print(f"  Found: {u.email} → {u.id}")
        if not auth_user_ids:
            print("  No trial auth users found — may already be torn down.")
    except Exception as e:
        print(f"  ERROR listing auth users: {e}")
        total_errors += 1

    # -----------------------------------------------------------------------
    # Phase 2 — Delete user_account_roles (FK child)
    # -----------------------------------------------------------------------
    phase_separator(2, "Delete user_account_roles rows")
    for uid in auth_user_ids:
        try:
            res = admin.table("user_account_roles").delete().eq("user_id", uid).execute()
            deleted = res.data or []
            print(f"  Deleted {len(deleted)} row(s) for user_id={uid}")
        except Exception as e:
            print(f"  ERROR deleting user_account_roles for {uid}: {e}")
            total_errors += 1

    # -----------------------------------------------------------------------
    # Phase 3 — Delete public.users rows
    # -----------------------------------------------------------------------
    phase_separator(3, "Delete public.users rows")
    for email in TRIAL_EMAILS:
        try:
            res = admin.table("users").delete().eq("email", email).execute()
            deleted = res.data or []
            print(f"  Deleted {len(deleted)} public.users row(s) for {email}")
        except Exception as e:
            print(f"  ERROR deleting public.users for {email}: {e}")
            total_errors += 1

    # -----------------------------------------------------------------------
    # Phase 4 — Delete auth users via admin API
    # -----------------------------------------------------------------------
    phase_separator(4, "Delete auth users")
    for uid in auth_user_ids:
        try:
            admin.auth.admin.delete_user(uid)
            print(f"  Deleted auth user: {uid}")
        except Exception as e:
            print(f"  ERROR deleting auth user {uid}: {e}")
            total_errors += 1

    # -----------------------------------------------------------------------
    # Phase 5 — Delete customer_accounts
    # -----------------------------------------------------------------------
    phase_separator(5, "Delete customer_accounts (TRIAL-A and TRIAL-B)")
    for name in [TENANT_A_NAME, TENANT_B_NAME]:
        try:
            res = admin.table("customer_accounts").delete().eq("company_name", name).execute()
            deleted = res.data or []
            print(f"  Deleted {len(deleted)} customer_accounts row(s): '{name}'")
        except Exception as e:
            print(f"  ERROR deleting customer_accounts '{name}': {e}")
            total_errors += 1

    # -----------------------------------------------------------------------
    # Phase 6 — Verification: confirm nothing remains
    # -----------------------------------------------------------------------
    phase_separator(6, "Verification — confirm teardown is clean")
    clean = True

    # Check auth users
    try:
        list_res = admin.auth.admin.list_users()
        remaining_auth = [u for u in (list_res.users or []) if u.email in TRIAL_EMAILS]
        if remaining_auth:
            print(f"  WARN: {len(remaining_auth)} auth user(s) still present:")
            for u in remaining_auth:
                print(f"    {u.email} ({u.id})")
            clean = False
        else:
            print("  OK: no trial auth users remain.")
    except Exception as e:
        print(f"  ERROR verifying auth users: {e}")
        clean = False

    # Check public.users
    try:
        res = admin.table("users").select("id,email").in_("email", TRIAL_EMAILS).execute()
        remaining_pub = res.data or []
        if remaining_pub:
            print(f"  WARN: {len(remaining_pub)} public.users row(s) still present: {remaining_pub}")
            clean = False
        else:
            print("  OK: no trial public.users rows remain.")
    except Exception as e:
        print(f"  ERROR verifying public.users: {e}")
        clean = False

    # Check customer_accounts
    for name in [TENANT_A_NAME, TENANT_B_NAME]:
        try:
            res = admin.table("customer_accounts").select("id").eq("company_name", name).execute()
            if res.data:
                print(f"  WARN: customer_account still present: '{name}'")
                clean = False
            else:
                print(f"  OK: customer_account absent: '{name}'")
        except Exception as e:
            print(f"  ERROR verifying customer_accounts: {e}")
            clean = False

    # -----------------------------------------------------------------------
    # Summary
    # -----------------------------------------------------------------------
    print("\n" + "="*64)
    if total_errors == 0 and clean:
        print("  TEARDOWN COMPLETE — workspace is clean. Safe to re-seed.")
    elif total_errors == 0 and not clean:
        print("  TEARDOWN PARTIAL — some rows remain (see WARNs above).")
    else:
        print(f"  TEARDOWN ERRORS — {total_errors} error(s). Review output above.")
    print("="*64)


if __name__ == "__main__":
    run_teardown()
