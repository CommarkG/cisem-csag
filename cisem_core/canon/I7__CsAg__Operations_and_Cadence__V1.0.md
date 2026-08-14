# I7 · CsAg · Operations & Cadence

> ⚠️ **AUTHORED BY REVIEWER · AWAITING GOVERNOR RATIFICATION.** Every judgment call in this document was made by the reviewer, not the governor. Items carrying `RATIFIED` inherit a decision explicitly taken in session; all structure, sequencing, classification, and status assignment is proposed. See `R00` for the itemised list.


**Tier:** I — Instance. **Mirrors:** `U7`. **Cycle:** Co1 · pass 1.

---

## I7.0 — Charter

```
purpose:     How work on CISEM CsAg is authorised, sequenced, run, deployed,
             and observed.
boundary:    I7 holds who does what here and when checks run. U1 holds what
             counts as evidence.
depends_on:  U7, I1
governs:     I2–I6
invariant:   governed_by U7.0 — authority is not transferable by convenience.
```

---

## I7.1 — State

### I7.1.01 — Roles as they operate today
`CONFIRMED`

| Role | Here | Constraint |
|---|---|---|
| **GOVERNOR** | Yariv | Sole authority over the database, credentials, deployment, and settings. Starts all servers. |
| **ANTIGRAVITY** | IDE agent | Writes code in the workspace. **Cannot reach the database** — no credentials, and its client cannot execute schema changes. Confirmed by the agent itself. |
| **REVIEWER** | External model | Reviews before landing. No execution authority. |

### I7.1.02 — The gate blocks locally and is bypassed on deployment
`CONFIRMED` · Also currently blocking the frontend build at a turn ceiling requiring an audit run to reset. · `governed_by: U7.2.05`

### I7.1.03 — Security checks run manually
`CONFIRMED` · Drift and linter run from a launcher outside the repository. Deliberately not in CI — CI credentials would reopen the secrets question just closed. · `governed_by: U7.2.06`

### I7.1.04 — Servers are started by the ratifier
`CONFIRMED` · Credentials live in launcher scripts outside the workspace. The agent's shell has none, verified. · `governed_by: U7.2.01`

### I7.1.05 — No observability
`CONFIRMED by absence` · No scope-attributed logging, no health signal, no failure-rate alert, no error records. · `governed_by: U7.2.07`

### I7.1.06 — No environment separation
`INFERRED` · One database project. No staging. Sample data was seeded into it during this session. · `governed_by: U7.2.06`

---

## I7.2 — Decisions

### I7.2.01 — Three lanes by blast radius
`RATIFIED` · `governed_by: U7.2.02`

| Lane | Here | Bar |
|---|---|---|
| Governance | `cisem_core/`, gate, registries, security tooling, **the canon** | Full review, reviewer sign-off, never combined with another lane |
| Core | `I2`, `I3`, `I4` — identity, data, entitlement, secrets | Plan → review → ratification → verified change → checks clean |
| Product | `I5`, `I6` — vertical and tenant-facing UI | Normal velocity, checks clean, no per-change ratification |

**Precedent:** an earlier model framed by velocity was rejected — it addressed a bottleneck that did not exist here, given `I7.1.02`.

### I7.2.02 — Manual invocation for security checks, not CI
`RATIFIED` · Revisit when a secrets store exists. **Separate from E10**, which inverts the *gate* bypass and does need to happen. · `governed_by: U7.2.06`

### I7.2.03 — The agent never starts servers or touches the database
`RATIFIED` · `governed_by: U7.2.01`

---

## I7.3 — Findings

| Address | Finding | Status | Governed by |
|---|---|---|---|
| `I7.3.01` | Lane classification requires opening files, because zones are not declared | `OPEN` → `I6.5.01` | `U7.2.02` |
| `I7.3.02` | The gate is bypassed on the deployment path | `OPEN` → `I1.4.10` | `U7.2.05` |
| `I7.3.03` | No record of which changes have been applied | `OPEN` → `I3.4.11` | `U3.2.10` |
| `I7.3.04` | The deferral register is not scanned by anything | `OPEN` → `I1.4.12` | `U7.2.09` |
| `I7.3.05` | The gate's turn ceiling is currently blocking the frontend build | `OPEN` → `I7.5.10` | — |
| `I7.3.06` | **No observability of any kind** | `OPEN` → `I7.5.02` | `U7.2.07` |
| `I7.3.07` | **No environment separation** — one project, sample data seeded into it | `OPEN` → `I7.5.03` | `U7.2.06` |

**`I7.3.06` and `I7.3.07` were absent from every prior review of this system.** Both are silent by construction — neither produces a finding until it is expensive.

---

## I7.4 — Mechanisms

| Address | Short | Mechanism | Tier | Status |
|---|---|---|---|---|
| `I7.4.01` | — | Gate blocks on turn ceiling | T3 | ✅ local only |
| `I7.4.10` | E10 | Gate mandatory on the deployment path | T3 | ⬜ |
| `I7.4.12` | E12 | Deferral-register scan | T3 | ⬜ |
| `I7.4.20` | — | Scope-attributed logging | T3 | ⬜ |
| `I7.4.21` | — | Health signal, externally polled | T3 | ⬜ |
| `I7.4.22` | — | Failure-rate alert | T3 | ⬜ |
| `I7.4.23` | — | Error records with reproduction context | T3 | ⬜ |

---

## I7.5 — Sequence

| Address | Task | Status |
|---|---|---|
| `I7.5.01` | Build E10 — invert the CI bypass | `READY` |
| `I7.5.02` | Build the four observability minimums | `READY` — **do before the first external party** |
| `I7.5.03` | Create a separate environment with its own credentials and data | `READY` |
| `I7.5.04` | Build E12 — scan the deferral register | `BLOCKED by I1.5.01` |
| `I7.5.10` | Run the audit sequence to clear the turn-ceiling block | `READY` |

### I7.5.20 — Cadence
`RATIFIED` · `governed_by: U7.2.08`

| When | What |
|---|---|
| Every change | Drift + linter |
| Every session start | Drift — catches out-of-band change |
| Weekly | Two-tenant isolation test, once it exists |
| Monthly | Review tracked exceptions — each is an open item, not an exemption |
| Quarterly | Audit the durability tiers — has any rule slipped upward? |

---

## I7.6 — Verification

### I7.6.01 — Definition of done
`RATIFIED` · `governed_by: U7.2.04`

- [ ] The verification method was stated before the work began
- [ ] The system reports the intended state, in output the builder did not author
- [ ] Drift exit 0
- [ ] Linter exit 0, or new entries tracked with a written reason
- [ ] The committed expectation is updated
- [ ] Items deferred during the work are filed in the register, not left in conversation
- [ ] No credential appears in the change, the logs, or the conversation
- [ ] Canon items created or status-changed, with addresses

### I7.6.02 — Evidence by change type
| Change | Evidence |
|---|---|
| Isolation / schema | Drift 0 + linter 0 + per-entity rule count |
| Tenant isolation | E5 green — the only proof |
| Auth / middleware | A real token accepted **and** a forged one rejected |
| Secrets | Agent shell reports absent; the app starts from the launcher only |
| Frontend | Rendered behaviour, not a passing build |
| Any change | Ledger entry + drift clean, never an editor's success banner |
