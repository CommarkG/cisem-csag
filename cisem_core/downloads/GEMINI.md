# CISEM-Antigravity Core Instructions

---
metadata:
  owner: "CISEM_GOVERNOR"
  canonical_location: "C:\\Users\\finky\\Desktop\\AntiGravity\\GEMINI.md"
  artifact_status: "DRAFT"
  maturity: "WORKING_DRAFT"
  version: "1.5"
  inherited_authorities: []
  related_implementation_adapter: "GOOGLE_ANTIGRAVITY_ADAPTER"
  local_edits_allowed: false
  role_type: "CANONICAL_ROOT_RULES"
---

## 1. Directory & Workspace Alignment Law
- Never assume the active workspace directory is correct.
- Verify the active path at the start of every session.
- Separate the workspace into a central Control Plane (`cisem_core/`) and active application endpoints (like `Supplier Scraper CsAg/`). Keep all orchestration, verification scripts, and schemas inside `cisem_core/`.
- Place all universal system specs and configurations in the parent folder `C:\Users\finky\Desktop\AntiGravity\`.

## 2. Mandatory File Naming and Versioning Convention
Every file created by the agent (scripts, artifacts, configurations, or documents) must follow this strict naming pattern:

**Pattern:**
`[Date-or-Prefix]__[From]__[To]__[Description]__[Version].[ext]`

*Example:* `2026-08-05__AntigravityLocal__YarivHuman__CxpSpecification__V1.0.md`

- No generic filenames (such as `test.py`, `script.js`, or `temp.txt`) are permitted.
- If a file already exists, you must increment the version number in the metadata header and append a timestamped entry to its `history` block. Overwriting without version changes is prohibited.

## 3. Wildcard Deletion Prohibition
- Never use wildcard deletion commands (like `rm *` or `Remove-Item *`) on project directories.
- Every file deletion or rename must target explicit, absolute file paths, verify that no dependencies are broken, and be logged in the cleanup log.

## 4. Cloud Model Selection Policy
- **Provider**: OpenAI (default Completions API).
- **Default Auditor / Orchestrator Model**: `gpt-4o`.
- **Validation Loop / Low-Cost Model**: `gpt-4o-mini` (used for dry-runs, handshakes, and simple validation loops).
- **High-Reasoning Model**: `o1-mini` (swap in dynamically when auditing complex codebase refactors or security gates).
- **Dynamic Configuration**: The cloud orchestrator must support reading model strings directly from the packet's `derived_view.execution_control.cloud_model.model` configuration, or falling back to Script Settings.

## 5. The Four-Question Checkpoint
Before creating any new artifact, you must explicitly ask and answer these four questions:
1. **What already exists?** (Check What Exists)
2. **Where should this belong?** (Check Where It Belongs - evaluate universal vs. project folders)
3. **What will this affect?** (Check What It Affects)
4. **What is the smallest executable proof that validates this decision?** (Verify Reality Before Scale)

## 6. Destructive Operation Governance
Every destructive operation (such as deletion, renaming, or file movement) must produce an evidence artifact log containing:
1. Deletion Candidate List.
2. Dependency Check (verify no broken imports or configs).
3. Archive Proof (backed up location of original file contents).
4. Actual Execution Action.
5. Post-Operation Verification Report.

## 7. UX/UI Layout and Consistency Law
- **7.1. Single-Row Placement Rule**: Avoid placing short related titles and related content in more than one row if not essential. Combine titles, indicators, and controls into a single row to maximize vertical space and text density.
- **7.2. Sibling Representation Consistency Rule**: Elements and buttons inside the same horizontal row or structural group must remain consistent in their text and graphic representation. If any item has an icon and text, all siblings in that row must also carry an icon and text.

## 8. The Four-Condition Consensus Law & Mandatory Consensus Banner
- **8.1. Four Consensus Conditions**: A consensus closes ONLY when: 1) Both parties stated a position; 2) Each attacked the other's position; 3) What survived is recorded with who conceded and why; 4) Neither party can name another place it applies.
- **8.2. Mandatory Consensus Banner Line**: Every proposal/recommendation MUST open with: `CONSENSUS · REVIEWER POSITION: [stated / none] · BUILDER POSITION: [stated / none] · ATTACKED: [both / one / neither] · WHO CONCEDED: [name, or nothing conceded]`
- **8.3. Governor Refusal Mechanism**: If missing or reading `none`/`neither`, the Governor REFUSES the message instantly.
- **8.4. Builder Guard Line**: Every Builder reply MUST include: `CONSENSUS CHECK — POSITIONS STATED: [both/one/neither] · ATTACKED: [yes/no] · READY FOR THE GOVERNOR: [yes/no, and what is missing]`
- **8.5. Mandatory Creation Protocol Sequence & Canonical Term**: `CONSENSUS -> DRAFT PLAN -> REVIEW AND FINE-TUNE -> GOVERNOR RATIFICATION -> IMPLEMENTATION`. "DRAFT PLAN" is the canonical term everywhere. Nothing is implemented without Governor Ratification of a Draft Plan.

---
history:
  - timestamp: "2026-08-11T00:28:00Z"
    action: "ADDED_UX_UI_CONSISTENCY_AND_SINGLE_ROW_ENFORCEMENT_LAWS"
    actor: "GOOGLE_ANTIGRAVITY_ADAPTER"
    version: "1.5"
  - timestamp: "2026-08-05T13:53:00Z"
    action: "CREATED_INITIAL_ROOT_RULES"
    actor: "GOOGLE_ANTIGRAVITY_ADAPTER"
    version: "1.0"
  - timestamp: "2026-08-05T14:30:00Z"
    action: "ADDED_CLOUD_MODEL_SELECTION_POLICY"
    actor: "GOOGLE_ANTIGRAVITY_ADAPTER"
    version: "1.1"
  - timestamp: "2026-08-05T14:32:00Z"
    action: "RATIFIED_FOUR_QUESTIONS_AND_DESTRUCTIVE_GOVERNANCE_LAWS"
    actor: "GOOGLE_ANTIGRAVITY_ADAPTER"
    version: "1.2"
  - timestamp: "2026-08-06T23:57:00Z"
    action: "CONSOLIDATED_CORE_SPINES_INTO_CORE_FOLDER_DECOUPLED_EXCHANGE"
    actor: "GOOGLE_ANTIGRAVITY_ADAPTER"
    version: "1.3"
  - timestamp: "2026-08-07T02:01:00Z"
    action: "RENAMED_CORE_SPINE_TO_CONTROL_PLANE_TERMINOLOGY"
    actor: "GOOGLE_ANTIGRAVITY_ADAPTER"
    version: "1.4"
