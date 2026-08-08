#!/usr/bin/env python3
"""
# CISEM CODE HEADER -- MANDATORY
# ratified_plan: CISEM-IP-20260807-PLATFORM-SANDBOX
# governor_signature: GOV-YARIV-20260807-PLATFORM-SANDBOX-V1.0
# version: V1.0
# reasoning: |
#   On-demand synchronization utility to sync sandbox draft plans, walkthroughs,
#   and image processing trials between the core plane and external workspaces.
#   Protects against automated leak risks by requiring explicit manual invocation.
#   Parent principles: AxiomsAndPrinciples V1.20 §PR-13900.
"""

import os
import sys
import shutil
import hashlib
import yaml
from datetime import datetime, timezone

CORE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(CORE_DIR)

def find_latest_registry_file():
    core_dir = os.path.join(ROOT_DIR, "cisem_core")
    candidates = []
    if os.path.exists(core_dir):
        for f in os.listdir(core_dir):
            if "Universal_Workspace_and_Accountability_Registry" in f and f.endswith(".yaml"):
                v_match = re.search(r'__V(\d+(?:\.\d+)*)\.yaml$', f)
                if v_match:
                    try:
                        version = [int(x) for x in v_match.group(1).split(".")]
                    except ValueError:
                        version = [0]
                    candidates.append((version, os.path.join(core_dir, f)))
    if candidates:
        candidates.sort(key=lambda x: x[0], reverse=True)
        return candidates[0][1]
    import re
    return None

def sync_ondemand():
    print("=" * 60)
    print("CISEM Sandbox On-Demand Sync Bridge (CSB) v1.0")
    print("Target Workspace: Cisem CsAg (Core Platform)")
    print("=" * 60)

    ext_sandbox = r"C:\Users\finky\Desktop\AntiGravity\Sandbox Csag"
    core_sandbox = os.path.join(ROOT_DIR, "sandbox")

    if not os.path.exists(ext_sandbox):
        print(f"[ERROR] External sandbox directory not found: {ext_sandbox}")
        sys.exit(1)

    os.makedirs(core_sandbox, exist_ok=True)

    # 1. Inbound Sync (External -> Core sandbox/)
    print("\nScanning for external draft updates...")
    ingested_count = 0
    for root, _, files in os.walk(ext_sandbox):
        for f in files:
            if ("draft" in f.lower() or "plan" in f.lower() or "walkthrough" in f.lower()) and f.endswith(".md"):
                if "review" in f.lower():
                    continue
                src_path = os.path.join(root, f)
                dest_path = os.path.join(core_sandbox, f)
                
                # Copy to core
                shutil.copy2(src_path, dest_path)
                print(f"  [INBOUND] Copied: {f} -> core sandbox/")
                ingested_count += 1

    # 2. Outbound Sync (Core sandbox/ -> External)
    print("\nScanning for core review updates...")
    outbound_count = 0
    for f in os.listdir(core_sandbox):
        if ("review" in f.lower() or "walkthrough" in f.lower()) and f.endswith(".md"):
            src_path = os.path.join(core_sandbox, f)
            dest_path = os.path.join(os.path.join(ext_sandbox, "Marketing & Sales"), f)
            
            # Make sure destination folder exists
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            
            shutil.copy2(src_path, dest_path)
            print(f"  [OUTBOUND] Published: {f} -> external Sandbox Marketing & Sales/")
            outbound_count += 1

    print("\n" + "=" * 60)
    print(f"Sync complete. Inbound: {ingested_count} files | Outbound: {outbound_count} files.")
    print("=" * 60)

if __name__ == "__main__":
    import re
    sync_ondemand()
