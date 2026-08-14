# Implementation Plan: Template Synchronization Engine (TSE)
# Zero-Downtime, Timezone-Aware, Compiler-Enforced Template Propagation

**Plan ID**: `CISEM-IP-20260811-TEMPLATE-SYNC-ENGINE`
**Date**: 2026-08-11
**Governor Signature Required**: `GOV-YARIV-*` before execution
**Status**: `DRAFT — PENDING GOVERNOR RATIFICATION`

---

## 1.0 Why This Matters

> [!IMPORTANT]
> **The current state**: Templates exist in `templates_registry.json`. Client pages pin to `template_version_locked`. But if a template is updated today, the instantiated pages are **not notified, not validated, and not protected** from receiving a breaking change.
>
> This plan closes that gap with a battle-tested, three-layer enterprise solution: **Semantic Version Contracts → Breaking Change Detection Gate → Scheduled 02:00 AM Tenant-Local Propagation**.

---

## 2.0 Research Summary — What the Industry Does

### 2.1 Battle-Tested Pattern: Semantic Version Locking + Consumer-Driven Contracts

The most reliable pattern used by Shopify, Contentful, Salesforce DXP, and Stripe is:

> **"Never push. Let consumers pull when they're ready. Block any build that introduces a breaking change without a MAJOR version bump."**

This maps to three rules in our system:
- `PATCH` bump (CSS fix, copy change) → can auto-propagate silently
- `MINOR` bump (new optional block added) → requires client notification, opt-in
- `MAJOR` bump (block removed, field renamed) → **BLOCKED from propagation** until Governor writes a `migration_contract.json`

### 2.2 Battle-Tested Pattern: IANA Timezone Scheduling (Tenant Rings)

Used by AWS Maintenance Windows, Kubernetes CronJobs (v1.27+), and Vercel deployment rings:

> **"Never hardcode UTC offsets. Group tenants by IANA timezone into deployment rings. Execute each ring at their local 02:00 AM in UTC."**

### 2.3 What To Avoid

| Anti-Pattern | Consequence |
| :--- | :--- |
| Big-bang template push | One bad change breaks all clients simultaneously |
| UTC-only scheduling | DST transitions cause double-execution or skipped windows |
| Silent auto-merge of MAJOR changes | Client pages break with no warning |
| No rollback mechanism | Stuck in broken state until manual fix |

---

## 3.0 Architecture — Three-Layer TSE

```
┌─────────────────────────────────────────────┐
│  Layer 1: Template Change Classification    │
│  (SemVer diff engine — PATCH / MINOR / MAJOR)│
└────────────────────┬────────────────────────┘
                     │ MAJOR → BLOCKED (needs Governor migration contract)
                     │ MINOR → queued for opt-in propagation
                     │ PATCH → queued for silent scheduled propagation
┌────────────────────▼────────────────────────┐
│  Layer 2: Propagation Queue                 │
│  (template_sync_queue.json — per tenant)    │
│  Each entry: { page_id, new_version,        │
│    change_type, scheduled_utc, tz,          │
│    status: "pending" }                      │
└────────────────────┬────────────────────────┘
                     │ At UTC equivalent of 02:00 AM per tenant timezone
┌────────────────────▼────────────────────────┐
│  Layer 3: Propagation Executor              │
│  (POST /api/templates/propagate)            │
│  Reads queue, applies updates ring by ring, │
│  validates compatibility, writes sync_receipt│
└─────────────────────────────────────────────┘
```

---

## 4.0 Proposed Changes

### 4.1 Configuration Plane

#### [MODIFY] `templates_registry.json`
- Add `semver` to each template (e.g., `"1.2.3"`)
- Add `change_log` array per template
- Add `compatibility_contract` block listing `required_blocks` and `optional_blocks`
- Per instantiated page: add `update_policy: { channel: "patch_only" | "minor_and_patch" | "manual_only", timezone: "Asia/Jerusalem", scheduled_window: "02:00" }`

#### [NEW] `cisem_core/template_sync_queue.json`
- Runtime queue file: list of pending propagation jobs
- Fields: `page_id`, `template_id`, `from_version`, `to_version`, `change_type`, `scheduled_utc`, `tenant_timezone`, `status: pending|executing|done|rolled_back`

#### [NEW] `cisem_core/template_migration_contracts/` (directory)
- Governor-ratified JSON migration contract files for MAJOR version changes
- Naming: `<template_id>__<from_version>__<to_version>__migration_contract.json`
- Required before Phase 22 (see gate below) allows MAJOR propagation

### 4.2 API Layer

#### [NEW] `src/app/api/templates/propagate/route.ts`
- POST: triggered by the propagation scheduler
- Reads `template_sync_queue.json`, processes all entries where `scheduled_utc <= now`
- For each: validates `change_type` (PATCH can run, MAJOR needs migration contract)
- Applies version bump to `instantiated_pages[n].template_version_locked`
- Writes `sync_receipt` with timestamp
- On failure: sets `status: rolled_back`, writes error to `cisem_core/logs/propagation_errors.log`

#### [NEW] `src/app/api/templates/queue/route.ts`
- POST: enqueues a template version update for a set of pages
- Validates that a MAJOR bump has a migration contract before enqueuing
- Calculates UTC equivalent of `02:00 AM` in each page's `tenant_timezone`
- Response: `{ queued: N, scheduled_utc: [...] }`

#### [NEW] `src/app/api/templates/diff/route.ts`
- POST: takes `{ template_id, from_version, to_version }`
- Returns diff classification: `PATCH | MINOR | MAJOR` and a list of `breaking_changes[]`
- The TemplateHubView calls this before showing the Duplicate button for template updates

### 4.3 Frontend View

#### [MODIFY] `TemplateHubView.tsx`
- Add **Sync Status** column to Instantiated Pages tab:
  - `🟢 Up to date` / `🟡 Update queued (02:00 AM)` / `🔴 MAJOR — Governor ratification required` / `⚡ Patch available`
- Add **Propagate Updates** button (operator_admin only) that calls `/api/templates/queue`
- Show breaking change diff panel before confirming a propagation

### 4.4 Propagation Scheduler

#### [NEW] `cisem_core/platform_core/template_propagation_scheduler.py`

```python
# Runs every 15 minutes (via OS Task Scheduler or PM2 cron)
# Calls POST /api/templates/propagate
# Passes entries from queue where scheduled_utc <= datetime.utcnow()
```

- Uses `pytz` / `zoneinfo` for IANA-aware UTC calculations
- Idempotent: uses `propagation_lock_<page_id>.json` file to prevent double-execution during DST transitions
- Logs execution to `cisem_core/logs/propagation_runs.log`

### 4.5 Compiler Gate

#### [MODIFY] `cisem_gate.py` — Phase 22: Template Version Contract Integrity

```python
# Phase 22: Scans template_sync_queue.json for any MAJOR-type
# queued jobs that lack a migration contract file.
# Blocks build if a MAJOR propagation is pending without ratification.
```

---

## 5.0 Compatibility Classification Rules

| What changed | Classification | Auto-propagate? |
| :--- | :--- | :--- |
| CSS variable value, copy text | `PATCH` | ✅ Yes — at 02:00 AM local |
| New optional component block added | `MINOR` | ⚠️ Opt-in — notification sent |
| Required block removed | `MAJOR` | ❌ No — Governor migration contract required |
| Block renamed | `MAJOR` | ❌ No — Governor migration contract required |
| Layout direction changed | `MAJOR` | ❌ No |
| New required prop added to existing block | `MAJOR` | ❌ No |
| New optional prop (with default) | `MINOR` | ⚠️ Opt-in |

---

## 6.0 Mechanical Enforcement Question (Model Build Blocking)

> [!IMPORTANT]
> **Current state of model build enforcement**: The gate (Phase 3) checks `ratified_plan` + `governor_signature: GOV-YARIV-*` in every Python file's CISEM header. **This mechanically blocks any other model from building Python scripts** if they haven't forged the Governor signature.
>
> **However**: The gate does NOT yet check `.tsx` / `.jsx` / `.ts` files for CISEM headers. A non-governor-ratified model can still create frontend components without a header check.
>
> **Recommendation for Phase 22.5**: Extend the CISEM header requirement to all **new** `.tsx`/`.ts` files in `src/components/views/` and `src/app/api/`. This closes the gap and enforces that no other model can create a view or API route without a ratified plan ID and Governor signature in the file header.

---

## 7.0 Core Council File Protocol

The Governor has mandated that every expert AI model or reviewer providing feedback on a plan must submit their review as a **standalone file** following this convention:

```
[Date]__[ModelName]__[PlanTopic]__CoreCouncilReview__[Version].md
```

Example:
```
2026-08-11__Antigravity__TemplateSyncEngine__CoreCouncilReview__V1.0.md
```

- Each file must include: model identity, plan references, expert verdict, gaps found, and mitigations recommended.
- No inline edits to the original plan file.
- Governor collects all council files before ratification.

---

## 8.0 Open Questions for Governor

**8.1** Should MINOR updates (new optional blocks) be auto-propagated like PATCHes, or always require explicit opt-in?
- *Recommendation*: Opt-in for first 90 days, then auto-promote MINOR to auto-propagate once the system is stable.

**8.2** What is the tenant timezone source? Currently there is no per-client timezone stored.
- *Recommendation*: Add `timezone: "Asia/Jerusalem"` field to `instantiated_pages` records. Default to `"Asia/Jerusalem"` (Governor's local). Clients with known timezones override.

**8.3** Should the propagation scheduler be a Next.js API cron (Vercel Cron Jobs) or a standalone Python daemon?
- *Recommendation*: Python daemon (`template_propagation_scheduler.py`) running on the same machine as the dev server for now. Vercel Cron when moving to production.

**8.4** Should MAJOR migration contracts require a secondary AI review before Governor ratification?
- *Recommendation*: Yes — make it mandatory that a Core Council review file exists for MAJOR migrations.

---

## 9.0 Verification Plan

### 9.1 Automated Tests
```bash
npx tsc --noEmit        # 0 type errors
npm run build           # All 22 gate phases pass
```

### 9.2 Manual Verification
1. Trigger a PATCH update on a template → verify it gets queued at 02:00 AM UTC for tenant.
2. Trigger a MAJOR update without a migration contract → verify Phase 22 gate blocks the build.
3. Toggle to a `buyer` role → verify propagation controls are hidden.
4. Simulate a DST edge case: set `scheduled_utc` to a DST transition hour → verify idempotency lock prevents double-execution.

---
