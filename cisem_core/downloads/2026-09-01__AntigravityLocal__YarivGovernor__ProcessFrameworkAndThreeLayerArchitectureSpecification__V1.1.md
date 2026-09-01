# CISEM Platform Process Framework & Three-Layer Architecture Specification
**Author**: Antigravity, Lead Architect  
**Authority**: Yariv, Governor of CISEM CsAg  
**Reviewer**: Claude, Technical Auditor  
**Date**: 2026-09-01  
**Version**: 1.1 (Ratified Draft Specification Incorporating CC1 Operational Primitives)  

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
| **Specification Sign-Off Record** | Formal buyer technical sign-off unlocking delivery clock. | `[DOES NOT EXIST]` |
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

## 4. The Three New CC1 Operational Primitives (Cheapest Honest Versions & Attack Analysis)

### 4.1. Primitive 1: Log Scrubbing at Error Boundary
- **Cheapest Honest Version**: A 15-line FastAPI middleware / error handling filter in `main.py` that intercepts exception tracebacks and sanitizes sensitive data (emails, JWT tokens, tenant UUIDs, company names) using regex string substitution before emitting log lines to `stdout` or log files.
- **The Attack Vector**: An unhandled exception inside a background async worker thread (outside the main HTTP request pipeline) bypasses FastAPI middleware, leaking tenant data to system error logs.
- **Mitigation / Defense**: Attach a global `sys.excepthook` and `asyncio` exception handler that routes ALL process exceptions through `redact_tenant_data()` before logging.

### 4.2. Primitive 2: Usage Metering Against Package Limits
- **Cheapest Honest Version**: A database counter table (`tenant_usage_logs` / `tenant_counters`) storing `(customer_account_id, metric_code, current_count)`. When an API action attempts to add a member or landing page, a PostgreSQL `BEFORE INSERT` trigger compares `current_count` against `packages.max_team_members`.
- **The Attack Vector**: Two parallel HTTP requests executed concurrently (`R1` and `R2`) both read `current_count = 4` (below limit `5`) before either commits, allowing both inserts to succeed and exceeding the limit (`6 > 5`).
- **Mitigation / Defense**: Use an atomic `UPDATE tenant_counters SET current_count = current_count + 1 WHERE customer_account_id = X AND current_count < max_limit RETURNING current_count;`. If 0 rows are updated, the action is refused immediately before insert.

### 4.3. Primitive 3: Asynchronous Job Queue (`pdf_queue` Subsystem)
- **Cheapest Honest Version**: A database-native table (`pdf_queue` / `async_jobs`) with columns `(id, customer_account_id, job_type, payload, status_code, processing_started_at, created_at)`. A lightweight Python background worker queries `WHERE status_code = 'queued' FOR UPDATE SKIP LOCKED`, executes PDF generation or email dispatch, and marks status as `'completed'` or `'failed'`.
- **The Attack Vector**: The worker process crashes or times out while processing a job, leaving `status_code = 'processing'` forever, trapping the job in limbo.
- **Mitigation / Defense**: Include a heartbeat timeout query in worker loop: `UPDATE async_jobs SET status_code = 'queued' WHERE status_code = 'processing' AND processing_started_at < NOW() - INTERVAL '5 minutes';`.

---

## 5. The Document Chain & Explicit Linkage Model

5.1. **Strict Linkage Law**:
- Core business document chains use **EXPLICIT FOREIGN KEYS** (`FK`) for $O(1)$ SQL index speed and DB referential integrity.
- Cross-cutting audit entities (`attachments`, `state_transitions`, `events`) use **POLYMORPHIC DYNAMIC LINKS** (`parent_type` + `parent_id`).

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
1. **`specification_signed_at` (Date 1 — THE CLOCK BASELINE)**: The exact UTC timestamp when the customer signs off on technical artwork, house paint colors, or digital scope. **THE FULFILLMENT CLOCK RUNS FROM THIS DATE.**
2. **`required_ready_date` (Date 2)**: The target date when production/service must be complete at factory/bench.
3. **`event_scheduled_at` (Date 3)**: The fixed date/time of the customer's event (e.g. conference on March 15th at 09:00 AM).
4. **`arrival_at_site_date` (Date 4)**: The date physical goods or service crews must arrive at customer site.

6.2. **The Dynamic Clock Calculation**:

$$\text{Promised Delivery Date} = \text{specification\_signed\_at} + \text{fulfillment\_lead\_time\_days}$$

---

## 7. The Automated Escalation Rule & Risk Warnings

7.1. **Window Tightening Formula**:
- Let $T_{\text{avail}} = \text{required\_ready\_date} - \text{CURRENT\_DATE}$ (in calendar days).
- Let $T_{\text{lead}} = \text{fulfillment\_lead\_time\_days}$ (standard lead time).

7.2. **Escalation Levels**:
- **GREEN (NOMINAL)**: $T_{\text{avail}} \ge T_{\text{lead}} + 3$ days. Specification signed; production on track.
- **AMBER (SPECIFICATION DELAY WARNING)**: $T_{\text{avail}} < T_{\text{lead}} + 2$ days AND `specification_signed_at` IS NULL.
  - *Automated Trigger*: Alert sent to Sales Agent & Customer: *"Technical specification sign-off is pending. Delivery date will slip by 1 day for every 24h delay."*
- **RED (CRITICAL DELIVERY RISK)**: $T_{\text{avail}} < T_{\text{lead}}$ AND `specification_signed_at` IS NULL.
  - *Automated Trigger*: System auto-locks original `required_ready_date`, forcing mandatory customer approval of revised delivery deadline before production start.

---

## 8. Audit Summary of Existing vs. Missing Elements (Out of 53)

8.1. **Elements Breakdown**:
- **`[EXISTS]`**: 13 elements (`inquiries`, `quotes`, `quote_lines`, `catalog_items`, `price_list_lines`, `customer_accounts`, `users`, `product_variations`, `attachments`, `events`, `navigation_menu_items`, `backlog_registry`, `status_library`).
- **`[BUILT-AND-ORPHANED]`**: 6 elements (`state_transitions`, `shipping_methods`, `branding_rate_cards`, `branding_subcontractors`, `tenant_usage_logs`, `pdf_queue`).
- **`[DOES NOT EXIST]`**: 34 elements (`log_scrubbing_boundary`, `specification_signoffs`, `sales_orders`, `work_orders`, `work_order_lines`, `payment_schedules`, `invoices`, `payments`, `crew_dispatch_schedule`, `digital_access_tokens`, `inventory_reservations`, etc.).
