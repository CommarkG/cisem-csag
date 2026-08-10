# Master Completion Plan: Simulated User Journeys & Enterprise Skills Platform

1.1. **Introduction**:
Following the successful execution of CoreCycles 1–9, this comprehensive master plan zooms out to evaluate the entire platform. It reviews all systems starting from Core Cycle 1, focusing on completing loose ends by simulating the Admin/Operator user journey. Furthermore, it defines how the workspace assets built today (visual mapping, whitelabel gating, and partition auditing) can be transformed into hardwired skills and wired into an Enterprise-Level Skills Platform with explicit triggers.

---

## User Review Required

> [!IMPORTANT]
> - **Journey Gaps to Resolve**:
>   - *Brief-to-CRM Gap*: Scraped client briefs do not automatically instantiate deals in the sales pipeline stages.
>   - *Supplier-to-Design Gap*: Scraped subcontractor specifications (rate cards) do not dynamically calculate package costs inside the Design Studio.
>   - *Image-to-Vector Gap*: Visual product uploads do not trigger the multi-modal Gemini-to-HNSW embedding projection path.
> - **Skills Platform Architecture**:
>   - We will transition isolated utilities (dependency mapping, gate auditing, and partition checking) into canonical **Skills** under the `.agents/skills/` workspace root.
>   - A master configuration [`hooks.json`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/.agents/hooks.json) will define explicit trigger-action pathways, automatically invoking skills upon git changes, schema updates, or REST route additions.

---

## Open Questions

> [!NOTE]
> - **Q: How will the Skills Platform execute actions dynamically?**: It will resolve via local MCP servers and shell-level hooks. When a schema change is staged, the pgvector-partition-auditor skill will run pre-commit, blocking compilation if HNSW index or pruning structures are broken.

---

## Proposed Changes

### Component: Core Cycle Journey Completion (CC01 - CC09)

3.1. **Flow Integration & Gap Remediation**:
- **Brief Ingestor to CRM Deal (CC01 -> CC03)**:
  - Modify `scraper_engine.py` to auto-populate a corresponding deal entry in the `deals` database table upon successful parsing of a client brief.
- **Subcontractor Rate Cards to Design Studio (CC02 -> CC04)**:
  - Wire `pricing_engine.py` to fetch active rate cards from `branding_rate_cards` dynamically, calculating real branding margins in layout previews.
- **Multimodal Visual Embeddings Portal (CC04 -> CC09)**:
  - Connect visual image uploads in the sandbox portal to the `EmbeddingService.get_image_embedding` endpoint to index products in real-time.

---

### Component: Enterprise Skills Platform & Trigger Wiring

3.2. **Skill Definitions & Directory Setup**:

#### [NEW] [dependency-graph-visualizer](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/.agents/skills/dependency-graph-visualizer/SKILL.md)
- Create a hardwired skill for generating import maps. Maps `GraphifyDependencyMapper.py` outputs.

#### [NEW] [pgvector-partition-auditor](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/.agents/skills/pgvector-partition-auditor/SKILL.md)
- Create a hardwired skill for validating partitioned vector databases and HNSW indices.

#### [NEW] [hooks.json](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/.agents/hooks.json)
- Define structural triggers and wiring:
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
    }
  ]
}
```

---

## Verification Plan

4.1. **User Journey Simulation**:
- Log in to the mockup dashboard as an Admin.
- Ingest a client brief and verify that a new Deal card automatically populates the Sales CRM board.
- Edit a layout in the Design Studio and verify that branding prices dynamically scale according toGal Laser Netanya's active rate cards.
- Modify a schema SQL file and verify that the pre-commit hook runs `pgvector-partition-auditor` and exits with the correct status.
