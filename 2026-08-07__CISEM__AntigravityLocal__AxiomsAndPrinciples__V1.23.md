---
metadata:
  owner: "CISEM_GOVERNOR"
  canonical_location: "C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\2026-08-07__CISEM__AntigravityLocal__AxiomsAndPrinciples__V1.22.md"
  artifact_status: "DRAFT"
  maturity: "WORKING_DRAFT"
  version: "1.23"
  inherited_authorities: []
  role_type: "CANONICAL_PHILOSOPHICAL_ROOT"
---

# CISEM Platform: Axioms and Principles

This document defines the canonical axioms and guiding principles of the **CISEM Platform**. It establishes the logical foundation for all system behaviors, architecture templates, and mechanical gates.

---

## 1. Pillar 10000: Workspace Integrity & Registry Enforcements

### AX-10000: Nothing Stand-Alone (Bedrock Axiom)
*   **Definition**: No route, page layout, API controller, status value, or classification tag is permitted to exist or compile in isolation.
*   **System Impact**: Every element must be registered and approved in a master registry before compilers or builders are allowed to boot.

### PR-11000: Sparse ID Allocation Policy (Anti-Inflation)
*   **Definition**: The system enforces sparse ID spacing. Rules may only be created if an active code boundary requires them today. New rules must jump by at least +100 or +500 to leave logical spacing for future modules. Pre-allocated placeholder sub-blocks or reserves are strictly prohibited.
*   **Derivation**: Derived from `AX-10000`.

### PR-13500: The Consolidation Principle
*   **Definition**: Duplicate or overlapping configurations, files, or paths must be merged into a Single Source of Truth (SSOT) that services all requirements.
*   **Derivation**: Derived from `AX-10000`.

### PR-13800: Mandatory Scope 3 Integration (Connecting the Dots)
*   **Definition**: The "Connecting the Dots" Scope 3 Analysis (evaluating how changes ripple across Axioms, Protocols, Wizards, and Journeys) is a mandatory phase wired into every process (Ingestion, Planning, Execution, and Verification).
*   **Derivation**: Derived from `AX-10000`.

### PR-13900: Bidirectional Registry Linkage
*   **Definition**: Every implementation plan must explicitly list the unique IDs of the parked items it resolves within its metadata header. The sync engine automatically writes reciprocal plan pointers back to the Parking Vault, creating a hardwired two-way logical pointer on disk.
*   **Derivation**: Derived from `AX-10000`.

### PR-13950: Zero-Drift Registry Check
*   **Definition**: The system compiler executes a strict consistency gate checking that all active plans, code tags, and parked item states match perfectly. Any mismatch (e.g. orphan states, unregistered tags in code comments, or plan-vault status lag) immediately aborts compilation to prevent registry debt.
*   **Derivation**: Derived from `AX-10000`.

### PR-13980: Variable Gate Severity Threshold
*   **Definition**: To prevent planning paralysis on low-risk updates, the compiler gate scales its blocking severity based on blast-radius. Low-impact styling or text modifications bypass the ratification block and compile immediately, while logging a post-commit check in the Weekly Review Registry.
*   **Derivation**: Derived from `AX-10000` and `AX-55000`.

### PR-14500: Mandatory Registry Pre-Inspection
*   **Definition**: Agents and developers must verify the existence of all registered workspace components and schemas prior to proposing changes.
*   **Derivation**: Derived from `AX-10000`.

### PR-17500: Canonical Document Presentation
*   **Definition**: All system outputs, chats, and evidence logs must present the full name, version name, and clickable link of any referenced document.
*   **Derivation**: Derived from `AX-10000`.

### PR-18500: Clear Intent Naming
*   **Definition**: Clear naming is a great intent and content carrier. All naming in CISEM must serve this by using simple and industry-classic words.
*   **Derivation**: Derived from `AX-10000`.

---

## 2. Pillar 20000: Ingestion & Information Gestation

### AX-20000: Gestational Ingestion (Bedrock Axiom)
*   **Definition**: All inputs—including human briefs, external AI packets, internal agent instructions, research documents, media files, presentations, and spreadsheets—are raw materials. They must undergo a gestation period of parsing and alignment before they can be promoted to executable plans.
*   **System Impact**: The system never rushes to write code or run executors upon receiving raw content.

### PR-23500: Rejection of Code Rushing
*   **Definition**: Rushing to code is the root cause of systemic architectural drift, duplicate structures, and compounding technical debt. The system must enforce code restraint by default.
*   **Derivation**: Derived from `AX-20000`.

### PR-23600: 'Take Your Time' Principle (The Ultimate Accelerator)
*   **Definition**: "Take your time" is the biggest time saver in software development. Slowing down to align intent, map repository boundaries, and verify principles before execution eliminates rework and prevents the creation of technical debt.
*   **Derivation**: Derived from `AX-20000`.

### PR-24500: Part-Level Ingestion Segmentation
*   **Definition**: Long incoming documents are parsed and segmented into independent, logical sentences or paragraphs to allow precise tracking.
*   **Derivation**: Derived from `AX-20000`.

### PR-27500: Immediate Status & Context Assignment
*   **Definition**: Every parsed input segment must instantly receive a lifecycle status of `raw_and_context` upon entering the database, capturing both the content and its ingestion context.
*   **Derivation**: Derived from `AX-20000`.

### PR-28500: Multi-Tag Classification Taxonomy
*   **Definition**: Each input part can be assigned multiple tags simultaneously to enable semantic grouping.
*   **Derivation**: Derived from `AX-20000`.

---

## 3. Pillar 30000: Process Routing & Priority Triage

### AX-30000: Priority CoreSpine Triage (Bedrock Axiom)
*   **Definition**: Parked inputs wait in the Parking Vault and are only promoted during scheduled triage cycles using the three core parameters: immediate benefit, solidness of conclusions, and active workload priority.
*   **System Impact**: Prevents out-of-context inputs from interrupting active work.

### PR-33500: Active Process Alignment
*   **Definition**: Incoming input segments that relate to a plan execution or active discussion are instantly routed and appended to that active thread.
*   **Derivation**: Derived from `AX-30000`.

### PR-34500: Parked Gestation Vaulting
*   **Definition**: Any input segment that does not align with active work is routed to the Parking Vault with a status of `raw_and_context` to await scheduled triage.
*   **Derivation**: Derived from `AX-30000`.

### PR-37500: Dynamic Magnitude Gestation Sizing
*   **Definition**: Rather than applying static promotion counts, the gestation threshold scales dynamically based on task magnitude. An AI pocket evaluates the scope and blast radius of a parked item; complex core architectural changes require greater reference accumulation (e.g. 5+ distinct mentions) to qualify for triage compared to low-risk updates.
*   **Derivation**: Derived from `AX-30000`.

### PR-38500: Dynamic Escalation Matrix
*   **Definition**: To enforce accountability and completion, parked items are pro-actively escalated by the Planning & Execution (PE) engine if left unaddressed:
    *   *Week 1*: Auto-prioritized in the daily digest.
    *   *Week 2*: Status set to `GESTATION_DELAYED` (priority promoted to HIGH).
    *   *Week 3*: A hardcoded block locks down the creation of new enhancement tasks, forcing resource focus back onto the delayed item.
*   **Derivation**: Derived from `AX-30000`.

---

## 4. Pillar 40000: System Logic & Architecture Stability

### AX-40000: Hardcoded Core with AI Pockets (Bedrock Axiom)
*   **Definition**: The core platform logic (compilers, checkers, gating logic, and status transition engines) must be strictly hardcoded. AI is restricted to isolated, bounded "pockets" (such as reviewing diffs or recommending tags).
*   **System Impact**: Secures the system from autonomous code alterations or spontaneous logic drifts.

### PR-43500: Reusable Bundling Priority (Core Attitude)
*   **Definition**: Always look for enhancements, better arrangements, and bundling of existing features before you add new elements.
*   **Derivation**: Derived from `AX-40000`.

### PR-44500: Reusable Core Primacy (Insist on Pre-Existing)
*   **Definition**: CISEM insists on and will mechanically enforce the usage of existing, pre-created, and verified elements. It prohibits the creation of new elements without first going through a professional evaluation of achieving required results using existing elements, unless granted specific permission by the Governor.
*   **Derivation**: Derived from `AX-40000` and `AX-10000`.

---

## 5. Pillar 50000: Execution Governance & Auditing

### AX-50000: Builder-Reviewer Separation (Bedrock Axiom)
*   **Definition**: The builder (developer or agent) must never be the sole authority approving its own changes. Independent reviews and mechanical validations are mandatory.
*   **System Impact**: Enforces audit logs and multi-model reviews for all code changes.

### AX-55000: Harness-First Gatekeeping (Bedrock Axiom)
*   **Definition**: Architectural specs and gatekeepers must exist and be verified *before* the application codebase is written or compiled.
*   **System Impact**: Prevents compilation of unaligned or unapproved code.

### PR-58500: Late-Stage Mechanical Verification
*   **Definition**: Mechanical validators (AST parsers, compiler builds, and execution checkers) are run as late-stage gates only after gestation, design, and human ratification are completed.
*   **Derivation**: Derived from `AX-55000`.

### PR-58700: State Cascading Engine (SCE)
*   **Definition**: Upgrades to critical plan states automatically cascade to all linked parked items. When the Governor signs off on an implementation plan, the SCE instantly transitions the status of all resolved vault items from `parked` to `promoted` and aligns their tags.
*   **Derivation**: Derived from `AX-55000` and `AX-10000`.

### PR-58900: The Audits Orchestrator
*   **Definition**: A central compiler-level execution script (`CisemAuditor.py`) coordinates all validation reviews. It automatically loads registered expert personas, evaluates the code blast radius, triggers relevant reviewers, and returns a binary verdict block on validation failure.
*   **Derivation**: Derived from `AX-50000`.

### PR-58950: Context-Related Element Grouping (Anti-Homogeneity)
*   **Definition**: The system must reject the assumption that all elements within an architectural topic are governed by a single, uniform rule. Every validation or auditing process must begin by dividing elements into context-related risk groups (such as critical core paths, transactional utilities, or low-impact UI updates) and executing custom, bounded checks for each group.
*   **Derivation**: Derived from `AX-50000`.

### PR-58960: Governed Auto-Fixing
*   **Definition**: If an audit check detects a low-risk gap (e.g. comment additions, typos, or documentation naked numbers) with zero ripple risk to schemas or cross-file imports, the developer agent should execute an automated repair immediately on the same turn, bypassing plan ratification to maintain velocity.
*   **Derivation**: Derived from `AX-50000`.

---

## 6. Pillar 60000: Human-Agent Interaction & Handshakes

### AX-60000: Intent Alignment Gatekeeping (Bedrock Axiom)
*   **Definition**: The platform prohibits executing or planning raw, unaligned human requests. A mandatory processing buffer must translate human associations into structured contracts.
*   **System Impact**: Restricts system execution to ratified, optimized specifications.

### PR-63500: Positive Suspicion & Reflection Handshake
*   **Definition**: Initial human inputs are treated as associative and partial. The agent must reflect the input back with a simple, short description or targeted questions, presenting what the agent would do with it if the understanding is correct.
*   **Derivation**: Derived from `AX-60000`.

### PR-64500: Socratic Verification
*   **Definition**: The agent must ask targeted, single questions to resolve design choices sequentially, preventing cognitive overload and large text dumps.
*   **Derivation**: Derived from `AX-60000`.

### PR-67500: Intent-Carrying Samples & Questions
*   **Definition**: Abstract prose is insufficient to convey complex intent. All design proposals and implementation plans must include concrete input/output samples and single, targeted questions to carry intent.
*   **Derivation**: Derived from `AX-60000`.

### PR-68500: Variable Scope Handshake
*   **Definition**: The depth of the Intent Alignment Buffer must scale dynamically: simple tasks run light verification steps, while high-impact structural changes engage the full multi-turn ratification protocol.
*   **Derivation**: Derived from `AX-60000`.

---

## 7. Pillar 70000: Communication CoreSpine

### AX-70000: Structured Communication Interfacing (Bedrock Axiom)
*   **Definition**: All interactions within the platform ecosystem must follow defined communication trunks to prevent untracked semantic transfers or logic leaks.
*   **System Impact**: Structures the flow of messages between humans, internal agents, and external APIs.

### PR-70200: AI & Human/Agent Communication Trunks
*   **Definition**: The platform communication pathways are organized into four distinct trunks:
    1.  AI & Human (Native chat)
    2.  AI & Human (External users)
    3.  AI & Internal AI
    4.  AI & External AI
*   **Derivation**: Derived from `AX-70000`.

### PR-70300: AI CoreSpine Integration
*   **Definition**: The fourth trunk (AI & External AI) routes system audits to external AI consultant placeholders (GPT, Gemini, Claude, DeepSeek, Kimi) to provide third-party validation layers alongside the 10 internal expert personas.
*   **Derivation**: Derived from `AX-70000` and `AX-50000`.

---

## 8. Pillar 80000: System Reassessment Loops

### AX-80000: System Reassessment Loops (Bedrock Axiom)
*   **Definition**: Platform execution must pause at concluded project milestones to allow holistic evaluation of system health, raw backlog items, and architectural alignment.
*   **System Impact**: Enforces periodic alignment cycles, stopping active code generation.

### PR-83500: Concluded Milestone Pondering Pauses
*   **Definition**: A Pondering Point is automatically triggered when an active plan reaches completion, a major discussion concludes, or a plan is ratified. During this pause, the PE engine locks all execution task queues. Developers and agents are locked from coding, and the system generates a Reassessment Digest to evaluate backlog, research, and axioms before resuming.
*   **Derivation**: Derived from `AX-80000` and `AX-30000`.

### PR-83800: The Dynamic Polarity Shift
*   **Definition**: To balance developer agility (execution polarity) with architectural safety (planning polarity), the platform operates in two modes. In the isolated local Sandbox workspace, developers compile freely while GRS personas run asynchronously in the background. In the main production branch, compile gates transition to strict HEP locks, forcing full planning ratification and cryptographic signatures.
*   **Derivation**: Derived from `AX-80000` and `AX-40000`.

### PR-84500: The Triage & Regroup Protocol
*   **Definition**: When the system triggers a Pondering Point, the engine initiates a context-driven regroup:
    1.  *Park Gestating Items*: Identify all inputs or issues that lack complete reference maturity or consensus, update their context files, and save them in the Parking Vault with status `parked`.
    2.  *Multi-Persona Review*: Select the mature issues that have met the gestation magnitude threshold and run them through a structured evaluation process across multiple AI/Human personas to verify platform value before coding is unlocked.
    3.  *SWIFT Transition*: Deploy tactical placeholders where immediate action is required, conforming to `PR-84900`.
*   **Derivation**: Derived from `AX-80000` and `AX-30000`.

### PR-84900: SWIFT Implementation Protocol
*   **Definition**: When tactical necessity warrants immediate action during Core Council debate, developers may deploy a SWIFT implementation (basic local fixes) that functions as an operational improvement and placeholders to be replaced once the Council produces its canonical design. Any SWIFT implementation must *always* carry a linked parked item (e.g., `PARK-xxx`) in the Parking Vault to track the future canonical design task. The compiler gate mechanically blocks compile if this link is broken.
*   **Derivation**: Derived from `AX-80000` and `AX-55000`.

### PR-84800: Retrospective Alignment Protocol (RAP)
*   **Definition**: The system rejects the default behavior of applying rule improvements only to future work. When an improvement or standard is ratified, it must be routed via one of two paths:
    -   **Path Alpha (Immediate Refactoring - Critical)**: Halt all active sprint tasks. Run a full workspace scan and rewrite all pre-existing target files to retrospectively align them with the new standard.
    -   **Path Beta (Scheduled Refactoring - Standard)**: Auto-generate a retrospective alignment ticket in the Parking Vault (tagged `[RETROSPECTIVE.ALIGNMENT]`) to be resolved in the weekly cleanup triage block.
*   **Derivation**: Derived from `AX-80000` and `AX-10000`.

---

## 9. Pillar 90000: Platform Resource & Complexity Boundaries

### AX-90000: Token & Context Conservation (Bedrock Axiom)
*   **Definition**: Large, bloated files degrade model reasoning accuracy and dilute rules visibility. The system must mechanically restrict workspace file volumes.
*   **System Impact**: Prevents compilation of giant source or rules files.

### PR-93500: Documentation Length Boundaries
*   **Definition**: No rule document, wizard instruction, or plan is permitted to exceed **3000 words**. If exceeded, the document must be refactored into a tree hierarchy of sub-rules indexed by a parent file.
*   **Derivation**: Derived from `AX-90000`.

### PR-94500: Source Code Length Boundaries
*   **Definition**: No single source code script, daemon, or utility is permitted to exceed **350 lines of code**. If exceeded, the codebase must be refactored into decoupled module imports.
*   **Derivation**: Derived from `AX-90000`.

### PR-95000: 3-Tier Scope Architecture
*   **Definition**: Context size passed to builder agents must be strictly controlled using a 3-Tier Architecture to prevent context drifting and token bloat:
    -   *Micro Scope (Tier 1)*: Applied for isolated fixes, single script creation. Context is restricted to the target file + minimal system vocabulary (~10% depth). Token boundary: Do not touch surrounding modules.
    -   *Macro Scope (Tier 2)*: Applied for component-level feature upgrades. Context includes target file + imports/exports + API schemas (~30% depth). Token boundary: restricted to the active subsystem.
    -   *Mega Scope (Tier 3)*: Applied for architectural upgrades and subsystem creation. Context covers full workspace registry + configuration adapters + master principles (~100% depth). Token boundary: full workspace.
*   **Derivation**: Derived from `AX-90000` and `AX-10000`.

### PR-98000: Execution Sandboxing, Parking & Continuous Learning
*   **Definition**: Continuous learning and execution loops are routed through standard stages:
    -   *Raw Idea Parking Lot*: Ideas are placed directly here, tagged with domain metadata, and evaluated asynchronously by the Priority Engine.
    -   *Sandbox Environment*: An isolated layer where ideas, scripts, and plans can be iterated on without writing to or affecting the main system branch.
    -   *Production Environment*: Bounded execution layer verified post-testing and plan ratification.
    -   *Harvesting Engine*: Extracts key decisions, patterns, and code snippets from active sessions and commits them to Master System State Documents to maintain session context.
    -   *Sandbox Image Processor Integration (SIPI)*: The visual pipeline mapping portal integrating Normalization, Auditing, and Classification tools.
    -   *Sandbox Sync Gate*: The official protocol boundary where sandbox drafts are promoted via manual synchronization (`CisemSyncSandbox.py`) and registered in the core workspace registry.
*   **Derivation**: Derived from `AX-90000` and `AX-80000`.

### PR-99000: Cloud Model Selection and Obsolescence Policy
*   **Definition**: Out-of-service, deprecated, or retired model identifiers degrade platform reasoning and lead to execution failures.
    - All external integrations and internal adapters MUST use active recommended model families (`gpt-5.6-sol` for flagship, `gpt-5.6-terra` for balanced, `gpt-5.6-luna` for high-volume, and `o4-mini`/`o3-pro` for reasoning).
    - It is **mandatory** for all external integrations to research OpenAI deprecation schedules and update their configurations to active models every 6 months to prevent integration outages.
*   **Derivation**: Derived from `AX-90000` and `AX-40000`.

---

## 10. History
- **2026-08-06T18:38:00Z**: Created initial version. (GOOGLE_ANTIGRAVITY_ADAPTER - Version 1.0)
- **2026-08-06T23:26:00Z**: Added PR-84800 (Retrospective Alignment Protocol) to Pillar 80000. (GOOGLE_ANTIGRAVITY_ADAPTER - Version 1.16)
- **2026-08-07T00:23:00Z**: Added PR-95000, PR-96000, PR-97000, PR-98000 for Scope Architecture, Anti-Redundancy, Domain Hierarchy, and Learning loops. (GOOGLE_ANTIGRAVITY_ADAPTER - Version 1.17)
- **2026-08-07T03:30:00Z**: Added PR-84900 (SWIFT Implementation Protocol) to support immediate local upgrades alongside Core Council design. (GOOGLE_ANTIGRAVITY_ADAPTER - Version 1.18)
- **2026-08-07T03:40:00Z**: Updated PR-84900 (SWIFT Implementation Protocol) to require a linked parked item (e.g. PARK-xxx) with mechanical compiler gate validation. (GOOGLE_ANTIGRAVITY_ADAPTER - Version 1.19)
- **2026-08-07T03:50:00Z**: Appended SWIFT placeholders for naked number audits PARK-014, PARK-015, and PARK-018 to PARK-023. (GOOGLE_ANTIGRAVITY_ADAPTER - Version 1.20)
- **2026-08-08T06:40:00Z**: Added PR-99000 (Cloud Model Selection and Obsolescence Policy), retired gpt-4o/gpt-4o-mini and set gpt-5.6-sol/o4-mini as active standard. (GOOGLE_ANTIGRAVITY_ADAPTER - Version 1.21)
- **2026-08-08T16:49:00Z**: Added Sandbox Image Processor and Sync Gate rules to PR-98000. (GOOGLE_ANTIGRAVITY_ADAPTER - Version 1.22)
- **2026-08-08T21:22:00Z**: Added PR-11000 (Sparse ID Allocation Policy) to Pillar 10000. (GOOGLE_ANTIGRAVITY_ADAPTER - Version 1.23)

<!-- @swift_placeholder: PARK-014 -->
<!-- @swift_placeholder: PARK-015 -->
<!-- @swift_placeholder: PARK-018 -->
<!-- @swift_placeholder: PARK-019 -->
<!-- @swift_placeholder: PARK-020 -->
<!-- @swift_placeholder: PARK-021 -->
<!-- @swift_placeholder: PARK-022 -->
<!-- @swift_placeholder: PARK-023 -->
<!-- @swift_placeholder: PARK-024 -->
<!-- @swift_placeholder: PARK-007 -->
<!-- @swift_placeholder: PARK-010 -->
<!-- @swift_placeholder: PARK-011 -->
<!-- @swift_placeholder: PARK-012 -->
