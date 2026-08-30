---
plan_id: "CISEM-IP-20260825-UNIVERSAL-ONBOARDING"
version: "V1.0"
tier: "MACRO"
blast_radius: "HIGH"
date: "2026-08-25"
author: "Antigravity (Google DeepMind Team)"
authority: "Yariv, Governor of CISEM CsAg"
governor_signature: "UNRATIFIED-DRAFT-IN-PROGRESS"
artifact_status: "DRAFT"
pre_review_status: "PASSED"
related_axioms:
  - "PR-11100" # Multi-Tenant Cryptographic Context
  - "PR-11400" # Twelve-Factor Environment Config
  - "PR-23500" # Intent Before Taxonomy
  - "AX-100000" # Evidence & Wiring Standard
axioms_linked:
  - "PR-11100"
  - "PR-11400"
  - "PR-23500"
  - "AX-100000"
---

# Plan CISEM-IP-20260825-UNIVERSAL-ONBOARDING V1

## 1. Executive Summary & Problem Diagnosis

1.1. **Problem Statement**:
Previous onboarding UI implementations attempted to combine central platform orchestration with customer-specific branding and business rules directly inside application React views. This mixed central platform core spines with tenant-specific code, creating domain leakage and preventing multi-tenant scaling.

1.2. **Architectural Objective**:
Establish a universal onboarding architecture decoupled across three distinct architectural layers. The platform core provides universal engine controllers; tenant customizations persist strictly as data rows in PostgreSQL; a single universal frontend viewport renders the session claims dynamically.

---

## 2. The Three-Place Architectural Split

2.1. **Layer 1: Central Core Engines (`cisem_core/platform_core/onboarding/`)**:
- Holds universal workflow step controllers, session claim validators, and audit logging hooks.
- Code in Layer 1 contains zero hardcoded customer names, brand colors, or tenant-specific logic.

2.2. **Layer 2: Tenant Settings as Database Rows (`customer_accounts.settings`)**:
- Tenant-specific properties (branding, default locale, RTL preferences, enabled capability IDs, vocabulary mappings) persist strictly as JSONB data rows in the PostgreSQL `customer_accounts` table.
- Onboarding a new customer requires an `INSERT` SQL statement, never a code commit or deployment.

2.3. **Layer 3: Single Universal Session Viewport (`UniversalOnboardingViewport.jsx`)**:
- Reads authenticated session claims (`request.state.tenant_id`) from cryptographically signed JWT cookies (`cisem_access_token`).
- Fetches tenant configuration and team member roster dynamically via `/api/v1/tenant/members` and renders tenant settings without hardcoded logic.

---

## 3. The Containment Rule & Two Refusal Layers

3.1. **The Containment Rule Invariant**:
> **Tenant settings may select, label, order, enable, or style what the Core already understands. They may NEVER introduce executable logic, create authority, alter security semantics, or define un-registered behavior.**

3.2. **Refusal Layer 1: Schema Boundary Validation (`tenant-config.schema.json`)**:
- Every tenant settings JSONB payload read from `customer_accounts.settings` is validated against `tenant-config.schema.json`.
- Unrecognized keys, embedded script tags, or invalid data types are rejected during deserialization.

3.3. **Refusal Layer 2: Cryptographic Middleware Boundary (`TenantSecurityMiddleware`)**:
- `TenantSecurityMiddleware` in [`backend/src/backend/main.py:280`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/main.py#L280) parses signed session tokens.
- Attempts to supply un-signed client overrides or bypass security boundaries raise `HTTPException(401/403)` and cause **atomic transaction refusal**.

---

## 4. Self-Failure Mode & Read Schema Validation

4.1. **Identified Failure Mode**:
Malformed, corrupted, or schema-incompatible JSONB blobs stored in database rows could cause client-side React rendering exceptions or crash the viewport.

4.2. **Mitigation Requirement**:
The API backend MUST execute JSON Schema validation on database *reads* before serving settings to the frontend. If database settings fail validation, the backend falls back to `default-tenant-pack` and emits a high-priority audit log event to the `events` table.

---

## 5. Lifecycle Matrix: UI Views & Subsystems

5.1. **Decoupled Lifecycle Model (`Proposed State ≠ Current State`)**:
Every view is assigned a current verified state, a proposed target state, and an explicit decision state. All proposed state changes remain `PROPOSED` until Governor Yariv formally ratifies this document. **Nothing is retired by this plan document alone.**

| Subsystem / View | Current Verified State | Proposed Target State | Decision State | Evidence & Purpose |
|---|---|---|---|---|
| [`CollaborationHub.jsx`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/components/views/CollaborationHub.jsx#L41) | **ACTIVE** | **ACTIVE** | `RATIFIED` | Live Stage 3 Team Roster View (reads `/api/v1/tenant/members`) |
| [`SignInView.tsx`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/components/views/SignInView.tsx#L67) | **ACTIVE** | **ACTIVE** | `RATIFIED` | Live Stage 0 Authentication View |
| [`Header.jsx`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/components/layout/Header.jsx#L56) | **ACTIVE** | **ACTIVE** | `RATIFIED` | Live Stage 1 Session Header (Omri Shilo \| account_admin \| AGN Ltd) |
| [`AppWrapper.jsx`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/components/AppWrapper.jsx#L168) | **ACTIVE** | **ACTIVE** | `RATIFIED` | Live Navigation Router Layout |
| [`Sidebar.jsx`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/components/layout/Sidebar.jsx#L80) | **ACTIVE** | **ACTIVE** | `RATIFIED` | Live Navigation Sidebar |
| `UniversalOnboardingViewport.jsx` | **UNBUILT** | **ACTIVE** | `PROPOSED` | Proposed single-row universal onboarding landing viewport |
| [`WelcomeTourModal.jsx`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/stores/useOnboardingStore.js#L46) | **DORMANT** | **SUPERSEDED** | `PROPOSED` | Demo welcome tour modal (Already suppressed for auth sessions) |
| `DemoTaskSeeding.js` | **DORMANT** | **SUPERSEDED** | `PROPOSED` | Demo task generator (Already suppressed in `useTaskStore.js:15`) |
| 9 Playground Viewports | **DORMANT** | **SUPERSEDED** | `PROPOSED` | Unmounted legacy playground pages |

---

## 6. Verification Plan & Single Executable Proof

6.1. **Automated Integration Proof**:
- Execute integration tests verifying JWT session claim resolution and JSON schema validation on settings reads.

6.2. **Single Executable Proof Sequence**:
- **Proof Step A (AGN Tenant)**: Omri Shilo signs in $\rightarrow$ JWT token resolved $\rightarrow$ API returns AGN personnel roster from `/api/v1/tenant/members` $\rightarrow$ `UniversalOnboardingViewport` renders **Omri Shilo | account_admin | AGN Ltd**.
- **Proof Step B (Second Tenant)**: A second tenant user signs in $\rightarrow$ JWT token resolved $\rightarrow$ API returns second tenant roster $\rightarrow$ `UniversalOnboardingViewport` renders second tenant name and branding dynamically, proving zero hardcoded company logic.

---

## 7. Explicit Un-Authorized Scope

7.1. **What This Plan Does NOT Authorize**:
- Physical file deletion of any unmounted playground pages or historical plan documents (`RETIREMENT ≠ DELETION`).
- Direct database DDL schema modifications (uses existing `customer_accounts` table).
- Hardcoding company names, brand colors, or custom logic branches in React views or Python routes.

---

## 8. The Five Wiring Gates Evaluation

8.1. **Gate 1 · It Exists & Gate 1.4 Retirement Question**:
- All code changes will be declared with verbatim line numbers. Gate 1.4 confirms `existence ≠ authority`; unmounted demo stores are marked `SUPERSEDED` for active sessions.

8.2. **Gate 2 · Every Dependent Agrees (Dual-Search)**:
- Dual-Search command string (`grep_search`) will be executed for both symbol names AND produced artifact filenames (`customer_accounts.settings`, `events`).

8.3. **Gate 3 · It Serves Its Consumer (Forward)**:
- Terminal command string `python cisem_core/platform_core/cisem_gate.py` will be executed and verbatim stdout output pasted into the turn.

8.4. **Gate 4 · It Is Recorded**:
- Permanent records stored in [`AGENTS.md`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/AGENTS.md) and [`cisem_core/planning/`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/planning/).

8.5. **Gate 5 · It Is Guarded & Survives**:
- `TenantSecurityMiddleware` and 26 LGG compilation phases refuse unauthorized edits.

---

## 9. Standing Items Carried Without Re-Checking

9.1. **Carried Items**:
- Carrier B Nine Clauses ([`AGENTS.md:1-40`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/AGENTS.md#L1-L40)).
- Wiring Standard V1 Five Gates ([`AGENTS.md:275-320`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/AGENTS.md#L275-L320)).
- Master Accumulated Wisdom Registry V1.0 WISDOM-001 through WISDOM-006 ([`AGENTS.md:321-342`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/AGENTS.md#L321-L342)).
- The Retirement Question V1 ([`AGENTS.md:343-375`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/AGENTS.md#L343-L375)).
