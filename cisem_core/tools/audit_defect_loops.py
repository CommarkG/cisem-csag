#!/usr/bin/env python3
"""
CISEM Defect Loop & Recurrence Rate Auditor
Target: cisem_core/tools/audit_defect_loops.py
Authority: Governor Yariv / Reviewer Claude / Antigravity
Rule: Calculates Defect Recurrence Rate (DRR) & MTB-DCR from gate_audit_log.jsonl.
"""

import sys
import os
import json
from datetime import datetime

def analyze_defect_loops(workspace_dir=None):
    if workspace_dir is None:
        workspace_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    audit_log_path = os.path.join(workspace_dir, "cisem_core", "gate_audit_log.jsonl")
    registry_path = os.path.join(workspace_dir, "cisem_core", "defect_class_registry.json")

    events = []
    if os.path.exists(audit_log_path):
        with open(audit_log_path, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    try:
                        events.append(json.loads(line.strip()))
                    except Exception:
                        pass

    error_code_history = {}
    for event in events:
        code = event.get("gate_error_code")
        ts = event.get("timestamp", datetime.utcnow().isoformat())
        if code and code.startswith("GATE_ERR_"):
            if code not in error_code_history:
                error_code_history[code] = []
            error_code_history[code].append(ts)

    recurrent_classes = {}
    total_classes = len(error_code_history)
    recurrent_count = 0

    for code, timestamps in error_code_history.items():
        count = len(timestamps)
        is_recurrent = count > 1
        if is_recurrent:
            recurrent_count += 1
            recurrent_classes[code] = {
                "recurrence_count": count,
                "first_seen": timestamps[0],
                "last_seen": timestamps[-1],
                "status": "LOOPING_DEFECT_CLASS"
            }

    drr = (recurrent_count / total_classes * 100.0) if total_classes > 0 else 0.0

    summary = {
        "total_defect_classes": total_classes,
        "recurrent_defect_classes": recurrent_count,
        "defect_recurrence_rate_percent": round(drr, 2),
        "looping_classes": recurrent_classes,
        "status": "LOOPING" if recurrent_count > 0 else "DRAINING"
    }

    with open(registry_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    return summary

if __name__ == "__main__":
    workspace = sys.argv[1] if len(sys.argv) > 1 else None
    results = analyze_defect_loops(workspace)
    print("============================================================")
    print("CISEM DEFECT RECURRENCE RATE AUDIT (DRR)")
    print("============================================================")
    print(f"Total Defect Classes Logged: {results['total_defect_classes']}")
    print(f"Recurrent Defect Classes:    {results['recurrent_defect_classes']}")
    print(f"Defect Recurrence Rate:     {results['defect_recurrence_rate_percent']}%")
    print(f"System Status:              {results['status']}")
    print("============================================================")
    sys.exit(0 if results["recurrent_defect_classes"] == 0 else 1)
