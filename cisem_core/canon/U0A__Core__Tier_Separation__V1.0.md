# U0A · Core · Tier Separation

**Address:** `U0A` — the law that governs every other document
**Status:** Draft for GOVERNOR ratification
**Nothing else is written until this is ratified.** Otherwise every document moves twice.

---

## U0A.1 — The failure this exists to prevent

**Tier bleed:** under detail load, a writer — human or model — drifts from the archetype it is holding and answers at a different tier than the one it occupies. Every individual statement remains correct. The document becomes unusable anyway, because a reader can no longer tell whether they are reading law, fact, method, or instance.

**Worked example.** During foundation work — with the universal and instance tiers incomplete and no pipeline yet defined — a question about which data a particular surface component should display was answered in full, with options and a recommendation. That is an **S-tier** answer. Every paragraph was sound. It pulled the work out of the first cycle into solution design, and recommended an item that had been deferred one turn earlier.

**No amount of care prevents this.** Care is T0 on the durability ladder. The prevention is structural: the tier must be declared in the filename and in every internal address, so that it is re-asserted every time the document is opened, cited, or addressed.

---

## U0A.2 — The four tiers

| Tier | Holds | Admission test | Rejection test |
|---|---|---|---|
| **U** Universal Core | What is true regardless of project, vendor, technology, or year | Would still be true for a different company building a different product in 2035 | Contains a product name, vendor name, table name, file path, or date |
| **I** Instance | What is true of this specific system, now | Cites the `U` item it instantiates | States a general principle not traceable to a `U` item |
| **P** Pipeline | The universal method: intent → verified working solution | Can be run on paper against any solution | Names a specific solution |
| **S** Solution | One specific solution, carried through `P` | Cites the `P` stage it is at | States general law, or modifies `U`/`P` directly |

### U0A.2.1 — The one-tier rule

> **No document holds more than one tier. No section within a document changes tier.**

A `U` document that names a vendor has bled. An `I` document that states a principle has bled. An `S` document that improves the method has bled — the improvement must be **promoted**, not written in place (`U0A.6`).

### U0A.2.2 — Reading direction

```
U  ──instantiated by──▶  I
│                        │
└──method for──▶  P  ──applied to──▶  S
                  ▲                   │
                  └──promoted from────┘
```

`U` and `P` are written once and improved slowly. `I` changes as the system changes. `S` accumulates, one per solution.

---

## U0A.3 — Naming as context carrier

The filename is not a label. **It is the tier assertion, re-read every time the file is addressed.**

```
U2__Core__Identity_and_Tenancy__V1.0.md
│   │     │                       │
│   │     │                       └── version
│   │     └── topic
│   └── scope: Core | CsAg | Pipeline | <solution name>
└── tier + sequence
```

| Pattern | Example |
|---|---|
| `U{n}__Core__{Topic}__V{n.n}.md` | `U3__Core__Data_and_Persistence__V1.0.md` |
| `I{n}__CsAg__{Topic}__V{n.n}.md` | `I3__CsAg__Data_and_Persistence__V1.0.md` |
| `P{n}__Pipeline__{Stage}__V{n.n}.md` | `P1__Pipeline__Intent_to_Verified__V1.0.md` |
| `S{nn}__{Solution}__{Artifact}__V{n.n}.md` | `S01__ImageProcessing__Pipeline_Record__V1.0.md` |

### U0A.3.1 — U and I mirror by number

`U2` and `I2` are the **same topic**, one as law and one as fact, readable side by side.

| # | Topic |
|---|---|
| **1** | Governance & Method |
| **2** | Identity & Tenancy |
| **3** | Data & Persistence |
| **4** | Entitlement & Templates |
| **5** | Vertical & Product |
| **6** | Surface & UX |
| **7** | Operations & Cadence |

This mirroring is the mechanism that makes bleed **visible**: an item in `I3` with no counterpart in `U3` is either a missing law or a leaked principle. Either way it is a finding.

### U0A.3.2 — Internal addresses carry the tier

```
U3.2.01     universal doc 3 · stage 2 (Decision) · item 1
I3.2.01     the CsAg instantiation of that decision
P1.4        pipeline stage 4
S01.P4.02   solution 01 · at pipeline stage 4 · item 2
```

**Every citation re-asserts the tier.** `I3.2.01` cannot be mistaken for law. `U3.2.01` cannot be mistaken for a fact about your database. The seven stages (`A.0.3`) apply within U and I unchanged.

### U0A.3.3 — Titles carry it too

Every section heading leads with its address. Not decoration — the same re-anchoring, one level down. A reader scrolling into the middle of a long document lands on `I3.3.04` and knows immediately: instance, finding, item 4.

---

## U0A.4 — The batch sequence

Four batches, strictly ordered. Each has an exit gate. **A batch does not start until the previous one exits.**

### Batch 1 · Line 1 — `U1`–`U7`, the Universal Core
What must be true of any platform of this kind.

**Exit gate:**
- [ ] No `U` document contains a vendor name, product name, table name, file path, or date
- [ ] Every `U` item is stated so it would hold for a different company in a different decade
- [ ] Each `U` document's stage `.4` names how its rules can be mechanically enforced — at the tier level, not the tool level

### Batch 1 · Line 2 — `I1`–`I7`, the Instance
What is true of this specific system as it actually is.

**Exit gate:**
- [ ] Every `I` item cites the `U` item it instantiates
- [ ] No `I` item states a general principle
- [ ] Every `I.1` (State) item is `CONFIRMED` against source, or explicitly marked `INFERRED`
- [ ] Every `U` item with no `I` counterpart is recorded — an unapplied law is a gap

### Batch 2 — `P`, the Pipeline
Intent → working, verified solution. Universal; names no solution.

**Exit gate:**
- [ ] Every stage has an entry condition, an exit condition, and an artifact
- [ ] It can be run on paper against a hypothetical solution end to end
- [ ] Each stage names which `U` documents govern it
- [ ] Nothing in it is specific to any one system

### Batch 3 — `S01`, `S02`, … one solution at a time
Each solution carried through `P`, producing a permanent record.

**Exit gate per solution:**
- [ ] Every `P` stage has an artifact
- [ ] The solution is verified per `U1` verification doctrine
- [ ] The record is written and addressed

### Batch 4 — Consolidation, **after every solution**
Compare the solution's actual path against `P` and `U`.

**Exit gate:**
- [ ] Every friction point is recorded — where `P` did not fit reality
- [ ] Every candidate promotion is listed and decided (`U0A.6`)
- [ ] `P` and `U` are updated or explicitly left unchanged, with reason
- [ ] Contradictions between `P` and `U` are resolved, not deferred

**Batches 3 and 4 alternate forever.** That alternation is the mechanism by which the universal improves from specific work — and it is the only sanctioned path by which `U` and `P` change.

---

## U0A.5 — Documentation sequence vs. work sequence

**This is the pushback, and it matters more than anything above.**

The batch sequence governs **documents**, not **repairs**. If it governed repairs, a documentation exercise would block live security work. Where a system has an unenforced isolation boundary, that boundary is repaired regardless of which batch is open.

> **Live Co1 repair proceeds in parallel and is not gated by the batch sequence.**

Three items, unchanged, proceeding regardless of which batch is open:

| | Item |
|---|---|
| 1 | Canon placed inside the working boundary, read-only to actors |
| 2 | Ratify zone direction; complete `zones.json` |
| 3 | Identity chain — claim-minting → backfill → middleware |

**The guard against this becoming a documentation project that never ships:** if `S01` has not entered by the time `U` and `I` are written, the sequence has failed its purpose. `U` and `P` exist to make solutions ship better, not to be admired.

---

## U0A.6 — Promotion — how the universal improves

A solution reveals something general. It **does not edit `U` or `P` directly** — that would be tier bleed in its most damaging form, because it would let one case rewrite the law.

```
S{nn} finding
   └── proposed as a promotion candidate in the Batch 4 consolidation
         └── promoted only if it held in ≥2 solutions
               └── written into P or U as a new item, citing both sources
```

**The ≥2 rule:** one instance is an anecdote. Two is a pattern. A candidate that has appeared once is recorded and held, not promoted.

**Demotion exists too.** A `U` item that no `I` or `S` has ever needed is a speculation. Mark it, and if it survives two more consolidation passes unused, retire it. **The universal must be earned by use, not by foresight.**

---

## U0A.7 — Migrating an existing document set

`PROPOSED`

Where a document set already mixes tiers, it is **split, not extended**. Every item keeps its text and gains a tier. The originals become snapshots — never edited, never cited as authority.

**The mapping for any specific project is an instance fact and belongs at that project's `I1`.** This document owns only the rule.

**The cost is real** — a full pass over the existing set. It is worth paying once, rather than discovering later that the universal core is contaminated with facts about one vendor in one year.

## U0A.8 — Open for ratification

| # | Question |
|---|---|
| `U0A.8.1` | Four tiers U · I · P · S, with the one-tier rule? |
| `U0A.8.2` | The naming convention as context carrier, with U/I mirrored by number? |
| `U0A.8.3` | The four-batch sequence and its exit gates? |
| `U0A.8.4` | **Live Co1 repair proceeds in parallel, ungated by the batch sequence** (`U0A.5`)? |
| `U0A.8.5` | Promotion requires ≥2 solutions; `S` may never edit `U` or `P` directly? |
| `U0A.8.6` | The A–G canon splits into U/I, accepting the rework cost? |
