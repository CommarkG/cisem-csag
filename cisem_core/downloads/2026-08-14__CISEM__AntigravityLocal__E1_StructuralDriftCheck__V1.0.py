#!/usr/bin/env python3
# =============================================================================
# Ratified plan   : E-1 Structural Drift Check (Governor ratified 2026-08-14)
# Architectural   : information_schema is the source of truth. migrations.sql
#                   is a claim that gets checked. Snapshot is the deliverable.
#                   Comparison to migrations.sql is advisory — Step 3, not Step 1.
# Parent axioms   : U3.2.09a (structure is drift-checked, not only access rules)
#                   U3.2.09b (running system is source of truth; repo SQL is history)
#                   U1.2.48 (premise tested at entry, not at consequence)
# =============================================================================
"""
E-1 Structural Drift Check

Three steps:
  Step 1 -- emit_sql / load_snapshot  : live schema → schema_snapshot.json
  Step 2 -- snapshot_drift            : current snapshot vs previous snapshot
  Step 3 -- three_class_report        : snapshot vs migrations.sql (advisory)

Usage:
  --emit-sql     Print the SQL to run in Supabase SQL editor to produce snapshot
  --report       Load schema_snapshot.json and run three-class advisory report
  --drift        Compare schema_snapshot.json to schema_snapshot_prev.json
  --test         Run known-bad input tests (no DB required)
"""

import json
import re
import sys
from pathlib import Path
from datetime import datetime, timezone

# Paths
HERE = Path(__file__).parent
SNAPSHOT_PATH = HERE / "schema_snapshot.json"
PREV_SNAPSHOT_PATH = HERE / "schema_snapshot_prev.json"
MIGRATIONS_PATH = (
    HERE.parent.parent / "backend" / "src" / "backend" / "migrations.sql"
)
REPORT_PATH = HERE / "schema_drift_report.json"

# SQL to run in Supabase SQL editor (Governor pastes result as schema_snapshot.json)
EMIT_SQL = """
-- E-1 Step 1: Emit live schema snapshot.
-- Run in Supabase SQL editor. Copy the JSON value from the 'snapshot' column.
-- Save as: cisem_core/platform_core/schema_snapshot.json

SELECT json_agg(
    json_build_object(
        'table_name',              c.table_name,
        'column_name',             c.column_name,
        'data_type',               c.data_type,
        'udt_name',                c.udt_name,
        'is_nullable',             c.is_nullable,
        'column_default',          c.column_default,
        'character_maximum_length',c.character_maximum_length,
        'ordinal_position',        c.ordinal_position
    ) ORDER BY c.table_name, c.ordinal_position
) AS snapshot
FROM information_schema.columns c
WHERE c.table_schema = 'public';
"""


# ---------------------------------------------------------------------------
# SNAPSHOT LOADING
# ---------------------------------------------------------------------------

def load_snapshot(path: Path) -> dict:
    """Load a snapshot JSON file into dict: table_name → {column_name → info}."""
    with open(path) as f:
        raw = json.load(f)
    # raw may be a list (from SQL json_agg) or already a dict
    if isinstance(raw, dict) and "snapshot" in raw:
        raw = raw["snapshot"]
    result: dict = {}
    for col in raw:
        tbl = col["table_name"]
        if tbl not in result:
            result[tbl] = {}
        result[tbl][col["column_name"]] = col
    return result


# ---------------------------------------------------------------------------
# MIGRATIONS.SQL PARSER  (advisory reference — not source of truth)
# ---------------------------------------------------------------------------

def parse_migrations_tables(migrations_path: Path) -> dict:
    """
    Parse CREATE TABLE statements from migrations.sql.
    Returns dict: table_name → {column_name → info}.
    This is used for the advisory comparison only (Step 3).
    It is NOT the source of truth.
    """
    with open(migrations_path, encoding="utf-8-sig") as f:
        sql = f.read()

    tables: dict = {}
    # Match CREATE TABLE IF NOT EXISTS <name> ( ... );
    block_pattern = re.compile(
        r"CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+(\w+)\s*\((.+?)\);",
        re.IGNORECASE | re.DOTALL,
    )
    for match in block_pattern.finditer(sql):
        table_name = match.group(1).lower()
        body = match.group(2)
        columns: dict = {}

        for raw_line in body.splitlines():
            line = raw_line.strip().rstrip(",")
            # Skip blank lines, comments, and constraint clauses
            if not line:
                continue
            if line.startswith("--"):
                continue
            upper = line.upper()
            if any(
                upper.startswith(kw)
                for kw in (
                    "UNIQUE", "PRIMARY", "CONSTRAINT", "CHECK",
                    "FOREIGN", "EXCLUDE",
                )
            ):
                continue

            parts = line.split()
            if len(parts) < 2:
                continue

            col_name = parts[0].lower()
            col_type = parts[1].upper()
            is_nullable = "NO" if "NOT NULL" in upper else "YES"
            columns[col_name] = {
                "column_name": col_name,
                "data_type": col_type,
                "is_nullable": is_nullable,
            }

        tables[table_name] = columns

    return tables


# ---------------------------------------------------------------------------
# STEP 3: THREE-CLASS ADVISORY REPORT
# ---------------------------------------------------------------------------

def three_class_report(live: dict, reference: dict) -> dict:
    """
    Advisory comparison: live snapshot vs reference (migrations.sql or fixture).
    Returns {untracked, phantom, divergent}.

    untracked — live tables not in reference
    phantom   — reference tables not in live
    divergent — in both, but column-level differences
    """
    live_tables = set(live.keys())
    ref_tables = set(reference.keys())

    untracked = []
    phantom = []
    divergent = []

    for table in sorted(live_tables - ref_tables):
        untracked.append({
            "table": table,
            "live_columns": sorted(live[table].keys()),
            "note": "exists live, no CREATE TABLE in reference",
        })

    for table in sorted(ref_tables - live_tables):
        phantom.append({
            "table": table,
            "reference_columns": sorted(reference[table].keys()),
            "note": "in reference, does not exist live",
        })

    for table in sorted(live_tables & ref_tables):
        live_cols = set(live[table].keys())
        ref_cols = set(reference[table].keys())
        diffs = []

        for col in sorted(live_cols - ref_cols):
            diffs.append(f"column '{col}': in live, not in reference")
        for col in sorted(ref_cols - live_cols):
            diffs.append(f"column '{col}': in reference, not in live")
        for col in sorted(live_cols & ref_cols):
            l_null = live[table][col].get("is_nullable", "")
            r_null = reference[table][col].get("is_nullable", "")
            if l_null and r_null and l_null != r_null:
                diffs.append(
                    f"column '{col}': nullability live={l_null} reference={r_null}"
                )

        if diffs:
            divergent.append({"table": table, "differences": diffs})

    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "untracked": untracked,
        "phantom": phantom,
        "divergent": divergent,
    }


# ---------------------------------------------------------------------------
# STEP 2: SNAPSHOT DRIFT (snapshot vs previous snapshot)
# ---------------------------------------------------------------------------

def snapshot_drift(old: dict, new: dict) -> dict:
    """Compare two snapshots. Returns tables added, removed, and column changes."""
    old_tables = set(old.keys())
    new_tables = set(new.keys())

    column_changes = []
    for table in sorted(old_tables & new_tables):
        old_cols = set(old[table].keys())
        new_cols = set(new[table].keys())
        added = sorted(new_cols - old_cols)
        removed = sorted(old_cols - new_cols)
        if added or removed:
            column_changes.append({
                "table": table,
                "added_columns": added,
                "removed_columns": removed,
            })

    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "added_tables": sorted(new_tables - old_tables),
        "removed_tables": sorted(old_tables - new_tables),
        "column_changes": column_changes,
    }


# ---------------------------------------------------------------------------
# KNOWN-BAD INPUT TEST  (P8 — must fail on a known-bad input before it counts)
# ---------------------------------------------------------------------------

def run_test() -> bool:
    """
    Self-contained test requiring no DB access.
    Tests the three_class_report() logic against fixture data.

    Known-bad inputs:
      1. Inject phantom table → confirm reported → remove → confirm clean
      2. Inject column divergence → confirm reported
    """
    print("=== E-1 Known-Bad Input Test ===\n")

    # Fixture: what the live DB actually looks like (based on Governor query results)
    live: dict = {
        "users": {
            "id":    {"column_name": "id",    "data_type": "uuid",               "is_nullable": "NO"},
            "email": {"column_name": "email", "data_type": "character varying",   "is_nullable": "NO"},
            "role":  {"column_name": "role",  "data_type": "USER-DEFINED",        "is_nullable": "NO"},
            # full_name already nullable live
            "full_name": {"column_name": "full_name", "data_type": "character varying", "is_nullable": "YES"},
            "is_active": {"column_name": "is_active", "data_type": "boolean",          "is_nullable": "NO"},
        },
        "customer_accounts": {
            "id":           {"column_name": "id",           "data_type": "uuid",             "is_nullable": "NO"},
            "company_name": {"column_name": "company_name", "data_type": "character varying", "is_nullable": "YES"},
        },
    }

    # Reference: what migrations.sql claims (includes phantoms and divergent columns)
    reference: dict = {
        "users": {
            "id":            {"column_name": "id",            "data_type": "UUID",                "is_nullable": "NO"},
            "email":         {"column_name": "email",         "data_type": "VARCHAR",             "is_nullable": "NO"},
            "full_name":     {"column_name": "full_name",     "data_type": "VARCHAR",             "is_nullable": "NO"},  # divergent: live is nullable
            "password_hash": {"column_name": "password_hash", "data_type": "VARCHAR",             "is_nullable": "NO"},  # phantom column
            "is_active":     {"column_name": "is_active",     "data_type": "BOOLEAN",             "is_nullable": "NO"},
        },
        "customer_accounts": {
            "id":           {"column_name": "id",           "data_type": "UUID",    "is_nullable": "NO"},
            "company_name": {"column_name": "company_name", "data_type": "VARCHAR", "is_nullable": "YES"},
        },
        "pending_claims": {  # PHANTOM TABLE: in migrations.sql, not in live
            "id":     {"column_name": "id",     "data_type": "UUID", "is_nullable": "NO"},
            "status": {"column_name": "status", "data_type": "VARCHAR", "is_nullable": "NO"},
        },
    }

    report = three_class_report(live, reference)

    # --- Test 1: phantom table detected ---
    phantom_names = [p["table"] for p in report["phantom"]]
    assert "pending_claims" in phantom_names, (
        f"FAIL T1: pending_claims not in phantom. Got: {phantom_names}"
    )
    print(f"PASS T1 PHANTOM detected: {phantom_names}")

    # --- Test 2: untracked column (users.role lives but not in reference) ---
    users_divergent = next(
        (d for d in report["divergent"] if d["table"] == "users"), None
    )
    assert users_divergent is not None, "FAIL T2: users not in divergent list"
    diffs = users_divergent["differences"]
    assert any("password_hash" in d and "not in live" in d for d in diffs), (
        f"FAIL T2: password_hash not flagged as reference-only. Got: {diffs}"
    )
    assert any("role" in d and "not in reference" in d for d in diffs), (
        f"FAIL T2: role not flagged as live-only. Got: {diffs}"
    )
    assert any("full_name" in d and "nullability" in d for d in diffs), (
        f"FAIL T2: full_name nullability divergence not detected. Got: {diffs}"
    )
    print(f"PASS T2 DIVERGENT for users: {diffs}")

    # --- Test 3: remove phantom → confirm clean ---
    del reference["pending_claims"]
    report_clean = three_class_report(live, reference)
    phantom_clean = [p["table"] for p in report_clean["phantom"]]
    assert "pending_claims" not in phantom_clean, (
        f"FAIL T3: pending_claims still in phantom after removal. Got: {phantom_clean}"
    )
    print("PASS T3 PHANTOM removed: pending_claims no longer reported")

    print("\n=== E-1 Known-Bad Test: ALL PASSED ===")
    return True


# ---------------------------------------------------------------------------
# REPORT PRINTING
# ---------------------------------------------------------------------------

def print_report(report: dict) -> None:
    u = report["untracked"]
    p = report["phantom"]
    d = report["divergent"]
    total = len(u) + len(p) + len(d)

    print(f"\n=== E-1 Three-Class Advisory Report ===")
    print(f"Generated : {report.get('generated_at', 'unknown')}")
    print(f"Source    : schema_snapshot.json (live information_schema)")
    print(f"Reference : migrations.sql (advisory — not truth)")
    print(f"Total findings: {total}\n")

    print(f"--- UNTRACKED ({len(u)}) — live tables with no CREATE TABLE in migrations ---")
    for item in u:
        print(f"  {item['table']}: {item['live_columns']}")

    print(f"\n--- PHANTOM ({len(p)}) — migrations reference tables absent from live ---")
    for item in p:
        print(f"  {item['table']}: reference_columns={item['reference_columns']}")

    print(f"\n--- DIVERGENT ({len(d)}) — tables present in both with column-level differences ---")
    for item in d:
        print(f"  {item['table']}:")
        for diff in item["differences"]:
            print(f"    {diff}")


# ---------------------------------------------------------------------------
# MAIN
# ---------------------------------------------------------------------------

def main() -> None:
    args = sys.argv[1:]

    if "--test" in args:
        success = run_test()
        sys.exit(0 if success else 1)

    if "--emit-sql" in args:
        print(EMIT_SQL)
        return

    if "--report" in args or not args:
        if not SNAPSHOT_PATH.exists():
            print(
                f"ERROR: {SNAPSHOT_PATH} not found.\n"
                "Run with --emit-sql to get the SQL, run it in Supabase, "
                "save result as schema_snapshot.json, then re-run."
            )
            sys.exit(1)

        live = load_snapshot(SNAPSHOT_PATH)
        reference = parse_migrations_tables(MIGRATIONS_PATH)
        report = three_class_report(live, reference)
        print_report(report)

        with open(REPORT_PATH, "w") as f:
            json.dump(report, f, indent=2, default=str)
        print(f"\nReport saved: {REPORT_PATH}")

    if "--drift" in args:
        if not SNAPSHOT_PATH.exists() or not PREV_SNAPSHOT_PATH.exists():
            print("ERROR: Both schema_snapshot.json and schema_snapshot_prev.json required.")
            sys.exit(1)
        old = load_snapshot(PREV_SNAPSHOT_PATH)
        new = load_snapshot(SNAPSHOT_PATH)
        drift = snapshot_drift(old, new)
        print(json.dumps(drift, indent=2))


if __name__ == "__main__":
    main()
