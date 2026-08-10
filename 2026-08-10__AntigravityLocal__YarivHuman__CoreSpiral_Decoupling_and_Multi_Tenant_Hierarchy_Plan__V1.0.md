---
plan_id: CISEM-IP-20260810-CORE-SPIRAL
blast_radius: HIGH
axioms_linked:
- AX-10000
- AX-20000
- AX-60000
- PR-11100
- PR-11500
- PR-13990
- AX-SPIRAL-01
- AX-SPIRAL-02
- AX-SPIRAL-03
- AX-SPIRAL-04
- AX-SPIRAL-05
- PR-105000
pre_review_status: PASSED
pre_reviewed_at: '2026-08-10T04:58:48.098605Z'
---

# CoreSpiral Decoupling and Multi-Tenant Hierarchy

Consolidated implementation plan to decouple the CISEM Deep Platform Core from the Universal Solution Core and deploy a graph-based multi-tenant user hierarchy across 4 non-rigid CoreCycles.

## User Review Required

> [!IMPORTANT]
> - **Consensus Database Schema**: Roles are modeled as first-class entities with a dedicated `role_definitions` table. Feature flags are relationally mapped via `feature_registry` and `package_feature_grants` to support clean auditing.
> - **Security Isolation**: Database isolation is achieved using PostgreSQL Row-Level Security (RLS) bound to middleware JWT TenantContext variables, with the legacy `X-User-Role` header sunsetted in production.
> - **Ingestion Checks**: Plan Ingestor validation includes depth verification to ensure CoreCycle dependency inheritance matches reality.

## Open Questions

> [!NOTE]
> None. All model feedback from Gemini 3.6, Claude Opus, and GPT-OSS has been reconciled.

## Proposed Changes

### Component: Deep Core Database migrations

#### [MODIFY] [migrations.sql](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/migrations.sql)
- Append migration steps 25-33 to create `role_definitions`, `packages`, `feature_registry`, `package_feature_grants`, `users`, `user_account_roles`, and `template_registry` tables.

### Component: Core Decoupling directories

#### [NEW] [platform_core/](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/platform_core/)
- Establish directory for security middleware, compiler gate scripts, and ingestion policies.

#### [NEW] [solution_core/](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/solution_core/)
- Establish directory for canonical templates, UI block registries, and visual DNA assets.

### Component: Planning & Methodology Specifications

#### [NEW] [CoreSpiralDecouplingImplementationPlan__V1.3.md](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/2026-08-10__Gemini3.5__YarivHuman__CoreSpiralDecouplingImplementationPlan__V1.3.md)
- Contains the detailed 4-cycle execution matrix, active pillar lifecycles, and consensus resolves.

#### [DELETE] [CoreSpiralDecouplingImplementationPlan__V1.2.md](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/2026-08-10__Gemini3.5__YarivHuman__CoreSpiralDecouplingImplementationPlan__V1.2.md)
- Archival deletion of initial V1.2 plan (backed up to `cisem_core/archive/2026-08-10__Gemini3.5__YarivHuman__CoreSpiralDecouplingImplementationPlan__V1.2.md.bak`).

## Gemini Brain Multi-Persona Audit

1.1. **Auditor Panel Verdicts**:
- **Role Storage Format**: Unanimous support for Option A (Relational `role_definitions` table). Avoids typo cascades and makes metadata updates O(1).
- **Package Feature Grant Schema**: Unanimous support for Option A (Normalized join table). Ensures referential integrity and enables simple compliance joins.
- **CoreSpiral Stage Naming**: Unanimous support for Option B (Neutral placeholders in specification, descriptive labels in plan instances). Prevents label-locking and technical debt.

1.2. **Integration Verification**: All council suggestions have been fully integrated into the ratified CoreSpiral Decoupling Implementation Plan (V1.3).

## Verification Plan

### Automated Tests
- Run `python cisem_core/cisem_gate.py` to confirm that the naming, structure, and methodology gates pass cleanly.

### Manual Verification
- Review the consolidated matrix design and dependencies mapping.
