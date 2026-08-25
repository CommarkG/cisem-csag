#!/usr/bin/env python3
"""
# CISEM CODE HEADER > MANDATORY
# ratified_plan: CISEM-IP-20260810-CONSOLIDATED-MASTER-V1.7
# governor_signature: GOV-YARIV-20260810-GOVERNANCE-HARDENING-RATIFIED
# version: V1.0
# reasoning: |
#   Provides decoupled Twelve-Factor path resolutions via environment variables
#   or dynamic defaults, preventing hardcoded workspace directory anchors.
#   Parent principles: AxiomsAndPrinciples V1.30 >AX-10000, >PR-58950, >PR-95000.
#   Resolves: Twelve-Factor Environment Configuration.
"""

import os
import re

# Determine Root Directory dynamically
# Priority:
# 1. Environment variable CISEM_ROOT
# 2. Parent directory of 'cisem_core' containing this file
# 3. Current Working Directory (fallback)
env_root = os.environ.get("CISEM_ROOT")
if env_root:
    ROOT_DIR = os.path.abspath(env_root)
else:
    # This file resides in cisem_core/platform_core/
    _current_dir = os.path.dirname(os.path.abspath(__file__))
    if os.path.basename(_current_dir) == "platform_core":
        CORE_DIR = os.path.dirname(_current_dir)
    else:
        CORE_DIR = _current_dir
    ROOT_DIR = os.path.dirname(CORE_DIR)

# Ensure absolute paths
ROOT_DIR = os.path.abspath(ROOT_DIR)
CORE_DIR = os.path.abspath(os.path.join(ROOT_DIR, "cisem_core"))

# Environment-based Brain Root
user_home_brain = os.path.join(os.path.expanduser("~"), ".gemini", "antigravity", "brain")
BRAIN_ROOT = os.environ.get("BRAIN_ROOT")
if not BRAIN_ROOT:
    if os.path.exists(user_home_brain):
        BRAIN_ROOT = user_home_brain
    else:
        BRAIN_ROOT = os.path.join(ROOT_DIR, ".gemini", "antigravity", "brain")
BRAIN_ROOT = os.path.abspath(BRAIN_ROOT)

def find_latest_registry_file():
    candidates = []
    if os.path.exists(CORE_DIR):
        for f in os.listdir(CORE_DIR):
            if "Universal_Workspace_and_Accountability_Registry" in f and f.endswith(".yaml"):
                v_match = re.search(r'__V(\d+(?:\.\d+)*)\.yaml$', f)
                if v_match:
                    try:
                        version = [int(x) for x in v_match.group(1).split(".")]
                    except ValueError:
                        version = [0]
                    candidates.append((version, os.path.join(CORE_DIR, f)))
    if candidates:
        candidates.sort(key=lambda x: x[0], reverse=True)
        return candidates[0][1]
    
    # Check parent folder as fallback
    if os.path.exists(ROOT_DIR):
        for f in os.listdir(ROOT_DIR):
            if "Universal_Workspace_and_Accountability_Registry" in f and f.endswith(".yaml"):
                v_match = re.search(r'__V(\d+(?:\.\d+)*)\.yaml$', f)
                if v_match:
                    try:
                        version = [int(x) for x in v_match.group(1).split(".")]
                    except ValueError:
                        version = [0]
                    candidates.append((version, os.path.join(ROOT_DIR, f)))
    if candidates:
        candidates.sort(key=lambda x: x[0], reverse=True)
        return candidates[0][1]
    
    # Look in the core council directory as well
    council_dir = os.path.join(ROOT_DIR, "Cisem CsAG Core Councils", "Cisem AntiGravity & Gemini Brain")
    if os.path.exists(council_dir):
        for f in os.listdir(council_dir):
            if "Universal_Workspace_and_Accountability_Registry" in f and f.endswith(".yaml"):
                v_match = re.search(r'__V(\d+(?:\.\d+)*)\.yaml$', f)
                if v_match:
                    try:
                        version = [int(x) for x in v_match.group(1).split(".")]
                    except ValueError:
                        version = [0]
                    candidates.append((version, os.path.join(council_dir, f)))
    if candidates:
        candidates.sort(key=lambda x: x[0], reverse=True)
        return candidates[0][1]

    # Absolute fallback path
    return os.path.join(CORE_DIR, "2026-08-05__CISEM__Universal_Workspace_and_Accountability_Registry__V1.4.yaml")

REGISTRY_PATH      = os.path.abspath(find_latest_registry_file())
SYNC_SCRIPT        = os.path.abspath(os.path.join(CORE_DIR, "CisemSync.py"))
GATE_LOCK_PATH     = os.path.abspath(os.path.join(ROOT_DIR, ".gate_lock"))
PARKING_VAULT_PATH = os.path.abspath(os.path.join(CORE_DIR, "sandbox", "parking_vault_draft.yaml"))
TURN_COUNTER_PATH  = os.path.abspath(os.path.join(CORE_DIR, "cisem_turn_counter.json"))
CAEL_STATUS_PATH   = os.path.abspath(os.path.join(CORE_DIR, "cael_status.json"))
PLANNING_MODE_PATH = os.path.abspath(os.path.join(CORE_DIR, "planning", "cisem_planning_mode.json"))
TEMPLATES_REGISTRY_PATH = os.path.abspath(os.path.join(ROOT_DIR, "templates", "2026-08-10__CISEM__AntigravityLocal__TemplatesRegistry__V1.0.yaml"))

if __name__ == "__main__":
    print(f"ROOT_DIR: {ROOT_DIR}")
    print(f"CORE_DIR: {CORE_DIR}")
    print(f"BRAIN_ROOT: {BRAIN_ROOT}")
    print(f"REGISTRY_PATH: {REGISTRY_PATH}")
    print(f"GATE_LOCK_PATH: {GATE_LOCK_PATH}")
    print(f"PLANNING_MODE_PATH: {PLANNING_MODE_PATH}")
    print(f"TEMPLATES_REGISTRY_PATH: {TEMPLATES_REGISTRY_PATH}")
