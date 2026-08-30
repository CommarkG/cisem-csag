# MULTI-TOPIC CONTEXT WINDOW ORCHESTRATION SPECIFICATION (V1.0)

> **Document Type**: Master Architectural Addendum & Reviewer Handoff  
> **Canonical Path**: `cisem_core/planning/2026-08-28__AntigravityLocal__YarivGovernor__Multi_Topic_Context_Window_Orchestration_Specification__V1.0.md`  
> **Author**: Antigravity (CISEM Master Architect)  
> **Authority**: Yariv, Governor of CISEM CsAg  
> **Addressed To**: Reviewer Claude (CISEM Auditor) & Governor Yariv  
> **Core Principle**: *Single Governor Interface, Domain-Vault Context Isolation — Never force the Human Governor to manually route or manage context windows across specialized agent sessions.*

---

## 1. THE CONTEXT WINDOW VS. MULTI-TOPIC DILEMMA

### 1.1 The Human Governor's Friction
1.1.1 Enterprise platform development spans multiple distinct domain verticals:
- **Security & Database RLS** (Isolation, JWT claims, policies).
- **UX/UI & Viewports** (Single-line layout rules, accessibility, Playwright renders).
- **Control Plane & Gate Linters** (`cisem_gate.py`, AST scanners, registry checksums).
- **Pipeline & Business Logic** (Inquiry-to-Work Order workflow, sequence generators).

1.1.2 **The Single-Chat Failure Mode**: If all domain discussions occur in a single chat window, context windows quickly fill up, leading to context truncation, loss of early architectural decisions, high token costs, and agent memory degradation.

1.1.3 **The Multi-Chat Failure Mode**: If the Governor manually opens separate specialized chats (Security Chat, UX Chat, Schema Chat), the Governor is burdened with manual routing:
- *Which chat should this prompt go to?*
- *When should context from the Security chat be pulled into the Main chat?*
- *How do we prevent cross-domain state drift between separate chats?*

---

## 2. THE ARCHITECTURAL SOLUTION: DOMAIN-VAULT CONTEXT ROUTER

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        CISEM HUMAN GOVERNOR CONNECTIVE STUDIO                          │
│                         (Unified Multi-Domain Control Shell)                           │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│  HUMAN GOVERNOR (YARIV)                                                                │
│      │                                                                                 │
│      │  [Single Consolidated Input Bar with Domain Tag Selector: #security #ux #all]   │
│      ▼                                                                                 │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │                  PASS-THROUGH DOMAIN CONTEXT ROUTER (CONNECTIVE STUDIO)            │ │
│ └───────┬───────────────────────────┬───────────────────────────┬────────────────────┘ │
│         │                           │                           │                      │
│         ▼                           ▼                           ▼                      │
│ ┌───────────────┐           ┌───────────────┐           ┌───────────────┐              │
│ │   SECURITY    │           │     UX/UI     │           │ CONTROL PLANE │              │
│ │   CHANNEL     │           │   CHANNEL     │           │   CHANNEL     │              │
│ └───────┬───────┘           └───────┬───────┘           └───────┬───────┘              │
│         │                           │                           │                      │
│         ▼                           ▼                           ▼                      │
│ ┌───────────────┐           ┌───────────────┐           ┌───────────────┐              │
│ │ security_     │           │ ux_vault.json │           │ gate_vault.json              │
│ │ vault.json    │           │               │           │               │              │
│ └───────┬───────┘           └───────┬───────┘           └───────┬───────┘              │
│         │                           │                           │                      │
│         └───────────────────────────┼───────────────────────────┘                      │
│                                     │ (Compact Telemetry Summary Exports)              │
│                                     ▼                                                  │
│                     ┌──────────────────────────────┐                                   │
│                     │      MASTER TASK REGISTRY    │                                   │
│                     │  live_task_registry.json     │                                   │
│                     │  .agents/reviewer/           │                                   │
│                     │  TASK_SURFACE.md             │                                   │
│                     └──────────────────────────────┘                                   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. KEY ARCHITECTURAL MECHANISMS

### 3.1 Domain-Vault Context Isolation (Preventing Context Truncation)
- Each specialized domain session (Security, UX, Schema, Linters) maintains its own isolated conversation history and local context vault (`cisem_core/vaults/<domain>_vault.json`).
- Detailed technical debates (e.g. 40 turns on PostgreSQL RLS policy syntax) remain strictly inside the `Security` domain context window.

### 3.2 Automated Telemetry Summarization (Macro View)
- When a domain session ratifies a change or completes a task, it writes a compact, 2-line telemetry summary to `live_task_registry.json`.
- The **Macro View (`[ALL]`)** reads only the compact task registry summaries, keeping its context window light, clean, and permanently uncluttered by micro-debates!

### 3.3 Unified Governor Input Bar with Auto-Routing
- The Governor operates from **one single prompt interface**.
- The prompt bar features explicit domain tags (`#security`, `#ux`, `#schema`, `#gate`, `#all`).
- If no tag is selected, the Connective Studio uses a fast, local keyword parser (zero LLM overhead) to direct the prompt to the appropriate specialized agent session behind the scenes.

---

## 4. CONSOLIDATED COMPARISON MATRIX

| Dimension | Single Chat Window | Manual Multi-Chat Window | CISEM Domain-Vault Studio |
|---|---|---|---|
| **Context Window Health** | Poor (Fills up rapidly) | Good (Isolated) | **MAXIMUM (Isolated + Compact Summaries)** |
| **Governor Routing Burden** | Zero (Everything in one) | High (Manual switching) | **ZERO (Unified Interface + Auto-Tagging)** |
| **Cross-Domain Drift** | High (Context truncation) | High (Un-synced chats) | **ZERO (Single `live_task_registry.json` SSOT)** |
| **Token Cost** | Extremely High | Medium | **MINIMAL (Token-efficient vaults)** |

---

## 5. STANDALONE VERBATIM HANDOFF FOR REVIEWER CLAUDE

> **OFFICIAL HANDOFF FOR REVIEWER CLAUDE**:  
> "Reviewer Claude, Governor Yariv has specified the architectural solution for resolving the tension between **Context Windows vs Multi-Topic System Complexity**:  
>  
> **1. Domain-Vault Context Isolation**: Specialized agent sessions (Security, UX, Schemas, Control Plane) run in isolated domain contexts (`cisem_core/vaults/`), preventing micro-debates from clogging the main context window.  
> **2. Compact Telemetry Summaries**: Specialized channels export only compact, ratified task state summaries to `live_task_registry.json` and `.agents/reviewer/TASK_SURFACE.md`.  
> **3. Single Governor Interface**: The Human Governor operates from a single input interface in the Connective Studio, which routes prompts behind the scenes without forcing the Governor to manually switch windows or manage context budgets."

---
