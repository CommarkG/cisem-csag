#!/usr/bin/env python3
"""
# CISEM CODE HEADER -- MANDATORY
# ratified_plan: CISEM-IP-20260822-LIVE-SCHEMA-GATE
# governor_signature: GOV-YARIV-20260822-LIVE-SCHEMA-GATE-V1.0
# version: V1.0
# reasoning: |
#   Compiler gate phase verifying that every table referenced in backend code
#   exists in the live_schema_registry.json snapshot. Failure to register tables
#   or schema staleness blocks gate compilation to prevent hidden schema drift.
"""

import os
import sys
import json
import re
from datetime import datetime, timezone, timedelta

def check_live_schema_alignment():
    core_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    workspace_dir = os.path.dirname(core_dir)
    registry_path = os.path.join(core_dir, "live_schema_registry.json")
    backend_dir = os.path.join(workspace_dir, "backend", "src", "backend")

    print("Phase 28: Verifying Live Schema Registry Alignment...")

    if not os.path.exists(registry_path):
        print(f"CISEM_GATE_BLOCKED -- Phase 28: Schema registry missing at {registry_path}")
        sys.exit(1)

    try:
        with open(registry_path, "r", encoding="utf-8") as f:
            registry_data = json.load(f)
    except Exception as e:
        print(f"CISEM_GATE_BLOCKED -- Phase 28: Failed to parse live_schema_registry.json: {e}")
        sys.exit(1)

    # 1. Staleness & Integrity Checks
    gen_str = registry_data.get("generated_at")
    if not gen_str:
        print("CISEM_GATE_BLOCKED -- Phase 28: generated_at timestamp missing in live_schema_registry.json")
        sys.exit(1)

    try:
        gen_dt = datetime.fromisoformat(gen_str.replace("Z", "+00:00"))
        now_dt = datetime.now(timezone.utc)
        if gen_dt > now_dt + timedelta(minutes=5):
            print(f"CISEM_GATE_BLOCKED -- Phase 28: generated_at timestamp '{gen_str}' is in the future!")
            sys.exit(1)
        if now_dt - gen_dt > timedelta(days=14):
            print(f"CISEM_GATE_BLOCKED -- Phase 28: live_schema_registry.json is stale (generated {gen_str})")
            sys.exit(1)
    except Exception as e:
        print(f"CISEM_GATE_BLOCKED -- Phase 28: Invalid generated_at timestamp '{gen_str}': {e}")
        sys.exit(1)

    tables_obj = registry_data.get("tables")
    if not isinstance(tables_obj, dict):
        print("CISEM_GATE_BLOCKED -- Phase 28: live_schema_registry.json 'tables' field must be a dictionary mapping table names to column lists.")
        sys.exit(1)

    table_count = len(tables_obj)
    if table_count < 60:
        print(f"CISEM_GATE_BLOCKED -- Phase 28: live_schema_registry.json implausible: fewer than 60 tables found ({table_count}).")
        sys.exit(1)

    for tbl_name, cols in tables_obj.items():
        if not isinstance(cols, list) or len(cols) == 0:
            print(f"CISEM_GATE_BLOCKED -- Phase 28: Table '{tbl_name}' in live_schema_registry.json has an empty or missing column list.")
            sys.exit(1)

    registered_tables = set(tables_obj.keys())
    print(f"  [*] Loaded {len(registered_tables)} registered live database tables with column lists.")

    # 2. Backend Code Table Reference Scan
    table_pattern = re.compile(r'\.table\(["\']([a-zA-Z0-9_]+)["\']\)')
    unregistered_found = {}

    if os.path.exists(backend_dir):
        for root, _, files in os.walk(backend_dir):
            for file in files:
                if file.endswith(".py"):
                    filepath = os.path.join(root, file)
                    rel_path = os.path.relpath(filepath, workspace_dir)
                    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                        lines = f.readlines()
                    for idx, line in enumerate(lines, 1):
                        matches = table_pattern.findall(line)
                        for tbl in matches:
                            if tbl not in registered_tables:
                                if tbl not in unregistered_found:
                                    unregistered_found[tbl] = []
                                unregistered_found[tbl].append(f"{rel_path}:{idx}")

    if unregistered_found:
        print("\nCISEM_GATE_BLOCKED -- Phase 28: Backend code references unregistered database tables!")
        for tbl, refs in unregistered_found.items():
            print(f"  [!] Unregistered Table '{tbl}': referenced at {', '.join(refs)}")
        print("\nStaleness Block: Code calls tables absent from live_schema_registry.json.")
        sys.exit(1)

    print("  Phase 28: PASS. All backend table references match live schema registry.")
    sys.exit(0)

if __name__ == "__main__":
    check_live_schema_alignment()
