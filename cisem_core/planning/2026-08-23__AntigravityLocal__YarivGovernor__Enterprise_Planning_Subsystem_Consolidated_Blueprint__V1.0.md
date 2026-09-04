---
metadata:
  owner: "CISEM_GOVERNOR"
  canonical_location: "C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\cisem_core\\planning\\2026-08-23__AntigravityLocal__YarivGovernor__Enterprise_Planning_Subsystem_Consolidated_Blueprint__V1.0.md"
  artifact_status: "RATIFIED_CONCEPT"
  maturity: "RELEASE_CANDIDATE"
  version: "1.0"
  plan_id: "CISEM-IP-20260823-ENTERPRISE-PLANNING-SUBSYSTEM"
  governor_signature: "GOV-YARIV-20260823-ENTERPRISE-PLANNING-SUBSYSTEM-V1.0"
  axioms_linked:
    - "AX-10000"
    - "AX-20000"
    - "PR-13900"
    - "PR-13950"
    - "PR-58950"
  related_implementation_adapter: "GOOGLE_ANTIGRAVITY_ADAPTER"
  local_edits_allowed: false
  role_type: "CANONICAL_ENTERPRISE_PLANNING_BLUEPRINT"
---

# Enterprise Planning Subsystem Consolidated Blueprint: The Inquiry Spine & Corespine Engine

1.1. **Executive Summary & Scope**:
This document formalizes the **Enterprise Planning Subsystem (`CISEM_ENTERPRISE_PLANNING`)** for the Cisem CsAg platform. It consolidates the architectural synthesis, database schema alignment, priority orchestration, multi-tenant isolation, and CoreSpiral/VerticalSlice data structures into a single canonical reference document.

---

## 2. SECTION 1: EXISTING PLANNING MACHINERY AUDIT

2.1. **Repository Baseline Inventory**:
- **`cisem_core/planning/2026-08-07__CISEM__Planning__Specification__V1.0.md` (L25–55)**
  - *Holds:* Document metadata schema (`plan_id`, `governor_signature`, `axioms_linked`) and required markdown headings.
  - *Read by:* [`cisem_gate.py`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/platform_core/cisem_gate.py) Phase 6 & 10.
- **`cisem_core/planning/ratified_plans_manifest.json` (L1–15)**
  - *Holds:* Single source of truth for Governor-ratified plan IDs, signatures, dates, and authorized directory scopes.
  - *Read by:* [`cisem_gate.py`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/platform_core/cisem_gate.py) Phase 4 & 22.5.
- **`cisem_core/sandbox/parking_vault_draft.yaml` (L1–50)**
  - *Holds:* Parked items, gaps, unblocking conditions, and links to plan IDs.
  - *Read by:* [`cisem_gate.py`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/platform_core/cisem_gate.py) Phase 4 (`validate_parking_vault_linkage`).
- **`cisem_core/platform_core/cisem_gate.py` (L324–350, L1725–1785)**
  - *Holds:* Compiler regex validation (`HEADER_PATTERN`) and code header audit rules.
  - *Read by:* Pre-commit gate hook wrapper.

---

## 3. SECTION 2: THE INQUIRY SPINE DATABASE ALIGNMENT

3.1. **Schema Registry Proof**:
The database schema defined in `cisem_core/live_schema_registry.json` (L17–48) ALREADY models the enterprise planning lifecycle:
- `inquiries`: The root planning entity (`id`, `customer_account_id`, `reference`, `title`, `description`, `owner_user_id`, `status_code`, `attributes`).
- `round_artifacts`: Links each iterative consensus round to versioned plan documents (`id`, `round_id`, `artifact_id`).
- `artifacts`: Immutable versioned plan documents (`id`, `kind_code`, `title`, `version`, `supersedes_id`, `storage_reference`, `attributes`).
- `decision_records`: Sealed Governor ratifications (`id`, `round_id`, `inquiry_id`, `outcome_code`, `content`, `sealed_at`, `sealed_by`).
- `participants`: Reviewers, Governor, and agent roles (`id`, `inquiry_id`, `user_id`, `level_code`).
- `account_closure` & `team_closure`: Closure tables recording Corespine structural inheritance (`ancestor_id`, `descendant_id`, `depth`).

3.2. **Architectural Finding**:
An inquiry going through rounds, artifacts, and sealed decision records IS a plan going through consensus and ratification. The Governor already possesses this schema in PostgreSQL; operationalizing it is an API wiring task rather than a database design task.

---

## 4. SECTION 3: THE GOVERNOR'S SEVEN PLANNING ARCHITECTURE PILLARS

4.1. **Pillar 1: Intent Intake Connection**:
Every enterprise plan originates at the Intent Intake API (`POST /api/v1/intake`). The handler creates an `inquiries` record with `kind_code = 'PLANNING_INTENT'` and initial `status_code = 'RAW_INTENT'`, routing through the standard intent sanitizer.

4.2. **Pillar 2: Plan Shape (Structure vs Data)**:
- **Structure (Database Schema):** Fixed tables (`inquiries`, `artifacts`, `decision_records`) define the lifecycle framework.
- **Data (Rows):** Plan versions, file scope arrays, tax terms, and tenant decisions live in rows.
- *First Law Compliance:* Values that differ across tenants or moments are rows in `status_library`, `tag_library`, or `artifacts.attributes`.

4.3. **Pillar 3: Priority Orchestrator Architecture (`PriorityRouter.py`)**:
The orchestrator evaluates incoming intent using Keystone Sequencing. It reads:
1. `inquiries.status_code` and active round state.
2. `backlog_registry.impact_level` and dependency unblocking count.
3. Ambiguity score ($> 10\%$ delta forces a pause for Governor clarification).
4. `parking_vault_draft.yaml` unblocking conditions.

4.4. **Pillar 4: Multi-Tenant Isolation**:
- **Shared Infrastructure:** Database schema (`inquiries`, `decision_records`), engine code, and `cisem_gate.py` rules are global platform infrastructure.
- **Tenant Content:** All rows in `inquiries`, `artifacts`, `decision_records`, and `tag_library` carry `customer_account_id` and are strictly partitioned by Row Level Security (RLS) policies.

4.5. **Pillar 5: Permanent Container Lifecycle**:
The `decision_records` table (`sealed_at`, `sealed_by`) and `artifacts` table (`supersedes_id`, `version`) implement container state transitions:
`RAW_INTENT` $\rightarrow$ `DRAFT_PROPOSAL` $\rightarrow$ `SOCRATIC_VERIFIED` $\rightarrow$ `GOVERNOR_RATIFIED` $\rightarrow$ `SEALED_EXECUTION` $\rightarrow$ `VALIDATED_IMPACT` $\rightarrow$ `ARCHIVED`.

4.6. **Pillar 6: Connection to Axioms, Vocabulary & Platform Wisdom**:
`tag_library` and `lookup_registry` store axiom references (`AX-10000`). When an `artifacts` row references a `tag_id`, foreign-key constraints ensure citations resolve to active platform principles.

4.7. **Pillar 7: Plan Templates by Type**:
`template_registry` (`code`, `name`, `content_schema`, `attributes`) IS the canonical home for plan templates (`ARCHITECTURE_REFACTOR`, `SECURITY_HARDENING`, `FEATURE_ADDITION`, `EMERGENCY_PATCH`).

---

## 5. SECTION 4: THE REVIEWER'S SIX ENTERPRISE EXTENSIONS

5.1. **Extension 1: Plan Dependency Graph**:
Dependencies are stored in `inquiries.attributes` as `blocked_by_inquiry_ids: [...]`. The orchestrator verifies that all blocking inquiry IDs have `status_code = 'SEALED'` before promoting a plan.

5.2. **Extension 2: Decay Cost & Expiration Window**:
Recorded in `inquiries.attributes` as `decay_cost_per_turn` and `expiration_window_turn`. If an execution window approaches expiration, `PriorityRouter.py` escalates its priority ahead of un-windowed tasks.

5.3. **Extension 3: Revision Reasoning History**:
Stored in `artifacts.attributes.revision_reasoning` and linked via `artifacts.supersedes_id`. Each round creates a new version artifact linking to its predecessor, preserving why a stage moved.

5.4. **Extension 4: Review Standpoint Record**:
Stored in `decision_records.content` as `review_standpoints: [{ "reviewer": "Claude", "standpoint": "COLD_REVIEW", "findings_count": 7 }]`.

5.5. **Extension 5: Simulation Planning**:
Non-trivial plans (blast radius = HIGH) must execute a dry-run simulation against GRS Sandbox before Governor ratification. `decision_records` records `simulation_passed = true`.

5.6. **Extension 6: CLI Automation & Friction Mitigation**:
To prevent manual YAML drafting friction, the CLI utility (`cisem_core/tools/plan.py`) auto-generates schema rows from brief command flags (`agy plan create --title "..."`).

---

## 6. SECTION 5: CORESPINE, CORECYCLE & SPIRAL AS DATA STRUCTURES

6.1. **Corespine as Data (Closure Tables)**:
`account_closure` (`ancestor_id`, `descendant_id`, `depth`) holds ordered ancestry chains in a single query. A Corespine is an ordered Directed Acyclic Graph (DAG) of settled elements where `depth` defines structural lineage.

6.2. **Cycle Inheritance Declaration & Refusal Mechanism**:
- A VerticalSlice declares `inherited_ancestor_ids: [...]`.
- **Mandatory Refusal Mechanism (Committed to `cisem_gate.py`):** If a proposed plan artifact modifies an ancestor element where `decision_records.sealed_at IS NOT NULL`, [`cisem_gate.py`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/platform_core/cisem_gate.py) Phase 15 hard-blocks execution:
  ```text
  CISEM_GATE_BLOCKED -- Phase 15: VerticalSlice Inheritance Violation.
    Plan attempts to contradict sealed Corespine ancestor element 'PARK-002'.
    Action: Re-ratify ancestor element or fork a new spiral iteration.
  ```

6.3. **Making Depth Visible (Spiral vs Cycle)**:
- **VerticalSlice (1st Pass):** Initial pass over a Corespine element created with `depth = 1` in `account_closure`.
- **Spiral (N-th Pass):** Subsequent pass over the same Corespine element created with `depth = N` in `account_closure` and incremented `version` in `artifacts`, distinguishing a multi-pass spiral from single-cycle iteration.

6.4. **Anti-Pattern Defeat Guard**:
The gate prevents un-tracked edits by verifying `supersedes_id` linkages in `artifacts` and enforcing that sealed `decision_records` cannot be modified without generating a new child round.

---

## 7. RECONCILE LOG & HISTORY

- **2026-08-23**: Consolidated blueprint created and ratified as Version 1.0 by Google Antigravity Adapter.
