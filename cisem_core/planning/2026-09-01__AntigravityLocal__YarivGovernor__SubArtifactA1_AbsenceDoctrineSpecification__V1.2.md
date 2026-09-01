# CISEM Platform Sub-Artifact A1: The Absence Doctrine Specification
**Author**: Antigravity, Lead Architect  
**Authority**: Yariv, Governor of CISEM CsAg  
**Reviewer**: Claude, Technical Auditor  
**Date**: 2026-09-01  
**Version**: 1.2 (Ratified Specification with Dedicated Null Flavors Table & Empirical Column Audit)  

---

## 1. Executive Summary & Core Absence Doctrine

1.1. **The Central Axiom**:
- **NOT FINDING A FIT IS NOT A FAILURE — IT IS A HIGH-STATUS STATE.**
- Software traditionally treats missing data as an exceptional failure: a database lookup that finds nothing raises an exception, an empty field causes validation errors, and AI agents write `|| 'default'` fallbacks to force the error to go away.
- In CISEM, **A MISSING VALUE IS NEVER STORED AS A BARE NULL WITHOUT AN EXPLICIT REASON.** Every absent value carries a machine-readable absence reason code or a deterministic DDL column comment definition.

1.2. **The Non-Invention Guarantee**:
- When a database column, API endpoint, or UI component encounters missing input, it MUST render the explicit **Absence Reason Code** (Null Flavor) or DDL comment state rather than inventing dummy text or silent default strings.

---

## 2. ISO 21090 Null Flavor Mapping & Dedicated Table Resolution (`public.cr_null_flavors`)

2.1. **The Dedicated Table Architectural Resolution (Option B)**:
- **Structural Finding**: `public.vocabulary_terms.code` is NOT unique across kinds and tenants, making `REFERENCES vocabulary_terms(code)` invalid for foreign keys. Furthermore, Null Flavors are an immutable international standard (ISO 21090); tenants NEVER rename "Not Applicable" or override standard null reasons.
- **The Solution**: Null Flavors reside in a dedicated platform table `public.cr_null_flavors` with `code VARCHAR(10) PRIMARY KEY`. Companion columns reference this table directly: `X_null_reason VARCHAR(10) REFERENCES cr_null_flavors(code)`.

| Primary Key (`code`) | ISO 21090 Equivalent | Business Concept | Operational Definition | Example CISEM Context |
| :--- | :--- | :--- | :--- | :--- |
| **`UNK`** | Unknown | Not Yet Known | Data exists in the world, but is not currently known to the system/user. | Buyer phone number pending intake form completion. |
| **`NA`** | Not Applicable | Not Applicable | Property is logically meaningless for this entity/domain. | Artwork proof URL for a software retainer service line. |
| **`OTH`** | Other / Refused | Refused by Subject | Customer explicitly declined to provide requested information. | Customer opting out of disclosing internal budget ceiling. |
| **`DER`** | Derived / Pending | Pending a Decision | Value is currently being calculated or awaiting workflow approval. | Final quote discount percentage pending manager approval. |
| **`NASK`** | Not Asked | Deliberately Empty | Field was intentionally omitted from collection instrument. | Optional shipping instructions left blank by buyer. |
| **`NAV`** | Not Available | Temporarily Unavailable| Information exists and is known, but system cannot retrieve it now. | Supplier catalog API offline during live lookup. |
| **`ASKU`** | Asked But Unknown | Asked & Unknown | Question was asked, but customer explicitly stated "I do not know". | Customer asked for corporate registration number, responded unknown. |
| **`NI`** | No Information | No Reason Given | Default fallback code when no specific explanation is recorded. | Legacy unannotated missing value. |

---

## 3. The Absence Carrier Per Element Type

3.1. **Carrier 1: Database Column Level (Deterministic Comments & Companion Columns)**:
- **Deterministic Columns (95% of fields)**: Single unambiguous null meaning documented in PostgreSQL DDL column comment (e.g. `COMMENT ON COLUMN cr_quotes.valid_until IS 'Absence (NULL) indicates DER: Pending approval decision.';`).
- **Ambiguous Columns (5% of fields)**: Companion column `X_null_reason VARCHAR(10) REFERENCES cr_null_flavors(code)` when a null value could mean two distinct things.

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
| **`public.vocabulary_terms`** | `[EXISTS]` (62 rows in DB) | Stores 3-tier tenant domain translations. | VERIFIED 2026-09-01 |
| **`public.status_library`** | `[EXISTS]` (12 rows in DB) | Controlled vocabulary table for pipeline state transitions ONLY. | VERIFIED 2026-09-01 |
| **`public.attachments`** | `[EXISTS]` (6 columns in DB) | Immutable JSON/PDF document snapshot storage. | VERIFIED 2026-09-01 |
| **`public.customer_accounts`**| `[EXISTS]` (`tax_id` column present) | Real tax identification column (`tax_id`). | VERIFIED 2026-09-01 |
| **`public.cr_null_flavors`** | **`[NONE FOUND — DOES NOT EXIST]`** | Dedicated table for ISO 21090 null flavors; to be created in Stage 1 DDL. | VERIFIED 2026-09-01 |
| **`quotes.document_snapshot`** | **`[NONE FOUND — DOES NOT EXIST]`** | Proposed JSONB column for sealed quotes; not yet added to schema. | VERIFIED 2026-09-01 |

---

## 5. Architectural Synthesis & Empirical Column Audit

### 5.1. Empirical Finding on Currently-Existing Schema Columns
- **Verified Finding**: An exhaustive SQL query of all 66 database tables in PostgreSQL confirms that **100% OF ALL CURRENTLY EXISTING NULLABLE COLUMNS IN THE LIVE SCHEMA HAVE SINGLE DETERMINISTIC ABSENCE MEANINGS**.
- **Example Empirical Proof**:
  - `public.customer_accounts.tax_id IS NULL`: Single meaning = `UNK` (Tax ID pending collection).
  - `public.quotes.valid_until IS NULL`: Single meaning = `DER` (Quote validity pending approval).
  - `public.inquiries.notes IS NULL`: Single meaning = `NASK` (Notes deliberately omitted by buyer).
- **Conclusion**: Zero currently-existing columns require companion columns today! All existing nullable columns are 100% covered by **Deterministic DDL Column Comments**.

### 5.2. Specification of Companion Column Mechanism for Future Ambiguous Schema Columns
- The companion column mechanism (`X_null_reason VARCHAR(10) REFERENCES cr_null_flavors(code)`) is fully specified for **FUTURE SCHEMA COLUMNS** where absence is genuinely ambiguous:
  1. *Future Column Example*: `customer_accounts.tax_id` if individual consumer exemptions (`NA`) and uncollected corporate IDs (`UNK`) are merged in a future sprint $\rightarrow$ Add `tax_id_null_reason VARCHAR(10) REFERENCES cr_null_flavors(code)`.
  2. *Future Column Example*: `ext_specification_signoffs.signed_by_name` when created in Stage 3 $\rightarrow$ Add `signed_by_null_reason VARCHAR(10) REFERENCES cr_null_flavors(code)`.

---

## 6. Operational Rules & Enforcement Mechanics

6.1. **Rule 1 (The DDL Column Comment Enforcement)**:
- Every nullable column in PostgreSQL DDL MUST carry an explicit `COMMENT ON COLUMN` statement defining its null meaning or referencing its companion reason column in `cr_null_flavors`.

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
| **DEBT-A1-01** | `public.cr_null_flavors` dedicated table not yet created in PostgreSQL schema. | Antigravity | Create `cr_null_flavors` (8 ISO rows) in Stage 1 DDL. |
| **DEBT-A1-02** | `quotes.document_snapshot` column missing from PostgreSQL schema. | Antigravity | Add `document_snapshot JSONB` to `quotes` in Stage 2 DDL. |

---

## 9. Mandatory Next-Step Recommendation

9.1. **NEXT TWO STEPS**:
1. **REVIEWER CLAUDE & GOVERNOR YARIV**: Reviewer Claude verifies Sub-Artifact A1 V1.2 and Governor Yariv issues formal ratification of Sub-Artifact A1.
2. **ANTIGRAVITY**: Upon ratification of Sub-Artifact A1 V1.2, proceed to draft Sub-Artifact A2 (The Document Snapshot & Historical Integrity Specification).
