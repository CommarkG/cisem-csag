---
metadata:
  owner: "CISEM_GOVERNOR"
  canonical_location: "C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\2026-08-07__CISEM__AntigravityLocal__Vocabulary__V1.13.md"
  artifact_status: "DRAFT"
  maturity: "WORKING_DRAFT"
  version: "1.0"
  role_type: "WALKTHROUGH"
---

# CISEM Platform: Vocabulary

---
metadata:
  owner: "CISEM_GOVERNOR"
  canonical_location: "C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\2026-08-07__CISEM__AntigravityLocal__Vocabulary__V1.13.md"
  artifact_status: "DRAFT"
  maturity: "WORKING_DRAFT"
  version: "1.13"
  role_type: "CANONICAL_VOCABULARY_ROOT"
---

This document establishes the official terminology, definitions, and conceptual frameworks used across the **CISEM Platform**. All planners, builders, and audit agents must strictly adhere to these definitions (simulated drift test).

---

## 1. Metatheory: Axioms vs. Principles

To establish clear governance, we separate our foundational beliefs from our operational guidelines:

| Concept | Definition | Characteristics | Indexing & Usage in CISEM |
| :--- | :--- | :--- | :--- |
| **Axiom** (AX) | A self-evident, fundamental truth or starting premise accepted without proof. | • Immutable<br>• Non-negotiable<br>• System-level constant | Indexed as a 5-digit primary number (e.g., `AX-10000`, `AX-20000`). If an Axiom is breached, the integrity of the system is compromised. |
| **Principle** (PR) | A core guideline derived from Axioms that dictates how to act, design, and resolve choices. | • Adaptable to context<br>• Action-oriented<br>• Directs trade-offs | Indexed with a distributed offset suffix (using increments of `1000` with midpoints like `PR-13500`, `PR-14500` relative to the parent axiom). |

### The Core Difference:
*   **Axioms** define **what is true** and establish physical or logical boundaries (the system's "bedrock constants").
*   **Principles** define **how we act** and evaluate options within those boundaries (the system's "guiding rules").
*   **Distributed Offsets**: Axioms are indexed in steps of `10000` (e.g., `10000`, `20000`). Principles are distributed using equal midpoint offsets of `1000` (e.g. `x3500`, `x4500`, `x7500`, `x8500`). This prevents index collision and leaves enormous gaps for future subtopics.

---

## 2. Core Terms

### Core 3 Scopes
A three-level analytical framework applied during the triage, design, and implementation of any enhancement or issue resolution:

1.  **Scope 1: Immediate Fix & Permanent Prevention**
    *   *Definition*: The immediate, localized resolution of a specific problem or implementation of a specific feature.
    *   *Standard*: Must be executed in a professional, robust way. Ad-hoc drafts, temporary patches, or quick overrides are prohibited. The fix must permanently prevent the unwanted behavior and permanently enhance or activate the desired behavior.
2.  **Scope 2: Repository Connection Context**
    *   *Definition*: The evaluation of all connected dependencies, files, configurations, and databases that interface with the target element.
    *   *Standard*: We must analyze the wider repository to ensure that fixing or modifying one component does not break dependencies, introduce silent failures, or cause regressions in other parts of the platform.
3.  **Scope 3: Platform Quality Insights (Deep & Wide)**
    *   *Definition*: The deep architectural audit of the root system principles behind the case.
    *   *Standard*: Analyzes and evaluates how the system is defined across its:
        *   **Axioms**: The foundational rules and constraints.
        *   **Protocols**: The interfaces and communication formats (e.g. CXP).
        *   **Wizards**: The guided execution scripts.
        *   **Flows & Journeys**: The structural paths and user/packet sequences.
        *   **Boundaries & Wiring**: The security/ownership layers and path linkages.
        *   **Mechanical Enforcements**: How the system physically prevents drift.
    *   The goal is to determine how to enhance and preserve positive outcomes or permanently prevent unwanted architectural patterns across the entire platform.

---

## 3. Platform Glossary

*   **Gestation**: The natural, non-linear phase during which raw human inputs and ideas are parsed, tagged, and aligned before they can be promoted to active plans.
*   **Nothing Stand-Alone**: The system rule stating that no route, tag, layout, or status can exist or compile unless it is pre-registered in a core registry.
*   **Priority CoreSpine**: The triage evaluation matrix used weekly, monthly, or quarterly to decide if a parked item in the Parking Vault should be promoted to active planning.
*   **Local Gateway Gate (LGG)**: Deterministic, hardcoded script gatekeepers running at build-time to intercept commands and enforce registry constraints.
*   **Mechanical Clarification Enforcer (MCE)**: The strict build gate blocking compilation if there is no ratified implementation plan or Governor signature.
*   **Intent Alignment Buffer**: An isolated processing layer that deconstructs raw human inputs, resolves edge cases via Socratic queries, and synthesizes a ratified contract before planning or execution.
*   **Positive Suspicion**: The system-level assumption that initial human input is associative, partial, or missing edge cases, requiring deconstruction and edge-case auditing.
*   **Socratic Verification**: The process of resolving design ambiguities by asking targeted, single questions sequentially, avoiding large paragraph text dumps.
*   **Prompt Translation Buffer**: The module that converts a Governor-ratified intent contract into structured, token-efficient, AI-optimized instructions.
*   **Measurable Output Contract**: The post-alignment agreement defining explicit inputs, outputs, and success metrics that must be met to verify execution.
*   **Raw and Context**: The universal term encompassing all content ingested by the CISEM system. Frames that raw input is never isolated text, but must carry its ingestion context (sender, timestamps, origin paths, active system states) to allow accurate routing.
*   **Context-Driven Accumulation**: The core development attitude that pauses code execution until multiple related segments of an issue are gathered, divided into subtopics, and consolidated. Unlike rigid sprint/turn schedules, it is triggered only when the accumulated bundle reaches a critical mass of clarity, completeness, and proven platform value.
*   **Inputs**: The universal term encompassing all content ingested by the CISEM system. Includes human briefs, external AI packets, internal agent and persona instructions, research documents, media files (pictures/videos), presentations, and spreadsheet documents (Google Sheets/Excel files).
*   **Hardcoding**: The deterministic, compiled, static code structures (the platform's "structural skeleton") that guarantee zero behavioral drift and enforce system locks.
*   **AI Pocket**: A highly bounded, isolated, non-autonomous AI call (e.g. semantic parsing, code auditing) wrapped inside deterministic input/output sanitizers, possessing zero authority to bypass hardcoded gates.
*   **Weekly Review Registry**: All background AI pocket outputs, draft tags, and temporary status changes are logged here for Governor audit and manual sign-off every week.
*   **Gestation Delay Escalation**: The automated priority-promoting rules executed by the Planning & Execution (PE) engine to prevent parked backlog stagnation.
*   **Pondering Point**: A system-enforced pause triggered when a plan is completed, a major discussion is concluded, or a plan is ratified. During this pause, the PE engine locks all execution task queues. Developers and agents are blocked from coding while the system compiles a Reassessment Digest to audit the backlog, research files, and axioms before resuming.
*   **Hardcoded Execution Pipeline (HEP)**: The platform's rigid, deterministic structural boundaries (AST parsers, compiler gates, file watchers) that physically block execution on validation failure.
*   **Generative Reasoning Sandbox (GRS)**: The bounded, non-autonomous AI space where agents draft designs, reviews, tags, and Socratic Q&As. The GRS has zero direct write permission to the production core codebase.
*   **Intent-Carrying Samples**: The structural rule requiring all design drafts and plans to express intent via concrete mock input/output samples and single, targeted questions instead of abstract prose.
*   **Connecting the Dots**: The process of linking localized changes to Scope 3 Platform Quality Insights (Axioms, Protocols, Wizards, Flows, Wiring, Mechanical Enforcements) to find core enhancements or prevent platform-wide defects.
*   **Triage & Regroup Protocol**: The process executed during a Pondering Point reassessment pause. Immature inputs are parked back in the vault with updated context, while mature inputs are promoted to active planning and reviewed via multiple distinct personas.
*   **Bidirectional Registry Linkage**: The hardwired logical pointer system linking an implementation plan with the parked vault items it resolves. Expressed via two-way pointers in the plan header and the registry YAML file on disk.
*   **State Cascading Engine (SCE)**: The hardcoded logic block that automatically updates and aligns the status and tags of resolved parked items the instant the Governor signs off on their parent implementation plan.
*   **Registry Debt**: The systemic drift and build-time inconsistencies caused by status lag, orphan plan states, or unapproved ad-hoc tags in files. Prevented by strict, build-time zero-drift gates.
*   **AI Satisfaction Points**: The catalog of specific cognitive blind spots (e.g. assuming isolated test passes prove execution completeness) where AI agents prematurely declare "done." Locked inside canonical audit checks.
*   **Intent-to-Impact Real Verification**: The protocol requiring every implementation plan to define physical telemetry metrics and activity validations. Real-world utilization is tracked to identify dead or inactive code features.
*   **Impact Verification Ledger**: The persistent database config (`impact_verification_ledger.yaml`) logging telemetry heartbeats and the real-world utility of promoted components.
*   **3-Tier Scope Architecture**: A strict structural control system restricting the depth of context passed to builder agents into Micro Scope (Tier 1), Medium Scope (Tier 2), or Full Scope (Tier 3) to prevent context drifting and token waste.
*   **Asset Discovery Audit**: The double-layered verification process scanning local modules (Internal Audit) and external packages (External Audit) before planning to prevent writing redundant code.
*   **Platform Domain Hierarchy**: The directory organization grouping capabilities under Core Domains (Business Domain vs. Private / Incubator Domain) under a System Root to minimize cognitive load.
*   **Execution Sandboxing**: Developing, running, and validating plans and code inside an isolated, non-interfering layer (Sandbox Environment) before promoting to ratified Production.
*   **Continuous Learning & Harvesting**: The process of extracting key decisions and patterns from active chat sessions to compile and maintain Master System State Documents.
*   **Master System State Document**: Compilations of dynamic, token-efficient system context files uploaded at LLM session startup to establish instant, complete, and non-drifting system awareness.
*   **SWIFT Methodology**: An implementation methodology that allows basic, immediate deployment of improvements (1) to improve operations and fix issues now, while (2) serving as a placeholder for the fully realized, optimized solution once the Core Council produces it. A SWIFT implementation must *always* be accompanied by a corresponding parked item in the Parking Vault (e.g., `PARK-xxx`) to ensure that the deeper, permanent solution is tracked and scheduled for future Core Council resolution.

---

## 4. History
- **2026-08-06T19:00:00Z**: Created initial version defining the Core 3 Scopes framework and platform glossary. (GOOGLE_ANTIGRAVITY_ADAPTER - Version 1.0)
- ...
- **2026-08-06T21:28:00Z**: Added definitions for AI Satisfaction Points, Intent-to-Impact Real Verification, and Impact Verification Ledger. (GOOGLE_ANTIGRAVITY_ADAPTER - Version 1.10)
- **2026-08-07T00:23:00Z**: Added definitions for 3-Tier Scope, Asset Discovery, Domain Hierarchy, Execution Sandboxing, Continuous Learning, and Master System State Documents. (GOOGLE_ANTIGRAVITY_ADAPTER - Version 1.11)
- **2026-08-07T03:30:00Z**: Added definition for SWIFT Methodology as a tactical execution pattern during Core Council design. (GOOGLE_ANTIGRAVITY_ADAPTER - Version 1.12)
- **2026-08-07T03:40:00Z**: Updated SWIFT Methodology definition to mandate a linked parked item (e.g. PARK-xxx) for future canonical resolution. (GOOGLE_ANTIGRAVITY_ADAPTER - Version 1.13)
