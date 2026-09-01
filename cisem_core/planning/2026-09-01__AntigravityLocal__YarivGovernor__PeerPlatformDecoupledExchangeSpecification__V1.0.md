# Peer Platform Decoupled Exchange Specification (CISEM <-> CSP / CSPS)
Target: cisem_core/planning/2026-09-01__AntigravityLocal__YarivGovernor__PeerPlatformDecoupledExchangeSpecification__V1.0.md
Authority: Governor Yariv / Reviewer Claude / Antigravity
Version: 1.0

---

## 1. PURPOSE & IDENTITY STATEMENT

1.1. **Platform Identity**:
- `CISEM` (this platform located at `C:\Users\finky\Desktop\AntiGravity\Cisem CsAg`) is the primary multi-tenant B2B ERP product, PostgreSQL database architecture, and governance orchestration engine.
- `CSP` and `CSPS` are peer/colleague platforms operating in independent repositories.

1.2. **The Peer Learning Objective**:
- `CISEM`, `CSP`, and `CSPS` are decoupled colleagues. They do NOT share live database state, direct code imports, or shared runtime memory.
- However, they learn from each other by exchanging structured, schema-validated practice packets, linter rules, and lesson post-mortems through a mechanical file-based exchange channel (`9000__INTERSYSTEM_EXECUTION_EXCHANGE/`).

---

## 2. THE THREE MECHANICAL EXCHANGE LAWS

2.1. **Law 1: Zero Live State Coupling**:
- CISEM's PostgreSQL database (`customer_accounts`, `quotes`, `cr_account_types`, `cr_ext_registry`) and backend APIs (`backend/src/backend/main.py`) MUST NEVER execute foreign DDL, import foreign module paths, or connect to CSP/CSPS database instances.

2.2. **Law 2: Channel Isolation (`9000__INTERSYSTEM_EXECUTION_EXCHANGE/`)**:
- All cross-platform knowledge packets, lesson reports, and linter definitions MUST be transferred strictly as JSON artifacts dropped in `9000__INTERSYSTEM_EXECUTION_EXCHANGE/` (e.g. `CXP__Cisem__CC01__PRACTICE_INGESTION__V1.json`).

2.3. **Law 3: The Three-Stage Lesson Ingestion Ladder**:
- Any lesson or gate mechanism imported from CSP/CSPS must pass three mechanical filters before being integrated into CISEM:
  1. **Provenance Filter**: Confirm origin packet in `9000__INTERSYSTEM_EXECUTION_EXCHANGE/`.
  2. **Purification Filter**: Strip foreign tenant IDs, external table names, and foreign environment strings.
  3. **Local Adaptation Filter**: Re-bind the core logic to CISEM's `live_schema_registry.json` and pre-commit linters (`gate_cr_ext_dependency.py`, `gate_schema_alias_map.py`, `gate_dr_kill_switch.py`).

---

## 3. AUDIT & GATE ENFORCEMENT

3.1. **Pre-Commit Isolation Gate (`gate_peer_exchange_isolation.py`)**:
- Pre-commit gate script verifying that zero hardcoded CSP/CSPS repository paths or database connection strings exist in CISEM application code.
