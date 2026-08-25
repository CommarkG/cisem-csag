---
metadata:
  owner: "CISEM_GOVERNOR"
  canonical_location: "C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\cisem_core\\planning\\2026-08-24__AntigravityLocal__YarivGovernor__Backend_Authorization_and_Tenant_Isolation_Plan__V1.0.md"
  artifact_status: "DRAFT"
  maturity: "WORKING_DRAFT"
  version: "1.0"
  plan_id: "CISEM-IP-20260824-BACKEND-AUTHORIZATION-ISOLATION"
  governor_signature: "UNRATIFIED-DRAFT-IN-PROGRESS"
  axioms_linked:
    - "AX-10000"
    - "AX-20000"
    - "AX-TENANT-01"
    - "PR-13900"
    - "PR-13950"
  related_implementation_adapter: "GOOGLE_ANTIGRAVITY_ADAPTER"
  local_edits_allowed: true
  role_type: "CANONICAL_IMPLEMENTATION_PLAN"
---

# Backend Authorization and Tenant Isolation Hardening Plan

1.1. **Goal Description & Background**:
This design plan hardens backend API route authorization across the Cisem CsAg platform and remediates un-scoped service key (`SUPABASE_KEY`) usage in background daemons. It establishes mandatory server-side `TenantContext` + `RoleContext` dependency injections, eliminates silent fallback responses on missing authentication, and re-proves database-level tenant isolation under modified route flows.

---

## User Review Required

> [!IMPORTANT]
> **Refusal Behavior Standard**: Silent fallback to `tenant_demo` or empty array responses (`[]`) on missing authentication will be strictly removed. All 44 tenant data routes will return explicit HTTP `401 Unauthorized` or HTTP `403 Forbidden` responses when authentication or authorization fails.

> [!WARNING]
> **Stage 5 Re-Proof Obligation**: Route changes MUST NOT break existing database RLS policies. The five cross-tenant refusal attempts (`Stage5_Five_Cross_Tenant_Proofs__V1.0.sql`) must be re-executed and verified cleanly after route refactoring before promotion.

---

## Open Questions

> [!NOTE]
> **Question 1**: Should public proposals (`/api/v1/proposals/{token}`) continue executing via guest token parameters, or migrate to cryptographically signed temporary participant JWTs?

---

## Proposed Changes

### Scope Metric & Target File List

#### [QUANTIFIED SCOPE]
- **Total FastAPI Routes Audited:** 52 routes.
- **Auditing Command:** `grep_search` with Query `^@app\.(get|post|put|delete|patch)` on `backend/src/backend/main.py`.
- **Tenant Data Routes in Scope:** 44 routes.
- **Public / Infrastructure Routes Exempt:** 8 routes (`/`, `/api/v1/health`, `/api/v1/auth/webhook/signup`, `/api/v1/proposals/{token}`, `/api/v1/stock/live-check`, `/api/v1/admin/pending-claims`, `/api/v1/admin/pending-claims/resolve`, `/api/v1/cael/ratify`).

#### [AUTHORIZED FILE LIST]
- #### [MODIFY] [main.py](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/main.py)
- #### [MODIFY] [cisem_db.py](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/security/cisem_db.py)
- #### [MODIFY] [UserTenantClaimBackfill__V1.1.py](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/2026-08-14__CisemCsAg__Backend__UserTenantClaimBackfill__V1.1.py)
- #### [MODIFY] [cisem_gate.py](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/platform_core/cisem_gate.py)
- #### [NEW] [tenant_security_middleware.py](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/tenant_security_middleware.py)
- #### [NEW] [client_role_transformer.py](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/client_role_transformer.py)

#### [EXPLICIT UN-AUTHORIZED LIST]
- `src/components/views/*` (No frontend UI modifications authorized in this plan).
- `backend/src/backend/migrations.sql` (No database schema alterations authorized in this plan).

---

### Core Components & Mandated Mechanisms

#### Component 1: Route Security Middleware & DTO Transformer
- Implement `TenantSecurityMiddleware` in [`backend/src/backend/tenant_security_middleware.py`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/tenant_security_middleware.py) to parse JWT `TenantContext` and inject `request.state.tenant_context`.
- Implement `ClientRoleTransformer` in [`backend/src/backend/client_role_transformer.py`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/client_role_transformer.py) to strip internal margins, private notes, and admin metrics when `role_code == 'client'`.

#### Component 2: Service-Role Key Remediation
- Refactor `call_rpc` in [`cisem_core/security/cisem_db.py`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/security/cisem_db.py) to replace un-scoped `SUPABASE_KEY` with scoped `TenantContext` tokens.
- Refactor whitelabel config route in [`backend/src/backend/main.py`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/main.py) and claim backfill daemon in [`backend/src/backend/2026-08-14__CisemCsAg__Backend__UserTenantClaimBackfill__V1.1.py`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/2026-08-14__CisemCsAg__Backend__UserTenantClaimBackfill__V1.1.py) to isolate table writes under tenant role context.

#### Component 3: Gate AST Route Linter & Incremental Pass Protocol
- Commit AST Linter rule to [`cisem_core/platform_core/cisem_gate.py`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/platform_core/cisem_gate.py) as Phase 13.
- **Incremental Pass Strategy:** To prevent blocking 44 un-refactored routes on the first commit, Phase 13 inspects route signatures for either a verified `TenantContext` parameter OR a temporary header marker `ratified_plan: UNRATIFIED-DRAFT-IN-PROGRESS`. Routes carrying the draft marker permit local execution but hard-block pre-commit until fully refactored.

---

## Verification Plan

### Automated Tests
- Re-execute the five cross-tenant SQL refusal attempts:
  `psql -f cisem_core/planning/2026-08-23__AntigravityLocal__YarivGovernor__Stage5_Five_Cross_Tenant_Proofs__V1.0.sql`
- Run API route security integration tests:
  `python -m unittest backend/src/backend/tests/test_route_authorization.py`

### Stage-by-Stage Proof Criteria & Actors
1. **Stage 1 (Middleware & Route Wrapping):** 44 tenant data routes wrapped in `main.py`. Verified by AST Linter in [`cisem_gate.py`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/platform_core/cisem_gate.py) Phase 13. Actor: Google Antigravity Adapter.
2. **Stage 2 (Service Key Isolation):** `cisem_db.py` and claim backfill updated. Verified by static code inspection. Actor: Google Antigravity Adapter.
3. **Stage 3 (Isolation Re-Proof):** Stage 5 SQL cross-tenant refusal suite executed. Verified by Governor Yariv via test execution log. Actor: Governor Yariv.
