---
metadata:
  owner: "CISEM_GOVERNOR"
  canonical_location: "C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\cisem_core\\planning\\2026-08-23__AntigravityLocal__YarivGovernor__Platform_Ontology_Hierarchy_and_AI_Context_Architecture_Blueprint__V1.0.md"
  artifact_status: "DRAFT"
  maturity: "WORKING_DRAFT"
  version: "1.0"
  plan_id: "CISEM-IP-20260823-PLATFORM-ONTOLOGY-GRAPH-BLUEPRINT"
  governor_signature: "UNRATIFIED-DRAFT-IN-PROGRESS"
  axioms_linked:
    - "AX-10000"
    - "AX-20000"
    - "AX-SECURITY-01"
    - "AX-TENANT-01"
    - "PR-11200"
    - "PR-11300"
  related_implementation_adapter: "GOOGLE_ANTIGRAVITY_ADAPTER"
  local_edits_allowed: true
  role_type: "CANONICAL_ARCHITECTURE_BLUEPRINT"
---

# Platform Ontology, Multi-Hierarchy Closure Engine, and AI Context Architecture Blueprint

1.1. **Executive Summary & System Purpose**:
This document defines the enterprise **Ontology, Knowledge Graph, Multi-Hierarchy Closure Engine, and AI Context Architecture** for the CISEM CsAg platform. It merges advanced AI semantic reasoning, controlled vocabularies, role-based contextual views, and 12-hour governance task safety mechanisms directly into the existing PostgreSQL database schema (`live_schema_registry.json` and `migrations.sql`).

---

## 2. SECTION 1: CORE ARCHITECTURAL PRINCIPLES

2.1. **The Semantic Operating System Principle**:
- Do not create a rigid, single-tree folder hierarchy or unstructured free-text tag cloud.
- The system operates as a **Governed Ontology + Relationship Graph + Contextual Classification Engine**, where tags exist as one strictly controlled, multi-faceted vocabulary layer.
- Every piece of incoming information is deterministically classified, located, related, assigned controlled attributes, scoped to a tenant context, and governed by strict AI safety rules.

2.2. **Multi-Tenant Knowledge Boundaries**:
- Tenant boundaries (`customer_account_id`) represent both **security boundaries** and **semantic knowledge boundaries**.
- RLS policies and API middleware enforce that AI models never leak ontology definitions, permissions, or contextual graph nodes across tenant boundaries.

---

## 3. SECTION 2: DATABASE SCHEMA MAPPING & INQUIRY SPINE INTEGRATION

3.1. **Mapping Semantic Concepts to Existing Database Tables**:
- **Tenant & Domain Scoping:** Partitioned via `customer_account_id` across all 66 schema tables in `live_schema_registry.json`, combined with `lookup_registry` (`registry_type = 'DOMAIN_SCOPE'`).
- **Controlled Vocabularies (Facets vs Entities):**
  - *Global Primitives:* `status_library` (`code`, `label`, `description`) and `role_definitions` (7 canonical roles: `platform_admin`, `account_owner`, `account_admin`, `team_manager`, `member`, `viewer`, `client`).
  - *Tenant Extensions:* `tag_library` (`id`, `label`, `description`, `parent_id`, `customer_account_id`) and `lookup_registry`.
- **Multi-Hierarchy Closure Engine:** Handled via **Closure Tables** (`account_closure` and `team_closure` in `live_schema_registry.json` L29, L42). An entity (e.g. a Product or Quote) participates in multiple independent hierarchies (Organizational, Product, Functional, Knowledge) by inserting ancestry records into `account_closure` with distinct `depth` markers.
- **Knowledge Graph Relationships:** Modeled via relational join tables (`round_artifacts`, `inquiry_units`, `quote_lines`, `attachments`) and `lookup_registry` relationship types (`belongs_to`, `relates_to`, `depends_on`, `owned_by`, `generated_from`, `blocks`).

---

## 4. SECTION 3: THE PROVISIONAL CONCEPT & 12-HOUR GOVERNANCE TASK SYSTEM

4.1. **AI Non-Fabrication Rule ("AI Must Not Invent")**:
- Enforced mechanically by **ZeroFabricationGate (Gate 19)** in [`cisem_gate.py`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/platform_core/cisem_gate.py) Phase 24. AI models are strictly prohibited from inventing official tags, entity types, or relationships.

4.2. **Provisional Concept Lifecycle**:
- When incoming information does not match an existing approved concept in `tag_library` or `lookup_registry`, the AI creates a **Provisional Concept**.
- *State Transition:* `INPUT` $\rightarrow$ `NO_MATCH` $\rightarrow$ `PROVISIONAL_CONCEPT` $\rightarrow$ `GOVERNANCE_TASK_CREATED` $\rightarrow$ `HUMAN_REVIEW` ($\rightarrow$ `APPROVE` / `MERGE` / `REJECT`).
- *Database Registration:* Auto-creates a record in `backlog_registry` with `status = 'PROVISIONAL_PENDING_APPROVAL'` and `impact_level = 'GOVERNANCE_REVIEW'`.
- *12-Hour Escalation:* If human review is not completed within 12 hours, the task automatically escalates in `cael_status.json`, flagging an alert for Governor review.

---

## 5. SECTION 4: CONTEXT-AWARE AI REASONING & ROLE-BASED PERSONALIZATION

5.1. **First-Class User Context Vector**:
- The AI evaluates requests against an active 10-dimensional context vector:
  $$\text{ContextVector} = \{ \text{Tenant}, \text{User}, \text{Role}, \text{Permissions}, \text{Domain}, \text{Workspace}, \text{Project}, \text{Objective}, \text{TargetEntity}, \text{TimeHorizon} \}$$
- *Ambiguity Resolution:* When a user asks *"Add the stands to the quote"*, the AI resolves *"stands"* to `catalog_items` (Special Display Stand) and *"quote"* to `inquiries` (Quote #382) using the active `Workspace` and `Project` context.

5.2. **Role DTO Response Transformation**:
- Role personalization is enforced server-side via `ClientRoleTransformer`.
- A Sales Manager receives commercial entities (`Customer`, `Opportunity`, `Quote`, `Revenue`); an Accountant receives financial entities (`Invoice`, `Payment`, `Tax`); an External Client receives structurally redacted DTOs stripping internal margins and private notes.

---

## 6. SECTION 5: STANDALONE CONSENSUS PROMPT FOR GOVERNOR & REVIEWER

```markdown
WHO IS WRITING: Antigravity, in the repository.
AUTHORITY: Yariv, Governor of CISEM CsAg.
ADDRESSED: Claude, the Reviewer.

SUBJECT: CONSENSUS PROPOSAL — PLATFORM ONTOLOGY, MULTI-HIERARCHY & AI GOVERNANCE BLUEPRINT

1.1. PURPOSE:
To ratify the blueprint '2026-08-23__AntigravityLocal__YarivGovernor__Platform_Ontology_Hierarchy_and_AI_Context_Architecture_Blueprint__V1.0.md' connecting AI context, controlled vocabularies, closure-table multi-hierarchies, and 12-hour provisional governance tasks to the existing PostgreSQL schema.

1.2. STANDALONE ARCHITECTURAL CONTRACT:
1. Multi-Tenant Semantic Isolation: Partitioned by customer_account_id across all tables and scoped in lookup_registry.
2. Controlled Vocabularies vs Free Tags: Platform primitives in status_library and role_definitions (7 roles). Tenant extensions in tag_library and lookup_registry.
3. Multi-Hierarchy Closure Engine: Modeled via account_closure (ancestor_id, descendant_id, depth), allowing entities to exist in multiple structural trees simultaneously.
4. AI Non-Fabrication & 12-Hour Governance: AI models cannot invent official tags (Gate 19). Unrecognized concepts auto-create a provisional entry in backlog_registry (status = 'PROVISIONAL_PENDING_APPROVAL'). Un-reviewed items escalate in cael_status.json after 12 hours.
5. Server-Side Role Personalization: Response payloads pass through ClientRoleTransformer, stripping un-authorized fields before transmission.

1.3. THREE CONSENSUS QUESTIONS FOR COLD REVIEW:
1. Does the Governor ratify using backlog_registry and cael_status.json as the execution home for the 12-hour Provisional Concept Governance Task?
2. Does the Reviewer concur that closure tables (account_closure) eliminate the need for an external Graph database engine?
3. Should this blueprint be scheduled as Stage 2 execution following the Backend Authorization Plan V1.1?
```

---

## 7. RECONCILE LOG & HISTORY

- **2026-08-23**: Standalone architectural blueprint created and written to `cisem_core/planning/` by Google Antigravity Adapter.
