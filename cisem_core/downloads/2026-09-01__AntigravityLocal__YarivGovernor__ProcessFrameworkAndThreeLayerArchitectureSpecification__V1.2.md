# CISEM Platform Process Framework & Three-Layer Architecture Specification
**Author**: Antigravity, Lead Architect  
**Authority**: Yariv, Governor of CISEM CsAg  
**Reviewer**: Claude, Technical Auditor  
**Date**: 2026-09-01  
**Version**: 1.2 (Ratified Specification with Frontend Replacement Law & Core Cycles Map)  

---

## 1. Executive Summary & Architectural Axioms

1.1. **The Fulfillment Discriminator Invariant**:
- The platform does **NOT** branch application code paths on tenant IDs, company names, or industry titles.
- Multi-domain variability is governed strictly by **Fulfillment Type Policies** declared on individual order line items (`fulfillment_type`).
- The Platform owns the universal mechanism (`CC1`). The Fulfillment Policy owns the domain routing (`CC2` / `CC3`).

1.2. **The Specification Clock Baseline Law**:
- In traditional ERPs (SAP SD, NetSuite, Odoo, ERPNext), promised delivery dates are calculated prematurely from the commercial order date (`order_date + lead_time`), penalizing suppliers for customer delays.
- In CISEM, **THE DELIVERY CLOCK STARTS ONLY WHEN THE CUSTOMER SIGNS THE TECHNICAL SPECIFICATION** (`specification_signed_at`). Commercial contract signing establishes the legal price, but technical sign-off unlocks factory production and starts the fulfillment clock.

1.3. **The Single-Operator Lean Infrastructure Constraint**:
- CISEM is operated by one Governor and two AI agents.
- Heavy enterprise infrastructure (RabbitMQ, Datadog, separate IDP sidecars) is **REJECTED**.
- All operational primitives (log scrubbing, usage metering, job queueing) MUST be **DATABASE-NATIVE**, lightweight, and maintainable by a single operator.

1.4. **The Frontend Replacement Law**:
- The old legacy frontend code is **NOT REPAIRED, EXTENDED, OR WORKED AROUND. IT IS REPLACED.**
- Every remaining view is built clean from the framework, on the pattern proven by `CatalogueListView.tsx` and `QuoteBuilderView.tsx`:
  1. Level 1 TypeScript definitions generated from schema (`database.types.ts`).
  2. Tenancy injected dynamically by session provider (zero hardcoded tenant fallbacks).
  3. Explicit conditional rendering (zero string invention; `NULL` data renders nothing).

1.5. **The Core Cycle Definition of Done**:
- Implementation proceeds in **Sequential Core Cycles**, carrying Schema, Endpoint, and Screen together in one consolidated turn.
- A cycle is **NOT DONE WHEN THE SCREEN RENDERS**. A cycle is done ONLY when a persistent database row exists that the Governor created on his screen and the Reviewer has queried directly via SQL.

---

## 2. The Six Fulfillment Domains & Fulfillment Types

| Domain # | Domain Name | Fulfillment Code (`fulfillment_type`) | Operational Definition | Primary Deliverable |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Physical Made-to-Order** | `made_to_order` | Custom physical manufacturing or branding based on approved artwork/specs. | Physical custom goods (e.g. AGN Ltd trophies, branded notebooks) |
| **2** | **On-Site Service** | `on_site_service` | Labor and materials delivered at customer physical site. | Completed site work (e.g. painting a house, equipment installation) |
| **3** | **Digital Deliverable** | `digital_deliverable` | Electronic assets, code, or media generated and transferred online. | Digital files (e.g. software, design blueprints, media assets) |
| **4** | **Ongoing Service / Retainer**| `ongoing_retainer` | Periodic recurring labor or maintenance services. | SLA compliance & recurring service (e.g. monthly IT maintenance) |
| **5** | **Resale from Stock** | `resale_stock` | Off-the-shelf physical inventory picked and shipped from warehouse. | Stock inventory delivery (e.g. standard packaging boxes) |
| **6** | **Rental and Hire** | `rental_hire` | Temporary lease of physical assets returned after event window. | Asset lease & return (e.g. event lighting, staging equipment) |

---

## 3. The Three-Layer Architecture Model (CC1 / CC2 / CC3)

### 3.1. Layer CC1: Universal Platform Spine (Applies to ALL 6 Domains)

Every single transaction across all 6 domains consumes these core elements without exception:

| Element Name | Architectural Role | Status in Repository |
| :--- | :--- | :--- |
| **Tenant Session Context** | Authenticated tenant claim (`customer_account_id`) governing RLS. | `[EXISTS]` (`customer_accounts`) |
| **Inquiry Intake** | Raw customer inquiry ingestion & requirement capture. | `[EXISTS]` (`inquiries`) |
| **Catalog Item & Pricing Basis** | Item master data & volume discount price list lines. | `[EXISTS]` (`catalog_items`, `price_list_lines`) |
| **Commercial Quotation** | Binding price offer, subtotal, tax, and currency declaration. | `[EXISTS]` (`quotes`, `quote_lines`) |
| **Status Vocabulary Library** | Controlled 3-tier vocabulary for lifecycle state progression. | `[EXISTS]` (`status_library`) |
| **Polymorphic Attachments** | Cryptographic signed documents, POs, and PDF uploads. | `[EXISTS]` (`attachments`) |
| **State Transition Ledger** | Audit trail recording `from_state` $\rightarrow$ `to_state` transitions. | `[BUILT-AND-ORPHANED]` (`state_transitions`) |
| **Log Scrubbing Boundary** | Middleware redacting sensitive tenant data from error logs. | `[DOES NOT EXIST]` |
| **Usage Metering Subsystem** | Counter table tracking tenant resource usage against package limits. | `[BUILT-AND-ORPHANED]` (`tenant_usage_logs`) |
| **Database Job Queue** | DB-native async queue for slow tasks (`pdf_queue`). | `[BUILT-AND-ORPHANED]` (`pdf_queue`) |
| **Specification Sign-Off Record** | Formal buyer technical sign-off unlocking delivery clock. | `[DOES NOT EXIST]` (`specification_signoffs`) |
| **Commercial Order Claim** | Binding commercial agreement anchoring payment terms. | `[DOES NOT EXIST]` (`sales_orders`) |
| **Commercial Invoice & Payment** | Financial settlement, VAT accounting, and customer receipts. | `[DOES NOT EXIST]` (`invoices`, `payments`) |

---

### 3.2. Layer CC2: Shared Domain Layer (Used by Multiple Domains)

Elements shared across 2 or more fulfillment domains, explicitly mapping consumers:

| Shared Element | Domains Consuming It | Operational Purpose | Status in Repository |
| :--- | :--- | :--- | :--- |
| **Work Order & Routing** | Domains 1 (Made-to-Order), 2 (On-Site), 3 (Digital) | Shop-floor, crew, or lab execution instructions. | `[DOES NOT EXIST]` (`work_orders`) |
| **Shipping & Logistics Method** | Domains 1 (Made-to-Order), 5 (Resale), 6 (Rental) | Carrier, freight rate, and shipping tracking. | `[BUILT-AND-ORPHANED]` (`shipping_methods`) |
| **Milestone Payment Schedule** | Domains 1 (Made-to-Order), 2 (On-Site), 3 (Digital), 4 (Retainer) | Tranche payment breakdown (e.g. 30% Deposit, 70% Completion). | `[DOES NOT EXIST]` (`payment_schedules`) |
| **Asset Location & Site Address**| Domains 2 (On-Site), 5 (Resale), 6 (Rental) | Physical site address for crew dispatch or freight arrival. | `[EXISTS]` (`customer_accounts.address`) |
| **Branding Subcontractor Rates** | Domains 1 (Made-to-Order), 2 (On-Site) | Third-party decoration/branding vendor rate cards. | `[BUILT-AND-ORPHANED]` (`branding_rate_cards`, `branding_subcontractors`) |

---

### 3.3. Layer CC3: Single-Domain Layer (Unique to One Specific Domain)

Elements strictly isolated to a single fulfillment domain:

| Domain | Unique CC3 Element | Operational Purpose | Status in Repository |
| :--- | :--- | :--- | :--- |
| **Domain 1 (Made-to-Order)** | `product_variations` / BOM | Specific size/color/finish variation matrix & raw material links. | `[EXISTS]` (`product_variations`) |
| **Domain 2 (On-Site Service)** | `crew_dispatch_schedule` | On-site technician team assignment & site access permits. | `[DOES NOT EXIST]` |
| **Domain 3 (Digital Deliverable)**| `digital_access_token` | Secure single-use download URL & cryptographic asset hash. | `[DOES NOT EXIST]` |
| **Domain 4 (Ongoing Retainer)** | `recurring_billing_period` | Monthly SLA audit log & automated recurring billing cycle. | `[DOES NOT EXIST]` |
| **Domain 5 (Resale Stock)** | `inventory_reservation` | Warehouse bin location & stock reservation lock. | `[DOES NOT EXIST]` (`inventory_levels`) |
| **Domain 6 (Rental & Hire)** | `asset_return_inspection` | Rental asset check-out/check-in damage inspection log. | `[DOES NOT EXIST]` |

---

## 4. The Three CC1 Operational Primitives (Cheapest Honest Versions & Attack Analysis)

### 4.1. Primitive 1: Log Scrubbing at Error Boundary
- **Cheapest Honest Version**: A 15-line FastAPI middleware in `main.py` redacting tenant tokens, emails, and company names (`redact_tenant_data()`).
- **Attack & Defense**: Global `sys.excepthook` captures unhandled background worker exceptions before writing to logs.

### 4.2. Primitive 2: Usage Metering Against Package Limits
- **Cheapest Honest Version**: Atomic SQL updates on `tenant_counters` (`current_count < max_limit`).
- **Attack & Defense**: Race conditions defeated by atomic `UPDATE ... RETURNING` before insert.

### 4.3. Primitive 3: Asynchronous Job Queue (`pdf_queue`)
- **Cheapest Honest Version**: DB-native table `pdf_queue` polled via `FOR UPDATE SKIP LOCKED`.
- **Attack & Defense**: Worker crash timeouts reset via heartbeat query (`processing_started_at < NOW() - 5 min`).

---

## 5. The Document Chain & Explicit Linkage Model

```
[Inquiry Intake]
       │  (inquiries.id)
       ▼  [FK: quotes.inquiry_id]
[Commercial Quote] ──(Polymorphic Attachment)──> [attachments: Signed Spec PDF]
       │  (quotes.id)
       ▼  [FK: sales_orders.quote_id]
[Sales Order (Contract Claim)]
       │  (sales_orders.id)
       ├─────────────────────────────────────────┐
       ▼  [FK: work_orders.sales_order_id]      ▼  [FK: payment_schedules.sales_order_id]
[Work Order (Shop-Floor/Crew Exec)]       [Payment Schedule (Milestones)]
       │  (work_orders.id)                       │
       ▼  [FK: invoices.work_order_id]            ▼  [FK: invoices.payment_schedule_id]
[Commercial Invoice]
       │  (invoices.id)
       ▼  [FK: payments.invoice_id]
[Customer Payment Receipt]
```

---

## 6. The Four Operational Dates & The Clock Baseline

6.1. **The Four Key Dates Defined**:
1. **`specification_signed_at` (Date 1 — THE CLOCK BASELINE)**: Technical artwork/color sign-off UTC timestamp. **THE FULFILLMENT CLOCK RUNS FROM THIS DATE.**
2. **`required_ready_date` (Date 2)**: Target bench/factory completion date.
3. **`event_scheduled_at` (Date 3)**: Fixed date/time of customer event.
4. **`arrival_at_site_date` (Date 4)**: Site arrival/delivery date.

6.2. **The Dynamic Clock Calculation**:

$$\text{Promised Delivery Date} = \text{specification\_signed\_at} + \text{fulfillment\_lead\_time\_days}$$

---

## 7. The Automated Escalation Rule & Risk Warnings

7.1. **Escalation Levels**:
- **GREEN (NOMINAL)**: $T_{\text{avail}} \ge T_{\text{lead}} + 3$ days. Specification signed; production on track.
- **AMBER (SPECIFICATION DELAY WARNING)**: $T_{\text{avail}} < T_{\text{lead}} + 2$ days AND `specification_signed_at` IS NULL $\rightarrow$ Automated delay warning sent.
- **RED (CRITICAL DELIVERY RISK)**: $T_{\text{avail}} < T_{\text{lead}}$ AND `specification_signed_at` IS NULL $\rightarrow$ System auto-locks original delivery date, forcing customer revalidation.

---

## 8. Audit Summary of Existing vs. Missing Elements (Out of 53)

8.1. **Elements Breakdown**:
- **`[EXISTS]`**: 13 elements (`inquiries`, `quotes`, `quote_lines`, `catalog_items`, `price_list_lines`, `customer_accounts`, `users`, `product_variations`, `attachments`, `events`, `navigation_menu_items`, `backlog_registry`, `status_library`).
- **`[BUILT-AND-ORPHANED]`**: 6 elements (`state_transitions`, `shipping_methods`, `branding_rate_cards`, `branding_subcontractors`, `tenant_usage_logs`, `pdf_queue`).
- **`[DOES NOT EXIST]`**: 34 elements (`log_scrubbing_boundary`, `specification_signoffs`, `sales_orders`, `work_orders`, `work_order_lines`, `payment_schedules`, `invoices`, `payments`, `crew_dispatch_schedule`, `digital_access_tokens`, `inventory_reservations`, etc.).

---

## 9. Sequential Core Cycles Map (Inquiry Intake to Payment Settlement)

Implementation proceeds strictly in 7 Sequential Core Cycles. Each cycle combines Schema, Endpoint, and Screen in a single consolidated turn, and closes ONLY upon Reviewer SQL proof verification.

```
=================================================================================================================
CYCLE #  | PROCESS STEP            | SCHEMA TABLE(S)                 | ENDPOINT(S)             | CLEAN VIEWPORT
=================================================================================================================
Cycle 1  | Inquiry Intake          | inquiries                       | POST /api/v1/inquiries  | InquiryIntakeView.tsx [DONE]
Cycle 2  | Catalog & Pricing Offer | catalog_items, price_list_lines,| POST /api/v1/quotes     | CatalogueListView.tsx [DONE]
         |                         | quotes, quote_lines             |                         | QuoteBuilderView.tsx [DONE]
Cycle 3  | Spec Sign-Off & Clock   | specification_signoffs,         | POST /api/v1/quotes/    | SpecSignOffView.tsx [NEXT]
         | Baseline                | attachments                     | {id}/sign-spec          | 
Cycle 4  | Sales Order Claim       | sales_orders, state_transitions | POST /api/v1/quotes/    | SalesOrderClaimView.tsx
         |                         |                                 | {id}/accept-order       | 
Cycle 5  | Shop-Floor Work Order   | work_orders, work_order_lines   | POST /api/v1/sales-orders/| WorkOrderExecutionView.tsx
         |                         |                                 | {id}/work-orders        | 
Cycle 6  | Milestones & Invoicing  | payment_schedules, invoices,    | POST /api/v1/work-orders/| InvoiceMilestoneView.tsx
         |                         | invoice_lines                   | {id}/issue-invoice      | 
Cycle 7  | Payment Settlement      | payments                        | POST /api/v1/invoices/  | PaymentSettlementView.tsx
         |                         |                                 | {id}/record-payment     | 
=================================================================================================================
```

### 9.1. Detailed Cycle Proof Requirements for Reviewer Verification

1. **Cycle 1: Inquiry Intake & Qualification (`[COMPLETED & VERIFIED]`)**:
   - *Schema*: `public.inquiries`
   - *Endpoint*: `POST /api/v1/inquiries`
   - *Viewport*: `InquiryIntakeView.tsx`
   - *Reviewer SQL Proof*: `SELECT id, serial_code, customer_account_id, status_code FROM inquiries WHERE serial_code = 'INQ-001';` (VERIFIED: Row `08e26754`).

2. **Cycle 2: Product & Commercial Quote Offer (`[COMPLETED & VERIFIED]`)**:
   - *Schema*: `public.catalog_items`, `public.price_list_lines`, `public.quotes`, `public.quote_lines`
   - *Endpoint*: `POST /api/v1/quotes`
   - *Viewport*: `CatalogueListView.tsx` & `QuoteBuilderView.tsx`
   - *Reviewer SQL Proof*: `SELECT id, inquiry_id, customer_account_id, status_code, total FROM quotes;` (VERIFIED: Row `8602d87a`, total `8800.00 ₪`).

3. **Cycle 3: Technical Specification Sign-Off & Delivery Clock Baseline (`[NEXT EXECUTION TARGET]`)**:
   - *Schema*: `public.specification_signoffs` (NEW), `public.attachments` (EXISTING)
   - *Endpoint*: `POST /api/v1/quotes/{id}/sign-spec`
   - *Viewport*: `src/components/views/SpecSignOffView.tsx` (NEW CLEAN VIEW)
   - *Reviewer SQL Proof*: `SELECT id, quote_id, signed_by_name, specification_signed_at FROM specification_signoffs WHERE quote_id = '8602d87a';`

4. **Cycle 4: Commercial Contract Signing & Sales Order Claim (`[QUEUED]`)**:
   - *Schema*: `public.sales_orders` (NEW), `public.state_transitions` (EXISTING)
   - *Endpoint*: `POST /api/v1/quotes/{id}/accept-order`
   - *Viewport*: `src/components/views/SalesOrderClaimView.tsx` (NEW CLEAN VIEW)
   - *Reviewer SQL Proof*: `SELECT id, quote_id, order_number, status_code FROM sales_orders WHERE quote_id = '8602d87a';`

5. **Cycle 5: Shop-Floor Work Order Execution (`[QUEUED]`)**:
   - *Schema*: `public.work_orders` (NEW), `public.work_order_lines` (NEW)
   - *Endpoint*: `POST /api/v1/sales-orders/{id}/work-orders`
   - *Viewport*: `src/components/views/WorkOrderExecutionView.tsx` (NEW CLEAN VIEW)
   - *Reviewer SQL Proof*: `SELECT id, sales_order_id, work_order_number, status_code FROM work_orders WHERE sales_order_id = '...';`

6. **Cycle 6: Milestone Payment Schedule & Invoicing (`[QUEUED]`)**:
   - *Schema*: `public.payment_schedules` (NEW), `public.invoices` (NEW), `public.invoice_lines` (NEW)
   - *Endpoint*: `POST /api/v1/work-orders/{id}/issue-invoice`
   - *Viewport*: `src/components/views/InvoiceMilestoneView.tsx` (NEW CLEAN VIEW)
   - *Reviewer SQL Proof*: `SELECT id, sales_order_id, invoice_number, total_amount FROM invoices WHERE sales_order_id = '...';`

7. **Cycle 7: Payment Settlement & Customer Receipt (`[QUEUED]`)**:
   - *Schema*: `public.payments` (NEW)
   - *Endpoint*: `POST /api/v1/invoices/{id}/record-payment`
   - *Viewport*: `src/components/views/PaymentSettlementView.tsx` (NEW CLEAN VIEW)
   - *Reviewer SQL Proof*: `SELECT id, invoice_id, amount_paid, payment_reference FROM payments WHERE invoice_id = '...';`
