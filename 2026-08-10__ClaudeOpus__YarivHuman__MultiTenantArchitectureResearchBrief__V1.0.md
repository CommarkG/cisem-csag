---
metadata:
  owner: "CISEM_GOVERNOR"
  canonical_location: "C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\2026-08-10__ClaudeOpus__YarivHuman__MultiTenantArchitectureResearchBrief__V1.0.md"
  artifact_status: "DRAFT"
  maturity: "WORKING_DRAFT"
  version: "1.0"
  role_type: "ARCHITECTURAL_RESEARCH_BRIEF"
  author: "Claude Opus 4 (Antigravity Local Adapter)"
  related_axioms: ["AX-10000", "AX-20000", "AX-40000", "AX-60000", "PR-13990", "PR-44500"]
---

# Research Brief: CSAG Multi-Tenant User Hierarchy & Universal Solution Core

**Author**: Claude Opus 4 (Antigravity Local Adapter)
**Date**: 2026-08-10
**Version**: 1.0
**Brief Status**: Open for clarification questions before architectural drafting

---

## 0. Author's Clarification Questions (First Round)

0.1. Before drafting architectural recommendations, I need alignment on these open design boundaries. There are **no rigid axioms constraining this design phase** — these questions exist to prevent me from building the wrong scaffolding.

### 0.1. Account Scope Model
0.1.1. **Question**: Should a user account be scoped strictly to one `customer_account` (tenant), or should a single human be able to hold roles in multiple tenants simultaneously (e.g., Account Owner in Tenant A, Team Leader in Tenant B)?
0.1.2. **Why it matters**: This determines whether we model `users` as children of `customer_accounts` (simple tree) or as an independent entity with a many-to-many `user_account_roles` join table (graph). The Overlay permission model changes shape entirely depending on the answer.

### 0.2. Template Customization Ownership
0.2.1. **Question**: When a tenant selects a battle-tested landing page template from the Universal Core and customizes it, where does the customized version live?
0.2.2. **Option A**: A sandbox variant record linked to the original template (using the existing `catalog_item_sandbox_variants` pattern in [migrations.sql, line 209](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/migrations.sql)).
0.2.3. **Option B**: A new customer-owned template record that carries a `forked_from` pointer back to the canonical template.
0.2.4. **Why it matters**: Option A keeps the template library tightly coupled (good for updates, risky for tenant isolation). Option B gives tenants full ownership (good for isolation, harder to push upstream improvements).

### 0.3. Package Enforcement Layer
0.3.1. **Question**: Should predefined package boundaries (Starter, Growth, Enterprise) be enforced at the API boundary (header-based `TenantContext` checks, as currently done with `X-User-Role` in [main.py, line 969](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/main.py)), at the database level (Row Level Security policies), or both?
0.3.2. **Why it matters**: API-only enforcement is faster to implement but trusts the application layer. RLS enforcement is structurally impossible to bypass but adds PostgreSQL complexity. The answer determines whether the Overlay's "tighten, never loosen" property is enforced mechanically (RLS) or procedurally (middleware).

### 0.4. Supplier Scraper Positioning
0.4.1. **Question**: The Supplier Scraper is confirmed as a minor sub-feature — a small SaaS draft solution for corporate gifts, decoupled from the core platform. Should it live as a sandbox module (`sandbox/supplier_scraper/`) that gets promoted via the standard Sandbox Promotion Protocol, or as a standalone micro-service outside the monorepo?
0.4.2. **Why it matters**: This is the first concrete test case of the "Nothing Stands Alone" axiom ([AX-10000](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/2026-08-09__Sonnet__YarivHuman__AxiomsAndPrinciples__V1.29.md)) applied to a minor feature. The answer sets the precedent for all future sub-features.

### 0.5. Landing Page DNA Scope
0.5.1. **Question**: When you say "wisdom and DNA of landing pages" — does this mean a set of written design principles (a document), a set of reusable code components (a component library), a set of visual templates (JSON layout specs), or all three?
0.5.2. **Why it matters**: Each layer is a different Corespine lineage. Written principles are standing structure (Corespine). Reusable components are governed artifacts. Visual templates are assets governed by Protocols. Mixing them into one bucket breaks the "one lineage per element" rule.

---

## 1. Task Overview

1.1. You are tasked with researching the architecture to decouple the **CISEM Deep Platform Core** from the **CSAG (Commark Supplier Agent) Universal External Solutions Core** — specifically targeting landing page DNA and template libraries.

1.2. You will design a schema and routing model to support a multi-tier tenant user account hierarchy (Account Owner, Team Leader, End User) constrained by pre-defined package bundles, using the platform's five structural concepts (Corespine, Overlay, Protocol, Wizard, Pipeline).

---

## 2. Required Reading List & Target Content

2.1. Reviewers must inspect these files and focus on the specified sections.

### 2.1. The Five Structural Concepts (Bedrock Vocabulary)
- **File**: [`2026-08-07__CISEM__AntigravityLocal__FiveStructuralConcepts__V1.0.md`](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/2026-08-07__CISEM__AntigravityLocal__FiveStructuralConcepts__V1.0.md)
- **Target Sections**:
  - Part I (lines 48–110): The frame — three tiers, five concepts, one question each, the two discriminators.
  - Part III.A (lines 246–383): Corespine — lineage of purpose, qualification test, element inventory.
  - Part III.B (lines 386–558): Overlay — invariant core, scope profiles, tighten-never-loosen, resolution rules.
  - Part III.C (lines 561–706): Protocol — step-by-step procedure, standing-vs-firing, judgment points.
  - Part III.D (lines 709–843): Wizard — in-flight judgment, mirror rule, refusal capability.
  - Part III.E (lines 847–1003): Pipeline — automated runner, fail-closed, decidability proof, the word collision (Sense A vs Sense B).
  - Part IV (lines 1006–1053): Cross-concept confusion matrix and halt conditions.
- **Goal**: Understand the logical definitions, boundaries, interaction patterns, and the separating questions between all five concepts.

### 2.2. Axioms and Principles (Governing Law)
- **File**: [`2026-08-09__Sonnet__YarivHuman__AxiomsAndPrinciples__V1.29.md`](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/2026-08-09__Sonnet__YarivHuman__AxiomsAndPrinciples__V1.29.md)
- **Target Sections**:
  - `AX-10000` (line 20): Nothing Stand-Alone — every element registered and approved.
  - `PR-11100` (line 28): Cryptographic Context Propagation — `TenantContext` at API boundary.
  - `PR-13990` (line 68): Sandbox Creation and Ingestion Threshold Protocol.
  - `PR-44500` (line 151): Reusable Core Primacy — insist on pre-existing elements.
  - `AX-60000` (line 195): Intent Alignment Gatekeeping — no raw unaligned requests.
  - `PR-95000` (line 322): 3-Tier Scope Architecture — Micro/Macro/Mega context scoping.
- **Goal**: Map which axioms and principles govern the multi-tenant hierarchy, template operations, and package enforcement.

### 2.3. Database Schema (Existing Foundation)
- **File**: [`backend/src/backend/migrations.sql`](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/migrations.sql)
- **Target Sections**:
  - `status_library` + `state_transitions` (lines 4–49): Lifecycle state machine — how statuses transition.
  - `custom_libraries` + `lookup_registry` (lines 70–105): Dynamic key-value registries (EAV pattern).
  - `catalog_item_sandbox_variants` (lines 208–217): A/B sandboxing pattern for catalog items.
  - `customer_accounts` (lines 228–237): Current CRM account structure — **no user hierarchy, no roles, no packages**.
  - `contacts` (lines 239–247): Contact records linked to accounts.
  - `deals` (lines 249–258): Deal pipeline linked to contacts, briefs, proposals.
- **Goal**: Identify what exists, what is missing, and where schema extensions are needed for user roles and template registries.

### 2.4. Backend API (Current Permission Model)
- **File**: [`backend/src/backend/main.py`](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/main.py)
- **Target Sections**:
  - Workspace creation route `create_workspace` (line 309).
  - Role extraction via `X-User-Role` header in `get_catalog_item_detail` (line 969).
  - Admin-only gating in `list_pending_drafts` (line 1081) and `update_approve_draft` (line 1094).
- **Goal**: Understand how the FastAPI backend currently extracts tenant context and enforces basic role checks — and where the gaps are.

### 2.5. Enterprise Architecture Blueprint (Existing Design)
- **File**: [`cisem_core/planning/2026-08-08__AntigravityLocal__YarivHuman__EnterpriseScaleArchitectureBlueprint__V1.0.md`](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/planning/2026-08-08__AntigravityLocal__YarivHuman__EnterpriseScaleArchitectureBlueprint__V1.0.md)
- **Target Sections**:
  - Section 2 (lines 22–42): Multi-Tenant Scale & Database Partitioning — RLS vs. physical isolation.
  - Section 3 (lines 45–66): Sandbox Lifecycle — promotion protocol from sandbox to core.
  - Section 4 (lines 69–99): Workspace Layout System — the five distinct layers.
  - Section 5 (lines 102–110): Mandatory Promotion Questions — the five positioning questions.
- **Goal**: Understand the existing enterprise-scale architectural decisions already ratified in the system.

### 2.6. Workspace Rules
- **File**: [`GEMINI.md`](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/GEMINI.md)
- **Target Sections**:
  - Section 1: Directory & Workspace Alignment Law.
  - Section 2: Mandatory File Naming and Versioning Convention.
- **Goal**: Align all file additions and structural relocations with workspace directory rules.

---

## 3. Answers We Already Have in the System

3.1. The following design decisions are **already answered** by existing ratified documents. Reviewers do not need to re-derive these — they need to verify alignment and build on them.

### 3.1. Multi-Tenant Partitioning Strategy
- **Source**: [Enterprise Architecture Blueprint, Section 2](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/planning/2026-08-08__AntigravityLocal__YarivHuman__EnterpriseScaleArchitectureBlueprint__V1.0.md)
- **Answer**: Standard tenants use Row-Level Security (RLS) via `tenant_id` on shared tables. Enterprise tenants requiring strict compliance get dedicated PostgreSQL schemas. The API router checks a dynamic registry to determine which path to use.

### 3.2. Sandbox-to-Core Promotion Protocol
- **Source**: [Enterprise Architecture Blueprint, Section 3](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/planning/2026-08-08__AntigravityLocal__YarivHuman__EnterpriseScaleArchitectureBlueprint__V1.0.md) and [PR-13990](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/2026-08-09__Sonnet__YarivHuman__AxiomsAndPrinciples__V1.29.md)
- **Answer**: Promotion follows a 4-step protocol: (1) Design Contract Ratification, (2) Clean Room Construction, (3) Mechanical Gate Verification via `cisem_gate.py`, (4) Sandbox Pruning with cleanup logging.

### 3.3. The Five Structural Concepts and How They Interact
- **Source**: [FiveStructuralConcepts, Part I](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/2026-08-07__CISEM__AntigravityLocal__FiveStructuralConcepts__V1.0.md)
- **Answer — The Interaction Model**:
  - 3.3.1. **Corespines** (Standing Structure) establish the static inheritance lineage — *why* something exists and *whose line* it belongs to. Every element belongs to exactly one Corespine lineage.
  - 3.3.2. **Overlays** (Standing Structure) apply cross-cutting constraints *across* all lineages — invariant core + scope profiles + resolution rule. An overlay can only tighten, never loosen.
  - 3.3.3. **Protocols** (Procedure) define the step-by-step operational logic. They fire, run, and finish. Every protocol declares exactly one governing Corespine and runs inside its accumulated law, constrained by applicable Overlays.
  - 3.3.4. **Wizards** (Run Mode) are protocols made runnable where judgment is gathered **in flight** — steps require input that cannot be pre-supplied.
  - 3.3.5. **Pipelines** (Run Mode) are protocols made runnable where **no judgment is required** — every step is decidable from inputs available at start, and the chain fails closed on undecidable input.
- **Answer — The Two Discriminators**:
  - 3.3.6. **Standing vs. Firing** separates Corespines/Overlays from Protocols. Ask: "When did it run?" An answer means protocol; a meaningless question means standing structure.
  - 3.3.7. **Where Judgment Lives** separates Wizards from Pipelines. Ask: "Is there a step whose input cannot be supplied before the run starts?" Yes → Wizard. No → Pipeline.
- **Answer — The Confusion Matrix** (all 12 pair discriminators are in [Part IV, lines 1010-1023](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/2026-08-07__CISEM__AntigravityLocal__FiveStructuralConcepts__V1.0.md)).

### 3.4. "Nothing Stands Alone" Applied to the Architecture
- **Source**: [AX-10000](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/2026-08-09__Sonnet__YarivHuman__AxiomsAndPrinciples__V1.29.md) and [Enterprise Blueprint, Section 4.2](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/planning/2026-08-08__AntigravityLocal__YarivHuman__EnterpriseScaleArchitectureBlueprint__V1.0.md)
- **Answer**: Every route, page layout, API controller, status value, or classification tag must be registered and approved in a master registry. All visual components must draw configurations from the Control Plane (`cisem_core/`). All background tasks must log outcomes in the Intersystem Exchange.

### 3.5. Existing A/B Sandboxing Pattern
- **Source**: [migrations.sql, lines 208-217](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/migrations.sql)
- **Answer**: The `catalog_item_sandbox_variants` table already provides a pattern for isolated variant records linked to an original item, carrying their own `sandbox_sku`, title, specs, and variations as JSONB. This pattern can be extended for template sandboxing.

### 3.6. State Machine Enforcement
- **Source**: [migrations.sql, lines 120-143](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/migrations.sql)
- **Answer**: The `enforce_state_transition()` trigger function already mechanically prevents illegal state transitions at the database level. This pattern should be replicated for template lifecycle states.

---

## 4. Answers We Do NOT Yet Have (Research Gaps)

4.1. The following questions have **no existing answer** in the system and require new architectural design.

### 4.1. User Account Hierarchy
4.1.1. The `customer_accounts` table (migrations.sql, line 229) has no `role`, `tier`, or `package` columns.
4.1.2. The `contacts` table (line 240) links to accounts but carries no permission model.
4.1.3. There is no `users` or `user_roles` table anywhere in the schema.
4.1.4. **Gap**: How do we model Account Owner, Team Leader, and End User under a tenant? Where do user profiles live?

### 4.2. Package/Bundle Definition
4.2.1. There is no `packages` or `subscription_tiers` table.
4.2.2. The `X-User-Role` header in main.py uses flat string roles (`guest`, `buyer`, `partner`, `operator_admin`) with no package-level feature gating.
4.2.3. **Gap**: How do we define Starter, Growth, Enterprise packages and mechanically bind them to feature access?

### 4.3. Template Registry
4.3.1. The `templates/` directory contains JSON layout stubs (e.g., `tpl_bento_dashboard_v1.json`) but there is no database-level template registry.
4.3.2. There is no tagging system for templates beyond the file-level `tag_library` table.
4.3.3. **Gap**: How do we register, tag, version, and surface templates from a universal library?

### 4.4. Dual-Core Corespine Separation
4.4.1. The system currently has one implicit lineage (CSAG business logic). There is no explicit split between `PLATFORM_CORE` and `SOLUTIONS_CORE` lineages.
4.4.2. **Gap**: How do we register two distinct Corespine lineages and ensure elements inherit from the correct one?

---

## 5. Deliverables & Research Questions

5.1. Your response must address the following points with concrete, implementable answers:

### 5.1. Dual Core Separation (Corespine Lineage)
5.1.1. How do we define separate Corespine lineages for `Platform Core` (CISEM control plane logic) and `Solution Core` (CSAG landing page DNA, templates)?
5.1.2. Where should the files for the template library and page DNA live in the directory tree?
5.1.3. How does the Corespine qualification test (A.7 in FiveStructuralConcepts) apply to each lineage?

### 5.2. Multi-Tier User Accounts
5.2.1. How do we extend the `customer_accounts` table to map the internal workspace hierarchy (Account Owner, Team Leader, End User)?
5.2.2. What new tables are needed, and how do they relate to the existing `contacts` and `deals` tables?

### 5.3. Package Bundling & Overlays
5.3.1. How do we map pricing packages (e.g., Starter, Growth, Enterprise) to permission scopes using Overlays?
5.3.2. What is the Overlay's invariant core (the non-negotiable minimum that holds across all packages)?
5.3.3. What are the scope profiles per package tier?
5.3.4. How does the Overlay mechanically restrict a Team Leader or End User from invoking a feature outside their purchased bundle?

### 5.4. Template Library Operations
5.4.1. How should templates be tagged and stored?
5.4.2. What step-by-step Protocol governs a user selecting and duplicating a template into their private workspace sandbox?
5.4.3. Under what conditions does this operation run as a Pipeline (automated) vs. a Wizard (requires in-flight judgment)?

### 5.5. System Integration — The Unified Request Lifecycle
5.5.1. How do all five concepts work together in a single request lifecycle, from initial intake to final impact verification?
5.5.2. Provide a concrete worked example: "A Team Leader on the Growth package selects a landing page template, customizes it, and publishes it."

---

## 6. Ingestion Guard

6.1. There are **no rigid axioms** constraining this design phase.

6.2. Reviewers are explicitly encouraged to **ask clarifying questions** in their initial response turn to align design requirements and clear up ambiguities before drafting the implementation architecture.

6.3. The existing system answers documented in Section 3 are starting points, not constraints. If a reviewer finds that an existing answer is insufficient or needs revision for the multi-tenant use case, they should say so explicitly and propose a better path.

---

## 7. Referenced & Synchronized Files

| Full Filename | Active Version | Clickable Link | Download Link |
| :--- | :--- | :--- | :--- |
| `2026-08-07__CISEM__AntigravityLocal__FiveStructuralConcepts__V1.0.md` | Version 1.0 | [FiveStructuralConcepts](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/2026-08-07__CISEM__AntigravityLocal__FiveStructuralConcepts__V1.0.md) | [Download MD](http://localhost:3000/api/download?filename=2026-08-07__CISEM__AntigravityLocal__FiveStructuralConcepts__V1.0.md) |
| `2026-08-09__Sonnet__YarivHuman__AxiomsAndPrinciples__V1.29.md` | Version 1.29 | [AxiomsAndPrinciples](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/2026-08-09__Sonnet__YarivHuman__AxiomsAndPrinciples__V1.29.md) | [Download MD](http://localhost:3000/api/download?filename=2026-08-09__Sonnet__YarivHuman__AxiomsAndPrinciples__V1.29.md) |
| `migrations.sql` | Version 1.0 | [migrations.sql](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/migrations.sql) | [Download SQL](http://localhost:3000/api/download?filename=migrations.sql) |
| `main.py` | Version 1.0 | [main.py](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/main.py) | [Download PY](http://localhost:3000/api/download?filename=main.py) |
| `EnterpriseScaleArchitectureBlueprint__V1.0.md` | Version 1.0 | [ArchitectureBlueprint](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/planning/2026-08-08__AntigravityLocal__YarivHuman__EnterpriseScaleArchitectureBlueprint__V1.0.md) | [Download MD](http://localhost:3000/api/download?filename=2026-08-08__AntigravityLocal__YarivHuman__EnterpriseScaleArchitectureBlueprint__V1.0.md) |
| `GEMINI.md` | Version 1.4 | [GEMINI.md](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/GEMINI.md) | [Download MD](http://localhost:3000/api/download?filename=GEMINI.md) |

---

## 8. History
- **2026-08-10T03:58:00Z**: Created initial research brief with clarification questions, existing system answers, and research gaps. (Claude Opus 4 - Version 1.0)
