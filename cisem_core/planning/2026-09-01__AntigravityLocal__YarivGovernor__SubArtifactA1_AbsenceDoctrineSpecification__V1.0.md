# CISEM Platform Sub-Artifact A1: The Absence Doctrine Specification
**Author**: Antigravity, Lead Architect  
**Authority**: Yariv, Governor of CISEM CsAg  
**Reviewer**: Claude, Technical Auditor  
**Date**: 2026-09-01  
**Version**: 1.0 (Draft Specification for Reviewer Attack & Governor Ruling)  

---

## 1. Executive Summary & Core Absence Doctrine

1.1. **The Central Axiom**:
- **NOT FINDING A FIT IS NOT A FAILURE — IT IS A HIGH-STATUS STATE.**
- Software traditionally treats missing data as an exceptional failure: a database lookup that finds nothing raises an exception, an empty field causes validation errors, and AI agents write `|| 'default'` fallbacks to force the error to go away.
- In CISEM, **A MISSING VALUE IS NEVER STORED AS A BARE NULL WITHOUT A REASON.** Every absent value carries a structured, machine-readable reason code explaining *why* it is absent.

1.2. **The Non-Invention Guarantee**:
- When a database column, API endpoint, or UI component encounters missing input, it MUST render the explicit **Absence Reason Code** (Null Flavor) rather than inventing dummy text or silent default strings.

---

## 2. ISO 21090 Null Flavor Mapping (The Five Absence Categories)

| Category # | Business Concept | ISO 21090 Equivalent | Standard Code | Operational Definition | Example CISEM Context |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Not Yet Known** | Unknown / Not Available | `UNK` / `NAV` | Data exists in the world, but has not yet been entered or received. | Buyer phone number pending intake form completion. |
| **2** | **Not Applicable** | Not Applicable | `NA` | Property is logically meaningless for this entity/domain. | Artwork proof URL for a software retainer service line. |
| **3** | **Refused by Subject**| Other / Refused | `OTH` | Customer explicitly declined to provide requested information. | Customer opting out of disclosing internal budget ceiling. |
| **4** | **Pending a Decision**| Derived / Pending | `DER` | Value is currently being calculated or awaiting workflow approval. | Final quote discount percentage pending manager approval. |
| **5** | **Deliberately Empty**| Not Asked | `NASK` | Field was intentionally omitted from the collection instrument. | Optional shipping instructions left blank by buyer. |

---

## 3. The Absence Carrier Per Element Type

3.1. **Carrier 1: Database Column Level**:
- Stored as a structured `absence_map` JSONB payload on table rows: `{"column_name": "NULL_FLAVOR_CODE"}`.

3.2. **Carrier 2: Backend Function Return Shape**:
- Python / TypeScript functions return a discriminated union rather than throwing `None` or `undefined`:
  `{ status: 'ABSENT', code: 'NA', reason: 'Not Applicable for Digital Services' } | { status: 'PRESENT', value: T }`.

3.3. **Carrier 3: API Endpoint Status Code & Body**:
- API endpoints return HTTP 200 with an explicit Absence Metadata Payload when data is absent by design, rather than returning HTTP 404 or empty string `""`:
  `{ "data": null, "absence_metadata": { "code": "NA", "label": "Not Applicable" } }`.

3.4. **Carrier 4: Frontend Component Empty State**:
- UI components render explicit Null Flavor badges (`[Not Applicable]`, `[Pending Approval]`) styled with neutral tone, NEVER rendering empty white space or `|| 'default'` fallback text.

3.5. **Carrier 5: Vocabulary Lookup Unresolved Code**:
- When a `vocabulary_terms` lookup fails to find a custom tenant translation, it returns `{ code: 'UNK', status: 'UNRESOLVED' }` rather than inventing an English label.

---

## 4. Verified Inventory & State (As of 2026-09-01)

| Asset / Table Name | Verified DB / Code State | Absence Mechanism Status | Verification Date |
| :--- | :--- | :--- | :--- |
| **`public.vocabulary_terms`** | `[EXISTS]` (62 rows in DB) | Stores 3-tier codes (`CR_`, `EXT_`, tenant). Can host Null Flavor terms under `kind = 'null_flavor'`. | VERIFIED 2026-09-01 |
| **`public.status_library`** | `[EXISTS]` (12 rows in DB) | Controlled vocabulary table for pipeline state transitions. | VERIFIED 2026-09-01 |
| **`public.attachments`** | `[EXISTS]` (6 columns in DB) | Immutable JSON/PDF document snapshot storage. | VERIFIED 2026-09-01 |
| **`public.tenant_usage_logs`** | **`[NONE FOUND — DOES NOT EXIST]`** | Asserted in previous turn; verified absent via `to_regclass`. | VERIFIED 2026-09-01 |
| **`quotes.document_snapshot`** | **`[NONE FOUND — DOES NOT EXIST]`** | Proposed JSONB column for sealed quotes; not yet added to schema. | VERIFIED 2026-09-01 |

---

## 5. Architectural Trade-Off Analysis: Where Does the Reason Live?

### 5.1. Option A: Companion Null Flavor Column Per Nullable Field
- **Design**: Every nullable column `X` has an adjacent companion column `X_null_reason VARCHAR(10) REFERENCES status_library(code)`.
- **Cost Analysis**:
  - *Schema Inflation*: Doubles the column count on every table (e.g. 20 nullable fields = 40 total columns).
  - *SQL Queryability*: 100% database-native query performance (`WHERE price_null_reason = 'NA'`).
  - *Type Safety*: Enforced by PostgreSQL Foreign Key constraints.

### 5.2. Option B: Single `absence_map` JSONB Column Per Table Row
- **Design**: Every table carries a single column `absence_map JSONB DEFAULT '{}'::jsonb` storing `{"field_name": "NULL_FLAVOR_CODE"}`.
- **Cost Analysis**:
  - *Schema Inflation*: Zero schema clutter; adds exactly 1 column per table regardless of field count.
  - *SQL Queryability*: Requires JSON path operators (`WHERE absence_map->>'price' = 'NA'`), which can be indexed via GIN indexes if needed.
  - *Flexibility*: Allows adding optional fields without altering DDL schema constraints.

### 5.3. Structural Recommendation: Hybrid Architecture
- **RECOMMENDATION**: **Adopt Option B (`absence_map JSONB`) as the primary platform standard** for general operational tables (`inquiries`, `catalog_items`, `work_orders`), keeping DDL lean and uncluttered.
- **EXCEPTION**: Use **Option A (Companion Column)** ONLY for high-audit financial and legal columns (e.g. `quotes.tax_exemption_reason_code`), where strict database-level Foreign Key constraints are legally mandatory.

---

## 6. Operational Rules & Enforcement Mechanics

6.1. **Rule 1 (The Bare NULL Prohibition)**:
- Inserting a SQL `NULL` into a nullable business column without recording an entry in `absence_map` is prohibited at the API boundary.

6.2. **Rule 2 (Pre-Commit Linter Enforcement)**:
- Pre-commit scripts (`gate_identity_fallbacks.py`) scan JSX/TSX viewports for fallback expressions (`|| 'N/A'`, `|| 'Default'`). Any instance detected blocks the commit.

---

## 7. What Defeats It (Defeat Routes & Attack Analysis)

7.1. **Defeat Route 1: Frontend Dynamic Destructuring Fallbacks**:
- *Attack*: A developer writes `const customerName = data.customerName || 'Valued Customer';` inside a React component render path, bypassing DB null maps.
- *Mitigation*: Linter lints JSX AST tree for binary OR (`||`) operators returning hardcoded string literals on API response properties.

7.2. **Defeat Route 2: Silent Backend Exception Swallowing**:
- *Attack*: A Python API endpoint catches a `KeyError` or database `None` and returns `{ "status": "success", "data": {} }` with missing keys stripped.
- *Mitigation*: FastAPI Response Validation Schema forces all nullable fields to serialize as `{ "value": null, "absence_code": "UNK" }`.

---

## 8. Debt Register & Ownership

| Debt ID | Description | Owner | Resolution Target |
| :--- | :--- | :--- | :--- |
| **DEBT-A1-01** | `tenant_usage_logs` asserted in earlier turns does not exist in DB schema. | Antigravity | Create `cr_tenant_counters` in Stage 1 DDL. |
| **DEBT-A1-02** | `quotes.document_snapshot` column missing from PostgreSQL schema. | Antigravity | Add `document_snapshot JSONB` to `quotes` in Stage 2 DDL. |

---

## 9. Mandatory Next-Step Recommendation

9.1. **NEXT TWO STEPS**:
1. **REVIEWER CLAUDE & GOVERNOR YARIV**: Reviewer Claude attacks Sub-Artifact A1 and Governor Yariv issues a ruling on the Absence Doctrine (ratifying Option B `absence_map JSONB` with Option A financial exceptions).
2. **ANTIGRAVITY**: Upon ratification of Sub-Artifact A1, proceed to draft Sub-Artifact A2 (The Document Snapshot & Historical Integrity Specification).
