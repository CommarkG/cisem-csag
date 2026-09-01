# CISEM Platform Process Framework & Three-Layer Architecture Specification
**Author**: Antigravity, Lead Architect  
**Authority**: Yariv, Governor of CISEM CsAg  
**Reviewer**: Claude, Technical Auditor  
**Date**: 2026-09-01  
**Version**: 1.4 (Ratified Specification with Corrected Cycle Order & Explicit Replacement Law)  

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

1.4. **THE EXPLICIT FRONTEND REPLACEMENT LAW**:
- **THE OLD VIEWPORTS ARE REPLACED, NOT PRESERVED. EVERY SCREEN IN THE CYCLE MAP IS BUILT NEW. NONE IS AN EXISTING FILE REUSED.**
- Six frontend repairs in three days produced working isolated components, but left the platform unusable because legacy viewports (`InquiryIntakeView.tsx`, etc.) retained fragile hardcoded fallbacks and broken router bindings.
- Every screen in the 7-Cycle Map is built completely new from scratch, following the proven pattern of `CatalogueListView.tsx` and `QuoteBuilderView.tsx`:
  1. Level 1 TypeScript definitions generated directly from schema (`database.types.ts`).
  2. Tenancy injected dynamically by session provider (zero hardcoded tenant fallbacks).
  3. Explicit conditional rendering (zero string invention; `NULL` data renders nothing).

1.5. **The Core Cycle Definition of Done**:
- Implementation proceeds in **Sequential Core Cycles**, carrying Schema, Endpoint, and Screen together in one consolidated turn.
- **A CYCLE IS DONE ONLY WHEN A PERSISTENT DATABASE ROW EXISTS THAT THE GOVERNOR CREATED ON HIS SCREEN AND THE REVIEWER HAS QUERIED DIRECTLY VIA SQL.**
- No cycle may be marked `[DONE]` based on screen rendering alone or seeded test data.

---

## 2. The Corrected Sequential Core Cycles Map & Execution Rationale

### 2.1. Why Cycle 1 (Inquiry Intake) MUST Run BEFORE Cycle 3

Reviewer Claude's correction is 100% accepted:
- **Cycle 1 is NOT DONE.** The inquiry row (`08e26754`) was seeded during initial migration, not created by Governor Yariv through a clean screen. When Governor Yariv tried to enter a new inquiry today, the legacy intake screen failed.
- **Why Cycle 1 Runs First**: Inquiry Intake is the front door of the entire platform. If the front door cannot capture a new customer request on screen, downstream quote building, spec sign-offs, and work orders have no real demand to process.
- **The Execution Order**:
  1. **Cycle 1 (FIRST)**: Build clean `InquiryIntakeView.tsx` from scratch $\rightarrow$ Governor Yariv creates a new live inquiry on screen $\rightarrow$ Reviewer Claude queries SQL row proof $\rightarrow$ Cycle 1 marked `[DONE]`.
  2. **Cycle 3 (SECOND)**: Build clean `SpecSignOffView.tsx` with artwork proof revision loops $\rightarrow$ Governor Yariv signs spec on screen $\rightarrow$ Reviewer Claude queries `specification_signoffs` row $\rightarrow$ Cycle 3 marked `[DONE]`.
  3. **Cycles 4, 5, 6, 7 (CONSECUTIVE)**: Sales Order Claim $\rightarrow$ Work Order Execution $\rightarrow$ Invoicing $\rightarrow$ Payment Settlement.

```text
===================================================================================================================
CYCLE #  | PROCESS STEP            | SCHEMA TABLE(S)                 | ENDPOINT(S)             | CLEAN VIEWPORT STATUS
===================================================================================================================
Cycle 1  | Inquiry Intake &        | inquiries                       | POST /api/v1/inquiries  | InquiryIntakeView.tsx
         | Qualification           |                                 |                         | [INCOMPLETE - FIRST TARGET]
Cycle 2  | Catalog & Pricing Offer | catalog_items, price_list_lines,| POST /api/v1/quotes     | CatalogueListView.tsx
         |                         | quotes, quote_lines             |                         | QuoteBuilderView.tsx [DONE]
Cycle 3  | Spec Sign-Off & Artwork | specification_signoffs,         | POST /api/v1/quotes/    | SpecSignOffView.tsx
         | Proof Revision Loop     | specification_revisions         | {id}/sign-spec          | [QUEUED AFTER CYCLE 1]
Cycle 4  | Sales Order Claim       | sales_orders, state_transitions | POST /api/v1/quotes/    | SalesOrderClaimView.tsx
         |                         |                                 | {id}/accept-order       | [QUEUED]
Cycle 5  | Shop-Floor Work Order & | work_orders, work_order_lines,  | POST /api/v1/sales-orders/| WorkOrderExecutionView.tsx
         | Delivery Scheduling     | delivery_schedules              | {id}/work-orders        | [QUEUED]
Cycle 6  | Milestones & Invoicing  | payment_schedules, invoices,    | POST /api/v1/work-orders/| InvoiceMilestoneView.tsx
         |                         | invoice_lines                   | {id}/issue-invoice      | [QUEUED]
Cycle 7  | Payment Settlement      | payments                        | POST /api/v1/invoices/  | PaymentSettlementView.tsx
         |                         |                                 | {id}/record-payment     | [QUEUED]
===================================================================================================================
```

---

## 3. Detailed Cycle Proof Requirements for Reviewer Verification

1. **Cycle 1: Inquiry Intake & Qualification (`[INCOMPLETE — FIRST TARGET FOR EXECUTION]`)**:
   - *Process Step*: Ingest raw customer inquiry via clean front-door viewport $\rightarrow$ qualify requirements.
   - *Schema*: `public.inquiries`
   - *Endpoint*: `POST /api/v1/inquiries`
   - *Clean Viewport*: `src/components/views/InquiryIntakeView.tsx` *(REPLACED & BUILT NEW FROM SCRATCH)*
   - *Reviewer SQL Proof*: `SELECT id, serial_code, customer_account_id, status_code FROM inquiries WHERE customer_account_id = '5f2bfda8-6ff1-483d-870e-14335a59915c' ORDER BY created_at DESC LIMIT 1;` *(Must return Governor-created row)*.

2. **Cycle 2: Product & Commercial Quote Offer (`[COMPLETED & VERIFIED]`)**:
   - *Process Step*: Connect inquiry to catalog variations and volume discount price list lines $\rightarrow$ generate binding quote.
   - *Schema*: `public.catalog_items`, `public.price_list_lines`, `public.quotes`, `public.quote_lines`
   - *Endpoint*: `POST /api/v1/quotes`
   - *Clean Viewports*: `src/components/views/CatalogueListView.tsx` & `src/components/views/QuoteBuilderView.tsx`
   - *Reviewer SQL Proof*: `SELECT id, inquiry_id, customer_account_id, status_code, total FROM quotes;` *(VERIFIED: Row `8602d87a`, total `8800.00 ₪`)*.

3. **Cycle 3: Technical Specification Sign-Off & Delivery Clock Baseline (`[QUEUED AFTER CYCLE 1]`)**:
   - *Process Step*: Buyer signs off on technical specification proof revision $\rightarrow$ records `specification_signed_at` and starts delivery lead-time clock.
   - *Schema*: `public.specification_signoffs` *(NEW)*, `public.specification_revisions` *(NEW)*, `public.attachments` *(EXISTING)*
   - *Endpoint*: `POST /api/v1/quotes/{id}/sign-spec`
   - *Clean Viewport*: `src/components/views/SpecSignOffView.tsx` *(NEW CLEAN VIEW)*
   - *Reviewer SQL Proof*: `SELECT id, quote_id, signed_by_name, specification_signed_at FROM specification_signoffs WHERE quote_id = '8602d87a';`

4. **Cycle 4: Commercial Contract Signing & Sales Order Claim (`[QUEUED]`)**:
   - *Process Step*: Buyer signs commercial quote contract $\rightarrow$ spawns Sales Order claim and audits state transition.
   - *Schema*: `public.sales_orders` *(NEW)*, `public.state_transitions` *(EXISTING)*
   - *Endpoint*: `POST /api/v1/quotes/{id}/accept-order`
   - *Clean Viewport*: `src/components/views/SalesOrderClaimView.tsx` *(NEW CLEAN VIEW)*
   - *Reviewer SQL Proof*: `SELECT id, quote_id, order_number, status_code FROM sales_orders WHERE quote_id = '8602d87a';`

5. **Cycle 5: Shop-Floor Work Order Execution (`[QUEUED]`)**:
   - *Process Step*: Sales Order triggers shop-floor Work Order instruction for custom manufacturing / crew dispatch.
   - *Schema*: `public.work_orders` *(NEW)*, `public.work_order_lines` *(NEW)*, `public.delivery_schedules` *(NEW)*
   - *Endpoint*: `POST /api/v1/sales-orders/{id}/work-orders`
   - *Clean Viewport*: `src/components/views/WorkOrderExecutionView.tsx` *(NEW CLEAN VIEW)*
   - *Reviewer SQL Proof*: `SELECT id, sales_order_id, work_order_number, status_code FROM work_orders WHERE sales_order_id = '...';`

6. **Cycle 6: Milestone Payment Schedule & Invoicing (`[QUEUED]`)**:
   - *Process Step*: Work Order milestone completed $\rightarrow$ generates milestone invoice line items.
   - *Schema*: `public.payment_schedules` *(NEW)*, `public.invoices` *(NEW)*, `public.invoice_lines` *(NEW)*
   - *Endpoint*: `POST /api/v1/work-orders/{id}/issue-invoice`
   - *Clean Viewport*: `src/components/views/InvoiceMilestoneView.tsx` *(NEW CLEAN VIEW)*
   - *Reviewer SQL Proof*: `SELECT id, sales_order_id, invoice_number, total_amount FROM invoices WHERE sales_order_id = '...';`

7. **Cycle 7: Payment Settlement & Customer Receipt (`[QUEUED]`)**:
   - *Process Step*: Customer settles invoice $\rightarrow$ records payment transaction and seals order.
   - *Schema*: `public.payments` *(NEW)*
   - *Endpoint*: `POST /api/v1/invoices/{id}/record-payment`
   - *Clean Viewport*: `src/components/views/PaymentSettlementView.tsx` *(NEW CLEAN VIEW)*
   - *Reviewer SQL Proof*: `SELECT id, invoice_id, amount_paid, payment_reference FROM payments WHERE invoice_id = '...';`
