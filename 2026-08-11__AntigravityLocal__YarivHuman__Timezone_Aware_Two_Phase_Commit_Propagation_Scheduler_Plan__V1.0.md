---
plan_id: CISEM-IP-20260811-TEMPLATE-SYNC-ENGINE
blast_radius: HIGH
axioms_linked:
- AX-10000
- PR-11100
- PR-11200
- PR-11300
- PR-11400
- PR-11500
- AX-40000
- AX-50000
- AX-55000
- PR-58900
artifact_status: DRAFT
pre_review_status: PASSED
governor_signature: GOV-YARIV-20260811-TEMPLATE-SYNC-ENGINE-V1.0
date: '2026-08-11'
version: '1.2'
pre_reviewed_at: '2026-08-11T08:26:15.277862Z'
---

# Timezone-Aware Two-Phase Commit Propagation Scheduler

This plan describes the architectural consolidation of the template propagation scheduler daemon (`template_propagation_scheduler.py`). It migrates the Two-Phase Commit (2PC) logic directly into Python to eliminate HTTP-level timeout risks, while addressing crash recovery, file locking backoffs, schema compatibility verification, multi-tenant session verification, and atomic file replacements.

---

## User Review Required

> [!IMPORTANT]
> **Consolidated Hardening Recommendations**: This plan integrates all structural recommendations from the expert panel:
> 1. **Startup Recovery Hook**: Automatically detects stale `.lock` files (> 300 seconds) and rolls back unresolved `.tmp` mutations on daemon initialization.
> 2. **Atomic Writes**: Mandates writing to `templates_registry.json.new` followed by `fsync` and `os.replace` to prevent registry corruption.
> 3. **Validation Metrics**: Outputs structured `validation_metrics` (Flow, Code, Optimization, Salad, Security) for the sync engine.
> 4. **Schema Diff Gating**: Integrates schema check to block MAJOR breaking changes unless accompanied by a governor ratification file.

---

## Open Questions

- **Lock Wait Window**: Is a maximum wait window of 15 seconds (5 retry attempts at 2x exponential backoff starting at 500ms) acceptable under concurrent scheduling loads?
- **Next.js Endpoint Deprecation**: Should `/api/templates/propagate` return status `410 Gone` once the daemon is ratified, or should it log deprecation warnings while forwarding requests to the background runner?

---

## Proposed Changes

### Propagation Daemon & API hardiness

#### [MODIFY] [template_propagation_scheduler.py](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/platform_core/template_propagation_scheduler.py)
- **Wiring**: Integrates with the platform logging framework (`propagation_runs.log`), `templates_registry.json`, and lock structures.
- **Triggering**: Triggered as a persistent background daemon via `--daemon` mode, or manually via single-cycle execution.
- **Availability**: Available globally in the `cisem_core/platform_core/` control plane.
- **User Journey**: Validates tenant local scheduling times and executes updates at local 02:00 AM. In case of midway crashes, automatically recovers on next startup, ensuring the administrative user journey is never stuck due to corrupted states.

#### [MODIFY] [route.ts](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/app/api/templates/propagate/route.ts)
- **Wiring**: Direct API caller to template propagation endpoint.
- **Triggering**: Triggered by external client requests or developer integration tests.
- **Availability**: Available at route `/api/templates/propagate`.
- **User Journey**: Returns a standard redirection or deprecation message pointing users to the background scheduling engine, protecting the web worker's request/response cycle.

---

## CoreSpiral Methodology & CoreCycle Definitions

### CoreCycle 1: Lock Acquisition & Crash Recovery
- Run lock recovery scan on startup: resolve stale `template_sync_queue.lock` files and verify no orphan staging templates remain.
- Acquire registry lock using exponential backoff retry budget (5 retries, starting at 500ms).

### CoreCycle 2: Ingestion & Transaction Verification
- Verify multi-tenant cryptographic signature (`TenantContext`) for each queue job.
- Verify template compatibility: run structural validation check on `to_version` and block MAJOR diff types unless signed off by a governor ratification file.

### CoreCycle 3: Atomic Commit & Telemetry Receipt
- Execute Commit Phase: write modifications to `templates_registry.json.new` -> `fsync()` -> atomic `os.replace()`.
- Stamp transaction with receipt ID `SYN-YYYYMMDDHHMMSS` and structured `validation_metrics` block.

---

## Gemini Brain Multi-Persona Audit

### Persona Review Summary & Mitigation Matrix

20.1. **Security Officer (Verdict: PASS)**
- *Gap identified*: Potential cross-tenant data leakage if parameters are modified in transition.
- *Mitigation*: Validate signed `TenantContext` cryptographically at the transaction boundary.

20.2. **Database Administrator (Verdict: PASS)**
- *Gap identified*: Direct registry writes risk corruption on system shutdown or disk exhaustion.
- *Mitigation*: Strict two-stage write protocol (`.new` write, `fsync`, and atomic `os.replace`).

20.3. **Site Reliability Engineer (Verdict: PASS)**
- *Gap identified*: Mid-process crash leaves locking resources orphaned.
- *Mitigation*: Startup scan clears locks older than 300s and automatically rolls back uncommitted stages.

20.4. **QA Automation Architect (Verdict: PASS)**
- *Gap identified*: Test plan lack edge-case and concurrent stress testing.
- *Mitigation*: Implement mid-commit kill simulations and lock-collision validation tests.

20.5. **Compliance Inspector (Verdict: PASS)**
- *Gap identified*: Compliance status must expose modular audit levels.
- *Mitigation*: Output structured validation metrics mapping Flow, Code, Optimization, Salad, and Security checks.

---

## Verification Plan

### Automated Tests
- Validate plan and code consistency:
  ```bash
  python cisem_core/platform_core/cisem_gate.py
  ```
- Run integration verification suite:
  ```bash
  python cisem_core/platform_core/template_propagation_scheduler.py --test-concurrency
  ```

### Manual Verification
- Simulate a mid-commit shutdown: terminate the scheduler process during staging and verify that startup recovery successfully performs rollback.
- Enqueue major schema update without governor signature file and verify rejection.
