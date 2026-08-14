# U2 · Core · Identity & Tenancy

**Tier:** U — Universal. **Cycle:** Co1 · pass 1 · Charter and Decision stages only.

---

## U2.0 — Charter

```
purpose:     Establishing who a caller is, which isolated scope they act for,
             and what they are permitted to be.
boundary:    U2 owns identity establishment — how the answer is produced and
             made unforgeable. U3 owns identity enforcement at the persistence
             layer. U4 owns what a scope has purchased.
depends_on:  U1
governs:     U3, U4, U5, U6
invariant:   Exactly one authority answers "who is this and for whom do they
             act," and that authority is cryptographically bound to something
             the caller cannot author.
```

---

## U2.2 — Decisions

### U2.2.01 — One authority, and only one
`RATIFIED`

A system with two mechanisms answering the same identity question has no identity mechanism. The weakest answer wins, and which answer is weakest changes as the system evolves.

When a second authority exists, it is **deleted**, not deprecated. A deleted alternative cannot be chosen — that is T4. A deprecated one can.

*origin: three independent mechanisms answering "who is this," each trusted by a different layer, none aware of the others.*

### U2.2.02 — Identity is bound, never asserted
`RATIFIED`

The identity claim must be **cryptographically bound** — signed by an authority the caller does not control. Any value the caller transmits is a request, not a fact.

**Specifically excluded as authorities:** request headers, query parameters, request bodies, client-side storage, and any value the caller can set.

*origin: an isolation boundary whose predicate read a scope identifier from a request header, forgeable by anyone holding a publicly distributed credential.*

### U2.2.03 — Authorization data is stored where its subject cannot write it
`RATIFIED`

Identity systems commonly offer two metadata stores: one the subject may modify, one only a privileged server may modify. Authorization data — scope, role, entitlement — belongs exclusively in the second.

**This must be enforced mechanically**, not by convention. It is one of the most frequently reversed decisions in practice, because the two stores are adjacent, similarly named, and identical from the reader's side.

*origin: the same reversal proposed three times after correction, by an actor that had acknowledged the rule in writing each time.*

### U2.2.04 — One-way flow: durable store to claim
`RATIFIED`

The durable membership record is the source of truth. Claims are **minted from it** by privileged server code.

Claims are never mirrored back into the durable store. Doing so makes the derived, expiring artifact authoritative over the permanent one.

### U2.2.05 — A single active scope in the claim
`RATIFIED`

The claim carries **one** active scope, not a set. Multi-scope membership lives in the durable store; switching scopes is a server-side operation that validates membership and re-mints the claim.

**Reason:** every isolation predicate in the system reads this value. A single value keeps every predicate simple, fast, and identically shaped. A set requires every predicate to handle containment, and predicates that vary are predicates that drift.

### U2.2.06 — The staleness split
`RATIFIED`

A signed claim is a snapshot. Revoking a permission does not invalidate claims already issued; they remain valid until expiry.

| Operation class | Authority |
|---|---|
| Reads and ordinary operations | The claim — fast path, accepted staleness |
| High-blast-radius writes | A live check against the durable store |

**Both the claim lifetime and the list of operations requiring a live check are explicit decisions.** Leaving either implicit means the staleness window is unknown, which is the same as unbounded.

### U2.2.07 — Claim minting is brokered by application code
`RATIFIED`

Minting is performed by an application-layer broker, not by a trigger inside the persistence layer calling outward.

**Rejected: persistence-layer triggers issuing outbound calls.** They couple a transaction to network latency, fail silently, and are difficult to retry, monitor, or reason about.

**Accepted cost:** writes made directly to the durable store bypass minting. This is mitigated by making the durable store unreachable except through the broker (`U2.2.08`), which converts the risk from external to internal.

### U2.2.08 — The authorization record is not client-readable
`RATIFIED`

The record deciding who may do what is not exposed to the parties it decides about. It is reached only through server-side code.

This removes the escalation surface rather than policing it — the difference between T4 and T3.

*origin: an authorization table writable by any member of the scope it governed, permitting self-promotion.*

### U2.2.09 — A missing authorization value is a denial
`RATIFIED`

Absent scope, absent role, absent claim — all deny. **No authorization value is ever defaulted.** A default is a silent grant, and silent grants are discovered only after they are exploited.

Predicates must fail closed on absence. Failing closed on absence is not the same as failing closed on forgery — a system can do the first and still be defeated by the second (`U2.2.02`).

### U2.2.10 — Verification requires both directions
`RATIFIED`

An identity mechanism is verified when a **valid credential is accepted** *and* a **forged credential is rejected**. Either alone proves nothing: the first can pass with verification disabled, the second with the system offline.

---

## Not in this pass

`.1` State · `.3` Findings · `.4` Mechanisms · `.5` Sequence · `.6` Verification — deferred to Co2+.
