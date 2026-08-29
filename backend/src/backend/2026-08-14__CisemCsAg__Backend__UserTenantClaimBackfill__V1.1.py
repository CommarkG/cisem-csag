# =============================================================================
# File           : 2026-08-14__CisemCsAg__Backend__UserTenantClaimBackfill__V1.1.py
# Ratified plan  : CISEM-IP-20260814-SECURITY-HARDENING v1.0 (Task 3)
# Architectural  : Backfills app_metadata.tenant_id for all existing users
#                  who were created before claim-minting was in place.
#                  Reads from user_account_roles via Admin API (bypasses RLS).
#                  Merges into app_metadata; never replaces the whole object.
#                  Idempotent: skips users already carrying tenant_id.
#                  --dry-run flag prints plan without writing.
# Change from V1.0:
#   - ALREADY_SET and DATA_ERROR are no longer conflated under a single "skipped" counter.
#   - Added ORPHAN PHASE: after the main loop, lists all auth.users and reports
#     any user who has no row in user_account_roles as NO_MEMBERSHIP.
#     These users will 401 permanently and cannot be distinguished from an
#     invalid token at the client. They must be investigated and resolved.
#   - Summary line now shows:
#     Written / AlreadySet / DataErrors / NoMembership / Errors
# Axioms         : AX-SECURITY-01, AX-ENV-01 (AGENTS.md ss15/16)
# Safety         : Requires SUPABASE_KEY (service-role class). Never reads user_metadata.
#                  app_metadata is the sole authoritative claim field.
# History:
#   2026-08-14 V1.0 - Initial build. Single "skipped" counter.
#   2026-08-14 V1.1 - Split skipped into ALREADY_SET + DATA_ERROR.
#                     Added ORPHAN PHASE to detect NO_MEMBERSHIP users.
# =============================================================================
import argparse
import os
import sys
import httpx
from dotenv import load_dotenv
from supabase import create_client, Client
from supabase.lib.client_options import SyncClientOptions

# Load environment variables from .env.local, .env, and secure directory files
backend_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(os.path.dirname(backend_dir))
load_dotenv(os.path.join(root_dir, ".env.local"))
load_dotenv(os.path.join(root_dir, ".env"))
load_dotenv(os.path.join(backend_dir, ".env"))
load_dotenv(r"C:\Users\finky\secure\.env")
load_dotenv(os.path.expanduser("~\\.env"))
load_dotenv()


def build_admin_client() -> Client:
    url = os.environ.get("SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_KEY")

    if not url or "your-project" in url or "your-actual" in url:
        print("[FAIL CLOSED]: SUPABASE_URL environment variable is missing or placeholder. Provide valid URL via shell or .env file.")
        sys.exit(1)

    if not service_key or "your-service" in service_key:
        print("[FAIL CLOSED]: SUPABASE_SERVICE_ROLE_KEY environment variable is missing or placeholder. Provide valid Key via shell or .env file.")
        sys.exit(1)

    http_client = httpx.Client(verify=False)
    opts = SyncClientOptions(httpx_client=http_client)
    return create_client(url, service_key, options=opts)


def run_backfill(dry_run: bool) -> None:
    admin = build_admin_client()
    prefix = "[DRY RUN] " if dry_run else ""
    print(f"{prefix}Starting tenant claim backfill...")

    page_size                   = 1000
    offset                      = 0
    total_written               = 0
    total_already_set           = 0
    total_skipped_no_auth       = 0
    total_data_errors           = 0
    total_errors                = 0

    # All user_ids that appear in user_account_roles — used for orphan detection.
    membership_user_ids: set = set()

    # -----------------------------------------------------------------------
    # PHASE 1 — Main backfill loop across user_account_roles
    # -----------------------------------------------------------------------
    print(f"\n{prefix}[PHASE 1] Reading user_account_roles and writing claims...")
    # Fetch all user_account_roles rows and group by user_id
    user_memberships: dict = {} # user_id -> list of customer_account_id
    while True:
        res = admin.table("user_account_roles") \
            .select("user_id, customer_account_id") \
            .range(offset, offset + page_size - 1) \
            .execute()
        rows = res.data or []
        if not rows:
            break
        for row in rows:
            uid = row.get("user_id")
            cid = row.get("customer_account_id")
            if not uid or not cid:
                print(f"  DATA_ERROR (missing fields): row={row}")
                total_data_errors += 1
                continue
            membership_user_ids.add(uid)
            if uid not in user_memberships:
                user_memberships[uid] = []
            if cid not in user_memberships[uid]:
                user_memberships[uid].append(cid)

        offset += page_size
        if len(rows) < page_size:
            break

    # Process each user derived directly from user_account_roles
    for user_id, roles in user_memberships.items():
        if not roles:
            print(f"  SKIPPED (no role row): user_id={user_id}")
            continue

        primary_tenant_id = roles[0] # Deterministic selection: first role row in user_account_roles
        if len(roles) > 1:
            print(f"  MULTI_MEMBERSHIP NOTICE: user_id={user_id} has {len(roles)} roles {roles} -> selecting primary_tenant_id={primary_tenant_id}")

        try:
            user_res = admin.auth.admin.get_user_by_id(user_id)
            if not user_res or not user_res.user:
                print(f"  SKIPPED_NO_AUTH_ACCOUNT: user_id={user_id} (seeded in user_account_roles, no auth account created yet)")
                total_skipped_no_auth += 1
                continue
            current_app_metadata = user_res.user.app_metadata or {}
        except Exception as e:
            err_msg = str(e).lower()
            if "not found" in err_msg or "404" in err_msg or "user_not_found" in err_msg:
                print(f"  SKIPPED_NO_AUTH_ACCOUNT: user_id={user_id} (seeded in user_account_roles, no auth account created yet)")
                total_skipped_no_auth += 1
            else:
                print(f"  ERROR fetching user {user_id}: {e}")
                total_errors += 1
            continue

        existing_active = current_app_metadata.get("active_tenant_id")
        existing_legacy = current_app_metadata.get("tenant_id")

        # Strict Role Check: Ensure existing_active is in valid memberships for this user
        if existing_active in roles and existing_legacy is None:
            print(f"  ALREADY_SET: user_id={user_id} active_tenant_id={existing_active} (verified in user_account_roles, legacy tenant_id absent)")
            total_already_set += 1
            continue

        if existing_legacy is not None:
            print(
                f"  MIGRATING LEGACY CLAIM: user_id={user_id} "
                f"removing legacy tenant_id={existing_legacy} -> setting active_tenant_id={primary_tenant_id}"
            )
        elif existing_active and existing_active not in roles:
            print(
                f"  WARNING (INVALID ROLE CLAIM OVERWRITE): user_id={user_id} "
                f"existing_active={existing_active} NOT IN ROLES {roles} -> resetting to primary_tenant_id={primary_tenant_id}"
            )

        target_active = primary_tenant_id if (existing_active not in roles) else existing_active
        new_app_metadata = {**current_app_metadata, "active_tenant_id": target_active, "tenant_id": None}

        if dry_run:
            print(f"  [DRY RUN] WOULD WRITE: user_id={user_id} active_tenant_id={target_active} tenant_id=None (explicit deletion)")
            total_written += 1
            continue
        try:
            admin.auth.admin.update_user_by_id(
                user_id,
                {"app_metadata": new_app_metadata},
            )
            # Post-Write Read-Back Verification (Verify Reality Before Claiming)
            verify_res = admin.auth.admin.get_user_by_id(user_id)
            verified_meta = (verify_res.user.app_metadata or {}) if (verify_res and verify_res.user) else {}
            v_active = verified_meta.get("active_tenant_id")
            v_legacy = verified_meta.get("tenant_id")

            if v_active == target_active and (v_legacy is None or v_legacy == ""):
                print(f"  WRITTEN & VERIFIED: user_id={user_id} active_tenant_id={v_active} (legacy tenant_id successfully deleted)")
                total_written += 1
            else:
                print(f"  [VERIFICATION FAILED]: user_id={user_id} expected active={target_active} (got {v_active}), legacy tenant_id remains {v_legacy}")
                total_errors += 1
        except Exception as e:
            print(f"  ERROR writing user {user_id}: {e}")
            total_errors += 1

    # -----------------------------------------------------------------------
    # PHASE 2 — Orphan detection: auth.users minus user_account_roles
    # Users with no membership row cannot receive a claim. They will 401
    # permanently on any request that requires tenant context.
    # -----------------------------------------------------------------------
    print(f"\n{prefix}[PHASE 2] Orphan detection — auth users with no membership row...")
    auth_page           = 1
    per_page            = 1000
    all_auth_ids: set   = set()
    orphan_check_failed = False

    while True:
        try:
            raw_users = admin.auth.admin.list_users(page=auth_page, per_page=per_page)
            if isinstance(raw_users, list):
                users_list = raw_users
            elif hasattr(raw_users, "users"):
                users_list = raw_users.users or []
            else:
                users_list = []

            if not users_list:
                break
            for u in users_list:
                uid = getattr(u, "id", None) or (u.get("id") if isinstance(u, dict) else None)
                if uid:
                    all_auth_ids.add(uid)
            if len(users_list) < per_page:
                break
            auth_page += 1
        except Exception as e:
            print(f"  [GATE FAILED] ERROR listing auth users (page {auth_page}): {e}")
            orphan_check_failed = True
            total_errors += 1
            break

    if orphan_check_failed:
        print("  [CANNOT VERIFY] Orphan detection failed due to API exception. DO NOT PROCEED.")
        total_no_membership = -1
    else:
        orphans = all_auth_ids - membership_user_ids
        total_no_membership = len(orphans)

        if orphans:
            print(
                f"  WARNING: {total_no_membership} auth user(s) have no row in "
                f"user_account_roles. They will 401 permanently on any tenant-scoped request."
            )
            for uid in sorted(orphans):
                print(f"  NO_MEMBERSHIP: user_id={uid}")
        else:
            print("  OK: all active auth users have at least one membership row.")

    # -----------------------------------------------------------------------
    # Summary
    # -----------------------------------------------------------------------
    print(
        f"\n{prefix}Backfill complete.\n"
        f"  Written={total_written}  AlreadySet={total_already_set}  "
        f"SkippedNoAuthAccount={total_skipped_no_auth}  DataErrors={total_data_errors}  "
        f"NoMembership={total_no_membership}  Errors={total_errors}"
    )

    if total_errors > 0 or orphan_check_failed:
        print("FAIL: Verification or write errors occurred. Check output above and resolve before proceeding.")
        sys.exit(1)
    if total_skipped_no_auth > 0:
        print(f"NOTICE: {total_skipped_no_auth} seeded membership rows have no auth account. Normal state until users sign up.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Backfill app_metadata.tenant_id for all existing users."
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print plan without making changes.",
    )
    args = parser.parse_args()
    run_backfill(dry_run=args.dry_run)
