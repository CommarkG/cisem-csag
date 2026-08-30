# Implementation Plan: MedusaJS Client Adapter Integration

This document details the architectural blueprint and design contract for the **CISEM MedusaJS Client Adapter** and database synchronization.

---

## 1.0 Proposed Architecture & Design

### 1.1 The MedusaJS Client Adapter Module (lib/MedusaClientAdapter.ts)
We will create a typescript boundary adapter to handle headless e-commerce inventory sync, category queries, and pricing quote bindings:
* **File Name**: `2026-08-11__AntigravityLocal__YarivHuman__MedusaClientAdapter__V1.0.ts` (conforming to naming policies).
* **Reasoning Header**: Include the mandatory reasoning header block linking to parent axioms and ratified plans.
* **SaaS Tenant Context Propagation**: Automatically sign context headers with symmetric keys using the HMAC signature methods inside `tenant_context.ts` before dispatching boundary requests.
* **Client Handshakes**:
  * `fetchProducts(tenantId?: string)`: Queries `/api/v1/medusa/products`.
  * `fetchQuotes(tenantId?: string)`: Queries `/api/v1/medusa/quotes`.
  * `syncCatalogItem(item: any, tenantId?: string)`: Push/Upsert inventory items to Medusa.
  * `createQuote(quoteItem: any, tenantId?: string)`: Creates e-commerce pricing quotes.

### 1.2 Catch-All API Gateway Mock Mappings (route.ts)
To support development workflows when the python catalog service is offline:
* Add proxy endpoints for `medusa/products` and `medusa/quotes` in `src/app/api/v1/[...path]/route.ts`.
* Seed standard e-commerce mock inventories (e.g. Cat numbers, VAT rates, stock status logs).

---

## 2.0 Four-Question Checkpoint

1. **What already exists?**
   * Catch-all proxy at `src/app/api/v1/[...path]/route.ts`.
   * Signed tenant context validator at `src/lib/tenant_context.ts`.
2. **Where should this belong?**
   * The Client Adapter belongs in `src/lib/` as `2026-08-11__AntigravityLocal__YarivHuman__MedusaClientAdapter__V1.0.ts`.
3. **What will this affect?**
   * Integrates e-commerce data queries, unblocking Phase 2 inventory synchronization features.
4. **What is the smallest executable proof that validates this decision?**
   * Build compile success (`npm run build`) and type check verification.

---

## 3.0 Proposed Changes

### main_application

#### [NEW] [MedusaClientAdapter.ts](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/lib/2026-08-11__AntigravityLocal__YarivHuman__MedusaClientAdapter__V1.0.ts)
* Create the client adapter containing CRUD actions for products and quotes scoped to the tenant context.

#### [MODIFY] [route.ts](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/app/api/v1/%5B...path%5D/route.ts)
* Add mock fallback handlers for `/medusa/products` and `/medusa/quotes`.

---

## 4.0 Verification Plan

### Automated Tests
* Run TypeScript validation:
  ```powershell
  npx tsc --noEmit
  ```
* Run Next.js build:
  ```powershell
  npm run build
  ```
