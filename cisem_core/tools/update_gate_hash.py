#!/usr/bin/env python3
"""
# CISEM CODE HEADER > MANDATORY
# File           : update_gate_hash.py
# Ratified plan  : CISEM-IP-20260822-PEOPLE-PLACES-FILES V19 (Item 1)
# Architectural  : Mechanical SHA-256 gate integrity registry updater.
#                  Computes sha256 of cisem_gate.py and updates the universal registry.
# Axioms         : AX-SECURITY-01, U1.2.40 (Prevention Protocol - No Hand-Copied Hashes)
"""

import os
import sys
import yaml
import hashlib

def update_gate_hash():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    gate_path = os.path.join(base_dir, "cisem_core", "platform_core", "cisem_gate.py")
    registry_path = os.path.join(base_dir, "cisem_core", "2026-08-05__CISEM__Universal_Workspace_and_Accountability_Registry__V1.44.yaml")

    if not os.path.exists(gate_path):
        print(f"FATAL: Gate file missing at {gate_path}")
        sys.exit(1)

    if not os.path.exists(registry_path):
        print(f"FATAL: Registry file missing at {registry_path}")
        sys.exit(1)

    # Compute current gate SHA-256 hash
    with open(gate_path, "rb") as f:
        curr_hash = hashlib.sha256(f.read()).hexdigest()

    # Read registry
    try:
        with open(registry_path, "r", encoding="utf-8") as f:
            registry_content = f.read()
    except Exception as e:
        print(f"FATAL: Failed to read registry YAML: {e}")
        sys.exit(1)

    # Validate registry structure
    try:
        docs = list(yaml.safe_load_all(registry_content))
    except Exception as e:
        print(f"FATAL: Registry YAML is malformed: {e}")
        sys.exit(1)

    # Locate registered hash in YAML text for precise in-place replacement
    old_hash = None
    target_pattern = None

    # Search for gate entry in registry data
    def find_entry(data):
        nonlocal old_hash
        if isinstance(data, dict):
            if data.get("path") in ("cisem_gate.py", "platform_core/cisem_gate.py"):
                old_hash = data.get("sha256")
                return True
            for k, v in data.items():
                if find_entry(v):
                    return True
        elif isinstance(data, list):
            for item in data:
                if find_entry(item):
                    return True
        return False

    for doc in docs:
        if find_entry(doc):
            break

    if not old_hash:
        print("FATAL: cisem_gate.py entry not found in registry.")
        sys.exit(1)

    if old_hash == curr_hash:
        print(f"Registry hash is already up to date ({curr_hash}). No change required.")
        return

    # In-place string replacement in YAML to preserve comments and formatting
    new_registry_content = registry_content.replace(old_hash, curr_hash, 1)

    with open(registry_path, "w", encoding="utf-8") as f:
        f.write(new_registry_content)

    print(f"Updated cisem_gate.py registry hash:")
    print(f"  Before: {old_hash}")
    print(f"  After : {curr_hash}")

if __name__ == "__main__":
    update_gate_hash()
