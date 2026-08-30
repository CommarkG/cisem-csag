# CISEM CORE METHODOLOGIES, ROLES, INTER-WIRING & MECHANICAL ENFORCEMENT SPECIFICATION (V1.0)

> **Canonical Document Path**: `cisem_core/planning/2026-08-28__AntigravityLocal__YarivGovernor__Core_Methodologies_Roles_and_Enforcement_Specification__V1.0.md`  
> **Governor Ratification Target**: Yariv, Governor of CISEM CsAg  
> **Executing Agents**: Antigravity (CISEM Master Builder) & Reviewer Claude (CISEM Auditor)  
> **Master Purpose**: Remove human memory and informal verbal agreement from the critical path of platform correctness by hardwiring all methodologies into mechanical compiler gates (`cisem_gate.py`).

---

## 1. THE SIX PLATFORM METHODOLOGICAL ELEMENTS

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CORESPIRAL (Macro Spiral)                          │
│  "Evolutionary trajectory from initial intent to sustained platform value" │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                        CORECYCLE (Execution Loop)                     │  │
│  │   "Discrete, bounded cycle driving specific capabilities to impact"    │  │
│  │                                                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │                     CORESPINE (Control Plane)                    │  │  │
│  │  │   "Universal logic, schemas, linters, & verification engine"    │  │  │
│  │  │                                                                 │  │  │
│  │  │  ┌───────────────────────────────────────────────────────────┐  │  │  │
│  │  │  │                    PIPELINE (Domain Workflow)             │  │  │  │
│  │  │  │   "End-to-end staged progression: Intent -> Sustained"   │  │  │  │
│  │  │  │                                                           │  │  │  │
│  │  │  │  ┌─────────────────────────────────────────────────────┐  │  │  │  │
│  │  │  │  │                PROTOCOL (Rules of Exchange)          │  │  │  │  │
│  │  │  │  │   "Non-optional step-by-step enforcement rules"     │  │  │  │  │
│  │  │  │  │                                                     │  │  │  │  │
│  │  │  │  │  ┌───────────────────────────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │         WIZARD / VIEWPORT (User Surface)      │  │  │  │  │  │
│  │  │  │  │  │   "Guided visual interaction driving TTV"     │  │  │  │  │  │
│  │  │  │  │  └───────────────────────────────────────────────┘  │  │  │  │  │
│  │  │  │  └─────────────────────────────────────────────────────┘  │  │  │  │
│  │  │  └───────────────────────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 1.1 CORESPIRAL (Macro Methodology)
- **Role**: Macro-evolutionary trajectory governing the long-term progression of the platform.
- **Goal**: Ensure every iteration expands platform capability without incurring technical or architectural debt.
- **Inputs**: Governor strategic mandates, system maturity audits (`CisemAuditor.py`), market requirements.
- **Outputs**: Sequence of numbered CoreCycles mapped to strategic milestones.
- **Mechanical Hardwiring**: `cisem_gate.py` **Phase 18** (3-Tier Scope Limits) & **Phase 0** (Turn Counter & Audit Due Floor/Ceiling).

---

### 1.2 CORECYCLE (Execution Unit)
- **Role**: Discrete, bounded execution loop that drives a specific set of capabilities to `validated_impact`.
- **Goal**: Complete a closed slice of work that unblocks dependent platform mechanisms.
- **Inputs**: Ratified CoreCycle implementation plan, prerequisite exit telemetry from prior cycles.
- **Outputs**: Validated code, green gate compilation, exit telemetry artifact (`cisem_core/snapshots/`).
- **Mechanical Hardwiring**: `cisem_gate.py` **Phase 6** (Plan Ingestion Validation) & **Phase 15** (Predecessor Prerequisite Verification).

---

### 1.3 CORESPINE / CONTROL PLANE (Central Orchestration)
- **Role**: Central governance engine (`cisem_core/`) containing universal schemas, linters, registries, and gates.
- **Goal**: Enforce system invariants, single-source-of-truth schemas, and zero-drift configurations.
- **Inputs**: Live repository state, database schema registry (`live_schema_registry.json`), rule files (`AGENTS.md`, `GEMINI.md`).
- **Outputs**: Compiler gate verdicts (ALLOW / WARN / BLOCK), linter violation logs, context pack exports (`.agents/reviewer/`).
- **Mechanical Hardwiring**: `cisem_gate.py` **Phase 1.5** (Gate Self-Integrity), **Phase 9** (Registry Checksums), **Phase 35** (Schema Alignment).

---

### 1.4 PIPELINE (Domain Workflow)
- **Role**: End-to-end staged progression (`P1.1` to `P1.10`) through which domain inquiries travel from initial intent to sustained value.
- **Goal**: Transform un-structured customer requests into signed work orders and executed projects.
- **Inputs**: Customer inquiry data (`POST /api/v1/inquiries`), tenant context (`TenantContext`), catalog items.
- **Outputs**: Verified work order records, audit telemetry, project records.
- **Mechanical Hardwiring**: `cisem_gate.py` **Phase 38** (Cumulative Route Surface & 401 Door-Knocking) & Playwright TRAP 4 pre-render tests.

---

### 1.5 PROTOCOL (Rules of Exchange)
- **Role**: Non-optional, step-by-step rules governing interactions between actors, agents, and system boundaries.
- **Goal**: Produce reliable outcomes from parties (human or AI) that are not individually reliable.
- **Inputs**: Inter-agent messages, API requests, allowlist files (`cisem_public_routes.txt`, `cisem_allowed_additions.txt`).
- **Outputs**: Cryptographically signed tenant sessions, verified headers, zero-fused allowlists.
- **Mechanical Hardwiring**: `cisem_gate.py` **Phase 22.5** (TypeScript Code Headers), **Phase 26** (Hardened Additions Reader), **Phase 28/29** (UUID Shape & DB Anti-Mock).

---

### 1.6 WIZARD / VIEWPORT (User Surface)
- **Role**: Guided frontend interface component leading users through structured intake, quote building, and onboarding.
- **Goal**: Minimize Time-To-Value (TTV) while guaranteeing 100% tenant isolation and zero console errors.
- **Inputs**: Authenticated user session, dynamic menu definitions (`dynamic_menu.tsx`), layout state (`Header.jsx`).
- **Outputs**: Clean UI renders, structured API payloads, validated user actions.
- **Mechanical Hardwiring**: `cisem_gate.py` **Phase 34** (Playwright Pre-Render Verification) & **Phase 31** (Inbound Reference & Router Mount Audit).

---

## 2. INTER-WIRING & WORKFLOW EXECUTIONS

2.1 **Top-Down Intent Flow**:
   `Governor Mandate` ──> `CoreSpiral Phase` ──> `CoreCycle Plan` ──> `CoreSpine Gate Check` ──> `Pipeline Execution` ──> `Protocol Verification` ──> `Viewport Render`

2.2 **Bottom-Up Enforcement Feedback**:
   `Viewport Event` ──> `Protocol Middleware Check` ──> `Pipeline API Handler` ──> `CoreSpine Compiler Gate (cisem_gate.py)` ──> `CoreCycle Exit Telemetry` ──> `CoreSpiral Milestone Advancement`

---

## 3. DUAL-AGENT GOVERNANCE PROTOCOL (ANTIGRAVITY & REVIEWER CLAUDE)

### 3.1 Shared Task Surface & Single Source of Truth
- Both agents operate from a single, deterministic task list: `cisem_core/live_task_registry.json`.
- `generate_reviewer_pack.py` automatically exports this JSON to `.agents/reviewer/TASK_SURFACE.md` on every turn.

### 3.2 Phase 40 Inter-Agent Compiler Gate
- `cisem_gate.py` contains **Phase 40** (`check_inter_agent_blocking_requests_gate`).
- If an open inter-agent request in `live_task_registry.json` is marked `BLOCKING` or `UNANSWERED_QUESTION` for > 1 turn, `cisem_gate.py` **BLOCKS COMPILATION**.
- **Effect**: Neither agent can bypass an open blocking question or task.

### 3.3 Consolidated Turn Template V8 Enforcement
- Both agents communicate using **Consolidated Turn Template V8** (7 fields total).
- Empty fields mean "ALL CLEAR / SILENT". Non-empty fields scream for attention.

---

## 4. SUMMARY COMPILER GATE MAPPING MATRIX

| Element | Governing Gate / Instrument | Enforcement Type | Failure Behavior |
|---|---|---|---|
| **CoreSpiral** | `cisem_gate.py` Phase 0 & 18 | Turn Floor/Ceiling & Scope Radius | Hard Block |
| **CoreCycle** | `cisem_gate.py` Phase 6 & 15 | Plan Ingestion & Prerequisite Exit Telemetry | Hard Block |
| **CoreSpine** | `cisem_gate.py` Phase 1.5, 9, 35 | Integrity Hash, Schema Registry & Checksums | Hard Block |
| **Pipeline** | `cisem_gate.py` Phase 38 & Playwright | Door-Knocking HTTP 401 & Route Surface | Hard Block |
| **Protocol** | `cisem_gate.py` Phase 22.5, 26, 28 | Header Annotations & Hardened Allowlist Parser | Hard Block |
| **Viewport** | `cisem_gate.py` Phase 31 & 34 | Playwright Snapshot & Unmounted Component Linter | Hard Block |
| **Inter-Agent Queue**| `cisem_gate.py` Phase 40 | Unanswered Question & Blocking Request Gate | Hard Block |

---
