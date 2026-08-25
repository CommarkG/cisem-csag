# Ratified CoreCycle Implementation Plan: Universal Inquiry-to-Signed-Work-Order Pipeline

**Ratification Status**: APPROVED BY GOVERNOR YARIV (2026-08-24)  
**Core Architectural Law**: The 5-table pipeline (`inquiries` → `quotes` → `quote_lines` → `acceptance_records` → `work_orders`) forms the universal internal core of CISEM. All domain-specific details live strictly under external tenant configuration (`customer_account_id`), ensuring zero coupling between tenant details and core pipeline architecture.

---

## 1. Prerequisites & Blocking Prerequisites (B1 & B2)

### B1 · Cryptographic Tenant Token Signature Binding (PR-11100)
- **File**: [`backend/src/backend/main.py`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/main.py)
- **Implementation**: Add `tenant_signature = HMAC_SHA256(user_id + ":" + customer_account_id, SERVER_SECRET)` verification inside `TenantSecurityMiddleware`. Verify on every HTTP request; reject forged tenant context with HTTP `403 Forbidden: INVALID_TENANT_BINDING`.

### B2 · Cross-Tenant Isolation Integration Test (PR-11400)
- **File**: [`tests/test_tenant_isolation.py`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/tests/test_tenant_isolation.py)
- **Implementation**: Create a capable-of-failing integration test that sends a JWT signed for `Tenant A` attempting to access an `inquiry_id` belonging to `Tenant B`. Assert HTTP status `403` or `404`.

---

## 2. Proposed System Changes

### [Component 1] Universal Backend API & Pipeline Controllers (`backend/src/backend/main.py`)

#### [MODIFY] [`main.py`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/main.py)
- Wire 5 universal pipeline endpoints strictly partitioned by `customer_account_id`:
  1. `POST /api/v1/inquiries` & `GET /api/v1/inquiries` (Intake of enquiry)
  2. `POST /api/v1/quotes` & `GET /api/v1/quotes` (Drafting customer quote)
  3. `POST /api/v1/quotes/{id}/lines` (Adding quote lines with units/prices)
  4. `POST /api/v1/quotes/{id}/accept` (Recording customer acceptance into `acceptance_records`)
  5. `POST /api/v1/acceptance-records/{id}/work-order` (Deriving signed `work_orders` from acceptance records)

---

### [Component 2] Automated Integration Test Suite (`tests/`)

#### [NEW] [`test_tenant_isolation.py`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/tests/test_tenant_isolation.py)
- Test 1: Cross-tenant inquiry access refusal (Tenant A token accessing Tenant B inquiry).
- Test 2: Valid tenant token access success (Tenant A token accessing Tenant A inquiry).

---

### [Component 3] Frontend Universal Pipeline Components (`src/components/views/`)

#### [NEW] [`InquiryIntakeView.tsx`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/components/views/InquiryIntakeView.tsx)
- Universal inquiry intake form (contact details, budget, requirements, dynamic tenant rules).

#### [NEW] [`QuoteBuilderView.tsx`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/components/views/QuoteBuilderView.tsx)
- Universal quote creation and line item management view with automatic total calculations.

#### [NEW] [`WorkOrderAcceptanceView.tsx`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/components/views/WorkOrderAcceptanceView.tsx)
- Customer quote acceptance interface capturing evidence type, signature, and deriving signed work orders.

---

## 3. Verification Plan

### Automated Tests
- Run integration test suite:
  ```bash
  python -m pytest tests/test_tenant_isolation.py
  ```

### Manual Verification
- Execute end-to-end API walkthrough:
  1. Submit Inquiry (`inquiries`)
  2. Generate Quote (`quotes` + `quote_lines`)
  3. Record Acceptance Evidence (`acceptance_records`)
  4. Issue Work Order (`work_orders`)
