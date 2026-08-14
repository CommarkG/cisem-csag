---
metadata:
  owner: "CISEM_GOVERNOR"
  canonical_location: "C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\2026-08-10__AntigravityLocal__YarivHuman__Master_Completion_Plan_Simulated_User_Journeys_and_Enterprise_Skills_Platform_Plan__V1.1.md"
  artifact_status: "DRAFT"
  maturity: "WORKING_DRAFT"
  version: "1.1"
  role_type: "CANONICAL_MASTER_PLAN"
history:
  - timestamp: "2026-08-10T10:34:13Z"
    action: "CREATED_INITIAL_MASTER_COMPLETION_PLAN"
    actor: "GOOGLE_ANTIGRAVITY_ADAPTER"
    version: "1.0"
  - timestamp: "2026-08-10T13:44:00Z"
    action: "REVISED_MASTER_COMPLETION_PLAN_WITH_DETAILED_SPECS_AND_CRITICAL_REVIEW"
    actor: "GOOGLE_ANTIGRAVITY_ADAPTER"
    version: "1.1"
---

# Master Completion Plan: Simulated User Journeys & Enterprise Skills Platform

1.1. **Introduction**:
Following the execution of CoreCycles 1–9, this comprehensive master plan evaluates and integrates the complete CISEM system. The goal is to move the platform from a collection of isolated panels into an integrated, production-ready SaaS workflow. We achieve this by resolving three critical integration gaps, setting up an Enterprise-Level Skills Platform with trigger-action hooks, and implementing an automated Admin User Journey Simulation script to mathematically prove end-to-end flow integrity.

---

## 2. User Review Required

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

## 3. Detailed Proposed Changes

### 3.1. Gap 1: Brief Ingestor to CRM Deal Integration
3.1.1. **Objective**: Automate the creation and tracking of CRM deals directly from ingested customer briefs.
3.1.2. **Database Level**:
  - The `deals` table is defined in `migrations.sql` as:
    ```sql
    CREATE TABLE IF NOT EXISTS deals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
        brief_id UUID REFERENCES briefs(id) ON DELETE SET NULL,
        proposal_id UUID REFERENCES proposals(id) ON DELETE SET NULL,
        deal_stage VARCHAR(50) DEFAULT 'lead_ingestion' NOT NULL,
        deal_value DECIMAL(10,2) DEFAULT 0.00,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
        assigned_user_id UUID REFERENCES users(id) ON DELETE SET NULL
    );
    ```
  - We will leverage the seeded customer (`Acme HighTech LTD`) and contact (`David Cohen`) for default sandbox mapping when a raw brief is ingested.
3.1.3. **Backend API Changes**:
  - In `backend/src/backend/main.py`:
    - Create a new route `GET /api/v1/crm/deals`:
      - Queries the `deals` table joined with `contacts(name)` and `customer_accounts(company_name)`.
      - Returns a structured array conforming to the frontend contract:
        ```json
        {
          "deals": [
            {
              "id": "deal-uuid",
              "client": "Acme HighTech LTD",
              "agent": "David Cohen",
              "stage": "Lead Ingestion",
              "value": "24000.00",
              "date": "2026-08-10T10:00:00Z",
              "logs": "Ingested brief and partitioned chunks."
            }
          ]
        }
        ```
    - Update `POST /api/v1/briefs/qualify`:
      - After creating the brief and segmenting chunks, resolve the default contact ID (e.g., David Cohen's uuid).
      - Insert a new deal record into the `deals` table:
        ```python
        supabase.table("deals").insert({
            "contact_id": default_contact_id,
            "brief_id": brief_id,
            "deal_stage": "lead_ingestion",
            "deal_value": float(qty * budget)
        }).execute()
        ```
3.1.4. **Frontend Changes**:
  - In `src/app/page.tsx`:
    - Re-wire `fetchDeals` to call `GET /api/v1/crm/deals`.
    - Map the response fields directly to `crmDeals` React state.

---

### 3.2. Gap 2: Subcontractor Rate Cards & Form Realignment
3.2.1. **Objective**: Align Design Studio calculations with active rate cards from the database and correct front-end form submission paths.
3.2.2. **Form Re-wiring**:
  - In `src/app/page.tsx`, update `handleCreateSubcontractor`:
    - Submit the new subcontractor details to `POST /api/v1/subcontractors` with brackets mapping to setup fee and unit cost.
  - In `src/app/page.tsx`, update `handleCreateCustomer`:
    - Submit customer workspace details to `POST /api/v1/workspaces`.
3.2.3. **Pricing calculation**:
  - Modify `POST /api/v1/proposals/generate` to dynamically retrieve active rate cards from `branding_rate_cards` table based on the selected quantity tier, matching the logic in `pricing_engine.py`.

---

### 3.3. Gap 3: Multimodal Image-to-Vector Embedding Pathway
3.3.1. **Objective**: Support visual catalog search by indexing catalog images via Gemini Vision and pgvector partitions.
3.3.2. **Backend API Changes**:
  - In `backend/src/backend/main.py`, add `POST /api/v1/catalog/upload-image`:
    - Accepts file multipart uploads.
    - Sends the image to Gemini-2.5-Flash with the prompt: *"Describe this promotional item in detail, focusing on color, material, and target audience. Keep it under 100 words."*
    - Projects the text description to a 768-dimension vector using `text-embedding-004` model.
    - Saves the image metadata and embedding vector into `product_embeddings` table under the active tenant's partition.
3.3.3. **Frontend Changes**:
  - In `src/app/page.tsx`:
    - Add a file selector panel inside the Vector Search Sandbox.
    - Upload files via multipart form data and show the generated text description and pgvector partitioning results.

---

## 4. Enterprise Skills Platform Architecture

4.1. We will establish a unified skills execution model using `.agents/hooks.json` to monitor filesystem, database schema, and git activities, invoking hardwired skills in response.

4.2. **Directory Structure**:
```
.agents/
├── hooks.json
└── skills/
    ├── dependency-graph-visualizer/
    │   └── SKILL.md
    ├── pgvector-partition-auditor/
    │   └── SKILL.md
    ├── continuous-auditor/
    │   └── SKILL.md
    ├── registry-updater/
    │   └── SKILL.md
    ├── gate-keeper/
    │   └── SKILL.md
    └── admin-journey-simulator/
        └── SKILL.md
```

4.3. **Hooks Configuration (`hooks.json`)**:
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

## 5. Skills Platform Inventory (6 Canonical Skills)

### 5.1. `dependency-graph-visualizer`
- **Purpose**: Graph import dependencies to maintain codebase architecture.
- **Trigger**: File created in `cisem_core/` or `backend/`.
- **Input**: Path to root module.
- **Output**: Mermaid/D3 visualization and validation log of import restrictions.

### 5.2. `pgvector-partition-auditor`
- **Purpose**: Validate PostgreSQL partitioning and HNSW index status.
- **Trigger**: Schema file changes or migration runs.
- **Input**: Supabase connection parameters.
- **Output**: Count of active vector partitions, search latency statistics, index verification state.

### 5.3. `continuous-auditor`
- **Purpose**: Background daemon verifying lint, types, and compilation cycles.
- **Trigger**: Continuous cron or file modify events.
- **Input**: Workspace root.
- **Output**: Continuous health status report written to `cael_status.json`.

### 5.4. `registry-updater`
- **Purpose**: Automate tracking and versioning of files within `Universal_Workspace_and_Accountability_Registry`.
- **Trigger**: Git commit staging or manual execution.
- **Input**: Workspace file diffs.
- **Output**: Incremented registry versions and verified mapping hashes.

### 5.5. `gate-keeper`
- **Purpose**: Orchestrate LGG compliance gate verifications (0 to 18).
- **Trigger**: Staged pre-commit hooks or manual deploy check.
- **Input**: Git staging index.
- **Output**: Pass/Fail gate verification report.

### 5.6. `admin-journey-simulator`
- **Purpose**: Automate user journey scenarios on live APIs.
- **Trigger**: Post-deployment testing.
- **Input**: Backend/Frontend API root URLs.
- **Output**: Detailed execution pass/fail matrix of simulated user flows.

---

## 6. Admin User Journey Simulation Matrix

6.1. We will implement `cisem_core/platform_core/2026-08-10__CISEM__AntigravityLocal__UserJourneySimulator__V1.0.py` to programmatically run the following verification matrix:

| Step | Action | Endpoint Called | Expected Database State |
| :--- | :--- | :--- | :--- |
| **01** | Ingest client brief | `POST /api/v1/briefs/qualify` | New row in `briefs`, chunks in `document_chunks`. |
| **02** | CRM Deal verification | `GET /api/v1/crm/deals` | Deal created in `lead_ingestion` stage linked to brief. |
| **03** | Hybrid search items | `POST /api/v1/search` | Matched product vectors from correct tenant partition. |
| **04** | Proposal Generation | `POST /api/v1/proposals/generate` | Pricing calculated using active rate cards. |
| **05** | Deal Stage progression | `GET /api/v1/crm/deals` | Deal updated to `proposal_sent` with correct total value. |

---

## 7. Verification Plan

### 7.1. Automated Tests
- Execute the simulation script to test end-to-end integration:
  ```bash
  python cisem_core/platform_core/2026-08-10__CISEM__AntigravityLocal__UserJourneySimulator__V1.0.py
  ```

### 7.2. Manual Verification
- Deploy local development environment:
  ```bash
  npm run dev
  ```
- Access the mockup homepage at `http://localhost:3000`, ingest a brief containing budget and quantity constraints, verify that a deal appears in the CRM Kanban board, generate a proposal, and check the updated deal values.
