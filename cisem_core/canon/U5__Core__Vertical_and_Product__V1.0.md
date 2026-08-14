# U5 · Core · Vertical & Product

**Tier:** U — Universal. **Cycle:** Co1 · pass 1 · Charter and Decision stages only.

---

## U5.0 — Charter

```
purpose:     How a specific product domain attaches to a reusable core, and
             what must be true of a product before surfaces are built for it.
boundary:    U5 owns the relationship between core and vertical, and the
             conditions a product must satisfy. It does not own any particular
             product — that is tier S.
depends_on:  U1, U2, U3, U4
governs:     U6
invariant:   A vertical may depend on the core. The core never depends on a
             vertical.
```

---

## U5.2 — Decisions

### U5.2.01 — Dependency flows one way
`RATIFIED`

A vertical may import from the core. The core may never import from a vertical.

**The consequence if violated:** the core cannot be reused for a second vertical without carrying the first one along. By the time this is discovered, the entanglement is distributed across the codebase and the cost of separation exceeds the cost of rewriting.

This is the concrete, testable form of "separate the specific solution from the platform." It is enforceable by an import-direction check and is therefore T3, not a principle.

### U5.2.02 — A stated differentiator precedes surfaces
`RATIFIED`

Before surfaces are built, one sentence must exist stating why a buyer chooses this over the alternatives available to them.

**Without it:** the template taxonomy has no organising principle, the onboarding has no destination, and feature prioritisation has no ordering. Work proceeds and is technically sound and serves nothing in particular.

### U5.2.03 — Commodity capability is not a product
`RATIFIED`

A capability available free and mature from several established vendors is not a differentiator, regardless of how well it is implemented. Building it means competing on execution in a category where execution is already solved.

**The test:** if a buyer could satisfy this need this afternoon, free, from a mature product — it is table stakes at best. It may still be built as a supporting capability. It cannot be the reason anyone buys.

### U5.2.04 — Backend and frontend must serve the same product
`RATIFIED`

A persistence layer modelling one domain and an interface presenting another is two products in one repository. Neither is finished, both consume attention, and no amount of engineering quality resolves it.

**This is detectable early and cheaply:** trace whether the primary surfaces read from the primary entities. If they do not, the divergence is already present.

*origin: a complete schema for one domain and a complete interface for an unrelated one, sharing a repository, joined by nothing.*

### U5.2.05 — Cost drivers are measured, not estimated
`RATIFIED`

Before a capability with variable cost is committed to, its real drivers are measured at projected volume.

**The driver is frequently not the obvious one.** Per-call price is often negligible while rate limits, accumulating storage, or retention obligations bind first. An analysis of the wrong driver produces confident, precise, irrelevant numbers.

### U5.2.06 — Existing investment measures cost, never desirability
`RATIFIED` · *supersedes an earlier draft that permitted the sunk-cost argument*

Substantial existing work is evidence of **cost-to-complete** in that direction. It is never evidence that the direction is **correct**.

A direction is chosen on its merits alone. Existing investment enters only afterward, as one input to sequencing among directions already judged correct.

> **Any argument of the form "we have already invested here" is rejected as a reason to continue.**

*origin: a direction correctly chosen because the schema, the processing pipeline, and a plausible differentiator agreed with each other — and only then made cheaper by work already done. The earlier wording of this item would have permitted the reverse reasoning, and was rejected for that.*

### U5.2.07 — A seeded customer is not a customer
`RATIFIED`

Sample and demonstration data must be distinguishable from real records at a glance, and must never be counted as commercial evidence.

**The specific risk:** a system full of plausible customer names presents as validated. Decisions about scale, pricing, and multi-scope complexity get made against a customer base that does not exist.

---

## Not in this pass

`.1` State · `.3` Findings · `.4` Mechanisms · `.5` Sequence · `.6` Verification — deferred to Co2+.
