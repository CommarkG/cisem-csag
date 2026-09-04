# CISEM · FRICTIONLESS COMMUNICATION HUB SPECIFICATION & BUILDER RESPONSE
Document: `cisem_core/planning/2026-09-04__AntigravityLocal__YarivGovernor__CommunicationHubSpecificationAndResponse__V1.0.md`
Ratified Base: `AGENTS.md` Position 1
Author: Antigravity (Senior Builder)
Authority: Yariv, Governor of CISEM CsAg
Reviewer: Claude

---

## 1. THE CORE TEST ANSWER (MANDATORY RULE ONE GATE)

### WHICH OF THE FOUR CORE ITEMS DOES THIS SPECIFICATION SERVE?
- **Core Items Served**:
  1. `ITEM 1: ONBOARDING` (Part Six Recognition: Known/Dormant/New Company, Capacity check).
  2. `ITEM 3: QUOTE TO WORK ORDER` (Part Three Question Taxonomy, Part Four Intake Flow, Part Five Progressive Disclosure).
  3. `ITEM 4: THE SCREENS FOR THOSE THREE` (Part Four Conversational UI Order: Listen -> Mirror -> Ask One -> Offer Exit -> Checklist).
- **Core Test Verdict**: **`CORE`**. It dictates the foundational human interaction spine for all 3 core platform engines.

---

## 2. ARCHITECTURAL ANALYSIS & BENCHMARK ATTACK BY PART

### PART THREE · THE THREE QUESTION KINDS (DERIVED, BACKSTAGE, ASKED)
- **Builder Consensus**: **100% SOUND AND APPROVED.**
- **Relational Database Carrier (`cr_derived_field_resolvers`)**:
  - Requires a metadata registry `public.cr_derived_field_resolvers` mapping UI field keys to database RPCs/queries.
  - When rendering any intake screen, the frontend executes `SELECT public.resolve_derived_fields(p_tenant_id, p_account_id, p_session_context)`.
  - Fields returning non-null values are auto-populated as `DERIVED` chips and never reach the human as questions.

### PART SIX · RECOGNITION & SECURITY PROTECTION FOR DOMAIN MATCHING
- **Vulnerability Identified in Draft V1**:
  - Draft V1 states: *"NEW PERSON AT A KNOWN COMPANY — matched on what follows the @"*.
  - *Security Defect*: Matching solely on email domain (e.g. `@gmail.com`, `@yahoo.com`, or shared workspace domains like `@wework.com`) would accidentally attach a private individual to a corporate account, exposing confidential B2B contract pricing!
- **Mechanical Resolution**:
  - Domain matching MUST require `customer_accounts.domain = p_domain` AND enforce `p_domain NOT IN (SELECT domain FROM public.cr_public_domains)`.
  - Generic email domains proceed to the `GENERIC EMAIL` branch, preventing unauthorized corporate pricing leakage.

### PART SEVEN & PART NINE UNRULED ITEM 1 · CAPACITY RESOLUTION
- **Unruled Question**: *"Where Capacity lives: A flag on the inquiry, a separate personal counterparty, or a payer distinct from the contact."*
- **Senior Builder Resolution**:
  - **Capacity lives as `capacity_code` ON THE TRANSACTION ROW (`public.inquiries.capacity_code` & `public.quotes.capacity_code`)**, referencing `public.cr_account_capacities` (`'CORPORATE_CONTRACT'`, `'PERSONAL_PAYER'`).
  - *Why This Schema Choice Wins*:
    - Dana (`contacts` UUID `C-101`) has two `customer_accounts` links: `Harel Projects` (Corporate) and `Dana Personal` (Individual).
    - When Dana orders site signage for Harel, `inquiries.customer_account_id = Harel_UUID`, `inquiries.capacity_code = 'CORPORATE_CONTRACT'`.
    - When Dana orders a personal gift, `inquiries.customer_account_id = Dana_Personal_UUID`, `inquiries.capacity_code = 'PERSONAL_PAYER'`.
    - **Zero duplicate contact entities required!** It is a single foreign key on the document row.

### PART NINE · RESOLUTIONS TO UNRULED ITEMS 2, 3, & 4
- **Unruled Item 2 (Dormancy Line)**: Set as a database configuration row `cr_platform_settings.dormancy_threshold_days` (default `180 days`).
- **Unruled Item 3 (Question Tolerance)**: Tracked via telemetry columns `inquiries.questions_asked_count` and `inquiries.exit_offered_at_step`. If `questions_asked_count >= 3`, a sticky floating "Request Quote Now" action bar is rendered.
- **Unruled Item 4 (Empirical Testing)**: Will be validated using `admin-journey-simulator` skill scripts running 100 simulated customer intake flows.

---

## 3. PROPOSED DDL SCHEMA FOR COMMUNICATION HUB (CARRIER TABLES)

```sql
-- 1. Account Capacities Allowlist
CREATE TABLE IF NOT EXISTS public.cr_account_capacities (
    capacity_code VARCHAR(32) PRIMARY KEY,
    display_name VARCHAR(64) NOT NULL,
    description TEXT NOT NULL
);

INSERT INTO public.cr_account_capacities (capacity_code, display_name, description) VALUES
('CORPORATE_CONTRACT', 'Corporate / Company Account', 'Transaction conducted on behalf of registered corporate entity using contract rates'),
('PERSONAL_PAYER', 'Personal / Individual Payer', 'Transaction conducted as an individual private payer with standard list pricing')
ON CONFLICT (capacity_code) DO NOTHING;

-- 2. Public Email Domains Exclude List
CREATE TABLE IF NOT EXISTS public.cr_public_domains (
    domain VARCHAR(128) PRIMARY KEY,
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.cr_public_domains (domain) VALUES
('gmail.com'), ('yahoo.com'), ('hotmail.com'), ('outlook.com'), ('icloud.com')
ON CONFLICT (domain) DO NOTHING;

-- 3. Derived Field Resolvers Registry
CREATE TABLE IF NOT EXISTS public.cr_derived_field_resolvers (
    field_key VARCHAR(64) PRIMARY KEY,
    source_table VARCHAR(64) NOT NULL,
    source_column VARCHAR(64) NOT NULL,
    resolver_rpc VARCHAR(64) NOT NULL
);
```

---

## 4. LOCAL FILE DOWNLOAD LINKS

- [CommunicationHubSpecificationAndResponse V1.0](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/planning/2026-09-04__AntigravityLocal__YarivGovernor__CommunicationHubSpecificationAndResponse__V1.0.md)
- [Download Local MD File](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/downloads/2026-09-04__AntigravityLocal__YarivGovernor__CommunicationHubSpecificationAndResponse__V1.0.md)
