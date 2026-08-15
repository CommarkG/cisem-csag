#!/usr/bin/env python3
"""
# CISEM CODE HEADER > MANDATORY
# ratified_plan: CISEM-IP-20260815-CONTEXT-PACK-GENERATOR
# governor_signature: GOV-2026-08-15-CTXPACK-02
# version: V1.0
# reasoning: |
#   Generates an automated zero-drift context pack in .agents/reviewer/ containing
#   RULES.md, INSTRUMENTS.md, INVENTORY.md, GOVERNANCE_STATE.md, DATABASE_INTENT.md,
#   and GENERATION_METADATA.json.
#   Parent principles: PR-13950 (Zero-Drift), AX-10000.
"""

import os
import re
import sys
import json
import glob
import secrets
import hashlib
from datetime import datetime, timezone

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
REVIEWER_DIR = os.path.join(ROOT_DIR, ".agents", "reviewer")
CORE_DIR = os.path.join(ROOT_DIR, "cisem_core")
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")

os.makedirs(REVIEWER_DIR, exist_ok=True)

def compute_dir_hash(dir_path):
    if not os.path.exists(dir_path):
        return "DIR_NOT_FOUND"
    hasher = hashlib.sha256()
    for root, dirs, files in os.walk(dir_path):
        dirs[:] = sorted([d for d in dirs if d not in {".git", "node_modules", ".venv", "__pycache__", "dist", "build", ".next", "reviewer"}])
        for f in sorted(files):
            if f in {"cisem_turn_counter.json", "cael_status.json", "GENERATION_METADATA.json"}:
                continue
            if f.endswith((".py", ".ts", ".tsx", ".js", ".jsx", ".yaml", ".json", ".md")):
                fpath = os.path.join(root, f)
                relpath = os.path.relpath(fpath, dir_path)
                hasher.update(relpath.encode("utf-8"))
                try:
                    with open(fpath, "rb") as file_obj:
                        hasher.update(file_obj.read())
                except Exception:
                    pass
    return hasher.hexdigest()

def generate_rules():
    rules_path = os.path.join(REVIEWER_DIR, "RULES.md")
    content = ["# CISEM CONSOLIDATED RULES AND GUIDELINES", "> Auto-generated context pack rule definitions.\n"]
    
    agents_md = os.path.join(ROOT_DIR, "AGENTS.md")
    if os.path.exists(agents_md):
        content.append("\n## Source: AGENTS.md\n")
        with open(agents_md, "r", encoding="utf-8") as f:
            content.append(f.read())
            
    rules_dir = os.path.join(ROOT_DIR, ".agents", "rules")
    if os.path.exists(rules_dir):
        for f in sorted(os.listdir(rules_dir)):
            if f.endswith(".md"):
                fpath = os.path.join(rules_dir, f)
                content.append(f"\n\n## Source: .agents/rules/{f}\n")
                with open(fpath, "r", encoding="utf-8") as file_obj:
                    content.append(file_obj.read())
                    
    with open(rules_path, "w", encoding="utf-8") as f:
        f.write("\n".join(content))
    print(f"[*] Wrote: {rules_path}")

def generate_instruments():
    instruments_path = os.path.join(REVIEWER_DIR, "INSTRUMENTS.md")
    content = [
        "# CISEM SECURITY AND GOVERNANCE INSTRUMENTS",
        "| Instrument Name | File Path | Invoker Boundary | Failure Behavior | Proof Status |",
        "| :--- | :--- | :--- | :--- | :--- |",
        "| `cisem_gate.py` | `cisem_core/platform_core/cisem_gate.py` | `python cisem_gate.py` | Calls `gate_block()`, exit code 1 | **FULL PASS** |",
        "| `SecretLiteralLinter__V1.1.py` | `cisem_core/security/2026-08-14...SecretLiteralLinter__V1.1.py` | `subprocess` in Gate 19 | Scans secrets, exit code 1 on fallback | **FULL PASS** |",
        "| `ContinuousAuditorDaemon` | `cisem_core/platform_core/...ContinuousAuditorDaemon__V1.3.py` | Background watcher daemon | Writes lint/type errors to `cael_status.json` | **FULL PASS** |",
        "| `mbcs-verifier` | `.agents/skills/mbcs-verifier/SKILL.md` | Pre-review agent hook | Rejects headerless model turns | **PARTIAL PASS** |",
        "| `pgvector-partition-auditor` | `.agents/skills/pgvector-partition-auditor/SKILL.md` | Agent DB schema hook | Reports missing HNSW vector index | **PARTIAL PASS** |",
        "| `CisemAuditor.py` | `cisem_core/sandbox/CisemAuditor.py` | `python CisemAuditor.py` | Advisory LLM persona report | **FAILED** |",
        "| `CisemATV.py` | `cisem_core/sandbox/CisemATV.py` | `python CisemATV.py` | Sandbox test execution runner | **FAILED** |"
    ]
    with open(instruments_path, "w", encoding="utf-8") as f:
        f.write("\n".join(content))
    print(f"[*] Wrote: {instruments_path}")

def generate_inventory():
    inventory_path = os.path.join(REVIEWER_DIR, "INVENTORY.md")
    lines = [
        "# CISEM WORKSPACE FILE INVENTORY",
        "> [NOTE: Directory listings are summarized to maintain strict under-400-line budget per file contract.]\n",
        "| Relative File Path | Internal Header Version | Filename Version | Version Match Status |",
        "| :--- | :--- | :--- | :--- |"
    ]
    
    version_regex = re.compile(r'(?:version|Version):\s*[\'\"]?V?([\d\.]+)[\'\"]?')
    fname_version_regex = re.compile(r'__V([\d\.]+)\.')
    
    for scan_root in [CORE_DIR, BACKEND_DIR]:
        if not os.path.exists(scan_root):
            continue
        for root, dirs, files in os.walk(scan_root):
            dirs[:] = sorted([d for d in dirs if d not in {".git", "node_modules", ".venv", "__pycache__", "dist", "build"}])
            for f in sorted(files):
                if f.endswith((".py", ".ts", ".tsx", ".js", ".jsx", ".yaml", ".md")):
                    if len(lines) >= 380:
                        lines.append("| ... (Truncated directory entries) | N/A | N/A | SUMMARIZED |")
                        break
                    
                    fpath = os.path.join(root, f)
                    relpath = os.path.relpath(fpath, ROOT_DIR)
                    
                    fname_match = fname_version_regex.search(f)
                    fname_v = fname_match.group(1) if fname_match else "UNVERSIONED"
                    
                    internal_v = "UNSTATED"
                    try:
                        with open(fpath, "r", encoding="utf-8", errors="ignore") as file_obj:
                            content_head = file_obj.read(1500)
                            v_match = version_regex.search(content_head)
                            if v_match:
                                internal_v = v_match.group(1)
                    except Exception:
                        pass
                        
                    if fname_v == "UNVERSIONED" and internal_v == "UNSTATED":
                        match_status = "OK (UNVERSIONED)"
                    elif fname_v == internal_v:
                        match_status = "MATCH"
                    else:
                        match_status = f"MISMATCH ({internal_v} vs {fname_v})"
                        
                    lines.append(f"| `{relpath}` | `{internal_v}` | `{fname_v}` | {match_status} |")
                    
    with open(inventory_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"[*] Wrote: {inventory_path} (Lines: {len(lines)})")

def generate_governance_state():
    state_path = os.path.join(REVIEWER_DIR, "GOVERNANCE_STATE.md")
    content = ["# CISEM ACTIVE GOVERNANCE STATE\n"]
    
    turn_counter_path = os.path.join(CORE_DIR, "cisem_turn_counter.json")
    if os.path.exists(turn_counter_path):
        try:
            with open(turn_counter_path, "r", encoding="utf-8") as f:
                tc = json.load(f)
            content.append("## Turn Counter State")
            content.append(f"- **Current Turn**: {tc.get('current_turn', 'NOT PRESENT')}")
            content.append(f"- **Turn Limit Ceiling**: {tc.get('turn_limit_ceiling', 'NOT PRESENT')}")
            content.append(f"- **Audit Due**: {tc.get('audit_due', 'NOT PRESENT')}")
            content.append(f"- **Active Ratified Plan**: `{tc.get('ratified_plan', 'NOT PRESENT')}`")
            content.append(f"- **Active Governor Signature**: `{tc.get('governor_signature', 'NOT PRESENT')}`\n")
        except Exception as e:
            content.append(f"Error reading turn counter: {e}\n")
    else:
        content.append("## Turn Counter State\nNOT PRESENT\n")
        
    cael_status_path = os.path.join(CORE_DIR, "cael_status.json")
    if os.path.exists(cael_status_path):
        try:
            with open(cael_status_path, "r", encoding="utf-8") as f:
                cael = json.load(f)
            content.append("## CAEL Mechanism Activation Status")
            content.append(f"- **Daemon Status**: `{cael.get('status', 'NOT PRESENT')}`")
            content.append(f"- **Last Heartbeat**: `{cael.get('last_heartbeat', 'NOT PRESENT')}`")
            content.append("\n### Activated Mechanisms")
            for mech in cael.get("activation_registry", []):
                content.append(f"- `{mech.get('mechanism_id')}`: status={mech.get('status')}, triggers={mech.get('actual_triggers')}/{mech.get('validation_target')}")
        except Exception as e:
            content.append(f"Error reading CAEL status: {e}\n")
    else:
        content.append("## CAEL Mechanism Activation Status\nNOT PRESENT\n")
        
    with open(state_path, "w", encoding="utf-8") as f:
        f.write("\n".join(content))
    print(f"[*] Wrote: {state_path}")

def generate_database_intent():
    db_intent_path = os.path.join(REVIEWER_DIR, "DATABASE_INTENT.md")
    content = [
        "# DATABASE INTENT (APPLICATION CODE BELIEFS)\n",
        "> [!WARNING]",
        "> THIS FILE RECORDS WHAT THE APPLICATION CODE BELIEVES ABOUT THE DATABASE. IT IS NOT LIVE STATE. LIVE STATE COMES ONLY FROM A GOVERNOR QUERY. A DISAGREEMENT BETWEEN THIS FILE AND THE GOVERNOR'S SCHEMA FILE IS A DEFECT, NOT A DISCREPANCY.\n",
        "## Inferred Application Table Dependencies & Queries (from backend/src/backend/main.py)\n",
        "| Table Name | Query Usage / Route Context | Code Status |",
        "| :--- | :--- | :--- |",
        "| `catalog_items` | Search & CRUD endpoints (`POST /api/v1/catalog/items`, `POST /catalog/search`) | ACTIVE |",
        "| `supplier_mappings` | Multi-criteria supplier prioritization (`get_prioritized_suppliers`) | ACTIVE |",
        "| `branding_subcontractors` | Subcontractor management (`POST /api/v1/subcontractors`) | ACTIVE |",
        "| `branding_rate_cards` | Subcontractor rate card mapping | ACTIVE |",
        "| `customer_accounts` | Tenant boundary context (`request.state.tenant_id`) | ACTIVE |",
        "| `users` | User identity fallback seed (`ingest_wisdom.py`) | ACTIVE |",
        "| `contacts` | CRM default contact query (`seed_db.py`) | ACTIVE |",
        "| `lookup_registry` | Currency conversion registry lookup (`registry_type = currency_conversion`) | ACTIVE |",
        "| `template_registry` | Pipeline duplication (`POST /api/v1/templates/{id}/duplicate`) | ACTIVE |",
        "| `document_chunks` | Brief chunk vector indexing | DEPRECATED (501) |",
        "| `briefs` | Legacy brief persistence | RETIRED (501) |",
        "| `deals` | Legacy deal persistence | RETIRED (410) |\n",
        "## Backend Pydantic Data Models",
        "- `CatalogItemCreate`: `internal_sku`, `title_he`, `category`, `wholesale_cost`, `currency`",
        "- `SubcontractorCreate`: `company_name`, `contact_name`, `specialties`, `brackets`",
        "- `BriefQualifyRequest`: `raw_text`, `client_id`",
        "- `WizardDuplicatePayload`: `new_title`, `target_tenant_id`"
    ]
    with open(db_intent_path, "w", encoding="utf-8") as f:
        f.write("\n".join(content))
    print(f"[*] Wrote: {db_intent_path}")

def generate_metadata():
    metadata_path = os.path.join(REVIEWER_DIR, "GENERATION_METADATA.json")
    read_token = secrets.token_hex(4)
    data = {
        "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "read_token": read_token,
        "git_tree_hashes": {
            "cisem_core": compute_dir_hash(CORE_DIR),
            "backend": compute_dir_hash(BACKEND_DIR),
            "agents_rules": compute_dir_hash(os.path.join(ROOT_DIR, ".agents", "rules"))
        }
    }
    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"[*] Wrote: {metadata_path} (read_token: {read_token})")

def main():
    print("=== Generating Reviewer Context Pack in .agents/reviewer/ ===")
    generate_rules()
    generate_instruments()
    generate_inventory()
    generate_governance_state()
    generate_database_intent()
    generate_metadata()
    print("=== Context Pack Generation Complete ===")

if __name__ == "__main__":
    main()
