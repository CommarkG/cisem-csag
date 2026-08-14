# U6 · Core · Surface & Experience

**Tier:** U — Universal. **Cycle:** Co1 · pass 1 · Charter and Decision stages only.

---

## U6.0 — Charter

```
purpose:     What the user sees and touches: where state lives, how the
             surface obtains identity, and what a surface must answer before
             the user has to ask.
boundary:    U6 owns the client. Enforcement of anything it displays belongs
             to U2, U3, and U4. A surface may reflect a rule; it never is one.
depends_on:  U1, U2, U3, U4, U5
governs:     —
invariant:   The client renders and requests. It never decides, and it never
             invents.
```

---

## U6.2 — Decisions

### U6.2.01 — The server is truth; client state is a cache
`RATIFIED`

| State kind | Location | Test |
|---|---|---|
| Scope data | Server, isolation-enforced | Would the user expect it on another device? |
| Session | The identity provider's client | — |
| Preference | Client storage, per-device, never authoritative | Is it safe to lose entirely? |
| Ephemeral | In-memory only | Does it survive a refresh? It should not. |

**The rule:** anything a user would expect to persist across devices is server state. Anything in client storage must be safe to lose completely, because eventually it will be.

### U6.2.02 — The client never makes an authorization decision
`RATIFIED` · **governed by `U1.2.14`**

Applied here: the client may read identity and entitlement **for display**, and may hide a control the caller cannot use. It never gates access on its own reading.

### U6.2.03 — Fail visibly, never plausibly
`RATIFIED` · **governed by `U1.2.13`**

Applied here: when the server is unreachable or returns nothing, the surface shows an error or an empty state. It never falls back to sample, mock, or borrowed data.

### U6.2.04 — One data-access layer
`RATIFIED`

All scope data flows through a single access layer. Components do not issue requests directly.

**What this buys:** scope enforcement is auditable in one place · the real/fallback boundary is one switch rather than scattered conditionals · loading and error states are consistent, which every feedback guarantee depends on · automated checks have one file to inspect rather than every component.

### U6.2.05 — Three designed states
`RATIFIED`

Every surface designs **loading**, **empty**, and **error**. A surface with only a success state has three undesigned states that will occur anyway, and whatever appears in them was chosen by accident.

### U6.2.06 — A surface answers before the user asks
`RATIFIED`

At any point, a user is silently asking a small set of questions. A surface that leaves them unanswered has failed regardless of how many capabilities it offers.

| The user is asking | The surface must show |
|---|---|
| Where am I | Location and context, without inference |
| Why does this matter to me | The value of being here |
| What process am I in | The containing flow |
| How far along am I | Stage and remaining steps |
| What are my options | Choices, **with the recommended one marked and explained** |
| What happens if I act | The consequence, before it occurs |
| What now that I am done | Next options, with a recommendation |
| Did my action register | Immediate acknowledgement |

**A pile of correct capabilities is not a design.** A surface that leaves any of these unanswered fails, whatever else it does well.

### U6.2.07 — Integrity of presentation
`RATIFIED`

| Law | Meaning |
|---|---|
| **No distortion** | Content renders in its true proportions |
| **No unmotivated duplication** | The same information does not appear twice without a reason |
| **Order by current need** | Arrangement follows what the user needs now, not what is most measured |

### U6.2.08 — Structure is checkable; judgment is not
`RATIFIED`

Design standards divide into what an automated check can assert and what requires a reviewer. **The division must be stated, and the automated check must declare its own limits.**

A check that claims to verify judgment produces a passing result meaning nothing — the same failure class as any fabricated verification. It is worse than no check, because it carries authority.

Automate the structural half. Route the judgment half to a reviewer, and record the review.


### U6.2.09 — Governance is a surface
`PROPOSED · REVIEWER-AUTHORED · see R00.13`

> **Every definition that governs the system is visible in the system's own administrative interface. Without exception.**

A definition existing only in a document, a repository, or a conversation is a definition its operator must **remember where to find**. That is working-set load imposed on a person, and it fails the same way it fails for any actor — except a person cannot be re-prompted, and a chased definition is one that eventually stops being chased.

### U6.2.09.1 — Visible is mandatory; editable is not
The demand is that the definition **can be read in the running system**, at its address, with its current value.

Whether it can be *changed* there is a separate decision per element. This distinction is what makes "no exceptions" achievable: a read-only surface over an existing record is inexpensive, so no element is exempt on cost grounds.

### U6.2.09.2 — What every surfaced definition shows
| Field | |
|---|---|
| **Address** | Its canonical identifier — the surface is also the navigation into the canon |
| **Statement** | The definition itself, in the plain-language form (`U0A`) |
| **Status** | From its stage's vocabulary |
| **Tier** | Where it sits on the durability ladder |
| **Enforced by** | The mechanism, or explicitly *nothing* |
| **Source** | Where the current value was read from |
| **Last verified** | When, and with what result |

**"Enforced by: nothing" must be displayable.** A system that can only show enforced rules hides its own weaknesses, which is the failure this law exists to prevent.

### U6.2.09.3 — The mandatory operator surfaces
Every one, no exceptions.

| # | Surface | Shows |
|---|---|---|
| 1 | **Canon** | Every governing item, by address, searchable, with its status and tier |
| 2 | **Durability ladder** | Every rule and the tier it occupies; anything at the two weakest tiers flagged as a known weakness |
| 3 | **Mechanisms** | What exists, what each checks, last run, last result, and whether it has ever failed |
| 4 | **Invariant suite** | The cumulative set, pass or fail, per item |
| 5 | **Findings** | Open, closed, known, deferred — by topic |
| 6 | **Deferral register** | Every deferred item with its reason and unblocking condition |
| 7 | **Rejected register** | Everything decided against, with the reason — permanently |
| 8 | **Corrections** | Every recorded error and what superseded it |
| 9 | **Cycle state** | Current pass, per-element state, escalations |
| 10 | **Loops** | Each loop's last run and current backlog |
| 11 | **Sequence** | What is ready, what is blocked, and by what |
| 12 | **Zones** | The dependency map and any violation |
| 13 | **Entitlement model** | Every tier, what it grants, and its version |
| 14 | **Template lifecycle** | Versions, the customisation boundary, sunset dates, adoption by scope |
| 15 | **Audit results** | Each audit, its cadence, last run, findings |
| 16 | **Environments and health** | Which environments exist, their separation, current health |

### U6.2.09.4 — The mandatory scope-facing surfaces
A scope sees the definitions that govern **it**, on the same terms.

| # | Surface | Shows |
|---|---|---|
| 1 | **Entitlement** | What this scope's plan grants, at what version, and what a change would alter |
| 2 | **Template state** | Current version, whether an update is available, what it changes, and the rollback point |
| 3 | **Members and roles** | Every member, their role, and what that role permits |
| 4 | **Limits** | Any quota, current consumption, and behaviour at the limit |
| 5 | **Lifecycle notice** | Sunset dates affecting them, with lead time |

**A scope may not be governed by a rule it cannot read.** A limit discovered by hitting it, or a change discovered by breakage, is a definition that was hidden.

### U6.2.09.5 — No exceptions, and how that is enforced
A governing definition with no surface is a **finding**, not an accepted state.

The audit is a coverage mirror in both directions: every canon item has a surface, and every surface displays a canon item. A surface showing something that is not in the canon is an undeclared rule — the more dangerous of the two.

### U6.2.09.6 — Why this is not documentation
Documentation describes what the system does. **These surfaces read the system's actual state** — the live mechanism result, the live tier, the live invariant outcome.

A surface rendering a written description rather than a live value has reproduced the problem in a new location: something that can drift from the truth while looking authoritative.


### U6.2.10 — Journeys are defined; surfaces serve them
`PROPOSED · REVIEWER-AUTHORED · see R00.14`

> **A named surface is not a design. A journey is defined before the surfaces that serve it, and every surface exists because a journey needs it.**

Listing surfaces produces navigable dead ends: each is reachable, none is a task. **Nobody's work is "read a register."** Work is a question, and answering one question routinely spans several registers.

### U6.2.10.1 — Registers are data; journeys are the interface
| | Is | Ordered by |
|---|---|---|
| **Register** | A complete, addressed set of records | Its own structure |
| **Journey** | A question a person needs answered | **Frequency and urgency of the question** |

Ordering the interface by register structure rather than by need violates `U6.2.07` L3. A canon-ordered menu is the author's convenience presented as navigation.

### U6.2.10.2 — Every flow carries seven fields, defined before it is built
`RATIFIED-PENDING`

| Field | |
|---|---|
| **Trigger** | What causes a person to begin. If none can be named, the flow has no occasion. |
| **Intent** | What they are trying to achieve, in their words, never as a mechanism |
| **Entry** | Where they land, and how they arrive there |
| **Steps** | The ordered acts, each answering the eight questions of `U6.2.06` |
| **Exit** | The state they leave in, and where they go next |
| **Goal** | The outcome the flow exists to produce |
| **Measurable result** | Per `U1.2.35` — metric, baseline, target, owner, cadence, evidence source |

**A flow missing any field is not specified, and building it means an actor invents the missing part.** Invented parts are inconsistent between flows by construction, because nothing coordinates the inventions.

### U6.2.10.3 — Relationships are traversable
Records reference each other — a finding cites a mechanism, which checks an invariant, which was verified by a result. **That chain is navigation, not metadata.**

A surface displaying an address that cannot be followed has shown the person where the answer lives and left them to fetch it — which is the chase this whole requirement exists to end.

### U6.2.10.4 — Density is designed at final scale, not initial scale
A register holding a dozen records and one holding several hundred are different design problems. **Design for the larger.**

At scale, a complete list is not a surface — it is an export. What a person needs is what is **currently relevant**, with the complete set reachable but not primary.

### U6.2.10.5 — Roles see different journeys
The operator's questions, the builder's questions, and the depending party's questions are different sets. **One interface serving all three by showing everything to everyone serves none of them.**

Each role's journeys are defined separately, from that role's actual work.

---

## Not in this pass

`.1` State · `.3` Findings · `.4` Mechanisms · `.5` Sequence · `.6` Verification — deferred to Co2+.
