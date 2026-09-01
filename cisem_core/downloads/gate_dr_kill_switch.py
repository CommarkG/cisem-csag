#!/usr/bin/env python3
"""
CISEM Defect Recurrence Rate (DRR) Kill-Switch Gate
Target: cisem_core/tools/gate_dr_kill_switch.py
Authority: Governor Yariv / Reviewer Claude / Antigravity
Rule: Blocks commit when Defect Recurrence Rate (DRR) > 0%, unless Governor Override Token present in C:\\Users\\finky\\secure\\.
"""

import sys
import os
import json
from datetime import datetime

# Import loop auditor
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from audit_defect_loops import analyze_defect_loops

OVERRIDE_TOKEN_PATH = r"C:\Users\finky\secure\cisem_governor_override.token"
OVERRIDE_LOG_PATH = r"C:\Users\finky\secure\governor_override_audit.log"

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
    override_active = False
    token_content = ""
    if os.path.exists(OVERRIDE_TOKEN_PATH):
        try:
            with open(OVERRIDE_TOKEN_PATH, "r", encoding="utf-8") as f:
                token_content = f.read().strip()
                if "GOVERNOR_RATIFIED_OVERRIDE_TOKEN" in token_content:
                    override_active = True
        except Exception:
            pass

    if override_active:
        # Append to un-editable Secure Audit Log
        try:
            os.makedirs(os.path.dirname(OVERRIDE_LOG_PATH), exist_ok=True)
            with open(OVERRIDE_LOG_PATH, "a", encoding="utf-8") as log_file:
                log_entry = f"[{datetime.utcnow().isoformat()}] GOVERNOR OVERRIDE USED | Token: {token_content} | Overridden Classes: {list(audit_summary['looping_classes'].keys())}\n"
                log_file.write(log_entry)
        except Exception as e:
            print(f"Warning: Could not write to Governor override audit log: {e}")

        print("============================================================")
        print("CISEM DRR KILL-SWITCH GATE > STATUS: PASSED (GOVERNOR OVERRIDE ACTIVE)")
        print("============================================================")
        print(f"Recurrent classes present ({recurrent_count}), but valid Governor Override Token detected.")
        print(f"Audit log appended at {OVERRIDE_LOG_PATH}.")
        return True
    else:
        print("============================================================")
        print("CISEM DRR KILL-SWITCH GATE > STATUS: BLOCKED (DRR KILL-SWITCH ACTIVE)")
        print("============================================================")
        print(f"Defect Recurrence Rate: {audit_summary['defect_recurrence_rate_percent']}%")
        print(f"Recurrent Looping Error Classes: {list(audit_summary['looping_classes'].keys())}")
        print("\nAction: Harden pre-commit gate rule OR Governor places valid token at C:\\Users\\finky\\secure\\cisem_governor_override.token.")
        return False

if __name__ == "__main__":
    workspace = sys.argv[1] if len(sys.argv) > 1 else None
    success = check_drr_kill_switch(workspace)
    sys.exit(0 if success else 1)
