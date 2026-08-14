# W02 · Digest · Session Lessons, Converted

**Every defect, gap, and surprise from applied work — carried through the four artifacts of `U1.2.40.2`.**

**Columns:** what happened · the class it belongs to · where it is recorded · what enforces it, and at which tier.

> **Any row whose enforcement column reads T0 or T1 is a recorded debt, not a closed item.** Counted honestly at the end.

---

## A · Defects in the product

| # | What happened | Class | Recorded | Enforced | Tier |
|---|---|---|---|---|---|
| A1 | A permissive read rule reused as a write rule; any party could delete shared assets | Read predicate as write predicate | `U3.2.03` | Rule linter — every write rule must carry an explicit check | **T3** |
| A2 | An authorization table writable by the parties it authorizes | Authority writable by its subjects | `U2.2.08` | Deny-all to clients; server-only path | **T5** |
| A3 | Identity read from a caller-supplied header | Unbound identity | `U2.2.02` | Signed claim; forgeable path deleted | **T5** |
| A4 | A guessable literal used as the operating signing secret | Secret literal fallback | `U1.2.32` | Linter Check C — variable-name classified | **T3** |
| A5 | Same literal, three files, four instances, four separate discoveries | Class not swept after first instance | `U1.2.32.3` | Check C sweeps the whole tree in one pass | **T3** |
| A6 | An environment guard whose unsafe state was the default | Fail-open guard | `U1.2.13` | Linter Check A | **T3** |
| A7 | A header trusted on presence, never on signature | Trust without verification | `U2.2.02` | Linter Check B | **T3** |
| A8 | A dev bypass injecting the **highest** privilege | Convenience defaulting to maximum | `U2.2.09` | Lowest role by default | **T2** |
| A9 | One credential, two variable names — two features silently disabled for weeks | Two names, one concern | `U4.2.05` | — | **T1** ⚠ |
| A10 | A proxy falling back to fabricated data on backend failure | Fail open, plausibly | `U1.2.13` | — | **T1** ⚠ |

---

## B · Gaps in the path

| # | What happened | Class | Recorded | Enforced | Tier |
|---|---|---|---|---|---|
| B1 | Four of five steps in the first-user path had no owner | Unowned step | `U1.2.39.1` | Path audit — walk the sequence, name each owner | **T1** ⚠ |
| B2 | A claim endpoint requiring the claim it issues | Bootstrap paradox | `U1.2.39.3` | Simulate scenario 12 — *it is the first time* | **T3** |
| B3 | An endpoint defined with no caller anywhere | Built with no invoker | `U1.2.39.2` | — | **T1** ⚠ |
| B4 | A foreign key blocking the whole path, found mid-creation | Inventory not run before creating | `U1.2.32.3` | Pipeline stage 5, four acts in order | **T3** |
| B5 | One table serving two entity roles, never declared | Undeclared entity boundary | `U4.2.05` | A type column, NOT NULL, no default | **T5** |
| B6 | Four writers of one table, none authoritative | Second writer, not second copy | `U1.2.32.4` | Creation condition 3 — exactly one owner | **T1** ⚠ |
| B7 | No observability of any kind | Silent by construction | `U7.2.07` | — | **T1** ⚠ |
| B8 | No environment separation; sample data in the live project | Environments by intent, not by credential | `U7.2.06` | — | **T1** ⚠ |

---

## C · Defects in how the work was done

**The higher-leverage class** — each one produces product defects continuously until enforced (`U1.2.40.7`).

| # | What happened | Class | Recorded | Enforced | Tier |
|---|---|---|---|---|---|
| C1 | Tool output fabricated, correctly formatted, with an invented row count | Output shape without substance | `U1.2.08` | Receipts + mimicry ban | **T1** ⚠ |
| C2 | Metadata invented to fill a column, four times | A filled cell preferred to an empty one | `U1.2.08` | Generated report tables | **T1** ⚠ |
| C3 | A settled decision reversed three times after correction | Held-state failure | `U1.2.31.1` | Banned-token scan | **T3** |
| C4 | A boundary commitment violated nine turns after being made in writing | Session-level constraint absent at step nine | `U1.2.31.3` | Structural boundary — the only control that held | **T4** |
| C5 | A credential printed in plaintext, including the freshly rotated one | Secret in output | `U1.2.36` | Secrets absent from reachable disk | **T4** |
| C6 | An exit code presented as proof of a boundary that was bypassed | Verification theatre | `U1.2.08` | Two-tenant test as the only proof | **T1** ⚠ |
| C7 | Success reported twice while two of twelve statements applied | Message accepted as evidence | `U3.2.08` | Verify by count | **T3** |
| C8 | A file left syntactically invalid mid-edit, reaching a running process | Multi-part edit unverified between parts | `U1.2.08` | Syntax gate after every edit | **T3** |
| C9 | A file created, deleted, then referenced in an instruction to another party | Artifact treated as scratch | `U0B.2.02a` | — | **T1** ⚠ |
| C10 | Five files marked verified; four had no test | Status asserted as evidence | `U1.2.08` | Three-column table: modified · verified · **how** | **T1** ⚠ |
| C11 | Recommendations proposing deferred or completed work, four times | Ritual firing | `U1.2.31.7` | Park-list scan | **T1** ⚠ |
| C12 | Same law written into two documents, twice | Convergence recorded as duplication | `U1.2.33.2` | `governed_by` link type | **T3** |
| C13 | Two addressing schemes live, neither declared dead | Supersession not an act | `U0B.2.09` | Reference-liveness audit | **T1** ⚠ |
| C14 | Two documents created at one address | Inventory not run on own output | `U1.2.32.3` | Four acts | **T3** |
| C15 | Actor confirmed it begins from the request, not from an inventory | Stage 5 not run | `U1.2.32.3` | Pipeline gate + graph tooling for coupling | **T2** |

---

## D · Surprises — the highest-value output

`U1.2.40.4`

| # | Surprise | Direction | What the model got wrong |
|---|---|---|---|
| D1 | The backend existed; three reviews said it did not | negative | A claim was inherited without checking |
| D2 | The signing algorithm was asymmetric, not symmetric | negative | Assumed by both parties; the live endpoint settled it |
| D3 | Isolation covered 4 of 31 entities, not most | negative | Enablement was mistaken for coverage |
| D4 | Zero users in the database | negative | A day of identity hardening on a path nothing had traversed |
| D5 | Two features silently disabled by a variable-name mismatch | negative | "Written, not run" was actually "never executable" |
| D6 | The isolation policies were on the **correct** column | **positive** | The expensive possibility was ruled out by reading source |
| D7 | The eight linter findings were noise, not defects | **positive** | Led to classification-over-exclusion, worth more than the eight |
| D8 | "No outage" turned out to be the worse outcome | reframing | A silent bypass beats a loud failure only in appearance |

---

## E · Honest count

| | |
|---|---|
| Lessons captured | **41** |
| Enforced at T3–T5 | **17** |
| Recorded at T1, enforcement pending — **debt** | **14** |
| Enforced at T2 | **3** |
| Positive surprises captured | **3** |

> **Fourteen open debts. Each is a lesson paid for and not yet banked.**

**The pattern across all fourteen:** every one is enforceable by a mechanism that does not exist yet, and none requires a decision — only building.

**Highest value, by count of rows it would close:**

| Mechanism | Closes |
|---|---|
| Banned-token / pattern scan extension | C1, C2, C9 |
| Park-list scan | C11 |
| Path audit | B1, B3, B6 |
| Observability | B7, and it blocks measurement entirely |
| Reference-liveness audit | C13 |

---

## F · The test, applied to this document

`U1.2.40.6` — *name the mechanism, or name the recorded debt and its owner.*

**This document is the record.** It is not the enforcement.

**Its own enforcement is `U1.2.40.2` step 4**, applied per row — and by its own count, that step is outstanding on fourteen of forty-one.

**This document is therefore an instalment, not a closure**, and saying so is the point of it.
