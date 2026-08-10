# Helper script to perform registry copy and hash upgrades from V1.30 to V1.31
import os

CORE_DIR = os.path.dirname(os.path.abspath(__file__))
v130_path = os.path.join(CORE_DIR, "2026-08-05__CISEM__Universal_Workspace_and_Accountability_Registry__V1.30.yaml")
v131_path = os.path.join(CORE_DIR, "2026-08-05__CISEM__Universal_Workspace_and_Accountability_Registry__V1.31.yaml")

with open(v130_path, "r", encoding="utf-8") as f:
    content = f.read()

# Update Metadata
old_meta = """metadata:
  owner: CISEM_GOVERNOR
  canonical_location: C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\cisem_core\\2026-08-05__CISEM__Universal_Workspace_and_Accountability_Registry__V1.30.yaml
  artifact_status: DRAFT
  maturity: WORKING_DRAFT
  version: '1.30'"""

new_meta = """metadata:
  owner: CISEM_GOVERNOR
  canonical_location: C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\cisem_core\\2026-08-05__CISEM__Universal_Workspace_and_Accountability_Registry__V1.31.yaml
  artifact_status: DRAFT
  maturity: WORKING_DRAFT
  version: '1.31'"""

# Update History
old_history = """history:
- timestamp: '2026-08-09T22:20:00Z'
  action: IMPLEMENTED_MECHANICAL_IMMUNITY_IMMUTABLE_ENFORCEMENT_PILLAR_100000
  actor: Sonnet
  version: '1.30'"""

new_history = """history:
- timestamp: '2026-08-09T22:40:00Z'
  action: COMPLETED_TRIAL-001_VERIFICATION_AND_COMMITTED_TELEMETRY
  actor: Sonnet
  version: '1.31'
- timestamp: '2026-08-09T22:20:00Z'
  action: IMPLEMENTED_MECHANICAL_IMMUNITY_IMMUTABLE_ENFORCEMENT_PILLAR_100000
  actor: Sonnet
  version: '1.30'"""

# Update trial_registry.yaml hash and add Trial runner and Conclusion Report
old_trial_registry = """    trial_registry_yaml:
      path: ../trials/trial_registry.yaml
      version: '1.0'
      status: DRAFT
      sha256: 51d5fe8f1a17e7eada5f2e59b0907d3b66668b2e8d41ca09a3fa4445dd2c4f00"""

new_trial_registry = """    trial_registry_yaml:
      path: ../trials/trial_registry.yaml
      version: '1.0'
      status: DRAFT
      sha256: 00d38b39b8ea14d93540d18c9626a5be838afbcf721e51ee3ea94c90cab0acd8
    2026_08_09__Sonnet__YarivHuman__Trial001Runner__V1_0:
      path: ../trials/2026-08-09__Sonnet__YarivHuman__Trial001Runner__V1.0.ts
      version: '1.0'
      status: VERIFIED
      validation_metrics:
        flow_completion: VERIFIED
        code_implementation: COMPLETE
        optimization: OPTIMIZED
        consolidation: CONSOLIDATED
        permission_compliance: ENFORCED
      sha256: f5997dae767de671e0a47145672b0b85e9b1e7a9aa6f6711b297db0c45b439ce
    2026_08_09__Sonnet__YarivHuman__TRIAL_001_ConclusionReport__V1_0_md:
      path: ../trials/conclusions/TRIAL-001__ConclusionReport__Sonnet__YarivHuman__ModelRouting__V1.0.md
      version: '1.0'
      status: RATIFIED
      validation_metrics:
        flow_completion: VERIFIED
        code_implementation: COMPLETE
        optimization: OPTIMIZED
        consolidation: CONSOLIDATED
        permission_compliance: ENFORCED
      sha256: 92b8168de07a029aa50aea6dfb704148eedc1d91dd6cafe35a255776e9fb87bc"""

assert old_meta in content, "Error: old_meta not found"
assert old_history in content, "Error: old_history not found"
assert old_trial_registry in content, "Error: old_trial_registry not found"

content = content.replace(old_meta, new_meta)
content = content.replace(old_history, new_history)
content = content.replace(old_trial_registry, new_trial_registry)

with open(v131_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Created V1.31 registry file successfully.")
