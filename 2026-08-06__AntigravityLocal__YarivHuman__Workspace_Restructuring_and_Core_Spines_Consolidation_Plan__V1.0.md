---
metadata:
  owner: "CISEM_GOVERNOR"
  canonical_location: "C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\2026-08-06__AntigravityLocal__YarivHuman__Workspace_Restructuring_and_Core_Spines_Consolidation_Plan__V1.0.md"
  artifact_status: "DRAFT"
  maturity: "WORKING_DRAFT"
  version: "1.0"
  role_type: "IMPLEMENTATION_PLAN"
---

# Implementation Plan: Workspace Restructuring and Core Spines Consolidation

This plan proposes an architectural restructuring of the CISEM workspace to resolve the category error of treating coordinating "core spines" as application endpoints. We consolidate all spine mechanisms into `cisem_core/`, decouple the intersystem exchange folder, and clean up empty project folders.

## User Review Required

> [!IMPORTANT]
> This is a major directory restructuring plan.
> It will move all validator, watcher, adapter, and registry files to `cisem_core/` and update internal path references.
> The obsolete directories `Marketing CoreHub CsAg/` and `Planning CoreHub CsAg/` will be deleted, and the exchange directory `9000__INTERSYSTEM_EXECUTION_EXCHANGE/` will be moved to the workspace root.

---

## Proposed Changes

### 1. Central Core Spine Subsystem (`cisem_core/`)
We create a unified `cisem_core/` folder to contain all coordinating and validator scripts, config files, and specifications.

#### [NEW] [cisem_core/](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core)
- A new directory created in the workspace root to house all core spine elements.

#### [MOVE] [cisem_gate.py](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_gate.py) -> [cisem_core/cisem_gate.py](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/cisem_gate.py)
- Moves the compiler gate script to `cisem_core/`.
- Updates path constants (`TURN_COUNTER_PATH`, `CAEL_STATUS_PATH`, `PARKING_VAULT_PATH`) to reside internally.

#### [MOVE] [CisemSync.py](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/CisemSync.py) -> [cisem_core/CisemSync.py](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/CisemSync.py)
- Moves the document sync controller to `cisem_core/`.
- Updates `BRAIN_ROOT` and `ROOT_DIR` constants.

#### [MOVE] [sandbox_code_review/*](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/sandbox_code_review) -> [cisem_core/sandbox/*](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/sandbox)
- Moves validator assets: `CisemATV.py`, `CisemAuditor.py`, `CisemSanitizer.py`, `parking_vault_draft.yaml`, `root_cause_registry.json`, `persona_registry_draft.yaml`, `persona_scenario_map.yaml`.
- Updates `CisemATV.py` and `CisemAuditor.py` path constants to resolve relative to `cisem_core/`.

#### [MOVE] CXP Adapter & Watcher scripts -> [cisem_core/cxp/](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/cxp)
- Moves `2026-08-05__GoogleAntigravity__Cxp__CxpWatcher__V0.1.py`, `CxpAdapter.py`, `GasOrchestrator.js`, and `WorkspaceReconciler.py` to `cisem_core/cxp/`.
- Updates `EXCHANGE_DIR` and `STATUS_FILE_PATH` in the watcher to point to root exchange.

#### [MOVE] [cael_status.json](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cael_status.json) -> [cisem_core/cael_status.json](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/cael_status.json)
- Moves the CAEL status file.

#### [MOVE] [cisem_turn_counter.json](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_turn_counter.json) -> [cisem_core/cisem_turn_counter.json](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/cisem_turn_counter.json)
- Moves the turn counter file.

---

### 2. Exchange Decoupling
We move the synchronized exchange folder out of the obsolete sub-project directory into the workspace root.

#### [MOVE] Intersystem Exchange -> [9000__INTERSYSTEM_EXECUTION_EXCHANGE/](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/9000__INTERSYSTEM_EXECUTION_EXCHANGE)
- Moves the exchange directory from `Marketing CoreHub CsAg/9000__INTERSYSTEM_EXECUTION_EXCHANGE` to the workspace root `Cisem CsAg/9000__INTERSYSTEM_EXECUTION_EXCHANGE`.

---

### 3. Cleanup & Pruning
We delete empty and obsolete directories to simplify the workspace structure.

#### [DELETE] [Marketing CoreHub CsAg/](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/Marketing%20CoreHub%20CsAg)
- Deletes the directory after moving all core exchange files.

#### [DELETE] [Planning CoreHub CsAg/](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/Planning%20CoreHub%20CsAg)
- Deletes the empty directory.

---

### 4. Canonical Specifications & Registry Alignment
We update core rule files and registries to align with the new structure.

#### [MODIFY] [GEMINI.md](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/GEMINI.md)
- Modifies Section 1 (Directory & Workspace Alignment Law) to enforce the separation between `cisem_core/` (unified spine) and `Supplier Scraper CsAg/` (active application endpoint).

#### [MODIFY] [Universal Workspace and Accountability Registry](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/2026-08-05__CISEM__Universal_Workspace_and_Accountability_Registry__V1.1.yaml)
- Increments version to `V1.2`.
- Updates `canonical_directory` values for subsystems and platform adapters to `cisem_core/`.
- Prunes the obsolete `MARKETING_COREHUB` and `PLANNING_COREHUB` projects, leaving `SUPPLIER_SCRAPER` as the primary local application endpoint.

---

## Verification Plan

### Automated Tests
- Execute `cisem_core/sandbox/CisemAuditor.py` and `cisem_core/sandbox/CisemATV.py` to confirm all validation checks and persona triggers evaluate successfully relative to the new `cisem_core/` path structure.
- Run `python cisem_core/CisemSync.py` to confirm walkthrough synchronization executes cleanly.
- Run `python cisem_core/cisem_gate.py` compiler checks to confirm Phase 0–5 block validations pass nominal gate checks.

### Manual Verification
- Verify that `Marketing CoreHub CsAg/` and `Planning CoreHub CsAg/` folders are successfully removed from the workspace root.
