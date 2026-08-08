---
metadata:
  owner: "CISEM_GOVERNOR"
  subsystem_id: "CISEM_PLAN_PROTOCOL"
  canonical_location: "C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\2026-08-07__CISEM__AntigravityLocal__PlanProtocolSpecification__V1.0.md"
  artifact_status: "COMPLETED"
  maturity: "WORKING_IMPLEMENTATION"
  version: "1.0"
  role_type: "SPECIFICATION"
  blast_radius: "MEDIUM"
owner: "CISEM_GOVERNOR"
subsystem_id: "CISEM_PLAN_PROTOCOL"
canonical_location: "C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\2026-08-07__CISEM__AntigravityLocal__PlanProtocolSpecification__V1.0.md"
artifact_status: "COMPLETED"
maturity: "WORKING_IMPLEMENTATION"
version: "1.0"
role_type: "SPECIFICATION"
blast_radius: "MEDIUM"
---
# CISEM Plan Creation Protocol Specification (CISEM_PLAN_PROTOCOL)

This specification defines the `CISEM_PLAN_PROTOCOL` Protocol, a sequence-driven procedure designed to manage the creation, validation, and ratification of implementation plans within the workspace.

---

## 1. Background & Purpose
Drafting plans without strict syntax validation leads to malformed frontmatter, incorrect blast radius estimates, and unaligned registry entries. This protocol establishes the mandatory checks and signature gates for planning operations.

---

## 2. Purpose & Governance
*   **Operation**: Create a plan.
*   **Measurable Goal**: Generate a schema-conforming implementation plan signed by the Governor.
*   **Governing Corespine**: `CISEM_PLANNING`
*   **Constraining Overlays**: `CISEM_TRACEABILITY`
*   **Does NOT Cover**: Direct code editing or runtime execution steps.

---

## 3. Entry Conditions
*   **Trigger**: Operator initiates a plan proposal request.
*   **Preconditions**: Workspace must be free of active compilation locks.
*   **Required Inputs**: Goal description, proposed changes list, verification plan.
*   **Refusal Conditions**: Block run if the target file path is already locked by another plan.

---

## 4. The Procedure
1.  **Step 1: Draft Plan Structure**: Parse input blocks and layout the required sections (User Review, Open Questions, Proposed Changes).
2.  **Step 2: Parse Metadata**: Format the YAML frontmatter. Assert plan ID matches the naming pattern.
3.  **Step 3: Run Schema validation**: Execute the Plan Ingestor validation check (Phase 6).
    *   *Gate G1*: If the Ingestor detects schema anomalies, halt execution (fail-closed).
4.  **Step 4: Request Review**: Submit the plan to the Governor for signature.
    *   *Gate G2 (Judgment)*: Governor reviews and writes signature key.
5.  **Step 5: Register Plan**: Write the plan record to the Universal Workspace Registry.

---

## 5. Outputs & Done Definition
*   **Output Shape**: A signed `implementation_plan.md` document in the brain directory.
*   **Definition of Done**: All steps executed, G1 and G2 cleared, and Plan ID logged in the registry.
*   **Verification**: Verified by Phase 6 compiler checks.
