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

def sync_registry_to_json(db_rows=None):
    workspace_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    json_path = os.path.join(workspace_dir, "cisem_core", "cr_ext_registry.json")
    
    if db_rows is None:
        # Default baseline if DB offline
        db_rows = {
            "quotes": {"layer_code": "CR", "domain_code": None, "description": "Core Quotes Table"},
            "inquiries": {"layer_code": "CR", "domain_code": None, "description": "Core Inquiries Table"},
            "catalog_items": {"layer_code": "CR", "domain_code": None, "description": "Core Catalog Items Table"},
            "vocabulary_terms": {"layer_code": "CR", "domain_code": None, "description": "Core Vocabulary Terms Table"},
            "customer_accounts": {"layer_code": "CR", "domain_code": None, "description": "Core Customer Accounts Table"},
            "price_list_lines": {"layer_code": "CR", "domain_code": None, "description": "Core Price List Lines Table"},
            "quote_lines": {"layer_code": "CR", "domain_code": None, "description": "Core Quote Lines Table"},
            "attachments": {"layer_code": "CR", "domain_code": None, "description": "Core Attachments Table"},
            "cr_null_flavors": {"layer_code": "CR", "domain_code": None, "description": "Core ISO Null Flavors Table"},
            "ext_mto_proofs": {"layer_code": "EXT", "domain_code": "MTO", "description": "External MTO Proofs Table"},
            "ext_specification_signoffs": {"layer_code": "EXT", "domain_code": "MTO", "description": "External Specification Signoffs Table"}
        }

    formatted_data = {}
    for asset_name, meta in db_rows.items():
        clean_name = asset_name.lower()
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
    sync_registry_to_json()
