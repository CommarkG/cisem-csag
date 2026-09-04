# CISEM Architecture Specification: Side-by-Side Naming & Numbering Policy (V1.0)

---
metadata:
  owner: "CISEM_GOVERNOR"
  canonical_location: "c:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\cisem_core\\architecture\\2026-09-04__AntigravityLocal__YarivGovernor__NamingAndNumberingPolicy__V1.0.md"
  artifact_status: "RATIFIED_DESIGN"
  maturity: "SPECIFICATION"
  version: "1.0"
  author: "Antigravity Senior Builder"
  date: "2026-09-04"
---

## 1. Architectural Foundation: Core vs. Tenant Boundary

### 1.1 Scope & Purpose
This policy establishes the strict boundary between **Universal Process Definitions** (Platform Core) and **Tenant-Scoped Particles** (Tenant Domain Operational Entities).

### 1.2 The Universal Process Principle
> **Rule**: Universal naming and numbering are strictly reserved for **Process Definitions**, **Lifecycle States**, **Core Document Types**, and **System Audit Events**.
> Universal terms never contain tenant-specific business data, local vocabulary, or custom user strings. They are industry-standard, immutable, and shared globally across all platform tenants without glossary lookup requirements.

---

## 2. Side-by-Side Naming & Numbering Comparison Matrix

| Particle Domain | Universal Core Layer (Process / Platform) | Tenant Domain Layer (Operational Data) | Generation & Format Carrier |
| :--- | :--- | :--- | :--- |
| **Document Types** | Standardized Codes: `INQ`, `QUO`, `WO`, `SN`, `PRO`, `INV`, `REC` (stored in `cr_document_types`) | Tenant Custom Aliases / Formats (e.g. `AGN-INQ-2026-0001`) | Core sequence function (`issue_document_reference`) + Tenant prefix rules |
| **Document States** | Universal State Enum: `draft`, `submitted`, `under_review`, `approved`, `issued`, `rejected`, `cancelled` (stored in `cr_universal_states`) | Tenant Status Labels (e.g. "Draft Proposal", "Sent to Customer") | Foreign key constraint referencing `cr_universal_states.code` |
| **Inquiries & Quotes** | Pipeline Stage ID: `stage_brief_received`, `stage_quote_generated` | Inquiry Ref: `INQ-YYYY-XXXX`<br/>Child Quote Ref: `INQ-YYYY-XXXX-SS` | Derived sequence counter (`inquiries.last_child_sequence`) |
| **Contacts** | Contact Type Enum: `person`, `organization`, `counterparty` | Contact ID: `CNT-<TENANT_CODE>-XXXXXX`<br/>Customer ID: `CST-<TENANT_CODE>-XXXXXX` | Partitioned UUID + Tenant Human Reference string |
| **Users & Memberships**| Global Auth Identity: `auth.users.id` (UUID)<br/>System Roles: `platform_admin`, `tenant_user` | Tenant Member ID: `MEM-<TENANT_CODE>-XXXX`<br/>Tenant Custom Role: `PRM-<TENANT_CODE>-<ROLE_NAME>` | Global Auth sub claim + `user_account_roles` tenant partition |
| **Tiers & Permissions**| Core Permission Vectors: `quote:create`, `quote:approve`, `work_order:issue` | Tenant Subscription Tier: `TIER_STARTER`, `TIER_ENTERPRISE`<br/>Custom Policy: `POL-<TENANT_CODE>-APPROVE_LIMIT` | System RBAC Capability Map + Tenant Policy Matrix |
| **Products & Catalog** | Universal Domain Taxonomy: `construction_contractor`, `gift_catalog` | Tenant SKU: `SKU-<TENANT_CODE>-<CAT>-XXXX`<br/>Custom Barcode / Serial | Tenant Catalog Partition (`product_catalog` with `customer_account_id`) |
| **Suppliers** | Supplier Domain Type: `manufacturer`, `subcontractor`, `distributor` | Tenant Supplier ID: `SUP-<TENANT_CODE>-XXXXX` | Tenant Supplier Partition (`suppliers` table) |

---

## 3. Multi-Layer Particle Architecture

### 3.1 Layer 1: Universal Platform Layer (Immutable Core)
- **Scope**: Platform-wide schemas, process state engines, capability gates, and document sequence generation algorithms.
- **Carrier**: Central Postgres registry tables (`cr_document_types`, `cr_universal_states`, `cr_universal_reasons`, `cr_document_sequences`).
- **Isolation**: Shared across all tenants; read-only for tenant sessions.

### 3.2 Layer 2: Tenant Domain Configuration Layer (Tenant Rules)
- **Scope**: Tenant-specific branding, document prefix preferences, custom approval thresholds, and role-to-permission assignments.
- **Carrier**: `customer_accounts` table + tenant settings JSON payload + `user_account_roles`.
- **Isolation**: Strict Row-Level Security (RLS) filtered by `customer_account_id` / `app_metadata.tenant_id`.

### 3.3 Layer 3: Operational Transaction Layer (Live Business Instances)
- **Scope**: Concrete inquiries, quotes, work orders, invoices, contact profiles, and product catalog items created during daily business operations.
- **Carrier**: Operational tables (`inquiries`, `quotes`, `work_orders`, `quote_lines`, `customer_accounts`).
- **Rule**: Every operational record MUST carry both its **Universal State FK** (`status_code` referencing `cr_universal_states`) AND its **Tenant-Scoped Reference** (`reference` string generated via `issue_document_reference`).

---

## 4. Battle-Tested Structural Recommendations

### 4.1 Document Reference Derivation (Child Derivation Pattern)
- **Inquiry Root Reference**: `INQ-2026-0001` (generated from `cr_document_sequences` scoped to `(tenant_id, 'inquiry', 2026)`).
- **Child Quote Reference**: `INQ-2026-0001-01` (derived directly from parent inquiry reference + `inquiries.last_child_sequence`).
- **Standalone Quote Reference**: `QUO-2026-0001` (used ONLY when quote is created without a parent inquiry).

### 4.2 User vs. Contact Partitioning (The Party Model)
- **User (`auth.users`)**: System authentication entity with login credentials and JWT claims.
- **Contact (`contacts`)**: Real-world person or counterparty. A tenant can have 1,500 contacts and only 18 active user logins.
- **Link (`tenant_memberships`)**: Binds an `auth.user` to a `contact` record within a specific tenant context.

---
`EOF: 2026-09-04__AntigravityLocal__YarivGovernor__NamingAndNumberingPolicy__V1.0.md`
