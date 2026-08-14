# =============================================================================
# File           : 2026-08-14__CisemCsAg__Security__SecretLiteralLinter__V1.1.py
# Ratified plan  : CISEM-IP-20260814-SECURITY-HARDENING v1.0 (Step 9, V1.1)
# Architectural  : Check C upgraded: variable-name classification replaces URL
#                  exclusion list. Targets semantic intent (variable protects a
#                  secret) not value shape. Check B window expanded 8→20 lines.
# Change from V1.0:
#   - Check C: Only flag if env var name contains secret|token|key|password|
#              credential|signing (case-insensitive). Eliminates URL false positives
#              without accumulating exclusion rules. Per U1.2.32.
#   - Check B: WINDOW_LINES raised from 8 to 20.
# Parent axioms  : AX-SECURITY-01 (AGENTS.md ss15), AX-ENV-01 (AGENTS.md ss16)
# History:
#   2026-08-14 V1.0 - Initial build, three checks, grep-class defect prevention
#   2026-08-14 V1.1 - Check C variable-name filter; Check B window 8→20
# =============================================================================
"""
CISEM Security Linter V1.1 - three checks:

  C  String literal as fallback for a secret, key, or signing value
       Only flags if the env variable name contains:
       secret | token | key | password | credential | signing
  A  Environment guard where the safe state requires an affirmative value
  B  Request header read without adjacent signature verification (window=20)

Usage:
    uv run python cisem_core/security/2026-08-14__CisemCsAg__Security__SecretLiteralLinter__V1.1.py [root_dir]

Exit codes: 0 clean / 1 findings
"""

import re, sys, os
from pathlib import Path
from dataclasses import dataclass
from typing import List

PYTHON_EXTS = {".py"}
TS_EXTS = {".ts", ".tsx", ".js", ".jsx"}
ALL_EXTS = PYTHON_EXTS | TS_EXTS
SKIP_DIRS = {".venv", "node_modules", ".git", "__pycache__", ".next", "dist", "build"}

# Check C — captures (var_name, fallback_literal)
PY_SECRET_FALLBACK  = re.compile(r'os\.environ\.get\(\s*["\']([^"\']+)["\']\s*,\s*["\']([^"\']{3,})["\']')
TS_SECRET_FALLBACK  = re.compile(r'process\.env\.(\w+)\s*\|\|\s*["\']([^"\']{3,})["\']')

# Variable name must contain one of these terms to be flagged (semantic intent)
SECRET_VAR_TERMS    = re.compile(r'secret|token|key|password|credential|signing', re.IGNORECASE)

# Check A
PY_FAILOPEN_GUARD   = re.compile(r'os\.environ\.get\([^)]+\)\s*==\s*["\']production["\']')
TS_FAILOPEN_GUARD   = re.compile(r'process\.env\.\w+\s*===?\s*["\']production["\']|process\.env\.\w+\s*!==?\s*["\']development["\']')

# Check B
PY_HEADER_TRUST     = re.compile(r'request\.headers\.get\(["\']x-tenant[^"\']*["\']\)')
PY_HMAC_VERIFY      = re.compile(r'hmac\.compare_digest|hmac\.new|hmac\.HMAC')
WINDOW_LINES        = 20  # expanded from 8

@dataclass
class Finding:
    check: str
    file: str
    line: int
    content: str
    detail: str

def collect_files(root: Path) -> List[Path]:
    result = []
    for path in root.rglob("*"):
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        if path.is_file() and path.suffix in ALL_EXTS:
            result.append(path)
    return sorted(result)

def check_file(path: Path, lines: List[str]) -> List[Finding]:
    findings = []
    is_py = path.suffix in PYTHON_EXTS
    for i, raw in enumerate(lines):
        ln = i + 1
        s = raw.rstrip()

        # Check C — variable-name-classified
        if is_py:
            m = PY_SECRET_FALLBACK.search(s)
            if m and SECRET_VAR_TERMS.search(m.group(1)):
                findings.append(Finding("C", str(path), ln, s.strip(),
                    f"os.environ.get('{m.group(1)}') with hardcoded fallback: '{m.group(2)}'"))
        else:
            m = TS_SECRET_FALLBACK.search(s)
            if m and SECRET_VAR_TERMS.search(m.group(1)):
                findings.append(Finding("C", str(path), ln, s.strip(),
                    f"process.env.{m.group(1)} fallback to literal: '{m.group(2)}'"))

        # Check A
        if is_py and PY_FAILOPEN_GUARD.search(s):
            findings.append(Finding("A", str(path), ln, s.strip(),
                "Fail-open: absent env defaults to unsafe (not production)"))
        elif not is_py and TS_FAILOPEN_GUARD.search(s):
            findings.append(Finding("A", str(path), ln, s.strip(),
                "Fail-open: === 'production' or !== 'development' unsafe on absent env"))

        # Check B — header read without adjacent HMAC (window=20)
        if is_py and PY_HEADER_TRUST.search(s):
            ws, we = max(0, i - WINDOW_LINES), min(len(lines), i + WINDOW_LINES + 1)
            if not PY_HMAC_VERIFY.search("".join(lines[ws:we])):
                findings.append(Finding("B", str(path), ln, s.strip(),
                    f"x-tenant* header read without hmac verification within {WINDOW_LINES} lines"))

    return findings

def scratch_reachable(path: Path, root: Path) -> bool:
    stem = path.stem
    pat = re.compile(rf'\bimport\b.*\b{re.escape(stem)}\b|\bfrom\b.*\b{re.escape(stem)}\b')
    for c in root.rglob("*.py"):
        if "scratch" in c.parts or any(p in SKIP_DIRS for p in c.parts):
            continue
        try:
            if pat.search(c.read_text(encoding="utf-8", errors="replace")):
                return True
        except Exception:
            pass
    return False

def main():
    root = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
    print(f"CISEM Secret Literal Linter v1.1  Root: {root}")
    print("Checks: C=secret-literal(var-name-classified)  A=fail-open-guard  B=header-trust(w=20)")
    print("-" * 72)

    files = collect_files(root)
    all_findings: List[Finding] = []
    scratch_files = []

    for path in files:
        try:
            lines = path.read_text(encoding="utf-8", errors="replace").splitlines(keepends=True)
        except Exception as e:
            print(f"  [SKIP] {path}: {e}")
            continue
        if "scratch" in path.parts:
            scratch_files.append(path)
        all_findings.extend(check_file(path, lines))

    print("\n[SCRATCH REACHABILITY]")
    if scratch_files:
        for sp in scratch_files:
            status = "REACHABLE - ESCALATE" if scratch_reachable(sp, root) else "isolated"
            print(f"  {sp.relative_to(root)}: {status}")
    else:
        print("  No scratch files found.")

    print("\n[FINDINGS]")
    labels = {
        "C": "CHECK C - Secret literal fallback (var-name classified)",
        "A": "CHECK A - Fail-open guard",
        "B": f"CHECK B - Header trust without HMAC (window={WINDOW_LINES})"
    }
    if not all_findings:
        print("  No findings. All checks passed.")
    else:
        for cid in ["C", "A", "B"]:
            group = [f for f in all_findings if f.check == cid]
            if not group:
                continue
            print(f"\n  {labels[cid]} ({len(group)} finding(s))")
            for f in group:
                rel = os.path.relpath(f.file, root)
                print(f"    {rel}:{f.line}")
                print(f"      code:   {f.content[:120]}")
                print(f"      detail: {f.detail}")

    total = len(all_findings)
    print(f"\n[SUMMARY]  {total} finding(s) across {len(files)} files scanned")
    sys.exit(1 if total > 0 else 0)

if __name__ == "__main__":
    main()
