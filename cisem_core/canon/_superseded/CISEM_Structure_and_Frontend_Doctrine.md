# CISEM Structure & Frontend Doctrine

**Status:** Draft for GOVERNOR ratification
**Companion to:** `CISEM_Session_Review_and_Gap_Closure_Plan.md` (the repair) and `CISEM_Operating_Playbook.md` (the steady state)
**Covers:** code boundaries, dependency direction, frontend rules, and the durability mapping for the UX/UI DNA

---

## 0. Confidence marking

Everything in Part A about the *current* structure is confirmed from files inspected during this session. Everything about the *target* structure is a **proposal**, not an observation — I have not seen the full tree. Where a claim is inferred rather than confirmed, it is marked.

The UX/UI DNA (D1–D8, L1–L3, ux-standards #27–31, PLAN GATE 0.8) is **not restated here**. `governance/ux-ui-dna.md` remains its SSOT. Part C maps it onto the durability ladder and specifies what would make it permanent.

---

# PART A — Code structure doctrine

## A1. The problem today

`src/components/views/` currently holds, in one flat directory:

| File | Actually belongs to |
|---|---|
| `TemplateHubView.tsx` | Platform core |
| `WhitelabelView.tsx` | Platform core (entitlement) |
| `AdminView.tsx` | Operator plane |
| `SystemSchemaView.tsx` | Operator plane |
| `B2bHubView.tsx` | Vertical (gifting/B2B) |
| `KanbanView.jsx` · `GanttView.jsx` · `CalendarView.jsx` · `ListView.jsx` | Generic PM — maps to no backend at all |
| `CollaborationHub.jsx` · `DashboardView.jsx` · `HomeView.tsx` | Mixed |

**Consequence:** the lane classification in the Playbook (§2) requires opening each file to determine which lane a change falls in. A boundary that must be re-derived per change is not a boundary.

The same flatness exists in `src/stores/` — `useTaskStore` (generic PM), `useAdminStore` (vertical CRM), and `useUIStore` (platform shell) sit side by side with nothing distinguishing their blast radius.

## A2. The four zones

| Zone | Contains | May import from |
|---|---|---|
| **Z0 — Governance** | `cisem_core/` — gate, registries, build scripts, E3/E4 security tooling | nothing in `src/` or `backend/` |
| **Z1 — Platform core** | Identity, tenancy, entitlement, templates, design system, shared primitives | Z1 only |
| **Z2 — Vertical** | Catalog, proposals, briefs, branding, supplier data — the gifting product | Z1, Z2 |
| **Z3 — Surface** | Routes, pages, layout composition | Z1, Z2, Z3 |

**The dependency rule, stated once:** imports flow **downward only**. Z3 → Z2 → Z1. Never upward. Z0 stands alone and is never imported by application code.

**Why this specific rule:** if Z1 imports from Z2, the platform core cannot be reused for a second vertical without dragging the gifting product with it. That is the concrete, testable form of "separate the specific projects from the platform core."

## A3. Proposed layout

```
src/
  platform/          Z1
    identity/        session, claim access, role helpers
    tenancy/         tenant context provider, scoping
    entitlement/     packages, feature gates
    templates/       template hub, duplication
    ui/              design system primitives
    data/            the single data-access layer (see B4)
  verticals/
    gifting/         Z2
      catalog/
      proposals/
      branding/
      suppliers/
  app/               Z3 — Next.js routes, thin composition only
  operator/          operator-plane surfaces (AdminView, SystemSchemaView)
```

**Not proposed:** moving `cisem_core/` or `backend/`. Their boundaries are already clear.

**Open:** the generic PM views (Kanban/Gantt/Calendar/List) have no zone because they have no backend. They are the orphan identified in the Gap Closure Plan §7.3, and Q1 there decides their fate. Until that decision, they stay where they are — do not migrate code you may delete.

## A4. Migration — PCR

**Option A — Big-bang restructure.**
*Pros:* one disruption, clean afterwards. *Cons:* touches every import in the codebase while auth and RLS work is mid-flight; a large diff that no gate currently checks. **Reject for now.**

**Option B — Boundary-first, move later.**
Declare zones as a manifest file now. Build the import linter (A5) to enforce direction. Move files opportunistically as they are touched for other reasons.
*Pros:* zero disruption, enforcement starts immediately, the tree converges over months. *Cons:* the tree stays messy for a while; the manifest and reality can drift. **Recommended.**

**Option C — Move only what Phase 1 touches.**
Restructure alongside the table classification work.
*Pros:* one pass over both. *Cons:* couples a code refactor to a security migration — exactly the cross-lane change the Playbook §2 forbids. **Reject.**

**Recommendation: B.** The manifest is the boundary; the directory layout catches up.

## A5. E14 — Import direction linter *(new mechanism)*

The T3 mechanism that makes zones real rather than aspirational.

**What it does:** reads a `zones.json` manifest mapping paths to zones, scans every import statement, and exits non-zero on any upward import.

**Runs:** in the gate, and in CI once E10 lands.

**Why it matters:** without it, A2 is a paragraph. With it, an upward import fails the build, and the boundary holds whether or not anyone remembers it. Same logic as E4 for policies.

## A6. Naming

Two conventions coexist and should not be confused:

| Kind | Convention | Example |
|---|---|---|
| **Artifacts** — plans, reviews, migrations, reports | `[Date]__[From]__[To]__[Description]__[Version].[ext]` | `2026-08-12__CisemCsAg__Database__RLSTenantIsolationMigration__V1.0.sql` |
| **Code** — components, modules, stores | Standard language convention | `TemplateHubView.tsx`, `useTaskStore.js` |

**Flag:** `src/lib/2026-08-11__AntigravityLocal__YarivHuman__MedusaClientAdapter__V1.0.ts` applies the artifact convention to a code module. This produces unreadable import statements, breaks on any refactor, and encodes a version in a path that git already versions. **Recommend renaming to `medusaClient.ts`** and keeping the provenance in a header comment. The artifact convention is correct for documents and migrations; it is wrong for importable code.

## A7. Corespine placement

Every module carries a header declaring its position — the machine-readable form of "nothing floats":

```
Zone:      Z1 / platform / identity
Depends:   platform/data
Serves:    verticals/gifting/catalog, app/dashboard
Purpose:   one sentence
```

E14 reads `Zone` and `Depends` and verifies the declaration matches the actual imports. A module whose declared dependencies do not match its real ones fails the gate — which catches drift between intent and code without anyone reading the file.

---

# PART B — Frontend doctrine

## B1. State doctrine

**Today:** `useTaskStore`, `useCollabStore`, `useAdminStore`, `useUIStore` all persist to `localStorage`, carry no tenant field, and never reach the server. Clearing a browser deletes the workspace.

**Target:** the server is the source of truth; client state is a cache.

| State kind | Where it lives | Example |
|---|---|---|
| **Tenant data** | Server, tenant-scoped by RLS | tasks, catalog items, proposals, contacts |
| **Session** | Supabase client session | the JWT and its claims |
| **UI preference** | `localStorage`, per-device, never authoritative | sidebar collapsed, language, table density |
| **Ephemeral** | React state | open modals, form drafts, selection |

**Rule:** anything a user would expect to survive a device change is server state. Anything in `localStorage` must be safe to lose.

## B2. The claim

1. The frontend obtains the session from Supabase Auth and lets the SDK handle refresh. It does not hand-roll token storage.
2. The frontend may **read** `app_metadata.tenant_id` for display — showing which organisation you are in.
3. The frontend **never** makes an authorization decision from a decoded claim. Authorization is RLS plus the server. A client-side check is a UX affordance, never a control.
4. When the active tenant changes, the session is re-minted server-side and the client refreshes. The client never constructs or modifies a claim.

## B3. Never-do list

| # | Rule | Why — from this codebase |
|---|---|---|
| N1 | Never gate a feature on a client-side tier check alone | `WhitelabelView.tsx` has a tier selector that toggles enterprise features in local state. The backend gate exists (`403 ENTERPRISE_TIER_REQUIRED`), but the UI can enable the surface without it. |
| N2 | Never ship a secret key to the browser | Publishable key only. The secret key belongs to the server and to the launcher scripts. |
| N3 | Never treat `simulatedRole` / `activeUserId` as authorization | `useUIStore` defaults to `'user-operator'` / `'operator_admin'` from `localStorage`. These are dev-mode display conveniences and must never reach a permission decision. |
| N4 | **Never substitute mock data for real data on a tenant-facing surface** | `TemplateHubView` falls back to `MOCK_REGISTRY`; the `/api/v1` proxy falls back to `getMockData()`. A tenant seeing fabricated data believing it is theirs is worse than an error. Show a degraded state or fail visibly. |
| N5 | Never fetch tenant data outside the data layer | Scattered `fetch()` calls make tenant scoping unauditable. See B4. |

**N4 is the frontend twin of the backend fail-open fix** (Gap Plan A4). Same principle in both layers: **fail visibly, never plausibly.** It is also the same failure class as the fabricated `psql` output — a convincing artifact standing in for a real one.

## B4. Single data-access layer

All tenant data flows through `platform/data/`. Components do not call `fetch` directly.

**What this buys:**
- Tenant scoping is enforced in one auditable place
- The mock/real boundary (N4) is one switch, not scattered fallbacks
- Loading and error states are consistent, which D8 (did my click register) depends on
- E9-style scans have one file to check rather than every component

## B5. Degraded states are designed, not accidental

Every surface has three states, and all three are designed: **loading**, **empty**, **error**. Today the fallback behaviour is to invent data, which is none of the three.

This ties directly to the DNA: a surface that silently shows mock data fails **D6** (what happens next) and **D8** (did my click register), because the user cannot distinguish success from failure.

---

# PART C — UX/UI DNA on the durability ladder

## C1. Current tier

| Mechanism | Tier | Note |
|---|---|---|
| `governance/ux-ui-dna.md` — D1–D8, L1–L3 | **T1** | Written standard. Will degrade under context pressure, like every other T1 rule tested this session. |
| PLAN GATE 0.8 — per-surface D1–D8 declaration in every UI plan | **T1** | A promise made in a plan. Nothing verifies the shipped surface matches the promise. |
| ux-standards #27–31, read live by the ux-gate agent | **T2 or T3** | Depends entirely on whether the ux-gate **blocks** or **advises**. If advisory, it is T1 with extra steps. **This needs confirming.** |
| `page_audit dna_check` | **not shipped** | Marked OI-80 — an honest gap, correctly labelled. **This is the T3 mechanism.** |

**Your own status line is right:** `STATUS ON-TRIAL (AX-8): SEALED after n>=2 real redesigns pass the gate + Yariv ratifies.` That is the same standard as E5 — the rule is not real until something mechanical proves it. Hold to it.

## C2. What `dna_check` can and cannot assert

Not all eight questions are mechanically checkable. Pretending otherwise produces a green check that means nothing — the `seed_db.py exit 0` failure in UI form.

**Mechanically checkable (T3 — automate these):**

| | Check | Assertion |
|---|---|---|
| D1 | where am I | Page title and breadcrumb/location indicator present and non-empty |
| D4 | what stage | A stage or progress indicator exists on any multi-step surface |
| D5 | recommended option marked | Where ≥2 options are offered, exactly one carries the recommended marker and a rationale string |
| D6 | what happens next | Every primary action declares its next state |
| D8 | did my click register | Every interactive element has a defined pending/active state; no action without feedback |
| L1 | no distortion | Every image renders at its native aspect ratio |
| L2 | no unmotivated duplication | No two components on one surface render the same data source |

**Judgment-dependent (T1/T2 — these need a reviewer, human or agent):**

| | Check | Why it resists automation |
|---|---|---|
| D2 | what's in it for me | Requires understanding user value, not structure |
| D3 | which pipeline | Requires knowing the corespine — partially checkable if the corespine header (A7) is machine-readable |
| D7 | on completion, next options + recommendation | Structurally checkable; the *quality* of the recommendation is not |
| L3 | order by current-need, not stats | Requires knowing what the current need is |

**Recommendation:** ship `dna_check` covering only the seven mechanical assertions, and be explicit in its output that it verifies **structure, not judgment**. A `dna_check` claiming to verify D2 would be a fabricated verification — the exact pattern this whole session was spent eliminating.

## C3. Sealing AX-8

Your criterion stands. The addition is that "pass the gate" must mean the mechanical gate, not a plan declaration:

- [ ] `dna_check` ships covering the seven mechanical assertions
- [ ] ux-gate confirmed **blocking**, not advisory (C1 open item)
- [ ] Two real redesigns pass mechanically, with the judgment items reviewed separately and recorded
- [ ] GOVERNOR ratifies

**Until then the DNA is T1 and should be expected to drift** — not as a criticism of the standard, which is well-specified, but because that is what T1 does.

---

# PART D — Consolidated open questions

| # | Question | Blocks |
|---|---|---|
| S1 | Ratify the four zones and the downward-only dependency rule? | E14, all lane classification |
| S2 | Migration Option B (manifest now, move later) approved? | A3, A4 |
| S3 | Rename the date-stamped `.ts` code file to a normal module name? | A6 |
| S4 | Is the ux-gate agent **blocking** or **advisory** today? | C1 — determines whether the DNA is T2 or T1 |
| S5 | Ship `dna_check` with seven mechanical assertions only, explicitly excluding judgment items? | C2, AX-8 sealing |
| S6 | Generic PM views — build persistence or retire? (= Gap Plan Q1) | A3, B1, and the whole product direction |

---

# PART E — Where the three artifacts now stand

| Coverage area | Artifact | Section |
|---|---|---|
| Backend / database | Playbook | §5, §4, §6 |
| Agent behaviour | Playbook | §7, §9 |
| Process structure | Playbook | §2, §3, §8 |
| **Code structure** | **This document** | **Part A** |
| **Frontend** | **This document** | **Part B, Part C** |
| Repair sequence | Gap Closure Plan | §9 |

**New mechanism added by this document:** E14 (import direction linter). It joins E1–E13 in the Playbook §9.2 durability table at target tier T3.
