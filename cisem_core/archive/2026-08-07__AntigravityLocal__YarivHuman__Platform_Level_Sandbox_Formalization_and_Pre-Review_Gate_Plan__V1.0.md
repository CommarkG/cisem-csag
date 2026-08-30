---
metadata:
  owner: "CISEM_GOVERNOR"
  plan_id: "CISEM-IP-20260807-PLATFORM-SANDBOX"
  canonical_location: "C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\2026-08-07__AntigravityLocal__YarivHuman__Platform_Level_Sandbox_Formalization_and_Pre-Review_Gate_Plan__V1.0.md"
  artifact_status: "DRAFT"
  maturity: "WORKING_DRAFT"
  version: "1.0"
  role_type: "PLAN"
  blast_radius: "HIGH"
plan_id: "CISEM-IP-20260807-PLATFORM-SANDBOX"
title: "Platform-Level Sandbox Formalization & Pre-Review Gate Plan"
version: "V1.0"
governor_signature: ""
blast_radius: "HIGH"
axioms_linked:
  - "AX-10000"
  - "PR-13900"
  - "PR-13950"
  - "PR-33500"
  - "PR-98000"
---

# Platform-Level Sandbox Formalization & Pre-Review Gate Plan

This plan details the platform-level integration of the **Sandbox/Playground** as a first-class registered project in CISEM, upgrading the compiler gate to act as an automated pre-review gate, establishing a two-way automated sync bridge, and enforcing mandatory file naming and response numbering rules in the sandbox.

---

## User Review Required

> [!IMPORTANT]
> - **Platform Sandbox Registration**: The Sandbox is registered directly under the CISEM control plane (`Universal Workspace Registry V1.5.yaml`). This elevates it from a loose folder to a first-class platform entity subject to automated validation rules.
> - **Automated AI Pre-Review Gate**: The compile gate (`cisem_gate.py`) will physically intercept any new implementation plans. It will run automated audits (via `PlanIngestor.py` and virtual personas) and block build/execution if there are unresolved gaps or missing templates, filtering out issues *before* prompting you for signature.
> - **Two-Way Automated Sync Bridge**: The background watcher daemon (`CxpWatcher.py`) will monitor both the core workspace and the parallel Claude Code workspace. It will automatically sync new draft plans from the sandbox to the core, and publish reviews or comment files back to the sandbox directory, eliminating manual copy-pasting.
> - **Mandatory Sandbox Naming & Numbering**: All sandbox assets (code, designs, walkthroughs) are subject to strict file naming and paragraph numbering rules. The compiler gate will scan the sandbox folder and flag warning diagnostics on any files that violate these format protocols.

---

## Open Questions

- None. The design is unified.

---

## Proposed Changes

### 1. Platform-Level Sandbox Formalization & Sync Bridge

#### [MODIFY] [Workspace Registry](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/2026-08-05__CISEM__Universal_Workspace_and_Accountability_Registry__V1.5.yaml)
- Registers the automated sync bridge parameters inside the `SANDBOX_PLAYGROUND` configuration block, defining source and destination mappings.

#### [MODIFY] [CxpWatcher.py](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/cxp/2026-08-05__GoogleAntigravity__Cxp__CxpWatcher__V0.1.py)
- Integrates a two-way folder sync routine.
- Scans `C:\Users\finky\Desktop\AntiGravity\Sandbox Csag\` for any files matching `*Draft*Plan*.md`. If found, it copies them to `sandbox/`.
- Scans `sandbox/` inside the core for any files matching `*Review*.md` or comment sheets written by the auditor. If found, it copies them back to the target sandbox folder automatically.

#### [NEW] [SandboxProtocolSpecification V1.0](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/planning/2026-08-07__CISEM__Planning__SandboxProtocolSpecification__V1.0.md)
- Establishes the rules of sandbox operations.
- Enforces the **Yariv Gradual Trial Protocol (Y-GTP)** as a mechanical constraint.
- Makes file naming (`GEMINI.md` Rule 2) and paragraph numbering (`AGENTS.md` Rule 10) strictly **mandatory** for sandbox contents.
- Documents AI persona settings and user preferences to inject into all sandbox chats.

---

### 2. Pre-Governor Gate Upgrades

#### [MODIFY] [PlanIngestor.py](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/planning/2026-08-07__GoogleAntigravity__Planning__PlanIngestor__V0.1.py)
- Upgrades parsing logic to check for a two-tier review state: `PRE_REVIEW_PASSED` and `RATIFIED`.
- If a plan is created, `PlanIngestor.py` runs a suite of structural audits and outputs a status token. If it passes, it updates the metadata header to `PRE_REVIEW_PASSED: true`.

#### [MODIFY] [cisem_gate.py](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/cisem_gate.py)
- Updates `Phase 6: Plan Ingestion Validation` to assert that any plan files in progress have passed the pre-review audits. If they contain formatting or template errors, it prints actionable instructions and exits 1, preventing execution before the Governor ever sees it.
- Adds an audit phase that scans the sandbox directory and outputs formatting warnings on any files that violate naming or numbering rules.

---

## Verification Plan

### Automated Tests
- Create a mock malformed plan `test_malformed_plan.md` in the brain folder and verify `PlanIngestor.py` flags the errors and block compiles.
- Run `python cisem_core/cisem_gate.py` to assert that the gate correctly approves a clean plan and blocks an unverified one.

### Manual Verification
- Test that creating sandbox files conforming to the new Sandbox Protocol bypasses the main control plane locks while enforcing the batch sizes locally.
