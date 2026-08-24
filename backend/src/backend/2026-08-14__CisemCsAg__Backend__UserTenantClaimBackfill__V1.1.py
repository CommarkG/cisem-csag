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
from supabase import create_client, Client
from supabase.lib.client_options import SyncClientOptions


def build_admin_client() -> Client:
    url = os.environ.get("SUPABASE_URL")
    service_key = os.environ.get("SUPABASE_KEY")
    if not url or not service_key:
        print("ERROR: SUPABASE_URL and SUPABASE_KEY must be set as environment variables.")
        sys.exit(1)
    http_client = httpx.Client(verify=False)
    opts = SyncClientOptions(httpx_client=http_client)
    return create_client(url, service_key, options=opts)


def run_backfill(dry_run: bool) -> None:
    admin = build_admin_client()
    prefix = "[DRY RUN] " if dry_run else ""
    print(f"{prefix}Starting tenant claim backfill...")

    page_size    = 1000
    offset       = 0
    total_written     = 0
    total_already_set = 0
    total_data_errors = 0
    total_errors      = 0

    # All user_ids that appear in user_account_roles — used for orphan detection.
    membership_user_ids: set = set()

    # -----------------------------------------------------------------------
    # PHASE 1 — Main backfill loop across user_account_roles
    # -----------------------------------------------------------------------
    print(f"\n{prefix}[PHASE 1] Reading user_account_roles and writing claims...")
    while True:
        res = admin.table("user_account_roles") \
            .select("user_id, customer_account_id") \
            .range(offset, offset + page_size - 1) \
            .execute()
        rows = res.data or []
        if not rows:
            break
        for row in rows:
            user_id   = row.get("user_id")
            tenant_id = row.get("customer_account_id")
            if not user_id or not tenant_id:
                print(f"  DATA_ERROR (missing fields): row={row}")
                total_data_errors += 1
                continue

            membership_user_ids.add(user_id)

            try:
                user_res = admin.auth.admin.get_user_by_id(user_id)
                current_app_metadata = (
                    user_res.user.app_metadata or {}
                ) if user_res.user else {}
            except Exception as e:
                print(f"  ERROR fetching user {user_id}: {e}")
                total_errors += 1
                continue

            existing = current_app_metadata.get("tenant_id")
            if existing == tenant_id:
                print(f"  ALREADY_SET: user_id={user_id} tenant_id={tenant_id}")
                total_already_set += 1
                continue
            if existing and existing != tenant_id:
                print(
                    f"  WARNING (mismatch): user_id={user_id} "
                    f"existing={existing} new={tenant_id} -- will overwrite"
                )
            if dry_run:
                print(f"  [DRY RUN] WOULD WRITE: user_id={user_id} tenant_id={tenant_id}")
                total_written += 1
                continue
            try:
                admin.auth.admin.update_user_by_id(
                    user_id,
                    {"app_metadata": {**current_app_metadata, "active_tenant_id": tenant_id, "tenant_id": tenant_id}},
                )
                print(f"  WRITTEN: user_id={user_id} tenant_id={tenant_id}")
                total_written += 1
            except Exception as e:
                print(f"  ERROR writing user {user_id}: {e}")
                total_errors += 1

        offset += page_size
        if len(rows) < page_size:
            break

    # -----------------------------------------------------------------------
    # PHASE 2 — Orphan detection: auth.users minus user_account_roles
    # Users with no membership row cannot receive a claim. They will 401
    # permanently on any request that requires tenant context. This is
    # indistinguishable from an expired or invalid token at the client.
    # -----------------------------------------------------------------------
    print(f"\n{prefix}[PHASE 2] Orphan detection — auth users with no membership row...")
    auth_page    = 1
    per_page     = 1000
    all_auth_ids: set = set()

    while True:
        try:
            list_res = admin.auth.admin.list_users(page=auth_page, per_page=per_page)
            if not list_res or not list_res.users:
                break
            for u in list_res.users:
                all_auth_ids.add(u.id)
            if len(list_res.users) < per_page:
                break
            auth_page += 1
        except Exception as e:
            print(f"  ERROR listing auth users (page {auth_page}): {e}")
            break

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
        print("  OK: all auth users have at least one membership row.")

    # -----------------------------------------------------------------------
    # Summary
    # -----------------------------------------------------------------------
    print(
        f"\n{prefix}Backfill complete.\n"
        f"  Written={total_written}  AlreadySet={total_already_set}  "
        f"DataErrors={total_data_errors}  NoMembership={total_no_membership}  "
        f"Errors={total_errors}"
    )

    if total_errors > 0:
        print("WARNING: Some users failed. Check output above and re-run after fixing.")
        sys.exit(1)
    if total_no_membership > 0:
        print(
            "NOTICE: NO_MEMBERSHIP users listed above will 401 permanently. "
            "Investigate and provision membership rows before they log in."
        )


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
