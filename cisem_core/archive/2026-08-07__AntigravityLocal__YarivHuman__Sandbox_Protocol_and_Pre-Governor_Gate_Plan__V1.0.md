---
metadata:
  owner: "CISEM_GOVERNOR"
  plan_id: "CISEM-IP-20260807-SANDBOX-GATE"
  canonical_location: "C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\2026-08-07__AntigravityLocal__YarivHuman__Sandbox_Protocol_and_Pre-Governor_Gate_Plan__V1.0.md"
  artifact_status: "DRAFT"
  maturity: "WORKING_DRAFT"
  version: "1.0"
  role_type: "PLAN"
  blast_radius: "HIGH"
plan_id: "CISEM-IP-20260807-SANDBOX-GATE"
title: "CISEM Sandbox Protocol & Pre-Governor Gate Plan"
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

# CISEM Sandbox Protocol & Pre-Governor Gate Plan

This plan proposes the creation of a canonical **Sandbox Protocol Specification** to govern agent behavior and execution rules in playgrounds, alongside upgrading the compiler gate to act as an automated pre-review gate for plans before they reach the Governor.

---

## User Review Required

> [!IMPORTANT]
> - **Pre-Governor Gate Integration**: The compiler gate (`cisem_gate.py`) will physically intercept any new implementation plans. It will run automated audits (via `PlanIngestor.py` and virtual personas) and block build/execution if there are unresolved gaps or missing templates, filtering out issues *before* prompting you for signature.
> - **Sandbox Registry Rules**: The new sandbox protocol will enforce file organization, gradual batch trial checks, and auto-ingestion templates for any project flagged as `playground` or `sandbox`.

---

## Open Questions

- Should we build a simple web view in our Next.js dashboard showing the "Pre-Review Status" of pending plans (e.g. showing which audit checks have passed and what is blocking)?

---

## Proposed Changes

### 1. Sandbox Protocol Component

#### [NEW] [SandboxProtocolSpecification V1.0](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/planning/2026-08-07__CISEM__Planning__SandboxProtocolSpecification__V1.0.md)
- Establishes the rules of sandbox operations.
- Enforces the **Yariv Gradual Trial Protocol (Y-GTP)** as a mechanical constraint.
- Outlines the directory mapping and naming conventions for experimental folders.
- Documents AI persona settings and user preferences to inject into all sandbox chats.

---

### 2. Pre-Governor Gate Upgrades

#### [MODIFY] [PlanIngestor.py](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/planning/2026-08-07__GoogleAntigravity__Planning__PlanIngestor__V0.1.py)
- Upgrades parsing logic to check for a two-tier review state: `PRE_REVIEW_PASSED` and `RATIFIED`.
- If a plan is created, `PlanIngestor.py` runs a suite of structural audits and outputs a status token. If it passes, it updates the metadata header to `PRE_REVIEW_PASSED: true`.

#### [MODIFY] [cisem_gate.py](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/cisem_gate.py)
- Updates `Phase 6: Plan Ingestion Validation` to assert that any plan files in progress have passed the pre-review audits. If they contain formatting or template errors, it prints actionable instructions and exits 1, preventing execution before the Governor ever sees it.

---

## Verification Plan

### Automated Tests
- Create a mock malformed plan `test_malformed_plan.md` in the brain folder and verify `PlanIngestor.py` flags the errors and block compiles.
- Run `python cisem_core/cisem_gate.py` to assert that the gate correctly approves a clean plan and blocks an unverified one.

### Manual Verification
- Test that creating sandbox files conforming to the new Sandbox Protocol bypasses the main control plane locks while enforcing the batch sizes locally.
