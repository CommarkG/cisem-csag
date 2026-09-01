# Onboarding Wizard Step One: Identity & Archetype Selection Schema Specification
Target: cisem_core/planning/2026-09-01__AntigravityLocal__YarivGovernor__OnboardingWizardStepOneSchema__V1.0.md
Authority: Governor Yariv / Reviewer Claude / Antigravity
Version: 1.0
Status: RATIFIED DRAFT FOR REVIEWER DUAL-PASS CHECK

---

## 1. PURPOSE & STEP ONE SCOPE

1.1. **Objective**:
- Defines the exact DDL schema changes and tables required to support **A5 Onboarding Wizard Step One: Identity & Archetype Selection**.

1.2. **Step One Business Scope**:
- Captures company identity: `company_name`, `tax_id`, `primary_contact_name`, `cell_number`, `email`, `country`, `currency` (`ILS`/`USD`/`EUR`).
- Presents plain language archetype questions allowing multi-selection:
  1. `"Do you hold stock?"` (`STK`)
  2. `"Do you make things to order?"` (`MTO`)
  3. `"Do you perform work at customer sites?"` (`SRV`)
  4. `"Do you deliver digitally?"` (`DIG`)
- Writes company details to `public.customer_accounts` (`settings` JSONB for contact/currency details) and records assigned service models in junction table `public.tenant_service_models`.

---

## 2. MODULAR SQL PIECES FOR REVIEWER DUAL-PASS CHECK

### PIECE 1: CREATE PLATFORM TABLE `public.cr_service_models` & SEED 4 ARCHETYPES

```sql
-- Create platform lookup table for service models (archetypes)
CREATE TABLE public.cr_service_models (
    code VARCHAR(20) PRIMARY KEY,
    label TEXT NOT NULL,
    plain_question TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS and grant read access
ALTER TABLE public.cr_service_models ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_cr_service_models_select ON public.cr_service_models FOR SELECT USING (true);

-- Seed 4 Archetypes with Plain Language Questions
INSERT INTO public.cr_service_models (code, label, plain_question, description, sort_order) VALUES
('STK', 'Stock Wholesale', 'Do you hold stock?', 'Inventory holding and stock-backed sales', 1),
('MTO', 'Make to Order', 'Do you make things to order?', 'Custom manufacturing, engraving, and production', 2),
('SRV', 'Field Services', 'Do you perform work at customer sites?', 'Sub-contracting, contracting, and site work', 3),
('DIG', 'Digital Products', 'Do you deliver digitally?', 'Software, apps, and digital delivery', 4);
```

---

### PIECE 2: CREATE JUNCTION TABLE `public.tenant_service_models`

```sql
-- Create tenant service models junction table
CREATE TABLE public.tenant_service_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_account_id UUID NOT NULL REFERENCES public.customer_accounts(id) ON DELETE CASCADE,
    service_model_code VARCHAR(20) NOT NULL REFERENCES public.cr_service_models(code) ON UPDATE CASCADE ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tenant_service_model UNIQUE (customer_account_id, service_model_code)
);

-- Index for fast tenant service model lookups
CREATE INDEX idx_tenant_service_models_lookup ON public.tenant_service_models(customer_account_id, service_model_code);

-- Enable RLS and grant tenant access
ALTER TABLE public.tenant_service_models ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_tenant_service_models_tenant ON public.tenant_service_models 
FOR ALL USING (customer_account_id = (SELECT get_active_tenant_id()));
```

---

## 3. MANDATORY DERIVED LIST (EXISTS VS CREATES)

3.1. **SECTION 1: EXISTS**:
- `public.customer_accounts` `[DATABASE-CHANNEL]` (Existing live table with columns `id`, `company_name`, `tax_id`, `industry`, `credit_terms`, `account_type`, `package_id`, `settings`, `brand_assets`, `created_at`).

3.2. **SECTION 2: CREATES**:
- `public.cr_service_models` Table + RLS + 4 Seed Rows `[NEW PLATFORM TABLE]`.
- `public.tenant_service_models` Junction Table + RLS + Index `[NEW JUNCTION TABLE]`.

---

## 4. THREE-LINE REACH ANALYSIS

4.1. **Where Else This Applies**:
- Tenant provisioning, onboarding wizard UI components, feature entitlement engine, and quote builder defaults across Stage 0 and Stage 1.

4.2. **Where It Looks Like It Applies And Does Not (And Why)**:
- **Individual User Account Roles (`user_account_roles`)**.
- *Technical Rationale*: Service model archetypes (`STK`, `MTO`, `SRV`, `DIG`) define tenant business capability profiles, NOT individual user security roles. User security permissions continue to be managed separately in `user_account_roles`.

4.3. **The One Place It Would Most Change If Applied**:
- **A5 Onboarding Wizard Component (`src/components/onboarding/StepOneIdentity.tsx`)**.
- *Technical Rationale*: Dynamically renders plain-language questions, binds selections to `tenant_service_models`, and saves customer contact details cleanly to `customer_accounts`.
