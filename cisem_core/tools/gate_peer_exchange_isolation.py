#!/usr/bin/env python3
"""
CISEM Peer Platform Decoupled Isolation Gate
Target: cisem_core/tools/gate_peer_exchange_isolation.py
Authority: Governor Yariv / Reviewer Claude / Antigravity
Rule: Verifies zero direct code/DB coupling between CISEM and CSP/CSPS peer platforms.
      Enforces that all cross-platform learning routes through 9000__INTERSYSTEM_EXECUTION_EXCHANGE/.
"""

import sys
import os
import re

def audit_peer_isolation(workspace_dir=None):
    if workspace_dir is None:
        workspace_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    prohibited_patterns = [
        re.compile(r'\b(?:import|from)\s+csps\b', re.IGNORECASE),
        re.compile(r'\b(?:import|from)\s+csp\b', re.IGNORECASE),
        re.compile(r'postgres://[^\s]*csps[^\s]*', re.IGNORECASE),
        re.compile(r'postgres://[^\s]*csp[^\s]*', re.IGNORECASE),
    ]

    violations = []
    scan_dirs = [
        os.path.join(workspace_dir, "src"),
        os.path.join(workspace_dir, "backend")
    ]

    for sdir in scan_dirs:
        if os.path.exists(sdir):
            for root, _, files in os.walk(sdir):
                for f in files:
                    if f.endswith((".ts", ".tsx", ".js", ".jsx", ".py", ".sql")):
                        fpath = os.path.join(root, f)
                        try:
                            with open(fpath, "r", encoding="utf-8", errors="ignore") as fo:
                                content = fo.read()
                                for pat in prohibited_patterns:
                                    if pat.search(content):
                                        rel_path = os.path.relpath(fpath, workspace_dir)
                                        violations.append(f"Prohibited Peer Coupling: File '{rel_path}' contains direct CSP/CSPS import or DB string.")
                        except Exception:
                            pass

    if violations:
        print("============================================================")
        print("CISEM PEER EXCHANGE ISOLATION GATE > STATUS: BLOCKED")
        print("============================================================")
        print(f"Found {len(violations)} direct peer coupling violation(s):")
        for v in set(violations):
            print(f"  - [RULE VIOLATION]: {v}")
        print("\nAction: Remove direct code/DB imports. Route cross-platform learning through 9000__INTERSYSTEM_EXECUTION_EXCHANGE/.")
        return False
    else:
        print("============================================================")
        print("CISEM PEER EXCHANGE ISOLATION GATE > STATUS: PASSED")
        print("============================================================")
        print("Zero direct peer code or database coupling detected. Isolation maintained.")
        return True

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else None
    success = audit_peer_isolation(target)
    sys.exit(0 if success else 1)
