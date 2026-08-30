---
metadata:
  owner: "CISEM_GOVERNOR"
  canonical_location: "C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\2026-08-05__GoogleAntigravity__CXP__ImplementationPlan__V1.2.md"
  artifact_status: "DRAFT"
  maturity: "WORKING_DRAFT"
  version: "1.0"
  role_type: "IMPLEMENTATION_PLAN"
---

# Implementation Plan: CISEM Exchange Protocol (CXP) Specification

---
metadata:
  owner: "CISEM_GOVERNOR"
  canonical_location: "C:\\Users\\finky\\Desktop\\AntiGravity\\Marketing CoreHub CsAg\\2026-08-05__GoogleAntigravity__CXP__ImplementationPlan__V1.2.md"
  artifact_status: "DRAFT"
  maturity: "WORKING_DRAFT"
  version: "1.2"
  inherited_authorities:
    - "CISEM Project Constitution"
  related_implementation_adapter: "GOOGLE_ANTIGRAVITY_ADAPTER"
  local_edits_allowed: false
  role_type: "CANONICAL_IMPLEMENTATION_PLAN"
---

## 1. Existing-First Inspection Record

The local project directory [`C:\Users\finky\Desktop\AntiGravity\Marketing CoreHub CsAg`](file:///C:/Users/finky/Desktop/AntiGravity/Marketing%20CoreHub%20CsAg) contains:
- `.agents/rules/workspace_alignment.md` (Durable rule preventing directory mismatch).
- `.credentials/google-drive-key.json` (Service account credential).
- `.env` (Local configuration file).
- `.gitignore` (Git ignore rules).
- `9000__INTERSYSTEM_EXECUTION_EXCHANGE/` (Exchange transport folder containing downloaded CXP planning templates).
- Specification and schema files.

No application source files (FastAPI, Next.js, database schemas) have been written yet, maintaining a clean state.

---

## 2. Local and Drive Paths

- **Transport Medium**: Google Drive Folder (polled via Local File Sync).
- **Canonical Folder ID**: `1dy0hixngOGeRhvLsvi5dEY9F3Y8pl8ct` (representing `9000__INTERSYSTEM_EXECUTION_EXCHANGE` subfolder).
- **Local Path**: `C:\Users\finky\Desktop\AntiGravity\Marketing CoreHub CsAg\9000__INTERSYSTEM_EXECUTION_EXCHANGE\`
- **Source of Truth Location**: Workspace root `/Marketing CoreHub CsAg/`.
- **Cache Location**: Brain folder `<appDataDir>\brain\<conversation-id>/` (marked `NON_AUTHORITATIVE_CACHE`).

---

## 3. Local Adapter Module Boundaries

The implementation of `cxp_adapter.py` V1.2 is structured into distinct functional boundaries:

1. **Local Watcher**: Scans `9000__INTERSYSTEM_EXECUTION_EXCHANGE/` locally for files matching `CXP__*.yaml`.
2. **Packet Parser**: Reads file content and parses the YAML format into python dictionaries.
3. **Schema Validator**: Validates the packet structure, types, and required fields against the JSON Schema.
4. **Event Stream Validator**: Enforces the 10 ordering, contiguity, transition, actor scope, terminal, and content hash validation checks before claiming.
5. **Capability Matcher**: Checks intent requirement declarations against the adapter's capabilities listed in the Capability Registry (`2026-08-05__CISEM__CXP__CapabilityRegistry__V1.2.yaml`).
6. **Replay Engine**: Replays all events in `event_stream` to reconstruct the `derived_view`.
7. **Authority Validator**: Verifies Governor identity, human bridge status, and that `recipient == "ANTIGRAVITY_ADAPTER"`.
8. **Lifecycle Controller**: Appends a new event object (with sequence increment, previous event reference, and transition timestamps) to the `event_stream` array.
9. **Intent Registry**: Contains the static map of supported intent names.
10. **Intent Runner**: Maps the parsed intent name to its safe python execution function.
11. **Evidence Validator**: Inspects output evidence formats and signs/registers them.
12. **Lessons Learned Engine**: Captures operational findings and appends them to the `lessons_learned` list.
13. **Response Writer**: Appends responses and evidence to the packet file atomically using the temporary file rewrite strategy.

---

## 4. Safety Rules & Execution Strategies

- **No Arbitrary Shell Execution**: The adapter does *not* support running raw strings. If a packet contains a command parameter, it is ignored unless it maps to a pre-defined python function in the static `Intent Registry`.
- **Atomic Write Strategy**: To prevent partial write corruption on active folders, the Response Writer will first write all updates to a temporary file (e.g. `temp_packet.tmp`) and then atomically rename/overwrite it to the target `.yaml` file.
- **Lease and Stale-Claim Recovery**:
  - A claim lock includes a lease timestamp (`lease_expires_at`).
  - If a local worker crashes, the lease expires. A subsequent runner detects that the final event in the timeline is `CLAIMED` but the current time exceeds `lease_expires_at`, allowing it to reclaim the packet safely by appending a new `CLAIMED` event.
- **Duplicate Packet Rejection**: The adapter stores a history of processed `packet_id` and `idempotency_key` strings in a local state file. If a duplicate is received, the adapter ignores it and does not re-execute.
- **Crash Recovery & Rollback**: If an execution throws an unhandled exception, the adapter catches the exception, updates the packet status to `FAILED`, writes the error to the response block, and halts to prevent cascading failures.

---

## 5. Model Selection Governance

The Cloud Orchestrator does not hardcode model parameters:

```yaml
cloud_model:
  provider: OPENAI
  model: ""
  selection_status: AWAITING_HUMAN_DECISION
```

The system will allow the model selection to be configured dynamically in the orchestrator's script properties without changing the protocol structure.

---

## 6. BOOTSTRAP-001 & TEST-001 Scope

### BOOTSTRAP-001 (Local Self-Consistency Test):
This phase runs entirely locally before any cloud synchronization. The adapter executes a script to:
- Generate a valid `BOOTSTRAP-001` test packet locally.
- Validate it against the JSON Schema.
- Run the Event Stream Validator to verify chain integrity.
- Replay and derive the correct local state.
- Append local execution events (`CLAIMED`, `EXECUTING`, `COMPLETED`).
- Capture lessons learned and write the output packet cleanly.
- Verify that modifying or deleting an event in the local file throws an immediate validation error.

### TEST-001 (Cloud-Local Loop Verification):
Runs after `BOOTSTRAP-001` passes. The adapter monitors the Google Drive directory, claiming and validating execution intents produced by the cloud orchestrator.

---

## 7. History Log
```yaml
history:
  - timestamp: "2026-08-05T13:47:00Z"
    action: "CREATED_INITIAL_SPECIFICATION"
    actor: "GOOGLE_ANTIGRAVITY_ADAPTER"
    version: "1.0"
  - timestamp: "2026-08-05T14:05:00Z"
    action: "TRANSITION_TO_APPEND_ONLY_EVENT_SOURCING"
    actor: "GOOGLE_ANTIGRAVITY_ADAPTER"
    version: "1.1"
  - timestamp: "2026-08-05T14:10:00Z"
    action: "RESOLVED_EVENT_SOURCED_REPLAY_VALIDATION_MATRIX"
    actor: "GOOGLE_ANTIGRAVITY_ADAPTER"
    version: "1.2"
  - timestamp: "2026-08-05T14:12:00Z"
    action: "INTEGRATED_BOOTSTRAP_PHASE_AND_CAPABILITIES"
    actor: "GOOGLE_ANTIGRAVITY_ADAPTER"
    version: "1.2"
```
