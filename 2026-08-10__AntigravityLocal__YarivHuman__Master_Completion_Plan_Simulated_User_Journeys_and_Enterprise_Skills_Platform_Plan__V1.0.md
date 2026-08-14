# Master Completion Plan: Simulated User Journeys & Enterprise Skills Platform

1.1. **Introduction**:
Following the execution of CoreCycles 1–9, this comprehensive master plan evaluates and integrates the complete CISEM system. The goal is to move the platform from a collection of isolated panels into an integrated, production-ready SaaS workflow. We achieve this by resolving three critical integration gaps, setting up an Enterprise-Level Skills Platform with trigger-action hooks, and implementing an automated Admin User Journey Simulation script to mathematically prove end-to-end flow integrity.

---

## User Review Required

> [!IMPORTANT]
> - **Concrete DDL Changes**:
>   - We will expose and query the active `deals` and `branding_rate_cards` tables which are currently defined in migrations but unreferenced in the frontend dashboard.
>   - We will create a GET endpoint for CRM deals to replace the hardcoded frontend mockup arrays.
> - **Frontend Dashboard Alignment**:
>   - The forms for registering subcontractors and workspaces will be re-wired from mock custom routes to the native `/api/v1/subcontractors` and `/api/v1/workspaces` backend endpoints.
>   - We will add an image upload widget to the catalog sandbox to test the visual embedding pathway.
> - **Skills Platform execution**:
>   - The `.agents/hooks.json` file will act as a contract for git and schema change triggers, verified via a pre-commit or daemon listener.

---

## Detailed Proposed Changes

### Component: Core Cycle Journey Completion (CC01 - CC09)

3.1. **Gap 1: Brief Ingestor to CRM Deal Integration**:
- Expose a new route `GET /api/v1/crm/deals` in `backend/src/backend/main.py` which joins the `deals` table with `contacts` and `customer_accounts` to return live pipeline details.
- Update `POST /api/v1/briefs/qualify` in `main.py` to create a live deal in the `deals` table under stage `lead_ingestion` linked to the parsed brief and default contact David Cohen.
- Update `fetchDeals` in `src/app/page.tsx` to retrieve deals from the new API route instead of hardcoding fallback mock data.

3.2. **Gap 2: Subcontractor Rate Cards & Form Realignment**:
- Update `handleCreateSubcontractor` in `src/app/page.tsx` to submit data to `POST /api/v1/subcontractors` instead of `/api/v1/schemas/custom`.
- Update `handleCreateCustomer` in `src/app/page.tsx` to submit data to `POST /api/v1/workspaces` instead of `/api/v1/schemas/custom`.
- Refactor proposal generation in `main.py` to calculate margins by dynamically matching quantity tiers against active subcontractor rate cards.

3.3. **Gap 3: Multimodal Image-to-Vector Embedding Pathway**:
- Add `POST /api/v1/catalog/upload-image` to `backend/src/backend/main.py` which processes image uploads, obtains visual descriptions from Gemini-2.5-Flash, generates a 768-dimension vector with `text-embedding-004`, and indexes it into the partitioned `product_embeddings` table.
- Add a file uploader widget in the Vector Search Sandbox of `src/app/page.tsx` to upload images and display query extraction results.

---

### Component: Enterprise Skills Platform & Trigger Wiring

3.4. **Skill Platform Setup**:
- Transition utilities and compliance engines into 6 canonical skills under `.agents/skills/`:
  - `dependency-graph-visualizer` (import graph mapping)
  - `pgvector-partition-auditor` (partition and HNSW check)
  - `continuous-auditor` (compilation and type monitoring)
  - `registry-updater` (yaml registry synchronizer)
  - `gate-keeper` (LGG gate auditor)
  - `admin-journey-simulator` (automated user flow runner)
- Define structural triggers in `.agents/hooks.json`:
  ```json
  {
    "hooks": [
      {
        "event": "file_modified",
        "pattern": "backend/src/backend/schema.sql",
        "action": "execute_skill",
        "skill": "pgvector-partition-auditor"
      },
      {
        "event": "file_created",
        "pattern": "cisem_core/**/*.py",
        "action": "execute_skill",
        "skill": "dependency-graph-visualizer"
      },
      {
        "event": "post_compile",
        "pattern": "**/*",
        "action": "execute_skill",
        "skill": "gate-keeper"
      }
    ]
  }
  ```

---

## Verification Plan

### Automated Tests
- Run the programmatically verified user journey simulator to validate end-to-end integration:
  ```bash
  python cisem_core/platform_core/2026-08-10__CISEM__AntigravityLocal__UserJourneySimulator__V1.0.py
  ```

### Manual Verification
- Deploy the Next.js and FastAPI environments:
  ```bash
  npm run dev
  ```
- Navigate to the sandbox portal, ingest a brief, check that the deal populates the CRM Kanban board, generate a proposal, and verify pricing details updates dynamically.
