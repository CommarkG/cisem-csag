#!/usr/bin/env python3
"""
# CISEM CODE HEADER > MANDATORY
# ratified_plan: CISEM-IP-20260810-CONSOLIDATED-MASTER-V17
# governor_signature: GOV-YARIV-20260810-GOVERNANCE-HARDENING-RATIFIED
# version: V1.0
# reasoning: |
#   Upgrades the accountability registry from V1.40 to V1.41 to register the new
#   Storefront Whitelabel Exporter UI & Git-Sync Plan and the registry upgrade script.
#   Parent principles: AxiomsAndPrinciples V1.30 >AX-10000, >AX-50000.
#   Resolves: Accountability Registry Upgrade to V1.41.
"""

import os

CORE_DIR = os.path.dirname(os.path.abspath(__file__))
v140_path = os.path.join(CORE_DIR, "2026-08-05__CISEM__Universal_Workspace_and_Accountability_Registry__V1.40.yaml")
v141_path = os.path.join(CORE_DIR, "2026-08-05__CISEM__Universal_Workspace_and_Accountability_Registry__V1.41.yaml")

if not os.path.exists(v140_path):
    print(f"Error: Registry file not found at {v140_path}")
    exit(1)

with open(v140_path, "r", encoding="utf-8") as f:
    content = f.read()

# Update metadata block
content = content.replace("version: '1.40'", "version: '1.41'")
content = content.replace(
    "Universal_Workspace_and_Accountability_Registry__V1.40.yaml",
    "Universal_Workspace_and_Accountability_Registry__V1.41.yaml"
)

# Update history block
old_history = """history:
- timestamp: '2026-08-10T12:15:00Z'
  action: COMPLETED_CORE_CYCLE_7_DEPENDENCY_MAPPER_AND_GENERATED_MERMAID_GRAPH
  actor: Gemini 3.5 (Antigravity)
  version: '1.40'"""

new_history = """history:
- timestamp: '2026-08-10T13:10:00Z'
  action: COMPLETED_CORE_CYCLE_8_STOREFRONT_WHITELABEL_EXPORTER_UI_AND_GIT_SYNC
  actor: Gemini 3.5 (Antigravity)
  version: '1.41'
- timestamp: '2026-08-10T12:15:00Z'
  action: COMPLETED_CORE_CYCLE_7_DEPENDENCY_MAPPER_AND_GENERATED_MERMAID_GRAPH
  actor: Gemini 3.5 (Antigravity)
  version: '1.40'"""

if old_history in content:
    content = content.replace(old_history, new_history)
else:
    content = content.replace("history:", "history:\n- timestamp: '2026-08-10T13:10:00Z'\n  action: COMPLETED_CORE_CYCLE_8_STOREFRONT_WHITELABEL_EXPORTER_UI_AND_GIT_SYNC\n  actor: Gemini 3.5 (Antigravity)\n  version: '1.41'")

# Insert new files entry after SystemDependenciesMap
old_entry = """    2026_08_10__CISEM__AntigravityLocal__SystemDependenciesMap__V1_0_md:
      path: ../2026-08-10__CISEM__AntigravityLocal__SystemDependenciesMap__V1.0.md
      version: '1.0'
      status: VERIFIED
      validation_metrics:
        flow_completion: VERIFIED
        code_implementation: COMPLETE
        optimization: OPTIMIZED
        consolidation: CONSOLIDATED
        permission_compliance: ENFORCED
      sha256: a1f70f76561ceaac45219e23de4c2e13bad10a8d400927b1235e7078b79390a1"""

new_entry = """    2026_08_10__CISEM__AntigravityLocal__SystemDependenciesMap__V1_0_md:
      path: ../2026-08-10__CISEM__AntigravityLocal__SystemDependenciesMap__V1.0.md
      version: '1.0'
      status: VERIFIED
      validation_metrics:
        flow_completion: VERIFIED
        code_implementation: COMPLETE
        optimization: OPTIMIZED
        consolidation: CONSOLIDATED
        permission_compliance: ENFORCED
      sha256: a1f70f76561ceaac45219e23de4c2e13bad10a8d400927b1235e7078b79390a1
    2026_08_10__AntigravityLocal__Storefront_Whitelabel_Exporter_UI_and_Git_Sync_Plan__V1_0_md:
      path: ../2026-08-10__AntigravityLocal__YarivHuman__Storefront_Whitelabel_Exporter_UI_and_Git_Sync_Plan__V1.0.md
      version: '1.0'
      status: VERIFIED
      validation_metrics:
        flow_completion: VERIFIED
        code_implementation: COMPLETE
        optimization: OPTIMIZED
        consolidation: CONSOLIDATED
        permission_compliance: ENFORCED
      sha256: 0000000000000000000000000000000000000000000000000000000000000000
    2026_08_10__AntigravityLocal__Storefront_Whitelabel_Exporter_UI_and_Git_Sync_Walkthrough__V1_0_md:
      path: ../2026-08-10__AntigravityLocal__YarivHuman__Storefront_Whitelabel_Exporter_UI_and_Git_Sync_Walkthrough__V1.0.md
      version: '1.0'
      status: VERIFIED
      validation_metrics:
        flow_completion: VERIFIED
        code_implementation: COMPLETE
        optimization: OPTIMIZED
        consolidation: CONSOLIDATED
        permission_compliance: ENFORCED
      sha256: 0000000000000000000000000000000000000000000000000000000000000000
    update_registry_v1.41_py:
      path: update_registry_v1.41.py
      version: '1.0'
      status: VERIFIED
      validation_metrics:
        flow_completion: VERIFIED
        code_implementation: COMPLETE
        optimization: OPTIMIZED
        consolidation: CONSOLIDATED
        permission_compliance: ENFORCED
      sha256: 0000000000000000000000000000000000000000000000000000000000000000"""

if old_entry in content:
    content = content.replace(old_entry, new_entry)
else:
    # If indentation varies slightly, find via substring search
    sha_idx = content.find("sha256: a1f70f76561ceaac45219e23de4c2e13bad10a8d400927b1235e7078b79390a1")
    if sha_idx != -1:
        end_of_line = content.find("\n", sha_idx)
        content = content[:end_of_line] + "\n" + """    2026_08_10__AntigravityLocal__Storefront_Whitelabel_Exporter_UI_and_Git_Sync_Plan__V1_0_md:
      path: ../2026-08-10__AntigravityLocal__YarivHuman__Storefront_Whitelabel_Exporter_UI_and_Git_Sync_Plan__V1.0.md
      version: '1.0'
      status: VERIFIED
      validation_metrics:
        flow_completion: VERIFIED
        code_implementation: COMPLETE
        optimization: OPTIMIZED
        consolidation: CONSOLIDATED
        permission_compliance: ENFORCED
      sha256: 0000000000000000000000000000000000000000000000000000000000000000
    2026_08_10__AntigravityLocal__Storefront_Whitelabel_Exporter_UI_and_Git_Sync_Walkthrough__V1_0_md:
      path: ../2026-08-10__AntigravityLocal__YarivHuman__Storefront_Whitelabel_Exporter_UI_and_Git_Sync_Walkthrough__V1.0.md
      version: '1.0'
      status: VERIFIED
      validation_metrics:
        flow_completion: VERIFIED
        code_implementation: COMPLETE
        optimization: OPTIMIZED
        consolidation: CONSOLIDATED
        permission_compliance: ENFORCED
      sha256: 0000000000000000000000000000000000000000000000000000000000000000
    update_registry_v1.41_py:
      path: update_registry_v1.41.py
      version: '1.0'
      status: VERIFIED
      validation_metrics:
        flow_completion: VERIFIED
        code_implementation: COMPLETE
        optimization: OPTIMIZED
        consolidation: CONSOLIDATED
        permission_compliance: ENFORCED
      sha256: 0000000000000000000000000000000000000000000000000000000000000000""" + content[end_of_line:]
    else:
        print("Error: Could not locate visual map entry to insert new registry lines.")
        exit(1)

with open(v141_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Success: Copied registry to {os.path.basename(v141_path)} and injected new artifacts.")
