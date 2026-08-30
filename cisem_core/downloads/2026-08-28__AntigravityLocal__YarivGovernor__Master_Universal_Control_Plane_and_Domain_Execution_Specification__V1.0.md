# MASTER UNIVERSAL CONTROL PLANE & DOMAIN EXECUTION SPECIFICATION (V1.0)

> **Document Type**: Master Architectural Specification & Reviewer Handoff  
> **Canonical Path**: `cisem_core/planning/2026-08-28__AntigravityLocal__YarivGovernor__Master_Universal_Control_Plane_and_Domain_Execution_Specification__V1.0.md`  
> **Author**: Antigravity (CISEM Master Architect)  
> **Authority**: Yariv, Governor of CISEM CsAg  
> **Addressed To**: Reviewer Claude (CISEM Auditor) & Governor Yariv  
> **Core Architectural Law**: *Strict Separation of Tiers — Never allow domain-specific execution details to contaminate the Universal Control Plane.*

---

## 1. EXECUTIVE ARCHITECTURAL SUMMARY

1.1 This document establishes a **strict two-layer architectural separation** governing the CISEM platform:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        TIER 1: THE UNIVERSAL CONTROL PLANE                             │
│         (Applies to ANY application, domain, or multi-agent human governance system)   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  1. Universal Human Governor Command Studio (Zero-Processing Pass-Through Web Shell)   │
│  2. Dual-Agent Connectivity (Builder PTY Stream + Auditor PTY Stream)                  │
│  3. Multi-Model Provider Selection (Anthropic / OpenAI / Gemini / Ollama per agent)    │
│  4. Inter-Agent Task Surface Sync (live_task_registry.json <-> TASK_SURFACE.md)        │
│  5. Hard-Blocking Compiler Gate Integration (Phase 40 Unanswered Question Gate)        │
│  6. Single-Session Batch Gap Closure (Consolidation over Escalation)                   │
└────────────────────────────────────────────────────────────────────────────────────────┘
                                           │
                                           │ Instantiates & Governs
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                      TIER 2: THE DOMAIN REFERENCE IMPLEMENTATION                       │
│                   (Corporate Gifting & Current Workstation Instance)                   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  1. CoreSpiral V3 & 4 CoreCycles (RLS Hardening -> Collaboration -> ITP -> AST Linter) │
│  2. CoreCycle 1 Infrastructure DDL V6.0 (66 PostgreSQL tables)                         │
│  3. Universal Inquiry-to-Signed Work Order Pipeline (P1.1 - P1.10)                     │
│  4. FastAPI Session Context Injection (SET LOCAL app.current_tenant_id)                │
│  5. External Public Allowlist (C:\Users\finky\secure\cisem_public_routes.txt)          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. TIER 1 · THE UNIVERSAL CONTROL PLANE (GENERIC MULTI-AGENT GOVERNANCE)

### 2.1 Universal Human Governor Command Studio (Zero-Processing Web Shell)
2.1.1 **The Problem**: A human user governing multiple specialized AI agents (a Builder agent like Antigravity and an Auditor agent like Reviewer Claude) suffers severe context-switching friction when jumping between separate terminal windows or IDE sidebars.

2.1.2 **The Architectural Principle**:
- **NO Middleman LLM Active Brain**: Commercial orchestrators (e.g. AutoGen Studio, CrewAI UI) insert an active manager LLM between the user and the primary agents. This distorts prompt intent, loses raw terminal streams, and strips away expert tool execution.
- **Pure Pass-Through Connectivity Shell**: The Universal Governor Studio is a **zero-processing PTY stream multiplexer**. It pipes raw `stdin`/`stdout` bytes directly between the Human Governor and both agents side-by-side with **zero LLM interpretation**.

2.1.3 **Universal Capabilities**:
- **Dual Stream Piping**: Side-by-side split panes for Builder and Auditor raw output streams.
- **Provider / Model Flexibility**: Dropdown selectors enabling the Human Governor to select any model (`Anthropic Claude`, `OpenAI GPT`, `Google Gemini`, or local `Ollama`) per agent.
- **Live Compiler Gate Telemetry**: Real-time readout of compiler gates (`cisem_gate.py`) rendered directly beside the agent streams.

---

### 2.2 Universal Inter-Agent Task Surface & Hard-Blocking Compiler Gate
2.2.1 **Single Task Surface**: Both agents operate from a single, deterministic task list (`cisem_core/live_task_registry.json`) auto-exported to `.agents/reviewer/TASK_SURFACE.md` on every turn.

2.2.2 **Phase 40 Compiler Hard Block**: `cisem_gate.py` contains Phase 40 (`check_inter_agent_blocking_requests_gate`). If an open item in `live_task_registry.json` is marked `BLOCKING` or `UNANSWERED_QUESTION` for > 1 turn, **COMPILATION IS BLOCKED**. Neither agent can bypass an open blocking question.

2.2.3 **Single-Session Batch Gap Consolidation**: When related gaps accumulate, they are grouped by theme and resolved in a single dedicated session rather than escalating each gap individually (satisfying `PR-38500` and `PR-83500`).

---

## 3. TIER 2 · THE DOMAIN REFERENCE IMPLEMENTATION (CURRENT INSTANCE)

### 3.1 CoreSpiral & 4 Deterministic CoreCycles

#### CoreCycle 1 · Zero-Trust Backend & Database RLS Hardening
- **Phase A**: FastAPI Session Context Injection (`request.state.tenant_id = tenant_id` in `main.py:324`). **Status: LANDED & COMMITTED (Git `0900f08`)**.
- **Phase B**: RLS Policy Service-Role Overrides (`USING (customer_account_id = current_tenant_id() OR auth.role() = 'service_role')`). **Status: DDL PREPARED (`migrations_20260828_rls_service_role_overrides.sql`)**.
- **Phase C**: Batch `ALTER TABLE <table> FORCE ROW LEVEL SECURITY;` across all 65 tables. **Status: DDL PREPARED (`migrations_20260828_rls_service_role_overrides.sql:75-90`)**.

#### CoreCycle 2 · Deterministic Inter-Agent Collaboration & Hardened Queue
- Live Task Surface synchronization (`TASK-001` through `TASK-007`).
- Phase 40 Compiler Hard Block activation.

#### CoreCycle 3 · CoreCycle 1 Infrastructure DDL & Universal ITP Pipeline
- DDL Migration V6.0 (`migrations_20260827_corecycle1_infrastructure.sql` — 66 tables).
- Universal Inquiry-to-Signed Work Order Pipeline (`POST /api/v1/inquiries` -> `QuoteBuilderView` -> `WorkOrderAcceptanceView`).

#### CoreCycle 4 · Secondary Framework AST Server Linter & Self-Healing Loop
- Phase 39 AST Scanner (`check_secondary_http_servers_gate`).
- 10-Persona Audit (`CisemAuditor.py`) & Auto-Gap Tagger (`[IMPROVEMENT.GAP]`).

---

## 4. STANDALONE VERBATIM REVIEWER HANDOFF SUMMARY

> **OFFICIAL MANDATORY HANDOFF FOR REVIEWER CLAUDE**:  
> "Reviewer Claude, this document contains the master specification ratified by Governor Yariv. It strictly separates the **Universal Control Plane** (Tier 1) from the **Domain Instance Execution Plan** (Tier 2):  
>  
> **1. Universal Control Plane (Tier 1)**:  
> - **Human Governor Connective Studio**: A zero-processing pass-through web shell that pipes raw stdin/stdout streams directly between Yariv and both agents without any middleman LLM distortion.  
> - **Shared Task Surface**: Single task list (`cisem_core/live_task_registry.json` <-> `.agents/reviewer/TASK_SURFACE.md`).  
> - **Phase 40 Compiler Gate**: `cisem_gate.py` hard-blocks compilation if any item remains marked `UNANSWERED_QUESTION` or `BLOCKING` for > 1 turn.  
>  
> **2. Domain Instance Execution Plan (Tier 2)**:  
> - CoreCycle 1 Phase A (`request.state.tenant_id`) is **LANDED & COMMITTED (Git 0900f08)**.  
> - CoreCycle 1 Phase B & C DDL migration is **PREPARED (`migrations_20260828_rls_service_role_overrides.sql`)** awaiting Governor path authorization."

---
