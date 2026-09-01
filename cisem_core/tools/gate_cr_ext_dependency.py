#!/usr/bin/env python3
"""
CISEM CR / EXT Dependency Direction Pre-Commit Gate
Target: cisem_core/tools/gate_cr_ext_dependency.py
Authority: Governor Yariv / Reviewer Claude / Antigravity
Rule: Rule 20.2 - CR (Core) assets MUST NEVER depend on EXT (External Domain) assets.
Refusal: Un-registered or UNCLASSIFIED tables BLOCK THE GATE IMMEDIATELY.
"""

import sys
import os
import json
import re

def load_registry_mappings(workspace_dir):
    registry = {}
    
    json_path = os.path.join(workspace_dir, "cisem_core", "cr_ext_registry.json")
    if os.path.exists(json_path):
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, dict):
                    for name, meta in data.items():
                        if isinstance(meta, dict) and "layer_code" in meta:
                            registry[name.lower()] = meta["layer_code"].upper()
                elif isinstance(data, list):
                    for entry in data:
                        if isinstance(entry, dict) and "asset_name" in entry and "layer_code" in entry:
                            registry[entry["asset_name"].lower()] = entry["layer_code"].upper()
        except Exception as e:
            pass

    return registry

def get_table_layer(table_name, registry):
    clean = table_name.lower()
    if clean in registry:
        return registry[clean]
    # Unregistered tables return UNCLASSIFIED (blocks gate)
    return "UNCLASSIFIED"

def audit_cr_ext_dependencies(sql_content: str, workspace_dir: str) -> list:
    violations = []
    registry = load_registry_mappings(workspace_dir)

    # Check for unclassified / unregistered tables in DDL
    all_table_refs = set(re.findall(r"\b(?:ALTER\s+TABLE|CREATE\s+TABLE|REFERENCES)\s+([^\s(;]+)", sql_content, re.IGNORECASE))
    for t_raw in all_table_refs:
        clean_name = t_raw.split(".")[-1].strip('"`[];()')
        if clean_name and not clean_name.startswith("fk_") and not clean_name.startswith("idx_"):
            layer = get_table_layer(clean_name, registry)
            if layer == "UNCLASSIFIED":
                violations.append(
                    f"Orphan Table Refusal: Table '{clean_name}' is UNCLASSIFIED or absent from cr_ext_registry! Register layer code (CR or EXT) before committing DDL."
                )

    # Pattern 1: ALTER TABLE <src_table> ... REFERENCES <target_table>
    fk_matches = re.findall(
        r"ALTER\s+TABLE\s+([^\s;]+)\s+ADD\s+CONSTRAINT\s+[^\s]+\s+FOREIGN\s+KEY\s*\([^)]+\)\s*REFERENCES\s+([^\s(;]+)",
        sql_content,
        re.IGNORECASE
    )
    for src_raw, target_raw in fk_matches:
        src_table = src_raw.split(".")[-1].strip('"`[]')
        target_table = target_raw.split(".")[-1].strip('"`[]')

        src_layer = get_table_layer(src_table, registry)
        target_layer = get_table_layer(target_table, registry)

        if src_layer == "CR" and target_layer == "EXT":
            violations.append(
                f"Prohibited FK: Core table '{src_table}' ({src_layer}) references External Domain table '{target_table}' ({target_layer})."
            )

    # Pattern 2: CREATE TABLE <src_table> (... REFERENCES <target_table>)
    create_table_blocks = re.findall(
        r"CREATE\s+TABLE\s+([^\s(;]+)\s*\(([^;]+)\);",
        sql_content,
        re.IGNORECASE | re.DOTALL
    )
    for src_raw, body in create_table_blocks:
        src_table = src_raw.split(".")[-1].strip('"`[]')
        src_layer = get_table_layer(src_table, registry)

        ref_matches = re.findall(r"REFERENCES\s+([^\s(;]+)", body, re.IGNORECASE)
        for target_raw in ref_matches:
            target_table = target_raw.split(".")[-1].strip('"`[]')
            target_layer = get_table_layer(target_table, registry)

            if src_layer == "CR" and target_layer == "EXT":
                violations.append(
                    f"Prohibited Column Reference: Core table '{src_table}' ({src_layer}) references External Domain table '{target_table}' ({target_layer})."
                )

    return violations

def main():
    workspace_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    if len(sys.argv) > 1:
        target_path = sys.argv[1]
        if os.path.exists(target_path):
            with open(target_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
        else:
            content = target_path # Treat as inline SQL string argument
    else:
        content = sys.stdin.read() if not sys.stdin.isatty() else ""

    violations = audit_cr_ext_dependencies(content, workspace_dir)

    print("============================================================")
    if violations:
        print("CISEM CR / EXT DEPENDENCY GATE > STATUS: BLOCKED")
        print("============================================================")
        print(f"CR -> EXT Dependency Rule Violations Found: {len(violations)}")
        for v in violations:
            print(f"  - [RULE VIOLATION]: {v}")
        sys.exit(1)
    else:
        print("CISEM CR / EXT DEPENDENCY GATE > STATUS: PASSED")
        print("============================================================")
        print("Zero CR -> EXT dependency direction violations found.")
        sys.exit(0)

if __name__ == "__main__":
    main()
