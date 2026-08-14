# CISEM Canon — E · Vertical & Product

**Address:** `E` · **Depends on:** A, B, C, D · **Serves:** F
**Addressing scheme:** `A.0`
**Status:** Draft for GOVERNOR ratification

---

## E.0 — Charter

### E.0.1 — Purpose
`RATIFIED-PENDING` · The product itself — what CISEM sells, to whom, and why they would choose it. Owns the gifting/catalog vertical: catalog, suppliers, branding, briefs, proposals.

**Plain:** This spine answers the question no amount of good engineering can answer for you — what is this for, and why would someone pay for it.

**Boundary:** E may depend on A–D. **Nothing in A–D may depend on E.** That is the platform/vertical separation, and it is what makes a second vertical possible.

---

## E.1 — State

### E.1.01 — Zero customers
`CONFIRMED 2026-08-12` · Every named client is seed or mock data: Acme HighTech LTD (David Cohen) in `seed_db.py`, Global Electronics Ltd and Israel Metalworks in `templates_registry.json`, TechCorp / Apex Retail / Mir Logistics in `useAdminStore`. **No one has paid or committed.**

### E.1.02 — "Image processing" is catalog search indexing
`CONFIRMED` · `/api/v1/catalog/upload-image` sends the image to `gemini-1.5-flash` for a textual description, then embeds that description with `text-embedding-004` into a 768-dim vector. It is **search infrastructure for the catalog**, not a user-facing image tool.

**Cost:** Gemini 1.5 Flash $0.075/1M input tokens, embeddings $0.025/1M — well under $0.0001 per image. The real constraints are **rate limits and vector/blob storage growth**, neither of which has been analysed.

`closes: A.3.05` · `basis_for_rejecting: A.2.11`

### E.1.03 — The vertical schema is complete and unserved
`CONFIRMED` · `catalog_items`, `product_groups`, `product_variations`, `branding_subcontractors`, `branding_rate_cards`, `supplier_mappings`, `briefs`, `proposals`, `proposal_items`, `catalog_item_sandbox_variants`, plus pgvector similarity search. **The frontend surfaces almost none of it.**

### E.1.04 — The frontend serves a different product
`CONFIRMED` · Kanban, Gantt, Calendar, task tree, collaboration hub — generic project management, entirely client-side, mapping to **zero** database tables. See `F.3.01`, `F.5.10`.

### E.1.05 — WhatsApp integration is live
`CONFIRMED` · `SettingsView.jsx` and `useNotificationStore.js` send real notifications via Green API. One of the few fully wired features in the system.

---

## E.2 — Decision

### E.2.01 — Unique Value Proposition
`RATIFIED 2026-08-12`

**Plain:** CISEM sells AI-powered visual catalog search plus automatic WhatsApp updates to clients, for businesses that source and brand physical products. It does not sell project management.

**Structured:**
```
uvp: AI-driven visual catalog ingestion + automated WhatsApp collaboration
     for the product sourcing / corporate gifting vertical
explicitly_not: generic project management (Notion, ClickUp, Asana, Linear)
evidence_for: E.1.02 (embedding pipeline exists), E.1.05 (WhatsApp live),
              E.1.03 (schema complete), Hebrew-first catalog capability
```

**Reason for the exclusion:** Kanban and task lists are free in a dozen mature products. Competing there means competing on nothing. The catalog + branding-cost + supplier + WhatsApp combination is not something those products do.

### E.2.02 — Vertical may depend on platform; never the reverse
`PROPOSED` · The concrete form of `A.2.01` for this spine. Enforced by `A.4.14`.

### E.2.10 — Build generic PM as the product
`REJECTED` · **Reason:** commodity market, no differentiator, and the existing backend serves none of it. The engineering investment already made points entirely at `E.2.01`.

---

## E.3 — Finding

| ID | Finding | Status |
|---|---|---|
| `E.3.01` | The backend serves the gifting vertical; the frontend shows generic PM. **Nothing joins them.** | `OPEN` → `F.5.10` |
| `E.3.02` | The UVP is ratified but nothing has been built toward it — no catalog UI, no visual search surface, no WhatsApp-in-workflow | `OPEN` → `E.5.01` |
| `E.3.03` | Gemini rate limits and vector/blob storage growth unanalysed — the actual cost drivers | `OPEN` |
| `E.3.04` | `B2bHubView.tsx` renders static mock grids; no wiring to the vertical schema | `OPEN` |
| `E.3.05` | Vertical tables (`catalog_items` et al.) have RLS on and no policies — the UVP core goes dark at the key swap | `OPEN` → `C.5.03` |
| `E.3.06` | Time-to-value chain undesigned — registration to first value has no defined path | `OPEN` → `E.5.02` |

**`E.3.02` is the strategic finding.** Every hour of this session went into the foundation. The product the foundation exists to serve has not been started. That is correct sequencing — but it should be visible, not implicit.

---

## E.4 — Mechanism

| ID | Mechanism | Tier | Status |
|---|---|---|---|
| `E.4.01` | `A.4.14` (E14) prevents platform importing from vertical | T3 | ⬜ |
| `E.4.02` | Vertical tables tenant-scoped by RLS | **T5** | ⬜ `C.5.03` |
| `E.4.03` | Gemini usage monitoring against rate limits | T3 | ⬜ |

---

## E.5 — Sequence

| ID | Task | Depends on |
|---|---|---|
| `E.5.01` | Design the catalog surface — visual search, ingestion, results. The first thing built toward the UVP. | `F.5.10` decision, `C.5.03` |
| `E.5.02` | Design the time-to-value chain: registration → first value ("aha moment"). Defines the onboarding state machine and the data model it needs. | `E.2.01`, `D.5.01` |
| `E.5.03` | Wire `B2bHubView` to the real vertical schema, or retire it | `E.5.01` |
| `E.5.04` | Analyse Gemini rate limits and storage growth at projected volume | — |
| `E.5.05` | Bring WhatsApp into the proposal/approval workflow, not only settings | `E.5.01` |

**Blocked until:** `C.5.05` (E4 clean) and `B.5.03` (middleware). Product work on an unenforced tenant boundary produces features that must be rebuilt.

---

## E.6 — Verification

### E.6.01 — Evidence standard
| Claim | Proof |
|---|---|
| The UVP is real | A user uploads an image and finds the right catalog item |
| The vertical works end to end | Brief → catalog match → proposal → WhatsApp notification, one path |
| Cost is sustainable | Measured Gemini calls and storage at projected volume, not estimated |
| A customer wants it | One named prospect who has seen it. **Not seed data.** |

### E.6.02 — Current standing
`NOT VERIFIED` · Zero customers, zero product surface built toward the ratified UVP. The schema and the embedding pipeline exist; nothing connects a user to them.
