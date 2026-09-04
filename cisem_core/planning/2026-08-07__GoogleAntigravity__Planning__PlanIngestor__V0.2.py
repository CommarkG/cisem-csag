#!/usr/bin/env python3
"""
# CISEM CODE HEADER -- MANDATORY
# ratified_plan: CISEM-IP-20260807-PLANNING-SPINE
# governor_signature: GOV-YARIV-20260807-PLANNING-SPINE-V1.0
# version: V0.2
# reasoning: |
#   This is the automated Plan Ingestor script for the CISEM_PLANNING spine.
#   It parses design plans, checks metadata formatting (Rule 2 conformant),
#   enforces required sections, and verifies that linked axioms exist.
#   On failure, it writes a .gate_lock block and stamps pre_review_status: FAILED.
#   On success, it stamps pre_review_status: PASSED.
#   Parent principles: AxiomsAndPrinciples V1.17 §PR-98000. Planning Spec V1.0.
#   Resolves: CISEM_PLANNING Core Spine bootstrap.
"""

import os
import sys
import re
import yaml
import argparse
from datetime import datetime, timezone

PLANNING_DIR = os.path.dirname(os.path.abspath(__file__))
CORE_DIR     = os.path.dirname(PLANNING_DIR)
ROOT_DIR     = os.path.dirname(CORE_DIR)
GATE_LOCK    = os.path.join(ROOT_DIR, ".gate_lock")

def get_highest_version_file(prefix, suffix):
    """Scan workspace root for highest version of a canonical document."""
    candidates = []
    if not os.path.exists(ROOT_DIR):
        return None
    for f in os.listdir(ROOT_DIR):
        if f.startswith(prefix) and f.endswith(suffix):
            v_match = re.search(r'__V(\d+(?:\.\d+)*)\.md$', f)
            if v_match:
                try:
                    version = [int(x) for x in v_match.group(1).split(".")]
                except ValueError:
                    version = [0]
                candidates.append((version, os.path.join(ROOT_DIR, f)))
    if candidates:
        candidates.sort(key=lambda x: x[0], reverse=True)
        return candidates[0][1]
    return None

def write_gate_lock(reason, details, filename):
    """Writes a local gate lock to block compilation runs."""
    alert = {
        "lock_reason": reason,
        "target_file": os.path.basename(filename),
        "error_type": "PLAN_INGESTION_SUSPENSION",
        "error_details": details,
        "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    }
    try:
        import json
        with open(GATE_LOCK, "w", encoding="utf-8") as f:
            json.dump(alert, f, indent=2)
        print(f"[!] Gate Lock Active: {reason} on {os.path.basename(filename)}")
    except Exception as e:
        print(f"[!] Failed to write gate lock: {e}")

def clear_gate_lock(reason_filter="PLAN_VALIDATION_FAILED"):
    """Clears the gate lock if it matches our planning filter."""
    if os.path.exists(GATE_LOCK):
        try:
            import json
            with open(GATE_LOCK, "r", encoding="utf-8") as f:
                alert = json.load(f)
            if alert.get("lock_reason") == reason_filter:
                os.remove(GATE_LOCK)
                print("[+] Gate Lock Cleared (Plan Ingestor resolved).")
        except Exception:
            pass

def validate_plan(plan_path):
    print("=" * 60)
    print(f"CXP Plan Ingestor V0.2: Validating plan document...")
    print("=" * 60)
    
    if not os.path.exists(plan_path):
        print(f"[ERROR] Plan file not found: {plan_path}")
        return False, "Plan file not found on disk."
        
    try:
        with open(plan_path, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception as e:
        return False, f"Failed to read file: {e}"

    # 1. Parse Metadata Header Block
    if "---" not in content:
        return False, "Missing YAML metadata frontmatter blocks."
        
    parts = content.split("---")
    if len(parts) < 3:
        return False, "Malformed frontmatter block structure."
        
    header_text = parts[1]
    try:
        metadata = yaml.safe_load(header_text)
    except Exception as e:
        return False, f"Failed to parse YAML metadata: {e}"

    if not metadata or not isinstance(metadata, dict):
        return False, "YAML metadata block is missing or not a key-value dictionary."

    # Validate Plan ID Naming Regex
    plan_id = metadata.get("plan_id")
    if not plan_id:
        return False, "Missing plan_id parameter in metadata."
    if not re.match(r"^CISEM-IP-\d{8}-[A-Z0-9-]+$", plan_id):
        return False, f"plan_id '{plan_id}' does not match pattern '^CISEM-IP-\\d{8}-[A-Z0-9-]+$'."

    # Validate Blast Radius
    blast_radius = metadata.get("blast_radius")
    if not blast_radius:
        return False, "Missing blast_radius parameter in metadata."
    if blast_radius not in ("LOW", "MEDIUM", "HIGH"):
        return False, f"blast_radius '{blast_radius}' must be LOW, MEDIUM, or HIGH."

    # 2. Check Headings Sections Presence
    required_headings = [
        r"^#\s+.*$",                     # Goal Description
        r"^##\s+User\s+Review\s+Required\s*$",
        r"^##\s+Open\s+Questions\s*$",
        r"^##\s+Proposed\s+Changes\s*$",
        r"^##\s+Gemini\s+Brain\s+Multi-Persona\s+Audit\s*$",
        r"^##\s+Verification\s+Plan\s*$"
    ]
    
    for h in required_headings:
        match_found = False
        for line in content.splitlines():
            if re.match(h, line.strip()):
                match_found = True
                break
        if not match_found:
            clean_heading = h.replace("^##\\s+", "## ").replace("\\s+", " ").replace("\\s*$", "").replace("^#\\s+.*$", "# [Goal Description]")
            return False, f"Missing required plan section: '{clean_heading}'."

    # 2.5 Verify if changes affect Control Plane (cisem_core/) and require HIGH blast_radius
    affects_control_plane = False
    for line in content.splitlines():
        if any(kw in line.upper() for kw in ("MODIFY", "NEW", "DELETE", "MOVE")):
            if "CISEM_CORE" in line.replace("\\", "/").upper():
                affects_control_plane = True
                break

    if affects_control_plane and blast_radius != "HIGH":
        return False, (
            f"Proposed changes affect the Control Plane (cisem_core/), which requires "
            f"an explicit HIGH blast_radius in metadata (currently: {blast_radius})."
        )

    # 2.6 CoreSpiral Methodology Mechanical Enforcement
    # [MANDATORY GOVERNOR RULE]: Non-trivial plans must implement the CoreSpiral context-adaptive process
    if blast_radius in ("MEDIUM", "HIGH"):
        content_lower = content.lower()
        if "corespiral" not in content_lower and "VERTICAL_SLICE" not in content_lower:
            return False, (
                f"Validation Error: Plan '{plan_id}' has a {blast_radius} blast_radius but "
                f"does not reference the CoreSpiral methodology or define CoreCycles. "
                f"Non-trivial plans must utilize CoreSpiral context-adaptive cycle sequences."
            )
        print(f"[+] Verified CoreSpiral compliance for non-trivial plan '{plan_id}'.")

    # 2.7 Proposed Changes Invariant Verification (Wiring, Triggering, Availability, User Journey)
    # [MANDATORY GOVERNOR RULE]: Every proposed file element must specify its integration playbook details.
    in_proposed_changes = False
    current_element = None
    element_content = []
    element_blocks = {}
    
    for line in content.splitlines():
        trimmed = line.strip()
        if trimmed.startswith("## Proposed Changes"):
            in_proposed_changes = True
            continue
        elif in_proposed_changes and trimmed.startswith("## "):
            in_proposed_changes = False
            if current_element:
                element_blocks[current_element] = "\n".join(element_content)
            current_element = None
            element_content = []
        elif in_proposed_changes:
            if trimmed.startswith("####"):
                if current_element:
                    element_blocks[current_element] = "\n".join(element_content)
                current_element = trimmed
                element_content = []
            elif current_element:
                element_content.append(line)
                
    if current_element:
        element_blocks[current_element] = "\n".join(element_content)
        
    for elem, elem_text in element_blocks.items():
        missing = []
        elem_text_lower = elem_text.lower()
        if "wiring" not in elem_text_lower:
            missing.append("Wiring")
        if "trigger" not in elem_text_lower:
            missing.append("Triggering")
        if "availability" not in elem_text_lower and "available" not in elem_text_lower:
            missing.append("Availability")
        if "journey" not in elem_text_lower:
            missing.append("User Journey")
            
        if missing:
            clean_elem = re.sub(r'\[.*?\]', '', elem).replace('#', '').strip()
            return False, (
                f"Proposed change '{clean_elem}' is missing mandatory Playbook integration specs: "
                f"{', '.join(missing)}. Every proposed element must explicitly define its "
                f"Wiring, Triggering, Availability, and User Journey integration."
            )
    print(f"[+] Verified Playbook Invariant compliance for {len(element_blocks)} proposed elements.")

    # 3. Verify Linked Axioms Exist in AxiomsAndPrinciples file
    axioms_linked = metadata.get("axioms_linked", [])
    if not isinstance(axioms_linked, list):
        return False, "axioms_linked parameter must be a list."
        
    axioms_file = get_highest_version_file("2026-08-", "__CISEM__AntigravityLocal__AxiomsAndPrinciples__V1.20.md")
    # Fallback to search any axioms file name
    if not axioms_file:
        axioms_file = get_highest_version_file("2026-", "AxiomsAndPrinciples")
        
    if axioms_file:
        try:
            with open(axioms_file, "r", encoding="utf-8") as f:
                axioms_content = f.read()
            for ax in axioms_linked:
                if ax not in axioms_content:
                    return False, f"Linked axiom reference '{ax}' not found inside: {os.path.basename(axioms_file)}."
            print(f"[+] Verified links for {len(axioms_linked)} axioms against {os.path.basename(axioms_file)}")
        except Exception as e:
            print(f"[WARNING] Could not parse axioms file: {e}")
    else:
        print("[WARNING] AxiomsAndPrinciples document not found in workspace to verify links.")

    print(f"[+] Plan '{plan_id}' successfully validated against specifications.")
    return True, "Nominal parsing validation pass."

def inject_pre_review_status(plan_path, status, error_details=None):
    """Updates the plan's YAML frontmatter metadata block with its pre-review status."""
    try:
        with open(plan_path, "r", encoding="utf-8") as f:
            content = f.read()
        if "---" not in content:
            return
        parts = content.split("---")
        if len(parts) < 3:
            return
        header_text = parts[1]
        metadata = yaml.safe_load(header_text) or {}
        if metadata.get("pre_review_status") == status and metadata.get("pre_reviewed_at"):
            print(f"[+] Plan metadata already has pre_review_status: {status}. Skipping write to preserve checksum.")
            return
            
        metadata["pre_review_status"] = status
        metadata["pre_reviewed_at"] = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
        if error_details:
            metadata["pre_review_error"] = error_details
        else:
            metadata.pop("pre_review_error", None)
            
        new_header = yaml.safe_dump(metadata, default_flow_style=False, sort_keys=False)
        parts[1] = "\n" + new_header
        new_content = "---".join(parts)
        with open(plan_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"[+] Updated plan metadata with pre_review_status: {status}")
    except Exception as e:
        print(f"[WARNING] Failed to write pre-review metadata back to plan: {e}")

def main():
    parser = argparse.ArgumentParser(description="CISEM Plan Ingestor Validator")
    parser.add_argument("--plan", required=True, help="Path to the implementation plan markdown file")
    parser.add_argument("--dry-run", action="store_true", help="Validate plan without writing gate locks on failure")
    args = parser.parse_args()
    
    if args.dry_run:
        print("[INFO] Running in DRY-RUN mode. Gate locks will not be generated or cleared.")
        
    success, message = validate_plan(args.plan)
    if not success:
        print(f"[ERROR] Validation Failed: {message}")
        if not args.dry_run:
            write_gate_lock("PLAN_VALIDATION_FAILED", message, args.plan)
            inject_pre_review_status(args.plan, "FAILED", message)
        sys.exit(1)
    else:
        if not args.dry_run:
            clear_gate_lock("PLAN_VALIDATION_FAILED")
            inject_pre_review_status(args.plan, "PASSED")
        sys.exit(0)

if __name__ == "__main__":
    main()
