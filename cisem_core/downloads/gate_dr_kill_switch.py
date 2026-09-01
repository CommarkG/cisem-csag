#!/usr/bin/env python3
"""
CISEM Defect Recurrence Rate (DRR) Kill-Switch Gate
Target: cisem_core/tools/gate_dr_kill_switch.py
Authority: Governor Yariv / Reviewer Claude / Antigravity
Rule: Blocks commit when Defect Recurrence Rate (DRR) > 0%, unless a valid, un-expired Governor Override Token is present in C:\\Users\\finky\\secure\\.
"""

import sys
import os
import json
import re
from datetime import datetime, timezone

# Import loop auditor
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from audit_defect_loops import analyze_defect_loops

OVERRIDE_TOKEN_PATH = r"C:\Users\finky\secure\cisem_governor_override.token"
OVERRIDE_LOG_PATH = r"C:\Users\finky\secure\governor_override_audit.log"

def parse_iso_timestamp(ts_str):
    try:
        clean_ts = ts_str.strip().replace("Z", "+00:00")
        return datetime.fromisoformat(clean_ts).astimezone(timezone.utc)
    except Exception:
        return None

def check_drr_kill_switch(workspace_dir=None):
    if workspace_dir is None:
        workspace_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    audit_summary = analyze_defect_loops(workspace_dir)
    recurrent_count = audit_summary.get("recurrent_defect_classes", 0)

    if recurrent_count == 0:
        print("============================================================")
        print("CISEM DRR KILL-SWITCH GATE > STATUS: PASSED (DRAINING)")
        print("============================================================")
        print("Zero defect class recurrences detected. DRR = 0%.")
        return True

    # Recurrence detected! Check Governor Override Token
    if not os.path.exists(OVERRIDE_TOKEN_PATH):
        print("============================================================")
        print("CISEM DRR KILL-SWITCH GATE > STATUS: BLOCKED (DRR KILL-SWITCH ACTIVE)")
        print("============================================================")
        print(f"Defect Recurrence Rate: {audit_summary['defect_recurrence_rate_percent']}%")
        print(f"Recurrent Looping Error Classes: {list(audit_summary['looping_classes'].keys())}")
        print("\nAction: Harden pre-commit gate rule OR Governor places valid timestamped token at C:\\Users\\finky\\secure\\cisem_governor_override.token.")
        return False

    # Read and validate token content
    token_str = ""
    valid_until_dt = None
    try:
        with open(OVERRIDE_TOKEN_PATH, "r", encoding="utf-8") as f:
            raw_content = f.read().strip()
            
            # Try JSON format
            if raw_content.startswith("{"):
                token_data = json.loads(raw_content)
                token_str = token_data.get("token", "")
                ts_raw = token_data.get("valid_until", "")
                valid_until_dt = parse_iso_timestamp(ts_raw)
            else:
                # Key-value line format
                for line in raw_content.splitlines():
                    if "=" in line:
                        k, v = line.split("=", 1)
                        k_clean = k.strip().upper()
                        if k_clean == "TOKEN":
                            token_str = v.strip()
                        elif k_clean == "VALID_UNTIL":
                            valid_until_dt = parse_iso_timestamp(v.strip())

    except Exception as e:
        print("============================================================")
        print("CISEM DRR KILL-SWITCH GATE > STATUS: BLOCKED (MALFORMED OVERRIDE TOKEN)")
        print("============================================================")
        print(f"Failed to parse override token file: {e}")
        return False

    # Validation Checks
    if not token_str or "GOVERNOR_RATIFIED_OVERRIDE_TOKEN" not in token_str or valid_until_dt is None:
        print("============================================================")
        print("CISEM DRR KILL-SWITCH GATE > STATUS: BLOCKED (MALFORMED OVERRIDE TOKEN)")
        print("============================================================")
        print("Override token missing valid token string or valid_until ISO timestamp!")
        print("Required format: TOKEN=GOVERNOR_RATIFIED_OVERRIDE_TOKEN_2026\\nVALID_UNTIL=2026-09-01T15:00:00Z")
        return False

    now_utc = datetime.now(timezone.utc)
    if now_utc > valid_until_dt:
        print("============================================================")
        print("CISEM DRR KILL-SWITCH GATE > STATUS: BLOCKED (EXPIRED OVERRIDE TOKEN)")
        print("============================================================")
        print(f"Override token EXPIRED at {valid_until_dt.isoformat()} (Current UTC: {now_utc.isoformat()}).")
        print("Governor must issue a fresh timestamped token.")
        return False

    # Valid, un-expired token! Write to Governor audit log
    try:
        os.makedirs(os.path.dirname(OVERRIDE_LOG_PATH), exist_ok=True)
        with open(OVERRIDE_LOG_PATH, "a", encoding="utf-8") as log_file:
            log_entry = f"[{now_utc.isoformat()}] GOVERNOR OVERRIDE USED | Token: {token_str} | Valid Until: {valid_until_dt.isoformat()} | Overridden Classes: {list(audit_summary['looping_classes'].keys())}\n"
            log_file.write(log_entry)
    except Exception as e:
        print(f"Warning: Could not write to Governor override audit log: {e}")

    print("============================================================")
    print("CISEM DRR KILL-SWITCH GATE > STATUS: PASSED (GOVERNOR OVERRIDE ACTIVE)")
    print("============================================================")
    print(f"Recurrent classes present ({recurrent_count}), but valid un-expired Governor Override Token detected (Valid until {valid_until_dt.isoformat()}).")
    print(f"Audit log appended at {OVERRIDE_LOG_PATH}.")
    return True

if __name__ == "__main__":
    workspace = sys.argv[1] if len(sys.argv) > 1 else None
    success = check_drr_kill_switch(workspace)
    sys.exit(0 if success else 1)
