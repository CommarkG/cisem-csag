# PLAN: Repository Gate Hardening and Hook Wiring V1.0

---
metadata:
  owner: "CISEM_GOVERNOR"
  canonical_location: "cisem_core/planning/2026-08-24__AntigravityLocal__YarivGovernor__PLAN_Repository_Gate_Hardening_and_Hook_Wiring__V1.0.md"
  artifact_status: "DRAFT"
  pre_review_status: "PENDING"
  maturity: "WORKING_DRAFT"
  version: "1.0"
  created_at: "2026-08-24T00:30:00Z"
  authors: ["GOOGLE_ANTIGRAVITY_ADAPTER", "CISEM_REVIEWER_CLAUDE"]
---

## EXISTENCE

- `cisem_core/planning/2026-08-24__AntigravityLocal__YarivGovernor__PLAN_Repository_Gate_Hardening_and_Hook_Wiring__V1.0.md` · Checked via `grep_search` on 2026-08-24 · NONE FOUND
- `cisem_core/schema/2026-08-24__CISEM__LiveDatabaseFunctions__V1.0.sql` · Checked via `grep_search` on 2026-08-24 · NONE FOUND
- `cisem_core/archive/2026-08-24_retired_audit_machinery/` · Checked via `grep_search` on 2026-08-24 · NONE FOUND
- `.githooks/pre-commit` · Checked via `grep_search` on 2026-08-24 · NONE FOUND

---

## 1. Goal Description & Background

This plan specifies **Plan A: Repository Gate Hardening and Hook Wiring**. It resolves client-side gate invocation, hardens Phase 16 DDL line-by-line diff scanning, extracts the 16 non-extension custom PostgreSQL functions to establish a zero-drift baseline, and archives retired audit machinery.

---

## 2. Honest Infrastructure, Capability & Dated Risk Disclosures

### 2.1. Honest Infrastructure Disclosure
Plan A operates without a remote server runner or CI/CD workflow, delivering local pre-commit hook enforcement on one active developer machine via `git config core.hooksPath .githooks`. Because client-side git hooks do not clone automatically and can be bypassed locally using `git commit --no-verify`, Plan A does not deliver an un-bypassable remote security boundary. It delivers automated local developer discipline: ensuring clean DDL diff parsing, verifying plan ingestion, and blocking hardcoded secret fallbacks before commits leave the local environment.

### 2.2. Unhooked-Machine Detector Circularity Limit & Terminal Committer Warning
An environment check script (`verify_environment.py`) checking `git config core.hooksPath` CANNOT be invoked from `cisem_gate.py`, because on an unhooked machine the pre-commit gate never runs. It is invoked from application startup scripts (`main.py` / `npm run dev`) and reports status to the terminal console. A developer who commits from a terminal without ever starting the application will never see the unhooked-machine warning, so the entire local enforcement rests on one command typed once after cloning, which nothing reminds anyone to run.

### 2.3. Dated Risk: Unwatched Live Database (2026-08-24)
While Plan A is being built and until Plan B lands, the live database is unwatched—anything executed in the Supabase SQL Editor or via direct psql connection is invisible to every mechanism in this project.

---

## 3. Implementation Sequence & Non-Coverage Scope Bounds

### 3.1. Execution Sequence
To prevent locking the repository on day one, execution MUST proceed in this exact sequence:

1. **Step 1: Fix Phase 16 Diff Parser First (Code Edit):**
   Update FILE [`cisem_core/platform_core/cisem_gate.py:1349–1390`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/platform_core/cisem_gate.py#L1349-L1390) to inspect ONLY added diff lines (`git diff -U0 --cached <file>`), NOT whole-file contents (`f.read()`). This prevents Phase 16 from flagging the 66 pre-existing tables when modifying [`backend/src/backend/migrations.sql`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/migrations.sql#L1).
2. **Step 2: Extract & Commit 16 Non-Extension Custom Functions:**
   HANDED (Reviewer 2026-08-23): 218 functions in schema `public`, 198 owned by installed extensions (`deptype = 'e'`), 20 custom functions. Repository accounts for 4 functions. Extract the 16 missing non-extension custom functions (~13KB of DDL text) into FILE [`cisem_core/schema/2026-08-24__CISEM__LiveDatabaseFunctions__V1.0.sql`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/schema/) and commit them under a dedicated plan.
3. **Step 3: Install Git Hook LAST:**
   Create `.githooks/pre-commit` executing `python cisem_core/platform_core/cisem_gate.py` and run `git config core.hooksPath .githooks`. Switching the hook on before Step 1 would flag all 66 pre-existing tables on the first commit and lock the repository.

### 3.2. Explicit Non-Coverage Bounds (What Plan A Does NOT Cover)
Plan A explicitly does NOT cover:
- PostgreSQL DDL event triggers (`ddl_command_end` / `sql_drop`).
- Database schema changes executed directly inside the Supabase SQL Editor.
- Server-side git `pre-receive` hooks or remote CI/CD workflows.

---

## 4. Security & Secret Scanner Regression Guard

- **LINTER SCRIPT:** FILE [`cisem_core/security/2026-08-14__CisemCsAg__Security__SecretLiteralLinter__V1.1.py`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/security/2026-08-14__CisemCsAg__Security__SecretLiteralLinter__V1.1.py).
- **VERIFIED COMMAND:** `python cisem_core/security/2026-08-14__CisemCsAg__Security__SecretLiteralLinter__V1.1.py .`
- **EXCLUSIONS:** Excludes directories `.venv`, `node_modules`, `.git`, `dist`, `build`.
- **RESULT:** `0 findings across 184 files scanned.`
- **FUNCTION:** Serves as a preventative regression guard for future turns to block hardcoded API key fallbacks before commits leave the machine, rather than fixing an existing codebase finding.

---

## 5. Lifecycle Rulings & Archive Plan

1. **`E2_ApplyMigration`:** FILE [`cisem_core/platform_core/2026-08-14__CISEM__AntigravityLocal__E2_ApplyMigration__V1.0.py`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/platform_core/2026-08-14__CISEM__AntigravityLocal__E2_ApplyMigration__V1.0.py) is **RETIRED, NOT DELETED**. It holds the original definition of `_migration_ledger` and serves as Plan B's starting point.
2. **Retired Audit Machinery:** Files `ContinuousAuditorDaemon__V1.3.py`, `CisemATV.py`, and `CisemAuditor.py` are **MOVED** to archive directory [`cisem_core/archive/2026-08-24_retired_audit_machinery/`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/archive/), preserving git line history and SHA-256 evidence. No move occurs in this turn; a build token executes them.

---

## 6. Verbatim Preservations Register

Plan A MUST NOT break or alter any of the following 5 mechanisms:

1. **ES256 Local JWKS Verification:** FILE [`backend/src/backend/main.py:126–180`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/main.py#L126-L180). (`verify_jwt_token()` with local in-memory JWKS caching).
2. **Provisioning Bootstrap Endpoint:** FILE [`backend/src/backend/main.py:220–260`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/main.py#L220-L260). (`POST /api/v1/provisioning/bootstrap` creating initial tenant row before token issuance).
3. **Parking Vault Router Mounting:** FILE [`backend/src/backend/main.py:105–106`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/main.py#L105-L106). (`app.include_router(parking_vault_router.router)` on `/api/v1/vault/*`).
4. **Tenant Isolation & Non-Admin Execution:** FILE [`backend/src/backend/main.py:310–350`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/main.py#L310-L350). (`TenantSecurityMiddleware` asserting non-admin tenant context).
5. **Context Pack Generator Script:** FILE [`cisem_core/tools/generate_reviewer_pack.py:1`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/tools/generate_reviewer_pack.py#L1). (`generate_reviewer_pack.py` preventing Phase 25 context drift blocks).

---

## 7. The Seven Mandatory Plan Questions

### (i) Scope Claims with Counts & Commands:
- **Scope Count:** Exactly 7 distinct target workspace assets touched/created across Plan A:
  1. `cisem_gate.py` (Phase 16 diff parser modification)
  2. `.githooks/pre-commit` (new client-side hook)
  3. `LiveDatabaseFunctions__V1.0.sql` (16 custom functions baseline file)
  4. `ContinuousAuditorDaemon__V1.3.py` (archived asset)
  5. `CisemATV.py` (archived asset)
  6. `CisemAuditor.py` (archived asset)
  7. `PLAN_Repository_Gate_Hardening_and_Hook_Wiring__V1.0.md` (plan document)
- Verified via `grep_search` on repository paths.

### (ii) Mandated Mechanism Locations:
- `cisem_gate.py` Phase 16: FILE [`cisem_core/platform_core/cisem_gate.py:1349–1390`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/platform_core/cisem_gate.py#L1349-L1390).
- Git pre-commit hook: FILE `.githooks/pre-commit`.
- Function Baseline: FILE [`cisem_core/schema/2026-08-24__CISEM__LiveDatabaseFunctions__V1.0.sql`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/schema/).

### (iii) Aged Claims Re-checking:
- All repository claims re-checked live on 2026-08-24.

### (iv) Last Child Removal Effect:
- Disabling `.githooks/pre-commit` causes git commits to run without local gate checks. When the hook is removed, NOBODY NOTICES: there is no remote runner, no detector that fires on an unhooked machine, and no record that the hook was ever installed.

### (v) Write-Governing Paths:
- `cisem_gate.py` Phase 16 reads staged git diff `-U0` lines before permitting git commit execution.

### (vi) Legal & Architectural Requirements:
- **NONE APPLIES.** External statutory laws regarding personal data, data retention, user consent, or mandatory disclosure do not govern client-side git commit hooks or Python diff parsers.

### (vii) Proof Format:
- Proof is an executable command pair: `python cisem_core/platform_core/cisem_gate.py` and `.githooks/pre-commit`.

---

## 8. Verification Plan & Executable Proof (Capable of Failing)

### Step 1: Positive Control (Must SUCCEED)
- **Governor executes:** Stage valid ratified plan `cisem_core/planning/2026-08-24__AntigravityLocal__YarivGovernor__PLAN_Repository_Gate_Hardening_and_Hook_Wiring__V1.0.md` with zero DDL violations.
- **Command:** `python cisem_core/platform_core/cisem_gate.py`
- **Expected Result:** Prints `Phase 16: PASS (No un-audited DDL diff additions)`.

### Step 2: Phase 16 Negative Breach Test (Must FAIL)
- **Failure Input:** Modify [`backend/src/backend/migrations.sql`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/migrations.sql#L412) to add line `+CREATE TABLE public._proof_breach_token_xyz99_ (id UUID PRIMARY KEY);` without an active ratified plan whose `EXISTENCE` section names `_proof_breach_token_xyz99_`.
- **Isolated Breach Token:** Uses token `_proof_breach_token_xyz99_` which appears in ZERO other repository files.
- **Expected Refusal Output:**
  ```text
  CISEM_GATE_BLOCKED -- Phase 16: DDL integrity violation in migrations.sql diff.
    Added Line: '+CREATE TABLE public._proof_breach_token_xyz99_ (id UUID PRIMARY KEY);'
    Rule: Proposed table '_proof_breach_token_xyz99_' has no audited entry in active plan EXISTENCE section.
  ```
