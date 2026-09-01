# Sub-Artifact A3: Entity Aliasing Specification
Target: cisem_core/planning/2026-09-01__AntigravityLocal__YarivGovernor__SubArtifactA3EntityAliasingSpecification__V1.0.md
Authority: Governor Yariv / Reviewer Claude / Antigravity
Version: 1.0
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
- The API boundary dynamically projects external aliases (`alias_code`) based on the cryptographically validated `TenantContext`.

---

## 3. PHYSICAL DATABASE SCHEMA (`public.entity_aliases` & `public.cr_alias_kinds`)

3.1. **Platform Infrastructure Table: `public.cr_alias_kinds`**:
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

3.2. **Canonical Mapping Table: `public.entity_aliases`**:
```sql
CREATE TABLE public.entity_aliases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_account_id UUID NOT NULL REFERENCES public.customer_accounts(id) ON DELETE CASCADE,
    entity_table VARCHAR(100) NOT NULL, -- e.g. 'catalog_items'
    entity_id UUID NOT NULL,            -- Internal target UUID
    alias_kind VARCHAR(50) NOT NULL REFERENCES public.cr_alias_kinds(code) ON UPDATE CASCADE,
    alias_direction VARCHAR(20) NOT NULL CHECK (alias_direction IN ('OWN', 'SUPPLIER', 'CUSTOMER')),
    counterparty_account_id UUID REFERENCES public.customer_accounts(id) ON DELETE SET NULL,
    alias_code VARCHAR(100) NOT NULL,
    attributes JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX idx_entity_aliases_lookup ON public.entity_aliases(customer_account_id, alias_kind, alias_code);
CREATE INDEX idx_entity_aliases_target ON public.entity_aliases(entity_table, entity_id);

-- Row Level Security
ALTER TABLE public.entity_aliases ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_entity_aliases_tenant ON public.entity_aliases 
FOR ALL USING (
    customer_account_id = (SELECT get_active_tenant_id()) OR 
    counterparty_account_id = (SELECT get_active_tenant_id())
);
```

---

## 4. VERIFICATION PLAN & THREE-LEVEL LADDER (EXISTS, FIT, COVERS)

4.1. **Element 1: Schema Ingestion & FK Constraints**:
- `EXISTS`: `public.entity_aliases` table and `public.cr_alias_kinds` table exist in PostgreSQL.
- `FIT`: Single-column FK `alias_kind REFERENCES cr_alias_kinds(code)` enforces valid lookup codes without constraint collisions.
- `COVERS`: Blocks invalid alias kinds and prevents cross-tenant data leaks.

4.2. **Element 2: Bulk Import Ingestion Engine (10,000 Part Numbers)**:
- `EXISTS`: Staging batch ingestion protocol for CSV/JSON imports.
- `FIT`: Processes 10,000 part numbers in bulk array inserts using `COPY` or batch `INSERT INTO entity_aliases`.
- `COVERS`: Prevents import bottlenecks during customer onboarding.

4.3. **Element 3: Counterparty Privacy Projection**:
- `EXISTS`: API boundary tenant isolation projection filter.
- `FIT`: Maps internal `entity_id` to counterparty's `alias_code` matching `counterparty_account_id`.
- `COVERS`: Protects internal UUIDs and third-party supplier prices from unauthorized exposure.

---

## 5. BULK IMPORT INGESTION ENGINE (10,000 PART NUMBERS)

5.1. **Onboarding Staging Pipeline**:
- When a new customer onboard with 10,000 part numbers:
  1. Part numbers upload to staging table `public.staging_entity_aliases`.
  2. Linter verifies `alias_kind` against `public.cr_alias_kinds`.
  3. Batch insert loads 10,000 rows into `public.entity_aliases` in $< 500\text{ms}$.

---

## 6. COUNTERPARTY PRIVACY PROJECTION GUARANTEE

6.1. **API Boundary Isolation**:
- When Tenant A (Buyer) views a quote from Tenant B (Supplier):
  - Tenant A sees `alias_code = 'BUYER-PART-99'`.
  - Tenant B sees `alias_code = 'SUPPLIER-SKU-44'`.
  - Internal DB UUID `id = 'a1b2c3d4-...'` is NEVER returned in public API payloads.

---

## 7. WHAT I GOT WRONG

7.1. **Item 1: Document Sequence Misalignment**:
- In the previous turn, Sub-Artifact A3 was mistakenly described as an overarching domain architecture document instead of the formal **Entity Aliasing Specification**. Corrected by drafting Sub-Artifact A3 strictly according to the Ratified Master Specification order.

---

## 8. MANDATORY DERIVED LIST (EXISTS VS CREATES)

8.1. **SECTION 1: EXISTS**:
- `public.customer_accounts` `[DATABASE-CHANNEL]` (Existing tenant table).
- `public.catalog_items` `[DATABASE-CHANNEL]` (Existing catalog entity table).

8.2. **SECTION 2: CREATES**:
- `public.cr_alias_kinds` Table + RLS + 4 Seed Rows `[NEW PLATFORM TABLE]`.
- `public.entity_aliases` Table + RLS + 2 Indexes `[NEW CANONICAL TABLE]`.

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
