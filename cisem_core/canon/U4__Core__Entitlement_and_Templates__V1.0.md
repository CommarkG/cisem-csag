# U4 · Core · Entitlement & Templates

**Tier:** U — Universal. **Cycle:** Co1 · pass 1 · Charter and Decision stages only.

---

## U4.0 — Charter

```
purpose:     What a scope has purchased or been granted, and the derived
             artifacts a scope receives from a shared library.
boundary:    U4 owns entitlement — capability beyond isolation. U2 owns
             identity and role. U3 owns isolation itself. A role says who
             someone is; an entitlement says what their plan permits.
depends_on:  U1, U2, U3
governs:     U5, U6
invariant:   Entitlement is data, evaluated at the server. It is never
             compiled into the code that consumes it.
```

---

## U4.2 — Decisions

### U4.2.01 — Entitlement is data, not code
`RATIFIED`

Capability is read from a durable, machine-readable record — not from conditional expressions distributed through the codebase.

**Why the distributed form fails:** a plan change requires a code change and a deploy. Nobody can answer "what does this plan include" without reading every file. Two conditions drift out of agreement and neither is wrong on its own.

### U4.2.02 — Entitlement is separate from identity
`RATIFIED`

Identity answers *who is this and for whom do they act*. Entitlement answers *what has this scope purchased*. Two different lifecycles, two different change rates, two different authorities.

Fusing them means every plan change is an identity change, and every identity mechanism carries commercial logic it should not know about.

### U4.2.03 — Entitlement is enforced server-side
`RATIFIED` · **governed by `U1.2.14`**

Applied here: a capability check in client code hides a control the caller cannot use. Any capability that matters is enforced on the request path, independently of what the client displayed.

*origin: a capability selector in client state that enabled a restricted surface, while the server gate that should have prevented it read a forgeable source.*

### U4.2.04 — Derived copies are version-locked snapshots
`RATIFIED`

When a scope derives an artifact from a shared library, it receives a **frozen copy** carrying the source version, not a live reference.

Changes to the source do not propagate. When a newer source version is available, the scope is **notified and chooses**.

**Why not live references:** an improvement to the shared artifact silently alters work the scope has built on and possibly depends on. The scope experiences this as their work breaking for no reason they can observe.

### U4.2.05 — One authoritative store per concept
`RATIFIED`

A concept stored in two places has no authority. Every decision about it must be made twice, and the two answers diverge without anyone deciding they should.

Where duplication already exists, one store is declared authoritative and the other migrated or removed. **Declaring both authoritative is not a resolution.**

*origin: a shared library existing simultaneously as a file on disk with no access control and as a protected record in the persistence layer, with no declared relationship between them.*

### U4.2.06 — Entitlement is versioned
`RATIFIED`

The entitlement record changes as plans change, and existing scopes must not be silently re-graded by a change intended for new ones.

The record carries a version. A scope is bound to the version in effect when it was granted, until deliberately migrated.

**The failure this prevents:** a change made for new arrivals silently removes a capability an existing scope is paying for. No conversation, no notice, no record of what they originally bought.

**Why it must be built in rather than added:** retrofitting requires reconstructing which version each existing scope was granted — information that may no longer exist anywhere. The cost while building is one field and one comparison. The cost afterward is unbounded.

### U4.2.07 — Metering is designed only when the cost is measured
`RATIFIED`

Usage limits are introduced when there is a **measured** cost driver — not an assumed one. Metering an operation whose unit cost is negligible adds accounting complexity, failure modes, and a race condition, in exchange for nothing.

**Measure first:** what the operation costs, what the real constraints are (they are frequently rate limits or accumulating storage rather than per-call price), and at what volume they bind.

*origin: an elaborate metering design for an operation costing a small fraction of a currency unit per call, whose actual constraints were rate limits and storage growth — neither analysed.*


---

## U4.2.30 — Template lifecycle doctrine
`PROPOSED · REVIEWER-AUTHORED · see R00.9`

Seven decisions governing how a shared artifact changes under scopes that depend on it.

### U4.2.30.1 — The customisation boundary is declared before the first template ships
A scope's changes fall into exactly two classes, and the boundary between them is declared, not discovered.

| Class | Survives an update | Because |
|---|---|---|
| **Configuration** — settings, ordering, content, selections | **Yes**, carried across automatically | It is data referencing the artifact, not a copy of it |
| **Fork** — structural change to the artifact itself | **No**, requires manual reconciliation | It is a divergent copy |

**Everything a scope is expected to change routinely belongs in the configuration class.** A boundary drawn late, or drawn by accident, makes every subsequent upgrade expensive for both parties.

### U4.2.30.2 — Three change classes, three behaviours
| Class | Behaviour | Scope's choice |
|---|---|---|
| Correctness or security fix | Applied automatically | none |
| Additive — nothing removed, nothing re-meaning | Applied automatically | none |
| Breaking — removal, or the same shape with new meaning | Offered as a draft | full |

**Only a breaking change creates a version.** Version proliferation is a symptom of undisciplined change, not of having many scopes.

### U4.2.30.3 — Additive by default
A change is designed as additive unless it cannot be. Adding is cheap; removing and re-meaning are expensive and permanent.

**The most costly class is the same shape carrying new meaning** — it passes every structural check and breaks every consumer silently.

### U4.2.30.4 — A breaking update arrives unpublished
It lands beside the scope's live version, not over it. The scope inspects, compares, and publishes when ready. **Nothing is applied to a live scope without its act.**

### U4.2.30.5 — Exactly one previous version is retained
Publishing an update preserves the prior published state as the single rollback point. Reverting restores it.

**Exactly one, not a history.** Bounded storage, bounded complexity, bounded support surface. Anything older is a support conversation, not a product capability.

### U4.2.30.6 — Support window: N−1, with a calendar floor
When version N+1 ships, N−1 enters sunset. **No version is ever retired in under a stated minimum period**, regardless of release cadence — otherwise a fast cycle forces scopes to upgrade continuously, which is the outcome opt-in exists to prevent.

The retirement date is published as machine-readable metadata, not as an announcement.

### U4.2.30.7 — Sunset is phased, and driven by measured usage
Close to new scopes → block new adoption → retire least-used parts → retire. Each step is decided from **measured** usage, not a schedule.

**A version nobody uses can be retired early. A version many depend on may need longer.** Neither is knowable without measurement, which makes usage tracking a prerequisite for having versions at all.

---

## Not in this pass

`.1` State · `.3` Findings · `.4` Mechanisms · `.5` Sequence · `.6` Verification — deferred to Co2+.
