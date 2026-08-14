# S00 · Template · Solution Record

**Tier:** S — Solution. **This is the empty shape, not a solution.**

> **Why there is no `S01` yet.** A solution record is **produced by running a solution through `P1`**, not by writing one. Writing an `S01` before any solution has travelled the pipeline would be fabricating a record of work that did not happen — the failure class `U1.2.08` exists to prevent. `S01` appears when the first solution enters `P1.1`.

**To use:** copy to `S{nn}__{Solution}__Record__V1.0.md`, fill each stage as it is exited, never in advance.

---

## S{nn}.0 — Header

```
solution:    {name}
entered:     {date}
lane:        governance | core | product
topic:       1–7
zone:        Z0 | Z1 | Z2 | Z3
current:     P1.{n}
status:      IN PROGRESS | VERIFIED | ABANDONED
re-entries:  {list, with the finding that caused each}
```

---

## S{nn}.P1 — Intent
`stage exit: {date}`

**Problem:** *(a problem, not a solution — see `P1.1`)*
**Beneficiary:**
**Consequence if unsolved:**
**Why now:**

---

## S{nn}.P2 — Placement
`stage exit: {date}`

```
topic:       U{n} / I{n}
zone:
depends_on:
serves:
lane:
```

---

## S{nn}.P3 — Existing
`stage exit: {date}`

| What exists | Source checked | Serves this need? |
|---|---|---|
| | *(running system or actual source — never a summary)* | |

**Decision:** enhance | consolidate | build new
**Justification if building new:**

---

## S{nn}.P4 — Decision
`stage exit: {date}`

**Chosen:**
**Reason:**

| Alternative rejected | Reason | Permanent |
|---|---|---|
| | | `REJECTED` |

---

## S{nn}.P5 — Contract
`stage exit: {date}`

**Data in / out:**
**Interface:**
**Failure modes:** *(what happens when each dependency is unavailable)*
**States:** loading · empty · error
**Reversal path:**
**Evidence method:** *(stated now, before the build — `P1.8` will use exactly this)*

---

## S{nn}.P6 — Enforcement
`stage exit: {date}`

| Rule (`U` address) | Tier here | Mechanism | Status |
|---|---|---|---|
| | T0–T5 | | enforced \| **known weakness** |

*(Any rule with no mechanism is a known weakness. It is never recorded as satisfied.)*

---

## S{nn}.P7 — Build
`stage exit: {date}`

**Pocket issued:** `POCKET__S{nn}__V{n}.md`
**Boundary honoured:** yes | **no → returned to `P1.2`**
**Implementation:** *(reference, not restatement)*

---

## S{nn}.P8 — Verify
`stage exit: {date}`

| Claim | Evidence | Authored by |
|---|---|---|
| | | *(must not be the builder)* |

**X0 — inheritance suite:** PASS | FAIL
**Evidence method matches `P1.5`:** yes | no *(if no, the evidence was chosen after the fact)*

---

## S{nn}.P9 — Record
`stage exit: {date}`

**Friction — where `P` did not fit reality:**

**Promotion candidates:**

| Candidate | Seen in | Decision |
|---|---|---|
| | `S{nn}` | HELD (needs a second) \| PROMOTE to `U{n}` / `P1.{n}` |

**Deferred, with conditions:** *(filed to the deferral register, not left here)*

---

## S{nn}.C — Consolidation
`pass complete: {date}`

**`P` changes:** *(or: unchanged, with reason)*
**`U` changes:** *(or: unchanged, with reason)*
**Contradictions found and resolved:**
**`U` items unused for two consecutive passes:** *(marked for demotion)*

---

## Stage checklist

- [ ] `P1` Intent — a problem, not a solution
- [ ] `P2` Placement — relies on above, serves below
- [ ] `P3` Existing — inventoried against source
- [ ] `P4` Decision — rejections recorded
- [ ] `P5` Contract — **evidence method stated before the build**
- [ ] `P6` Enforcement — every rule tiered; gaps named as weaknesses
- [ ] `P7` Build — within the declared boundary
- [ ] `P8` Verify — X0 passes; evidence not self-authored
- [ ] `P9` Record — friction and candidates listed
- [ ] `C` Consolidation — `P` and `U` updated or explicitly unchanged
