---
plan_id: "CISEM-IP-20260825-MASTER-CONSOLIDATED-V2"
version: "V2.0"
tier: "MEGA"
blast_radius: "HIGH"
date: "2026-08-25"
author: "Antigravity (Google DeepMind Team)"
authority: "Yariv, Governor of CISEM CsAg"
governor_signature: "UNRATIFIED-DRAFT-IN-PROGRESS"
artifact_status: "DRAFT"
pre_review_status: "PASSED"
related_axioms:
  - "PR-11100" # Multi-Tenant Cryptographic Context
  - "PR-11400" # Twelve-Factor Environment Config
  - "PR-23500" # Intent Before Taxonomy
  - "AX-100000" # Evidence & Wiring Standard
axioms_linked:
  - "PR-11100"
  - "PR-11400"
  - "PR-23500"
  - "AX-100000"
---

# Master Consolidated Implementation & Governance Plan V2.0

> [!IMPORTANT]
> **THE LAW OF ITERATION (Governor Ratified 2026-08-25 / AX-12000)**:
> ITERATION IS A VIRTUE. A plan may be revised as many times as the subject requires. A round that changes the plan HAS PAID FOR ITSELF. Neither agent may treat a further round as a failure, a delay, or a cost to be minimised.
> **The Boundary**: Iteration must stay strictly on the subject. Drifting into interesting possibilities is not iteration — IT IS AVOIDANCE, and it is what the friction rule exists to catch. The test is whether a round changed something that would otherwise have been built wrong.
> **The Measure**: The measure of success is NOT the number of rounds. It is whether an unresolved objection remains.

## 1. Executive Summary & Background Context

1.1. Over the last 48 hours (August 23–25, 2026), key architectural breakthroughs, governance control fixes, and platform capabilities were established, discussed, or diagnosed across the CISEM platform. To ensure zero loss of context, complete hardwiring, and permanent alignment, this Master Plan consolidates all active, uncompleted, and proposed items into a single, prioritized, on-disk execution contract.

1.2. Nothing is omitted. Every item is assigned a priority rank based on Keystone Sequencing (*Complete what unblocks the most*), a clear containment boundary, and an explicit verification mechanism.

---

## 2. User Review Required & Key Architectural Decisions

2.1. **State-Bearing Change Object Enforcement (`CHANGE_DECISION`)**: Ratifying the invariant `Proposed State ≠ Current State` by establishing a formal `CHANGE_DECISION` schema in `cael_status.json` that prevents diagnostic recommendations from acquiring execution authority without explicit Governor signature.

2.2. **Database Persistence for Tenant Settings (`customer_accounts.settings`)**: Hardwiring JSON schema validation on database reads (`tenant-config.schema.json`) with an automatic fallback to `default-tenant-pack` to eliminate crash risks from corrupted tenant JSON payloads.

2.3. **Formal Supersession of 40 Historical Plan Documents**: Marking 35+ historical plans created before August 10, 2026 as `SUPERSEDED_HISTORICAL_RECORD` in `ratified_plans_manifest.json` while retaining all files on disk (`RETIREMENT ≠ DELETION`).

---

## 3. Open Questions for Governor Ratification

3.1. Should old coexisting registry versions in `cisem_core/` (V1.25 through V1.43) be moved to an archive subfolder `cisem_core/canon/archive/` to resolve `PARK-041`?

3.2. Do you approve ratifying `PARK-028` (Marketing & Image Processing Top Trial Run) as the next gradual trial sequence?

---

## 4. Prioritized Implementation Roadmap (Keystone-First Sequence)

4.1. **Priority 1: Core Gate & Change Decision Enforcement Engine (`cisem_gate.py`)**.
4.2. **Priority 2: Multi-Tenant Context & Read Schema Validation (`backend/src/backend/main.py`)**.
4.3. **Priority 3: Universal Onboarding Viewport & Roster Integration (`UniversalOnboardingViewport.jsx`)**.
4.4. **Priority 4: Registry Duplication Cleanup & Historical Plan Supersession (`ratified_plans_manifest.json`)**.
4.5. **Priority 5: Resolution of Uncompleted Parking Vault Items (`PARK-001`, `PARK-028`, `PARK-031`)**.

---

## 5. Detailed Component Modifications

5.1. **[`cisem_core/platform_core/cisem_gate.py`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/platform_core/cisem_gate.py)**:
- Hardwire Phase 27 (`ChangeDecisionStateGate`): Verifies that any code or configuration edit touching active architecture references a valid `CHANGE_DECISION` object ID in `cael_status.json` with `decision_state: RATIFIED`.

5.2. **[`backend/src/backend/main.py`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/main.py)**:
- Update `GET /api/v1/tenant/members` and tenant settings handlers to validate database `customer_accounts.settings` JSONB against `src/config/schemas/tenant-config.schema.json` on read.
- Implement automatic fallback to `default-tenant-pack` and emit an audit log entry to `events` if DB settings fail schema validation.

5.3. **[`src/config/schemas/tenant-config.schema.json`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/config/schemas/tenant-config.schema.json)**:
- Define declarative JSON schema for tenant configuration: `tenant_id`, `company_name`, `brand_color`, `default_locale`, `rtl_enabled`, `enabled_capabilities`, and `terminology`.

5.4. **[`src/components/views/UniversalOnboardingViewport.jsx`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/components/views/UniversalOnboardingViewport.jsx)**:
- Connect onboarding viewport to fetch live validated tenant settings from `/api/v1/tenant/members`.

5.5. **[`cisem_core/planning/ratified_plans_manifest.json`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/planning/ratified_plans_manifest.json)**:
- Add formal supersession entries for 35+ historical plan documents, marking them as `SUPERSEDED_HISTORICAL_RECORD`.

---

## 6. Verification Plan & Single Executable Proof

6.1. **Automated Integration Proof**: Run `python cisem_core/platform_core/cisem_gate.py` to verify all phases pass 100% cleanly.
6.2. **Manual Verification**: Sign in as Omri Shilo (`account_admin` at `AGN Ltd`) $\rightarrow$ Navigate to `#/onboarding` $\rightarrow$ Verify single-row header renders **Omri Shilo | account_admin | AGN Ltd**.
