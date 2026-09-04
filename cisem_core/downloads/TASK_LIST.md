# CISEM PLATFORM MASTER CONSOLIDATED TASK REGISTER
Document: `TASK_LIST.md`
Canonical Location: `CommarkG/cisem-communication-hub/TASK_LIST.md`
Repository: `https://github.com/CommarkG/cisem-csag`
Raw Mirror URL: `https://raw.githubusercontent.com/CommarkG/cisem-csag/main/cisem_core/planning/TASK_LIST.md`
Author: Reviewer Claude & Antigravity (Senior Builder)
Authority: Yariv, Governor of CISEM CsAg
Maturity: RATIFIED_TASK_REGISTER
Version: V1.0

---

## CONSOLIDATED TASK REGISTER WITH MANDATORY CONSENSUS STATUS (WHAT & HOW)

| # | ITEM SERIAL CODE | TASK DESCRIPTION | OWNER | STATE | CONSENSUS STATUS (WHAT) | CONSENSUS STATUS (HOW) | OPENED DATE | ORIGIN REFERENCE |
|---|---|---|---|---|---|---|---|---|
| **1** | `TASK-SYS-001` | **The People Model** (Separating Person from Login, 1,500 contacts directory, `auth_user_id` link, nested `tenant_job_positions`) | Reviewer / Builder | `OPEN` | **RATIFIED** | **IN_REVIEW (V1)** | 2026-09-02 | [MultiTenantPeopleModel V1.0](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/planning/2026-09-04__AntigravityLocal__YarivGovernor__MultiTenantPeopleModelResearchReport__V1.0.md) |
| **2** | `TASK-SYS-002` | **The Overnight Consolidation Engine** (4-question pass at 02:00 AM, `backlog_registry` 14 columns, pgvector suggestion pass) | Reviewer / Builder | `OPEN` | **RATIFIED** | **IN_REVIEW (V1)** | 2026-09-04 | [migrations.sql:L176](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/migrations.sql#L176) |
| **3** | `TASK-SYS-003` | **Document Spine V4.1 Pass 1 DDL Execution** (`cr_document_types` 7 rows, nullable capacity/domain columns advance) | Reviewer / Builder | `READY` | **RATIFIED** | **RATIFIED** | 2026-09-01 | [DocumentSpine V4.1](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/planning/2026-09-04__AntigravityLocal__YarivGovernor__CommunicationHubSpecificationAndResponse__V2.0.md) |
| **4** | `TASK-SYS-004` | **AI Router Integration Revival** (`/api/agent` route, cloud-hosted OpenRouter integration, Gemini 2.5/Claude 3.7 fallback) | Reviewer / Builder | `OPEN` | **RATIFIED** | **IN_REVIEW** | 2026-08-09 | [OpenRouterIntegration V1.0](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/archive/2026-08-09__AntigravityLocal__YarivHuman__Cloud_Hosted_OpenRouter_Integration_Plan__V1.0.md) |
| **5** | `TASK-SYS-005` | **Hard-Coding Sweep Enforcement** (Locking agent decisions into schema ENUMs, triggers, and Python carrier gates) | Antigravity | `OPEN` | **RATIFIED** | **RATIFIED** | 2026-09-04 | [AGENTS.md Position 1](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/AGENTS.md#L1-L89) |
| **6** | `TASK-SYS-006` | **3-Bucket Orphan Ingestion Pass** (Sorting 128 orphans: 48 0-row tables into gaps, 30 specs to archive, 16 to decision delta) | Antigravity | `QUEUED` | **RATIFIED** | **IN_REVIEW** | 2026-09-04 | `cisem_core/planning/` sweep |

---

## EXIT ROUTES LEGEND
- `DONE`: Implementation validated with green gate test pass.
- `PARKED [REASON]`: Parked in `PARKED_REGISTER.md` citing 1 of the 3 mandatory parking reasons.
- `RULED_OUT`: Explicitly ruled out by Governor Yariv.
