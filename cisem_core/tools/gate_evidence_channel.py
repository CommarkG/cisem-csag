#!/usr/bin/env python3
"""
CISEM Evidence Channel Pre-Commit Gate
Target: cisem_core/tools/gate_evidence_channel.py
Authority: Governor Yariv / Reviewer Claude / Antigravity
Rule: Rule 3 - Multi-Channel Completeness Law.
"""

import sys
import os
import re

def run_evidence_channel_check(target_file=None):
    workspace_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    files_to_scan = []
    if target_file and os.path.exists(target_file):
        files_to_scan.append(target_file)
    else:
        planning_dir = os.path.join(workspace_dir, "cisem_core", "planning")
        if os.path.exists(planning_dir):
            for fname in os.listdir(planning_dir):
                if fname.endswith(".md"):
                    files_to_scan.append(os.path.join(planning_dir, fname))

    valid_channels = {
        "[CODE-CHANNEL]", "[DATABASE-CHANNEL]",
        "[RUNTIME-HOST-CHANNEL]", "[GOVERNOR-VISUAL-CHANNEL]",
        "[FILE-EVIDENCE]", "[VERIFIED]"
    }

    cost_count_keywords = re.compile(r'(cost|file count|object count|coverage audit|total count)', re.IGNORECASE)

    violations = []
    for filepath in files_to_scan:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            lines = f.readlines()
            for idx, line in enumerate(lines, 1):
                if cost_count_keywords.search(line):
                    # Check if this line or adjacent lines carry a valid channel tag
                    chunk = "".join(lines[max(0, idx-3):min(len(lines), idx+3)])
                    if not any(tag in chunk for tag in valid_channels):
                        violations.append({
                            "file": os.path.basename(filepath),
                            "line": idx,
                            "content": line.strip()
                        })

    if violations:
        print("============================================================")
        print("CISEM EVIDENCE CHANNEL GATE > STATUS: BLOCKED")
        print("============================================================")
        print(f"Found {len(violations)} un-tagged cost/count/coverage claim(s):")
        for v in violations:
            print(f"  - File: {v['file']} (Line {v['line']}) | Claim: '{v['content']}'")
        print("\nAction: Add channel declaration tag ([CODE-CHANNEL], [DATABASE-CHANNEL], [GOVERNOR-VISUAL-CHANNEL]).")
        return False
    else:
        print("============================================================")
        print("CISEM EVIDENCE CHANNEL GATE > STATUS: PASSED")
        print("============================================================")
        print(f"Scanned {len(files_to_scan)} file(s). All cost/count claims carry explicit channel tags.")
        return True

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else None
    success = run_evidence_channel_check(target)
    sys.exit(0 if success else 1)
