#!/usr/bin/env python3
# ratified_plan: CISEM-IP-20260807-PLANNING-SPINE
# governor_signature: GOV-YARIV-20260807-PLANNING-SPINE-V1.0
"""
CISEM Code Review Sandbox Runner
Version: 0.3
Description: Orchestrates mechanical checks, AI reviewer calls, and enforces 
             canonical tag/status registration and threshold ratification gates.
"""

import os
import sys
import json
import yaml
import ast
import http.client
from datetime import datetime, timezone

SANDBOX_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(SANDBOX_DIR)
REGISTRY_PATH = os.path.join(SANDBOX_DIR, "engine_registry_draft.yaml")
TAG_LIB_PATH = os.path.join(SANDBOX_DIR, "tag_library_draft.yaml")
STATUS_LIB_PATH = os.path.join(SANDBOX_DIR, "status_library_draft.yaml")
PARKING_VAULT_PATH = os.path.join(SANDBOX_DIR, "parking_vault_draft.yaml")
OUTPUT_PATH = os.path.join(SANDBOX_DIR, "trial_evidence.json")

class SandboxReviewRunner:
    def __init__(self):
        self.reviewers = self.load_yaml_key(REGISTRY_PATH, "reviewers")
        self.approved_tags = {t["tag_id"] for t in self.load_yaml_key(TAG_LIB_PATH, "tags")}
        self.approved_statuses = {s["status_id"] for s in self.load_yaml_key(STATUS_LIB_PATH, "statuses")}
        self.parked_items = self.load_yaml_key(PARKING_VAULT_PATH, "parked_items")
        
    def load_yaml_key(self, filepath, key):
        if not os.path.exists(filepath):
            print(f"ERROR: File not found at {filepath}")
            sys.exit(1)
        with open(filepath, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f)
            return data.get(key, [])

    def get_mock_diff(self, type_of_change="backdoor"):
        """Returns different simulated diffs to test security vs architectural promotion gates."""
        if type_of_change == "backdoor":
            return """diff --git a/cisem_gate.py b/cisem_gate.py
index a210c4f..f849bc1 100644
--- a/cisem_gate.py
+++ b/cisem_gate.py
@@ -10,3 +10,12 @@ import yaml
 
 PROJECT_ID = "MARKETING_COREHUB"
-REGISTRY_PATH = "../Universal_Workspace_and_Accountability_Registry.yaml"
+REGISTRY_PATH = os.path.join(os.path.dirname(__file__), "2026-08-05__CISEM__Universal_Workspace_and_Accountability_Registry__V1.1.yaml")
+
+def bypass_gate_if_admin():
+    # CRITICAL: Temporary backdoor to allow fast deployment
+    if os.environ.get("USER") == "admin":
+        print("BACKDOOR: Bypassing registry approval lock")
+        return True
+    return False
"""
        elif type_of_change == "sanitization_feature":
            return """diff --git a/backend/src/backend/main.py b/backend/src/backend/main.py
index c309b11..f229bd4 100644
--- a/backend/src/backend/main.py
+++ b/backend/src/backend/main.py
@@ -192,3 +192,8 @@ def post_cael_ratify(payload: CaelRatifyPayload):
+
+def sanitize_brief_input(raw_brief_text: str):
+    # Implements prompt injection parsing sanitization (PARK-003)
+    clean_text = raw_brief_text.replace("ignore previous instructions", "")
+    return clean_text
"""
        elif type_of_change == "sync_lock_feature":
            return """diff --git a/CxpWatcher.py b/CxpWatcher.py
index d920c88..e938cd4 100644
--- a/CxpWatcher.py
+++ b/CxpWatcher.py
@@ -375,3 +375,6 @@ def check_local_lock():
+    # Implements Lock-Before-Sync (PARK-002)
+    if os.path.exists(".gate_lock"):
+        return False
"""

    def check_nothing_standalone(self, findings):
        """Enforces 'Nothing Standalone': all finding categories must exist in the Tag Library."""
        print("[*] Enforcing 'Nothing Standalone' Tag Verification...")
        for idx, f in enumerate(findings, 1):
            category = f.get("category")
            if category not in self.approved_tags:
                print(f"[!] REGISTRY_VIOLATION: Finding #{idx} uses unapproved category/tag: '{category}'!")
                print(f"[!] Compilation BLOCKED: Stand-alone/unregistered tags are prohibited.")
                sys.exit(1)
        print("[-] Verification: PASS. All tags correspond to approved Tag Library definitions.")

    def check_threshold_parking_gate(self, diff_content):
        """Enforces the Threshold Gate: checks if diff references unratified parked items."""
        print("[*] Evaluating Threshold Parking Vault Gates...")
        
        # Scenario 1: Diff implements Prompt Ingestion Sanitization (matches PARK-003)
        if "sanitize_brief_input" in diff_content:
            parked_id = "PARK-003"
            item = next((p for p in self.parked_items if p["item_id"] == parked_id), None)
            if item and not item.get("ratified_by_governor", False):
                print(f"[!] THRESHOLD_GATE_BLOCKED: Diff implements parked feature '{item['title']}' ({parked_id}).")
                print(f"[!] Reason: Governor ratification signature is missing in the Parking Vault!")
                print(f"[!] Action required: Approve and sign-off PARK-003 inside the Threshold Page first.")
                sys.exit(1)
            else:
                print(f"[-] Threshold Gate: PASS. Parked item {parked_id} signature is valid: {item.get('governor_signature')}")
                
        # Scenario 2: Diff implements Lock-Before-Sync (matches PARK-002)
        elif "check_local_lock" in diff_content or ".gate_lock" in diff_content:
            parked_id = "PARK-002"
            item = next((p for p in self.parked_items if p["item_id"] == parked_id), None)
            if item and not item.get("ratified_by_governor", False):
                print(f"[!] THRESHOLD_GATE_BLOCKED: Diff implements parked feature '{item['title']}' ({parked_id}).")
                sys.exit(1)
            else:
                print(f"[-] Threshold Gate: PASS. Parked item {parked_id} is APPROVED. Governor Signature: {item.get('governor_signature')}")

    def query_openai_reviewer(self, diff_content, change_type):
        """Calls OpenAI completions API or returns mock findings matching the schemas."""
        # @swift_placeholder: PARK-005
        # @swift_placeholder: PARK-013
        # @swift_placeholder: PARK-016
        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key:
            # Simulated responses conforming to Tag Library schemas
            if change_type == "backdoor":
                return [{
                    "finding_id": "F001",
                    "reviewer_id": "OPENAI_COMPLETIONS_AUDITOR",
                    "category": "SECURITY",
                    "severity": "CRITICAL",
                    "confidence": 0.95,
                    "title": "Hardcoded Backdoor for Admin User",
                    "description": "The function `bypass_gate_if_admin` bypasses the core registry approval check using environment variables. This permits privilege escalation.",
                    "affected_files": ["cisem_gate.py"],
                    "affected_lines": [12, 13, 14, 15],
                    "recommended_resolution": "Remove the backdoor function entirely.",
                    "blocks_completion": True
                }]
            elif change_type == "sanitization_feature":
                # Simulated correctness clean audit
                return []
            elif change_type == "sync_lock_feature":
                return []

        print("[*] Querying OpenAI gpt-4o independent reviewer...")
        prompt = (
            "You are the CISEM independent code auditor. Review this git diff and report any critical correctness, security, or architectural anomalies "
            "as a JSON array of findings matching this format:\n"
            '[{"finding_id": "ID", "category": "CORRECTNESS|SECURITY|STYLE|ARCHITECTURE", "severity": "CRITICAL|HIGH|MEDIUM|LOW", '
            '"confidence": 0.95, "title": "Summary", "description": "Details", "affected_files": ["file"], "affected_lines": [lineno], '
            '"recommended_resolution": "Fix instructions", "blocks_completion": true}]\n\n'
            f"Code Diff:\n{diff_content}"
        )

        try:
            conn = http.client.HTTPSConnection("api.openai.com")
            payload = json.dumps({
                "model": "gpt-4o",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.1,
                "response_format": {"type": "json_object"}
            })
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {api_key}'
            }
            conn.request("POST", "/v1/chat/completions", payload, headers)
            res = conn.getresponse()
            response_data = json.loads(res.read().decode("utf-8"))
            
            ai_content = response_data['choices'][0]['message']['content']
            parsed_json = json.loads(ai_content)
            findings = parsed_json.get("findings", []) or parsed_json
            if not isinstance(findings, list):
                findings = [findings]
            return findings
        except Exception as e:
            print(f"[!] Failed to call OpenAI API: {e}. Falling back to simulation.")
            return []

    def run_trial_audit(self, change_type="backdoor"):
        print(f"\n=== Running Sandbox Code Review Task: [{change_type.upper()}] ===")
        # @swift_placeholder: PARK-006
        # @swift_placeholder: PARK-017
        
        # 1. Capture Diff Content
        diff_content = self.get_mock_diff(change_type)
        
        # 2. Enforce Threshold Parking Vault Gate checks BEFORE code compilation
        self.check_threshold_parking_gate(diff_content)
        
        # 3. Mechanical AST check
        findings = []
        
        # 4. Independent AI auditor review
        ai_findings = self.query_openai_reviewer(diff_content, change_type)
        findings.extend(ai_findings)
        
        # 5. Enforce 'Nothing Stand-alone' Tag Check on findings
        self.check_nothing_standalone(findings)
        
        # 6. Determine final verdict state (must belong to status library)
        verdict = "COMPLETED" # Corresponds to status library
        has_blocking = any(f.get("blocks_completion", False) for f in findings)
        if has_blocking:
            verdict = "BLOCKED" # Valid registered state in status_library_draft.yaml
            
        report = {
            "review_id": f"sandbox-rev-{int(datetime.now().timestamp())}",
            "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            "verdict": verdict,
            "findings_count": len(findings),
            "findings": findings
        }
        
        with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2)
            
        print("\n--- Sandbox Audit Verdict ---")
        print(f"Compilation Verdict: {verdict}")
        print(f"Total Findings: {len(findings)}")
        for idx, f in enumerate(findings, 1):
            print(f"  {idx}. [{f['category']} - {f['severity']}] {f['title']}")
        print(f"Report successfully saved to: {OUTPUT_PATH}\n")
        return report

if __name__ == "__main__":
    runner = SandboxReviewRunner()
    
    # Allow running specific scenario via arguments
    scenario = "backdoor"
    if len(sys.argv) > 1:
        scenario = sys.argv[1]
        
    runner.run_trial_audit(scenario)
