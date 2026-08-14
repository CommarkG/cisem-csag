-- migrations.sql
-- Run these SQL statements in your Supabase SQL Editor (https://supabase.com/dashboard/project/kzuqwiplufvtrzmmcacw/sql/new)

-- 1. Create Status Library Table
CREATE TABLE IF NOT EXISTS status_library (
    code VARCHAR(50) PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Populate Status Library
INSERT INTO status_library (code, label, description) VALUES
('brief_raw', 'Brief Raw', 'Ingested brief that is unprocessed or missing constraints'),
('brief_processed', 'Brief Processed', 'Brief constraints parsed and catalog matched'),
('brief_ratified', 'Brief Ratified', 'Brief approved by operator, ready for proposal generation'),
('brief_sealed', 'Brief Sealed', 'Brief locked and read-only'),
('proposal_draft', 'Proposal Draft', 'Proposal created in draft state'),
('proposal_active', 'Proposal Active', 'Proposal active and viewable by client'),
('proposal_signed', 'Proposal Signed', 'Proposal accepted and signed by client'),
('proposal_expired', 'Proposal Expired', 'Proposal past its validity date'),
('backlog_raw', 'Backlog Raw', 'Unprocessed feedback or feature idea'),
('backlog_processed', 'Backlog Processed', 'Feedback processed and mapped to target issues'),
('backlog_consolidated', 'Backlog Consolidated', 'Feedback consolidated into future implementation plans'),
('backlog_in_plan', 'Backlog In Plan', 'Feedback active in current ratified implementation plan')
ON CONFLICT (code) DO UPDATE SET 
    label = EXCLUDED.label, 
    description = EXCLUDED.description;

-- 3. Create State Transition Registry Table
CREATE TABLE IF NOT EXISTS state_transitions (
    from_status VARCHAR(50) REFERENCES status_library(code) ON DELETE CASCADE,
    to_status VARCHAR(50) REFERENCES status_library(code) ON DELETE CASCADE,
    PRIMARY KEY (from_status, to_status)
);

-- 4. Populate Valid State Transitions
INSERT INTO state_transitions (from_status, to_status) VALUES
('brief_raw', 'brief_processed'),
('brief_processed', 'brief_ratified'),
('brief_ratified', 'brief_sealed'),
('proposal_draft', 'proposal_active'),
('proposal_active', 'proposal_signed'),
('proposal_active', 'proposal_expired'),
('proposal_expired', 'proposal_active'), -- allow renewal
('backlog_raw', 'backlog_processed'),
('backlog_processed', 'backlog_consolidated'),
('backlog_consolidated', 'backlog_in_plan')
ON CONFLICT DO NOTHING;

-- 5. Create Tag Library Table
CREATE TABLE IF NOT EXISTS tag_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES tag_library(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Insert Default Tags
INSERT INTO tag_library (id, label, description, parent_id) VALUES
('00000000-0000-0000-0000-000000000001', 'Corporate Gifts', 'Root category for corporate promotional items', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO tag_library (id, label, description, parent_id) VALUES
('00000000-0000-0000-0000-000000000002', 'Bags', 'Luggage, backpacks, laptop bags', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000003', 'Gadgets', 'Bluetooth speakers, custom tech, chargers', '00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- 7. Create Custom Libraries Table (Dynamic Tabs Registry)
CREATE TABLE IF NOT EXISTS custom_libraries (
    tab_id VARCHAR(50) PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Populate Default Dynamic Registry definitions
INSERT INTO custom_libraries (tab_id, label, description) VALUES
('freight_zones', 'Freight Cost Zones', 'Geographic zones and associated base freight rates'),
('branding_techniques', 'Branding Techniques', 'List of customization printing techniques')
ON CONFLICT (tab_id) DO UPDATE SET 
    label = EXCLUDED.label, 
    description = EXCLUDED.description;

-- 8. Create Unified Key-Value Lookup Registry (EAV Pattern)
CREATE TABLE IF NOT EXISTS lookup_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registry_type VARCHAR(50) REFERENCES custom_libraries(tab_id) ON DELETE CASCADE,
    key_name VARCHAR(100) NOT NULL,
    value_data TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (registry_type, key_name)
);

-- Seed lookup registry default data
INSERT INTO lookup_registry (registry_type, key_name, value_data) VALUES
('freight_zones', 'Center (Tel Aviv/Gush Dan)', '150.00'),
('freight_zones', 'North (Haifa/Galilee)', '250.00'),
('freight_zones', 'South (Beer Sheva/Negev)', '300.00'),
('branding_techniques', 'laser_engraving', 'Laser Engraving'),
('branding_techniques', 'uv_print', 'UV Printing'),
('branding_techniques', 'silk_print', 'Silk Screen Printing')
ON CONFLICT (registry_type, key_name) DO NOTHING;

-- 9. Create Document Chunks Table (Granular Brief Segments)
CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    serial_code VARCHAR(30) UNIQUE NOT NULL,
    parent_type VARCHAR(50) NOT NULL, -- 'brief', 'proposal', or 'specification'
    parent_id UUID NOT NULL,
    chunk_text TEXT NOT NULL,
    tag_id UUID REFERENCES tag_library(id) ON DELETE SET NULL,
    status_code VARCHAR(50) REFERENCES status_library(code) NOT NULL,
    sequence_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 10. Create State Transition Enforcer Trigger
CREATE OR REPLACE FUNCTION enforce_state_transition()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status_code IS NULL THEN
        RETURN NEW;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM state_transitions 
        WHERE from_status = OLD.status_code AND to_status = NEW.status_code
    ) THEN
        RAISE EXCEPTION 'Illegal state transition from % to %.', OLD.status_code, NEW.status_code;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_chunk_lifecycle ON document_chunks;
CREATE TRIGGER enforce_chunk_lifecycle
BEFORE UPDATE ON document_chunks
FOR EACH ROW
EXECUTE FUNCTION enforce_state_transition();

-- 11. Create Cascading Brief Seal Lock Trigger
CREATE OR REPLACE FUNCTION cascade_document_seal()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status_code = 'brief_sealed' AND OLD.status_code != 'brief_sealed' THEN
        UPDATE document_chunks 
        SET status_code = 'brief_sealed'
        WHERE parent_id = NEW.id AND parent_type = 'brief';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_brief_seal_cascade ON briefs;
CREATE TRIGGER enforce_brief_seal_cascade
BEFORE UPDATE ON briefs
FOR EACH ROW
EXECUTE FUNCTION cascade_document_seal();

-- 12. Create PDF Generator Task Queue
CREATE TABLE IF NOT EXISTS pdf_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_token VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' NOT NULL, -- 'pending', 'processing', 'completed', 'failed'
    result_pdf BYTEA,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 13. Create Backlog Registry Table (Cognitive Parking Lot)
CREATE TABLE IF NOT EXISTS backlog_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    serial_code VARCHAR(30) UNIQUE NOT NULL,
    title TEXT NOT NULL,
    context TEXT,
    tags TEXT[] DEFAULT '{}'::text[] NOT NULL,
    status VARCHAR(50) REFERENCES status_library(code) DEFAULT 'backlog_raw' NOT NULL,
    impact_level VARCHAR(20) DEFAULT 'low' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 14. Create Product Groups Table (L0 -> L1 -> L2 Hierarchy)
CREATE TABLE IF NOT EXISTS product_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    parent_id UUID REFERENCES product_groups(id) ON DELETE CASCADE,
    level INTEGER NOT NULL, -- 0 = Main Topic (L0), 1 = Sub Topic (L1), 2 = Sub-Sub Topic (L2)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 15. Alter Catalog Items for Hierarchy integration (Non-Destructive)
ALTER TABLE catalog_items ADD COLUMN IF NOT EXISTS product_group_id UUID REFERENCES product_groups(id) ON DELETE SET NULL;

-- 16. Create Product Variations Table (surcharges)
CREATE TABLE IF NOT EXISTS product_variations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    catalog_item_id UUID REFERENCES catalog_items(id) ON DELETE CASCADE,
    variation_type VARCHAR(50) NOT NULL, -- 'color', 'size', 'material'
    value VARCHAR(100) NOT NULL, -- e.g. 'Royal Blue', 'Size XL'
    cost_modifier DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 17. Create Catalog Item Sandbox Variants Table (A/B Sandboxing)
CREATE TABLE IF NOT EXISTS catalog_item_sandbox_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_item_id UUID REFERENCES catalog_items(id) ON DELETE CASCADE,
    sandbox_sku VARCHAR(100) UNIQUE NOT NULL,
    title_he TEXT,
    specs JSONB,
    variations JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 18. Create Proposal Client Drafts Table
CREATE TABLE IF NOT EXISTS proposal_client_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
    selection_matrix JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'draft_pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 19. Create CRM customer accounts Table
CREATE TABLE IF NOT EXISTS customer_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(200) NOT NULL,
    tax_id VARCHAR(50), -- H.P.
    industry VARCHAR(100),
    brand_assets JSONB DEFAULT '{}'::jsonb, -- holds svg/png logo URLs and Hex color arrays
    credit_terms VARCHAR(50) DEFAULT 'Net-30',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 20. Create CRM Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_account_id UUID REFERENCES customer_accounts(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    whatsapp VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 21. Create CRM Deals Table
CREATE TABLE IF NOT EXISTS deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    brief_id UUID REFERENCES briefs(id) ON DELETE SET NULL,
    proposal_id UUID REFERENCES proposals(id) ON DELETE SET NULL,
    deal_stage VARCHAR(50) DEFAULT 'lead_ingestion' NOT NULL,
    deal_value DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 22. Alter Supplier Mappings for International Sourcing (Phase 2)
ALTER TABLE supplier_mappings ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'IL';
ALTER TABLE supplier_mappings ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'ILS';
ALTER TABLE supplier_mappings ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';

-- 23. Alter Proposal Items for Multi-Supplier Routing (Phase 2)
ALTER TABLE proposal_items ADD COLUMN IF NOT EXISTS selected_supplier_mapping_id UUID REFERENCES supplier_mappings(id) ON DELETE SET NULL;
ALTER TABLE proposal_items ADD COLUMN IF NOT EXISTS selected_variations TEXT[] DEFAULT '{}'::text[];

-- 24. Alter Catalog Items for Curated Recommendations (Phase 2)
ALTER TABLE catalog_items ADD COLUMN IF NOT EXISTS top_picks BOOLEAN DEFAULT FALSE;

-- 25. Create Role Definitions Table
CREATE TABLE IF NOT EXISTS role_definitions (
    code VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 26. Create Packages Table
CREATE TABLE IF NOT EXISTS packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    max_team_members INTEGER DEFAULT 3 NOT NULL,
    max_landing_pages INTEGER DEFAULT 5 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 27. Create Feature Registry Table
CREATE TABLE IF NOT EXISTS feature_registry (
    code VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 28. Create Package Feature Grants Table
CREATE TABLE IF NOT EXISTS package_feature_grants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
    feature_code VARCHAR(50) REFERENCES feature_registry(code) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(package_id, feature_code)
);

-- 29. Alter Customer Accounts (Link to Packages)
ALTER TABLE customer_accounts ADD COLUMN IF NOT EXISTS package_id UUID REFERENCES packages(id) ON DELETE SET NULL;

-- 30. Create Authenticated Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(150) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 31. Create User Account Roles Join Table (Multi-Tenant Graph)
CREATE TABLE IF NOT EXISTS user_account_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    customer_account_id UUID REFERENCES customer_accounts(id) ON DELETE CASCADE,
    role_code VARCHAR(50) REFERENCES role_definitions(code) ON DELETE CASCADE,
    granted_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, customer_account_id, role_code)
);

-- 32. Create Template Registry Table (Universal Solution Core)
CREATE TABLE IF NOT EXISTS template_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    serial_code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    layout_spec JSONB NOT NULL,
    tags TEXT[] DEFAULT '{}'::text[] NOT NULL,
    is_canonical BOOLEAN DEFAULT FALSE NOT NULL,
    customer_account_id UUID REFERENCES customer_accounts(id) ON DELETE CASCADE,
    forked_from UUID REFERENCES template_registry(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'draft' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 33. Link Internal Ownership to CRM Tables
ALTER TABLE deals ADD COLUMN IF NOT EXISTS assigned_user_id UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS assigned_user_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- 34. Enable Row-Level Security on Core SaaS Tables
ALTER TABLE template_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_account_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- 35. Inject RLS Policies for Tenant Isolation
CREATE POLICY tenant_isolation_policy ON template_registry
    FOR ALL
    USING (customer_account_id IS NULL OR customer_account_id = coalesce(
        nullif(current_setting('app.current_tenant_id', true), ''),
        nullif(current_setting('request.headers', true)::jsonb ->> 'x-current-tenant-id', '')
    )::uuid);

CREATE POLICY tenant_isolation_policy ON user_account_roles
    FOR ALL
    USING (customer_account_id = coalesce(
        nullif(current_setting('app.current_tenant_id', true), ''),
        nullif(current_setting('request.headers', true)::jsonb ->> 'x-current-tenant-id', '')
    )::uuid);

CREATE POLICY tenant_isolation_policy ON contacts
    FOR ALL
    USING (customer_account_id = coalesce(
        nullif(current_setting('app.current_tenant_id', true), ''),
        nullif(current_setting('request.headers', true)::jsonb ->> 'x-current-tenant-id', '')
    )::uuid);

-- 36. Inject Join-based RLS Policy for Deals Table (references contacts)
CREATE POLICY tenant_isolation_policy ON deals
    FOR ALL
    USING (contact_id IN (
        SELECT id FROM contacts 
        WHERE customer_account_id = coalesce(
            nullif(current_setting('app.current_tenant_id', true), ''),
            nullif(current_setting('request.headers', true)::jsonb ->> 'x-current-tenant-id', '')
        )::uuid
    ));


-- 37. Add account_type to customer_accounts (entity boundary classification)
-- Ratified decision 2026-08-14: customer_accounts.id is the canonical tenant_id.
-- TENANT     = a platform user's company (has membership rows, package, auth user)
-- CRM_CLIENT = a company the tenant sells to (has contacts/deals, no membership)
-- No default is intentional: every row must be classified deliberately.
-- Enforcement: NOT NULL + CHECK prevents unclassified rows at the DB level.

-- Phase 1: Add column nullable (required before existing rows can be updated)
ALTER TABLE customer_accounts
    ADD COLUMN IF NOT EXISTS account_type VARCHAR(20);

-- Phase 2: Classify all existing rows as CRM_CLIENT
-- Evidence: zero user_account_roles entries, zero package_id values,
-- zero auth users match any customer_accounts row (T3 dry-run: Written=0).
-- All existing rows are CRM fixtures created for pipeline testing.
UPDATE customer_accounts
    SET account_type = 'CRM_CLIENT'
    WHERE account_type IS NULL;

-- Phase 3: Enforce NOT NULL (after all rows are classified)
ALTER TABLE customer_accounts
    ALTER COLUMN account_type SET NOT NULL;


-- Phase 4: Constrain to the two declared types only
ALTER TABLE customer_accounts
    ADD CONSTRAINT customer_accounts_account_type_valid
    CHECK (account_type IN ('TENANT', 'CRM_CLIENT'));

-- =============================================================================
-- 38. pending_claims + seed role_definitions + seed starter package
-- =============================================================================
-- pending_claims: records users whose tenant_id claim could not be written.
-- Makes broken provisioning state visible to operators (U6.2.09).
-- Two status values:
--   CLAIM_FAILED       — step 4 admin API call failed after DB steps committed
--   PENDING_ONBOARDING — user signed up without company_name (D.1/B3 safety net)
-- Repair path: backfill script processes CLAIM_FAILED rows.
--              Onboarding endpoint resolves PENDING_ONBOARDING on first login.

CREATE TABLE IF NOT EXISTS pending_claims (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID NOT NULL,
    tenant_id    UUID REFERENCES customer_accounts(id) ON DELETE SET NULL,
    status       VARCHAR(30) NOT NULL DEFAULT 'CLAIM_FAILED'
                     CHECK (status IN ('CLAIM_FAILED', 'PENDING_ONBOARDING')),
    failed_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    attempts     INTEGER DEFAULT 1 NOT NULL,
    last_error   TEXT,
    resolved_at  TIMESTAMP WITH TIME ZONE,
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Partial index: backfill queries only unresolved rows
CREATE INDEX IF NOT EXISTS pending_claims_unresolved_idx
    ON pending_claims(auth_user_id)
    WHERE resolved_at IS NULL;

-- role_definitions seed
-- Recorded debt: taxonomy is two test rows. Must be formally defined before
-- provisioning goes to production. Owner: Governor.
-- ON CONFLICT DO NOTHING: safe against existing rows on live DB.
INSERT INTO role_definitions (code, name, description)
VALUES
    ('account_owner',
     'Account Owner',
     'First user of a tenant; full administrative rights within the account.'),
    ('operator_admin',
     'Operator Admin',
     'Platform-level operator with cross-tenant administrative access.')
ON CONFLICT (code) DO NOTHING;

-- Starter package seed
-- Required: provisioning.py defaults to package_code='starter'.
-- A missing starter package causes FK failure at provision_tenant step 1.
-- ON CONFLICT DO NOTHING: safe against existing rows.
INSERT INTO packages (code, name, max_team_members, max_landing_pages)
VALUES ('starter', 'Starter', 3, 5)
ON CONFLICT (code) DO NOTHING;
