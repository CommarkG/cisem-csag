#!/usr/bin/env python3
"""
# CISEM CODE HEADER — MANDATORY
# ratified_plan: CISEM-IP-20260810-CONSOLIDATED-MASTER-V17
# governor_signature: GOV-YARIV-20260810-GOVERNANCE-HARDENING-RATIFIED
# version: V1.0
# reasoning: |
#   External liveness checker for the ContinuousAuditorDaemon.
#   W5.3 Option B (PID check) — approved by Governor 2026-08-14.
#
#   Two independent conditions MUST both pass for the daemon to be
#   considered alive and healthy:
#     1. Process with the recorded PID exists in the OS process table.
#     2. heartbeat_utc in cael_status.json is < 5 minutes old.
#
#   Rationale for requiring BOTH:
#     - Condition 1 alone: a hung (zombie) process satisfies it; daemon
#       appears alive but has stopped processing.
#     - Condition 2 alone: heartbeat written by daemon cannot prove liveness;
#       a process that crashed after writing is indistinguishable.
#     - Together they establish that a process with that PID was actively
#       writing within the last 5 minutes — the best achievable external proof.
#
#   Exit codes:
#     0 = alive and healthy (both conditions met)
#     1 = dead or hung (either condition failed)
#     2 = configuration error (PID file or status file missing entirely)
#
#   Parent principles: AxiomsAndPrinciples V1.30 >AX-10000.
"""

import json
import os
import subprocess
import sys
from datetime import datetime, timezone, timedelta

# --- Path resolution -------------------------------------------------------
_current_dir = os.path.dirname(os.path.abspath(__file__))

try:
    import importlib.util
    config_module = None
    for f in os.listdir(_current_dir):
        if "CisemConfig" in f and f.endswith(".py"):
            spec = importlib.util.spec_from_file_location(
                "CisemConfig", os.path.join(_current_dir, f)
            )
            config_module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(config_module)
            break
except Exception:
    config_module = None

CORE_DIR = config_module.CORE_DIR if config_module else os.path.dirname(_current_dir)
LOG_DIR = os.path.join(CORE_DIR, "logs")
PID_FILE_PATH = os.path.join(LOG_DIR, "daemon.pid")

CAEL_STATUS_PATH = (
    config_module.CAEL_STATUS_PATH
    if config_module
    else os.path.join(CORE_DIR, "cael_status.json")
)

HEARTBEAT_STALE_MINUTES = 5   # threshold — Governor-approved

# ---------------------------------------------------------------------------


def process_exists_windows(pid: int) -> bool:
    """Check if a process with the given PID is in the Windows process table.
    Uses 'tasklist' — no psutil required, no elevation needed."""
    try:
        result = subprocess.run(
            ["tasklist", "/FI", f"PID eq {pid}", "/NH"],
            capture_output=True,
            text=True,
        )
        # tasklist output contains the PID number when the process exists
        return str(pid) in result.stdout
    except Exception as e:
        print(f"  [LIVENESS] tasklist query failed: {e}", file=sys.stderr)
        return False


def check_liveness() -> int:
    """
    Run both liveness conditions.
    Returns: 0 = alive+healthy, 1 = dead or hung, 2 = config error.
    """
    print("=== CISEM Daemon Liveness Check ===")
    now = datetime.now(timezone.utc)

    # ---- Condition 1: PID file exists and process is alive ----------------
    if not os.path.exists(PID_FILE_PATH):
        print(f"FAIL [C1] PID file not found: {PID_FILE_PATH}")
        print("  Daemon was never started or crashed before writing PID.")
        print("VERDICT: DEAD (config error — no PID file)")
        return 2

    try:
        with open(PID_FILE_PATH, "r", encoding="utf-8") as f:
            pid = int(f.read().strip())
    except (ValueError, OSError) as e:
        print(f"FAIL [C1] Could not read PID file: {e}")
        print("VERDICT: DEAD (PID file unreadable)")
        return 2

    print(f"[C1] PID file found. Recorded PID: {pid}")
    c1_alive = process_exists_windows(pid)
    if c1_alive:
        print(f"PASS [C1] Process {pid} exists in OS process table.")
    else:
        print(f"FAIL [C1] Process {pid} NOT found in OS process table.")

    # ---- Condition 2: heartbeat_utc is recent enough ----------------------
    if not os.path.exists(CAEL_STATUS_PATH):
        print(f"FAIL [C2] cael_status.json not found: {CAEL_STATUS_PATH}")
        print("  Daemon has never completed an audit cycle.")
        c2_fresh = False
        heartbeat_age_str = "N/A"
    else:
        try:
            with open(CAEL_STATUS_PATH, "r", encoding="utf-8") as f:
                status = json.load(f)
        except Exception as e:
            print(f"FAIL [C2] Could not parse cael_status.json: {e}")
            c2_fresh = False
            heartbeat_age_str = "parse error"
        else:
            heartbeat_str = status.get("heartbeat_utc")
            if not heartbeat_str:
                print("FAIL [C2] heartbeat_utc key missing from cael_status.json.")
                c2_fresh = False
                heartbeat_age_str = "key missing"
            else:
                try:
                    heartbeat_dt = datetime.fromisoformat(
                        heartbeat_str.replace("Z", "+00:00")
                    )
                    age = now - heartbeat_dt
                    heartbeat_age_str = f"{age.total_seconds():.0f}s ago"
                    threshold = timedelta(minutes=HEARTBEAT_STALE_MINUTES)
                    c2_fresh = age < threshold
                    if c2_fresh:
                        print(
                            f"PASS [C2] heartbeat_utc is {heartbeat_age_str} "
                            f"(threshold: {HEARTBEAT_STALE_MINUTES} min)."
                        )
                    else:
                        print(
                            f"FAIL [C2] heartbeat_utc is STALE: {heartbeat_age_str} "
                            f"(threshold: {HEARTBEAT_STALE_MINUTES} min). "
                            "Daemon is alive-but-hung or was killed."
                        )
                except (ValueError, TypeError) as e:
                    print(f"FAIL [C2] Could not parse heartbeat_utc '{heartbeat_str}': {e}")
                    c2_fresh = False
                    heartbeat_age_str = "parse error"

    # ---- Verdict ----------------------------------------------------------
    print("")
    if c1_alive and c2_fresh:
        print(f"VERDICT: ALIVE  (PID {pid} running | heartbeat {heartbeat_age_str})")
        return 0
    elif c1_alive and not c2_fresh:
        print(
            f"VERDICT: HUNG   (PID {pid} running but heartbeat stale: {heartbeat_age_str})"
        )
        return 1
    elif not c1_alive and c2_fresh:
        print(
            f"VERDICT: DEAD   (PID {pid} not in process table; "
            f"heartbeat still fresh at {heartbeat_age_str} — "
            "PID was reused or file is stale)"
        )
        return 1
    else:
        print(
            f"VERDICT: DEAD   (PID {pid} not running | heartbeat stale: {heartbeat_age_str})"
        )
        return 1


if __name__ == "__main__":
    exit_code = check_liveness()
    sys.exit(exit_code)
