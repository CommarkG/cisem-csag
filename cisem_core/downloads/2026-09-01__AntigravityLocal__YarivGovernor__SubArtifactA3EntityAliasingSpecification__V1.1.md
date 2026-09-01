# Sub-Artifact A3: Entity Aliasing Specification
Target: cisem_core/planning/2026-09-01__AntigravityLocal__YarivGovernor__SubArtifactA3EntityAliasingSpecification__V1.1.md
Authority: Governor Yariv / Reviewer Claude / Antigravity
Version: 1.1
Status: RATIFIED DRAFT

---

## 1. PURPOSE & EXECUTIVE SUMMARY

1.1. **Objective**:
- Sub-Artifact A3 defines the entity cross-referencing, multi-tenant SKU mapping, and counterparty privacy projection engine for the CISEM CsAg B2B ERP platform.

1.2. **The Problem It Solves**:
- In B2B commerce, every counterparty (buyer, supplier, distributor) uses a different SKU, part number, GTIN, or legacy identifier for the exact same physical product.
- Internal database primary keys (`id UUID`) must NEVER be exposed to external buyers or suppliers.
- Sub-Artifact A3 provides a high-performance bi-directional translation matrix (`public.entity_aliases`) that maps internal entities to counterparty-specific identifiers while strictly preserving counterparty privacy boundaries.

---

## 2. ARCHITECTURAL INVARIANTS & LAWS

2.1. **Law 1: Closed Platform Kinds vs Extensible Tenant Vocabulary**:
- Infrastructure alias standards (`buyer_sku`, `supplier_sku`, `gtin`, `upc`, `ean`, `legacy_code`) are managed in a dedicated platform table `public.cr_alias_kinds` with `code PRIMARY KEY`.
- Custom tenant-specific alias categories are stored in `public.vocabulary_terms` (`kind = 'alias_category'`).
- Per Constraint Law: `vocabulary_terms` is multi-tenant and non-unique across tiers, so custom tenant categories are resolved via application queries, not physical FKs.

2.2. **Law 2: The Three Direction Vectors**:
1. `OWN` (Internal Mapping): The tenant's own internal SKU / part number mapping.
2. `SUPPLIER` (Upstream Mapping): The supplier's catalog SKU for the same item.
3. `CUSTOMER` (Downstream Mapping): The buyer/customer's part number for the same item.

2.3. **Law 3: Counterparty Privacy Projection Guarantee**:
- Counterparties (buyers, suppliers, external vendors) MUST NEVER see CISEM internal UUIDs or another counterparty's private part numbers.
- The API boundary dynamically projects external aliases (`alias_value`) based on the cryptographically validated `TenantContext`.

---

## 3. PHYSICAL DATABASE SCHEMA (`public.entity_aliases` & `public.cr_alias_kinds`)

3.1. **New Platform Infrastructure Table: `public.cr_alias_kinds`**:
```sql
CREATE TABLE public.cr_alias_kinds (
    code VARCHAR(50) PRIMARY KEY,
    label TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.cr_alias_kinds (code, label, description, sort_order) VALUES
('buyer_sku', 'Buyer Part Number', 'Customer/Buyer internal part number', 1),
('supplier_sku', 'Supplier Catalog SKU', 'Supplier catalog item SKU', 2),
('gtin', 'Global Trade Item Number', 'Universal GTIN / EAN / UPC barcode identifier', 3),
('legacy_code', 'Legacy System Code', 'Legacy ERP or AS400 part number', 4);
```

3.2. **Existing Live Mapping Table: `public.entity_aliases` (8 Physical Columns)**:
- Verified physical columns in live database:
  `entity_aliases.id`, `entity_aliases.customer_account_id`, `entity_aliases.entity_type`, `entity_aliases.entity_id`, `entity_aliases.alias_kind`, `entity_aliases.alias_value`, `entity_aliases.source_note`, `entity_aliases.created_at`

3.3. **Alter Statements to Attach Foreign Key**:
```sql
-- Attach Foreign Key from entity_aliases.alias_kind to cr_alias_kinds(code)
ALTER TABLE public.entity_aliases 
DROP CONSTRAINT IF EXISTS fk_entity_aliases_kind;

ALTER TABLE public.entity_aliases 
ADD CONSTRAINT fk_entity_aliases_kind 
FOREIGN KEY (alias_kind) 
REFERENCES public.cr_alias_kinds(code) 
ON UPDATE CASCADE 
ON DELETE RESTRICT;
```

---

## 4. VERIFICATION PLAN & THREE-LEVEL LADDER (EXISTS, FIT, COVERS)

4.1. **Element 1: Schema Ingestion & FK Constraints**:
- `EXISTS`: `public.entity_aliases` table (8 physical columns) and `public.cr_alias_kinds` table exist in PostgreSQL.
- `FIT`: Single-column FK `entity_aliases.alias_kind REFERENCES cr_alias_kinds(code)` enforces valid lookup codes without constraint collisions.
- `COVERS`: Blocks invalid alias kinds and prevents cross-tenant data leaks.

4.2. **Element 2: Bulk Import Ingestion Engine (10,000 Part Numbers)**:
- `EXISTS`: Staging batch ingestion protocol for CSV/JSON imports.
- `FIT`: Processes 10,000 part numbers in bulk array inserts into `entity_aliases.alias_value`.
- `COVERS`: Prevents import bottlenecks during customer onboarding.

4.3. **Element 3: Counterparty Privacy Projection**:
- `EXISTS`: API boundary tenant isolation projection filter.
- `FIT`: Maps internal `entity_aliases.entity_id` to counterparty's `entity_aliases.alias_value`.
- `COVERS`: Protects internal UUIDs and third-party supplier prices from unauthorized exposure.

---

## 5. BULK IMPORT INGESTION ENGINE (10,000 PART NUMBERS)

5.1. **Onboarding Staging Pipeline**:
- When a new customer onboards with 10,000 part numbers:
  1. Part numbers load into `entity_aliases.alias_value` with `entity_aliases.alias_kind`.
  2. Linter verifies `entity_aliases.alias_kind` against `public.cr_alias_kinds`.
  3. Batch insert populates `public.entity_aliases` in $< 500\text{ms}$.

---

## 6. COUNTERPARTY PRIVACY PROJECTION GUARANTEE

6.1. **API Boundary Isolation**:
- When Tenant A (Buyer) views a quote from Tenant B (Supplier):
  - Tenant A sees `entity_aliases.alias_value = 'BUYER-PART-99'`.
  - Tenant B sees `entity_aliases.alias_value = 'SUPPLIER-SKU-44'`.
  - Internal DB UUID `entity_aliases.entity_id` is NEVER returned in public API payloads.

---

## 7. WHAT I GOT WRONG

7.1. **Item 1: Schema Column Name & Table Status Drift**:
- Sub-Artifact A3 V1.0 wrote `alias_code` instead of physical column `entity_aliases.alias_value`, `entity_table` instead of `entity_aliases.entity_type`, and printed a `CREATE TABLE` statement for `entity_aliases` when it was already an existing live table.
- **Correction**: Updated V1.1 to reflect physical column names (`entity_aliases.alias_value`, `entity_aliases.entity_type`), specified `entity_aliases` as an existing live table, and formatted Foreign Key attachment as an `ALTER TABLE` statement.

---

## 8. MANDATORY DERIVED LIST (EXISTS VS CREATES)

8.1. **SECTION 1: EXISTS**:
- `public.customer_accounts` `[DATABASE-CHANNEL]` (Existing tenant table).
- `public.entity_aliases` `[DATABASE-CHANNEL]` (Existing live table with 8 physical columns: `id`, `customer_account_id`, `entity_type`, `entity_id`, `alias_kind`, `alias_value`, `source_note`, `created_at`). Attaching `fk_entity_aliases_kind` is zero-cost today because `entity_aliases` currently contains 0 rows!

8.2. **SECTION 2: CREATES**:
- `public.cr_alias_kinds` Table + RLS + 4 Seed Rows `[NEW PLATFORM TABLE]`.
- `fk_entity_aliases_kind` Foreign Key Constraint `[NEW FK CONSTRAINT ON EXISTING TABLE]`.

---

## 9. THREE-LINE REACH ANALYSIS

9.1. **Where Else This Applies**:
- Product catalog lookup, quote line rendering, B2B intake inquiries, order fulfillment, and supplier inventory sync across all 7 Business Process Stages.

9.2. **Where It Looks Like It Applies And Does Not (And Why)**:
- **Internal Database Table Foreign Keys (`CR_` -> `CR_`)**.
- *Technical Rationale*: Internal foreign keys use direct primary keys (`id UUID`). Entity aliasing applies strictly to **EXTERNAL COUNTERPARTY FACING PAYLOADS AND B2B SKU TRANSLATION**.

9.3. **The One Place It Would Most Change If Applied**:
- **B2B Quote & Intake Processing Engine (Stage 1 Intake & Stage 2 B2B Hub)**.
- *Technical Rationale*: Eliminates manual part number re-keying, enabling instant 10,000 SKU bulk intake mapping while enforcing absolute counterparty privacy!
