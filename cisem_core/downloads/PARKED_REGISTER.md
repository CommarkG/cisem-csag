# CISEM PARKED REGISTER (`cisem_core/PARKED_REGISTER.md`)

---
metadata:
  owner: "CISEM_GOVERNOR"
  canonical_location: "cisem_core/PARKED_REGISTER.md"
  artifact_status: "RATIFIED_REGISTER"
  governor_ruling: "RULING_TWO_GOV_2026_09_01"
  rule_type: "APPEND_ONLY_REGISTER"
---

## GOVERNOR RULING TWO LAW
Every parked item MUST be written immediately to `cisem_core/PARKED_REGISTER.md` as it is parked — never in a batch afterwards.
This file is APPENDED TO, NEVER REWRITTEN. Any removed or resolved entry must append a closing resolution entry stating why and when it was closed.

Each entry carries five mandatory non-blank fields:
1. `WHAT IT IS`: One-line summary description.
2. `WHERE IT WAS FOUND`: Conversational turn, file path, or live database query.
3. `WHY IT IS PARKED`: Which of the four Core items (Onboarding, Product Definition, Quote to Work Order, Screens for those 3) it DOES NOT block.
4. `WHAT IT COSTS TO LEAVE`: Impact of deferring (free later or migration cost).
5. `DATE PARKED`: ISO 8601 date string (e.g. `2026-09-01`).

---

## REGISTERED PARKED ITEMS

### 1. Route-Path Validation in Pre-Commit Linters
- `WHAT IT IS`: Automated validation of FastAPI route paths in `gate_schema_alias_map.py` against live `main.py` decorators.
- `WHERE IT WAS FOUND`: Turn 276 review / `cisem_core/tools/gate_schema_alias_map.py`.
- `WHY IT IS PARKED`: Core functions without linter route checking (Does not block Onboarding, Product Definition, or Quote to Work Order).
- `WHAT IT COSTS TO LEAVE`: Free later (Tooling enforcement addition).
- `DATE PARKED`: 2026-09-01

### 2. Dual-Channel Symbol Qualification Enforcement (`provision_tenant`)
- `WHAT IT IS`: Automated enforcement of channel prefixes (`[PYTHON-CHANNEL]` vs `[DATABASE-CHANNEL]`) for colliding symbols across Python and PostgreSQL.
- `WHERE IT WAS FOUND`: Turn 276 review / `backend/src/backend/provisioning.py` & PostgreSQL `pg_proc`.
- `WHY IT IS PARKED`: Core functions without symbol channel linter (Does not block Onboarding, Product Definition, or Quote to Work Order).
- `WHAT IT COSTS TO LEAVE`: Free later (Documentation & linter convention).
- `DATE PARKED`: 2026-09-01

### 3. Retirement of 19 Unused Database Tables & SQL `public.provision_tenant`
- `WHAT IT IS`: DDL drop scripts and registry cleanup for 19 orphan tables and duplicate SQL `public.provision_tenant` function.
- `WHERE IT WAS FOUND`: Turn 270 / `cisem_core/live_schema_registry.json` audit.
- `WHY IT IS PARKED`: Core functions without dropping orphan tables (Does not block Onboarding, Product Definition, or Quote to Work Order).
- `WHAT IT COSTS TO LEAVE`: Free later (Single cleanup DDL script execution).
- `DATE PARKED`: 2026-09-01

### 4. Hardcoded Check Constraints Migration (`pending_claims` & `vocabulary_terms`)
- `WHAT IT IS`: Migration converting hardcoded PostgreSQL CHECK constraints to foreign key platform tables (`cr_claim_statuses`).
- `WHERE IT WAS FOUND`: Turn 275 review / `information_schema.check_constraints`.
- `WHY IT IS PARKED`: Core functions without converting check constraints (Does not block Onboarding, Product Definition, or Quote to Work Order).
- `WHAT IT COSTS TO LEAVE`: Low migration cost (ALTER TABLE DDL later).
- `DATE PARKED`: 2026-09-01

### 5. Classification of 20 UNCLASSIFIED Registry Tables
- `WHAT IT IS`: Categorization of 20 UNCLASSIFIED tables in `cr_ext_registry.json` into CR or EXT domain categories.
- `WHERE IT WAS FOUND`: Turn 270 / `cisem_core/cr_ext_registry.json`.
- `WHY IT IS PARKED`: Core functions without registry layer tags (Does not block Onboarding, Product Definition, or Quote to Work Order).
- `WHAT IT COSTS TO LEAVE`: Free later (JSON metadata tag edits).
- `DATE PARKED`: 2026-09-01

### 6. Sub-Artifacts A4, A6, A7, and A8 Pure Markdown Specifications
- `WHAT IT IS`: Writing pure markdown sub-artifacts A4 (Catalog Rules), A6 (Pricing Engine), A7 (Quote Pipeline), and A8 (Work Order Execution).
- `WHERE IT WAS FOUND`: Turn 271 Governor Ruling / `cisem_core/planning/`.
- `WHY IT IS PARKED`: Sub-artifacts get written from running code, not in advance (Does not block Step 1 Onboarding build).
- `WHAT IT COSTS TO LEAVE`: Free later (Written concurrently with code implementation).
- `DATE PARKED`: 2026-09-01

### 7. Medusa E-Commerce Engine Absorption & Integration
- `WHAT IT IS`: Integrating Medusa JS e-commerce engine with CISEM PostgreSQL backend.
- `WHERE IT WAS FOUND`: Turn 265 architectural review / `backend/`.
- `WHY IT IS PARKED`: Core functions without Medusa absorption (Does not block Onboarding, Product Definition, or Quote to Work Order).
- `WHAT IT COSTS TO LEAVE`: Moderate integration effort later.
- `DATE PARKED`: 2026-09-01

### 8. Multi-Repo Governance Separation & Multi-Tenant Extraction
- `WHAT IT IS`: Splitting `cisem-csag` governance tools into a separate multi-repo governance workspace.
- `WHERE IT WAS FOUND`: Turn 268 Governor Ruling / Governance Separation Analysis.
- `WHY IT IS PARKED`: Single repo co-evolution is ratified; none of the 4 governance triggers have fired (Does not block Onboarding, Product Definition, or Quote to Work Order).
- `WHAT IT COSTS TO LEAVE`: Free later (Repo extraction when 4 triggers fire).
- `DATE PARKED`: 2026-09-01
