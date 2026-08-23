-- =============================================================================
-- CISEM Mandatory Code Header
-- File           : 2026-08-23__AntigravityLocal__YarivGovernor__Stage5_Five_Cross_Tenant_Proofs__V1.0.sql
-- Ratified Plan  : CISEM-IP-20260822-PEOPLE-PLACES-FILES V19 (Stage 5 Verification)
-- Architectural  : Five cross-tenant proof statements executed by the Governor under SET LOCAL ROLE authenticated
--                  and SET LOCAL "request.jwt.claims" within a transaction block that is explicitly ROLLED BACK.
--                  Populated with real test tenant/user UUIDs handed by Governor/Reviewer.
-- Axioms         : AX-SECURITY-01, AX-STATELESS-01, U1.2.40
-- =============================================================================

BEGIN;

-- Setup test session context as an ordinary authenticated user (NOT superuser/owner)
SET LOCAL ROLE authenticated;
-- Authenticated session context for USER_A (owner.alpha) under TENANT_A (Test Tenant Alpha)
SET LOCAL "request.jwt.claims" = '{"sub": "e9336449-6b9a-4b8f-97ee-e02296dfd0e4", "app_metadata": {"active_tenant_id": "caa00faa-9737-44d3-8d2f-5636297367be"}}';

-- PROOF 1: Writing into another tenant (Must fail WITH CHECK / RLS violation)
-- Attempt to insert a contact into Tenant_B (Test Tenant Beta) while active verified tenant is Tenant_A (Test Tenant Alpha)
-- EXPECTED OUTCOME: ERROR 42501 (new row violates row-level security policy for table "contacts")
INSERT INTO public.contacts (customer_account_id, name, email)
VALUES ('ad27aa1a-7256-486f-9bcc-15b4131e291f'::uuid, 'Unauthorized Person', 'unauthorized@example.com');

-- PROOF 2: Reading another tenant (Must return 0 rows)
-- Attempt to select contacts belonging to Tenant_B (Test Tenant Beta) while active tenant is Tenant_A (Test Tenant Alpha)
-- EXPECTED OUTCOME: 0 rows returned
SELECT * FROM public.contacts
WHERE customer_account_id = 'ad27aa1a-7256-486f-9bcc-15b4131e291f'::uuid;

-- PROOF 3: Rewriting platform reference data (Must fail for non-platform-admin)
-- Attempt to modify a role definition without carrying platform_admin role
-- EXPECTED OUTCOME: ERROR 42501 (row-level security policy violation)
UPDATE public.role_definitions
SET description = 'Hacked description'
WHERE code = 'member';

-- PROOF 4: Publishing a shared row with NULL tenant (Must fail NOT NULL schema check)
-- Attempt to insert a contact with NULL tenant ID
-- EXPECTED OUTCOME: ERROR 23502 (null value in column "customer_account_id" violates not-null constraint)
INSERT INTO public.contacts (customer_account_id, name, email)
VALUES (NULL, 'Null Tenant Person', 'null@example.com');

-- PROOF 5: Deleting another tenant (Must return 0 rows deleted)
-- Attempt to delete Tenant_B account while authenticated as Tenant_A
-- EXPECTED OUTCOME: 0 rows deleted
DELETE FROM public.customer_accounts
WHERE id = 'ad27aa1a-7256-486f-9bcc-15b4131e291f'::uuid;

-- Always roll back testing transaction to leave live data completely untouched
ROLLBACK;
