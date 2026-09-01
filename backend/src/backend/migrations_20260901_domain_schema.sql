-- =====================================================================
-- CISEM B2B ERP — Migration: Domain Simplification & Business Domains Lookup
-- Date: 2026-09-01
-- Authority: Governor Yariv / Reviewer Claude / Antigravity
-- =====================================================================

-- 1. Platform Business Domains Lookup Table
CREATE TABLE IF NOT EXISTS public.cr_business_domains (
    code VARCHAR(50) PRIMARY KEY,
    label VARCHAR(250) NOT NULL,
    default_service_models TEXT[] NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.cr_business_domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY cr_business_domains_read ON public.cr_business_domains
    FOR SELECT USING (true);

-- Seed Platform Domains
INSERT INTO public.cr_business_domains (code, label, default_service_models, description, sort_order)
VALUES
    ('construction_contractor', 'Construction Contractor & Site Work', ARRAY['SRV', 'MTO'], 'Field contracting, installation, site services & custom fabrication.', 10),
    ('custom_manufacturer', 'Custom Engraver & Manufacturer', ARRAY['MTO', 'STK'], 'Custom manufacturing, job shop production & inventory sales.', 20),
    ('retail_wholesaler', 'Retail Wholesaler & Distributor', ARRAY['STK'], 'Warehouse inventory holding, B2B distribution & stock sales.', 30),
    ('digital_agency', 'Software & Digital Service Delivery', ARRAY['DIG', 'SRV'], 'Software licensing, digital assets & remote digital services.', 40),
    ('general_trade', 'General Trade & Commercial Contracting', ARRAY['STK', 'SRV'], 'General commercial trading, supply & field maintenance.', 50)
ON CONFLICT (code) DO UPDATE SET
    label = EXCLUDED.label,
    default_service_models = EXCLUDED.default_service_models,
    description = EXCLUDED.description;

-- 2. Tenant Business Domains Junction Table
CREATE TABLE IF NOT EXISTS public.tenant_business_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_account_id UUID NOT NULL REFERENCES public.customer_accounts(id) ON DELETE CASCADE,
    domain_code VARCHAR(50) NOT NULL REFERENCES public.cr_business_domains(code),
    is_primary BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT tenant_business_domains_unique UNIQUE (customer_account_id, domain_code)
);

ALTER TABLE public.tenant_business_domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_business_domains_tenant_isolation ON public.tenant_business_domains
    FOR ALL USING (customer_account_id = coalesce(
        nullif(current_setting('app.current_tenant_id', true), '')::uuid,
        '00000000-0000-0000-0000-000000000000'::uuid
    ));
