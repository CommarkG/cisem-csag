# PLAN: Existence Before Proposal Enforcement V1.1

---
metadata:
  owner: "CISEM_GOVERNOR"
  canonical_location: "cisem_core/planning/2026-08-23__AntigravityLocal__YarivGovernor__PLAN_Existence_Before_Proposal_Enforcement__V1.1.md"
  artifact_status: "DRAFT"
  pre_review_status: "PENDING"
  maturity: "WORKING_DRAFT"
  version: "1.1"
  created_at: "2026-08-23T23:18:00Z"
  authors: ["GOOGLE_ANTIGRAVITY_ADAPTER", "CISEM_REVIEWER_CLAUDE"]
---

## 1. Goal Description & Background

This plan specifies the dual-channel **Existence Before Proposal Enforcement** framework. It requires every proposed DDL schema object (table, column, function, index) or backend API route to verify existing state in both channels (repository code and live database) BEFORE proposing or implementing changes.

This resolves registry debt and un-tracked database drift (where 214 database functions exist without matching repository code files).

---

## 2. Dual-Channel Enforcement Architecture

### Repository Channel Half: Phase 16 DDL Text Scanner Attachment
- **LOCATION:** FILE [`cisem_core/platform_core/cisem_gate.py:1349–1390`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/platform_core/cisem_gate.py#L1349-L1390) (`check_ddl_integrity()`).
- **MECHANISM:** Extends Phase 16 to parse line-by-line SQL diff text (`sql_content.splitlines()`). When a staged `.sql` file contains `CREATE TABLE`, `ALTER TABLE ADD COLUMN`, or `CREATE FUNCTION`, Phase 16 extracts the proposed object name and verifies that it is explicitly named in the `EXISTENCE` section of an active ratified plan.
- **NO WRITTEN EXEMPTIONS OR GRANDFATHERING:** This plan carries zero written escape valves, zero `GOV-` override tokens, and zero grandfathering clauses. Because plan Markdown documents contain 0 SQL statements, Phase 16 evaluates `0 SQL additions` and passes plan commits trivially without requiring exemptions.

### Database Channel Half: `_ddl_audit_ledger` Dedicated Table & Event Trigger
- **TABLE DEFINITION:** Creates NEW dedicated table `public._ddl_audit_ledger` (leaving existing migration file table `_migration_ledger` untouched so [`E2_ApplyMigration__V1.0.py`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/platform_core/2026-08-14__CISEM__AntigravityLocal__E2_ApplyMigration__V1.0.py#L41) does not break):
  1. `id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY`
  2. `statement_text TEXT NOT NULL`
  3. `actor_role VARCHAR(100) NOT NULL`
  4. `executed_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()`
  5. `checksum VARCHAR(64) NOT NULL`
- **DEPENDENCY CHECK:** Uses `pgcrypto` extension (`encode(digest(..., 'sha256'), 'hex')`), which is verified INSTALLED live in PostgreSQL.
- **GRANT-ONLY PRIVILEGE SECURITY:** RLS remains disabled on `_ddl_audit_ledger`. Access is secured strictly by PostgreSQL Grants (`REVOKE ALL ON public._ddl_audit_ledger FROM PUBLIC, anon, authenticated; GRANT ALL ON public._ddl_audit_ledger TO service_role;`).
- **CAPABILITY DISCLOSURE:** The ledger records DDL statements executed by ANY database connection or actor (Governor via SQL Editor, Reviewer tool capability, or service role) regardless of intent or claimed authority.
- **DEADLOCK PROTECTION:** Trigger-management DDL commands (`DROP EVENT TRIGGER`, `ALTER EVENT TRIGGER`) are excluded from logging via `WHEN TAG NOT IN ('DROP EVENT TRIGGER', 'ALTER EVENT TRIGGER')`. If `_ddl_audit_ledger` fails, the Governor can execute `DROP EVENT TRIGGER ddl_audit_trigger;` without trigger deadlock.
- **SCHEMA-ONLY FILTER:** Excludes provider internal schemas (`auth`, `storage`, `graphql`, `realtime`, `extensions`, `vault`). NEVER excludes user or administrative roles (`postgres`, `service_role`). All DDL changes in `public` or application schemas are logged regardless of who executes them.
- **FAILURE BEHAVIOR:** If `_ddl_audit_ledger` fails to write during user schema DDLs, the trigger executes `RAISE EXCEPTION 'MIGRATION_LEDGER_WRITE_FAILED'`, rolling back the transaction.

---

## 3. Dual-Channel Bridge Gap Disclosure (Known Architectural Limitation)

- **NAMED LIMITATION:** The repository gate (`cisem_gate.py`) and the database audit ledger (`_ddl_audit_ledger`) are architecturally un-bridged. `cisem_gate.py` has no automated TCP connection to PostgreSQL, and PostgreSQL event triggers have no read access to git commit hashes.
- **DECISION:** NAMED AS KNOWN LIMITATION. This plan does NOT propose a new background daemon (respecting the retirement of `ContinuousAuditorDaemon.py`). The Governor or Reviewer manually verifies database ledger alignment during audit turns.

---

## 4. Pre-Design Existence Audit (What Already Exists)

### Repository Channel Audit:
- **Command:** `grep_search` with Query `check_ddl_integrity` on [`cisem_gate.py`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/platform_core/cisem_gate.py).
- **Findings:**
  1. Phase 16 DDL Scanner: FILE [`cisem_core/platform_core/cisem_gate.py:1349–1390`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/platform_core/cisem_gate.py#L1349-L1390).
  2. Migration Ledger Script: FILE [`cisem_core/platform_core/2026-08-14__CISEM__AntigravityLocal__E2_ApplyMigration__V1.0.py:41`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/platform_core/2026-08-14__CISEM__AntigravityLocal__E2_ApplyMigration__V1.0.py#L41). Expects existing `_migration_ledger` shape (`filename`, `checksum`, `applied_at`).
  3. Repository Functions: 4 unique functions found ([`migrations.sql:121, 146`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/migrations.sql#L121), [`schema.sql:26`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/schema.sql#L26)).

### Live Database Channel Audit:
- **Query:** HANDED (Reviewer 2026-08-23).
- **Findings:** 66 tables, 218 database functions (214 un-tracked in repository), `_migration_ledger` exists (3 columns, 0 rows), `pgcrypto` extension IS INSTALLED.

---

## 5. Dynamic Cutoff Policy (Handling 214 Pre-Existing Functions Without Stored Baseline)

- **SCOPE POLICY:** FORWARD ONLY VIA DYNAMIC TIMESTAMP CUTOFF.
- **RATIONALE:** Storing a static baseline `.json` snapshot file violates P-04 (stored snapshots decay out of sync).
- **DYNAMIC CUTOFF:** Queries against `_ddl_audit_ledger` evaluate statements executed AFTER `2026-08-23 00:00:00+00`. Pre-existing database functions created prior to `2026-08-23` are ignored dynamically on demand without reading any stored baseline file.

---

## 6. Managed Database Provider Collision Risk

- **NAMED RISK:** Adding a custom `ddl_command_end` event trigger to a managed Supabase database may collide with internal Supabase migration utilities or cause lock timeouts during automated platform updates.
- **TEST OF COLLISION:** Execute test migration `CREATE TABLE public._test_collision (id INT); DROP TABLE public._test_collision;` under `service_role`. If Supabase internal DDL triggers fail or deadlocks occur, the custom event trigger is flagged as colliding.
- **FALLBACK PROCEDURE:** If a collision occurs, the event trigger is replaced by an application-level wrapper inside `E2_ApplyMigration.py` that writes to `_ddl_audit_ledger` synchronously during migration deployment.

---

## 7. The Seven Mandatory Plan Questions

### (i) Scope Claims with Counts & Commands:
- 2 target files modified in `cisem_core/platform_core/`: `cisem_gate.py` (Phase 16 extension) and `E2_ApplyMigration.py`. Verified via `grep_search` on `cisem_gate.py`.

### (ii) Mandated Mechanism Locations:
- `cisem_gate.py` Phase 16: FILE [`cisem_core/platform_core/cisem_gate.py:1349–1390`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/platform_core/cisem_gate.py#L1349-L1390).
- `_ddl_audit_ledger` DDL trigger: Dedicated table created in PostgreSQL schema.

### (iii) Aged Claims Re-checking:
- All repository claims re-checked live on 2026-08-23.

### (iv) Last Child Removal Effect:
- Disabling the DDL event trigger causes database-side schema changes to execute without ledger recording, degrading database auditability.

### (v) Write-Governing Paths:
- `cisem_gate.py` Phase 16 reads staged SQL diff lines before permitting git commit execution.

### (vi) Legal & Architectural Requirements:
- CISEM Governance Law: Zero un-audited schema fabrication or database drift permitted.

### (vii) Proof Format:
- Proof is an executable command pair: `python cisem_core/platform_core/cisem_gate.py` and `SELECT count(*) FROM _ddl_audit_ledger`.

---

## 8. Verification Plan & Executable Proof (Positive Control First)

### Step 1: Database Positive Control (Must SUCCEED)
- **Governor executes:** `CREATE TABLE public._proof_positive_test (id INT);`
- **Verification Query:** `SELECT count(*) FROM public._ddl_audit_ledger WHERE statement_text LIKE '%_proof_positive_test%';`
- **Expected Result:** Returns **EXACTLY 1 ROW**. (Proves the DDL event trigger is active, firing, and successfully recording schema changes).
- **Clean-up:** `DROP TABLE public._proof_positive_test;`

### Step 2: Trigger & Grant Existence Check (Detecting Silent Removal or Privilege Leak)
- **Governor Query 2A (Trigger Active):** `SELECT count(*) FROM pg_event_trigger WHERE evtname = 'ddl_audit_trigger' AND evtenabled = 'O';` (Expects `1`).
- **Governor Query 2B (Grant Security Check):** `SELECT count(*) FROM information_schema.role_table_grants WHERE table_name = '_ddl_audit_ledger' AND grantee IN ('PUBLIC', 'anon', 'authenticated');` (Expects `0`).
- **Execution Location:** Run on demand by Governor or Reviewer during audit turns.

### Step 3: Repository Half Proof (Phase 16 DDL Scanner - Must FAIL on Breach)
- **Command:** `python cisem_core/platform_core/cisem_gate.py`
- **Failure Input:** Modify [`backend/src/backend/migrations.sql`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/migrations.sql#L412) to add line `CREATE TABLE unapproved_foo (id UUID PRIMARY KEY);` without an active ratified plan whose `EXISTENCE` section names `unapproved_foo`.
- **Expected Refusal Readout:**
  ```text
  CISEM_GATE_BLOCKED -- Phase 16: DDL integrity violation in migrations.sql:L412.
    Line: 'CREATE TABLE unapproved_foo (id UUID PRIMARY KEY);'
    Rule: Proposed table 'unapproved_foo' has no audited entry in active plan EXISTENCE section.
  ```

### Step 4: Database Half Failure Test (Must DETECT BREACH)
- **Simulated Breach:** `ALTER EVENT TRIGGER ddl_audit_trigger DISABLE;`
- **Governor executes:** `CREATE TABLE public._proof_negative_test (id INT);`
- **Verification Query:** `SELECT count(*) FROM public._ddl_audit_ledger WHERE statement_text LIKE '%_proof_negative_test%';`
- **Expected Refusal Output:** Query returns `0 rows`, causing verification script to report `DATABASE_PROOF_FAILED: Direct DDL executed without ledger entry!`.
- **Re-enable Trigger:** `ALTER EVENT TRIGGER ddl_audit_trigger ENABLE;`
