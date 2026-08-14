# CISEM Canon — G · Operations & Cadence

**Address:** `G` · **Depends on:** A · **Serves:** all spines
**Addressing scheme:** `A.0`
**Status:** Draft for GOVERNOR ratification

---

## G.0 — Charter

### G.0.1 — Roles and authority
`RATIFIED 2026-08-12`

| Role | Who | Authority | Never does |
|---|---|---|---|
| **GOVERNOR** | Yariv | Ratifies. Sole authority over database, credentials, deployment, settings. Runs all servers. | Delegates credential handling to any agent |
| **ANTIGRAVITY** | IDE agent | Writes and edits code in the workspace. Reads project files. Runs sandboxed commands. | Touches the database, holds credentials, starts servers, acts outside the workspace |
| **REVIEWER** | External model | Reviews plans, migrations, and code before they land. | Executes anything against live systems |

**Authority is not transferable by convenience.** If a task appears to require ANTIGRAVITY to reach the database or hold a secret, the task is scoped wrong — the rule does not bend.

### G.0.2 — The work cycle
`RATIFIED 2026-08-12` · Six steps, every change, every lane.

| Step | What |
|---|---|
| **1 CLASSIFY** | Which lane, which tables, which files, which tenants. If unanswerable, not ready to plan. |
| **2 PLAN** | Goal, blast radius, what could break, **and how it will be verified**. A plan with no stated verification is not a plan. |
| **3 GATE** | L0/L1: REVIEWER reviews artifacts before execution; GOVERNOR ratifies. L2: gate pass. |
| **4 BUILD** | ANTIGRAVITY writes code. GOVERNOR executes anything touching database, credentials, or deployment. |
| **5 VERIFY** | Per `G.6.01`. Not done until the system reports the intended state. |
| **6 RECORD** | Snapshot committed. Ledger entry. Parked items filed. Canon items addressed. |

**Mapping to the core spiral:** steps 1–2 write canon stage `.1` and `.5`; step 3 writes `.2`; step 5 writes `.6`; step 6 updates `.3` statuses. The work cycle and the canon stages are the same loop viewed from two sides.

---

## G.1 — State

### G.1.01 — Current cadence
`CONFIRMED` · Ad hoc. The gate enforces a turn ceiling (Phase 0, floor 3 / ceiling 15) requiring `CisemAuditor.py` then `CisemATV.py` to reset. Currently blocking `npm run dev` at turn 15.

### G.1.02 — Verification practice as of this session
`CONFIRMED` · E3 + E4 run manually from `run-security-checks.ps1`. Not in CI — deliberately, since CI credentials would reopen the secrets question just closed (`A.4.10`).

---

## G.2 — Decision

### G.2.01 — Three lanes, classified by blast radius
`PROPOSED`

**Plain:** How carefully a change is reviewed depends on how many customers it could break, not on how urgent it feels.

| Lane | Contains | Blast radius | Bar |
|---|---|---|---|
| **L0** | `cisem_core/`, gate, registries, security tooling, **the canon** | The system's ability to check itself | Full review + REVIEWER sign-off + gate pass. Never combined with L1 or L2 in one change. |
| **L1** | Spines B, C, D — identity, tenancy, data, entitlement, auth, secrets | Every tenant simultaneously | Plan → REVIEWER → GOVERNOR ratification → verified migration → E3/E4 clean |
| **L2** | Spines E, F — vertical, product, tenant-facing UI | One vertical, recoverable | Normal velocity. Gate pass + E4 clean. No per-change ratification. |

**Cross-lane rule:** a single change never spans two lanes. If it must, it is two changes with two records.

**Precedent note:** `A.2.10` rejected an earlier "Dual-Lane" model framed around *velocity*, which solved a bottleneck that did not exist. This model is framed around *blast radius*, which is measurable. L2 moves fast because its failures are contained, not because governance is inconvenient.

### G.2.02 — Manual invocation for security checks, not CI
`RATIFIED 2026-08-12` · **Reason:** CI would need credentials, reopening `A.4.10`. Revisit when a proper secrets store exists. **Note:** this is separate from `A.4.10`/E10, which inverts the *gate* bypass — that one does need to happen.

---

## G.3 — Finding

| ID | Finding | Status |
|---|---|---|
| `G.3.01` | Lane classification requires opening files, because zones are not declared (`F.1.01`) | `OPEN` → `A.5.01` |
| `G.3.02` | The gate blocks the local machine and is bypassed on every deployment path | `OPEN` → `A.4.10` |
| `G.3.03` | No record of which migrations have been applied | `OPEN` → `A.4.11` |
| `G.3.04` | Park list exists in conversation only, not as a scanned file | `OPEN` → `A.4.12` |
| `G.3.05` | The gate's turn-ceiling audit is currently blocking `npm run dev` and has not been run | `OPEN` |

---

## G.4 — Mechanism

| ID | Mechanism | Tier | Status |
|---|---|---|---|
| `G.4.01` | Gate blocks on turn ceiling | T3 | ✅ local only |
| `G.4.02` | `A.4.10` (E10) — gate mandatory in CI | T3 | ⬜ |
| `G.4.03` | `A.4.11` (E11) — migration ledger | T3 | ⬜ |
| `G.4.04` | `A.4.12` (E12) — park-list scan | T3 | ⬜ |
| `G.4.05` | `A.4.15` (E15) — canon seal | T3 | ⬜ |

---

## G.5 — Sequence

### G.5.01 — Cadence
`RATIFIED 2026-08-12`

| When | What |
|---|---|
| Every change | E3 + E4 |
| Every session start | E3 — catches out-of-band database edits |
| Weekly | E5 two-tenant isolation test (once it exists) |
| Monthly | Review the E4 KNOWN list — each entry is an open item, not a permanent exemption |
| Quarterly | Audit the durability table `A.0.10` — has any rule slipped up a tier? |

### G.5.02 — Immediate
| ID | Task |
|---|---|
| `G.5.10` | Run `CisemAuditor.py` then `CisemATV.py` to clear the turn-ceiling block (`G.3.05`) |
| `G.5.11` | Create `PARKED.md` as a real file so `A.4.12` has something to scan |

---

## G.6 — Verification

### G.6.01 — Verification doctrine
`RATIFIED 2026-08-12` · Each rule written after a specific failure this session.

| Rule | The failure it prevents |
|---|---|
| **A success message is not evidence** | The migration reported "Success. No rows returned" while applying 2 of 12 statements (`C.3.10`) |
| **Written is not applied** | Repo SQL documented a fraction of the live schema; the migration file existed three turns before running (`C.1.04`) |
| **Exit 0 is not correctness** | `seed_db.py` exit 0 presented as proof RLS worked, while using the key that bypasses RLS (`A.3.35`) |
| **A summary is not a source** | "No backend exists" asserted from the Zustand stores without opening `backend/` (`A.3.01`) |
| **An agent's account of itself is not evidence** | A terminal redaction filter described as active, one turn after a key was printed (`A.3.34`) |
| **Count, don't read** | Six identical CSV uploads before a row count revealed partial application |
| **Verify from the system, in a form the agent did not author** | Fabricated `psql` output with a hand-typed `(4 rows)` footer (`A.3.30`) |

### G.6.02 — Definition of done
`RATIFIED 2026-08-12` · A change is done when **all** hold. Not most.

- [ ] The plan stated the verification method **before** the work began
- [ ] The system reports the intended state, in output the agent did not author
- [ ] E3 exit 0
- [ ] E4 exit 0, or new entries are in the tracked KNOWN list with a written reason
- [ ] The snapshot is updated and committed
- [ ] Parked items raised during the work are filed, not left in chat
- [ ] No secret appears in the diff, the logs, or the conversation
- [ ] Canon items created or status-changed, with addresses

### G.6.03 — Evidence by change type
| Change | Evidence |
|---|---|
| RLS / schema | E3 exit 0 + E4 exit 0 + per-table policy count |
| Tenant isolation | E5 green — the only proof of the wall |
| Auth / middleware | A real token verified **and** a forged token rejected |
| Secrets | Agent shell reports `ABSENT`; app starts from launcher only |
| Frontend | Rendered behaviour, not a passing build |
| Any migration | Ledger entry + E3 clean, never the editor's banner |
