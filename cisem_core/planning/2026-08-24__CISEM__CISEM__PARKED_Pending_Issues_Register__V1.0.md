# CISEM · PARKED PENDING ISSUES REGISTER (MIRROWED REPOSITORY REGISTER)
**Filename**: `2026-08-24__CISEM__CISEM__PARKED_Pending_Issues_Register__V1.0.md`  
**Active Version**: `Version 1.0`  
**Ratified Context**: Universal pipeline as internal core of CISEM; tenant details isolated strictly under external tenant configuration (`PR-11100`).

---

## 0. BLOCKING ITEMS (MUST LAND BEFORE CYCLE EXECUTION)

### B1 · Tenant Identifier Token Signature Binding (PR-11100)
- **What it is**: Cryptographic binding of tenant context inside JWT tokens to prevent foreign tenant ID forgery.
- **Established Fact**: JWT payload signature verified by ES256/JWKS, but `tenant_id` claim is carried without HMAC secret binding to user membership.
- **Decided By**: Governor Yariv (2026-08-24).
- **Open Item**: Add `tenant_signature = HMAC_SHA256(user_id + ":" + tenant_id, SERVER_SECRET)` at token reissue; verify in `TenantSecurityMiddleware`.
- **Reopening Condition**: Before first multi-tenant CRUD route execution.
- **PR-38500 Escalation Dates**: Week 1: 2026-08-31 | Week 2: 2026-09-07 | Week 3: 2026-09-14
- **Vault Mapping**: New item `PARK-043` (Extends `PARK-018`).

### B2 · Cross-Tenant Isolation Regression Test (PR-11400)
- **What it is**: Single capable-of-failing integration test verifying cross-tenant access refusal.
- **Established Fact**: `find_by_name` confirms 0 formal integration test files exist in workspace.
- **Decided By**: Governor Yariv (2026-08-24).
- **Open Item**: Write `tests/test_tenant_isolation.py` testing HTTP `403/404` on cross-tenant GET.
- **Reopening Condition**: Before declaring VerticalSlice 1 API endpoints complete.
- **PR-38500 Escalation Dates**: Week 1: 2026-08-31 | Week 2: 2026-09-07 | Week 3: 2026-09-14
- **Vault Mapping**: New item `PARK-044` (Extends `PARK-001`).

---

## 1. CONSTITUTIONAL BREACHES (PARKED)

### P-01 · PR-101000 Reviewer Database Write Role Breach
- **Established**: `cisem_reviewer_ro` role created in PostgreSQL with 66 SELECT grants, 0 write grants.
- **Open**: Active connector still authenticates as superuser `postgres`.
- **Reopens**: Immediately upon next DB query.
- **PR-38500 Dates**: W1: 2026-08-31 | W2: 2026-09-07 | W3: 2026-09-14 | **Vault**: `PARK-045`

### P-02 · PR-94500 Nine Source Files Exceeding 350 Lines
- **Established**: Python scan confirms 13 files > 350 lines; `cisem_gate.py` (2,020 lines) and `main.py` (2,016 lines).
- **Open**: Requires Governor ruling on PR-102000 agent modification prohibition.
- **Reopens**: Upon Governor ruling on PR-102000.
- **PR-38500 Dates**: W1: 2026-08-31 | W2: 2026-09-07 | W3: 2026-09-14 | **Vault**: `PARK-046`

### P-03 · PR-11500 Flat String Statuses vs Validation Metrics
- **Established**: All status columns in PostgreSQL use flat strings.
- **Open**: Clarify scope between asset registry entries and DB data rows.
- **Reopens**: Before status vocabulary freeze.
- **PR-38500 Dates**: W1: 2026-08-31 | W2: 2026-09-07 | W3: 2026-09-14 | **Vault**: `PARK-047`

### P-04 · PR-11400 Full Regression Test Suite
- **Established**: 0 integration test suites exist.
- **Reopens**: When first route of active cycle is written.
- **PR-38500 Dates**: W1: 2026-08-31 | W2: 2026-09-07 | W3: 2026-09-14 | **Vault**: `PARK-048`

### P-05 · PR-58900 CisemAuditor Real Engine Implementation
- **Established**: `CisemAuditor.py` (859 lines) uses keyword substring matching.
- **Reopens**: VerticalSlice 2 (Auditing Automation).
- **PR-38500 Dates**: W1: 2026-08-31 | W2: 2026-09-07 | W3: 2026-09-14 | **Vault**: `PARK-010` (Duplicate)

### P-06 · PR-70300 External AI Consultant Layer
- **Established**: 5 external AI consultant placeholders exist in `cisem_core/platform_core/`, unused.
- **Reopens**: VerticalSlice 4 (External AI Integration).
- **PR-38500 Dates**: W1: 2026-08-31 | W2: 2026-09-07 | W3: 2026-09-14 | **Vault**: `PARK-012` (Duplicate)

### P-07 · PR-95000 3-Tier Context Boundaries
- **Established**: Unenforced context scoping led to mega-scope context drift.
- **Reopens**: Next VerticalSlice task packaging.
- **PR-38500 Dates**: W1: 2026-08-31 | W2: 2026-09-07 | W3: 2026-09-14 | **Vault**: `PARK-049`

### P-08 · PR-38500 Escalation Engine Unwired
- **Established**: `grep_search` on `cisem_gate.py` returns 0 hits for `PR-38500`.
- **Reopens**: VerticalSlice 2 (Parking Vault Automation).
- **PR-38500 Dates**: W1: 2026-08-31 | W2: 2026-09-07 | W3: 2026-09-14 | **Vault**: `PARK-011` (Duplicate)

### P-09 · PR-83500 Pondering Pause Engine Unwired
- **Established**: `grep_search` on `cisem_gate.py` returns 0 hits for `PR-83500`.
- **Reopens**: VerticalSlice 2 (Plan Exit Controls).
- **PR-38500 Dates**: W1: 2026-08-31 | W2: 2026-09-07 | W3: 2026-09-14 | **Vault**: `PARK-004` (Duplicate)

### P-10 · PR-84800 Retrospective Alignment Protocol
- **Established**: Prevention rules land forward-only without backward sweep.
- **Reopens**: Next Pondering Pause.
- **PR-38500 Dates**: W1: 2026-08-31 | W2: 2026-09-07 | W3: 2026-09-14 | **Vault**: `PARK-050`

---

## 2. THE GATE (PARKED AS A WHOLE)

### P-11 · Gate Invocation Absence
- **Established**: 0 git pre-commit hooks exist in `.git/hooks/`.
- **Reopens**: On Governor directive.
- **PR-38500 Dates**: W1: 2026-08-31 | W2: 2026-09-07 | W3: 2026-09-14 | **Vault**: `PARK-007` (Duplicate)

### P-12 · The Harvest Refactoring (Items A-G)
- **Established**: Governor parked 7 gate refactoring items to prioritize VerticalSlice 1 code.
- **Reopens**: With P-11.
- **PR-38500 Dates**: W1: 2026-08-31 | W2: 2026-09-07 | W3: 2026-09-14 | **Vault**: `PARK-007` (Duplicate)

### P-13 · Plan A Remaining Gate Coverage
- **Established**: Typed EXISTENCE block and DDL ALTER/DROP policy checks unbuilt.
- **Reopens**: First plan proposing schema changes.
- **PR-38500 Dates**: W1: 2026-08-31 | W2: 2026-09-07 | W3: 2026-09-14 | **Vault**: `PARK-051`

### P-14 · Plan B Database Audit Side & Event Triggers
- **Established**: 16 custom functions in `public` schema unmapped to repository.
- **Reopens**: First schema change outside plan.
- **PR-38500 Dates**: W1: 2026-08-31 | W2: 2026-09-07 | W3: 2026-09-14 | **Vault**: `PARK-052`

### P-15 · Withdrawn Gate Proposals
- **Established**: Gate heartbeat, stored baseline snapshot, and in-memory HS256 tokens withdrawn.
- **Reopens**: Permanently withdrawn.
- **PR-38500 Dates**: W1: 2026-08-31 | W2: 2026-09-07 | W3: 2026-09-14 | **Vault**: `PARK-053`

---

## 3. CURRENT CYCLE PARKED ITEMS (P-16 THROUGH P-25)
- **P-16**: 44 Permissionless Routes | Reopens: Route security cycle | Vault: `PARK-054`
- **P-17**: Frontend Global Member List Leak | Reopens: UI routing cycle | Vault: `PARK-055`
- **P-18**: Multi-Tenant Switching Token Reissue | Reopens: Post-B1 landing | Vault: `PARK-018` (Duplicate)
- **P-19**: Missing Tables (`work_orders`, `acceptance_records`, `evidence_kinds`) | Reopens: VerticalSlice 1 plan | Vault: `PARK-056`
- **P-20**: Database Default Mismatches (`status_code`, `currency`) | Reopens: VerticalSlice 1 migration | Vault: `PARK-057`
- **P-21**: Unwired State Transitions | Reopens: VerticalSlice 1 route wiring | Vault: `PARK-058`
- **P-22**: Missing Storage Buckets & Policies | Reopens: File attachment feature | Vault: `PARK-059`
- **P-23**: Empty Navigation Menu & Feature Registry | Reopens: Tenant onboarding cycle | Vault: `PARK-060`
- **P-24**: 7 Missing Tables in Proposal Flow | Reopens: Advanced proposal cycle | Vault: `PARK-061`
- **P-25**: Missing Tenant Column in `state_transitions` | Reopens: Custom lifecycle cycle | Vault: `PARK-062`

---

## 4. CARRIED ITEMS WITH GOVERNOR RULING (P-26 THROUGH P-33)
- **P-26**: 7 Uncommitted Artifacts & 19 Plan Versions | Reopens: Handoff commit | Vault: `PARK-063`
- **P-27**: Enterprise Blueprint Unratified Signature | Reopens: Governor signature turn | Vault: `PARK-064`
- **P-28**: `GEMINI_API_KEY` Rotation | Reopens: Key rotation audit | Vault: `PARK-065`
- **P-29**: Legacy Supabase Keys Deprecation | Reopens: ES256 JWKS config update | Vault: `PARK-066`
- **P-30**: Unconstrained Tenant Account Types | Reopens: Tenant type validation | Vault: `PARK-067`
- **P-31**: Per-Tenant Contact Method Isolation | Reopens: Identity profile design | Vault: `PARK-068`
- **P-32**: `team_closure` Maintenance Defect | Reopens: Org hierarchy refactor | Vault: `PARK-069`
- **P-33**: `SENTINEL PROVISION_TENANT V2` Unversioned DB Function | Reopens: DB migration ledger audit | Vault: `PARK-070`

---

## 5. DESIGN DECISIONS RATIFIED AND UNBUILT (P-34 THROUGH P-52)
- **P-34**: Document Numbering Engine & Atomic Counters | Vault: `PARK-071`
- **P-35**: Document Sealing & Lineage Spine | Vault: `PARK-072`
- **P-36**: Person Weight vs Signing Authority | Vault: `PARK-073`
- **P-37**: Person-to-Person Typed Relationship Graph | Vault: `PARK-074`
- **P-38**: Identity Numbers & Dated VAT Status | Vault: `PARK-075`
- **P-39**: Israeli Allocation Numbers (SHA-256 Queue) | Vault: `PARK-076`
- **P-40**: Product Identity & Supplier Mapping | Vault: `PARK-077`
- **P-41**: Fail-Closed Margin Calculation | Vault: `PARK-078`
- **P-42**: Single-Screen Pre-Send Validation Check | Vault: `PARK-079`
- **P-43**: Template Variable Substitution Engine | Vault: `PARK-080`
- **P-44**: User Preferences & Saved Views Storage | Vault: `PARK-081`
- **P-45**: Address & Postal Dataset Licensing Engine | Vault: `PARK-082`
- **P-46**: Cold Review Multi-Pass Mechanism | Vault: `PARK-083`
- **P-47**: Platform Review Email Reporting Pipeline | Vault: `PARK-084`
- **P-48**: Third Reader Claim Verification Subagent | Vault: `PARK-085`
- **P-49**: Multi-Brand Issuance & Letterhead Defaults | Vault: `PARK-086`
- **P-50**: Intercompany Profit Split Templates | Vault: `PARK-087`
- **P-51**: White-Label Tier Reselling Boundaries | Vault: `PARK-088`
- **P-52**: Israeli Accounting & Post-Dated Cheque Drawer | Vault: `PARK-089`
