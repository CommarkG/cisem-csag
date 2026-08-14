# U3 · Core · Data & Persistence

**Tier:** U — Universal. **Cycle:** Co1 · pass 1 · Charter and Decision stages only.

---

## U3.0 — Charter

```
purpose:     The isolation boundary between scopes, enforced by the persistence
             layer itself, and the protocol by which that boundary changes.
boundary:    U3 owns enforcement of isolation and the discipline of schema
             change. U2 owns producing the identity the boundary reads.
             U4 owns what a scope may access beyond isolation.
depends_on:  U1, U2
governs:     U4, U5, U6
invariant:   The isolation boundary is enforced by the persistence layer,
             not only by the code in front of it.
```

---

## U3.2 — Decisions

### U3.2.01 — Isolation is enforced at the persistence layer
`RATIFIED`

Application-layer filtering is a convenience, not a boundary. One missed filter anywhere in the codebase is a cross-scope leak, and the number of places a filter can be missed grows with every feature.

Persistence-layer enforcement holds regardless of what the application forgets, and is the only form that survives a new developer, a new service, or a direct query.

### U3.2.02 — The application must not hold a credential that bypasses isolation
`RATIFIED`

A boundary the application routinely bypasses is not enforced — it is documented. If the standard connection carries privileges that ignore isolation rules, those rules are inert regardless of how correctly they are written.

**This is the most commonly overlooked condition**, because the system behaves identically whether the boundary works or not, right up until it is tested by an adversary.

*origin: a complete and correct isolation ruleset, inert because every connection used a credential that bypassed it.*

### U3.2.03 — Read predicates are never write predicates
`RATIFIED`

Persistence layers commonly reuse the visibility predicate as the modification predicate when only one is supplied. A predicate written to answer *what may be seen* then silently answers *what may be changed*.

**Every rule permitting modification carries an explicit modification predicate**, separate from the visibility predicate — even when the two are identical. Especially then, because identical-by-intent and identical-by-default are indistinguishable afterwards.

*origin: two independent privilege escalations, both from a visibility predicate inherited by a write path, both proposed again after correction.*

### U3.2.04 — Permissive visibility never reaches a write path
`RATIFIED`

Shared or unowned records are legitimately readable by all scopes. That permission must exist **only** in the visibility rule. A permissive clause in a modification predicate lets any scope create, alter, or destroy shared records.

*origin: a shared-template library that every scope could delete.*

### U3.2.05 — Grant to the role that needs it
`RATIFIED`

Rules are granted to the narrowest role that requires them. Granting to a universal role includes unauthenticated callers by default, which is rarely the intent and never visible in the rule's text.

### U3.2.06 — Classification precedes protection
`RATIFIED`

Every entity is classified before a rule is written for it:

| Class | Meaning |
|---|---|
| **Core** | Reusable across any vertical — identity, entitlement, shared infrastructure |
| **Vertical** | Belongs to one product domain |
| **Shared reference** | Read by all, owned by none |
| **Server-only** | Not reachable by callers at all |

**The class determines the rule shape.** Without classification, each entity is an independent decision; with it, there are as many decisions as there are classes.

### U3.2.07 — Enabled isolation without a rule denies everything
`RATIFIED`

Turning on isolation for an entity that has no rule denies all access. This is **correct when intended** and an outage when not. Both states look identical while a bypassing credential is in use (`U3.2.02`), and diverge violently the moment it is removed.

Every entity with isolation enabled must have either a rule or an explicit record that denial is intended.

### U3.2.08 — Verify by count, never by message
`RATIFIED`

A change is verified by querying the resulting state and counting, not by reading the operation's report. Reports describe intent; counts describe outcome.

*origin: an operation reporting complete success twice, having applied two of twelve statements. Only a count revealed it.*

### U3.2.09 — The running system is the source of truth
`RATIFIED`

Schema files in source control record history, not state. The two diverge — through manual changes, partial application, and out-of-band edits — and the divergence is invisible until something depends on it.

**Any claim about the persistence layer derived from source files is unreliable.** Claims must be derived from the running system, and the difference between the two is itself a finding worth detecting continuously.

### U3.2.09a — A change record is not a schema
`PROPOSED` · `governed_by: U1.2.48.6`

A file of change statements records **what was intended**, in the order it was intended. It does not record what was applied, what was superseded by a later manual change, or what was never run.

**Treating it as the schema is the most expensive routine error available**, because it is authored in good faith, reads as authoritative, and drifts silently.

| The file says | The system may hold |
|---|---|
| a column, defined | no such column |
| a table, created | no such table |
| a constraint | a different constraint |
| nothing | a table added out of band |

**All four occur, and none announces itself.**

### U3.2.09b — Structure is drift-checked, not only policy
`PROPOSED`

Where a drift check exists for one aspect of a persistence layer, its absence for the others is a gap, not a scope decision. **Access rules and structure drift by the same mechanisms** — manual change, partial application, out-of-band edits — and the structural drift is the more consequential, because every rule is written against a structure.

**The check compares live state to tracked statements and reports three classes:**

| | |
|---|---|
| **Untracked** | present live, no statement created it |
| **Phantom** | a statement created it, absent live |
| **Divergent** | present in both, different shape |

**A migration authored while any of the three is unresolved is authored against an unknown.**

### U3.2.10 — Change is atomic and reversible
`RATIFIED`

A schema change applies fully or not at all. A partially applied change leaves the system in a state nobody designed and nobody can reason about.

Every change carries a known reversal path before it is applied, and a durable record of which changes have been applied — because "written" and "applied" are different facts (`U3.2.09`).

### U3.2.10a — Compensation belongs only where rollback is impossible
`PROPOSED`

A multi-step write within **one** store is made atomic by that store's transaction. Compensating logic — undoing earlier steps after a later one fails — is for the case where the steps span stores and a single transaction cannot exist.

**Applied inside one store, compensation is strictly worse than a transaction:**

| | Failure modes |
|---|---|
| Transaction | **One** — the operation fails and nothing persists |
| Compensation | **Two** — the operation fails, *and* the compensation can fail, leaving a partial state plus a failed cleanup |

**The test:** can all steps reach the same store in one call? If yes, a transaction is available and compensation is a choice to add a failure surface.

**And the specific residue when it is skipped:** a partial write leaves records that are structurally indistinguishable from legitimate ones. An owner record with no members reads exactly like a real owner record — and nothing will ever clean it up, because nothing knows it is wrong.

### U3.2.06a — A schema built for one model does not serve another by adjustment
`PROPOSED`

Where a structure carries columns belonging to a responsibility the system no longer holds — credentials in a store whose authentication moved elsewhere, fields required by a design that was replaced — **that is a structural incompatibility, not a failure mode.**

**The distinction matters because they are repaired differently.** A failure mode is handled. An incompatibility is resolved, and until it is, every operation against that structure fails at the first attempt, every time.

**The diagnostic:** does the operation fail *sometimes*, or *always*? An operation that can never succeed is not a defect in the operation.

### U3.2.06b — Retire columns that assert a responsibility the system has moved
`PROPOSED` · `governed_by: U1.2.42`

A column requiring a value the system can no longer produce is not merely unused. **It is an invitation** — the next party will find it and populate it, and the responsibility will exist in two places.

**Relax the constraint to unblock; remove the column to close it** (`U1.2.44.3`). The first is reversible and immediate. The second is one-way and requires knowing what reads it.

### U3.2.11 — Failure is visible, never plausible
`RATIFIED` · **governed by `U1.2.13`**

Applied here: when the persistence layer is unreachable or returns nothing, the system returns an error. It never substitutes fabricated or sample rows.

---

## Not in this pass

`.1` State · `.3` Findings · `.4` Mechanisms · `.5` Sequence · `.6` Verification — deferred to Co2+.
