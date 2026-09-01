# CISEM Platform Process Framework & Three-Layer Architecture Specification
**Author**: Antigravity, Lead Architect  
**Authority**: Yariv, Governor of CISEM CsAg  
**Reviewer**: Claude, Technical Auditor  
**Date**: 2026-09-01  
**Version**: 2.0 (Ratified Specification with CR/EXT Prefixing, Stage Terminology & Dependency Rule)  

---

## 1. Executive Summary & Architectural Axioms

1.1. **The CR / EXT Contextual Invariant**:
- Every table, column, endpoint, clean viewport, vocabulary term, and planning element carries an explicit classification prefix: `CR_` (Core Universal) or `EXT_` (External Domain/Tenant Specific).
- **The Contextual Question**: *"Would a second tenant, in a different domain, need this?"*
  - **YES** $\rightarrow$ Classified as `CR_` (Core Universal).
  - **NO** $\rightarrow$ Classified as `EXT_<Domain>` (External Domain Specific).
  - **UNCLEAR** $\rightarrow$ Classified as `UNRULED` and escalated to Governor Yariv for ruling.

1.2. **The Dependency Direction Law (Crucial Enforcement)**:
- `CR_` objects may depend ONLY on `CR_` objects (`CR` $\rightarrow$ `CR`).
- `EXT_` objects may depend on `CR_` objects (`EXT` $\rightarrow$ `CR`).
- `EXT_` objects may depend on `EXT_` objects within their own domain (`EXT_MadeToOrder` $\rightarrow$ `EXT_MadeToOrder`).
- **`CR_` OBJECTS MAY NEVER DEPEND ON `EXT_` OBJECTS (`CR` $\rightarrow$ `EXT` IS STRICTLY PROHIBITED & REFUSED BY GATE!).**
- A database foreign key from a `CR_` table to an `EXT_` table is **REFUSED**. An import from a `CR_` code module to an `EXT_` module is **REFUSED**. A `CR_` API endpoint referencing an `EXT_` column is **REFUSED**.

1.3. **The Methodology vs. Business Process Terminology Invariant**:
- **CYCLE** is reserved strictly for **METHODOLOGY UNITS** (e.g. 10-persona audit cycle, continuous auditor loop cycle).
- **STAGE** is reserved strictly for **BUSINESS PROCESS STEPS** (Stage 1 to Stage 7 from Inquiry Intake to Payment Settlement).

1.4. **The Explicit Frontend Replacement Law**:
- **THE OLD VIEWPORTS ARE REPLACED, NOT PRESERVED. EVERY SCREEN IN THE STAGE MAP IS BUILT NEW. NONE IS AN EXISTING FILE REUSED.**
- Every screen in the 7-Stage Map is built completely new from scratch, following the proven pattern of `CatalogueListView.tsx` and `QuoteBuilderView.tsx`:
  1. Level 1 TypeScript definitions generated directly from schema (`database.types.ts`).
  2. Tenancy injected dynamically by session provider (zero hardcoded tenant fallbacks).
  3. Explicit conditional rendering (zero string invention; `NULL` data renders nothing).

1.5. **The Stage Definition of Done**:
- Implementation proceeds in **Sequential Business Process Stages**, carrying Schema, Endpoint, and Screen together in one consolidated turn.
- **A STAGE IS DONE ONLY WHEN A PERSISTENT DATABASE ROW EXISTS THAT THE GOVERNOR CREATED ON HIS SCREEN AND THE REVIEWER HAS QUERIED DIRECTLY VIA SQL.**

---

## 2. Audit & Prefixing of the Three Iteration Passes

| Iteration Pass | Subject | Contextual Question: "Would a 2nd tenant in another domain need this?" | Classification | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **Pass 1** | **Multi-Currency FX Hedging & Landed-Cost Buffer** | **YES**. A dentist buying equipment in EUR or a software agency billing in USD both need currency hedging. | **`CR_FXHedging`** | Financial currency protection is universal across all buying/selling transactions involving foreign currencies. |
| **Pass 2** | **Technical Artwork Proof Revision Loops** | **NO**. Only physical custom manufacturing or visual branding domains require artwork proofs. A dentist or ongoing IT retainer does NOT carry an artwork proof table! | **`EXT_MadeToOrder_ArtworkRevisions`** | Visual proofing is domain-specific. Placing it in `CR_` would force every dentist and software retainer to carry an artwork proof table. |
| **Pass 3** | **Multi-Site Split Delivery Scheduling** | **NO**. Physical manufacturing, resale, and rental domains ship physical packages across sites. Digital deliverables and ongoing retainers have no physical shipments! | **`EXT_Physical_SplitDeliveries`** | Split logistics apply only to physical fulfillment domains. |

---

## 3. The 7 Sequential Business Process Stages Map (Inquiry Intake to Payment Settlement)

```text
===================================================================================================================
STAGE #  | PROCESS STEP            | SCHEMA TABLE(S)                 | ENDPOINT(S)             | CLEAN VIEWPORT STATUS
===================================================================================================================
Stage 1  | CR_Inquiry Intake &     | cr_inquiries                    | POST /api/v1/inquiries  | InquiryIntakeView.tsx
         | Qualification           |                                 |                         | [INCOMPLETE - FIRST TARGET]
Stage 2  | CR_Catalog & Pricing    | cr_catalog_items,               | POST /api/v1/quotes     | CatalogueListView.tsx
         | Commercial Offer        | cr_price_list_lines, cr_quotes, |                         | QuoteBuilderView.tsx
         |                         | cr_quote_lines                  |                         | [COMPLETED & VERIFIED]
Stage 3  | EXT_MadeToOrder Spec    | ext_specification_signoffs,     | POST /api/v1/quotes/    | SpecSignOffView.tsx
         | Sign-Off & Artwork Loop | ext_specification_revisions     | {id}/sign-spec          | [QUEUED AFTER STAGE 1]
Stage 4  | CR_Sales Order Claim &  | cr_sales_orders,                | POST /api/v1/quotes/    | SalesOrderClaimView.tsx
         | State Transition Audit  | cr_state_transitions            | {id}/accept-order       | [QUEUED]
Stage 5  | EXT_ShopFloor Work      | ext_work_orders,                | POST /api/v1/sales-orders/| WorkOrderExecutionView.tsx
         | Orders & Split Delivery | ext_work_order_lines,           | {id}/work-orders        | [QUEUED]
         |                         | ext_delivery_schedules          |                         | 
Stage 6  | CR_Milestone Payment    | cr_payment_schedules,           | POST /api/v1/work-orders/| InvoiceMilestoneView.tsx
         | Schedule & Invoicing    | cr_invoices, cr_invoice_lines   | {id}/issue-invoice      | [QUEUED]
Stage 7  | CR_Payment Settlement & | cr_payments                     | POST /api/v1/invoices/  | PaymentSettlementView.tsx
         | Financial Receipt       |                                 | {id}/record-payment     | [QUEUED]
===================================================================================================================
```

---

## 4. Complete Audit & CR/EXT Prefixing of All 50 System Elements

```text
===========================================================================================================
ELEMENT NAME                      CONTEXTUAL QUESTION / DOMAIN SCOPE           CLASSIFICATION      STATUS
===========================================================================================================
1. customer_accounts              Universal tenant identity & RLS claim        CR_                 [EXISTS]
2. inquiries                      Universal buyer requirement intake           CR_                 [EXISTS]
3. catalog_items                  Universal item master data                   CR_                 [EXISTS]
4. price_list_lines               Universal volume discount pricing tiers      CR_                 [EXISTS]
5. quotes                         Universal binding price offer header         CR_                 [EXISTS]
6. quote_lines                    Universal offer line item & FX buffer        CR_                 [EXISTS]
7. status_library                 Universal 3-tier controlled vocabulary       CR_                 [EXISTS]
8. attachments                    Universal cryptographic PO & document upload CR_                 [EXISTS]
9. state_transitions              Universal audit ledger (from_state -> to)    CR_                 [BUILT-AND-ORPHANED]
10. log_scrubbing_boundary        Universal error boundary traceback filter    CR_                 [DOES NOT EXIST]
11. tenant_usage_logs             Universal resource counters vs limits        CR_                 [BUILT-AND-ORPHANED]
12. pdf_queue                     Universal DB-native async worker queue       CR_                 [BUILT-AND-ORPHANED]
13. sales_orders                  Universal binding commercial contract claim  CR_                 [DOES NOT EXIST]
14. payment_schedules             Universal tranche milestone breakdown        CR_                 [DOES NOT EXIST]
15. invoices                      Universal financial bill & VAT accounting    CR_                 [DOES NOT EXIST]
16. invoice_lines                 Universal invoice line item breakdown        CR_                 [DOES NOT EXIST]
17. payments                      Universal payment settlement & receipt       CR_                 [DOES NOT EXIST]
18. product_variations            Custom manufacturing size/color matrix       EXT_MadeToOrder     [EXISTS]
19. branding_rate_cards           Third-party decoration rate cards            EXT_MadeToOrder     [BUILT-AND-ORPHANED]
20. branding_subcontractors       Third-party decoration vendor profiles       EXT_MadeToOrder     [BUILT-AND-ORPHANED]
21. specification_signoffs        Technical artwork sign-off clock baseline    EXT_MadeToOrder     [DOES NOT EXIST]
22. specification_revisions       Technical proof iteration feedback loop      EXT_MadeToOrder     [DOES NOT EXIST]
23. work_orders                   Shop-floor manufacturing bench instruction   EXT_MadeToOrder     [DOES NOT EXIST]
24. work_order_lines              Shop-floor routing operation lines           EXT_MadeToOrder     [DOES NOT EXIST]
25. shipping_methods              Physical freight carrier & tracking rates    EXT_Physical        [BUILT-AND-ORPHANED]
26. delivery_schedules            Multi-site physical split shipment schedule  EXT_Physical        [DOES NOT EXIST]
27. inventory_levels              Warehouse bin location & stock reservation   EXT_ResaleStock     [DOES NOT EXIST]
28. crew_dispatch_schedule        On-site technician team assignment           EXT_OnSiteService   [DOES NOT EXIST]
29. digital_access_tokens         Single-use electronic asset download URL     EXT_Digital         [DOES NOT EXIST]
30. recurring_billing_period      Monthly SLA audit log & retainer cycle       EXT_OngoingRetainer [DOES NOT EXIST]
31. asset_return_inspections      Rental equipment check-in damage log         EXT_RentalHire      [DOES NOT EXIST]
===========================================================================================================
```

---

## 5. Elements Escalated as UNRULED (Awaiting Governor Ruling)

| Element Name | Architectural Function | Why Prefix Is Unclear (Escalated to Governor Yariv) | Recommended Resolution |
| :--- | :--- | :--- | :--- |
| **`entity_aliases`** | Polymorphic customer item SKU / barcode mapping | *Unclear Scope*: Does entity alias mapping apply to every tenant (`CR_`), or only to tenants dealing in physical goods with custom barcoding (`EXT_Physical`)? | **UNRULED** (Reviewer recommends `CR_` if customer SKU lookup is universal). |
| **`classification_nodes`** | Category hierarchy tree for catalog items | *Unclear Scope*: Is a multi-tier category tree universal for all services (`CR_`), or do digital retainers skip category trees (`EXT_`)? | **UNRULED** (Reviewer recommends `CR_` as standard catalog taxonomy). |
