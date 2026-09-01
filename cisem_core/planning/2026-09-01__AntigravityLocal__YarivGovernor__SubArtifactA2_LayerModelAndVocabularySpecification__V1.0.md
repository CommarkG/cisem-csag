# CISEM Platform Sub-Artifact A2: The Layer Model and Vocabulary Specification
**Author**: Antigravity, Lead Architect  
**Authority**: Yariv, Governor of CISEM CsAg  
**Reviewer**: Claude, Technical Auditor  
**Date**: 2026-09-01  
**Version**: 1.0 (Ratified Specification with 4-Tier Layer Hierarchy, Permanence Triggers, and Resolution Function)  

---

## 1. Executive Summary & Core Doctrine

1.1. **The Central Axiom**:
- **A SYSTEM CANNOT TALK TO ITSELF OR TO ITS TENANTS WITHOUT A BOUNDED VOCABULARY.**
- Hardcoded string literals inside code or dynamic JSON blobs obscure business intent, break multi-language and multi-tenant localization, and prevent schema-level foreign key enforcement.
- In CISEM, **ALL CATEGORICAL CODES, CLASSIFICATIONS, AND PIPELINE STATES MUST BE STORED IN A BOUNDED VOCABULARY.** Every categorical string references either `public.status_library`, `public.cr_null_flavors`, or `public.vocabulary_terms`.

1.2. **The Non-Invention & Structural Protection Guarantee**:
- Categorical terms reside in a strict 4-tier layer model (Platform Universal $\rightarrow$ Domain Universal $\rightarrow$ Tenant Account Default $\rightarrow$ Tenant Account Domain).
- Core platform terms cannot be mutated or deleted by tenants. Stale or retired terms are never deleted from database tables—they are superseded via explicit deprecation pointers.

---

## 2. Detailed Architectural Specifications & Principles

2.1. **The 4-Tier Vocabulary Layer Hierarchy**:

| Tier Level | Layer Name | `customer_account_id` | `domain_code` | Scope & Authority | Precedence Order |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Tier 1 (L1)** | **Universal Platform Core** | `NULL` | `NULL` | Universal baseline codes (e.g. standard payment terms, currency codes). | Priority 4 (Fallback) |
| **Tier 2 (L2)** | **Universal Domain Core** | `NULL` | `NOT NULL` | Domain-specific defaults shared across tenants (e.g. MTO proof statuses). | Priority 3 |
| **Tier 3 (L3)** | **Tenant Account Default** | `NOT NULL` | `NULL` | Tenant-level custom labels and overrides for universal terms. | Priority 2 |
| **Tier 4 (L4)** | **Tenant Account Domain** | `NOT NULL` | `NOT NULL` | Tenant-specific terms restricted to a single service model/domain. | Priority 1 (Highest) |

2.2. **CR / EXT Dependency Invariant for Vocabulary**:
- **Layer Precedence Rule**: Lower-numbered tiers (L1, L2) MUST NEVER depend on or reference terms defined exclusively in higher-numbered tenant tiers (L3, L4).
- **Enforcement**: Database trigger `trg_enforce_vocabulary_layer_dependency()` refuses any `vocabulary_terms` record insertion where `parent_term_id` points to a higher-tier or tenant-isolated term.

---

## 3. Implementation Mechanics & Carriers

3.1. **Carrier 1: PostgreSQL DDL Foreign Keys & Triggers**:
- Categorical columns reference `vocabulary_terms(code)` or dedicated vocabulary tables. Mutating protected core terms triggers PostgreSQL error `23514 (check_violation)` or custom trigger refusal.

3.2. **Carrier 2: PL/pgSQL Term Resolution Function (`resolve_vocabulary_term`)**:
- Replaces lossy `DISTINCT ON` database views. Executes deterministic 4-tier waterfall evaluation and returns the COMPLETE matching `vocabulary_terms` record (preserving `id`, `code`, `name`, `attributes`, and `metadata`), avoiding attribute stripping.

3.3. **Carrier 3: API Response Discriminated Unions & Zod Validation**:
- Backend FastAPI routes validate resolved terms against Zod schemas. If a code fails 4-tier resolution, the API returns `{ "code": "UNK", "status": "UNRESOLVED", "raw_token": p_code }`.

3.4. **Carrier 4: Frontend Badge & Localized Rendering Components**:
- Viewports render resolved vocabulary terms using neutral badges. Unresolved terms render an explicit `[UNRESOLVED: code]` badge, preventing blank spaces or `|| 'default'` string fallbacks.

---

## 4. Verified Inventory & Verification Ladder (EXISTS, FIT, COVERS)

The verification ladder evaluates all 5 vocabulary and layer model mechanisms across **Existence**, **Fitness**, and **Coverage**:

```text
===================================================================================================================
# | MECHANISM / ASSET NAME          | EXISTS? | FIT FOR USE? (FITNESS TEST)         | COVERED TARGETS & BLINDSPOTS
===================================================================================================================
1 | public.vocabulary_terms         | YES     | YES: Stores 3-tier codes; needs     | COVERED: 62 active rows in DB.
  | (Main Vocabulary Table)         | (62 rows)| unique (kind, code, tenant_id).    | BLINDSPOT: Lacks L4 domain_code column.
-------------------------------------------------------------------------------------------------------------------
2 | trg_prevent_core_vocab_mutation | NO      | FIT: Refuses UPDATE/DELETE on L1/L2 | COVERED: Will cover all L1 & L2 terms.
  | (Code Permanence Trigger)       | (Draft) | terms where is_protected = true.   | BLINDSPOT: Does not cover tenant L3 terms.
-------------------------------------------------------------------------------------------------------------------
3 | resolve_vocabulary_term()       | NO      | FIT: Evaluates 4-tier waterfall,   | COVERED: All frontend/API lookups.
  | (PL/pgSQL Resolution Function)  | (Draft) | returns complete record (no loss). | BLINDSPOT: Direct raw SQL joins bypass it.
-------------------------------------------------------------------------------------------------------------------
4 | public.status_library           | YES     | YES: Primary Key `code` (12 rows).  | COVERED: Commercial pipeline states.
  | (Pipeline Lifecycle States)     | (12 rows)| Immutable platform state machine.  | BLINDSPOT: Excludes non-pipeline terms.
-------------------------------------------------------------------------------------------------------------------
5 | public.cr_null_flavors          | NO      | FIT: Primary Key `code` (8 rows).   | COVERED: Universal absence codes.
  | (ISO 21090 Null Flavor Table)   | (V1.2)  | Immutable platform null reasons.   | BLINDSPOT: Excludes domain business codes.
===================================================================================================================
```

---

## 5. Architectural Synthesis & Resolution of Key Open Questions

### 5.1. Code Permanence Rule & Enforcement Trigger
- **Rule**: Core terms (`tier_level IN (1, 2)` or `customer_account_id IS NULL`) are permanently immutable. They CANNOT be renamed, deleted, or transferred to another tenant.
- **Enforcement**:
  ```sql
  CREATE OR REPLACE FUNCTION public.prevent_core_vocabulary_mutation()
  RETURNS TRIGGER AS $$
  BEGIN
    IF (OLD.customer_account_id IS NULL AND OLD.is_protected = true) THEN
      IF TG_OP = 'DELETE' THEN
        RAISE EXCEPTION 'PERMANENCE_VIOLATION: Core platform vocabulary terms (L1/L2) cannot be deleted.';
      ELSIF TG_OP = 'UPDATE' AND (OLD.code <> NEW.code OR OLD.kind <> NEW.kind) THEN
        RAISE EXCEPTION 'PERMANENCE_VIOLATION: Core platform vocabulary codes (L1/L2) cannot be renamed.';
      END IF;
    END IF;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER trg_prevent_core_vocabulary_mutation
  BEFORE UPDATE OR DELETE ON public.vocabulary_terms
  FOR EACH ROW EXECUTE FUNCTION public.prevent_core_vocabulary_mutation();
  ```

### 5.2. Supersession Mechanism (Retiring Core Terms Without Breaking Historical Data)
- **Problem**: When a core term is deprecated (e.g. replacing legacy code `NET30_OLD` with `NET30_V2`), deleting or editing the code breaks historical quotes and invoices.
- **Solution**:
  - `vocabulary_terms` carries two explicit supersession columns: `is_deprecated BOOLEAN DEFAULT false`, `superseded_by_code VARCHAR(50) REFERENCES vocabulary_terms(code)`.
  - **Behavior**:
    1. *Historical Queries*: Reading an old quote resolves `NET30_OLD` successfully because the row remains intact in `vocabulary_terms`.
    2. *New Transactions*: Creating a new quote filters `WHERE is_deprecated = false`, preventing selection of retired terms.
    3. *UI Hint*: Viewports display deprecated historical terms with a neutral `[DEPRECATED → NET30_V2]` badge.

### 5.3. Term Resolution Order & Function Specification (`resolve_vocabulary_term`)
- **Refusal of Lossy `DISTINCT ON` Views**: Reviewer Claude correctly identified that `CREATE VIEW AS SELECT DISTINCT ON (kind, code)` discards the single matching platform row's `id`, `attributes`, and `metadata` when a tenant override exists.
- **The Function Solution**:
  ```sql
  CREATE OR REPLACE FUNCTION public.resolve_vocabulary_term(
    p_customer_account_id UUID,
    p_kind VARCHAR(50),
    p_code VARCHAR(50),
    p_domain_code VARCHAR(50) DEFAULT NULL
  ) RETURNS SETOF public.vocabulary_terms AS $$
  BEGIN
    RETURN QUERY
    SELECT * FROM public.vocabulary_terms vt
    WHERE vt.kind = p_kind AND vt.code = p_code
    ORDER BY
      CASE 
        WHEN vt.customer_account_id = p_customer_account_id AND vt.domain_code = p_domain_code THEN 1 -- Tier 4 (L4)
        WHEN vt.customer_account_id = p_customer_account_id AND vt.domain_code IS NULL THEN 2        -- Tier 3 (L3)
        WHEN vt.customer_account_id IS NULL AND vt.domain_code = p_domain_code THEN 3                 -- Tier 2 (L2)
        WHEN vt.customer_account_id IS NULL AND vt.domain_code IS NULL THEN 4                         -- Tier 1 (L1)
        ELSE 5
      END ASC
    LIMIT 1;
  END;
  $$ LANGUAGE plpgsql STABLE;
  ```

### 5.4. Concept vs. Instance Boundary (`vocabulary_terms` vs. `entity_aliases`)

| Boundary Dimension | `public.vocabulary_terms` (Concepts) | `public.entity_aliases` (Instances) |
| :--- | :--- | :--- |
| **Core Definition** | Bounded categorical concepts, classifications, and system codes. | Alternate names, external SKU numbers, or counterparty cross-references for a specific instance. |
| **Examples** | `payment_terms` (`NET30`), `pricing_unit` (`KG`), `null_flavor` (`UNK`). | Customer X's internal part number `CUST-PART-99` for `catalog_item_id = '88f1'`. |
| **Scope** | Applies universally across multiple entities or items. | Tied 1:1 to a specific single row in `catalog_items`, `customer_accounts`, or `counterparties`. |
| **Defeat Route (Misclassification)**| Storing a single customer's private SKU inside `vocabulary_terms` $\rightarrow$ Pollutes category picklists! | Storing general unit of measure definitions inside `entity_aliases` $\rightarrow$ Disables system-wide pricing logic! |

---

## 6. Operational Rules & Enforcement Mechanics

6.1. **Rule 1 (The Categorical Code Storage Law)**:
- No raw string literal representing a category or status may be stored in any database column without an explicit Foreign Key to `status_library`, `cr_null_flavors`, or `vocabulary_terms`.

6.2. **Rule 2 (Pre-Commit Linter Enforcement)**:
- Pre-commit scripts scan Python API handlers and React viewports for un-registered status string literals. Any violation blocks the commit.

---

## 7. What Defeats It (Defeat Routes & Attack Analysis)

7.1. **Defeat Route 1: Tenant Bypassing Resolution Function with Direct SQL Joins**:
- *Attack*: A developer writes `SELECT * FROM quotes JOIN vocabulary_terms ON quotes.payment_terms = vocabulary_terms.code;` without filtering `customer_account_id`, causing cross-tenant vocabulary leakage or duplicate rows!
- *Mitigation*: Linter lints SQL DDL and backend queries for direct `JOIN vocabulary_terms` without calling `resolve_vocabulary_term()`.

7.2. **Defeat Route 2: Misclassifying Instance Identifiers as Vocabulary Concepts**:
- *Attack*: A tenant creates a new `vocabulary_terms` row for `kind = 'custom_sku'`, placing their customer-specific part number in `vocabulary_terms`.
- *Mitigation*: Database check constraint `chk_vocabulary_kind_not_instance` refuses `kind` values ending in `_sku`, `_part_id`, or `_external_ref`, forcing instance aliases into `entity_aliases`.

---

## 8. Debt Register & Ownership

| Debt ID | Description | Owner | Resolution Target |
| :--- | :--- | :--- | :--- |
| **DEBT-A2-01** | `vocabulary_terms` in DB lacks `domain_code` column. | Antigravity | Add `domain_code VARCHAR(50)` to `vocabulary_terms` in Stage 1 DDL. |
| **DEBT-A2-02** | `trg_prevent_core_vocabulary_mutation` trigger not yet applied in DB. | Antigravity | Attach permanence trigger in Stage 1 DDL. |
| **DEBT-A2-03** | `resolve_vocabulary_term()` function not yet created in PostgreSQL. | Antigravity | Deploy PL/pgSQL resolution function in Stage 1 DDL. |

---

## 9. Mandatory Next-Step Recommendation

9.1. **NEXT TWO STEPS**:
1. **REVIEWER CLAUDE & GOVERNOR YARIV**: Reviewer Claude verifies Sub-Artifact A2 V1.0 and Governor Yariv issues formal ratification of Sub-Artifact A2.
2. **ANTIGRAVITY**: Upon ratification of Sub-Artifact A2, proceed to draft Sub-Artifact A3 (The Domain Architecture & Extension Specification).
