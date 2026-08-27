-- ==========================================================================================
-- CISEM CORECYCLE 1 MASTER INFRASTRUCTURE MIGRATION (REVISED V6.0 - SLIMMED & AUDITED)
-- Ratified Plan: PLAN-CISEM-20260827-CO1-MASTER-PIPELINE V1.0
-- Governor Authority: GOV-YARIV-20260827-CORECYCLE1-SCHEMA
-- Purpose: Complete referential hierarchy, atomic sequence generator, column-level provenance, 
--          5 Free Schema Decisions, explicit ::INT casts, catalog_items versioning, 
--          and CANONICAL RLS policies on surviving 3 new tables (inquiry_contacts, tenant_sequence_counters, column_provenance_logs).
-- DROPPED (RETIRED & SUPERSEDED BY PRE-EXISTING DATABASE STRUCTURES):
--   - taxonomy_facets, taxonomy_facet_values -> SUPERSEDED by pre-existing product_groups (hierarchy) and product_variations (facets).
--   - product_facet_assignments -> SUPERSEDED by product_variations.catalog_item_id link.
--   - products -> SUPERSEDED by pre-existing catalog_items table.
-- ==========================================================================================

BEGIN;

-- 1. ALTER EXISTING vocabulary_terms (Real UUID Foreign Key, not JSONB string)
ALTER TABLE vocabulary_terms 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES vocabulary_terms(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS version INT DEFAULT 1 NOT NULL;

CREATE INDEX IF NOT EXISTS idx_vocabulary_terms_parent_id ON vocabulary_terms(parent_id);

-- 2. CREATE INQUIRY CONTACTS (One-to-Many Relation: Multiple contacts per inquiry)
CREATE TABLE IF NOT EXISTS inquiry_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_id UUID REFERENCES inquiries(id) ON DELETE CASCADE NOT NULL,
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE NOT NULL,
    role_code VARCHAR(50) DEFAULT 'primary' NOT NULL, -- 'primary', 'approver', 'billing', 'logistics'
    is_primary BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (inquiry_id, contact_id)
);

-- 3. ATOMIC TENANT SEQUENCE GENERATOR (Human-Facing Numbering Engine)
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

-- 4. ALTER EXISTING inquiries TABLE: Add explicit dates, human numbers, tax columns, idempotency, versioning & column provenance
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

-- 5. ALTER EXISTING quotes TABLE (Targeting 17 Existing Columns: id, customer_account_id, inquiry_id, version, fx_rate, etc.)
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

-- 6. ALTER EXISTING catalog_items TABLE (Pre-existing sellable item table)
ALTER TABLE catalog_items 
ADD COLUMN IF NOT EXISTS version INT DEFAULT 1 NOT NULL;

-- 7. DETAILED COLUMN PROVENANCE AUDIT TABLE
-- DELIBERATE ARCHITECTURAL CHOICE: Scoped to 'inquiries' and 'quotes' initially.
-- To add provenance logging for a 3rd entity (e.g. 'work_orders'), update Section 8.3 policy USING & WITH CHECK subqueries.
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
-- 8. ROW-LEVEL SECURITY (RLS) POLICIES FOR SURVIVING 3 NEW TABLES
-- USING CANONICAL current_tenant_id() FUNCTION WITH EXPLICIT READ (USING) AND WRITE (WITH CHECK) SEPARATION
-- ZERO SESSION SETTINGS. ZERO REQUEST HEADERS. ZERO UNGUARDED INJECTIONS.
-- ==========================================================================================

-- 8.1 inquiry_contacts
-- Inherits tenant access from parent inquiry via inquiry_id FK.
ALTER TABLE inquiry_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON inquiry_contacts
    FOR ALL
    USING (inquiry_id IN (
        SELECT id FROM inquiries
        WHERE customer_account_id = current_tenant_id()
    ))
    WITH CHECK (inquiry_id IN (
        SELECT id FROM inquiries
        WHERE customer_account_id = current_tenant_id()
    ));

-- 8.2 tenant_sequence_counters
-- Direct tenant isolation matching JWT tenant_id.
ALTER TABLE tenant_sequence_counters ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON tenant_sequence_counters
    FOR ALL
    USING (customer_account_id = current_tenant_id())
    WITH CHECK (customer_account_id = current_tenant_id());

-- 8.3 column_provenance_logs
-- Restricts audit log visibility and writes strictly to records owned by current_tenant_id().
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
    )
    WITH CHECK (
        (table_name = 'inquiries' AND record_id IN (
            SELECT id FROM inquiries WHERE customer_account_id = current_tenant_id()
        )) OR
        (table_name = 'quotes' AND record_id IN (
            SELECT id FROM quotes WHERE customer_account_id = current_tenant_id()
        ))
    );

COMMIT;
