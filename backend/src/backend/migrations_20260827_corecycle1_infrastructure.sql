-- ==========================================================================================
-- CISEM CORECYCLE 1 MASTER INFRASTRUCTURE MIGRATION (REVISED V4.0 - CANONICAL RLS)
-- Ratified Plan: PLAN-CISEM-20260827-CO1-MASTER-PIPELINE V1.0
-- Governor Authority: GOV-YARIV-20260827-CORECYCLE1-SCHEMA
-- Purpose: Complete referential hierarchy, faceted classification, atomic sequence generator,
--          column-level provenance, 5 Free Schema Decisions, explicit ::INT casts, 
--          platform facet partial index, and CANONICAL RLS policies using current_tenant_id().
-- ==========================================================================================

BEGIN;

-- 1. ALTER EXISTING vocabulary_terms (Real UUID Foreign Key, not JSONB string)
ALTER TABLE vocabulary_terms 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES vocabulary_terms(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS version INT DEFAULT 1 NOT NULL;

CREATE INDEX IF NOT EXISTS idx_vocabulary_terms_parent_id ON vocabulary_terms(parent_id);

-- 2. CREATE FACETED CLASSIFICATION TABLES (Orthogonal dimensions across hierarchy)
CREATE TABLE IF NOT EXISTS taxonomy_facets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_account_id UUID REFERENCES customer_accounts(id) ON DELETE CASCADE,
    facet_code VARCHAR(50) NOT NULL, -- 'material', 'branding_technology', 'event_type'
    facet_label VARCHAR(100) NOT NULL,
    is_multi_select BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (customer_account_id, facet_code)
);

-- Partial Unique Index for Platform-Level Facets (where customer_account_id IS NULL)
CREATE UNIQUE INDEX IF NOT EXISTS idx_taxonomy_facets_platform_code 
ON taxonomy_facets (facet_code) WHERE customer_account_id IS NULL;

CREATE TABLE IF NOT EXISTS taxonomy_facet_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facet_id UUID REFERENCES taxonomy_facets(id) ON DELETE CASCADE NOT NULL,
    value_code VARCHAR(100) NOT NULL,
    value_label VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (facet_id, value_code)
);

-- Join table linking product variants / items to facet values
CREATE TABLE IF NOT EXISTS product_facet_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    facet_value_id UUID REFERENCES taxonomy_facet_values(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (product_id, facet_value_id)
);

-- 3. CREATE INQUIRY CONTACTS (One-to-Many Relation: Multiple contacts per inquiry)
CREATE TABLE IF NOT EXISTS inquiry_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_id UUID REFERENCES inquiries(id) ON DELETE CASCADE NOT NULL,
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE NOT NULL,
    role_code VARCHAR(50) DEFAULT 'primary' NOT NULL, -- 'primary', 'approver', 'billing', 'logistics'
    is_primary BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (inquiry_id, contact_id)
);

-- 4. ATOMIC TENANT SEQUENCE GENERATOR (Human-Facing Numbering Engine)
CREATE TABLE IF NOT EXISTS tenant_sequence_counters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_account_id UUID REFERENCES customer_accounts(id) ON DELETE CASCADE NOT NULL,
    year_code INT NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'inquiry', 'quote', 'work_order'
    current_sequence INT DEFAULT 0 NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (customer_account_id, year_code, entity_type)
);

CREATE OR REPLACE FUNCTION generate_tenant_sequence(
    p_tenant_id UUID,
    p_year INT,
    p_entity_type VARCHAR,
    p_prefix VARCHAR
) RETURNS TABLE (
    formatted_number VARCHAR(50),
    seq_number INT
) AS $$
DECLARE
    v_next_seq INT;
BEGIN
    INSERT INTO tenant_sequence_counters (customer_account_id, year_code, entity_type, current_sequence)
    VALUES (p_tenant_id, p_year, p_entity_type, 1)
    ON CONFLICT (customer_account_id, year_code, entity_type)
    DO UPDATE SET current_sequence = tenant_sequence_counters.current_sequence + 1,
                  updated_at = NOW()
    RETURNING current_sequence INTO v_next_seq;

    formatted_number := p_prefix || '-' || p_year::text || '-' || LPAD(v_next_seq::text, 5, '0');
    seq_number := v_next_seq;
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- 5. ALTER EXISTING inquiries TABLE: Add explicit dates, human numbers, tax columns, idempotency, versioning & column provenance
ALTER TABLE inquiries
ADD COLUMN IF NOT EXISTS inquiry_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS year_code INT DEFAULT EXTRACT(YEAR FROM NOW())::INT, -- Explicit ::INT cast to prevent numeric DDL failure
ADD COLUMN IF NOT EXISTS sequence_number INT,
ADD COLUMN IF NOT EXISTS event_date DATE,
ADD COLUMN IF NOT EXISTS factory_ready_date DATE,
ADD COLUMN IF NOT EXISTS subtotal_amount NUMERIC(12,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS tax_amount NUMERIC(12,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS tax_rate NUMERIC(5,4) DEFAULT NULL, -- DEFAULT NULL: Tenant-neutral (No hardcoded VAT)
ADD COLUMN IF NOT EXISTS total_amount NUMERIC(12,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS idempotency_key VARCHAR(100),
ADD COLUMN IF NOT EXISTS version INT DEFAULT 1 NOT NULL,
ADD COLUMN IF NOT EXISTS column_provenance JSONB DEFAULT '{}'::jsonb; -- Per-column provenance map ({ "title": {"type": "SAID"}, ... })

CREATE UNIQUE INDEX IF NOT EXISTS idx_inquiries_human_number ON inquiries(customer_account_id, year_code, sequence_number) WHERE sequence_number IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_inquiries_idempotency ON inquiries(idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_inquiries_event_date ON inquiries(event_date);
CREATE INDEX IF NOT EXISTS idx_inquiries_factory_ready_date ON inquiries(factory_ready_date);

-- 6. ALTER EXISTING quotes TABLE (Targeting 17 Existing Columns: id, customer_account_id, inquiry_id, version, fx_rate, etc.)
ALTER TABLE quotes
ADD COLUMN IF NOT EXISTS quote_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS subtotal_amount NUMERIC(12,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS tax_amount NUMERIC(12,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS tax_rate NUMERIC(5,4) DEFAULT NULL, -- DEFAULT NULL: Tenant-neutral (No hardcoded VAT)
ADD COLUMN IF NOT EXISTS total_amount NUMERIC(12,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS is_sealed BOOLEAN DEFAULT false NOT NULL,
ADD COLUMN IF NOT EXISTS seal_hash VARCHAR(64), -- SHA-256 hash of exact payload seen by user
ADD COLUMN IF NOT EXISTS sealed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS idempotency_key VARCHAR(100),
ADD COLUMN IF NOT EXISTS column_provenance JSONB DEFAULT '{}'::jsonb; -- Per-column provenance map

CREATE UNIQUE INDEX IF NOT EXISTS idx_quotes_human_number ON quotes(customer_account_id, quote_number, version);
CREATE UNIQUE INDEX IF NOT EXISTS idx_quotes_idempotency ON quotes(idempotency_key) WHERE idempotency_key IS NOT NULL;

-- 7. ALTER EXISTING products TABLE
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS version INT DEFAULT 1 NOT NULL;

-- 8. DETAILED COLUMN PROVENANCE AUDIT TABLE (Optional compliance logging for state transitions)
CREATE TABLE IF NOT EXISTS column_provenance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    column_name VARCHAR(100) NOT NULL,
    provenance_type VARCHAR(20) NOT NULL CHECK (provenance_type IN ('SAID', 'HELD', 'RULED', 'ASSUMED')),
    provenance_source TEXT,
    is_confirmed BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_column_provenance_lookup ON column_provenance_logs(table_name, record_id);

-- ==========================================================================================
-- 9. ROW-LEVEL SECURITY (RLS) POLICIES FOR ALL 6 NEW TABLES
-- USING CANONICAL current_tenant_id() FUNCTION (72 Live Database Policies Standard)
-- ZERO SESSION SETTINGS. ZERO REQUEST HEADERS.
-- ==========================================================================================

-- 9.1 taxonomy_facets
-- ARCHITECTURAL DECISION: Platform-level facets have customer_account_id IS NULL.
-- Every authenticated tenant is explicitly permitted to READ platform-level facets (inherited taxonomy).
-- Tenant-specific custom facets (customer_account_id = current_tenant_id()) are readable ONLY by their owning tenant.
ALTER TABLE taxonomy_facets ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON taxonomy_facets
    FOR ALL
    USING (customer_account_id IS NULL OR customer_account_id = current_tenant_id());

-- 9.2 taxonomy_facet_values
-- Inherits tenant access from parent taxonomy_facets node via facet_id FK.
ALTER TABLE taxonomy_facet_values ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON taxonomy_facet_values
    FOR ALL
    USING (facet_id IN (
        SELECT id FROM taxonomy_facets
        WHERE customer_account_id IS NULL OR customer_account_id = current_tenant_id()
    ));

-- 9.3 product_facet_assignments
-- Inherits tenant access from parent product via product_id FK.
ALTER TABLE product_facet_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON product_facet_assignments
    FOR ALL
    USING (product_id IN (
        SELECT id FROM products
        WHERE customer_account_id = current_tenant_id()
    ));

-- 9.4 inquiry_contacts
-- Inherits tenant access from parent inquiry via inquiry_id FK.
ALTER TABLE inquiry_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON inquiry_contacts
    FOR ALL
    USING (inquiry_id IN (
        SELECT id FROM inquiries
        WHERE customer_account_id = current_tenant_id()
    ));

-- 9.5 tenant_sequence_counters
-- Direct tenant isolation matching JWT tenant_id.
ALTER TABLE tenant_sequence_counters ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON tenant_sequence_counters
    FOR ALL
    USING (customer_account_id = current_tenant_id());

-- 9.6 column_provenance_logs
-- Restricts audit log visibility strictly to records owned by current_tenant_id().
ALTER TABLE column_provenance_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON column_provenance_logs
    FOR ALL
    USING (
        (table_name = 'inquiries' AND record_id IN (
            SELECT id FROM inquiries WHERE customer_account_id = current_tenant_id()
        )) OR
        (table_name = 'quotes' AND record_id IN (
            SELECT id FROM quotes WHERE customer_account_id = current_tenant_id()
        ))
    );

COMMIT;
