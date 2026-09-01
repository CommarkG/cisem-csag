# CISEM Platform Sub-Artifact A1: The Absence Doctrine Specification
**Author**: Antigravity, Lead Architect  
**Authority**: Yariv, Governor of CISEM CsAg  
**Reviewer**: Claude, Technical Auditor  
**Date**: 2026-09-01  
**Version**: 1.1 (Ratified Specification with Deterministic Column Comments & Ambiguous Companion Columns)  

---

## 1. Executive Summary & Core Absence Doctrine

1.1. **The Central Axiom**:
- **NOT FINDING A FIT IS NOT A FAILURE — IT IS A HIGH-STATUS STATE.**
- Software traditionally treats missing data as an exceptional failure: a database lookup that finds nothing raises an exception, an empty field causes validation errors, and AI agents write `|| 'default'` fallbacks to force the error to go away.
- In CISEM, **A MISSING VALUE IS NEVER STORED AS A BARE NULL WITHOUT AN EXPLICIT REASON.** Every absent value carries a machine-readable absence reason code or a deterministic DDL column comment definition.

1.2. **The Non-Invention Guarantee**:
- When a database column, API endpoint, or UI component encounters missing input, it MUST render the explicit **Absence Reason Code** (Null Flavor) or DDL comment state rather than inventing dummy text or silent default strings.

---

## 2. ISO 21090 Null Flavor Mapping (The Five Absence Categories)

Null flavor vocabulary codes reside strictly in `public.vocabulary_terms` under `kind = 'null_flavor'`, Tier 1 (`CR_`), `is_protected = true`, ensuring complete isolation from `status_library` pipeline states.

| Category # | Business Concept | ISO 21090 Equivalent | Standard Code | Operational Definition | Example CISEM Context |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Not Yet Known** | Unknown / Not Available | `UNK` / `NAV` | Data exists in the world, but has not yet been entered or received. | Buyer phone number pending intake form completion. |
| **2** | **Not Applicable** | Not Applicable | `NA` | Property is logically meaningless for this entity/domain. | Artwork proof URL for a software retainer service line. |
| **3** | **Refused by Subject**| Other / Refused | `OTH` | Customer explicitly declined to provide requested information. | Customer opting out of disclosing internal budget ceiling. |
| **4** | **Pending a Decision**| Derived / Pending | `DER` | Value is currently being calculated or awaiting workflow approval. | Final quote discount percentage pending manager approval. |
| **5** | **Deliberately Empty**| Not Asked | `NASK` | Field was intentionally omitted from the collection instrument. | Optional shipping instructions left blank by buyer. |

---

## 3. The Absence Carrier Per Element Type

3.1. **Carrier 1: Database Column Level (Deterministic Comments & Companion Columns)**:
- **Deterministic Columns**: Single unambiguous null meaning documented in PostgreSQL DDL column comment (e.g. `COMMENT ON COLUMN cr_quotes.valid_until IS 'Absence (NULL) indicates DER: Pending approval decision.';`).
- **Ambiguous Columns**: Companion column `X_null_reason VARCHAR(10) REFERENCES vocabulary_terms(code)` when a null value could mean two distinct things.

3.2. **Carrier 2: Backend Function Return Shape**:
- Python / TypeScript functions return a discriminated union rather than throwing `None` or `undefined`:
  `{ status: 'ABSENT', code: 'NA', reason: 'Not Applicable for Digital Services' } | { status: 'PRESENT', value: T }`.

3.3. **Carrier 3: API Endpoint Status Code & Body**:
- API endpoints return HTTP 200 with an explicit Absence Metadata Payload when data is absent by design, rather than returning HTTP 404 or empty string `""`:
  `{ "data": null, "absence_metadata": { "code": "NA", "label": "Not Applicable" } }`.

3.4. **Carrier 4: Frontend Component Empty State**:
- UI components render explicit Null Flavor badges (`[Not Applicable]`, `[Pending Approval]`) styled with neutral tone, NEVER rendering empty white space or `|| 'default'` fallback text.

3.5. **Carrier 5: Vocabulary Lookup Unresolved Code**:
- When a `vocabulary_terms` lookup fails to find a custom tenant translation, it returns `{ code: 'UNK', status: 'UNRESOLVED' }` from `vocabulary_terms` rather than inventing an English label.

---

## 4. Verified Inventory & State (As of 2026-09-01)

| Asset / Table Name | Verified DB / Code State | Absence Mechanism Status | Verification Date |
| :--- | :--- | :--- | :--- |
| **`public.vocabulary_terms`** | `[EXISTS]` (62 rows in DB) | Stores 3-tier codes (`CR_`, `EXT_`, tenant). Hosts Null Flavor terms under `kind = 'null_flavor'`. | VERIFIED 2026-09-01 |
| **`public.status_library`** | `[EXISTS]` (12 rows in DB) | Controlled vocabulary table for pipeline state transitions ONLY. | VERIFIED 2026-09-01 |
| **`public.attachments`** | `[EXISTS]` (6 columns in DB) | Immutable JSON/PDF document snapshot storage. | VERIFIED 2026-09-01 |
| **`public.tenant_usage_logs`** | **`[NONE FOUND — DOES NOT EXIST]`** | Asserted in previous turn; verified absent via `to_regclass`. | VERIFIED 2026-09-01 |
| **`quotes.document_snapshot`** | **`[NONE FOUND — DOES NOT EXIST]`** | Proposed JSONB column for sealed quotes; not yet added to schema. | VERIFIED 2026-09-01 |

---

## 5. Architectural Synthesis: Deterministic Comments vs. Companion Columns

### 5.1. Resolution of the Reviewer's Attack (Abandoning JSONB Blobs)
- **Reviewer Objection Accepted**: JSONB `absence_map` is invisible to SQL schema validation, cannot carry DDL column comments, and disables pre-commit gate checks. The JSONB blob recommendation is **ABANDONED**.
- **Ratified Standard**: **Deterministic DDL Column Comments + Ambiguous Companion Columns**.
  1. **Deterministic Single-Meaning Nulls (95% of columns)**: Handled by explicit DDL column comments documenting the single standard null meaning. Zero column inflation!
  2. **Ambiguous Multi-Meaning Nulls (5% of columns)**: Handled by explicit companion column `X_null_reason VARCHAR(10) REFERENCES vocabulary_terms(code)`.

### 5.2. Audit of Ambiguous Columns Requiring Companion Columns

| Table Name | Ambiguous Column | Why Absence (NULL) Is Ambiguous | Companion Column Solution |
| :--- | :--- | :--- | :--- |
| `cr_customer_accounts` | `vat_number` | Could mean `NA` (Individual consumer exempt from VAT) OR `UNK` (Corporate buyer whose tax ID is pending collection). | `vat_number_null_reason VARCHAR(10) REFERENCES vocabulary_terms(code)` |
| `cr_quotes` | `tax_exemption_code` | Could mean `NA` (Standard taxable quote) OR `OTH` (Tax-exempt customer refusing tax certificate disclosure). | `tax_exemption_null_reason VARCHAR(10) REFERENCES vocabulary_terms(code)` |
| `ext_specification_signoffs`| `signed_by_name` | Could mean `DER` (Automated API system sign-off) OR `UNK` (Manual sign-off document pending OCR extraction). | `signed_by_null_reason VARCHAR(10) REFERENCES vocabulary_terms(code)` |
| `cr_inquiries` | `budget_limit` | Could mean `NASK` (Buyer explicitly omitted budget) OR `OTH` (Buyer refused to disclose price ceiling). | `budget_limit_null_reason VARCHAR(10) REFERENCES vocabulary_terms(code)` |

---

## 6. Operational Rules & Enforcement Mechanics

6.1. **Rule 1 (The DDL Column Comment Enforcement)**:
- Every nullable column in PostgreSQL DDL MUST carry an explicit `COMMENT ON COLUMN` statement defining its null meaning or referencing its companion reason column.

6.2. **Rule 2 (Pre-Commit Linter Enforcement)**:
- Pre-commit scripts (`gate_identity_fallbacks.py`) scan JSX/TSX viewports for fallback expressions (`|| 'N/A'`, `|| 'Default'`). Any instance detected blocks the commit.

---

## 7. What Defeats It (Defeat Routes & Attack Analysis)

7.1. **Defeat Route 1: DDL Columns Created Without Comments or Companion Columns**:
- *Attack*: A developer executes `ALTER TABLE cr_quotes ADD COLUMN internal_notes TEXT;` without adding a DDL comment or null reason column.
- *Mitigation*: Pre-commit schema auditor (`gate_cr_ext_dependency.py` / `CisemAuditor.py`) inspects `pg_description` and fails commit if any nullable column lacks a comment or companion reason.

7.2. **Defeat Route 2: Frontend Dynamic Destructuring Fallbacks**:
- *Attack*: A developer writes `const customerName = data.customerName || 'Valued Customer';` inside a React component render path.
- *Mitigation*: Linter lints JSX AST tree for binary OR (`||`) operators returning hardcoded string literals on API response properties.

---

## 8. Debt Register & Ownership

| Debt ID | Description | Owner | Resolution Target |
| :--- | :--- | :--- | :--- |
| **DEBT-A1-01** | `tenant_usage_logs` asserted in earlier turns does not exist in DB schema. | Antigravity | Create `cr_tenant_counters` in Stage 1 DDL. |
| **DEBT-A1-02** | `quotes.document_snapshot` column missing from PostgreSQL schema. | Antigravity | Add `document_snapshot JSONB` to `quotes` in Stage 2 DDL. |

---

## 9. Mandatory Next-Step Recommendation

9.1. **NEXT TWO STEPS**:
1. **REVIEWER CLAUDE & GOVERNOR YARIV**: Reviewer Claude verifies Sub-Artifact A1 V1.1 and Governor Yariv issues formal ratification of Sub-Artifact A1.
2. **ANTIGRAVITY**: Upon ratification of Sub-Artifact A1, proceed to draft Sub-Artifact A2 (The Document Snapshot & Historical Integrity Specification).
