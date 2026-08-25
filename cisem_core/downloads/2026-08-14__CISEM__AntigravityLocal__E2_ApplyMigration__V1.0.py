#!/usr/bin/env python3
# =============================================================================
# Ratified plan   : E-2 Applied-Migration Ledger (Governor ratified 2026-08-14)
# Architectural   : Written and applied are not the same act. A ledger row is
#                   written by the act of applying, never by the act of intending.
#                   Any claim that "migration N was applied" requires a ledger row.
# Parent axioms   : U1.2.48 (premise tested at entry, not at consequence)
#                   U1.2.43 (deliberate idempotency guard)
# =============================================================================
"""
E-2 Applied-Migration Ledger — apply_migration.py

Modes:
  <file.sql>          Apply migration: compute checksum, apply, write ledger row
  --assert <file>     Assert a migration was applied; raise if no ledger row
  --list              List all ledger entries
  --test              Known-bad input test (no DB required)
  --bootstrap-sql     Print the SQL to create _migration_ledger (Governor runs this)

The live ledger uses Supabase. Tests use a JSON fixture file.
"""

import hashlib
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

# Paths
HERE = Path(__file__).parent
FIXTURE_LEDGER = HERE / "_test_ledger_fixture.json"

# Bootstrap SQL — Governor runs this once in Supabase SQL editor
BOOTSTRAP_SQL = """
-- =============================================================================
-- E-2 Bootstrap: Applied-Migration Ledger
-- Run once in Supabase SQL editor.
-- This table is written by apply_migration.py, never by a human intent record.
-- =============================================================================
CREATE TABLE IF NOT EXISTS _migration_ledger (
    filename   TEXT PRIMARY KEY,
    checksum   TEXT NOT NULL,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ledger is infrastructure — no RLS, service_role only.
ALTER TABLE _migration_ledger DISABLE ROW LEVEL SECURITY;
REVOKE ALL ON _migration_ledger FROM PUBLIC;
GRANT ALL ON _migration_ledger TO service_role;
"""


# ---------------------------------------------------------------------------
# CHECKSUM
# ---------------------------------------------------------------------------

def compute_checksum(filepath: Path) -> str:
    with open(filepath, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()


# ---------------------------------------------------------------------------
# FIXTURE LEDGER  (used for tests — no DB required)
# ---------------------------------------------------------------------------

def load_fixture(path: Path = FIXTURE_LEDGER) -> dict:
    if not path.exists():
        return {}
    with open(path) as f:
        return json.load(f)


def save_fixture(ledger: dict, path: Path = FIXTURE_LEDGER) -> None:
    with open(path, "w") as f:
        json.dump(ledger, f, indent=2)


def fixture_has_entry(filename: str, path: Path = FIXTURE_LEDGER) -> bool:
    return filename in load_fixture(path)


def fixture_add_entry(filename: str, checksum: str, path: Path = FIXTURE_LEDGER) -> None:
    ledger = load_fixture(path)
    ledger[filename] = {
        "checksum": checksum,
        "applied_at": datetime.now(timezone.utc).isoformat(),
    }
    save_fixture(ledger, path)


# ---------------------------------------------------------------------------
# ASSERTION GATE
# ---------------------------------------------------------------------------

def assert_applied_fixture(filename: str, path: Path = FIXTURE_LEDGER) -> None:
    """
    Assert a migration appears in the ledger.
    Raises AssertionError (LEDGER_ABSENT) if no row found.
    This is the gate: no plan may cite a migration as a dependency
    unless this check passes.
    """
    if not fixture_has_entry(filename, path):
        raise AssertionError(
            f"LEDGER_ABSENT: '{filename}' has no entry in the applied-migration ledger. "
            f"'Written' and 'applied' are not the same act."
        )


# ---------------------------------------------------------------------------
# LIVE LEDGER  (Supabase — used in production)
# ---------------------------------------------------------------------------

def assert_applied_live(filename: str, supabase_client) -> None:
    res = (
        supabase_client
        .table("_migration_ledger")
        .select("filename")
        .eq("filename", filename)
        .execute()
    )
    if not res.data:
        raise AssertionError(
            f"LEDGER_ABSENT: '{filename}' has no entry in _migration_ledger. "
            f"Migration may have been written but not applied."
        )


def apply_migration_live(filepath: Path, supabase_client) -> None:
    filename = filepath.name
    checksum = compute_checksum(filepath)

    # Idempotency guard — deliberate, not coincidental
    res = (
        supabase_client
        .table("_migration_ledger")
        .select("filename, checksum")
        .eq("filename", filename)
        .execute()
    )
    if res.data:
        existing = res.data[0]
        if existing["checksum"] == checksum:
            print(f"SKIP: {filename} already applied with matching checksum.")
            return
        else:
            raise AssertionError(
                f"LEDGER_CONFLICT: {filename} applied with different checksum. "
                f"Existing: {existing['checksum'][:12]}… New: {checksum[:12]}… "
                f"This is not a safe re-apply."
            )

    sql_text = filepath.read_text(encoding="utf-8-sig")
    # Apply via supabase rpc (requires a helper function in DB) or direct psycopg2
    # In current setup: print SQL for Governor to apply, then record in ledger
    # when Governor confirms. Full automation requires direct DB connection.
    print(f"--- SQL to apply ({filename}) ---")
    print(sql_text)
    print(f"--- End SQL ---")
    print(
        f"\nAfter applying the above SQL, run this to record in ledger:\n"
        f"INSERT INTO _migration_ledger (filename, checksum) "
        f"VALUES ('{filename}', '{checksum}');"
    )


# ---------------------------------------------------------------------------
# KNOWN-BAD INPUT TEST  (P8 — must fail on known-bad input before it counts)
# ---------------------------------------------------------------------------

def run_test() -> bool:
    """
    Known-bad input: assert migration_38 was applied against an empty ledger.
    Expected: AssertionError with LEDGER_ABSENT.
    """
    print("=== E-2 Known-Bad Input Test ===\n")

    test_fixture = HERE / "_e2_test_empty_ledger.json"

    # --- Test 1: empty ledger → assert rejects ---
    with open(test_fixture, "w") as f:
        json.dump({}, f)

    try:
        assert_applied_fixture(
            "2026-08-14__CISEM__Migration38__PendingClaims__V1.0.sql",
            path=test_fixture,
        )
        print("FAIL T1: Should have raised LEDGER_ABSENT for unapplied migration 38")
        test_fixture.unlink()
        return False
    except AssertionError as e:
        assert "LEDGER_ABSENT" in str(e), f"FAIL T1: Wrong error message: {e}"
        print(f"PASS T1 REJECTED (empty ledger): {e}")

    # --- Test 2: add migration 38 → assert accepts ---
    fixture_add_entry(
        "2026-08-14__CISEM__Migration38__PendingClaims__V1.0.sql",
        checksum="abc123_fixture",
        path=test_fixture,
    )
    try:
        assert_applied_fixture(
            "2026-08-14__CISEM__Migration38__PendingClaims__V1.0.sql",
            path=test_fixture,
        )
        print("PASS T2 ACCEPTED (ledger has migration 38 entry)")
    except AssertionError as e:
        print(f"FAIL T2: Should have accepted after adding entry. Got: {e}")
        test_fixture.unlink()
        return False

    # --- Test 3: different migration name still rejected ---
    try:
        assert_applied_fixture(
            "2026-08-14__CISEM__Migration39__Provisioning__V1.0.sql",
            path=test_fixture,
        )
        print("FAIL T3: Migration 39 should still be absent")
        test_fixture.unlink()
        return False
    except AssertionError as e:
        assert "LEDGER_ABSENT" in str(e), f"FAIL T3: Wrong error: {e}"
        print(f"PASS T3 REJECTED (migration 39 absent from ledger): {e}")

    test_fixture.unlink()
    print("\n=== E-2 Known-Bad Test: ALL PASSED ===")
    return True


# ---------------------------------------------------------------------------
# MAIN
# ---------------------------------------------------------------------------

def main() -> None:
    args = sys.argv[1:]

    if "--test" in args:
        success = run_test()
        sys.exit(0 if success else 1)

    if "--bootstrap-sql" in args:
        print(BOOTSTRAP_SQL)
        return

    if "--assert" in args:
        idx = args.index("--assert")
        if idx + 1 >= len(args):
            print("Usage: apply_migration.py --assert <filename>")
            sys.exit(1)
        filename = args[idx + 1]
        # Live mode requires Supabase client — not implemented in CLI yet
        # Test mode for now
        try:
            assert_applied_fixture(filename)
            print(f"LEDGER_OK: {filename} is recorded as applied.")
        except AssertionError as e:
            print(f"GATE_FAIL: {e}")
            sys.exit(1)
        return

    if "--list" in args:
        ledger = load_fixture()
        if not ledger:
            print("Ledger is empty (fixture mode).")
        else:
            for fname, entry in sorted(ledger.items()):
                print(f"  {fname}  checksum={entry['checksum'][:12]}…  applied_at={entry['applied_at']}")
        return

    if args and not args[0].startswith("--"):
        filepath = Path(args[0])
        if not filepath.exists():
            print(f"ERROR: {filepath} not found.")
            sys.exit(1)
        # Live apply (prints SQL + ledger INSERT for Governor)
        apply_migration_live(filepath, supabase_client=None)
        return

    print(__doc__)


if __name__ == "__main__":
    main()
