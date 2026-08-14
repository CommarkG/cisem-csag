# CISEM Canon — Addressing System

**Address:** `A.0` — Charter of the canon itself
**Status:** Draft for GOVERNOR ratification. **Nothing is renumbered until this is ratified**, or the content moves twice.
**Supersedes:** nothing. First record.

---

## A.0.1 — What this is

A single addressing system in which **the address is the architecture**. Reading an address tells you which domain a thing belongs to, which stage of the build cycle it sits at, and what it depends on — without opening the file.

Three tiers, read left to right:

```
        B  .  3  .  07
        │     │     │
        │     │     └── ITEM      sequential within the stage
        │     └──────── STAGE     which turn of the core cycle
        └────────────── SPINE     which domain, in dependency order
```

`B.3.07` = Identity & Tenancy spine · Finding stage · item 7.
The address is permanent. An item never changes address, even when superseded.

---

## A.0.2 — Tier 1: SPINE (letter)

Seven spines. **The letter order is the dependency order** — each spine depends only on spines lettered before it, and serves those after. This is the corespine rule made into an address: nothing floats, everything sits above something and below something.

| Spine | Domain | Depends on | Serves |
|---|---|---|---|
| **A** | Canon & Governance — the system that governs the system | nothing | all |
| **B** | Identity & Tenancy — users, claims, roles, tenant boundary | A | C–G |
| **C** | Data & Persistence — schema, RLS, migrations, data access | A, B | D–G |
| **D** | Entitlement & Templates — packages, features, template registry | A–C | E–G |
| **E** | Vertical / Product — the gifting catalog, proposals, branding | A–D | F |
| **F** | Surface & UX — frontend, design system, UX/UI DNA | A–E | — |
| **G** | Operations & Cadence — how work runs, verification, roles | A | all |

**The rule this encodes:** an item in B may never depend on an item in E. If it does, the platform core cannot be reused for a second vertical. E14 (the import linter) enforces the code form of this; the address enforces the conceptual form.

**G is deliberately last and depends only on A.** Operations governs how work is done across every spine without being owned by any of them.

---

## A.0.3 — Tier 2: STAGE (digit)

Seven stages. **Every spine passes through the same seven.** That repetition is the core spiral: you traverse the same stages for each spine, and re-enter them at greater depth as understanding grows.

| Stage | Name | Answers | Written when |
|---|---|---|---|
| **0** | **Charter** | What is this spine? Where does it start and stop? What does it rely on above, what does it serve below? | Once, at spine creation |
| **1** | **State** | What exists *now*, confirmed against source. Confirmed vs. inferred marked per item. | Refreshed each pass |
| **2** | **Decision** | What was chosen. **What was rejected and why.** What superseded what. | At each ratification |
| **3** | **Finding** | Gaps, defects, contradictions, duplications, partial implementations. Each with evidence and status. | Continuously |
| **4** | **Mechanism** | What enforces this spine, at which durability tier (T0–T5). | When a mechanism ships |
| **5** | **Sequence** | The ordered work to close stage 3, with dependencies. | Each planning pass |
| **6** | **Verification** | What counts as proof for this spine, and the current standing. | After each change |

**The spiral, stated plainly:** first pass through a spine is shallow — a charter, a rough state, obvious findings. The second pass deepens it: state becomes evidenced, findings acquire mechanisms, sequence becomes dependency-ordered. Nothing is discarded between passes; stage 2 accumulates and stage 3 items change status rather than disappearing.

---

## A.0.4 — Tier 3: ITEM (two digits)

Sequential within the stage, assigned in order of creation, **never reused and never renumbered**. `C.3.04` remains `C.3.04` after it is closed, superseded, or reversed. Status changes; the address does not.

**Status values, common to all stages:**

| Status | Meaning |
|---|---|
| `PROPOSED` | Written, not ratified |
| `RATIFIED` | GOVERNOR approved; binding |
| `OPEN` | A finding that is live |
| `CLOSED` | A finding resolved, with evidence cited |
| `SUPERSEDED by X.n.nn` | Replaced; text preserved |
| `REJECTED` | Considered and declined — **preserved, with the reason** |
| `KNOWN` | Accepted open item, tracked, not blocking |

`REJECTED` is the one that disappears in ordinary documentation and is half of what you asked for. A rejected option keeps its address and its reasoning forever, so the same idea cannot be re-proposed without meeting the recorded argument against it.

---

## A.0.5 — Cross-references

Written as bare addresses. Four link types, and no others:

| Link | Meaning |
|---|---|
| `closes` | A mechanism or decision resolves a finding |
| `supersedes` | Replaces an earlier item |
| `depends on` | Cannot proceed until the target is done |
| `conflicts with` | Directly contradicts — must be resolved before either is ratified |

**Example chain, entirely from this session:**

```
C.3.01  Finding — template_registry FOR ALL + IS NULL permits tenant deletion of canonicals
        └── closed by C.2.03  Decision — split read/write policies, explicit WITH CHECK
                              └── enforced by A.4.04  Mechanism — E4 policy linter (T3)
                                                      └── verified by C.6.01  policy count 4/4/4
```

Reading that chain answers *what was wrong, what we decided, what stops it recurring, and how we know* — in four addresses.

**`conflicts with` is the debate mechanism.** A proposal carrying scope tags that overlap a `RATIFIED` item must either cite it and argue supersession, or be revised. The agent does not adjudicate; the check runs against the sealed record.

---

## A.0.6 — File naming

```
CISEM__[SPINE]__[Spine_Name]__V[n.n].md
```

Examples:
- `CISEM__A__Canon_and_Governance__V1.0.md`
- `CISEM__C__Data_and_Persistence__V1.0.md`

**One file per spine.** Stages are `##` headings inside it; items are `###` headings. This keeps seven files rather than several hundred, which is the difference between a corpus a human can navigate and one only an agent can.

**Deviation from the existing artifact convention** (`[Date]__[From]__[To]__[Description]__[Version]`) is deliberate and worth stating: canon files are **living and addressed**, not dated deliverables. A date in the name implies a snapshot; canon is not a snapshot. The dated convention remains correct for migrations, reviews, and reports — the things that *are* snapshots.

---

## A.0.7 — The two faces

Every item carries both. Neither is optional.

```
### C.3.01 — Tenant can delete operator canonical templates
Status: CLOSED  ·  Ratified: 2026-08-12  ·  Scope: template_registry, RLS, write-path

**Plain**
Any customer could delete the master templates the whole platform depends on.
Postgres was treating the read rule as the write rule, and the read rule allowed
touching templates that belong to no customer.

**Structured**
defect_class: read_predicate_reused_as_write
evidence: pg_policies cmd=ALL, with_check=null, qual contains "IS NULL"
closed_by: C.2.03
enforced_by: A.4.04
verified: policy count template_registry=4, E4 exit 0
```

**Ratification gate:** an item whose Plain face cannot be written without jargon is **not ratified**. If it cannot be stated plainly, it is not understood well enough to be canon. This is a comprehension test, and it exists specifically to prevent the canon drifting into a form only agents can read.

---

## A.0.8 — Sealing

The canon must be more stable than code, because code is what agents edit.

| Property | Mechanism | Tier |
|---|---|---|
| Agents may read, never write | Canon directory excluded from agent write scope | **T4** |
| Tampering is detectable | Per-file checksum in a ratified registry, verified in the gate | **T3** |
| Change requires deliberate act | GOVERNOR ratification, not an edit | **T2** |
| Supersession is cheap | New item, old one marked `SUPERSEDED by`, text preserved | process |

**This mirrors the out-of-band gate integrity check already in `build.js`** — which hashes `cisem_gate.py` against a ratified registry entry and exits 1 on mismatch. The pattern is proven in your own system; the canon extends it.

**Why this is stronger than hardcoding:** code changes silently. A sealed canon change fails the build loudly. That is the property you were reaching for when you said hardcoding is partial.

---

## A.0.9 — Migration map

Every existing item's new address. **No content is rewritten during migration** — items move, they do not change.

### From `CISEM_Session_Review_and_Gap_Closure_Plan.md`

| Existing | New address |
|---|---|
| §2 Falsified claims F1–F7 | `A.3.01`–`A.3.07` (findings about the *review process*, not the system) |
| §3.1 D1–D6 database defects | `C.3.01`–`C.3.06` |
| §3.2 A1–A6 application defects | A1, A2, A3 → `B.3.01`–`B.3.03` · A4 → `C.3.07` · A5 → `F.3.01` · A6 → `B.3.04` |
| §3.3 P1–P12 caught proposals | `A.3.10`–`A.3.21`, status `REJECTED`, reasons preserved |
| §3.4 B1–B8 agent behaviour | `A.3.30`–`A.3.37` |
| §4 R1–R8 ratified decisions | R1 → `E.2.01` · R2 → `B.2.01` · R3 → `D.2.01` · R4–R7 → `B.2.02`–`B.2.05` · R8 → `C.2.01` |
| §5 Killed proposals | `A.2.10`+, status `REJECTED` |
| §6 Completed work | `C.6.01`, `A.6.01`, `A.6.02` |
| §7 Platform/vertical classification | `C.1.01` (state) + `C.2.02` (the classification decision) |
| §9 Phased order | `C.5.01`–`C.5.04`, `B.5.01`–`B.5.03`, `F.5.01`+ |

### From `CISEM_Operating_Playbook.md`

| Existing | New address |
|---|---|
| §1 Roles | `G.0.01` |
| §2 Three lanes | `G.2.01` |
| §3 Work cycle | `G.0.02` |
| §4 Verification doctrine | `G.6.01` |
| §5 Database protocol | `C.4.01` |
| §6 Secrets doctrine | `A.4.10` |
| §7 Agent engagement | `A.4.20` |
| §8 Definition of done | `G.6.02` |
| §9 Durability ladder | `A.0.10` — foundational, belongs in this charter |
| §9.2 mechanisms E1–E13 | `A.4.01`–`A.4.13` |
| §10 Cadence | `G.5.01` |

### From `CISEM_Structure_and_Frontend_Doctrine.md`

| Existing | New address |
|---|---|
| Part A1 current structure | `F.1.01` + `A.1.01` |
| A2 four zones + dependency rule | `A.2.01` |
| A3 proposed layout | `A.5.01` |
| A5 E14 import linter | `A.4.14` |
| A6 naming | `A.2.02` |
| A7 corespine placement | `A.2.03` |
| Part B frontend doctrine B1–B5 | `F.2.01`–`F.2.05` |
| B3 never-do list N1–N5 | `F.3.10`–`F.3.14` |
| Part C UX DNA durability | `F.4.01`–`F.4.04` |
| Open questions S1–S6 | `F.5.10`+ and `A.5.10`+ |

**Not migrated:** `governance/ux-ui-dna.md` remains the SSOT for D1–D8 and L1–L3. `F.4` *references* it and records its durability tier; it does not restate it. One source of truth means one.

---

## A.0.10 — Durability ladder (moved here from Playbook §9)

Foundational to the canon, so it lives in the charter.

| Tier | Mechanism | Can be violated? |
|---|---|---|
| T0 | Chat instruction | Yes — evaporates at turn end |
| T1 | `AGENTS.md` rule | Yes — degrades under context pressure |
| T2 | Application setting | Only by a deliberate click |
| T3 | Code that fails a build | Only by editing the code |
| T4 | Structural absence | **No — there is nothing to violate** |
| T5 | Database constraint | **No — Postgres refuses** |

**The rule for adding rules:** before writing a rule, test whether the bad state can be made *absent* (T4), whether the *database* can reject it (T5), or whether a *script* can fail the build (T3). Only if all three fail does it become written text. `AGENTS.md` is the residue.

---

## A.0.11 — Build order — PCR

**Option A — Migrate everything now, then resume work.**
*Pros:* clean corpus before more content accumulates. *Cons:* two to three days of pure transcription while `C.3.04` (25 tables without policies) sits open. **Reject.**

**Option B — Seed A and C spines now; others as their work begins.**
A holds the mechanisms and agent rules already in force. C holds the live database work. Together they cover everything currently active.
*Pros:* about a day; the canon starts where the work is. *Cons:* B, D, E, F, G stay as the three artifacts until touched. **Recommended.**

**Option C — Address the existing artifacts in place, migrate later.**
Add addresses as headings to the current three documents without splitting them.
*Pros:* an hour. *Cons:* the file-per-spine structure is the part that makes it navigable; this defers the actual benefit. **Viable as a stopgap only.**

**Recommendation: B.** Seed `CISEM__A__Canon_and_Governance` and `CISEM__C__Data_and_Persistence` first. They cover every currently-active item, and C is where the next two phases of work happen.

---

## A.0.12 — Open for ratification

| # | Question |
|---|---|
| A.0.12.1 | Seven spines A–G, in this dependency order? |
| A.0.12.2 | Seven stages 0–6, this decomposition? |
| A.0.12.3 | Two-face requirement, with the plain-language ratification gate? |
| A.0.12.4 | Canon files deviate from the dated artifact convention? |
| A.0.12.5 | Sealing via checksum registry, extending the existing `build.js` pattern? |
| A.0.12.6 | Build order Option B — seed A and C first? |
