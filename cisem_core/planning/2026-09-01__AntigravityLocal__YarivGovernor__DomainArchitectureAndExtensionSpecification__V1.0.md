# Sub-Artifact A3: Domain Architecture & Extension Specification
Target: cisem_core/planning/2026-09-01__AntigravityLocal__YarivGovernor__DomainArchitectureAndExtensionSpecification__V1.0.md
Authority: Governor Yariv / Reviewer Claude / Antigravity
Version: 1.0

---

## 1. PURPOSE & IDENTITY STATEMENT

1.1. **Objective**:
- Sub-Artifact A3 establishes the formal architectural laws, dependency boundaries, and extension patterns governing the relationship between Core Universal assets (`CR_`) and External Domain/Tenant-Specific assets (`EXT_`) within the CISEM CsAg B2B ERP platform.

1.2. **The Core / External Boundary Invariant**:
- The Core Universal layer (`CR_`) owns all universal B2B entities, schemas, workflow engines, and security boundaries.
- External Domain modules (`EXT_`) extend the core for specific industry sectors (e.g. `MTO` Make-to-Order Engraving, `STK` Stock Wholesale, `DIG` Digital Products) or tenant-specific customizations without altering or polluting core code.

---

## 2. THE THREE DEPENDENCY DIRECTION INVARIANTS

2.1. **Invariant 1: Core Self-Containment (`CR_` $\rightarrow$ `CR_`)**:
- `CR_` modules and database tables may depend ONLY on other `CR_` modules and database tables.
- A `CR_` database table, API endpoint, or linter MUST NEVER contain a foreign key, import statement, or column reference targeting an `EXT_` table or module.

2.2. **Invariant 2: Downward External Dependency (`EXT_` $\rightarrow$ `CR_`)**:
- `EXT_` domain modules and tables MAY depend on `CR_` core entities via Foreign Keys, imports, and interface implementations.
- Example: `EXT_branding_rate_cards.customer_account_id` references `CR_customer_accounts.id`.

2.3. **Invariant 3: Intra-Domain External Dependency (`EXT_` $\rightarrow$ `EXT_`)**:
- `EXT_` domain modules MAY depend on other `EXT_` entities strictly within their own domain (e.g. `EXT_mto_branding_lines` referencing `EXT_mto_rate_cards`). Cross-domain dependencies between external modules require explicit registration in `cr_ext_registry.json`.

---

## 3. PHYSICAL DATABASE LAYER CLASSIFICATION REGISTRY (`cr_ext_registry`)

3.1. **Canonical Schema**:
- All 64 live database tables carry an immutable layer code in `public.cr_ext_registry`:
  - `35 Core Tables (CR)`: `customer_accounts`, `quotes`, `vocabulary_terms`, `cr_account_types`, `users`, `teams`, `contacts`, `inquiries`, `catalog_items`, `packages`, `status_library`, etc.
  - `9 External Tables (EXT)`: `branding_rate_cards`, `branding_subcontractors`, `product_variations`, `product_groups`, `unit_composition`, `supply_offers`, `supplier_mappings`, `pdf_queue`, `inquiry_units`, `document_chunks`.
  - `20 Unclassified Tables`: Retained in governance registry awaiting formal retirement or promotion.

3.2. **Pre-Commit Dependency Gate (`gate_cr_ext_dependency.py`)**:
- Every DDL migration script and SQL query is checked pre-commit. Any Foreign Key from a `CR_` table targeting an `EXT_` table returns `STATUS: BLOCKED` (exit code 1).

---

## 4. THE THREE-TIER VOCABULARY EXTENSION MECHANISM

4.1. **Tenant Vocabulary Customization Law**:
- Categorical domain vocabularies (e.g. `counterparty_kind`, `inquiry_type`) are stored in `public.vocabulary_terms`.
- L1 Platform Tier: `customer_account_id IS NULL` (Universal default terms).
- L3 Tenant Customization Tier: `customer_account_id = <tenant_uuid>` (Tenant-specific custom labels and terms).
- Infrastructure constants (`cr_account_types`, `status_library`) are stored in dedicated platform lookup tables with `code PRIMARY KEY` and are non-extensible by tenants.

---

## 5. REVISION HISTORY & AUDIT TRAIL

- **2026-09-01**: Initial drafting and ratification of Sub-Artifact A3 by Governor Yariv, Reviewer Claude, and Antigravity (Version 1.0).
