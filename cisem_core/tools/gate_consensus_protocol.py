#!/usr/bin/env python3
"""
CISEM CONSENSUS PROTOCOL GATE (PERMANENT CARRIER SCRIPT)
Location: cisem_core/tools/gate_consensus_protocol.py

Enforces RULING FOUR of AGENTS.md & SECTION 8 of GEMINI.md:
Verifies that any proposal, recommendation, plan, or turn message carries a valid
4-Condition Consensus Banner Line and Builder Guard Line.
"""

import sys
import re

CONSENSUS_BANNER_PATTERN = re.compile(
    r"CONSENSUS\s*·\s*REVIEWER\s+POSITION:\s*\[?(stated|[a-zA-Z0-9_\-\s]+)\]?\s*·\s*BUILDER\s+POSITION:\s*\[?(stated|[a-zA-Z0-9_\-\s]+)\]?\s*·\s*ATTACKED:\s*\[?(both|one|yes)\]?\s*·\s*WHO\s+CONCEDED:\s*\[?(.*?)\]?",
    re.IGNORECASE
)

BUILDER_GUARD_PATTERN = re.compile(
    r"CONSENSUS\s+CHECK\s*—\s*POSITIONS\s+STATED:\s*\[?(both)\]?\s*·\s*ATTACKED:\s*\[?(yes|both|one)\]?\s*·\s*READY\s+FOR\s+THE\s+GOVERNOR:\s*\[?(yes|no.*?)\]?",
    re.IGNORECASE
)

def audit_text_content(text_content: str) -> dict:
    violations = []
    
    # 1. Check Mandatory Consensus Banner Line
    banner_match = CONSENSUS_BANNER_PATTERN.search(text_content)
    if not banner_match:
        violations.append("MISSING_CONSENSUS_BANNER: Message or document does not contain valid CONSENSUS banner line.")
    else:
        rev_pos, bld_pos, attacked, conceded = banner_match.groups()
        if rev_pos.strip().lower() in ["none", "neither", "unstated"]:
            violations.append("INVALID_REVIEWER_POSITION: Reviewer position cannot be 'none' or 'neither'.")
        if bld_pos.strip().lower() in ["none", "neither", "unstated"]:
            violations.append("INVALID_BUILDER_POSITION: Builder position cannot be 'none' or 'neither'.")
        if attacked.strip().lower() in ["neither", "none", "no"]:
            violations.append("INVALID_ATTACK_STATE: Attacked state cannot be 'neither' or 'none'. Both positions must be attacked.")

    # 2. Check Builder Guard Line
    guard_match = BUILDER_GUARD_PATTERN.search(text_content)
    if not guard_match:
        violations.append("MISSING_BUILDER_GUARD_LINE: Message does not contain valid BUILDER GUARD LINE.")

    return {
        "status": "PASSED" if not violations else "BLOCKED",
        "violations": violations
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: gate_consensus_protocol.py <file_path>")
        sys.exit(1)
        
    target_path = sys.argv[1]
    try:
        with open(target_path, "r", encoding="utf-8") as f:
            content = f.read()
        res = audit_text_content(content)
        print(f"STATUS: {res['status']}")
        if res["violations"]:
            for v in res["violations"]:
                print(f"  [X] {v}")
            sys.exit(1)
        else:
            print("  [OK] Consensus Banner and Builder Guard Line verified successfully.")
            sys.exit(0)
    except Exception as exc:
        print(f"GATE ERROR: {exc}")
        sys.exit(1)
