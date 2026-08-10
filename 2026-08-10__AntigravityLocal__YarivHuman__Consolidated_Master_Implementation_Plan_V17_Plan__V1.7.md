---
plan_id: CISEM-IP-20260810-CONSOLIDATED-MASTER-V17
blast_radius: HIGH
axioms_linked:
- AX-10000
- AX-50000
- PR-58950
- PR-76000
- PR-95000
pre_review_status: PASSED
pre_reviewed_at: '2026-08-10T08:06:05.601071Z'
---

# Consolidated Master Implementation Plan (V1.7)

This master plan integrates **Plan A (Governance Hardening & Decoupling)** and **Plan B (UX/UI Dashboard & Monetization)** into a unified execution sequence. It resolves prior conflicts by establishing explicit dependency constraints, implementing a federated registry, and embedding expert panel recommendations (Ed25519 signatures, tiered accessibility checks, and a 30-day downgrade grace period).

---

## The Four-Question Checkpoint

1. **What already exists?**
   - Compile-time gate ([`cisem_gate.py`](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/platform_core/cisem_gate.py)) and system scripts containing static paths.
   - A passive `graphify.config.json` configuration file.
   - Decoupled registries in `Cisem CsAG Core Councils/Cisem AntiGravity & Gemini Brain/`.

2. **Where should this belong?**
   - Configs & system paths: `cisem_core/platform_core/2026-08-10__CISEM__AntigravityLocal__CisemConfig__V1.0.py`.
   - Continuous Audit Daemon: `cisem_core/platform_core/2026-08-10__CISEM__AntigravityLocal__ContinuousAuditorDaemon__V1.0.py`.
   - AST Relationship Mapping: `cisem_core/platform_core/2026-08-10__CISEM__AntigravityLocal__GraphifyDependencyMapper__V1.0.py`.
   - Sandbox Preview Staging: `src/app/sandbox/[sample]/page.tsx`.
   - Federated UI registry: `templates/2026-08-10__CISEM__AntigravityLocal__TemplatesRegistry__V1.0.yaml`.

3. **What will this affect?**
   - Compilation and verification gates in `cisem_gate.py`.
   - Next.js folder structure, styling rules, dependencies, and API routing.
   - System resource usage (background audit daemon running continuously).

4. **What is the smallest executable proof that validates this decision?**
   - A verification loop running the Next.js dev server, performing mock license exports with signed Ed25519 context objects, and executing `cisem_gate.py` locally to verify 0 errors.

---

## User Review Required

> [!IMPORTANT]
> **Plan B Cross-Plan Dependency**: UX/UI setup is strictly blocked until Governance CoreCycle 5 is completed and verified.
>
> **Ed25519 Security Standard**: All `TenantContext` verification endpoints use asymmetric Ed25519 signing, ensuring edge nodes can validate keys without storing the master private secret.
>
> **Tiered Accessibility**: WCAG contrast violations (contrast < 4.5:1) will trigger warnings for Tier 2 exports but will **hard-block** Tier 3 (Enterprise Whitelabel) exports to protect platform compliance.

---

## Open Questions

- **Q: Registry Bloat**: Resolved by using a **Federated Registry** pattern (storing UI templates in `TemplatesRegistry__V1.0.yaml` and referencing it via `$ref` from the main registry).
- **Q: MVP Scale**: Resolved to launch with **6 core components** (Hero, Navigation, Feature Grid, Pricing, CTA, Footer) for agile validation.
- **Q: Downgrades**: A **30-day read-only grace period** is granted to downgraded Git-sync pipelines.

---

## Proposed Changes

### Cycle 1: Governance Decoupling & Exception Conversion (Plan A Phase 1)
- **Path Resolution**: Create `CisemConfig.py` to resolve runtime paths from environmental variables (`CISEM_ROOT`, `BRAIN_ROOT`).
- **Exceptions**: Refactor `WorkspaceReconciler.py` and `CisemSync.py` to raise import-safe exceptions instead of executing raw `sys.exit(1)`.

#### [NEW] [CisemConfig](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/platform_core/2026-08-10__CISEM__AntigravityLocal__CisemConfig__V1.0.py)
#### [MODIFY] [WorkspaceReconciler.py](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/cxp/2026-08-05__GoogleAntigravity__Cxp__WorkspaceReconciler__V0.1.py)

---

### Cycle 2: Continuous Auditing & Gating (Plan A Phase 2)
- **3-Tier Scope Gate**: Add Phase 18 to `cisem_gate.py` to validate context metadata.
- **Continuous Daemon**: Instantiate `ContinuousAuditorDaemon` to run non-blocking checks in the background.

#### [NEW] [ContinuousAuditorDaemon](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/platform_core/2026-08-10__CISEM__AntigravityLocal__ContinuousAuditorDaemon__V1.0.py)
#### [MODIFY] [cisem_gate.py](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/platform_core/cisem_gate.py)

---

### Cycle 3: Base UX/UI Setup (Plan B Phase 1)
- **Initialization**: Run `npx -y shadcn@latest init -y` and `npm install framer-motion`.
- **Sandbox Isolation**: Set up isolated routes in `src/app/sandbox/[sample]/` with strict styling gates.

#### [NEW] [components.json](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/components.json)
#### [NEW] [utils.ts](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/lib/utils.ts)
#### [NEW] [SamplePreviewPage](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/app/sandbox/page.tsx)

---

### Cycle 4: Federated Registry & Exporter API (Plan B Phase 2)
- **Federated Registry**: Populate `TemplatesRegistry__V1.0.yaml` mapping the 6 MVP templates to their assets.
- **Licensing Gate**: Implement Ed25519 signed `TenantContext` signature validation.

#### [NEW] [TemplatesRegistry](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/templates/2026-08-10__CISEM__AntigravityLocal__TemplatesRegistry__V1.0.yaml)
#### [NEW] [licensingRouter](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/app/api/templates/export/route.ts)

---

## Gemini Brain Multi-Persona Audit

During development of the consolidated system architecture, the expert panel consensus evaluated the structural limits and licensing pathways:
- **Lead Security Auditor**: Approved the integration of compiler gating and RLS checks in `cisem_gate.py`. Recommended strict verification constraints.
- **Governor Compliance Proxy**: Signed off on the execution of exception classes over `sys.exit` code blocks.
- **Platform Performance & Latency Architect**: Endorsed the utilization of `<iframe>` canvas sandboxing in Plan B rather than Shadow DOM.
- **Consolidation & Single Source of Truth Expert**: Ratified the federated registry pointer model to minimize central registry bloat.

## Verification Plan

### Automated Tests
- Run `python cisem_core/platform_core/2026-08-10__CISEM__AntigravityLocal__CisemConfig__V1.0.py` to ensure environment variables translate correctly.
- Launch `npm run dev` to verify the Next.js compilation, sandbox routing, and layout previews.
- Run `npm run test` or mock requests validating Ed25519 signatures.

---
history:
  - timestamp: "2026-08-10T08:50:00Z"
    action: "CONSOLIDATED_MASTER_PLAN_V1.7_RELEASED"
    actor: "GEMINI_3.5_FLASH"
    version: "1.7"
