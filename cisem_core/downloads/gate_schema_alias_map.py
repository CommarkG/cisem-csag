#!/usr/bin/env python3
"""
CISEM Schema Alias Mapping Pre-Commit Gate
Target: cisem_core/tools/gate_schema_alias_map.py
Authority: Governor Yariv / Reviewer Claude / Antigravity
Rule: P10 / Rule 20.5 - Prevents writing sub-artifacts or code against non-existent table names.
"""

import sys
import os
import json
import re

def run_schema_alias_check(target_file=None):
    workspace_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    # 1. Load Live Database Tables from exact_62_table_audit.json
    audit_file = os.path.join(workspace_dir, "scratch", "exact_62_table_audit.json")
    live_tables = set()
    if os.path.exists(audit_file):
        with open(audit_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            for item in data:
                if isinstance(item, dict) and "table_name" in item:
                    live_tables.add(item["table_name"].lower())
                elif isinstance(item, str):
                    live_tables.add(item.lower())
    
    # Baseline standard live tables if scratch file absent
    baseline_live = {
        "quotes", "quote_lines", "inquiries", "catalog_items", "price_list_lines",
        "customer_accounts", "vocabulary_terms", "status_library", "attachments",
        "state_transitions", "backlog_registry", "document_chunks", "cr_null_flavors",
        "cr_ext_registry", "events", "user_roles", "permissions"
    }
    live_tables.update(baseline_live)

    # 2. Load Registered Metadata Aliases from cr_ext_registry.json
    registry_file = os.path.join(workspace_dir, "cisem_core", "cr_ext_registry.json")
    registered_aliases = set()
    if os.path.exists(registry_file):
        with open(registry_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            if isinstance(data, dict):
                registered_aliases.update(k.lower() for k in data.keys())
            elif isinstance(data, list):
                for entry in data:
                    if isinstance(entry, dict) and "asset_name" in entry:
                        registered_aliases.update(entry["asset_name"].lower())

    valid_targets = live_tables.union(registered_aliases)

    # 3. Determine Files to Scan
    files_to_scan = []
    if target_file and os.path.exists(target_file):
        files_to_scan.append(target_file)
    else:
        planning_dir = os.path.join(workspace_dir, "cisem_core", "planning")
        if os.path.exists(planning_dir):
            for fname in os.listdir(planning_dir):
                if fname.endswith(".md"):
                    files_to_scan.append(os.path.join(planning_dir, fname))

    # 4. Scan Markdown files for physical table reference patterns (e.g. cr_..., ext_..., or `table_name`)
    # Table reference pattern: `cr_[a-z0-9_]+` or `ext_[a-z0-9_]+`
    table_pattern = re.compile(r'\b(cr_[a-z0-9_]+|ext_[a-z0-9_]+)\b', re.IGNORECASE)
    
    violations = []
    for filepath in files_to_scan:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
            matches = set(table_pattern.findall(content))
            for match in matches:
                clean_name = match.lower()
                if clean_name not in valid_targets:
                    violations.append({
                        "file": os.path.basename(filepath),
                        "table": clean_name,
                        "reason": f"Table '{clean_name}' does not exist in live DB schema nor registered in cr_ext_registry."
                    })

    # 5. Output Result
    if violations:
        print("============================================================")
        print("CISEM SCHEMA ALIAS MAP GATE > STATUS: BLOCKED")
        print("============================================================")
        print(f"Found {len(violations)} non-existent table reference(s):")
        for v in violations:
            print(f"  - File: {v['file']} | Un-mapped Table: {v['table']}")
        print("\nAction: Add physical table to PostgreSQL schema OR register metadata alias in cisem_core/cr_ext_registry.json.")
        return False
    else:
        print("============================================================")
        print("CISEM SCHEMA ALIAS MAP GATE > STATUS: PASSED")
        print("============================================================")
        print(f"Scanned {len(files_to_scan)} file(s). All table references resolve to live tables or registered aliases.")
        return True

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else None
    success = run_schema_alias_check(target)
    sys.exit(0 if success else 1)
