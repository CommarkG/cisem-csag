---
metadata:
  owner: "CISEM_GOVERNOR"
  canonical_location: "C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\cisem_core\\planning\\2026-08-08__AntigravityLocal__YarivHuman__SandboxThresholdProtocol__V1.0.md"
  artifact_status: "DRAFT"
  maturity: "PROPOSAL"
  version: "1.0"
  inherited_authorities: []
  related_axioms: ["AX-10000", "PR-11000", "PR-13980"]
---

# Sandbox Creation and Ingestion Threshold Protocol

1.1. **Introduction**:
Because sandbox prototyping is irregular, experimental, and fast-paced, it cannot be governed by the strict, slow-moving creation thresholds applied to the platform's core code plane. This document defines the specific **Sandbox Creation and Ingestion Threshold Protocol (`PR-13990`)** to allow frictionless exploration while preventing structural leakage and debt.

---

## 2. Sandbox Creation Threshold Rules

2.1. **Rule 1: Physical Boundary Enforcement (Sandbox Location Lock)**:
- *Condition*: All sandbox experiments, prototypes, and mockups MUST reside exclusively under `/sandbox/[category]/`.
- *Enforcement*: Any file created outside of the `/sandbox/` root directory that claims sandbox bypass status will be blocked instantly by `cisem_gate.py`.

2.2. **Rule 2: Zero Core Import Boundary (Zero Import Rule)**:
- *Condition*: Core source files residing in `/src` or `/backend` are strictly prohibited from importing any code, types, components, or modules from `/sandbox`.
- *Enforcement*: The compiler gate parses all imports in `/src` and `/backend`. If an import matches `/sandbox/`, the build terminates.

2.3. **Rule 3: Database Isolation & Prefixing (Fenced DB Tables)**:
- *Condition*: Sandbox database migrations and schema experiments must never modify core system tables. They must use either:
  1. A separate dedicated PostgreSQL schema (e.g. `sandbox_schema`).
  2. Sandbox-prefixed table names (e.g. `sandbox_crm_leads`).
- *Enforcement*: The Supabase connection router blocks sandbox transactions that target core database tables.

2.4. **Rule 4: Sandbox Expiry & Archiving Threshold (The Stale-Exploration Rule)**:
- *Condition*: Sandboxes are not permanent. If a sandbox directory has not been modified for more than 15 developer turns, it is flagged as `STALE_EXPLORATION`.
- *Enforcement*: The system zips the folder, moves the backup archive to `scratch/archived_workspace_clutter/`, and deletes the active sandbox path to prevent repository bloat.

---

## 3. Sandbox Promotion Ingestion Threshold

3.1. **The Ingestion Bar**:
To promote code from the sandbox to the core, the module must pass the **Gestation Magnitude Threshold**:
- **Gestation Turn Floor**: The prototype must remain active in the sandbox for at least 3 developer turns before promotion is allowed.
- **Audit Requirement**: The `CisemAuditor.py` report must score greater than 80% on Contextual Persona Relevance.
- **DNA Align Verification**: The promoter must answer the 5 promotion checkpoint questions (Section 5 of the Enterprise Scale Architecture Blueprint).

---
history:
  - timestamp: "2026-08-08T23:55:00Z"
    action: "CREATED_SANDBOX_THRESHOLD_PROTOCOL"
    actor: "GEMINI_BRAIN"
    version: "1.0"
