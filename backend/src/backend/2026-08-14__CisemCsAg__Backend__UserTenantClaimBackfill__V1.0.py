# =============================================================================
# CISEM Mandatory Code Header
# Full Filename  : 2026-08-14__CisemCsAg__Backend__UserTenantClaimBackfill__V1.0.py
# Active Version : V1.0
# Ratified Plan  : CISEM-IP-20260814-SECURITY-HARDENING v1.0 (Task 3)
# Architectural  : Backfills app_metadata.tenant_id for all existing users
#                  who were created before claim-minting was in place.
#                  Reads from user_account_roles via Admin API (bypasses RLS).
#                  Merges into app_metadata; never replaces the whole object.
#                  Idempotent: skips users already carrying tenant_id.
#                  --dry-run flag prints plan without writing.
# Axioms         : AX-SECURITY-01, AX-ENV-01 (AGENTS.md ss15/16)
# Safety         : Requires SUPABASE_KEY (service-role class). Never reads user_metadata.
#                  app_metadata is the sole authoritative claim field.
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
    print(f"{'[DRY RUN] ' if dry_run else ''}Starting tenant claim backfill...")
    page_size = 1000
    offset = 0
    total_processed = 0
    total_skipped = 0
    total_written = 0
    total_errors = 0

    while True:
        res = admin.table("user_account_roles") \
            .select("user_id, customer_account_id") \
            .range(offset, offset + page_size - 1) \
            .execute()
        rows = res.data or []
        if not rows:
            break
        for row in rows:
            user_id = row.get("user_id")
            tenant_id = row.get("customer_account_id")
            if not user_id or not tenant_id:
                print(f"  SKIP (missing fields): row={row}")
                total_skipped += 1
                continue
            total_processed += 1
            try:
                user_res = admin.auth.admin.get_user_by_id(user_id)
                current_app_metadata = (user_res.user.app_metadata or {}) if user_res.user else {}
            except Exception as e:
                print(f"  ERROR fetching user {user_id}: {e}")
                total_errors += 1
                continue
            existing = current_app_metadata.get("tenant_id")
            if existing == tenant_id:
                print(f"  SKIP (already set): user_id={user_id} tenant_id={tenant_id}")
                total_skipped += 1
                continue
            if existing and existing != tenant_id:
                print(f"  WARNING (mismatch): user_id={user_id} existing={existing} new={tenant_id} -- will overwrite")
            if dry_run:
                print(f"  [DRY RUN] WOULD WRITE: user_id={user_id} tenant_id={tenant_id}")
                total_written += 1
                continue
            try:
                admin.auth.admin.update_user_by_id(
                    user_id,
                    {"app_metadata": {**current_app_metadata, "tenant_id": tenant_id}}
                )
                print(f"  WRITTEN: user_id={user_id} tenant_id={tenant_id}")
                total_written += 1
            except Exception as e:
                print(f"  ERROR writing user {user_id}: {e}")
                total_errors += 1
        offset += page_size
        if len(rows) < page_size:
            break

    print(f"\n{'[DRY RUN] ' if dry_run else ''}Backfill complete. Processed={total_processed} Written={total_written} Skipped={total_skipped} Errors={total_errors}")
    if total_errors > 0:
        print("WARNING: Some users failed. Check output above and re-run after fixing.")
        sys.exit(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Backfill app_metadata.tenant_id for all existing users.")
    parser.add_argument("--dry-run", action="store_true", help="Print plan without making changes.")
    args = parser.parse_args()
    run_backfill(dry_run=args.dry_run)
