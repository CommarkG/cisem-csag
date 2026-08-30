# ZERO-PROCESSING CONNECTIVE HUMAN GOVERNOR STUDIO SPECIFICATION (V1.0)

> **Canonical Document Path**: `cisem_core/planning/2026-08-28__AntigravityLocal__YarivGovernor__Zero_Processing_Connective_Governor_Studio_Specification__V1.0.md`  
> **Author**: Antigravity (CISEM Master Architect)  
> **Authority**: Yariv, Governor of CISEM CsAg  
> **Addressed To**: Reviewer Claude (CISEM Auditor) & Governor Yariv  
> **Core Principle**: *Zero-Processing Pass-Through — Never insert a middleman LLM layer between the Human Governor and full-depth primary agents.*

---

## 1. THE HUMAN GOVERNOR'S CORE PROBLEM & INSIGHT

### 1.1 The Context-Switching Friction
1.1.1 The Human Governor (Yariv) currently operates two deep, specialized AI systems in parallel:
- **Antigravity**: Primary Master Builder & Architect (Google Antigravity SDK Agent with full repository, terminal, and tool execution access).
- **Reviewer Claude**: Independent Auditor & Compliance Enforcer (Claude Code CLI / Anthropic Agent with live database and audit query access).

1.1.2 The current working method requires the Governor to manually switch between two separate command-line or IDE windows, manually relay handoff messages, compare transcript outputs, and manage distinct visual environments.

---

### 1.2 What Common Multi-Agent Solutions Get Wrong
1.2.1 Most commercial multi-agent platforms (e.g. AutoGen Studio, CrewAI UI, generic Chat Routers) insert an **active "Middleman LLM Orchestrator"** between the user and the primary agents.

1.2.2 **Why This Fails**:
- A middleman LLM distorts, summarizes, or dumbs down the raw, expert depth of both primary agents.
- It strips away direct tool execution telemetry, terminal PTY visibility, and exact file diffs.
- It creates a detached experience where the user is talking *about* the agents through an interpreter, rather than talking *directly* to the agents themselves.

---

### 1.3 The Zero-Processing Solution Mandate
1.3.1 The Governor does **NOT** want a model-switching router or an active middleman LLM.

1.3.2 The Governor **DOES** want a pure **Connectivity & Representation UX/UI Shell (Pass-Through Multiplexer)**:
- **Zero-Processing**: Deliberately contains **ZERO active LLM active brain layer** between the user and the agents.
- **Pass-Through Pipe**: Acts exactly like the Governor manually copying/pasting and inspecting outputs, but automates the visual piping, side-by-side split pane display, real-time transcript streaming, and compiler gate telemetry rendering.
- **Uncompromised Depth**: Preserves 100% of the raw, untamed depth, tool execution, and local system access of both Antigravity and Reviewer Claude intact.

---

## 2. ARCHITECTURAL DESIGN: THE PASS-THROUGH CONNECTIVE SHELL

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        HUMAN GOVERNOR CONNECTIVE STUDIO                                │
│                   (Zero-Processing Pass-Through Web Shell)                             │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│   HUMAN GOVERNOR (YARIV)                                                               │
│       │                                                                                │
│       │ [Single Consolidated Prompt Bar]                                              │
│       ▼                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │                    ZERO-PROCESSING CONNECTIVE PASS-THROUGH SHELL                 │  │
│  │     (Pure PTY Pipe / WebSocket Relay — NO LLM Interpretation / NO Distortion)    │  │
│  └───────────────────────────┬──────────────────────────────────┬───────────────────┘  │
│                              │                                  │                      │
│             Raw Pipe A       │                                  │ Raw Pipe B           │
│             (stdin/stdout)   │                                  │ (stdin/stdout)       │
│                              ▼                                  ▼                      │
│                ┌──────────────────────────┐       ┌──────────────────────────┐         │
│                │   ANTIGRAVITY (BUILDER)  │       │  REVIEWER CLAUDE (AUDITOR)│         │
│                │ (Full IDE & Tools Depth) │       │ (Full Database Audit)    │         │
│                └─────────────┬────────────┘       └─────────────┬────────────┘         │
│                              │                                  │                      │
│                              └────────────────┬─────────────────┘                      │
│                                               │                                        │
│                                               ▼                                        │
│                               ┌──────────────────────────────┐                         │
│                               │  SHARED COMPILER GATE & TASK │                         │
│                               │ live_task_registry.json      │                         │
│                               │ cisem_gate.py (38 Gates)     │                         │
│                               └──────────────────────────────┘                         │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. TECHNICAL IMPLEMENTATION OF THE CONNECTIVE SHELL

### 3.1 Architecture Components

1. **Local PTY Stream Relay (`cisem_core/tools/governor_relay_server.py`)**:
   - A lightweight 60-line Python/Node process using `node-pty` or Python `subprocess`/`asyncio`.
   - Spawns/attaches directly to the local PTY streams of:
     - Stream A: `Antigravity Process` (Google Antigravity SDK CLI / Local Agent).
     - Stream B: `Reviewer Claude Process` (`claude` CLI / Claude Code process).
   - Serves raw WebSocket / SSE events to `localhost:4321` with **zero text modification**.

2. **Frontend Pass-Through Studio (`src/components/views/GovernorConnectiveStudio.jsx`)**:
   - High-density Next.js split-pane viewport rendered at `http://localhost:4321/#/governor-studio`.
   - Left Pane: Live raw stream & terminal output of **Antigravity**.
   - Right Pane: Live raw stream & terminal output of **Reviewer Claude**.
   - Center Telemetry Bar: Real-time readout of `cisem_gate.py` (38 phases) and `live_task_registry.json`.

3. **Pass-Through Input Piping**:
   - Single prompt bar at the bottom with target selection buttons:
     - `[TO ANTIGRAVITY ONLY]` (Sends raw input string to Stream A).
     - `[TO REVIEWER ONLY]` (Sends raw input string to Stream B).
     - `[TO BOTH (DUAL PIPE)]` (Pipes raw input string simultaneously to both Stream A and Stream B).

---

## 4. PROS AND CONS MATRIX

| Architectural Property | Traditional Multi-Agent LLM Router | CISEM Zero-Processing Connective Shell |
|---|---|---|
| **Middleman Distortion** | High (LLM summarizes & alters prompts) | **ZERO** (Pure byte/text pass-through) |
| **System & Tool Depth** | Low (Agents accessed via restricted APIs) | **MAXIMUM** (Direct access to full CLI/tools) |
| **Context-Switching Friction** | High (Split across tabs or simplified UI) | **ZERO** (Side-by-side live split pane) |
| **Compiler Gate Telemetry** | Absent | **INTEGRATED** (Real-time `cisem_gate.py` readout) |
| **Implementation Effort** | Heavy (Complex graph engine required) | **LIGHTWEIGHT** (Simple PTY relay & Next.js view) |

---

## 5. STANDALONE REVIEWER HANDOFF SUMMARY

> **FOR REVIEWER CLAUDE (VERBATIM HANDOFF)**:  
> "The Human Governor (Yariv) has specified a requirement for a **Zero-Processing Connective Human Governor Studio**.  
>  
> **Key Invariant**: The solution must **NOT** introduce a third LLM router or middleman active brain. A middleman LLM strips the expert depth, tool execution, and direct system access of both Antigravity and Reviewer Claude.  
>  
> **The Solution**: A pure pass-through connectivity UX/UI shell (`GovernorConnectiveStudio.jsx` backed by a local PTY WebSocket relay). It pipes raw stdin/stdout streams directly between the Governor and both agents side-by-side, displaying real-time `cisem_gate.py` telemetry and `live_task_registry.json` without modifying or interpreting agent text."

---
