# Implementation Plan: Sandbox Trial for Multi-Model Code Review & Path Reconciliation

**Document ID**: CISEM-IP-20260806-SANDBOX-IGNITION  
**Version**: 1.2  
**Date**: 2026-08-06  
**Status**: DRAFT  
**Authority**: Governor Ratification Required  

---

## 1. Goal Description

To address alignment questions and verify the design before modifying the core platform, we will implement a **Sandbox-First Strategy**. We will create a local testing sandbox folder `sandbox_code_review/` to deploy placeholders and run trial execution loops. Once the schemas and runner script are refined and consensus is reached with the Governor, we will import them into the canonical root directory.

Additionally, we will proceed with the immediate registry path correction to resolve legacy reconciler failures.

---

## 2. Phase 1: Workspace Path Reconciliation

To align all path references with the new root workspace directory `C:\Users\finky\Desktop\AntiGravity\Cisem CsAg` and ensure the reconciler passes:

#### [MODIFY] [2026-08-05__CISEM__Universal_Workspace_and_Accountability_Registry__V1.1.yaml](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/2026-08-05__CISEM__Universal_Workspace_and_Accountability_Registry__V1.1.yaml)
*   **Version Update**: Increment version to `1.2` in metadata and append history entry.
*   **Path Configurations**:
    *   Change `workspace.root_path` to `"C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg"`
    *   Change `core_subsystems[subsystem_id=CISEM_CXP].canonical_directory` to `"C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg"`
    *   Change `platform_adapters[adapter_id=GOOGLE_ANTIGRAVITY_ADAPTER].canonical_directory` to `"C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\Marketing CoreHub CsAg"`
    *   Change `platform_adapters[adapter_id=GOOGLE_ANTIGRAVITY_ADAPTER].capability_profile` to `"C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\2026-08-05__CISEM__CXP__CapabilityRegistry__V1.2.yaml"`
    *   Change `transports[transport_id=TRANSPORT_MARKETING_DRIVE].local_sync_path` to `"C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\Marketing CoreHub CsAg\\9000__INTERSYSTEM_EXECUTION_EXCHANGE"`
    *   Change `pending_register.canonical_reference` to `"C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\2026-08-05__CISEM__Universal_Workspace_and_Accountability_Registry__V1.1.yaml"`

---

## 3. Phase 2: The Code Review Sandbox (`sandbox_code_review/`)

We will create a directory `C:\Users\finky\Desktop\AntiGravity\Cisem CsAg\sandbox_code_review\` and populate it with temporary placeholders to test the Multi-Model Code Review flow:

### Sandbox Files to Create

#### [NEW] [sandbox_code_review/registry_schema_draft.json](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/sandbox_code_review/registry_schema_draft.json)
Placeholder JSON schema defining review engines.

#### [NEW] [sandbox_code_review/engine_registry_draft.yaml](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/sandbox_code_review/engine_registry_draft.yaml)
Draft registry mapping two AI reviewers (e.g. one using `gpt-4o` if credentials are set, and one local mock fallback) and mechanical validators.

#### [NEW] [sandbox_code_review/findings_schema_draft.json](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/sandbox_code_review/findings_schema_draft.json)
Draft schema standardizing findings.

#### [NEW] [sandbox_code_review/profile_schema_draft.json](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/sandbox_code_review/profile_schema_draft.json)
Draft schema for review profiles.

#### [NEW] [sandbox_code_review/sandbox_runner.py](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/sandbox_code_review/sandbox_runner.py)
A sandbox execution script that:
1.  Reads a sample file diff or captures a mock diff from the sandbox.
2.  Runs static checking as a mechanical validator.
3.  Simulates review feedback from multiple AI review engines.
4.  Consolidates anomalies and outputs a trial audit report (`sandbox_code_review/trial_evidence.json`).

---

## 4. Verification & Progression Plan

1.  **Registry Path Verification**: Perform path changes in `Universal_Workspace_and_Accountability_Registry.yaml` and verify that running `WorkspaceReconciler.py` returns **SUCCESS** (exit code 0).
2.  **Sandbox Setup**: Create the sandbox directory and write the draft files.
3.  **Sandbox Run**: Run `python sandbox_runner.py` to generate the test report and verdict.
4.  **Consensus Review**: Review schemas and runner outputs with the user.
5.  **Canonical Promotion**: Once alignment is complete, clean up the sandbox and write versioned files to the canonical root.
