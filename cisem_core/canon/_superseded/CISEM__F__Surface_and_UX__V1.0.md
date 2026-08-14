# CISEM Canon — F · Surface & UX

**Address:** `F` · **Depends on:** A, B, C, D, E · **Serves:** —
**Addressing scheme:** `A.0`
**Status:** Draft for GOVERNOR ratification

> **SSOT notice:** `governance/ux-ui-dna.md` remains the single source of truth for D1–D8 and L1–L3. This spine **references** it and records its durability tier. It does not restate it. One source of truth means one.

---

## F.0 — Charter

### F.0.1 — Purpose
`RATIFIED-PENDING` · Everything the user sees and touches: components, state, data access from the client, and the UX/UI DNA that governs whether a surface is acceptable.

**Plain:** This spine is the part customers actually experience. It depends on every other spine and is depended on by none — which means it can move fastest, and also that its mistakes are the most visible.

---

## F.1 — State

### F.1.01 — Views are flat and unzoned
`CONFIRMED` · `src/components/views/` mixes, in one directory: `TemplateHubView` and `WhitelabelView` (platform), `AdminView` and `SystemSchemaView` (operator), `B2bHubView` (vertical), `KanbanView`/`GanttView`/`CalendarView`/`ListView` (generic PM, unzoned), plus `CollaborationHub`, `DashboardView`, `HomeView` (mixed).

**Consequence:** lane classification (`G.2.01`) requires opening each file. A boundary that must be re-derived per change is not a boundary.

### F.1.02 — Stores are flat and unscoped
`CONFIRMED` · `useUIStore` (platform shell), `useTaskStore` (generic PM), `useAdminStore` (vertical CRM), `useCollabStore`, `useNotificationStore` — side by side, nothing distinguishing blast radius.

### F.1.03 — No server persistence for the product surfaces
`CONFIRMED` · Every store persists to `localStorage`: `dima-tasks`, `dima-collab`, `dima-admin`, `dima-lang`, `dima-active-user`, `dima-simulated-role`. **No tenant field on any record.** Clearing a browser deletes the workspace.

### F.1.04 — Wired vs. mock inventory
`CONFIRMED`

| Surface | State |
|---|---|
| TemplateHub | wired — `POST /api/templates/duplicate` writes to disk |
| WhatsApp notifications | wired — Green API |
| Kanban / Gantt / Calendar / List | client-only, `localStorage` |
| B2bHub | static mock |
| Whitelabel | UI-only mock with a **client-side tier toggle** |
| Dashboard (Home) | wired — `/api/dashboard` reads operator files |

### F.1.05 — UX/UI DNA status
`CONFIRMED` · `STATUS ON-TRIAL (AX-8)`. `page_audit dna_check` marked **OI-80 — honest gap until it ships.** Sealing requires n≥2 real redesigns passing the gate plus GOVERNOR ratification.

---

## F.2 — Decision

### F.2.01 — Server is truth; client state is a cache
`PROPOSED`

**Plain:** Anything a user would expect to still be there on a different device belongs on the server. Anything in browser storage must be safe to lose entirely.

**Structured:**

| Kind | Location | Example |
|---|---|---|
| Tenant data | Server, RLS-scoped | tasks, catalog items, proposals, contacts |
| Session | Supabase client session | the JWT and its claims |
| UI preference | `localStorage`, per-device, never authoritative | sidebar collapsed, language, density |
| Ephemeral | React state | modals, form drafts, selection |

### F.2.02 — Claim handling
`PROPOSED`
1. Session from the Supabase SDK; no hand-rolled token storage
2. The client may **read** `app_metadata.tenant_id` for display
3. The client **never** makes an authorization decision from a decoded claim — a client-side check is a UX affordance, never a control
4. Tenant switching re-mints server-side; the client never constructs or modifies a claim

### F.2.03 — Single data-access layer
`PROPOSED` · All tenant data flows through `platform/data/`. Components do not call `fetch` directly.

**Buys:** tenant scoping enforced in one auditable place · the mock/real boundary is one switch not scattered fallbacks · consistent loading and error states, which D8 depends on · one file for `A.4.09` to scan.

### F.2.04 — Three designed states per surface
`PROPOSED` · **Loading, empty, error** — all three designed. Today the fallback behaviour is to invent data, which is none of the three.

### F.2.05 — Zone layout
`PROPOSED` · Per `A.2.01`:
```
src/platform/{identity,tenancy,entitlement,templates,ui,data}
src/verticals/gifting/{catalog,proposals,branding,suppliers}
src/app/            thin route composition only
src/operator/       AdminView, SystemSchemaView
```
**Migration Option B** (`A.5.01`): declare the manifest now, move files opportunistically. Do not migrate code that may be deleted (`F.5.10`).

---

## F.3 — Finding

### Structural

| ID | Finding | Status |
|---|---|---|
| `F.3.01` | Kanban, Gantt, Calendar, List, tasks, collab, clients have **zero server persistence and no tenant field** | `OPEN` → `F.5.10` |
| `F.3.02` | Views and stores are flat and unzoned (`F.1.01`, `F.1.02`) | `OPEN` → `F.2.05` |
| `F.3.03` | The generic PM surface maps to **no database tables at all** — an orphan, not a migration candidate | `OPEN` → `F.5.10` |

### Never-do violations, live in the codebase

| ID | Rule | Current violation |
|---|---|---|
| `F.3.10` | **N1** — never gate a feature on a client-side tier check alone | `WhitelabelView.tsx` has a tier selector toggling enterprise features in local state. The backend gate exists; the UI can enable the surface without it. |
| `F.3.11` | **N2** — never ship a secret key to the browser | ✅ no violation found; publishable key only |
| `F.3.12` | **N3** — never treat `simulatedRole` / `activeUserId` as authorization | `useUIStore` defaults to `'user-operator'` / `'operator_admin'` from `localStorage`. Dev-mode display only; must never reach a permission decision. |
| `F.3.13` | **N4** — **never substitute mock data for real data on a tenant-facing surface** | `TemplateHubView` falls back to `MOCK_REGISTRY`. Twin of `C.3.07`. |
| `F.3.14` | **N5** — never fetch tenant data outside the data layer | Scattered `fetch()` calls across views make tenant scoping unauditable |

**`F.3.13` principle:** *fail visibly, never plausibly.* A tenant seeing fabricated data believing it is theirs is worse than an error. Same failure class as `A.3.30` — a convincing artifact standing in for a real one. Also fails DNA **D6** and **D8**: the user cannot distinguish success from failure.

---

## F.4 — Mechanism — UX/UI DNA on the durability ladder

### F.4.01 — Current tiers
| Mechanism | Tier | Note |
|---|---|---|
| `governance/ux-ui-dna.md` — D1–D8, L1–L3 | **T1** | Written standard; will degrade like every T1 rule tested this session |
| PLAN GATE 0.8 — per-surface D1–D8 declaration | **T1** | A promise in a plan; nothing verifies the shipped surface |
| ux-standards #27–31, read live by the ux-gate agent | **T2 or T3** | **Depends entirely on whether the ux-gate blocks or advises.** If advisory, it is T1 with extra steps. `OPEN: F.5.20` |
| `page_audit dna_check` | not shipped | OI-80, correctly labelled. **This is the T3 mechanism.** |

### F.4.02 — Mechanically checkable (automate — T3)
| | Assertion |
|---|---|
| D1 | Page title and location indicator present and non-empty |
| D4 | A stage/progress indicator exists on any multi-step surface |
| D5 | Where ≥2 options are offered, exactly one carries the recommended marker **and** a rationale string |
| D6 | Every primary action declares its next state |
| D8 | Every interactive element has a defined pending/active state; no action without feedback |
| L1 | Every image renders at native aspect ratio |
| L2 | No two components on one surface render the same data source |

### F.4.03 — Judgment-dependent (needs a reviewer — T1/T2)
| | Why it resists automation |
|---|---|
| D2 | Requires understanding user value, not structure |
| D3 | Requires knowing the corespine — partially checkable if `A.2.03` headers are machine-readable |
| D7 | Structurally checkable; the *quality* of the recommendation is not |
| L3 | Requires knowing what the current need is |

**Ship `dna_check` covering only `F.4.02`**, with output explicitly stating it verifies **structure, not judgment**. A `dna_check` claiming to verify D2 would be a fabricated verification — the exact pattern (`A.3.35`) this session was spent eliminating.

### F.4.04 — Sealing AX-8
- [ ] `dna_check` ships covering the seven mechanical assertions
- [ ] ux-gate confirmed **blocking**, not advisory (`F.5.20`)
- [ ] Two real redesigns pass mechanically; judgment items reviewed separately and recorded
- [ ] GOVERNOR ratifies

**Until then the DNA is T1 and should be expected to drift** — not a criticism of the standard, which is well specified, but because that is what T1 does.

---

## F.5 — Sequence

| ID | Task | Depends on |
|---|---|---|
| `F.5.01` | Zone manifest for `src/` (`F.2.05`, Option B) | `A.2.01` ratified |
| `F.5.02` | Build the single data-access layer (`F.2.03`) | `B.5.03` |
| `F.5.03` | Fix `F.3.10` — remove the client-side tier toggle, read entitlement from `D.5.02` | `D.5.02` |
| `F.5.04` | Fix `F.3.13` — mock fallback becomes a visible degraded state | — |
| `F.5.05` | Fix `F.3.12` — `simulatedRole` confined to dev display, unreachable by permission logic | `B.5.03` |
| `F.5.06` | Ship `dna_check` with the seven mechanical assertions (`F.4.02`) | — |
| `F.5.10` | **Decide: build persistence for the generic PM surface, or retire it** | GOVERNOR |
| `F.5.20` | Confirm whether the ux-gate agent blocks or advises | GOVERNOR |

**`F.5.10` is the largest open decision in the system.** It determines whether `F.5.02` scope is one product or two, and whether `E.5.01` is the only product surface.

---

## F.6 — Verification

### F.6.01 — Evidence standard
| Change | Proof |
|---|---|
| Any surface | Rendered behaviour, **not** a passing build |
| Persistence | Data survives a different browser on a different device |
| Tenant scoping | Tenant A's session cannot render tenant B's data — the client half of `A.4.05` |
| DNA compliance | `dna_check` passes on the seven mechanical assertions; judgment items reviewed and recorded separately |
| Degraded states | Loading, empty, and error each demonstrated — mock fallback is not one of them |

### F.6.02 — Current standing
`NOT VERIFIED` · No server persistence, no data layer, `dna_check` unshipped, five never-do rules with three live violations.
