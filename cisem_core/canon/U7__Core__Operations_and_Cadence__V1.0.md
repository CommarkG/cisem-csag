# U7 · Core · Operations & Cadence

**Tier:** U — Universal. **Cycle:** Co1 · pass 1 · Charter and Decision stages only.

---

## U7.0 — Charter

```
purpose:     How work is authorised, sequenced, run, deployed, and observed.
boundary:    U7 owns who runs a check, when, and under what authority.
             U1 owns what counts as evidence. The two meet at the definition
             of done and must not contradict.
depends_on:  U1
governs:     U2, U3, U4, U5, U6
invariant:   Authority is not transferable by convenience. If a task appears
             to require crossing an authority boundary, the task is scoped
             wrong.
```

---

## U7.2 — Decisions

### U7.2.01 — Three roles
`RATIFIED`

| Role | Authority | Never does |
|---|---|---|
| **Ratifier** | Approves. Sole authority over the persistence layer, credentials, deployment, and configuration. Runs production processes. | Delegates credential handling |
| **Builder** | Writes and edits code within the declared boundary | Touches the persistence layer, holds credentials, or acts outside the boundary |
| **Reviewer** | Reviews plans, changes, and artifacts before they land | Executes against live systems |

**Authority is not transferable by convenience.** A task that seems to require the builder to reach the persistence layer or hold a credential is scoped wrong. The rule does not bend for urgency.

### U7.2.02 — Lanes by blast radius
`RATIFIED`

How carefully a change is reviewed depends on **how many parties it can break**, not on how urgent it feels or how tedious the review is.

| Lane | Scope | Bar |
|---|---|---|
| **Governance** | The system's ability to check itself | Full review, reviewer sign-off, never combined with another lane in one change |
| **Core** | Every scope simultaneously | Plan → review → ratification → verified change → checks clean |
| **Product** | One domain, recoverable | Normal velocity, checks clean, no per-change ratification |

**A single change never spans two lanes.** If it must, it is two changes with two records.

**Rejected: lanes defined by desired velocity.** Velocity is a preference; blast radius is a property. A model built on preference becomes a negotiation.

### U7.2.03 — The work cycle
`RATIFIED`

| Step | |
|---|---|
| **1 Classify** | Which lane, which entities, which parties. Unanswerable means not ready to plan. |
| **2 Plan** | Goal, blast radius, what could break, **and how it will be verified**. A plan without a stated verification is not a plan. |
| **3 Gate** | Review and ratification proportional to lane |
| **4 Build** | Builder writes; ratifier executes anything touching persistence, credentials, or deployment |
| **5 Verify** | Per `U1.2.08`. Not done until the system reports the intended state. |
| **6 Record** | State captured, ledger updated, deferred items filed, items addressed |

### U7.2.04 — Definition of done
`RATIFIED`

A change is done when **all** hold. Not most.

- [ ] The verification method was stated before the work began
- [ ] The system reports the intended state, in output the builder did not author
- [ ] Continuous checks pass, or new exceptions are tracked with a written reason
- [ ] The recorded expectation is updated
- [ ] Items deferred during the work are filed, not left in conversation
- [ ] No credential appears in the change, the logs, or the conversation
- [ ] Records created or status-changed, with addresses

### U7.2.05 — Checks run on what ships
`RATIFIED`

A gate that runs only in the development environment protects the development environment. If it is bypassed on the path that reaches users, it enforces nothing where it matters.

**Mandatory on the deployment path; optional locally** — the reverse of the common arrangement, and the reverse of what is convenient.

### U7.2.06 — Environment separation
`RATIFIED`

Development, staging, and production are separated by **credentials and data**, not by intent. A development process able to reach production data has no separation regardless of what it is called.

Each environment carries its own credentials, its own data, and its own configuration. Sample data never enters production; production data never leaves it.

### U7.2.07 — Observability precedes multi-party operation
`RATIFIED`

Before a system serves parties other than its builder, it must be able to answer three questions: **is it working · for whom is it failing · since when.**

**Why this rule is unlike every other in these documents.** Every other decision here came from a failure that was found and named. This one has none, and that is the argument for it: **the absence of observability is silent by construction.** A missing isolation rule produces a finding. Missing logging produces nothing — no error, no alert, no gap in any report. It surfaces only on the day it is needed and is not there, by which point the event it was needed for has already passed unrecorded.

**Multi-party operation makes it worse.** A failure affecting one scope is invisible in aggregate. The system looks healthy because most requests succeed — and the remainder is one party for whom nothing works.

**Without it, failure is discovered by report.** The affected party knows before the operator, and the operator learns it from someone holding no diagnostic information.

**The minimum, and what each answers:**

| | Answers |
|---|---|
| Request and error logs, **attributable to a scope** | *For whom?* Without scope attribution the log is noise |
| A health signal, polled externally | *Is it up?* Learned from a monitor, not from a customer |
| An alert on failure rate | *Since when?* A threshold that raises before a report does |
| Error records with reproduction context | *What happened?* A trace with request context, not a status code |

**When:** the day before the first external party, never after. Retrofitting cannot recover anything that happened before it was added — including the incident that prompted it.

**The cost, stated honestly:** logs become a new place credentials can leak and a new store of party data. Scope attribution means recording scope identifiers, which is precisely what would need redacting if logs ever leave the operator's control. This is a real cost against a real benefit, and it is why *log everything* is the wrong instinct. Log what answers the three questions; redact the rest.


### U7.2.10 — Audit cadence, distinct from check cadence
`PROPOSED · REVIEWER-AUTHORED · see R00.9`

Checks run per change. **Audits run on a schedule, because the defects they find are not caused by any single change.**

| Audit | Compares | When |
|---|---|---|
| Cross-artifact consistency | Every artifact against every other — duplicate law, competing schemes, superseded citations | each cycle exit, and periodically |
| Tier integrity | Whether any artifact holds content belonging to another tier | each cycle exit |
| Durability drift | Whether any rule has slipped upward on the ladder | periodically |
| Reference liveness | Whether any citation points at something superseded or absent | each cycle exit |
| Coverage mirror | Whether every law has an application and every application a law | each cycle exit |

**An audit that never fails is not running.** A clean audit on its first execution means it is checking something that cannot vary.


### U7.2.11 — A mechanism is not running unless its absence is reported
`PROPOSED · REVIEWER-AUTHORED · see R00.29`

> **An enforcement mechanism with no supervision stops the first time its environment is interrupted, and nothing reports the silence. Its last recorded state says "running" indefinitely.**

### U7.2.11.1 — Liveness is a separate property from correctness
A mechanism can be correct, tested, proven against known-bad input — **and not running.** No amount of correctness detects absence.

**The most common cause is not failure. It is interruption:** a terminal closed, a session ended, a machine restarted. **A mechanism whose lifetime is bound to a window is bound to that window's accidents.**

### U7.2.11.2 — The three obligations
| | |
|---|---|
| **Heartbeat** | The mechanism records that it is alive, on a cadence |
| **Watcher** | Something independent checks the heartbeat is recent |
| **Restart** | Absence produces a restart or an alert, never silence |

**A heartbeat with no watcher is a record nobody reads.** The state file will say *running* for as long as it exists — the last thing a dead process wrote.

### U7.2.11.3 — Self-reported state is the least reliable state
A process cannot report its own death. **Whatever it wrote last is what it will appear to be, forever.** This is `U1.2.42` at the operational layer: the artifact asserts a property it no longer has, and the assertion outlives the fact.

**Liveness is therefore established from outside** — process existence, heartbeat age, an external probe — never from what the thing says about itself.

### U7.2.11.4 — A component's failure is the loop's failure
An orchestrator that runs several components and continues past a failure reports success for a partially-executed loop.

**Three conditions, all required:**
1. A component's non-zero exit **fails the loop**, or is explicitly permitted with a recorded reason
2. The error output is **captured and retained** — an empty error message is worse than no message, because it looks like a handled case
3. **Repeated identical failures escalate.** The same component failing every run is not a flaky step; it is a dead one, and its deadness is invisible while the loop reports success

### U7.2.11.5 — Bind lifetime to the system, not to a session
A mechanism intended to run continuously is started by something that outlives a person's terminal — a service, a scheduled task, a supervisor. **Where that is not possible, its liveness check is the compensating control**, and the check is mandatory rather than optional.

### U7.2.08 — Cadence
`RATIFIED`

| When | What |
|---|---|
| Every change | The continuous checks |
| Every session start | The drift check — catches out-of-band change |
| Regularly | The isolation test — the only proof of the boundary |
| Periodically | Review tracked exceptions; each is an open item, not a permanent exemption |
| Periodically | Audit the durability tiers — has any rule slipped upward? |

### U7.2.09 — Deferred items are recorded with a condition
`RATIFIED`

An item is deferred only with a **reason** and an **unblocking condition**. "Later" is not a condition.

Deferred items live in a machine-readable record, scanned automatically, so that proposing deferred work fails rather than depending on someone remembering.

*origin: a deferral written into a record and then contradicted, by its own author, in the following turn — because nothing mechanical read the record.*

---

## Not in this pass

`.1` State · `.3` Findings · `.4` Mechanisms · `.5` Sequence · `.6` Verification — deferred to Co2+.
