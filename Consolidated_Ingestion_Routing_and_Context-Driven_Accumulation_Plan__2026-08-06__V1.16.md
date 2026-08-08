---
metadata:
  owner: "CISEM_GOVERNOR"
  canonical_location: "C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\Consolidated_Ingestion_Routing_and_Context-Driven_Accumulation_Plan__2026-08-06__V1.16.md"
  artifact_status: "DRAFT"
  maturity: "WORKING_DRAFT"
  version: "1.0"
  role_type: "IMPLEMENTATION_PLAN"
---

# Implementation Plan: Consolidated Ingestion Routing & Context-Driven Accumulation

**Document ID**: CISEM-IP-20260806-ACCUMULATED-DESIGN  
**Version**: 1.16  
**Date**: 2026-08-06  
**Status**: RATIFIED  
**Authority**: GOV-YARIV-20260806-ACCUMULATED-DESIGN-V1.16  

---

## 1. Goal Description

This plan gathers the design conclusions from our architectural discussion to establish the rules of the **Ingestion & Routing Engine**, the **Strict Compile Lock**, the **Context-Driven Accumulation Phase**, the **Dynamic Escalation Protocol**, the **Pondering Points reassessment pauses**, the **HEP vs. GRS Balance**, the **AI CoreSpine Audits Orchestrator**, and the **"Witness" Positioning Tracker**.

To eliminate premature coding and ensure holistic platform quality, we are executing a context-driven design gestation phase. During this period, we write no codebase files. Instead, we accumulate design details, evaluate repository-wide ripples, and formulate a consolidated blueprint.

---

## 2. Core Design Conclusions

### A. Universal Ingestion & Status Transition Matrix
All inputs (human, AI, or agent) pass through the Ingestion Engine and receive hardcoded status states verified by the Hardcoded Execution Pipeline (HEP):

```text
[Input Received] 
       │
       ▼ (status: raw_and_context)
[Context Router]
       ├──> [Active Match] ──> (status: aligned) ──> Append to active plan/thread
       └──> [No Match]     ──> (status: parked)  ──> Parking Vault 
                                                       │
                                                       ▼ (Triage Trigger)
                                                 (status: promoted) ──> Design Phase
                                                                            │
                                                                            ▼
                                                                     (status: draft_plan)
                                                                            │
                                                                            ▼ (Submit)
                                                                     (status: under_review)
                                                                            │
                                                                            ▼ (Governor signature)
                                                                     (status: ratified) 
                                                                            │ (Coding unlocks)
                                                                            ▼
                                                                     (status: executing)
                                                                            │
                                                                            ▼
                                                                     (status: validating)
                                                                            │
                                                                            ▼
                                                                     (status: completed)
                                                                            │
                                                                            ▼ (AI review pass)
                                                                     (status: verified)
                                                                            │
                                                                            ▼
                                                                  (status: promoted_to_core)
                                                                            │
                                                                            ▼ (E2E value test)
                                                                  (status: validated_impact)
```

### B. What Happens After "Aligns to Active Plan/Thread"?
When an incoming input is routed to an active plan or discussion context (`status: aligned`):
1.  **Semantic Synthesis**: An isolated AI pocket parses the segment, extracts core design points, and appends them to the active thread context.
2.  **Notification**: The system alerts the developer and the Governor of the new context.
3.  **Active Execution Re-Evaluation**:
    *   *If in Planning (`draft_plan`)*: The new details are simply merged into the active draft plan.
    *   *If in Coding/Validation (`executing` or `validating`)*: The system triggers an immediate **Pondering Pause (Reassessment Lock)**. Coding is locked. We must pause, assess the ripple impact of this new context on our running code (Scope 2), update the plan, and get the Governor's ratification before execution is unlocked again.

### C. Strict Compilation Gate
*   **Enforcement**: We replace the warning-based check in the gatekeeper script with a mandatory block:  
    > **"No coding is allowed out of a ratified plan and full ratification of Governor Yariv!"**
*   **Lock Mechanism**: The gate checks that the target plan has `status: RATIFIED` and `governor_signature: "GOV-YARIV-..."` on disk. If not, the build fails immediately.

### D. Complex Situation Re-Parking
*   If a task is evaluated against the **Core 3 Scopes** (Scope 2: Repo connections, Scope 3: Platform axioms) and is found to introduce deep complexities or architectural ripples, the system forbids immediate code fixes.
*   The task is re-routed back to the Parking Vault with the status `complex_under_review` to await analysis and consensus.

### E. Mechanical File Naming & Reference Checker
*   **Goal**: Prevent any unversioned or loose file references in documentation or plan updates.
*   **Mechanism**: We will update the sync compiler script [`CisemSync.py`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/CisemSync.py) to check all document content during builds:
    *   It parses the text to look for occurrences of key file basenames (e.g. `AxiomsAndPrinciples` or `Vocabulary`).
    *   If it finds a reference that does not match the strict versioned format, it halts execution and returns exit code `1`.

### F. AI-Pocket & Hardcoding Separation Architecture
*   **Hardcoding (Deterministic Skeleton - HEP)**: Core gates, watchers, state transitions, validation, and route registrations are strictly deterministic. They cannot be written or modified by AI.
*   **AI Pockets (Reasoning Nodes - GRS)**: AI is restricted to isolated call blocks wrapped in strict inputs/outputs schemas. AI pockets parse, translate, and review content but have zero authority to execute changes or alter the hardcoded skeleton.

---

## 3. Communication & Escalation Protocols

### A. Communication CoreSpine & AI CoreSpine Integration
All communication within the platform is mapped to Pillar 70000 and organized into four trunks:
1.  AI & Human (Native chat)
2.  AI & Human (External users)
3.  AI & Internal AI
4.  AI & External AI

The fourth trunk (**AI CoreSpine**) routes audit payloads dynamically:
*   **Internal Expert Personas**: Loads the 10 registered specialist configurations from [`persona_registry_draft.yaml`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/sandbox_code_review/persona_registry_draft.yaml).
*   **External AI Consultants**: Placeholder configurations mapping remote/third-party model adapters (OpenAI GPT, Google Gemini, Anthropic Claude, DeepSeek, Kimi) to verify critical audits.

### B. Gestation Delay Escalation
Parked items in `raw_and_context` status are tracked by the PE engine for accountability:
*   **Week 1**: Parked items are auto-prioritized in the Governor's daily triage digest.
*   **Week 2**: Priority promoted to `HIGH`, status set to `GESTATION_DELAYED`.
*   **Week 3**: The PE engine locks the creation of secondary enhancement tasks, blocking new work until the delayed backlog item is planned or resolved.

---

## 4. Priority CoreSpine Triage Matrix (Gating Rules)

We define a strict **Green-Light / Red-Light Matrix** to determine if a parked item in `raw_and_context` status is promoted to active planning or remains locked in gestation:

### A. The RED LIGHT (Triage Blocked / Must Remain Parked)
An item **cannot** be promoted if any of these conditions are met:
1.  **Low Conclusion Maturity**: If we only have one or two isolated reports of a request.
2.  **Active Focus Lock**: If active plans are currently in `executing` or `validating` status. We prohibit context switching during execution.
3.  **Consolidation Overlap**: If the item introduces new pathways that duplicate existing code.
4.  **Magnitude-Based Collection Block**: An AI pocket evaluates the structural magnitude of the proposed parked item. If it involves high-impact core changes (large blast radius), the system automatically raises the gestation threshold (e.g., requiring 5+ distinct mentions on disk before promotion is allowed).

### B. The GREEN LIGHT (Triage Promoted / Allowed to Move)
An item is promoted to `promoted` status and enters active planning if:
1.  **Critical Mass Reached**: The item has accumulated enough context references (meeting the magnitude-based threshold) to justify a single, consolidated plan.
2.  **Security and Safety Priority**: The item is tagged with a critical tag (e.g. `[SECURITY.BACKDOOR]`). This triggers immediate promotion.
3.  **Open Core Cycle**: All active plans have successfully reached `promoted_to_core` status, opening the window for new design tasks.

---

## 5. System Pondering Points & Audits Orchestration

To prevent fragmented development cycles, we implement **Pondering Points (AX-80000 / PR-83500)**:
*   **Trigger**: Automatically triggered when an active plan reaches completion (`promoted_to_core`), a major discussion concludes, or a plan is ratified. **Pondering pauses are strictly context-driven (maturity-based), not turn-bound.**
*   **The Reassessment Lock**: Upon trigger, the PE engine **locks all task queues and prevents all code writing**.
*   **The Audits Orchestrator (PR-58900)**: Coordinates all reviews via [`CisemAuditor.py`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/sandbox_code_review/CisemAuditor.py):
    1.  It automatically loads the 10 specialist personas.
    2.  It parses code changes, maps them against focus tags, and triggers the relevant experts.
    3.  It outputs a consolidated report (`orchestration_trial_report.json`) and blocks execution if any persona raises a `CRITICAL` or `HIGH` warning.
*   **The Triage & Regroup Protocol (PR-84500)**:
    1.  *Park Gestating Items*: Identify all inputs or issues that lack complete reference maturity or consensus, update their context files, and save them in the Parking Vault with status `parked`.
    2.  *Multi-Persona Review*: Run mature design files through the Audits Orchestrator to confirm platform value before coding is unlocked.
*   **Release**: The lock is only released when the Governor ratifies the reassessment and clicks "Resume Engine" on the Threshold portal.

---

## 6. Reconciling the Polarities (Planning vs. Executing)

To resolve the tension between developer velocity (executing polarity) and architectural safety (planning polarity), the platform implements two mechanisms:

### A. The Dynamic Polarity Shift (PR-83800)
The platform operates under two isolated workspace modes:
*   **GRS Sandbox Branching (Developer Agility)**: Developers can experiment, edit files, and compile freely in an isolated sandbox branch without needing Governor signatures or active execution locks. Auditing personas run asynchronously in the background to provide suggestions without blocking momentum.
*   **HEP Staging Promotion (Strict Gating)**: The moment sandbox changes are merged or promoted to the main staging area, the system shifts to strict HEP enforcement. Pre-execution compile gates activate, Pondering Point locks freeze task claims, and the Governor and Audits Orchestrator verify plan compliance and cryptographic signatures.

### B. Variable Gate Severity Threshold (PR-13980)
The LGG compiler gate evaluates the blast-radius of a change to prevent velocity bottlenecks:
*   *Low-Impact Changes*: Simple text modifications or CSS visual updates bypass the compilation ratification block and compile immediately (while logging the change in the Weekly Review Registry).
*   *High-Impact Changes*: Code modifications that affect database locks, network connections, or route registries are blocked until full ratification.

---

## 7. Virtual Simulation Findings & Audit Report

We conducted a mock trial of our Audits Orchestrator executing reviews on three target scenarios to identify structural improvements:

### Scenario A: Low-Risk UI Tweak
*   *Simulation*: Developer modified a button class but had no ratified plan.
*   *Result*: The compiler gate successfully bypassed the compile block because the blast-radius was calculated as low (only a `UI` styling tag modification), preserving developer velocity.

### Scenario B: Silently Overlapping Database Lock
*   *Simulation*: Developer wrote a custom database transaction wrapper.
*   *Result*: The orchestrator blocked the compile because the `CONSOLIDATION` persona detected that a shared lock utility already exists in the utility registry.
*   *Enhancement*: The orchestrator has been updated to output the **exact file path and line number** of the existing SSOT component to guide the developer to reuse rather than just blocking them.

### Scenario C: External AI Consultant API Latency
*   *Simulation*: Orchestrator attempted to query remote Claude/Gemini placeholders to audit a security patch.
*   *Result*: Remote API calls caused a local build delay of over 6 seconds.
*   *Enhancement*: Remote consultant queries must be executed **asynchronously in the background**. The LGG compiler gate only checks local, cached validation tokens, preventing network latency from freezing development.

---

## 8. The 10-Turn Persona Triage Experiment & Trial Plan

To evaluate the real-world value, stability, and developer velocity impact of our 10-persona panel and Audits Orchestrator, we initiate a 10-turn experimental trial sequence starting from this turn:

### A. Trial Sequence Parameters
*   **Baseline Turn**: This turn (Turn 0 of the trial).
*   **Target Reflection Turn**: 10 turns from now (Turn 10).
*   **Audited Actions**: Every subsequent code mock, design update, or file write will be processed through [`CisemAuditor.py`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/sandbox_code_review/CisemAuditor.py).
*   **Audit Metric Records**: The system will log metrics to `orchestration_trial_report.json` tracking:
    1.  *Total Persona Triggers*: Count of times specific personas (Security, UI, SSOT, Stability, etc.) were invoked.
    2.  *False Positives / Blockages*: Percentage of builds blocked by GRS auditing logic.
    3.  *Compile Latency Overhead*: Execution time of the orchestrator run (aiming for <150ms locally).

### B. Verification Plan (10 Turns Out)
At the target reflection turn, the agent will compile a **Persona Triage Reflection Report** detailing:
*   Actual trigger counts and findings logs on disk.
*   Stability and scalability audits of the local watcher daemon under persona restrictions.
*   Formal recommendation on whether to enable full, active API adapters for external consultants or keep them as placeholders.

---

## 9. Proposed Changes: "Witness" Positioning Tracker

To implement the first mature design requirement, we will update the local watcher daemon `CxpWatcher.py` with file position and metadata checks:

### Target Files to Monitor
The watcher will monitor a registered set of canonical platform documents:
*   Axioms & Principles: `2026-08-06__CISEM__AntigravityLocal__AxiomsAndPrinciples__V*.md`
*   Vocabulary: `2026-08-06__CISEM__AntigravityLocal__Vocabulary__V*.md`
*   Active Implementation Plans: `Consolidated_Ingestion_Routing_and_Context-Driven_Accumulation_Plan__*.md`

### #### [MODIFY] [CxpWatcher.py](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/2026-08-05__GoogleAntigravity__Cxp__CxpWatcher__V0.1.py)

#### Proposed Code Enhancements:
1.  **File System Polling Snapshot (`self.witness_snapshot`)**:
    *   Maintain a cached dictionary of target file paths, sizes, modification timestamps, and parsed YAML header metadata (like `version` and `artifact_status`).
2.  **Positional Shift Detection**:
    *   Detect if a registered file is deleted, renamed, or moved out of its registered location.
    *   Detect if a file's version string in its YAML header decreases or increases without an approved sync log.
3.  **The `.gate_lock` Physical Halter**:
    *   If a violation is detected, write a `.gate_lock` file containing a diagnostic JSON block:
        ```json
        {
          "lock_reason": "POSITIONAL_SHIFT_DETECTED",
          "target_file": "2026-08-06__CISEM__AntigravityLocal__Vocabulary__V1.9.md",
          "error_type": "UNAPPROVED_RENAME",
          "timestamp": "2026-08-06T20:53:00Z"
        }
        ```
    *   Halts compilers by forcing the pre-execution gate script `cisem_gate.py` (which checks for `.gate_lock`) to exit with code `1`.
4.  **Dashboard Notification**:
    *   Append the position change alert profile directly into `cael_status.json` under `witness_change_profile` for UI rendering on the `/threshold` dashboard.

---

## 10. Verification Plan

### Automated Tests
*   Run the watcher daemon in the background.
*   Rename a target plan file to an unversioned name (e.g. `test_plan.md`).
*   Verify that a `.gate_lock` file is created at the workspace root and compilation fails.
*   Restore the file, verify that `.gate_lock` is cleaned up, and compile succeeds.

### Manual Verification
*   Confirm the status report is appended to `cael_status.json` and parses as valid JSON.
