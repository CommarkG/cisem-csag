#!/usr/bin/env python3
"""
# CISEM CODE HEADER — MANDATORY
# ratified_plan: CISEM-IP-20260810-CONSOLIDATED-MASTER-V17
# governor_signature: GOV-YARIV-20260810-GOVERNANCE-HARDENING-RATIFIED
# version: V1.1
# reasoning: |
#   Background daemon that polls workspace files for modifications and automatically
#   runs reconciler, sync, auditor, and ATV validation loops to ensure constant alignment.
#   Excluded status/report JSON files to break infinite cascade trigger loop.
#   Parent principles: AxiomsAndPrinciples V1.30 >AX-10000, >AX-50000.
# history:
#   - timestamp: "2026-08-10T13:05:00Z"
#     action: "EXCLUDED_JSON_STATE_FILES_TO_STOP_CASCADE_LOOP"
#     actor: "Gemini 3.5 Flash"
#     version: "1.1"
"""

import os
import sys
import time
import subprocess
from datetime import datetime, timezone

# Dynamic Config Import
_current_dir = os.path.dirname(os.path.abspath(__file__))
if _current_dir not in sys.path:
    sys.path.insert(0, _current_dir)

try:
    import importlib.util
    config_module = None
    for f in os.listdir(_current_dir):
        if "CisemConfig" in f and f.endswith(".py"):
            spec = importlib.util.spec_from_file_location("CisemConfig", os.path.join(_current_dir, f))
            config_module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(config_module)
            break
except Exception as e:
    print(f"Warning: Failed to import CisemConfig in daemon: {e}")
    config_module = None

ROOT_DIR = config_module.ROOT_DIR if config_module else os.path.dirname(os.path.dirname(_current_dir))
CORE_DIR = config_module.CORE_DIR if config_module else os.path.dirname(_current_dir)
CAEL_STATUS_PATH = config_module.CAEL_STATUS_PATH if config_module else os.path.join(CORE_DIR, "cael_status.json")

# Log paths
# Exclude log dir from walk entirely
LOG_DIR = os.path.join(CORE_DIR, "logs")
os.makedirs(LOG_DIR, exist_ok=True)
DAEMON_LOG_PATH = os.path.join(LOG_DIR, "continuous_auditor.log")

def log_message(msg):
    timestamp = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    formatted = f"[{timestamp}] [ContinuousAuditorDaemon] {msg}"
    print(formatted)
    try:
        with open(DAEMON_LOG_PATH, "a", encoding="utf-8") as f:
            f.write(formatted + "\n")
    except Exception as e:
        print(f"Failed to write to log file: {e}")

def get_file_modification_states():
    """Scan root directory and collect last modified times for tracked files."""
    states = {}
    ignore_files = {
        "cael_status.json",
        "cisem_turn_counter.json",
        "atv_report.json",
        "orchestration_trial_report.json",
        "root_cause_registry.json"
    }
    for root, dirs, files in os.walk(ROOT_DIR):
        if any(x in root for x in [".git", ".next", "node_modules", "cisem_core/logs", ".gemini"]):
            continue
        for f in files:
            if f in ignore_files:
                continue
            if f.endswith((".py", ".ts", ".tsx", ".md", ".json", ".yaml", ".sql")):
                full_path = os.path.join(root, f)
                try:
                    states[full_path] = os.path.getmtime(full_path)
                except Exception:
                    pass
    return states

def run_script(script_path, args=None):
    if args is None:
        args = []
    log_message(f"Executing: python {script_path} {' '.join(args)}")
    try:
        kwargs = {"capture_output": True, "text": True}
        if sys.platform == "win32":
            kwargs["creationflags"] = subprocess.CREATE_NO_WINDOW
        res = subprocess.run([sys.executable, script_path] + args, cwd=ROOT_DIR, **kwargs)
        if res.returncode == 0:
            log_message(f"Success executing {os.path.basename(script_path)}")
            return True, res.stdout
        else:
            log_message(f"Error executing {os.path.basename(script_path)} (Code: {res.returncode}):\n{res.stderr}")
            return False, res.stderr
    except Exception as e:
        log_message(f"Exception raised executing {script_path}: {e}")
        return False, str(e)

def execute_continuous_auditing():
    log_message("--- Modification Triggered Audit Loop ---")
    
    # 1. Run Workspace Reconciler
    reconciler_path = None
    cxp_dir = os.path.join(CORE_DIR, "cxp")
    if os.path.exists(cxp_dir):
        for f in os.listdir(cxp_dir):
            if "WorkspaceReconciler" in f and f.endswith(".py"):
                reconciler_path = os.path.join(cxp_dir, f)
                break
    if reconciler_path:
        run_script(reconciler_path)
    else:
        log_message("Warning: WorkspaceReconciler not found.")

    # 2. Run CisemSync
    sync_path = os.path.join(CORE_DIR, "CisemSync.py")
    if os.path.exists(sync_path):
        run_script(sync_path)
    else:
        log_message("Warning: CisemSync not found.")

    # 3. Run CisemAuditor (mock suite audit)
    auditor_path = os.path.join(CORE_DIR, "sandbox", "CisemAuditor.py")
    if os.path.exists(auditor_path):
        run_script(auditor_path)
    else:
        log_message("Warning: CisemAuditor not found.")

    # 4. Run CisemATV (Anti-Theater Validator)
    atv_path = os.path.join(CORE_DIR, "sandbox", "CisemATV.py")
    if os.path.exists(atv_path):
        run_script(atv_path)
    else:
        log_message("Warning: CisemATV not found.")

    log_message("----------------------------------------")

def main():
    log_message("Continuous Auditor Daemon V1.0 Started.")
    log_message(f"Monitoring Directory: {ROOT_DIR}")
    
    last_states = get_file_modification_states()
    log_message(f"Initial scan indexed {len(last_states)} tracked files.")

    while True:
        try:
            time.sleep(2.0)
            current_states = get_file_modification_states()
            
            changed = False
            for path, mtime in current_states.items():
                if path not in last_states:
                    log_message(f"Detected newly created file: {path}")
                    changed = True
                elif last_states[path] != mtime:
                    log_message(f"Detected modification in: {path}")
                    changed = True
                    
            for path in list(last_states.keys()):
                if path not in current_states:
                    log_message(f"Detected deleted file: {path}")
                    changed = True
            
            last_states = current_states
            
            if changed:
                execute_continuous_auditing()
                
        except KeyboardInterrupt:
            log_message("Continuous Auditor Daemon Shutting Down via KeyboardInterrupt.")
            break
        except Exception as e:
            log_message(f"Unexpected error in monitor loop: {e}")
            time.sleep(5.0)

if __name__ == "__main__":
    main()
