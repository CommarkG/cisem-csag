-- ==========================================================================================
-- CISEM CORECYCLE 1 MASTER INFRASTRUCTURE MIGRATION
-- Ratified Plan: PLAN-CISEM-20260827-CO1-MASTER-PIPELINE V1.0
-- Governor Authority: GOV-YARIV-20260827-CORECYCLE1-SCHEMA
-- Purpose: Land referential parent_id, faceted classification, inquiry_contacts, 
--          two separate dates, provenance columns, and the 5 Free Schema Decisions.
-- ==========================================================================================

BEGIN;

-- 1. ADD REFERENTIAL HIERARCHY TO vocabulary_terms (Real UUID Foreign Key, not JSONB)
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

-- 4. UPDATE INQUIRIES TABLE: Add two separate dates, human-facing numbers, tax columns, idempotency, versioning & provenance
ALTER TABLE inquiries
ADD COLUMN IF NOT EXISTS inquiry_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS year_code INT DEFAULT EXTRACT(YEAR FROM NOW()),
ADD COLUMN IF NOT EXISTS sequence_number INT,
ADD COLUMN IF NOT EXISTS event_date DATE,
ADD COLUMN IF NOT EXISTS factory_ready_date DATE,
ADD COLUMN IF NOT EXISTS subtotal_amount NUMERIC(12,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS tax_amount NUMERIC(12,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS tax_rate NUMERIC(5,4) DEFAULT 0.1700,
ADD COLUMN IF NOT EXISTS total_amount NUMERIC(12,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS idempotency_key VARCHAR(100),
ADD COLUMN IF NOT EXISTS version INT DEFAULT 1 NOT NULL,
ADD COLUMN IF NOT EXISTS provenance_type VARCHAR(20) DEFAULT 'SAID' CHECK (provenance_type IN ('SAID', 'HELD', 'RULED', 'ASSUMED')),
ADD COLUMN IF NOT EXISTS provenance_source TEXT,
ADD COLUMN IF NOT EXISTS is_confirmed BOOLEAN DEFAULT false NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_inquiries_human_number ON inquiries(customer_account_id, year_code, sequence_number);
CREATE UNIQUE INDEX IF NOT EXISTS idx_inquiries_idempotency ON inquiries(idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_inquiries_event_date ON inquiries(event_date);
CREATE INDEX IF NOT EXISTS idx_inquiries_factory_ready_date ON inquiries(factory_ready_date);

-- 5. CREATE IMMUTABLE QUOTES TABLE WITH SEAL POINTING TO EXACT VERSION SEEN
CREATE TABLE IF NOT EXISTS quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_id UUID REFERENCES inquiries(id) ON DELETE CASCADE NOT NULL,
    customer_account_id UUID REFERENCES customer_accounts(id) ON DELETE CASCADE NOT NULL,
    quote_number VARCHAR(50) NOT NULL,
    version INT DEFAULT 1 NOT NULL,
    subtotal_amount NUMERIC(12,2) NOT NULL,
    tax_amount NUMERIC(12,2) NOT NULL,
    tax_rate NUMERIC(5,4) NOT NULL,
    total_amount NUMERIC(12,2) NOT NULL,
    is_sealed BOOLEAN DEFAULT false NOT NULL,
    seal_hash VARCHAR(64), -- SHA-256 hash of sealed quote payload
    sealed_at TIMESTAMP WITH TIME ZONE,
    idempotency_key VARCHAR(100),
    provenance_type VARCHAR(20) DEFAULT 'RULED' CHECK (provenance_type IN ('SAID', 'HELD', 'RULED', 'ASSUMED')),
    provenance_source TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (customer_account_id, quote_number, version)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_quotes_idempotency ON quotes(idempotency_key) WHERE idempotency_key IS NOT NULL;

-- 6. ADD VERSIONING TO PRODUCTS TABLE
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS version INT DEFAULT 1 NOT NULL;

-- 7. RETIREMENT OF UNSTRUCTURED LOOKUP_REGISTRY IN FAVOR OF TAXONOMY_FACETS
-- Populate default facet values from legacy lookup_registry if facets empty
INSERT INTO taxonomy_facets (customer_account_id, facet_code, facet_label)
SELECT DISTINCT customer_account_id, 'branding_technology', 'Branding Technology'
FROM lookup_registry WHERE registry_type = 'branding_techniques'
ON CONFLICT (customer_account_id, facet_code) DO NOTHING;

COMMIT;
