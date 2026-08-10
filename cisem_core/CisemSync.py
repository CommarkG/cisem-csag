#!/usr/bin/env python3
"""
# CISEM CODE HEADER — MANDATORY
# ratified_plan: CISEM-IP-20260807-PLANNING-SPINE
# governor_signature: GOV-YARIV-20260807-PLANNING-SPINE-V1.0
# version: V1.3
# reasoning: |
#   CisemSync replicates brain artifacts into the workspace.
#   V1.1 adds strict naming pattern validation (V1.16 §E) so that
#   any document failing the CISEM naming convention exits 1, blocking
#   the gate in Phase 2 before the file reaches the workspace.
#   Parent principles: AxiomsAndPrinciples V1.12 §PR-13950 (Zero-Drift).

CISEM Document Synchronizer (CisemSync)
Version: 1.3
Description: Automatically replicates private brain artifacts into versioned,
             human-readable files in the root workspace, enforcing strict naming schemas.
Change log:
  V1.0 -> V1.1 (2026-08-06): Added validate_naming() per V1.16 plan §E.
                              Resolves: CISEM-IP-20260806-GATE-HARDENING.
  V1.1 -> V1.2 (2026-08-07): Added SWIFT tags for PARK-004 and PARK-008.
  V1.2 -> V1.3 (2026-08-07): Fixed get_latest_brain_dir to skip temp and dot directories.
"""

import os
import re
import sys
import glob
import shutil
import json
from datetime import datetime, timezone

# Custom Exceptions
class NamingPolicyViolation(Exception):
    """Raised when a filename violates the strict CISEM naming policy."""
    pass

class SyncError(Exception):
    """Raised when a document synchronization error occurs."""
    pass

# Dynamic Config Import
_sync_dir = os.path.dirname(os.path.abspath(__file__))
_platform_core_dir = os.path.join(_sync_dir, "platform_core")
if _platform_core_dir not in sys.path:
    sys.path.insert(0, _platform_core_dir)

try:
    import importlib.util
    config_module = None
    if os.path.exists(_platform_core_dir):
        for f in os.listdir(_platform_core_dir):
            if "CisemConfig" in f and f.endswith(".py"):
                spec = importlib.util.spec_from_file_location("CisemConfig", os.path.join(_platform_core_dir, f))
                config_module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(config_module)
                break
except Exception as e:
    print(f"Warning: Failed to import CisemConfig dynamically: {e}")
    config_module = None

ROOT_DIR = config_module.ROOT_DIR if config_module else _sync_dir
BRAIN_ROOT = config_module.BRAIN_ROOT if config_module else os.path.abspath(os.path.join(ROOT_DIR, ".gemini", "antigravity", "brain"))

# Strict CISEM naming pattern: [Date]__[From]__[To]__[Description]__[Version].[ext]
NAMING_PATTERN = re.compile(
    r'^\d{4}-\d{2}-\d{2}__[A-Za-z0-9]+__[A-Za-z0-9]+__[A-Za-z0-9_]+__V[\d\.]+\.[a-zA-Z]+$'
)

CAEL_STATUS_PATH = os.path.join(ROOT_DIR, "cisem_core", "cael_status.json")

def increment_mechanism_trigger(mechanism_id):
    if not os.path.exists(CAEL_STATUS_PATH):
        return
    try:
        with open(CAEL_STATUS_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception:
        return
        
    registry = data.get("activation_registry", [])
    updated = False
    for mech in registry:
        if mech.get("mechanism_id") == mechanism_id:
            mech["actual_triggers"] = mech.get("actual_triggers", 0) + 1
            mech["last_triggered"] = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
            if mech["actual_triggers"] >= mech.get("validation_target", 0):
                mech["status"] = "VALIDATED"
            updated = True
            break
            
    if updated:
        try:
            with open(CAEL_STATUS_PATH, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        except Exception:
            pass

def validate_naming(filename):
    """
    Enforce strict CISEM naming policy before any document is written.
    Only validates files that start with a date prefix — config files are exempt.
    Raises NamingPolicyViolation if naming is violated.
    """
    if re.match(r'^\d{4}-\d{2}-\d{2}', filename):
        if not NAMING_PATTERN.match(filename):
            error_msg = (
                f"CISEM_SYNC_ERROR: Naming policy violation detected.\n"
                f"  File     : '{filename}'\n"
                f"  Required : [YYYY-MM-DD]__[From]__[To]__[Description]__[Version].[ext]\n"
                f"  Example  : 2026-08-06__CISEM__AntigravityLocal__AxiomsAndPrinciples__V1.12.md"
            )
            raise NamingPolicyViolation(error_msg)
    return True


def get_latest_brain_dir():
    if not os.path.exists(BRAIN_ROOT):
        print(f"Error: Brain root path does not exist: {BRAIN_ROOT}")
        return None
    subdirs = [os.path.join(BRAIN_ROOT, d) for d in os.listdir(BRAIN_ROOT)
               if os.path.isdir(os.path.join(BRAIN_ROOT, d)) and not d.startswith("temp") and not d.startswith(".")]
    if not subdirs:
        return None
    subdirs.sort(key=os.path.getmtime, reverse=True)
    return subdirs[0]

def clean_name(title):
    title = re.sub(r'(?i)implementation\s+plan\s*:\s*', '', title)
    title = re.sub(r'(?i)walkthrough\s*:\s*', '', title)
    title = title.replace("&", "and")
    title = title.replace("-", "_")
    title = re.sub(r'[^a-zA-Z0-9\s_]', '', title)
    title = re.sub(r'\s+', '_', title.strip())
    return title

def sync_document(src_filename, doc_type="Plan"):
    brain_dir = get_latest_brain_dir()
    if not brain_dir:
        print("Error: Could not determine active brain directory.")
        return False

    src_path = os.path.join(brain_dir, src_filename)
    if not os.path.exists(src_path):
        print(f"No source file found to sync at: {src_path}")
        return True  # Non-blocking if file not yet created

    with open(src_path, "r", encoding="utf-8") as f:
        content = f.read()

    title_match   = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    version_match = re.search(r'(?i)\*\*Version\*\*:\s*([\d\.]+)', content)
    date_match    = re.search(r'(?i)\*\*Date\*\*:\s*([\d-]+)', content)

    if not title_match:
        print(f"Error: Could not find document Title (# Header) in {src_filename}")
        return False

    raw_title = title_match.group(1).strip()

    if version_match:
        version = version_match.group(1).strip()
    else:
        title_v_match = re.search(r'(?i)V([\d\.]+)', raw_title)
        version = title_v_match.group(1).strip() if title_v_match else "1.0"

    date_str = date_match.group(1).strip() if date_match else datetime.today().strftime('%Y-%m-%d')

    clean_title = clean_name(raw_title)

    if doc_type == "Plan" and not clean_title.lower().endswith("plan"):
        clean_title += "_Plan"
    elif doc_type == "Walkthrough" and not clean_title.lower().endswith("walkthrough"):
        clean_title += "_Walkthrough"

    # Enforce strict CISEM naming standard for synced documents
    dest_filename = f"{date_str}__AntigravityLocal__YarivHuman__{clean_title}__V{version}.md"
    dest_path = os.path.join(ROOT_DIR, dest_filename)

    # V1.1: Validate naming BEFORE writing to workspace
    validate_naming(dest_filename)

    if os.path.exists(dest_path):
        with open(dest_path, "r", encoding="utf-8") as f:
            dest_content = f.read()
        if dest_content == content:
            print(f"Document {dest_filename} is already up to date.")
            return True

    with open(dest_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Successfully synchronized and versioned: {dest_filename}")
    return True

def run_sync():
    print("=== CISEM Document Auto-Sync Process (V1.2) ===")
    try:
        plan_ok = sync_document("implementation_plan.md", "Plan")
        walk_ok = sync_document("walkthrough.md", "Walkthrough")
        if not plan_ok or not walk_ok:
            raise SyncError("Document sync returned False status.")
        increment_mechanism_trigger("CISEM-SYNC-V1.1")
        print("=== Sync Completed Successfully ===")
    except (NamingPolicyViolation, SyncError) as e:
        print(f"FATAL SYNC ERROR:\n{e}")
        sys.exit(1)
    sys.exit(0)

if __name__ == "__main__":
    run_sync()
