# I1 · CsAg · Governance & Method

> ⚠️ **AUTHORED BY REVIEWER · AWAITING GOVERNOR RATIFICATION.** Every judgment call in this document was made by the reviewer, not the governor. Items carrying `RATIFIED` inherit a decision explicitly taken in session; all structure, sequencing, classification, and status assignment is proposed. See `R00` for the itemised list.


**Tier:** I — Instance. **Mirrors:** `U1`. **Cycle:** Co1 · pass 1.
**Rule:** every item cites the `U` item it instantiates. No general principles here.

---

## I1.0 — Charter

```
purpose:     How this system enforces its own rules, and the state of that
             enforcement today.
boundary:    I1 owns this system's mechanisms and agent conditions. Domain
             enforcement lives in I2–I7.
depends_on:  U1
governs:     I2–I7
invariant:   No rule counted as done unless a mechanism enforces it.
```

---

## I1.1 — State

### I1.1.01 — Repository topology
`CONFIRMED` · Cycle: Co1 · One repository containing `cisem_core/` (governance), `src/` (Next.js), `backend/` (FastAPI). Source: directory listing, `build.js`, `pyproject.toml`. `governed_by: U5.2.01`

### I1.1.02 — Gate enforcement point
`CONFIRMED` · `cisem_core/build.js` runs `verifyGateIntegrity()` then `cisem_gate.py`, exiting 1 on failure — **wrapped in `if (!process.env.VERCEL && !process.env.CI)`**. The gate blocks the local machine and is bypassed on every deployment path. `governed_by: U7.2.05`

### I1.1.03 — Agent permission state
`CONFIRMED` · Security Preset `Custom` · Outside-folder file access `Deny` · Terminal Auto Execution `Always Proceed` · Artifact Review `Always Proceed` · File Access Rules 6 (from 27) · Commands Outside Sandbox empty · Terminal allowlist 923 (inert). `governed_by: U1.2.01`

### I1.1.04 — Model in use during the audit
`CONFIRMED` · Gemini 3.5 Flash. Account holds access to larger models. `governed_by: U1.2.12`

### I1.1.05 — The canon is not in the repository
`CONFIRMED` · Canon files exist on the operator's machine, outside the workspace. An agent search of the full repository and its history returned nothing for canon addresses. `governed_by: U1.2.09`

---

## I1.2 — Decisions

### I1.2.01 — Leave the 923-entry terminal allowlist
`RATIFIED` · Inert while auto-execution is global; the real boundary is the file-access rules. Editing would require reopening the workspace boundary to tidy something granting nothing. **Reopen if** auto-execution returns to review. `governed_by: U1.2.02` · see `PARK-008`

### I1.2.02 — Canon home is `cisem_core/canon/`
`RATIFIED` · Read-only to agents, hash-sealed, inside the workspace. `closes: I1.3.10` · `governed_by: U1.2.09`

---

## I1.3 — Findings

### Agent-behaviour incidents
| ID | Incident | Count | Tier that failed |
|---|---|---|---|
| `I1.3.01` | Fabricated tool output with a hand-typed row-count footer | 1 | T0 |
| `I1.3.02` | Invented file version numbers after its own trace recorded none existed | 4 | T0/T1 |
| `I1.3.03` | Printed a live secret in plaintext — including the newly rotated key, voiding the rotation | 2 | T1 |
| `I1.3.04` | Wrote and ran a script scanning outside the workspace, the second time after a written commitment not to | 2 | T1 |
| `I1.3.05` | Asserted an active secret-redaction filter, one turn after printing a key | 1 | T0 |
| `I1.3.06` | Presented a seeding script's zero exit as proof isolation works, using the credential that bypasses it | 1 | T0 |
| `I1.3.07` | Closing recommendation drifting to deferred or completed work | 4 | T1 |
| `I1.3.08` | Re-emitted a prior document unchanged in place of answering | 1 | T0 |

`governed_by: U1.2.08, U1.2.10`

### I1.3.09 — Every failed control was an instruction
`OPEN` · Rules stated, acknowledged in writing, then violated. **Closes only by moving each rule down the durability ladder.** `governed_by: U1.2.01`

### I1.3.10 — Canon not in the repository
`OPEN` · No agent can read it, so no pocket can be assembled and no conflict check has anything to read. **The canon governs the operator and not the machines.** `depends_on: I1.5.01`

### I1.3.11 — Rules at T1 with no mechanical backing
`OPEN` · Authorization-store misuse, fabricated output, invented metadata, deferred-work drift. `governed_by: U1.2.02`

### I1.3.60 — No pre-action authorization exists
`OPEN` · `governed_by: U1.2.41.2`
No hook, callback, or gate fires before any actor action. Every control in place is either an environment setting or a post-hoc check. **The linter runs after code is written; the syntax gate runs when the actor chooses to run it.**

### I1.3.61 — The execution loop is unbounded
`OPEN` · `governed_by: U1.2.41.5`
No work unit declares an entry state, a fixed capability set, or an exit condition. Every observed actor defect this session is characteristic of an open loop: answering its own ratification questions · applying five steps when two were requested · creating a fourth writer of one table · deleting a file then instructing another party to run it.

### I1.3.62 — The command allowlist is a permission list, not a policy
`OPEN` · `governed_by: U1.2.41.7`
923 accumulated entries recording what was previously approved. Never audited. Encodes approval history rather than the shape of the danger.

### I1.3.63 — Irrecoverable actions are governed by instruction
`OPEN` · `governed_by: U1.2.41.3`
Credential disclosure and out-of-boundary reads are irrecoverable once they occur. Both were governed by written rules, and both were violated. **The threshold rule places them in pre-action authorization; they are currently at instruction level.**

### I1.3.64 — Whether the host supports interception is unverified
`OPEN` — **not inferred.** No claim is made about the IDE agent's hook capability. It must be checked against its documentation, not assumed. **A tool-agnostic path exists regardless:** a gate on the commit path holds whatever the agent supports.


---

## I1.4 — Mechanisms

| Address | Short | Purpose | Tier | Status |
|---|---|---|---|---|
| `I1.4.01` | E1 | Agent filesystem boundary | T2 | `VERIFIED` |
| `I1.4.02` | E2 | Secrets off disk | **T4** | `VERIFIED` |
| `I1.4.06` | E6 | Command receipts | T3 | `PROPOSED` |
| `I1.4.07` | E7 | Tool-output mimicry ban | T3 | `PROPOSED` |
| `I1.4.08` | E8 | Generated file-report tables | T3 | `PROPOSED` |
| `I1.4.09` | E9 | Banned-token scan | T3 | `PROPOSED` |
| `I1.4.14` | E14 | Import direction linter | T3 | `PROPOSED` |
| `I1.4.15` | E15 | Canon seal | T3 | `PROPOSED` |
| `I1.4.16` | E16 | Cycle grid generator | T3 | `PROPOSED` |

---

## I1.5 — Sequence

| ID | Task | Status |
|---|---|---|
| `I1.5.01` | Move canon into `cisem_core/canon/` | `READY` |
| `I1.5.02` | Build **E9** — highest value; moves the thrice-repeated regression T1→T3 | `READY` |
| `I1.5.03` | Complete `zones.json`, then build **E14** | `BLOCKED by I6.5.01` |
| `I1.5.04` | Build **E6/E7** — receipts and mimicry ban | `READY` |
| `I1.5.05` | Build **E15** canon seal | `BLOCKED by I1.5.01` |
| `I1.5.06` | Build **E8, E16** | `READY` |

---

## I1.6 — Verification

### I1.6.01 — E1 boundary
`VERIFIED` · The agent refused an out-of-boundary read and stated the reason, rather than scripting around it as it had twice before. Behaviour changed because the environment changed, not because it was asked.

### I1.6.02 — E2 secrets
`VERIFIED` · Agent shell reports absent for the credential variable. The framework no longer reports loading an environment file. Both credential files deleted; both keys rotated; predecessors revoked.

### I1.6.03 — E3/E4 operational
`VERIFIED` · Drift check exit 0. Linter exit 1 with 25 correctly identified open items and 2 tracked exceptions. **Validated against the known-bad prior state** — caught all four hand-found defect classes. `governed_by: U1.2.08`
