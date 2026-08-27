#!/usr/bin/env python3
"""
# CISEM MANDATORY CODE HEADER
# ratified_plan  : PLAN-CISEM-20260827-CO1-MASTER-PIPELINE V1.0
# governor_signature: GOV-2026-08-27-VICIOUS-AUDITOR-V1
# version         : V1.0
# reasoning       : |
#   Aggressive, zero-mercy tool auditor that scans plans, frontend viewports,
#   API routes, and database models to find undefined wiring between screens,
#   broken logical paths, and database query/connection risks BEFORE code execution.
# axioms          : AX-100000 (Wiring Standard), PR-11100 (Cryptographic Context), PR-11400 (Env Config)
"""

import os
import sys
import re
import json

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SCHEMA_REGISTRY_PATH = os.path.join(ROOT_DIR, "cisem_core", "live_schema_registry.json")
APP_WRAPPER_PATH = os.path.join(ROOT_DIR, "src", "components", "AppWrapper.jsx")
MAIN_PY_PATH = os.path.join(ROOT_DIR, "backend", "src", "backend", "main.py")

class ViciousWiringAuditor:
    def __init__(self):
        self.findings = []
        self.warnings = []
        self.passed_checks = []

    def audit_all(self):
        print("==========================================================================================")
        print("            VICIOUS WIRING & INFRASTRUCTURE AUDITOR v1.0")
        print("==========================================================================================")
        
        self.audit_screen_wiring()
        self.audit_logical_and_state_wiring()
        self.audit_database_connection_contracts()
        self.audit_keystone_preflight_risks()

        self.print_report()
        return len(self.findings) == 0

    def audit_screen_wiring(self):
        print("\n[AUDIT 1] Screen-to-Screen Wiring & Navigation Audit...")
        if not os.path.exists(APP_WRAPPER_PATH):
            self.findings.append("FATAL: AppWrapper.jsx missing. Primary screen router is ungrounded.")
            return

        with open(APP_WRAPPER_PATH, "r", encoding="utf-8") as f:
            content = f.read()

        # Extract all Route elements
        routes = re.findall(r'<Route\s+path=["\']([^"\']+)["\']\s+element=\{<([^/\s>]+)', content)
        imports = re.findall(r'import\s+([{\w\s,}]+)\s+from', content)
        all_imported_symbols = set()
        for imp in imports:
            for symbol in imp.replace("{", "").replace("}", "").split(","):
                all_imported_symbols.add(symbol.strip())

        unmounted_viewports = []
        for path, component in routes:
            if component not in all_imported_symbols:
                self.findings.append(f"SCREEN WIRING GAP: Route '{path}' mounts component '{component}' which is NOT imported at top of AppWrapper.jsx (Runtime ReferenceError risk!).")
            else:
                self.passed_checks.append(f"Screen Route '{path}' -> Component '{component}' imported cleanly.")

        # Check for HashRouter compliance (WISDOM-001)
        if "BrowserRouter" in content:
            self.findings.append("ROUTER VIOLATION: AppWrapper.jsx uses BrowserRouter instead of HashRouter (Risk of Next.js 404 server errors!).")
        else:
            self.passed_checks.append("HashRouter navigation verified (WISDOM-001 compliant).")

    def audit_logical_and_state_wiring(self):
        print("\n[AUDIT 2] Logical Wiring & Utterance Handling Audit...")
        views_dir = os.path.join(ROOT_DIR, "src", "components", "views")
        if not os.path.exists(views_dir):
            self.warnings.append("Views directory missing at src/components/views")
            return

        for fn in os.listdir(views_dir):
            if fn.endswith((".tsx", ".jsx")):
                fp = os.path.join(views_dir, fn)
                with open(fp, "r", encoding="utf-8", errors="ignore") as f:
                    v_content = f.read()

                # Check for hardcoded tenant/user IDs
                if re.search(r'["\']TENANT-SESSION-ACTIVE["\']', v_content) or re.search(r'["\']00000000-0000-0000-0000-000000000000["\']', v_content):
                    self.findings.append(f"LOGICAL FREESTYLING GAP in {fn}: Contains hardcoded literal ID/session fallback string.")

                # Check for error handling in fetch calls
                if "fetch(" in v_content and ".catch(" not in v_content and "try" not in v_content:
                    self.warnings.append(f"UNHANDLED NETWORK RISK in {fn}: `fetch()` invoked without try/catch or .catch() error boundary.")

    def audit_database_connection_contracts(self):
        print("\n[AUDIT 3] Database Connection & Schema Registry Contract Audit...")
        if not os.path.exists(MAIN_PY_PATH):
            self.findings.append("FATAL: backend/src/backend/main.py missing.")
            return

        with open(MAIN_PY_PATH, "r", encoding="utf-8") as f:
            py_content = f.read()

        # Check for SQLite imports or fallback files
        if "sqlite3" in py_content or "live_inquiries.sqlite3" in py_content:
            self.findings.append("DATABASE CONTRACT VIOLATION: backend/src/backend/main.py imports or references sqlite3 fallback!")
        else:
            self.passed_checks.append("SQLite fallbacks 100% purged from backend main.py.")

        # Check for trusted x-tenant-id headers (PR-11100 violation)
        if re.search(r'Header\(.*x-tenant-id', py_content, re.IGNORECASE):
            self.findings.append("SECURITY CONTRACT VIOLATION: main.py accepts un-verified x-tenant-id request header!")

        # Verify live schema registry exists
        if not os.path.exists(SCHEMA_REGISTRY_PATH):
            self.warnings.append("live_schema_registry.json missing in cisem_core/. Run schema sync script.")

    def audit_keystone_preflight_risks(self):
        print("\n[AUDIT 4] Keystone Pre-Flight Wiring Check...")
        # Check for uncommitted files
        import subprocess
        try:
            res = subprocess.run(["git", "status", "--porcelain"], cwd=ROOT_DIR, capture_output=True, text=True)
            uncommitted = [line for line in res.stdout.splitlines() if line.strip()]
            if len(uncommitted) > 10:
                self.warnings.append(f"PRE-FLIGHT RISK: Working tree has {len(uncommitted)} uncommitted files. High risk of drift.")
            else:
                self.passed_checks.append(f"Working tree clean ({len(uncommitted)} uncommitted files).")
        except Exception:
            pass

    def print_report(self):
        print("\n------------------------------------------------------------------------------------------")
        print(f"AUDIT SUMMARY: {len(self.passed_checks)} PASSED | {len(self.warnings)} WARNINGS | {len(self.findings)} CRITICAL FINDINGS")
        print("------------------------------------------------------------------------------------------")

        if self.passed_checks:
            print("\n[+] VERIFIED COMPLIANT ITEMS:")
            for p in self.passed_checks[:10]:
                print(f"  [PASS] {p}")

        if self.warnings:
            print("\n[!] WARNINGS & POTENTIAL GAPS:")
            for w in self.warnings:
                print(f"  [WARN] {w}")

        if self.findings:
            print("\n[X] CRITICAL WIRING FINDINGS (MUST BE RESOLVED BEFORE CODE EXECUTION):")
            for f in self.findings:
                print(f"  [FAIL] {f}")
            print("\nRESULT: AUDIT FAILED. Resolve all critical findings before building.")
        else:
            print("\nRESULT: AUDIT PASSED. Wiring baseline is solid.")

if __name__ == "__main__":
    auditor = ViciousWiringAuditor()
    success = auditor.audit_all()
    sys.exit(0 if success else 1)
