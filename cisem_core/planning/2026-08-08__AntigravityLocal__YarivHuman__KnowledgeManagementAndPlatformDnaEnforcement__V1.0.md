---
metadata:
  owner: "CISEM_GOVERNOR"
  canonical_location: "C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\cisem_core\\planning\\2026-08-08__AntigravityLocal__YarivHuman__KnowledgeManagementAndPlatformDnaEnforcement__V1.0.md"
  artifact_status: "DRAFT"
  maturity: "PROPOSAL"
  version: "1.0"
  inherited_authorities: []
  related_axioms: ["AX-10000", "PR-11000", "PR-13500"]
---

# Knowledge Management and Platform DNA Enforcement Specification

1.1. **Introduction**:
This document explains the technical mechanisms governing how the Commark UBOP platform manages accumulated architectural knowledge, how sandbox trials transition into production code, and how the platform mechanically enforces its "DNA" to prevent technical debt and structural drift.

---

## 2. Accumulated Knowledge Management

2.1. **The Three Pillars of System Memory**:
To prevent context loss across developer session boundaries, the platform uses three interconnected memory repositories:
1. **The Universal Registry (`Registry.yaml`)**:
   - *Role*: A single source of truth for the physical workspace state. It catalogs every core file, its purpose, its maturity status (e.g. `promoted_to_core`), and its SHA256 hash.
   - *Fencing*: Any file modification or addition not compiled and signed in this registry triggers a hash mismatch block at the compile boundary.
2. **Canonical Axioms File (`AxiomsAndPrinciples.md`)**:
   - *Role*: Holds all structural laws, design rules, and business principles. Every coding pattern must explicitly trace its pedigree back to one of these rules (e.g., `PR-11000` for sparse ID spacing).
3. **Session Walkthrough Traces (`walkthrough.md`)**:
   - *Role*: Walks through the exact history of modifications, tests, and outcomes for each session. When a new developer or agent starts, it parses the walkthrough history to absorb the context of previous decisions.

---

## 3. The Lifecycle of a Trial: Sandbox to Core

3.1. **Trial Execution and Promotion Flow**:
A trial represents a development phase inside the sandbox. When the user declares "the trial is over," the platform executes a structured, mechanical transition:

```mermaid
graph TD
    subgraph 1. Active Trial (Sandbox)
        A[Sandbox Experiments] -->|Ad-Hoc Iterations| B[Draft Schemas & APIs]
    end
    
    subgraph 2. Trial Evaluation (Auditor)
        B -->|Execute CisemAuditor.py| C{Trial Report: PASS?}
        C -- No --> B
    end

    subgraph 3. Cleanroom Promotion
        C -- Yes --> D[Draft Plan Ratification]
        D -->|Rewrite from scratch| E[Core Production /src /backend]
        E -->|Register and Hash| F[Universal Registry V1.14]
    end
    
    subgraph 4. Cleanup
        F -->|Delete sandbox code| G[Cleanup Evidence Log]
        G -->|Reset turn counter| H[Local Gate Ready]
    end
```

3.2. **The Promotion Ingestion Mechanism**:
1. **Audit Check**: Run `CisemAuditor.py` to inspect the sandbox trials and generate an `orchestration_trial_report.json` evaluating API metrics and code anomalies.
2. **Design Ingestion**: Draft an implementation plan targeting the final core files.
3. **Cleanroom Rebuild**: Rewrite the code cleanly in `src/` or `backend/`, fully removing temporary hacks, comments, and logging loops.
4. **Registry Signing**: Compute the SHA256 of the new core files and add them to `Registry.yaml`.
5. **Sandbox Pruning**: Delete the sandbox directory or drafts, logging the backup zip file in the cleanup log. The system resets the turn counter to zero.

---

## 4. Mechanical Enforcement of Platform DNA

4.1. **The local gateway compiler gate (`cisem_gate.py`)**:
Every time a developer runs `npm run dev` or `npm run build`, `cisem_gate.py` runs automatically as a blocking compiler wrapper. It mechanically validates:
- **Phase 2: Naming & Versioning Laws**: Verifies all workspace files follow the double-underscore notation: `[Date]__[From]__[To]__[Description]__[Version].[ext]`.
- **Phase 9: Checksum Integrity**: Computes local SHA256 hashes of all registered workspace files and compares them against `Registry.yaml` to prevent untracked modifications.
- **Phase 10: Axiom Linkage**: Scans source file headers. If a file references a rule ID (e.g. `PR-11000`) that does not exist in `AxiomsAndPrinciples.md`, the compile blocks.
- **Phase 11: Naming & Duplication Integrity**: Parses all axioms files to prevent duplicate ID declarations or orphaned references.
- **Sandbox DNA Check**: Scans the `/sandbox` category folders to print formatting warnings for prose documents that lack hierarchical paragraph indexing (`1.1`, `1.2`).

4.2. **Why This is Not a Theater**:
The compiler gate does not simply print text; it issues a system exit command (`sys.exit(1)`) on failure, halting the Next.js and FastAPI dev servers or blocking Vercel production compilation. Rules cannot drift because the code will physically refuse to run or build unless it is fully compliant.

---
history:
  - timestamp: "2026-08-08T23:35:00Z"
    action: "CREATED_KNOWLEDGE_DNA_ENFORCEMENT_SPEC"
    actor: "GEMINI_BRAIN"
    version: "1.0"
