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

-- FENCED DEAD SQL (Target table 'briefs' absent from 66 live schema tables)
-- DROP TRIGGER IF EXISTS enforce_brief_seal_cascade ON briefs;
-- CREATE TRIGGER enforce_brief_seal_cascade
-- BEFORE UPDATE ON briefs
-- FOR EACH ROW
-- EXECUTE FUNCTION cascade_document_seal();

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
    -- FENCED DEAD SQL (Target table 'proposals' absent from 66 live schema tables)
-- proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
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
-- FENCED DEAD SQL (Target tables 'briefs', 'proposals', 'proposal_items' absent from 66 live schema tables)
-- CREATE TABLE IF NOT EXISTS deals (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
--     brief_id UUID REFERENCES briefs(id) ON DELETE SET NULL,
--     proposal_id UUID REFERENCES proposals(id) ON DELETE SET NULL,
--     deal_stage VARCHAR(50) DEFAULT 'lead_ingestion' NOT NULL,
--     deal_value DECIMAL(10,2) DEFAULT 0.00,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
-- );

-- 22. Alter Supplier Mappings for International Sourcing (Phase 2)
ALTER TABLE supplier_mappings ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'IL';
ALTER TABLE supplier_mappings ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'ILS';
ALTER TABLE supplier_mappings ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';

-- FENCED DEAD SQL (Target table 'proposal_items' absent from 66 live schema tables)
-- ALTER TABLE proposal_items ADD COLUMN IF NOT EXISTS selected_supplier_mapping_id UUID REFERENCES supplier_mappings(id) ON DELETE SET NULL;
-- ALTER TABLE proposal_items ADD COLUMN IF NOT EXISTS selected_variations TEXT[] DEFAULT '{}'::text[];

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
-- WARNING: The coalesce(current_setting(...)) pattern below is HISTORICAL INTENT ONLY.
-- The CANONICAL LIVE DATABASE RLS pattern uses current_tenant_id() (JWT app_metadata -> tenant_id).
-- ALL NEW POLICIES MUST USE current_tenant_id() EXCLUSIVELY.
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

-- 38. Create crm_customers table (entity boundary segregation)
-- Ratified decision 2026-08-19: Segregates CRM client entities out of customer_accounts
-- into a dedicated table carrying an explicit tenant_id FK to customer_accounts(id).
CREATE TABLE IF NOT EXISTS crm_customers (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id    UUID NOT NULL REFERENCES customer_accounts(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    tax_id       TEXT,
    industry     TEXT,
    brand_assets JSONB DEFAULT '{}'::jsonb,
    credit_terms TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE crm_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY crm_customers_tenant_isolation ON crm_customers
    FOR ALL USING (tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid);


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
    ('platform_admin', 'Platform Admin', 'Platform-level operator with cross-tenant administrative access.'),
    ('account_owner', 'Account Owner', 'First user of a tenant; full administrative rights within the account.'),
    ('account_admin', 'Account Admin', 'Administrative user with full tenant configuration management rights.'),
    ('team_manager', 'Team Manager', 'Manager responsible for workspace teams and member management.'),
    ('member', 'Member', 'Standard tenant member with full resource creation and editing access.'),
    ('viewer', 'Viewer', 'Read-only access to tenant resources and analytics.'),
    ('client', 'Client', 'External client or guest access scoped to shared proposals and drafts.')
ON CONFLICT (code) DO NOTHING;

-- Starter package seed
-- Required: provisioning.py defaults to package_code='starter'.
-- A missing starter package causes FK failure at provision_tenant step 1.
-- ON CONFLICT DO NOTHING: safe against existing rows.
INSERT INTO packages (code, name, max_team_members, max_landing_pages)
VALUES ('starter', 'Starter', 3, 5)
ON CONFLICT (code) DO NOTHING;

-- =====================================================================
-- 39. SAAS ABSORPTION, API KEYS & TENANT USAGE METERING SCHEMA
-- RATIFIED: GOV-2026-08-16-TENANCY / Step 1 & 2 Core Infrastructure
-- =====================================================================

-- 1. Tenant API Keys (For External Apps to Connect Safely)
CREATE TABLE IF NOT EXISTS tenant_api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES customer_accounts(id) ON DELETE CASCADE,
    key_name TEXT NOT NULL,
    key_prefix TEXT NOT NULL, -- e.g. 'ubop_live_sk_'
    key_hash TEXT NOT NULL,   -- SHA-256 hash of secret key
    scopes TEXT[] DEFAULT '{"media:read", "media:write"}'::text[],
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE tenant_api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_api_keys_isolation ON tenant_api_keys
    FOR ALL USING (tenant_id = coalesce(
        nullif(current_setting('app.current_tenant_id', true), ''),
        nullif(current_setting('request.headers', true)::jsonb ->> 'x-current-tenant-id', '')
    )::uuid);

-- 2. External App Registry (Modular SaaS Catalog)
CREATE TABLE IF NOT EXISTS app_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_code TEXT UNIQUE NOT NULL, -- e.g. 'MEDIA_TRANSFORM_ENGINE'
    app_name TEXT NOT NULL,
    description TEXT,
    pricing_tier TEXT DEFAULT 'FREE',
    webhook_events TEXT[] DEFAULT '{}'::text[],
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Tenant App Installations (Active Module Subscriptions)
CREATE TABLE IF NOT EXISTS tenant_installations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES customer_accounts(id) ON DELETE CASCADE,
    app_id UUID NOT NULL REFERENCES app_registry(id) ON DELETE CASCADE,
    config JSONB DEFAULT '{}'::jsonb,
    is_enabled BOOLEAN DEFAULT true,
    installed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(tenant_id, app_id)
);

ALTER TABLE tenant_installations ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_installations_isolation ON tenant_installations
    FOR ALL USING (tenant_id = coalesce(
        nullif(current_setting('app.current_tenant_id', true), ''),
        nullif(current_setting('request.headers', true)::jsonb ->> 'x-current-tenant-id', '')
    )::uuid);

-- 4. Tenant Usage Logs (Monetization & Metering Telemetry)
CREATE TABLE IF NOT EXISTS tenant_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES customer_accounts(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL, -- e.g. 'gpu_seconds', 'storage_bytes', 'api_calls'
    quantity NUMERIC(12,4) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    recorded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE tenant_usage_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_usage_logs_isolation ON tenant_usage_logs
    FOR ALL USING (tenant_id = coalesce(
        nullif(current_setting('app.current_tenant_id', true), ''),
        nullif(current_setting('request.headers', true)::jsonb ->> 'x-current-tenant-id', '')
    )::uuid);

-- =====================================================================
-- 40. SEED DEFAULT SAAS APP MARKETPLACE CATALOG MODULES
-- RATIFIED: GOV-2026-08-16-TENANCY / Step 1 App Registry Seeds
-- =====================================================================
INSERT INTO app_registry (app_code, app_name, description, pricing_tier, webhook_events)
VALUES
    ('MEDIA_TRANSFORM_ENGINE', 'Media Transformation Engine', 'Automated image & video normalization, background removal, and FFmpeg GPU encoding pipeline.', 'PRO', '{"media.normalized", "media.uploaded"}'::text[]),
    ('AI_PROPOSAL_GENERATOR', 'AI Proposal Generator', 'AI-driven customer proposal generation with dynamic pricing calculations and margin enforcement.', 'STARTER', '{"proposal.generated", "proposal.approved"}'::text[]),
    ('AUTOMATED_MARKETING_HUB', 'Automated Marketing Hub', 'Multi-channel marketing automation, lead scoring, and automated client follow-up sequences.', 'ENTERPRISE', '{"lead.ingested", "deal.updated"}'::text[])
ON CONFLICT (app_code) DO NOTHING;

-- =====================================================================
-- 41. TENANT WEBHOOK DELIVERY LOGS TABLE (AUDIT & TELEMETRY)
-- RATIFIED: GOV-2026-08-16-TENANCY / Step 3 Webhook Logs Schema
-- =====================================================================
CREATE TABLE IF NOT EXISTS tenant_webhook_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES customer_accounts(id) ON DELETE CASCADE,
    app_code TEXT NOT NULL,
    event_name TEXT NOT NULL,
    target_url TEXT NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    response_status INTEGER,
    error_message TEXT,
    dispatched_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE tenant_webhook_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_webhook_logs_isolation ON tenant_webhook_logs
    FOR ALL USING (tenant_id = coalesce(
        nullif(current_setting('app.current_tenant_id', true), ''),
        nullif(current_setting('request.headers', true)::jsonb ->> 'x-current-tenant-id', '')
    )::uuid);

-- =====================================================================
-- 42. TENANT API KEY IP ALLOWLIST RESTRICTIONS
-- RATIFIED: GOV-2026-08-16-TENANCY / Step 5 API Key IP Whitelisting
-- =====================================================================
ALTER TABLE tenant_api_keys ADD COLUMN IF NOT EXISTS ip_allowlist TEXT[] DEFAULT '{}'::text[];

-- =====================================================================
-- 43. TELEMETRY & WEBHOOK AUDIT DDL COMPOSITE INDEXES
-- RATIFIED: GOV-2026-08-16-TENANCY / Step 1 Index Performance Optimization
-- =====================================================================
CREATE INDEX IF NOT EXISTS idx_tenant_usage_tenant_date ON tenant_usage_logs (tenant_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_tenant_webhook_tenant_date ON tenant_webhook_logs (tenant_id, dispatched_at DESC);

-- =====================================================================
-- 44. ADD SETTINGS JSONB COLUMN TO CUSTOMER ACCOUNTS TABLE
-- RATIFIED: GOV-2026-08-25-UNIVERSAL-SETTINGS / Layer 2 Onboarding Infrastructure
-- =====================================================================
ALTER TABLE customer_accounts ADD COLUMN IF NOT EXISTS settings jsonb DEFAULT '{}'::jsonb;


-- =====================================================================
-- 45. PHASE B: FORCE ROW LEVEL SECURITY HARDENING & POLICY MIGRATION
-- RATIFIED: GOV-2026-08-30-FORCE-RLS-PHASE-B
-- =====================================================================

-- 45.1. Hardened rls_auto_enable Event Trigger Function
-- Removes silent EXCEPTION WHEN OTHERS fallback (now raises explicit exception).
-- Appends mandatory 'FORCE ROW LEVEL SECURITY' DDL on all future created tables in public schema.
-- KNOWN LIMITATION & DEFEAT VECTOR: rls_auto_enable explicitly filters by 'IF cmd.schema_name IN (''public'')'.
-- Tables created outside the 'public' schema (e.g. custom tenant or extensions schemas) bypass this trigger
-- and will NOT have RLS automatically enabled or forced; manual DDL is required for non-public schemas.
CREATE OR REPLACE FUNCTION public.rls_auto_enable()
 RETURNS event_trigger LANGUAGE plpgsql SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
DECLARE cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE','CREATE TABLE AS','SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
    IF cmd.schema_name IN ('public') THEN
      -- Enable Row Level Security
      EXECUTE format('ALTER TABLE IF EXISTS %I.%I ENABLE ROW LEVEL SECURITY',
                     cmd.schema_name, cmd.object_name);
      RAISE LOG 'rls_auto_enable: enabled RLS on %.%', cmd.schema_name, cmd.object_name;
      
      -- Force Row Level Security (prevents table owner policy bypass)
      EXECUTE format('ALTER TABLE IF EXISTS %I.%I FORCE ROW LEVEL SECURITY',
                     cmd.schema_name, cmd.object_name);
      RAISE LOG 'rls_auto_enable: forced RLS on %.%', cmd.schema_name, cmd.object_name;
    END IF;
  END LOOP;
EXCEPTION WHEN OTHERS THEN
  -- Hard failure: raise exception to block table creation if security cannot be applied
  RAISE EXCEPTION 'rls_auto_enable: HARD FAILURE executing security enablement: %', SQLERRM;
END;
$function$;

-- 45.2. Service Role Access Policy on user_account_roles (Vector 2 Mitigation)
-- Ensures administrative operations via service_role key succeed cleanly.
DROP POLICY IF EXISTS service_role_all ON user_account_roles;
CREATE POLICY service_role_all ON user_account_roles
    FOR ALL TO service_role
    USING (true) WITH CHECK (true);

-- 45.3. Public Read Policies on Shared Reference & Lookup Tables (Vector 3 Mitigation)
-- STANDING RULE: A table is shared reference data ONLY if it carries NO tenant column (customer_account_id is absent).
-- Tenant-owned tables (such as tag_library and vocabulary_terms, which carry customer_account_id) MUST NEVER receive USING (true) public_read policies.
-- The 6 genuine shared reference tables below carry ZERO tenant columns:
DROP POLICY IF EXISTS public_read ON packages;
CREATE POLICY public_read ON packages FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS public_read ON package_feature_grants;
CREATE POLICY public_read ON package_feature_grants FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS public_read ON role_definitions;
CREATE POLICY public_read ON role_definitions FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS public_read ON feature_registry;
CREATE POLICY public_read ON feature_registry FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS public_read ON status_library;
CREATE POLICY public_read ON status_library FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS public_read ON exchange_rates;
CREATE POLICY public_read ON exchange_rates FOR SELECT TO authenticated, anon USING (true);

-- 45.4. Force Row Level Security across all 65 existing public tables (Vector 1 Mitigation)
ALTER TABLE account_closure FORCE ROW LEVEL SECURITY;
ALTER TABLE artifacts FORCE ROW LEVEL SECURITY;
ALTER TABLE attachments FORCE ROW LEVEL SECURITY;
ALTER TABLE backlog_registry FORCE ROW LEVEL SECURITY;
ALTER TABLE branding_rate_cards FORCE ROW LEVEL SECURITY;
ALTER TABLE branding_subcontractors FORCE ROW LEVEL SECURITY;
ALTER TABLE catalog_item_sandbox_variants FORCE ROW LEVEL SECURITY;
ALTER TABLE catalog_items FORCE ROW LEVEL SECURITY;
ALTER TABLE classification_nodes FORCE ROW LEVEL SECURITY;
ALTER TABLE classification_trees FORCE ROW LEVEL SECURITY;
ALTER TABLE contacts FORCE ROW LEVEL SECURITY;
ALTER TABLE counterparties FORCE ROW LEVEL SECURITY;
ALTER TABLE crm_customers FORCE ROW LEVEL SECURITY;
ALTER TABLE custom_libraries FORCE ROW LEVEL SECURITY;
ALTER TABLE customer_accounts FORCE ROW LEVEL SECURITY;
ALTER TABLE decision_records FORCE ROW LEVEL SECURITY;
ALTER TABLE document_chunks FORCE ROW LEVEL SECURITY;
ALTER TABLE events FORCE ROW LEVEL SECURITY;
ALTER TABLE exchange_rates FORCE ROW LEVEL SECURITY;
ALTER TABLE feature_registry FORCE ROW LEVEL SECURITY;
ALTER TABLE inquiries FORCE ROW LEVEL SECURITY;
ALTER TABLE inquiry_units FORCE ROW LEVEL SECURITY;
-- EXCLUSION NOTE: _migration_ledger is system schema bookkeeping (migration execution history) owned by postgres,
-- carrying zero tenant or user data. RLS is intentionally omitted from _migration_ledger.
-- REVISED TABLE COUNT: 64 public domain tables. lookup_registry was retired and dropped by Governor.
ALTER TABLE marks FORCE ROW LEVEL SECURITY;
ALTER TABLE navigation_menu_items FORCE ROW LEVEL SECURITY;
ALTER TABLE offering_classifications FORCE ROW LEVEL SECURITY;
ALTER TABLE offerings FORCE ROW LEVEL SECURITY;
ALTER TABLE option_types FORCE ROW LEVEL SECURITY;
ALTER TABLE option_values FORCE ROW LEVEL SECURITY;
ALTER TABLE pack_items FORCE ROW LEVEL SECURITY;
ALTER TABLE pack_transitions FORCE ROW LEVEL SECURITY;
ALTER TABLE package_feature_grants FORCE ROW LEVEL SECURITY;
ALTER TABLE packages FORCE ROW LEVEL SECURITY;
ALTER TABLE packs FORCE ROW LEVEL SECURITY;
ALTER TABLE participants FORCE ROW LEVEL SECURITY;
ALTER TABLE pdf_queue FORCE ROW LEVEL SECURITY;
ALTER TABLE pending_claims FORCE ROW LEVEL SECURITY;
ALTER TABLE platform_change_requests FORCE ROW LEVEL SECURITY;
ALTER TABLE price_list_lines FORCE ROW LEVEL SECURITY;
ALTER TABLE price_lists FORCE ROW LEVEL SECURITY;
ALTER TABLE product_groups FORCE ROW LEVEL SECURITY;
ALTER TABLE product_variations FORCE ROW LEVEL SECURITY;
ALTER TABLE quote_lines FORCE ROW LEVEL SECURITY;
ALTER TABLE quotes FORCE ROW LEVEL SECURITY;
ALTER TABLE role_definitions FORCE ROW LEVEL SECURITY;
ALTER TABLE round_artifacts FORCE ROW LEVEL SECURITY;
ALTER TABLE rounds FORCE ROW LEVEL SECURITY;
ALTER TABLE rules FORCE ROW LEVEL SECURITY;
ALTER TABLE state_transitions FORCE ROW LEVEL SECURITY;
ALTER TABLE status_library FORCE ROW LEVEL SECURITY;
ALTER TABLE supplier_mappings FORCE ROW LEVEL SECURITY;
ALTER TABLE suppliers FORCE ROW LEVEL SECURITY;
ALTER TABLE supply_offers FORCE ROW LEVEL SECURITY;
ALTER TABLE tag_library FORCE ROW LEVEL SECURITY;
ALTER TABLE team_closure FORCE ROW LEVEL SECURITY;
ALTER TABLE teams FORCE ROW LEVEL SECURITY;
ALTER TABLE template_registry FORCE ROW LEVEL SECURITY;
ALTER TABLE translations FORCE ROW LEVEL SECURITY;
ALTER TABLE unit_composition FORCE ROW LEVEL SECURITY;
ALTER TABLE unit_options FORCE ROW LEVEL SECURITY;
ALTER TABLE units FORCE ROW LEVEL SECURITY;
ALTER TABLE user_account_roles FORCE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_terms FORCE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_transitions FORCE ROW LEVEL SECURITY;


