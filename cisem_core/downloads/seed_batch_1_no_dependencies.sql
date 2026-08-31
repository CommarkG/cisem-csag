-- -----------------------------------------------------------------------------
-- BATCH 1 SEED DATASET (0 DEPENDENCIES)
-- Ratified: GOV-2026-08-31-LAYER0-SEED-V1
-- Target Tables: feature_registry, tag_library, exchange_rates, counterparties, teams
-- -----------------------------------------------------------------------------

-- 1. FEATURE REGISTRY (Platform Capability Entitlement Codes)
INSERT INTO public.feature_registry (code, name, description)
VALUES 
  ('FEAT_INQUIRY_INTAKE', 'Inquiry Intake & Processing', 'Multi-channel inquiry ingestion, structured intake forms, and automated buyer routing.'),
  ('FEAT_CATALOG_MANAGEMENT', 'Catalog Management Engine', 'Supplier catalog ingestion, product group taxonomy hierarchy, and inventory item specifications.'),
  ('FEAT_QUOTE_BUILDER', 'Multi-Option Quote Builder', 'Multi-option quote generation, margin rules, multi-currency conversion, and PDF export.'),
  ('FEAT_WHITELABEL_THEMING', 'Whitelabel Branding & Custom Domains', 'Custom client domain mapping, CSS design token overrides, and custom quote headers.'),
  ('FEAT_AUDIT_LOGGING', 'Immutable Audit Logging', 'Immutable append-only system event logging and tenant activity audit compliance trails.'),
  ('FEAT_CUSTOMER_PORTAL', 'Customer Self-Service Portal', 'Client-facing quote review, order acceptance, and interactive inquiry tracking.'),
  ('FEAT_ANALYTICS_DASHBOARD', 'Executive Analytics Dashboard', 'Real-time KPI metric tracking, conversion funnels, and margin analysis dashboards.')
ON CONFLICT (code) DO UPDATE 
SET name = EXCLUDED.name, description = EXCLUDED.description;

-- 2. TAG LIBRARY (Platform Universal & Domain Taxonomy Tags)
-- Universal Platform Tier (customer_account_id IS NULL, domain_code = 'platform', is_protected = true)
INSERT INTO public.tag_library (code, label, domain_code, is_protected, customer_account_id, description)
VALUES
  ('TAG_SYS_CORE', 'System Core', 'platform', true, NULL, 'Platform core infrastructural primitives and immutable system records.'),
  ('TAG_SECURITY_AUDIT', 'Security Audit', 'platform', true, NULL, 'Security compliance audit trails, permission gates, and auth records.'),
  ('TAG_TENANT_PRIVATE', 'Tenant Private', 'platform', true, NULL, 'Tenant-private isolated records requiring explicit customer ownership.'),
  ('TAG_CATALOG_REF', 'Catalog Reference', 'platform', true, NULL, 'Global reference catalog taxonomies and shared product classifications.'),
  ('TAG_WORKFLOW_ACTIVE', 'Workflow Active', 'platform', true, NULL, 'Active operational workflows currently in execution across pipelines.'),
  ('TAG_FINANCE_FX', 'Finance & FX', 'platform', true, NULL, 'Multi-currency exchange rate tables, FX hedges, and payment ledger entries.')
ON CONFLICT (code) DO UPDATE
SET label = EXCLUDED.label, domain_code = EXCLUDED.domain_code, is_protected = EXCLUDED.is_protected;

-- Domain Taxonomy Tags (customer_account_id IS NULL, is_protected = false)
INSERT INTO public.tag_library (code, label, domain_code, is_protected, customer_account_id, description)
VALUES
  -- Construction Domain
  ('TAG_CONST_CIVIL', 'Civil Engineering & Structural', 'construction', false, NULL, 'Structural concrete, foundations, steel frames, and civil infrastructure.'),
  ('TAG_CONST_MEP', 'MEP & Electrical Systems', 'construction', false, NULL, 'Mechanical, electrical, plumbing, HVAC, and power distribution systems.'),
  ('TAG_CONST_FINISH', 'Finishes & Architectural Joinery', 'construction', false, NULL, 'Interior finishes, millwork, glazing, partitions, and cladding.'),
  ('TAG_CONST_HEAVY', 'Heavy Equipment & Earthworks', 'construction', false, NULL, 'Excavators, cranes, compaction machinery, and site preparation.'),
  -- Health Domain
  ('TAG_HEALTH_MEDDEV', 'Medical Devices & Equipment', 'health', false, NULL, 'Diagnostic equipment, surgical instruments, monitoring devices, and spares.'),
  ('TAG_HEALTH_PHARMA', 'Pharmaceuticals & Reagents', 'health', false, NULL, 'Formulations, active pharmaceutical ingredients, laboratory reagents.'),
  ('TAG_HEALTH_CLINICAL', 'Clinical Workflow & Diagnostics', 'health', false, NULL, 'Hospital consumables, patient care disposables, and laboratory assays.'),
  -- Defence Domain
  ('TAG_DEF_TACTICAL', 'Tactical Equipment & Gear', 'defence', false, NULL, 'Field gear, personal protection equipment, communications, and optics.'),
  ('TAG_DEF_AVIONICS', 'Avionics & C4I Systems', 'defence', false, NULL, 'Command, control, communications, computers, and radar subsystems.'),
  ('TAG_DEF_ARMOR', 'Protection & Armor Materials', 'defence', false, NULL, 'Composite armor plating, vehicle protection panels, and ballistic shielding.'),
  -- Finance Domain
  ('TAG_FIN_CURRENCY', 'FX & Currency Hedge', 'finance', false, NULL, 'Foreign exchange spot rates, forward contracts, and currency risk management.'),
  ('TAG_FIN_ESCROW', 'Escrow & Milestone Payment', 'finance', false, NULL, 'Milestone-based escrow holds, letter of credit contracts, and drawdowns.'),
  ('TAG_FIN_CREDIT', 'Credit Facility & Trade Finance', 'finance', false, NULL, 'Working capital facilities, trade insurance, and supplier credit lines.')
ON CONFLICT (code) DO UPDATE
SET label = EXCLUDED.label, domain_code = EXCLUDED.domain_code;

-- 3. EXCHANGE RATES (Identity & FX Currency Pairs)
INSERT INTO public.exchange_rates (base_currency, quote_currency, rate, rate_date, source)
VALUES
  ('ILS', 'ILS', 1.000000, CURRENT_DATE, 'Bank of Israel Identity'),
  ('USD', 'USD', 1.000000, CURRENT_DATE, 'Federal Reserve Identity'),
  ('EUR', 'EUR', 1.000000, CURRENT_DATE, 'ECB Identity'),
  ('USD', 'ILS', 3.650000, CURRENT_DATE, 'Bank of Israel Official'),
  ('ILS', 'USD', 0.273973, CURRENT_DATE, 'Bank of Israel Official Inverse'),
  ('EUR', 'ILS', 3.980000, CURRENT_DATE, 'Bank of Israel Official'),
  ('ILS', 'EUR', 0.251256, CURRENT_DATE, 'Bank of Israel Official Inverse'),
  ('USD', 'EUR', 0.917085, CURRENT_DATE, 'ECB Cross Rate');

-- 4. COUNTERPARTIES (AGN Ltd Primary Counterparty)
INSERT INTO public.counterparties (customer_account_id, name, kind_code, is_active, attributes)
SELECT 
  ca.id,
  'AGN Ltd',
  'ORGANIZATION',
  true,
  jsonb_build_object(
    'corporate_id', '516000111',
    'headquarters', 'Tel Aviv, Israel',
    'contact_email', 'governance@agn.co.il',
    'is_platform_operator', true
  )
FROM public.customer_accounts ca
WHERE ca.company_name = 'AGN Ltd'
LIMIT 1;

-- 5. TEAMS (AGN Tenant Operational Teams)
INSERT INTO public.teams (customer_account_id, name, parent_id, attributes)
SELECT 
  ca.id,
  'Executive & Governance',
  NULL,
  jsonb_build_object('code', 'TEAM_EXEC', 'department', 'Governance', 'is_core', true)
FROM public.customer_accounts ca
WHERE ca.company_name = 'AGN Ltd'
LIMIT 1;

INSERT INTO public.teams (customer_account_id, name, parent_id, attributes)
SELECT 
  ca.id,
  'Commercial & Procurement',
  (SELECT t.id FROM public.teams t JOIN public.customer_accounts ca2 ON t.customer_account_id = ca2.id WHERE ca2.company_name = 'AGN Ltd' AND t.name = 'Executive & Governance' LIMIT 1),
  jsonb_build_object('code', 'TEAM_COMM', 'department', 'Procurement', 'is_core', true)
FROM public.customer_accounts ca
WHERE ca.company_name = 'AGN Ltd'
LIMIT 1;

INSERT INTO public.teams (customer_account_id, name, parent_id, attributes)
SELECT 
  ca.id,
  'Operations & Engineering',
  (SELECT t.id FROM public.teams t JOIN public.customer_accounts ca2 ON t.customer_account_id = ca2.id WHERE ca2.company_name = 'AGN Ltd' AND t.name = 'Executive & Governance' LIMIT 1),
  jsonb_build_object('code', 'TEAM_OPS', 'department', 'Engineering', 'is_core', true)
FROM public.customer_accounts ca
WHERE ca.company_name = 'AGN Ltd'
LIMIT 1;

INSERT INTO public.teams (customer_account_id, name, parent_id, attributes)
SELECT 
  ca.id,
  'Finance & Compliance',
  (SELECT t.id FROM public.teams t JOIN public.customer_accounts ca2 ON t.customer_account_id = ca2.id WHERE ca2.company_name = 'AGN Ltd' AND t.name = 'Executive & Governance' LIMIT 1),
  jsonb_build_object('code', 'TEAM_FIN', 'department', 'Finance', 'is_core', true)
FROM public.customer_accounts ca
WHERE ca.company_name = 'AGN Ltd'
LIMIT 1;
