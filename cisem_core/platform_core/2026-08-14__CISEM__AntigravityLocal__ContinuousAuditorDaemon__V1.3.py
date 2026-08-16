#!/usr/bin/env python3
"""
# CISEM CODE HEADER — MANDATORY
# ratified_plan: CISEM-IP-20260810-CONSOLIDATED-MASTER-V17
# governor_signature: GOV-YARIV-20260810-GOVERNANCE-HARDENING-RATIFIED
# version: V1.3
# reasoning: |
#   Background daemon that polls workspace files for modifications and automatically
#   runs reconciler, sync, auditor, and ATV validation loops to ensure constant alignment.
#   Excluded status/report JSON files to break infinite cascade trigger loop.
#   V1.3 2026-08-14 (W5):
#     W5.1 — Write per-component pass/fail + heartbeat_utc to cael_status.json at end
#            of each audit cycle. Merge-write: existing keys preserved, only daemon
#            keys updated. Five other writers (activation_registry etc.) are unaffected.
#     W5.3 — Write daemon PID to cisem_core/logs/daemon.pid on startup so the external
#            liveness checker can confirm the process is alive (Option B, PID check).
#            PID file removed on clean KeyboardInterrupt exit.
#   Parent principles: AxiomsAndPrinciples V1.30 >AX-10000, >AX-50000.
# history:
#   - timestamp: "2026-08-10T13:05:00Z"
#     action: "EXCLUDED_JSON_STATE_FILES_TO_STOP_CASCADE_LOOP"
#     actor: "Gemini 3.5 Flash"
#     version: "1.1"
#   - timestamp: "2026-08-14T17:37:00Z"
#     action: "D1_REV_D2_REV_W1_3_STDOUT_STDERR_AGGREGATE_SUMMARY"
#     actor: "GOOGLE_ANTIGRAVITY_ADAPTER"
#     version: "1.2"
#   - timestamp: "2026-08-14T18:12:00Z"
#     action: "W5_PID_FILE_WRITE_AND_CAEL_STATUS_MERGE"
#     actor: "GOOGLE_ANTIGRAVITY_ADAPTER"
#     version: "1.3"
"""

import json
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
PID_FILE_PATH = os.path.join(LOG_DIR, "daemon.pid")  # W5.3: read by external liveness checker

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
        # D1-REV: log stdout AND stderr on BOTH branches. One change; fixes all four components.
        ok = res.returncode == 0
        log_message(
            f"{'OK' if ok else f'FAILED (code {res.returncode})'} | {os.path.basename(script_path)}"
            f"\n  stdout: {res.stdout.strip() or '(empty)'}"
            f"\n  stderr: {res.stderr.strip() or '(empty)'}"
        )
        return ok, res.stdout
    except Exception as e:
        log_message(f"Exception raised executing {script_path}: {e}")
        return False, str(e)

def execute_continuous_auditing():
    log_message("--- Modification Triggered Audit Loop ---")
    results = []   # D2-REV: collect (component, ok) across all four; run all regardless of failure

    # 1. Run Workspace Reconciler
    reconciler_path = None
    cxp_dir = os.path.join(CORE_DIR, "cxp")
    if os.path.exists(cxp_dir):
        for f in os.listdir(cxp_dir):
            if "WorkspaceReconciler" in f and f.endswith(".py"):
                reconciler_path = os.path.join(cxp_dir, f)
                break
    if reconciler_path:
        ok, _ = run_script(reconciler_path)
        results.append(("WorkspaceReconciler", ok))
    else:
        log_message("Warning: WorkspaceReconciler not found.")
        results.append(("WorkspaceReconciler", None))

    # 2. Run CisemSync
    sync_path = os.path.join(CORE_DIR, "CisemSync.py")
    if os.path.exists(sync_path):
        ok, _ = run_script(sync_path)
        results.append(("CisemSync", ok))
    else:
        log_message("Warning: CisemSync not found.")
        results.append(("CisemSync", None))

    # 3. Run CisemAuditor (mock suite audit)
    auditor_path = os.path.join(CORE_DIR, "sandbox", "CisemAuditor.py")
    if os.path.exists(auditor_path):
        ok, _ = run_script(auditor_path)
        results.append(("CisemAuditor", ok))
    else:
        log_message("Warning: CisemAuditor not found.")
        results.append(("CisemAuditor", None))

    # 4. Run CisemATV (Anti-Theater Validator)
    atv_path = os.path.join(CORE_DIR, "sandbox", "CisemATV.py")
    if os.path.exists(atv_path):
        ok, _ = run_script(atv_path)
        results.append(("CisemATV", ok))
    else:
        log_message("Warning: CisemATV not found.")
        results.append(("CisemATV", None))

    # D2-REV: one summary per cycle; loop never halts on failure
    # W1.3: count line "N of 4 components OK"
    _STATUS = {True: "OK", False: "FAILED", None: "NOT_FOUND"}
    ok_count = sum(1 for _, ok in results if ok is True)
    summary = "\n".join(f"  {c}: {_STATUS[ok]}" for c, ok in results)
    log_message(f"--- Audit Cycle Summary ---\n{summary}\n  {ok_count} of 4 components OK")
    log_message("----------------------------------------")

    # W5.1: Merge-write heartbeat_utc + per-component status to cael_status.json.
    # Read existing content first so other writers' keys are preserved.
    _write_cael_status(results, ok_count)

def _write_cael_status(results, ok_count):
    """W5.1: Merge-write per-component pass/fail and heartbeat_utc to cael_status.json.
    Existing keys (activation_registry etc.) are preserved — only daemon keys updated."""
    heartbeat = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    _STATUS = {True: "OK", False: "FAILED", None: "NOT_FOUND"}
    new_data = {
        "heartbeat_utc": heartbeat,
        "last_cycle": heartbeat,
        "components": {name: _STATUS[ok] for name, ok in results},
        "ok_count": ok_count,
        "total": len(results),
    }
    existing = {}
    if os.path.exists(CAEL_STATUS_PATH):
        try:
            with open(CAEL_STATUS_PATH, "r", encoding="utf-8") as f:
                existing = json.load(f)
        except Exception:
            pass  # corrupt or empty — overwrite with new data only
    existing.update(new_data)  # merge: daemon keys overwrite, all others preserved
    try:
        with open(CAEL_STATUS_PATH, "w", encoding="utf-8") as f:
            json.dump(existing, f, indent=2)
    except Exception as e:
        log_message(f"Warning: could not write cael_status.json: {e}")


def main():
    log_message("Continuous Auditor Daemon V1.3 Started.")
    log_message(f"Monitoring Directory: {ROOT_DIR}")

    # W5.3: Write PID so external liveness checker can confirm process is alive.
    try:
        with open(PID_FILE_PATH, "w", encoding="utf-8") as f:
            f.write(str(os.getpid()))
        log_message(f"PID {os.getpid()} written to {PID_FILE_PATH}")
    except Exception as e:
        log_message(f"Warning: could not write PID file: {e}")

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
            try:
                if os.path.exists(PID_FILE_PATH):
                    os.remove(PID_FILE_PATH)
                    log_message("PID file removed on clean shutdown.")
            except Exception:
                pass
            break
        except Exception as e:
            log_message(f"Unexpected error in monitor loop: {e}")
            time.sleep(5.0)

if __name__ == "__main__":
    main()
