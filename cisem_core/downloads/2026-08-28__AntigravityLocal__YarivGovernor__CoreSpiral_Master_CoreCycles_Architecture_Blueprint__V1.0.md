# MASTER CORESPIRAL & CORECYCLE ARCHITECTURAL BLUEPRINT (V1.0)

> **Architectural Authority**: Antigravity (CISEM Senior Builder & Master Architect)  
> **Governor Ratification Target**: Yariv, Governor of CISEM CsAg  
> **Canonical Path**: `cisem_core/planning/2026-08-28__AntigravityLocal__YarivGovernor__CoreSpiral_Master_CoreCycles_Architecture_Blueprint__V1.0.md`  
> **Core Principle**: *Keystone-First Sequencing — Complete what unblocks the maximum number of dependent mechanisms.*

---

## 1. EXECUTIVE SUMMARY & CORESPIRAL ARCHITECTURE

### 1.1 The CoreSpiral Paradigm
1.1.1 The CISEM platform evolves along an expanding, deterministic **CoreSpiral** that transitions the system from **Foundation Security & Isolation** (Spiral Phase 1) through **Deterministic Inter-Agent Collaboration** (Spiral Phase 2) to **End-to-End Core Pipeline Execution** (Spiral Phase 3) and finally **Continuous Self-Healing Optimization** (Spiral Phase 4).

1.1.2 Every stage of the CoreSpiral is broken down into discrete, non-overlapping **CoreCycles**. A CoreCycle is a closed execution loop containing a defined set of keystone tasks driven to `validated_impact` before the next CoreCycle activates.

---

## 2. THE 4 DETERMINISTIC CORECYCLES

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        CORESPIRAL EXPANSION                             │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ CORECYCLE 1: ZERO-TRUST BACKEND & DATABASE RLS HARDENING           │  │
│  │ (Session Context Injection -> RLS Overrides -> Batch FORCE RLS)   │  │
│  └─────────────────────────────────┬─────────────────────────────────┘  │
│                                    │                                    │
│                                    ▼                                    │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ CORECYCLE 2: DETERMINISTIC COLLABORATION & HARDENED QUEUE        │  │
│  │ (Inter-Agent Request Queue -> Gate Hard Block -> Batch Closure)   │  │
│  └─────────────────────────────────┬─────────────────────────────────┘  │
│                                    │                                    │
│                                    ▼                                    │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ CORECYCLE 3: CORECYCLE 1 INFRASTRUCTURE & UNIVERSAL ITP PIPELINE  │  │
│  │ (DDL V6.0 -> Inquiry-to-Project Flow -> Onboarding Viewport)      │  │
│  └─────────────────────────────────┬─────────────────────────────────┘  │
│                                    │                                    │
│                                    ▼                                    │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ CORECYCLE 4: SECONDARY FRAMEWORK AST LINTER & CONTINUOUS REPAIR    │  │
│  │ (Phase 39 AST Server Linter -> Gap Auto-Tagger -> 10-Persona)     │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 2.1 CORECYCLE 1 · ZERO-TRUST BACKEND & DATABASE RLS HARDENING (FOUNDATION SECURITY)

> **Objective**: Eliminate all cross-tenant data leak vectors at the database boundary and FastAPI middleware boundary before executing pipeline business logic.  
> **Keystone Unblocking Impact**: Unblocks 65 database tables, 100% multi-tenant API endpoints, and Governor DDL execution.

#### 2.1.1 Phase A · FastAPI PostgreSQL Session Context Injection
- **Action**: Update `auth_middleware` in `backend/src/backend/main.py`. Upon authenticating a valid JWT, execute `SET LOCAL app.current_tenant_id = :tenant_id` on the database session before executing the route handler.
- **Defeat Vector Defused**: Prevents queries from relying on raw client parameters or unauthenticated session context.

#### 2.1.2 Phase B · RLS Policy Service-Role Overrides
- **Action**: Update RLS policies across all 65 tables to explicitly check `(customer_account_id = current_tenant_id() OR auth.role() = 'service_role')`.
- **Defeat Vector Defused**: Ensures service-role connections respect tenant context unless explicit administrative override is active.

#### 2.1.3 Phase C · Batch `FORCE ROW LEVEL SECURITY` Across All 65 Tables
- **Action**: Execute batch DDL `ALTER TABLE <table> FORCE ROW LEVEL SECURITY;` across all 65 tables in PostgreSQL.
- **Defeat Vector Defused**: Prevents table owners and service-role bypasses from reading cross-tenant data.

---

### 2.2 CORECYCLE 2 · DETERMINISTIC INTER-AGENT COLLABORATION & QUEUE HARDENING

> **Objective**: Establish a friction-free, non-circular collaboration protocol between Antigravity (Builder) and Reviewer Claude (Auditor) backed by a hard-blocking compiler gate.  
> **Keystone Unblocking Impact**: Unblocks zero-drift inter-agent communication, eliminates un-read text archives, and activates single-session batch gap closure.

#### 2.2.1 Shared Live Task & Request Registry (`cisem_core/live_task_registry.json`)
- **Action**: Maintain a single JSON task registry synced automatically to `.agents/reviewer/TASK_SURFACE.md`.
- **Defeat Vector Defused**: Eliminates context drift between agent prompt histories.

#### 2.2.2 Hard-Blocking Gate Integration (Phase 40 in `cisem_gate.py`)
- **Action**: Add Phase 40 (`check_inter_agent_blocking_requests_gate`). If an open item in `live_task_registry.json` is marked `BLOCKING` or `UNANSWERED_QUESTION` for > 1 turn, `cisem_gate.py` **BLOCKS COMPILATION**.
- **Defeat Vector Defused**: Prevents the request queue from degrading into an un-read text archive like `PARKED.md`.

#### 2.2.3 Consolidated Grouping & Batch Closure Engine
- **Action**: Group related parked items by theme (`SECURITY`, `ROUTING`, `UX`, `SCHEMA`) and close them in dedicated batch sessions rather than escalating each gap individually (satisfying `PR-38500` & `PR-83500`).

---

### 2.3 CORECYCLE 3 · CORECYCLE 1 INFRASTRUCTURE & UNIVERSAL ITP PIPELINE

> **Objective**: Deploy CoreCycle 1 infrastructure DDL and activate the Universal Inquiry-to-Signed Work Order (ITP) pipeline for end-to-end user value.  
> **Keystone Unblocking Impact**: Unblocks real tenant onboarding, inquiry intake, quote building, and work order generation.

#### 2.3.1 DDL Migration V6.0 Execution
- **Action**: Governor executes `backend/src/backend/migrations_20260827_corecycle1_infrastructure.sql` V6.0 across all 66 registered tables.
- **Verification**: Verified via `cisem_gate.py` Phase 35.

#### 2.3.2 Universal Inquiry-to-Project (ITP) Pipeline End-to-End Flow
- **Action**: Connect `POST /api/v1/inquiries` -> `QuoteBuilderView` -> `WorkOrderAcceptanceView` with end-to-end `TenantContext` propagation.
- **Verification**: Playwright integration test suite validating guest intake through work order signature.

---

### 2.4 CORECYCLE 4 · SECONDARY FRAMEWORK AST SCANNER & CONTINUOUS SELF-HEALING

> **Objective**: Lock down the HTTP server surface and automate gap detection and self-healing.  
> **Keystone Unblocking Impact**: Unblocks 100% coverage against Defeat Vector 2 (secondary HTTP servers) and continuous repository maturity.

#### 2.4.1 Phase 39 · Secondary Framework AST Server Linter
- **Action**: Add Phase 39 to `cisem_gate.py`. AST scanner checks all `.py`, `.js`, `.ts` files for prohibited HTTP server instantiations (`http.server`, `flask`, `tornado`, `express`) outside FastAPI `main.py`.

#### 2.4.2 Auto-Gap Tagger & 10-Persona Audit Loop
- **Action**: Run `CisemAuditor.py` (10-persona panel) and auto-tag gaps (`[IMPROVEMENT.GAP]`) when outcome delta > 10%.

---

## 3. SUMMARY MATRIX OF CORECYCLES

| CoreCycle | Focus Area | Key Deliverables | Blast Radius | Dependent Unblocks |
|---|---|---|---|---|
| **CoreCycle 1** | **Foundation Security** | `SET LOCAL tenant_id`, RLS Overrides, Batch `FORCE RLS` | 65 Tables / Backend APIs | Unblocks CoreCycle 2, 3, 4 & Database Isolation |
| **CoreCycle 2** | **Inter-Agent Protocol** | Hardened Task Registry, Phase 40 Compiler Gate, Batch Gap Grouping | Compiler & Workflow | Unblocks Zero-Drift Communication & Reviewer Alignment |
| **CoreCycle 3** | **Universal ITP Pipeline** | DDL Migration V6.0, Guest Inquiry to Work Order, Onboarding Viewport | Full Product Surface | Unblocks User-Facing End-to-End Value |
| **CoreCycle 4** | **Self-Healing & AST Linter** | Phase 39 AST Server Linter, 10-Persona Audit, `[IMPROVEMENT.GAP]` | Static Analysis | Unblocks Defeat Vector 2 Defuse & Repo Maturity |

---
