# CISEM Platform Process Framework & Three-Layer Architecture Specification
**Author**: Antigravity, Lead Architect  
**Authority**: Yariv, Governor of CISEM CsAg  
**Reviewer**: Claude, Technical Auditor  
**Date**: 2026-09-01  
**Version**: 1.3 (Ratified Specification Incorporating 3 Iterative Architecture Improvements)  

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

## 2. The Three Iterative Architecture Passes (Unaddressed Improvements Solved)

### 2.1. Iteration Pass 1: Multi-Currency FX Hedging & Landed-Cost Buffer (CC1 Universal)
- **What Would Have Been Built Wrong**: Quotes stored in ILS (`quotes.currency = 'ILS'`), but imported raw materials (e.g. European K9 Optic Crystal glass or specialized paper stock) are purchased in foreign currencies (EUR / USD). Exchange rate fluctuations between Quote Date and Production Date erode supplier gross margins or cause unrecoverable losses.
- **The Architecture Improvement**:
  - Store FX pricing metadata on quote line items: `cost_currency` ('EUR'), `quoted_currency` ('ILS'), `exchange_rate_at_quote`, and `fx_margin_buffer_pct` (e.g. 3.5%).
  - If EUR/ILS exchange rate fluctuates $> 5\%$ between Quote Date and `specification_signed_at`, the API boundary automatically triggers an `FX_REVALIDATION_REQUIRED` warning before shop-floor production start.

### 2.2. Iteration Pass 2: Technical Artwork Proof Revision Loops (Cycle 3 Improvement)
- **What Would Have Been Built Wrong**: Assuming a binary single sign-off step for technical artwork proofs. In real B2B manufacturing, technical proofing involves 2-3 revision rounds (e.g. "Enlarge logo", "Adjust laser engraving depth", "Change font").
- **The Architecture Improvement**:
  - Model technical proofing as a versioned revision loop (`specification_revisions`: `revision_number: 1, 2, 3`).
  - Revision Lifecycle States: `spec_issued` $\rightarrow$ `revision_requested` (Customer attaches feedback notes) $\rightarrow$ `spec_reissued` $\rightarrow$ `spec_signed`.
  - The delivery clock baseline (`specification_signed_at`) is captured ONLY when the customer executes final digital sign-off on the ratified revision!

### 2.3. Iteration Pass 3: Partial Shipments & Multi-Site Delivery Scheduling (CC2 Shared Layer)
- **What Would Have Been Built Wrong**: Assuming a 1-to-1 link between Work Order, Invoice, and Delivery. In B2B orders (e.g. 10,000 conference notebooks or 500 trophies), buyers frequently require split deliveries across multiple dates or venues (e.g. 200 units to Tel Aviv HQ on March 1st, 800 units to Jerusalem conference venue on March 15th).
- **The Architecture Improvement**:
  - Model `delivery_schedules` as a child table under `sales_orders` with columns `(quantity_allocated, target_site_address, scheduled_arrival_date, fulfillment_status)`.
  - Invoices (`invoices`) can be issued against **Fulfilled Delivery Schedules** (Progressive Milestone Invoicing), matching partial shipments without breaking accounting integrity.

---

## 3. The Six Fulfillment Domains & Fulfillment Types

| Domain # | Domain Name | Fulfillment Code (`fulfillment_type`) | Operational Definition | Primary Deliverable |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Physical Made-to-Order** | `made_to_order` | Custom physical manufacturing or branding based on approved artwork/specs. | Physical custom goods (e.g. AGN Ltd trophies, branded notebooks) |
| **2** | **On-Site Service** | `on_site_service` | Labor and materials delivered at customer physical site. | Completed site work (e.g. painting a house, equipment installation) |
| **3** | **Digital Deliverable** | `digital_deliverable` | Electronic assets, code, or media generated and transferred online. | Digital files (e.g. software, design blueprints, media assets) |
| **4** | **Ongoing Service / Retainer**| `ongoing_retainer` | Periodic recurring labor or maintenance services. | SLA compliance & recurring service (e.g. monthly IT maintenance) |
| **5** | **Resale from Stock** | `resale_stock` | Off-the-shelf physical inventory picked and shipped from warehouse. | Stock inventory delivery (e.g. standard packaging boxes) |
| **6** | **Rental and Hire** | `rental_hire` | Temporary lease of physical assets returned after event window. | Asset lease & return (e.g. event lighting, staging equipment) |

---

## 4. The Three-Layer Architecture Model (CC1 / CC2 / CC3)

### 4.1. Layer CC1: Universal Platform Spine (Applies to ALL 6 Domains)

| Element Name | Architectural Role | Status in Repository |
| :--- | :--- | :--- |
| **Tenant Session Context** | Authenticated tenant claim (`customer_account_id`) governing RLS. | `[EXISTS]` (`customer_accounts`) |
| **Inquiry Intake** | Raw customer inquiry ingestion & requirement capture. | `[EXISTS]` (`inquiries`) |
| **Catalog Item & Pricing Basis** | Item master data & volume discount price list lines. | `[EXISTS]` (`catalog_items`, `price_list_lines`) |
| **Commercial Quotation & FX Buffer**| Binding price offer, FX margin buffer, tax, and currency. | `[EXISTS]` (`quotes`, `quote_lines`) |
| **Status Vocabulary Library** | Controlled 3-tier vocabulary for lifecycle state progression. | `[EXISTS]` (`status_library`) |
| **Polymorphic Attachments** | Cryptographic signed documents, artwork proofs, PO uploads. | `[EXISTS]` (`attachments`) |
| **State Transition Ledger** | Audit trail recording `from_state` $\rightarrow$ `to_state` transitions. | `[BUILT-AND-ORPHANED]` (`state_transitions`) |
| **Log Scrubbing Boundary** | Middleware redacting sensitive tenant data from error logs. | `[DOES NOT EXIST]` |
| **Usage Metering Subsystem** | Counter table tracking tenant resource usage against package limits. | `[BUILT-AND-ORPHANED]` (`tenant_usage_logs`) |
| **Database Job Queue** | DB-native async queue for slow tasks (`pdf_queue`). | `[BUILT-AND-ORPHANED]` (`pdf_queue`) |
| **Specification Sign-Off & Revisions**| Proof revision loop & technical sign-off clock baseline. | `[DOES NOT EXIST]` (`specification_signoffs`) |
| **Commercial Order Claim** | Binding commercial agreement anchoring payment terms. | `[DOES NOT EXIST]` (`sales_orders`) |
| **Commercial Invoice & Payment** | Financial settlement, VAT accounting, and customer receipts. | `[DOES NOT EXIST]` (`invoices`, `payments`) |

---

### 4.2. Layer CC2: Shared Domain Layer (Used by Multiple Domains)

| Shared Element | Domains Consuming It | Operational Purpose | Status in Repository |
| :--- | :--- | :--- | :--- |
| **Work Order & Routing** | Domains 1 (Made-to-Order), 2 (On-Site), 3 (Digital) | Shop-floor, crew, or lab execution instructions. | `[DOES NOT EXIST]` (`work_orders`) |
| **Multi-Site Delivery Schedules** | Domains 1 (Made-to-Order), 2 (On-Site), 5 (Resale), 6 (Rental) | Split delivery dates, site addresses, and partial dispatches. | `[DOES NOT EXIST]` (`delivery_schedules`) |
| **Shipping & Logistics Method** | Domains 1 (Made-to-Order), 5 (Resale), 6 (Rental) | Carrier, freight rate, and shipping tracking. | `[BUILT-AND-ORPHANED]` (`shipping_methods`) |
| **Milestone Payment Schedule** | Domains 1 (Made-to-Order), 2 (On-Site), 3 (Digital), 4 (Retainer) | Tranche payment breakdown (e.g. 30% Deposit, 70% Completion). | `[DOES NOT EXIST]` (`payment_schedules`) |
| **Asset Location & Site Address**| Domains 2 (On-Site), 5 (Resale), 6 (Rental) | Physical site address for crew dispatch or freight arrival. | `[EXISTS]` (`customer_accounts.address`) |
| **Branding Subcontractor Rates** | Domains 1 (Made-to-Order), 2 (On-Site) | Third-party decoration/branding vendor rate cards. | `[BUILT-AND-ORPHANED]` (`branding_rate_cards`, `branding_subcontractors`) |

---

### 4.3. Layer CC3: Single-Domain Layer (Unique to One Specific Domain)

| Domain | Unique CC3 Element | Operational Purpose | Status in Repository |
| :--- | :--- | :--- | :--- |
| **Domain 1 (Made-to-Order)** | `product_variations` / BOM | Specific size/color/finish variation matrix & raw material links. | `[EXISTS]` (`product_variations`) |
| **Domain 2 (On-Site Service)** | `crew_dispatch_schedule` | On-site technician team assignment & site access permits. | `[DOES NOT EXIST]` |
| **Domain 3 (Digital Deliverable)**| `digital_access_token` | Secure single-use download URL & cryptographic asset hash. | `[DOES NOT EXIST]` |
| **Domain 4 (Ongoing Retainer)** | `recurring_billing_period` | Monthly SLA audit log & automated recurring billing cycle. | `[DOES NOT EXIST]` |
| **Domain 5 (Resale Stock)** | `inventory_reservation` | Warehouse bin location & stock reservation lock. | `[DOES NOT EXIST]` (`inventory_levels`) |
| **Domain 6 (Rental & Hire)** | `asset_return_inspection` | Rental asset check-out/check-in damage inspection log. | `[DOES NOT EXIST]` |

---

## 5. The Document Chain & Explicit Linkage Model

```
[Inquiry Intake]
       │  (inquiries.id)
       ▼  [FK: quotes.inquiry_id]
[Commercial Quote (FX Buffer)] ──(Polymorphic Attachment)──> [attachments: Signed Spec PDF]
       │  (quotes.id)
       ▼  [FK: sales_orders.quote_id]
[Sales Order (Contract Claim)]
       │  (sales_orders.id)
       ├─────────────────────────────────────────┬────────────────────────────────────────┐
       ▼  [FK: work_orders.sales_order_id]      ▼  [FK: delivery_schedules.sales_order_id] ▼  [FK: payment_schedules.sales_order_id]
[Work Order (Shop-Floor/Crew Exec)]       [Multi-Site Delivery Schedules]          [Payment Schedule (Milestones)]
       │  (work_orders.id)                       │                                        │
       └─────────────────────────────────────────┴────────────────────────────────────────┘
                                                 │
                                                 ▼  [FK: invoices.delivery_schedule_id]
                                          [Commercial Invoice]
                                                 │
                                                 ▼  [FK: payments.invoice_id]
                                          [Customer Payment Receipt]
```

---

## 6. The Four Operational Dates & The Clock Baseline

6.1. **The Four Key Dates Defined**:
1. **`specification_signed_at` (Date 1 — THE CLOCK BASELINE)**: Technical artwork/color sign-off UTC timestamp on the final ratified proof revision. **THE FULFILLMENT CLOCK RUNS FROM THIS DATE.**
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

## 8. Sequential Core Cycles Map (Inquiry Intake to Payment Settlement)

```text
=================================================================================================================
CYCLE #  | PROCESS STEP            | SCHEMA TABLE(S)                 | ENDPOINT(S)             | CLEAN VIEWPORT
=================================================================================================================
Cycle 1  | Inquiry Intake          | inquiries                       | POST /api/v1/inquiries  | InquiryIntakeView.tsx [DONE]
Cycle 2  | Catalog & Pricing Offer | catalog_items, price_list_lines,| POST /api/v1/quotes     | CatalogueListView.tsx [DONE]
         |                         | quotes, quote_lines             |                         | QuoteBuilderView.tsx [DONE]
Cycle 3  | Spec Sign-Off & Artwork | specification_signoffs,         | POST /api/v1/quotes/    | SpecSignOffView.tsx [NEXT]
         | Proof Revision Loop     | specification_revisions         | {id}/sign-spec          | 
Cycle 4  | Sales Order Claim       | sales_orders, state_transitions | POST /api/v1/quotes/    | SalesOrderClaimView.tsx
         |                         |                                 | {id}/accept-order       | 
Cycle 5  | Shop-Floor Work Order & | work_orders, work_order_lines,  | POST /api/v1/sales-orders/| WorkOrderExecutionView.tsx
         | Delivery Scheduling     | delivery_schedules              | {id}/work-orders        | 
Cycle 6  | Milestones & Invoicing  | payment_schedules, invoices,    | POST /api/v1/work-orders/| InvoiceMilestoneView.tsx
         |                         | invoice_lines                   | {id}/issue-invoice      | 
Cycle 7  | Payment Settlement      | payments                        | POST /api/v1/invoices/  | PaymentSettlementView.tsx
         |                         |                                 | {id}/record-payment     | 
=================================================================================================================
```
