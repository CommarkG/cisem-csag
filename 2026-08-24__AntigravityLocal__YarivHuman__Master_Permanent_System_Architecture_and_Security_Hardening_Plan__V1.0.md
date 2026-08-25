# Master Implementation Plan: Permanent System Architecture & Security Hardening

This implementation plan outlines the structural, security, and governance refactorings required to eliminate polymorphic entity overloading, retire legacy HMAC header authentication paths, eliminate duplicate service-role clients, and enforce AST pre-commit schema validation.

## User Review Required

> [!IMPORTANT]
> **HMAC Header Path Retirement**: This plan retires `verify_tenant_context_py` and HMAC signature verification on the 3 `/api/v1/tenant/whitelabel` endpoints in `main.py`, repointing them to standard JWT request-scoped authentication (`request.state.tenant_id`).
> **`crm_customers` Database Migration**: Segregates CRM client records out of `customer_accounts` into a dedicated `crm_customers` table carrying a `tenant_id` foreign key and Postgres RLS policies.
> **Service-Role Client Purge**: Deletes `_global_supabase` at `L88`/`L91` in `main.py`, repointing signup/provisioning hooks to `supabase_admin` and renaming `provisioning.py` parameter `supabase_anon` to `supabase_admin`.

## Open Questions

> [!NOTE]
> 1. Should `crm_customers` migration backfill existing `CRM_CLIENT` seed rows into `crm_customers` automatically during table creation?
> 2. Should `GET /api/v1/admin/pending-claims` be restricted to callers possessing `request.state.role == "platform_admin"`?

---

## Proposed Changes

### Backend Control Plane

#### [MODIFY] [main.py](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/main.py)
- Delete `_global_supabase` singleton client declarations at lines 88 and 91.
- Repoint truthiness checks (`L175`, `L253`, `L687`, `L714`, `L1309`) and provisioning calls (`L257`, `L690`, `L700`) to `supabase_admin`.
- Retire `verify_tenant_context_py` at `L527-L560` and repoint `/api/v1/tenant/whitelabel` endpoints (`L600`, `L605`, `L624`) to standard JWT tenant context (`request.state.tenant_id`).
- Add `request: Request` parameter and `platform_admin` role assertion to `get_pending_claims` at `L707`.
- Refactor `upload_customer_brand_assets` at `L1781` to target `crm_customers` table instead of `customer_accounts`.

---

### Backend Provisioning Engine

#### [MODIFY] [provisioning.py](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/provisioning.py)
- Rename parameter `supabase_anon` to `supabase_admin` in `provision_tenant()` signature (`L90`) and inner helper function calls (`L108`, `L109`).

---

### Database DDL Schema

#### [MODIFY] [migrations.sql](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/migrations.sql)
- Add DDL declaration for `crm_customers` table carrying a `tenant_id` foreign key referencing `customer_accounts(id)` and RLS tenant isolation policy `USING (tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid)`.

---

### Frontend Client Library

#### [MODIFY] [tenant_context.ts](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/lib/tenant_context.ts)
- Remove deprecated `TENANT_SIGNING_SECRET` reads and HMAC header signature construction in `verifyTenantContext`.

---

### Gate Enforcement Engine

#### [MODIFY] [cisem_gate.py](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/platform_core/cisem_gate.py)
- Add Phase 26 (`Schema Reality Gate`) to parse `.table("...")` AST string literals during `git commit` and verify existence against live DB schema.
- Add Phase 29 (`Plan-Scoped Commit Boundary Gate`) to verify untracked/staged files against active ratified implementation plan.

---

## Verification Plan

### Automated Tests
- Execute `python cisem_core/platform_core/cisem_gate.py` to verify pre-commit gate phases.
- Execute backend tests to verify route responses under JWT authentication.

### Manual Verification
- Test `GET /api/v1/tenant/whitelabel` with valid JWT to confirm proper tenant state resolution.
- Verify `crm_customers` RLS policy in Postgres context.
