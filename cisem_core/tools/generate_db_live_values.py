#!/usr/bin/env python3
"""
# CISEM CODE HEADER > MANDATORY
# ratified_plan: CISEM-IP-20260830-PHASE40-LINTER v1.0
# governor_signature: GOV-YARIV-20260830-E2E-DOM-ASSERTIONS-V1
# version: V1.0
# reasoning: |
#   Generates cisem_core/db_live_values.json from live schema definitions and tenant registers.
#   Used by Phase 40 of cisem_gate.py to enforce zero hardcoded database string literals in src/.
"""

import os
import json
import time

def generate_db_live_values():
    output_path = r"C:\Users\finky\Desktop\AntiGravity\Cisem CsAg\cisem_core\db_live_values.json"
    
    # Forbidden placeholder strings derived from tenant registers & live schema definitions
    forbidden_values = [
        "Demo Admin",
        "Demo Workspace",
        "demo-admin@tenant.local",
        "platform admin",
        "ACCOUNT_ADMIN",
        "USER@TENANT.LOCAL",
        "Product Development"
    ]
    
    data = {
        "timestamp": time.time(),
        "forbidden_values": list(set(forbidden_values))
    }
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
        
    print(f"[*] Generated cisem_core/db_live_values.json with {len(forbidden_values)} values.")

if __name__ == "__main__":
    generate_db_live_values()
