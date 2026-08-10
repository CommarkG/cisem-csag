# ratified_plan: CRUEL-REVIEW-AX70000-CONSOLIDATED-V1.0
# governor_signature: GOV-YARIV-20260809-CONSOLIDATED-APPROVED
# version: V1.0
# reasoning: |
#   Registry upgrade script to copy V1.28.yaml to V1.29.yaml, calculate hashes,
#   register new trial files, and update canonical artifact mappings.
# Parent Principles: AX-10000, PR-13900, PR-13950.

import os
import hashlib
import yaml
import time

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
v128_path = os.path.join(ROOT_DIR, "cisem_core", "2026-08-05__CISEM__Universal_Workspace_and_Accountability_Registry__V1.28.yaml")
v129_path = os.path.join(ROOT_DIR, "cisem_core", "2026-08-05__CISEM__Universal_Workspace_and_Accountability_Registry__V1.29.yaml")

def sha256_file(filepath):
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        chunk = f.read(8192)
        while chunk:
            h.update(chunk)
            chunk = f.read(8192)
    return h.hexdigest()

if not os.path.exists(v128_path):
    print(f"Error: V1.28 registry not found at {v128_path}")
    exit(1)

with open(v128_path, "r", encoding="utf-8") as f:
    documents = list(yaml.load_all(f, Loader=yaml.FullLoader))

doc0 = documents[0]
doc1 = documents[1]

# 1. Update doc0 metadata
doc0["metadata"]["version"] = "1.29"
doc0["metadata"]["canonical_location"] = v129_path

# Append history entry
history_entry = {
    "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    "action": "RATIFIED_AX-75000_DECISION_PIPELINE_AND_TRIAL_REGISTRY_WITH_CLEANUP",
    "actor": "GOOGLE_ANTIGRAVITY_ADAPTER",
    "version": "1.29"
}
doc0["history"].append(history_entry)
if "history" in doc1:
    doc1["history"].append(history_entry)

doc1["workspace"]["last_reconciled_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

# 2. Update canonical artifacts inside subsystems
subsystems = doc1.get("control_plane_subsystems", [])

# Map cleanup evidence log update
for s in subsystems:
    if s["subsystem_id"] == "CISEM_COMMUNICATION":
        artifacts = s.get("canonical_artifacts", {})
        
        # Archive CleanupEvidenceLog V1.4 (since it was moved to archive)
        # Note: it is no longer the active spec, V1.5 is the active log.
        if "cleanup_evidence_log_md" in artifacts:
            log_path = os.path.join(ROOT_DIR, "cisem_core", "2026-08-07__CISEM__AntigravityLocal__CleanupEvidenceLog__V1.5.md")
            log_hash = sha256_file(log_path)
            artifacts["cleanup_evidence_log_md"] = {
                "path": "cisem_core/2026-08-07__CISEM__AntigravityLocal__CleanupEvidenceLog__V1.5.md",
                "version": "1.5",
                "status": "RATIFIED",
                "sha256": log_hash
            }
            print("Updated cleanup_evidence_log_md to V1.5 in registry.")

    if s["subsystem_id"] == "CISEM_PLANNING":
        artifacts = s.get("canonical_artifacts", {})
        
        # Add axioms_and_principles_md
        axioms_path = os.path.join(ROOT_DIR, "2026-08-07__CISEM__AntigravityLocal__AxiomsAndPrinciples__V1.27.md")
        axioms_hash = sha256_file(axioms_path)
        artifacts["axioms_and_principles_md"] = {
            "path": "../../2026-08-07__CISEM__AntigravityLocal__AxiomsAndPrinciples__V1.27.md",
            "version": "1.27",
            "status": "RATIFIED",
            "sha256": axioms_hash
        }
        
        # Add vocabulary_md
        vocab_path = os.path.join(ROOT_DIR, "2026-08-07__CISEM__AntigravityLocal__Vocabulary__V1.13.md")
        vocab_hash = sha256_file(vocab_path)
        artifacts["vocabulary_md"] = {
            "path": "../../2026-08-07__CISEM__AntigravityLocal__Vocabulary__V1.13.md",
            "version": "1.13",
            "status": "RATIFIED",
            "sha256": vocab_hash
        }
        
        # Add trial_registry_yaml
        trial_reg_path = os.path.join(ROOT_DIR, "cisem_core", "trials", "trial_registry.yaml")
        trial_reg_hash = sha256_file(trial_reg_path)
        artifacts["trial_registry_yaml"] = {
            "path": "../trials/trial_registry.yaml",
            "version": "1.0",
            "status": "DRAFT",
            "sha256": trial_reg_hash
        }
        
        # Add decision_maturity_pipeline_md
        pipeline_path = os.path.join(ROOT_DIR, "cisem_core", "protocols", "2026-08-09__CISEM__DecisionMaturityPipeline__V1.0.md")
        pipeline_hash = sha256_file(pipeline_path)
        artifacts["decision_maturity_pipeline_md"] = {
            "path": "../protocols/2026-08-09__CISEM__DecisionMaturityPipeline__V1.0.md",
            "version": "1.0",
            "status": "RATIFIED",
            "sha256": pipeline_hash
        }
        print("Registered Axioms, Vocabulary, Trial Registry, and Decision Maturity Pipeline under CISEM_PLANNING.")

# Write V1.29
with open(v129_path, "w", encoding="utf-8") as f:
    yaml.dump(doc0, f, default_flow_style=False, sort_keys=False)
    f.write("---\n")
    yaml.dump(doc1, f, default_flow_style=False, sort_keys=False)

print(f"SUCCESS: Universal Workspace Registry V1.29 compiled at {v129_path}")
