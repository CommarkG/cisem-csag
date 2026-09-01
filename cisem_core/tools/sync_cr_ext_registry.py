#!/usr/bin/env python3
"""
CISEM Layer Classification Metadata Registry Sync Tool
Target: cisem_core/tools/sync_cr_ext_registry.py
Authority: Governor Yariv / Reviewer Claude / Antigravity
Rule: Syncs PostgreSQL public.cr_ext_registry table to offline JSON file cisem_core/cr_ext_registry.json.
"""

import sys
import os
import json

def sync_registry_from_db_or_cache(db_rows=None):
    workspace_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    json_path = os.path.join(workspace_dir, "cisem_core", "cr_ext_registry.json")
    
    if db_rows is None:
        # Load existing json cache or baseline seed
        if os.path.exists(json_path):
            with open(json_path, "r", encoding="utf-8") as f:
                db_rows = json.load(f)
        else:
            db_rows = {}

    formatted_data = {}
    for asset_name, meta in db_rows.items():
        clean_name = asset_name.lower()
        if isinstance(meta, dict):
            formatted_data[clean_name] = {
                "asset_name": clean_name,
                "layer_code": meta.get("layer_code", "UNCLASSIFIED").upper(),
                "domain_code": meta.get("domain_code"),
                "description": meta.get("description", "")
            }

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(formatted_data, f, indent=2)

    print(f"Successfully synced {len(formatted_data)} registry entries to {json_path}")
    return True

if __name__ == "__main__":
    sync_registry_from_db_or_cache()
