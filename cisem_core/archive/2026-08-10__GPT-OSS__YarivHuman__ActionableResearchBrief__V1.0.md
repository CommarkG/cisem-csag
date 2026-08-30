---
metadata:
  owner: "CISEM_GOVERNOR"
  canonical_location: "C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\2026-08-10__GPT-OSS__YarivHuman__ActionableResearchBrief__V1.0.md"
  artifact_status: "DRAFT"
  maturity: "WORKING_DRAFT"
  version: "1.0"
  role_type: "RESEARCH_BRIEF"
  author: "GPT-OSS (Antigravity)"
  related_axioms: []
---

# 7.2 Actionable Research Brief: CSAG Multi-Tenant User Hierarchy & Universal Solution Core

## 0. Clarification Questions (Awaiting Your Input)

1. **User Entity Model** – Should we introduce a dedicated `users` table (many‑to‑many with `customer_accounts` via `user_account_roles`) or embed role information directly within `customer_accounts` (single‑tenant hierarchy)?
2. **Package Definition Granularity** – How many package tiers are final (e.g., Starter, Growth, Enterprise) and what high‑level feature sets differentiate them? Do you want feature flags stored in a new `packages` table or inferred from a `subscription_tier` column on `customer_accounts`?
3. **Enforcement Layer Preference** – Do you prefer **Row‑Level Security (RLS)** policies for package/role enforcement at the DB layer, **middleware** checks in FastAPI, or a combination of both?
4. **Template Registry Storage** – Should templates be primarily stored as **JSON blobs in a new `template_registry` table** (leveraging the existing `custom_libraries`/`lookup_registry` pattern) or as **filesystem assets under a dedicated directory** (`cisem_core/solution_core/templates/`)?
5. **Dual Corespine File Placement** – For the separate Corespine lineages, do you want a top‑level `cisem_core/platform_core/` and `cisem_core/solution_core/` hierarchy, with each containing its own `README.md` and associated source files?
6. **Sandbox Promotion Protocol Scope** – When a Team Leader duplicates a template into their private sandbox, should this be a **Wizard** (requires in‑flight judgment like naming) or a **Pipeline** (fully automated based on preset rules)?
7. **Existing Role Header Transition** – The current `X-User-Role` header is used in `main.py`. Should we migrate to the cryptographically signed `TenantContext` (AX‑11100) for all future permission checks, or keep the header as a fallback?

## 1. Answers (To be completed after clarification)

**1. Dual Core Separation**
- Proposed lineage definitions … (pending clarification).

**2. Multi‑Tier User Accounts**
- Schema extensions …

**3. Package Bundling & Overlays**
- Overlay invariant core …

**4. Template Library Operations**
- Tagging strategy …

**5. Unified Request Lifecycle**
- End‑to‑end flow …

---

*Please respond to the clarification questions above so I can finalize the architectural design and produce the implementation plan.*
