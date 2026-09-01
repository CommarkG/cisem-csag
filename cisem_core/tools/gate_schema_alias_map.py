#!/usr/bin/env python3
"""
CISEM Schema Alias & Column Mapping Pre-Commit Gate
Target: cisem_core/tools/gate_schema_alias_map.py
Authority: Governor Yariv / Reviewer Claude / Antigravity
Rule: Rule 0 / P10 / Rule 20.5 - Validates both Table Names AND Column Names against live_schema_registry.json.
"""

import sys
import os
import json
import re

def load_live_schema(workspace_dir):
    schema_registry_path = os.path.join(workspace_dir, "cisem_core", "live_schema_registry.json")
    table_columns = {}
    live_tables = set()

    if os.path.exists(schema_registry_path):
        try:
            with open(schema_registry_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list):
                    for entry in data:
                        if isinstance(entry, dict) and "t" in entry:
                            tname = entry["t"].lower()
                            live_tables.add(tname)
                            if "c" in entry:
                                cname = entry["c"].lower()
                                if tname not in table_columns:
                                    table_columns[tname] = set()
                                table_columns[tname].add(cname)
        except Exception as e:
            pass

    # Baseline schema fallback for core tables
    baseline_schema = {
        "vocabulary_terms": {"id", "customer_account_id", "sort_order", "is_active", "attributes", "created_at", "is_protected", "kind", "scope", "code", "label", "domain_code"},
        "customer_accounts": {"id", "company_name", "tax_id", "industry", "credit_terms", "account_type", "package_id", "settings", "brand_assets", "created_at"},
        "quotes": {"id", "customer_account_id", "quote_number", "status_code", "total_amount", "created_at"},
        "inquiries": {"id", "customer_account_id", "inquiry_number", "status_code", "title", "created_at"},
        "cr_ext_registry": {"asset_name", "layer_code", "domain_code", "description", "created_at", "updated_at"}
    }

    for t, cols in baseline_schema.items():
        live_tables.add(t)
        if t not in table_columns:
            table_columns[t] = set()
        table_columns[t].update(cols)

    return live_tables, table_columns

def run_schema_alias_check(target_input=None):
    workspace_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    live_tables, table_columns = load_live_schema(workspace_dir)

    # Load Metadata Aliases from cr_ext_registry.json
    registry_file = os.path.join(workspace_dir, "cisem_core", "cr_ext_registry.json")
    registered_aliases = set()
    if os.path.exists(registry_file):
        try:
            with open(registry_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, dict):
                    registered_aliases.update(k.lower() for k in data.keys())
        except Exception:
            pass

    valid_tables = live_tables.union(registered_aliases)

    # Content to scan
    content = ""
    target_name = "Input"
    if target_input and os.path.exists(target_input):
        target_name = os.path.basename(target_input)
        with open(target_input, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
    elif target_input:
        content = target_input

    violations = []

    # 1. Scan for invalid prefixed table references (cr_fake_...)
    table_pattern = re.compile(r'\b(cr_[a-z0-9_]+|ext_[a-z0-9_]+)\b', re.IGNORECASE)
    for match in set(table_pattern.findall(content)):
        clean_name = match.lower()
        if clean_name not in valid_tables:
            violations.append(f"Table Refusal: Table '{clean_name}' does not exist in live DB schema nor registered in cr_ext_registry.json.")

    # 2. Scan for table.column references (e.g. vocabulary_terms.term_code)
    col_dot_pattern = re.compile(r'\b([a-z0-9_]+)\.([a-z0-9_]+)\b', re.IGNORECASE)
    for t_raw, c_raw in col_dot_pattern.findall(content):
        t_clean = t_raw.lower()
        c_clean = c_raw.lower()
        if t_clean in table_columns:
            if c_clean not in table_columns[t_clean]:
                valid_cols = ", ".join(sorted(list(table_columns[t_clean])))
                violations.append(f"Column Refusal: Table '{t_clean}' has no column '{c_clean}'! Valid columns: [{valid_cols}].")

    # 3. Scan for INSERT INTO table (col1, col2) references
    insert_pattern = re.compile(r'INSERT\s+INTO\s+([a-z0-9_.]+)\s*\(([^)]+)\)', re.IGNORECASE)
    for t_raw, cols_raw in insert_pattern.findall(content):
        t_clean = t_raw.split(".")[-1].lower()
        if t_clean in table_columns:
            for c_raw in cols_raw.split(","):
                c_clean = c_raw.strip().split()[-1].strip('"`[]')
                if c_clean and c_clean not in table_columns[t_clean]:
                    valid_cols = ", ".join(sorted(list(table_columns[t_clean])))
                    violations.append(f"Column Refusal: INSERT into '{t_clean}' specifies non-existent column '{c_clean}'! Valid columns: [{valid_cols}].")

    if violations:
        print("============================================================")
        print("CISEM SCHEMA ALIAS & COLUMN MAP GATE > STATUS: BLOCKED")
        print("============================================================")
        print(f"Found {len(violations)} schema/column violation(s) in {target_name}:")
        for v in set(violations):
            print(f"  - [RULE VIOLATION]: {v}")
        return False
    else:
        print("============================================================")
        print("CISEM SCHEMA ALIAS & COLUMN MAP GATE > STATUS: PASSED")
        print("============================================================")
        print(f"All table and column references in {target_name} resolve cleanly against live schema.")
        return True

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else None
    success = run_schema_alias_check(target)
    sys.exit(0 if success else 1)
