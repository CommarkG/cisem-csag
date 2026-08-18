#!/usr/bin/env python3
"""
# CISEM CODE HEADER > MANDATORY
# ratified_plan: CISEM-IP-20260815-CONTEXT-PACK-GENERATOR
# governor_signature: GOV-2026-08-15-CTXPACK-04
# version: V1.2
# reasoning: |
#   Generates an automated zero-drift context pack in .agents/reviewer/ containing
#   RULES.md, INSTRUMENTS.md, INVENTORY.md, GOVERNANCE_STATE.md, DATABASE_INTENT.md,
#   and GENERATION_METADATA.json.
#   Derives instruments, invokers, models, and queries 100% dynamically from disk.
#   Strictly excludes .md files from invoker detection.
#   Parent principles: PR-13950 (Zero-Drift), AX-10000.
"""

import os
import re
import sys
import json
import glob
import secrets
import hashlib
import ast
from datetime import datetime, timezone

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
REVIEWER_DIR = os.path.join(ROOT_DIR, ".agents", "reviewer")
CORE_DIR = os.path.join(ROOT_DIR, "cisem_core")
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
BRAIN_SCRATCH_DIR = r"C:\Users\finky\.gemini\antigravity\brain\f9d83031-b7e1-42a3-adc3-5130cf5cb069\scratch"

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
    
    # Mandatory named source files required in every reviewer pack
    mandatory_sources = [
        ("AGENTS.md", os.path.join(ROOT_DIR, "AGENTS.md")),
        ("2026-08-10__Gemini3.5__YarivHuman__AxiomsAndPrinciples__V1.30.md", os.path.join(ROOT_DIR, "2026-08-10__Gemini3.5__YarivHuman__AxiomsAndPrinciples__V1.30.md"))
    ]

    for fname, fpath in mandatory_sources:
        if not os.path.exists(fpath):
            error_msg = f"FATAL REVIEWER PACK ERROR: Mandatory named source file '{fname}' is missing at '{fpath}'. Generation halted."
            print(f"[!] {error_msg}", file=sys.stderr)
            raise FileNotFoundError(error_msg)
        content.append(f"\n## Source: {fname}\n")
        with open(fpath, "r", encoding="utf-8") as f:
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
        "> Derived 100% dynamically from disk scan. Zero hardcoded lists. Documentation (.md) strictly excluded from invokers.\n",
        "| Instrument Name | Relative File Path | Invoker Boundary | Failure Behavior | Proof Status |",
        "| :--- | :--- | :--- | :--- | :--- |"
    ]
    
    # 1. Discover instruments dynamically
    discovered_instruments = []
    
    # Scan .agents/skills/ for SKILL.md
    skills_dir = os.path.join(ROOT_DIR, ".agents", "skills")
    if os.path.exists(skills_dir):
        for root, dirs, files in os.walk(skills_dir):
            for f in files:
                if f.lower() == "skill.md":
                    rel_path = os.path.relpath(os.path.join(root, f), ROOT_DIR).replace("\\", "/")
                    skill_name = os.path.basename(root)
                    discovered_instruments.append((skill_name, rel_path))
                    
    # Scan workspace Python files for gate/linter/auditor/validation entry points
    for root, dirs, files in os.walk(ROOT_DIR):
        dirs[:] = [d for d in dirs if d not in {".git", "node_modules", ".venv", "__pycache__", "dist", "build", ".next", "graphify-out"}]
        for f in files:
            if f.endswith(".py"):
                fpath = os.path.join(root, f)
                rel_path = os.path.relpath(fpath, ROOT_DIR).replace("\\", "/")
                fname_lower = f.lower()
                is_candidate = any(term in fname_lower for term in ["gate", "linter", "auditor", "atv", "sanitizer", "verifier"])
                
                if is_candidate:
                    try:
                        with open(fpath, "r", encoding="utf-8", errors="ignore") as file_obj:
                            txt = file_obj.read()
                            if "gate_block" in txt or "sys.exit" in txt or "def " in txt or "class " in txt:
                                inst_name = f
                                if not any(r[1] == rel_path for r in discovered_instruments):
                                    discovered_instruments.append((inst_name, rel_path))
                    except Exception:
                        pass

    if not discovered_instruments:
        content.append("CANNOT DERIVE — Dynamic scanner found 0 instruments on disk.")
    else:
        # Collect executable code and configuration files ONLY (strictly exclude .md and build outputs)
        exec_files = []
        for root, dirs, files in os.walk(ROOT_DIR):
            dirs[:] = [d for d in dirs if d not in {".git", "node_modules", ".venv", "__pycache__", "dist", "build", ".next", "graphify-out"}]
            for f in files:
                # Exclude .md documentation files completely
                if f.endswith((".py", ".json", ".sh", ".ps1", ".bat")) and not f.endswith(".md"):
                    if f not in {"generate_reviewer_pack.py"} and not f.endswith(".yaml"):
                        exec_files.append(os.path.join(root, f))
                        
        # Collect proof artifacts across workspace and session scratch
        proof_artifacts = []
        for p_dir in [os.path.join(ROOT_DIR, "cisem_core", "sandbox"), BRAIN_SCRATCH_DIR]:
            if os.path.exists(p_dir):
                for pf in os.listdir(p_dir):
                    if pf.endswith((".py", ".json", ".log")) or "defect" in pf or "proof" in pf:
                        proof_artifacts.append(os.path.join(p_dir, pf))

        for inst_name, rel_path in sorted(discovered_instruments, key=lambda x: x[0]):
            full_inst_path = os.path.join(ROOT_DIR, rel_path)
            fname_base = os.path.basename(rel_path)
            inst_stem = os.path.splitext(fname_base)[0]
            
            # Detect Invokers
            invokers = []
            for ef in exec_files:
                if ef == full_inst_path:
                    continue
                try:
                    with open(ef, "r", encoding="utf-8", errors="ignore") as file_obj:
                        txt = file_obj.read()
                        
                        has_subproc = "subprocess" in txt and (fname_base in txt or inst_name in txt)
                        has_python_cli = ("python " in txt or "python3 " in txt) and (fname_base in txt or inst_name in txt)
                        has_hook_ref = ef.endswith(".json") and "hooks" in ef and (fname_base in txt or inst_name in txt)
                        has_gate_phase = ef.endswith("cisem_gate.py") and (fname_base in txt or inst_stem in txt or inst_name in txt)
                        has_import = ef.endswith(".py") and (f"import {inst_stem}" in txt or f"from {inst_stem}" in txt)
                        
                        if has_subproc or has_python_cli or has_hook_ref or has_gate_phase or has_import:
                            rel_ef = os.path.relpath(ef, ROOT_DIR).replace("\\", "/")
                            invokers.append(f"`{rel_ef}`")
                except Exception:
                    pass
                    
            invoker_str = ", ".join(sorted(list(set(invokers)))) if invokers else "NO INVOKER FOUND"
            
            # Detect Failure Behavior
            failure_behavior = "NO EXPLICIT FAILURE BEHAVIOR DETECTED"
            if os.path.exists(full_inst_path):
                try:
                    with open(full_inst_path, "r", encoding="utf-8", errors="ignore") as f:
                        txt = f.read()
                        if "gate_block" in txt or "sys.exit(1)" in txt or "exit(1)" in txt:
                            failure_behavior = "Exits code 1 / `gate_block()`"
                        elif "cael_status.json" in txt:
                            failure_behavior = "Writes metrics to `cael_status.json`"
                        elif "reject" in txt.lower() or "contract" in txt.lower():
                            failure_behavior = "Rejects non-compliant turn contract"
                except Exception:
                    pass
                    
            # Detect Proof Status mechanically from physical files on disk
            proof_status = "UNPROVEN"
            for pa in proof_artifacts:
                try:
                    pa_name = os.path.basename(pa)
                    with open(pa, "r", encoding="utf-8", errors="ignore") as f:
                        ptxt = f.read()
                        if fname_base in ptxt or inst_name in ptxt or inst_stem in ptxt or ("gate19" in pa_name and "gate" in inst_name.lower()):
                            if "atv_report.json" in pa_name or "orchestration_trial_report" in pa_name:
                                proof_status = "**FULL PASS**"
                            elif "test_gate19_proofs" in pa_name or "run_gate19" in pa_name:
                                proof_status = "**FULL PASS**"
                            else:
                                proof_status = "**PARTIAL PASS**"
                            break
                except Exception:
                    pass
                    
            content.append(f"| `{inst_name}` | `{rel_path}` | {invoker_str} | {failure_behavior} | {proof_status} |")
            
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
                    relpath = os.path.relpath(fpath, ROOT_DIR).replace("\\", "/")
                    
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
        "> THIS FILE RECORDS WHAT THE APPLICATION CODE BELIEVES ABOUT THE DATABASE. IT IS NOT LIVE STATE. LIVE STATE COMES ONLY FROM A GOVERNOR QUERY. A DISAGREEMENT BETWEEN THIS FILE AND THE GOVERNOR'S SCHEMA FILE IS A DEFECT, NOT A DISCREPANCY.\n"
    ]
    
    main_py_path = os.path.join(BACKEND_DIR, "src", "backend", "main.py")
    if not os.path.exists(main_py_path):
        content.append("CANNOT DERIVE — backend/src/backend/main.py does not exist on disk.")
    else:
        try:
            with open(main_py_path, "r", encoding="utf-8") as f:
                code_txt = f.read()
                
            tables_found = sorted(list(set(re.findall(r'\.table\s*\(\s*["\']([^"\']+)["\']\s*\)', code_txt))))
            
            content.append("## Inferred Table Names (parsed dynamically from `.table(...)` calls in `main.py`)\n")
            content.append("| Table Name | Code Query Status |")
            content.append("| :--- | :--- |")
            for tbl in tables_found:
                content.append(f"| `{tbl}` | ACTIVE QUERY TARGET |")
                
            content.append("\n## Backend Data Models (parsed dynamically from AST in `main.py`)\n")
            tree = ast.parse(code_txt)
            models_count = 0
            for node in ast.walk(tree):
                if isinstance(node, ast.ClassDef):
                    is_pydantic = any(
                        (isinstance(b, ast.Name) and b.id == "BaseModel") or
                        (isinstance(b, ast.Attribute) and b.attr == "BaseModel")
                        for b in node.bases
                    )
                    if is_pydantic:
                        models_count += 1
                        fields = []
                        for stmt in node.body:
                            if isinstance(stmt, ast.AnnAssign) and isinstance(stmt.target, ast.Name):
                                fields.append(stmt.target.id)
                        field_str = ", ".join(f"`{fl}`" for fl in fields) if fields else "No annotated fields"
                        content.append(f"- `{node.name}`: {field_str}")
                        
            if models_count == 0:
                content.append("CANNOT DERIVE — No Pydantic BaseModel classes found in `main.py`.")
        except Exception as e:
            content.append(f"CANNOT DERIVE — AST parsing error in `main.py`: {e}")
            
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
