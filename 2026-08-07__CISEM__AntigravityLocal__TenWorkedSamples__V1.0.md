---
metadata:
  owner: "CISEM_GOVERNOR"
  canonical_location: "C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\2026-08-07__CISEM__AntigravityLocal__TenWorkedSamples__V1.0.md"
  artifact_status: "DRAFT"
  maturity: "WORKING_DRAFT"
  version: "1.0"
  role_type: "EXAMPLE_ONLY"
---

# Ten Worked Samples — The Five Structural Concepts

**Two instances of each: Corespine · Overlay · Protocol · Wizard · Pipeline**

**Status: BRAIN DRAFT — RAW-EXTERNAL. Not CISEM state.**
**Every sample below is EXAMPLE-ONLY / NOT-YET-A-NODE.** No sample is a real artifact, none is
proposed for creation, and none should be read as CISEM state.

**Companion document:** `BRAIN-DRAFT_Five-Structural-Concepts_2026-08-07.md` — the definitions,
element inventories, and instruction layers these samples instantiate. This document shows; that one
defines.

---

## How this sample set is built, and why

**One coherent domain, not ten unrelated fragments.** All ten samples come from a single fictional
company — **Meridian**, a custom-manufacturing business doing design, production and fulfilment.
This matters: samples drawn from ten different domains can only *assert* their relationships, while
samples from one domain have **real** ones. The relationship section at the end of each sample points
at other samples in this set, not at hypotheticals.

**Divergent pairs, not matched pairs.** Under divergent-iteration discipline, two similar instances
prove nothing. Each pair is deliberately different in shape:

| Type | Sample 1 | Sample 2 — and how it diverges |
|---|---|---|
| Corespine | internal documents | external parties — different shape entirely |
| Overlay | rule-based invariant core | comparator-based ordering overlay |
| Protocol | pure judgment | mixed — judgment front, automation tail |
| Wizard | mirrors a whole protocol | mirrors only the front half of one |
| Pipeline | mirrors only the tail half | standalone nightly batch, no wizard sibling |

**A note on the ID prefixes.** `CS-` is CISEM's registered corespine prefix; `OV-`, `PR-`, `WZ-` and
`PL-` used below are **invented for legibility in this document only**. Real prefix allocation runs
through the naming registry and is Builder's authority. Do not read these as proposed type codes.

**Fields marked `AUTHORITY`** are left empty in every sample — that is the correct populated state
for anything Brain produces, and showing them empty is part of the sample.

**One honest gap in the set.** Sample 10 mirrors a protocol that is named but not itself sampled —
the two-per-type constraint made a third protocol impossible. Flagged where it appears, because a
pipeline with no visible protocol is exactly the failure the definitions warn about, and a sample set
that hid that would be teaching the wrong lesson.

---

# PART A — CORESPINES

## Sample 1 — `CS-EXAMPLE-ORDERSPEC-001` (Order Specification)

*The shape: an internal-document lineage. Abstract, high-traffic, governs artifacts.*

**Block A — Identity**
- **Name:** Order Specification
- **ID:** `AUTHORITY` — empty
- **Status:** `AUTHORITY` — empty
- **Wiring state:** DECLARED
- **Depth level:** L2
- **Parent / position:** child of the Commercial trunk; sibling to Supplier (Sample 2)

**Block B — Purpose**
- **Goal (DO / DON'T):** *DO* — every artifact describing what a customer ordered resolves to one
  authoritative, versioned specification at all times. *DON'T* — never let two documents each claim
  to describe the same order.
- **Origin — the need that created this line:** production was repeatedly run against a superseded
  spec because quote, proof and bill of materials each carried their own version of the truth and
  nothing said which won.
- **Forward obligation:** anything created in this line must state which spec version it derives
  from, and must break loudly rather than silently proceed if that version has been superseded.
- **North-star service:** serves "deliver what was actually agreed" — the company-level goal.

**Block C — Boundary**
- **Belongs:** quotes, spec sheets, artwork proofs, bills of materials, engineering change notices,
  customer-approved revisions.
- **Explicitly does NOT belong:** production run records (those are execution, not specification) ·
  invoices (commercial, derived from spec but not part of it) · supplier certificates (Sample 2's
  line).
- **Qualification evidence:** *Remove test* — remove this line and a proof no longer knows which
  quote it must match; the rules are lost, not just an address. *Lineage test* — origin, creating
  need and forward obligation all statable. *Inheritance-source* — a proof inherits versioning law
  *from being a specification artifact*. *Fork test* — one lineage. *Cross-cutting* — binds within
  one line only. **Passes all five.**
- **Governed artifact classes:** document artifacts carrying a customer-order reference.

**Block D — The binding law**
- **OS-I1** Exactly one spec version is authoritative per order at any moment.
- **OS-I2** A derived artifact declares its source spec version inline; never inferred from date or
  filename.
- **OS-I3** A change to an authoritative spec invalidates every downstream artifact until re-derived.
- **OS-I4** A spec is never inferred from a previous order, however similar.
- **Vocabulary owned:** *specification* · *authoritative version* · *superseded* · *re-proof*.
- **Inheritance contract:** before producing any derived artifact, load the current authoritative
  spec version and record which version was loaded.
- **Evidence-of-load:** the recorded version reference on the derived artifact.

**Block E — Connections**
- **Overlays attached:** Traceability (Sample 3) via its Order-Specification scope profile.
- **Protocols governed:** Proof Approval (Sample 5).
- **Sibling boundaries:** Supplier (Sample 2) — the line falls at ownership. A spec is what *we* owe
  the customer; a certificate is what a *supplier* owes us.

**Block F — Integrity**
- **Rejected paths:** treating "current spec" as a computed latest-timestamp — rejected, because two
  artifacts can be created in the same second and timestamp gives no authority. Authority is declared,
  not derived.
- **Open questions:** whether customer-side approvals belong here or in a Communication line.
- **Provenance:** illustrative sample; no real source.

### ▸ Relationships — Sample 1

**To Sample 2 (Supplier corespine).** Peers, not parent and child. Both are lineages; neither
inherits from the other. Their boundary is stated in E, which is what stops the recurring "does a
supplier's artwork file belong to spec or to supplier?" argument — it belongs to spec, because the
question is what the customer ordered, not who provided it.

**To Sample 3 (Traceability overlay).** Traceability attaches *to* this line through a scope profile.
It may add requirements to OS-I1–I4; it can never relax them. This is the within-vs-across
distinction made concrete: OS-I2 exists because of what specifications *are*; traceability exists
regardless of what anything is.

**To Sample 5 (Proof Approval protocol).** That protocol declares this corespine as its governing
lineage and runs inside OS-I1–I4. It cannot approve a proof against a superseded spec, because
OS-I3 forbids it — and the protocol did not have to restate that rule, it inherited it.

**To Samples 7 and 8 (wizards).** Sample 7 is where a new proof's membership in this line is first
declared. That makes it easy to mistake the wizard for the source of OS-I1–I4. It is not — it is
where they are applied.

---

## Sample 2 — `CS-EXAMPLE-SUPPLIER-001` (Supplier)

*The divergence: an external-party lineage. Governs relationships and entities rather than
documents, and its members can go stale on their own without anyone touching them.*

**Block A — Identity**
- **Name:** Supplier
- **ID / Status:** `AUTHORITY` — empty
- **Wiring state:** DECLARED
- **Depth level:** L2
- **Parent / position:** child of the Commercial trunk; sibling to Order Specification (Sample 1)

**Block B — Purpose**
- **Goal (DO / DON'T):** *DO* — every external party Meridian buys from is known, currently
  qualified, and traceable to the work it touched. *DON'T* — never let an unqualified or lapsed
  supplier appear in a production path.
- **Origin:** a supplier's material certification lapsed mid-contract; nothing detected it because
  qualification was checked once at onboarding and never again.
- **Forward obligation:** anything in this line must carry an expiry, and must fail closed on expiry
  rather than continuing on the last known good state.
- **North-star service:** serves "deliver what was actually agreed" — you cannot deliver an agreed
  material from an unqualified source.

**Block C — Boundary**
- **Belongs:** supplier records, qualification certificates, audit results, capability declarations,
  approved-material lists, contact and escalation records.
- **Explicitly does NOT belong:** purchase orders (commercial transactions, not the relationship) ·
  incoming inspection results (production execution) · the artwork a supplier provides (Sample 1's
  line — it describes the order, not the supplier).
- **Qualification evidence:** *Remove test* — remove it and a certificate has no expiry rule and no
  fail-closed behaviour; rules lost. *Fork test* — one lineage. *Cross-cutting* — within one line.
  **Passes all five.**

**Block D — The binding law**
- **SU-I1** Every supplier record carries an explicit qualification expiry.
- **SU-I2** An expired qualification blocks the supplier from any production path — fail closed, never
  a warning.
- **SU-I3** Qualification is never inherited from a parent company or an affiliate.
- **SU-I4** A supplier's own claim is evidence of intent, never evidence of qualification.
- **Vocabulary owned:** *qualified* · *lapsed* · *approved material* · *capability declaration*.
- **Inheritance contract:** before any production path selects a supplier, load its current
  qualification state and record the expiry checked against.
- **Evidence-of-load:** the recorded expiry-check on the production record.

**Block E — Connections**
- **Overlays attached:** Traceability (Sample 3) and Lead-Time Priority (Sample 4), each via its own
  Supplier scope profile.
- **Protocols governed:** Supplier Onboarding (Sample 6).
- **Sibling boundaries:** Order Specification (Sample 1) — the line falls at ownership.

**Block F — Integrity**
- **Rejected paths:** a "provisionally qualified" status was proposed and rejected — it would have
  created a state in which SU-I2 does not fire, which is an exemption wearing a status name.
- **Open questions:** whether sub-suppliers form a nested lineage or are members of this one.

### ▸ Relationships — Sample 2

**To Sample 1 (Order Specification corespine).** Peers. The pair is the clearest available
demonstration that a corespine is not a folder: an artwork file supplied *by* a supplier lives in the
**Order Specification** line, because lineage follows what a thing *is for*, not where it came from.
A folder structure would have filed it by origin and lost the versioning law entirely.

**How it diverges from Sample 1, and why that matters.** Sample 1's members go stale only when
someone changes something. Sample 2's members go stale **on their own**, with nobody acting — that is
what SU-I1 and SU-I2 exist for. The same inventory structure absorbed both shapes without
modification, which is the beginning of evidence that the corespine structure generalises. Two
instances is not sealing; it is one divergent trial.

**To Sample 3 (Traceability overlay).** Attaches here too, with a *different* scope profile than
Sample 1's. Same invariant core, different added requirements — this is the core/profile split doing
its actual job rather than being asserted.

**To Sample 4 (Lead-Time Priority overlay).** Attaches here and not to Sample 1. Specifications have
no lead time; suppliers do. An overlay applying across every lineage still declares where it does
**not** apply, and stating that exclusion is what stops it reading as an oversight.

**To Sample 6 (Supplier Onboarding protocol).** Runs inside SU-I1–I4. Note what this forces: the
protocol cannot mark a supplier qualified on the supplier's own submitted paperwork, because SU-I4
already forbids it. The protocol inherited a refusal it never had to write.

---

# PART B — OVERLAYS

## Sample 3 — `OV-EXAMPLE-TRACEABILITY-001` (Traceability)

*The shape: a rule-based overlay. A small invariant core, plus per-lineage profiles that add.*

**Block A — Identity**
- **Name:** Traceability
- **ID / Status:** `AUTHORITY` — empty
- **Wiring state:** DECLARED
- **Dual-facet declaration:** single-facet. No invariant here behaves like a lineage of its own —
  nothing exists *because it is traceable*.

**Block B — The concern**
- **Concern statement:** every artifact and every physical output can be linked, without inference,
  to the material lot and the decisions that produced it.
- **Why cross-cutting:** it binds specifications, suppliers, production and fulfilment alike. No
  element inherits its rules *from being traceable*; traceability constrains whatever line the
  element is already in. Fails the corespine remove-test, passes the overlay test.
- **Origin:** a recall could not be scoped, because the link from finished goods back to material lot
  existed in three systems and agreed in none.

**Block C — The invariant core** *(three rules; deliberately small)*
- **TR-C1** Every artifact carries an immutable creation record: what made it, from what, when.
- **TR-C2** A link is recorded explicitly. Never inferred from timing, sequence, or proximity.
- **TR-C3** A broken or missing link **blocks** the dependent action. It never degrades to a warning.
- **Universality evidence:** each was tested against all four lineages and against the two protocols
  in this set. TR-C3 was the hardest — fulfilment argued for a warning under time pressure, which is
  exactly the pressure that makes it invariant rather than negotiable.
- **Minimality statement:** a fourth candidate — "links must be human-readable" — was moved to a
  scope profile. It could be weakened in machine-only paths, so by definition it was never core.

**Block D — Scope profiles**

*Profile: Order Specification (Sample 1)*
- **Added requirements:** the link is to the spec **version**, not the order. Approval events are
  themselves linked artifacts.
- **Rationale:** the recall failure came from links pointing at orders, which are stable, rather than
  versions, which are what actually changed.
- **Tighten-only assertion:** confirmed — adds version granularity to TR-C2; relaxes nothing.
- **Join points:** artifact creation; approval; supersession.

*Profile: Supplier (Sample 2)*
- **Added requirements:** the link reaches through to the supplier's own lot identifier, and that
  identifier is captured at receipt rather than reconstructed later.
- **Rationale:** external identifiers are unrecoverable once the shipment is opened.
- **Tighten-only assertion:** confirmed — adds an external hop to TR-C1; relaxes nothing.
- **Join points:** goods receipt; qualification renewal.

**Block E — Resolution**
- **Conflict rule:** where two profiles both apply, both apply in full. Most-restrictive-wins; no
  netting, no averaging.
- **Comparators:** none — this is a rule-based overlay, not an ordering one.
- **Incomparability handling:** not applicable.
- **Fail-closed:** an action whose links cannot be established stops and surfaces to the production
  supervisor.
- **Excluded lineages and why:** internal drafts before first approval — nothing physical exists yet
  to trace, so the core would be vacuous rather than violated. Stated so the gap is a decision rather
  than an oversight.

**Block F — Verification and integrity**
- **Evidence-of-application:** the creation record itself is the evidence; its absence is the failure.
- **Rejected paths:** a "traceability exception" workflow for rush orders — rejected. It is the
  scoped-exemption failure exactly, and rush orders are when traceability matters most.

### ▸ Relationships — Sample 3

**To Samples 1 and 2 (both corespines).** It attaches to both, with a *different profile each*, and
the same three core rules in both. This is the whole overlay structure visible in one place: universal
minimum, scoped addition, no relaxation anywhere.

**To Sample 4 (Lead-Time Priority overlay).** Two overlays over the same lineage. They do not compose
by negotiation — E's conflict rule says both apply in full. Sample 4 can never order work in a way
that skips a traceability link, because tighten-never-loosen binds *both* overlays, and one overlay
cannot relax another's core any more than it can relax a corespine's law.

**To Samples 5 and 6 (protocols).** It constrains their steps from outside. Neither protocol restates
TR-C1–C3; both inherit them. This is the practical payoff — the alternative is the same three rules
written into every protocol, in five slightly different wordings, drifting from each other.

**To Samples 9 and 10 (pipelines; example: sync).** The highest-risk attachment in the set. A runner executes
unattended, so a loosened traceability constraint there would go unnoticed for as long as it ran.
TR-C3's block-never-warn is doing most of its work in exactly that position.

---

## Sample 4 — `OV-EXAMPLE-LEADTIME-001` (Lead-Time Priority)

*The divergence: an ordering overlay. Its core is made of comparators rather than rules, and it is
allowed to conclude that it cannot decide.*

**Block A — Identity**
- **Name:** Lead-Time Priority
- **ID / Status:** `AUTHORITY` — empty
- **Wiring state:** DECLARED
- **Dual-facet declaration:** single-facet.

**Block B — The concern**
- **Concern statement:** when two pieces of work compete for the same capacity, the ordering is
  decided by stated comparators, never by whoever asked most recently.
- **Why cross-cutting:** ordering pressure arrives in every lineage. Nothing exists *because it is
  prioritised*; priority constrains what already exists.
- **Origin:** a static 1-to-5 priority number was tried and abandoned. The number survived; the
  reasoning behind each assignment did not, and within a quarter nobody could re-derive why anything
  was a 2 rather than a 3.

**Block C — The invariant core** *(comparators, not values)*
- **LT-C1** Blocking beats non-blocking — work that unblocks other work outranks work that does not.
- **LT-C2** A committed customer date beats an internal target.
- **LT-C3** Preventing a defect beats producing an additional unit.
- **LT-C4** No rank is stored. Order is derived from the comparators at the moment it is needed.
- **Universality evidence:** each holds in production, procurement and fulfilment. LT-C4 is what makes
  the other three durable — a stored rank is a frozen comparison with its reasoning deleted.
- **Minimality statement:** "customer size" was proposed and rejected for the core — it can be
  overridden by LT-C3 in any safety-relevant case, so it was never invariant.

**Block D — Scope profiles**

*Profile: Supplier (Sample 2)*
- **Added requirements:** among otherwise-equal work, prefer the supplier whose qualification expires
  soonest, so re-qualification pressure surfaces early.
- **Rationale:** turns a cliff-edge expiry into a gradient.
- **Tighten-only assertion:** confirmed — breaks ties only. Never reorders across a core comparator.
- **Join points:** capacity allocation; purchase scheduling.

*Profile: Fulfilment (a lineage outside this sample set)*
- **Added requirements:** among otherwise-equal shipments, prefer the one whose consolidation window
  closes soonest.
- **Tighten-only assertion:** confirmed — tie-break only.

**Block E — Resolution**
- **Conflict rule:** core comparators evaluate first, in order, always. Profile comparators break only
  the ties the core leaves.
- **Comparators:** LT-C1 through LT-C3, evaluated **lexicographically**.
- **Incomparability handling:** **this is a partial order.** Where no comparator separates two items,
  the overlay does **not** decide. It surfaces both to the production supervisor as an explicit
  choice, labelled as incomparable rather than presented as a computed result.
- **Fail-closed:** on an undecidable pair it stops and surfaces. It never falls back to first-in
  order, and never fabricates a separation.
- **Excluded lineages:** Order Specification (Sample 1) — specifications do not compete for capacity.

**Block F — Verification and integrity**
- **Evidence-of-application:** each allocation decision records which comparator decided it, or
  records that it was surfaced as incomparable.
- **Rejected paths:** a total ordering with tie-break-by-timestamp — rejected. It would have produced
  a decision in every case, including the cases where no real basis for one existed, and the
  fabrication would have been invisible afterwards.

### ▸ Relationships — Sample 4

**To Sample 3 (Traceability overlay).** Same structure, different substance — and that is the point
of the pair. Sample 3's core is rules; Sample 4's core is comparators. The three-part structure
(invariant core, scope profiles, resolution rule) absorbed both without modification. This is the
second divergent trial the overlay structure needs; the definitions document names Priority and
Security as the recommended real pair.

**To Sample 2 (Supplier corespine).** Attaches via a profile that breaks ties only. Note the
direction of travel: the profile makes ordering *stricter* by surfacing expiry pressure earlier. If a
proposed profile ever needed to relax a core comparator, the correct response is to conclude the
comparator is wrong — not to write the exemption.

**To Sample 1 (Order Specification corespine).** Deliberately excluded, and the exclusion is stated.
An overlay that applies "across every lineage" still names where it does not apply; unstated gaps get
read as oversights and eventually get filled by someone guessing.

**To Samples 9 and 10 (pipelines; example: sync).** The incomparability rule in E is what makes this overlay safe to
automate at all. A runner that inherited a total ordering would silently pick a winner on every tie,
unattended, thousands of times. Inheriting a partial order means it stops and asks instead — which is
the difference between automation and confident wrong output at scale.

---

# PART C — PROTOCOLS

## Sample 5 — `PR-EXAMPLE-PROOF-APPROVAL-001` (Approve an artwork proof)

*The shape: pure judgment. Every step needs input that cannot be pre-supplied — so it takes a wizard
and no pipeline.*

**Block A — Identity**
- **Name:** Approve an artwork proof
- **ID / Status:** `AUTHORITY` — empty
- **Wiring state:** DECLARED
- **Position:** Commercial trunk, procedure layer

**Block B — Purpose and governance**
- **Operation, as a verb phrase:** *approve an artwork proof.* One verb, one object.
- **Goal, measurable:** a proof reaches an approved-or-rejected terminal state with a recorded
  reviewer and a recorded spec version, with zero proofs sitting in an ambiguous state.
- **Governing corespine:** Order Specification (Sample 1).
- **Constraining overlays:** Traceability (Sample 3).
- **Does NOT cover:** producing the proof · notifying the customer · scheduling the production run
  that follows approval.

**Block C — Entry conditions**
- **Trigger:** a proof artifact reaches "ready for review".
- **Preconditions:** an authoritative spec version exists (OS-I1) and is not superseded (OS-I3).
- **Required inputs:** the proof, its declared source spec version, the reviewer's identity.
- **Refusal conditions:** the source spec version is superseded → refuse and return for re-derivation.

**Block D — The procedure**
1. **Load the authoritative spec version.** *Gate.* Mismatch against the proof's declared version →
   stop. *Judgment: no.*
2. **Verify visual fidelity against the spec.** *Judgment: **yes** — a human comparison no available
   input encodes.* Acceptance: reviewer states each spec-relevant element as matched or not.
3. **Verify manufacturability.** *Judgment: **yes**.* Acceptance: a stated position with reasoning,
   not a checkbox.
4. **Record deviations.** *Loop* until every deviation is either accepted with reasoning or sent
   back. *Judgment: **yes**.*
5. **Terminal decision.** *Gate.* Approve or reject; no third state.
6. **Link the decision to the spec version and the reviewer.** *Judgment: no.* (Traceability TR-C1.)
- **Failure handling:** an incomplete run leaves the proof in "under review" and re-notifies after 24
  hours. It never silently reverts to "ready".
- **Rollback:** an approval can be withdrawn only by a superseding spec version — never by editing the
  approval record.

**Block E — Output**
- **Artifact shape:** an approval record — decision, reviewer, spec version, deviation list, timestamp.
- **Definition of done for a run:** terminal decision recorded *and* linked.
- **Verification requirement:** the link is checkable; its absence blocks the downstream production
  step (TR-C3).
- **Handoff:** to production scheduling.

**Block F — Modes and integrity**
- **Run modes:** wizard only (Sample 7). **No pipeline is possible** — steps 2, 3 and 4 carry judgment.
- **Single-home declaration:** this is the one authority for proof approval.
- **Rejected paths:** auto-approving proofs that match a previous order's approved artwork — rejected;
  it violates OS-I4 directly.

### ▸ Relationships — Sample 5

**To Sample 1 (Order Specification corespine).** Declares it as governing lineage and runs inside
OS-I1–I4. Step 1's gate is OS-I1 and OS-I3 applied; the protocol did not invent that rule, it
inherited it. And F's rejected path was decided *by* OS-I4 rather than by the protocol author's
judgment — which is what an inheritance line is for.

**To Sample 3 (Traceability overlay).** Step 6 and E's verification requirement are TR-C1 and TR-C3
applied at this join point. The protocol adds no traceability rules of its own.

**To Sample 7 (its wizard).** The wizard mirrors this protocol 1:1. Which mode was needed was not a
style choice — it was **read off block D's judgment marks**. Three judgment steps means a wizard;
this protocol could not be automated without deleting the review.

**To Sample 6 (the other protocol).** The instructive contrast. Both are protocols; both fire, run
and finish. But Sample 6's judgment marks stop halfway through, which is why it gets two run modes
and this one gets one.

---

## Sample 6 — `PR-EXAMPLE-SUPPLIER-ONBOARD-001` (Onboard a new supplier)

*The divergence: judgment at the front, pure automation at the back. It needs a wizard **and** a
pipeline — the case the definitions document flags as currently unnamed.*

**Block A — Identity**
- **Name:** Onboard a new supplier
- **ID / Status:** `AUTHORITY` — empty
- **Wiring state:** DECLARED

**Block B — Purpose and governance**
- **Operation:** *onboard a new supplier.*
- **Goal, measurable:** a supplier reaches qualified-or-declined with a recorded expiry and recorded
  evidence, with zero suppliers sitting in an indeterminate state.
- **Governing corespine:** Supplier (Sample 2).
- **Constraining overlays:** Traceability (Sample 3), Lead-Time Priority (Sample 4).
- **Does NOT cover:** negotiating commercial terms · re-qualifying an existing supplier (a separate
  operation, and a separate protocol — one verb phrase each).

**Block C — Entry conditions**
- **Trigger:** a sourcing request names a supplier not currently qualified.
- **Preconditions:** the material category is on the approved-material list.
- **Refusal conditions:** the supplier is an affiliate of a lapsed supplier and is being offered on
  that basis → refuse (SU-I3).

**Block D — The procedure**

*Front half — judgment required:*
1. **Assess capability against the material category.** *Judgment: **yes**.* Acceptance: a stated
   position with reasoning.
2. **Assess evidence sufficiency.** *Judgment: **yes**.* Note: SU-I4 already forbids accepting the
   supplier's own claim as qualification, so this step assesses *independent* evidence only.
3. **Set the qualification expiry.** *Judgment: **yes**.* Acceptance: a date with a stated basis.
4. **Terminal decision.** *Gate.* Qualify or decline.

*Back half — no judgment; every step decidable from the front half's outputs:*
5. **Create the supplier record** with the decided expiry.
6. **Register approved material categories** from the step-1 assessment.
7. **Create the traceability link** to the evidence artifacts (TR-C1).
8. **Emit the expiry monitor** that will fire SU-I2 on lapse.

- **Failure handling:** a run abandoned before step 4 leaves no supplier record at all. A run failing
  in steps 5–8 rolls back fully — a half-created supplier would be SU-I1 non-compliant and invisible.
- **Rollback:** steps 5–8 are reversible as a unit.

**Block E — Output**
- **Artifact shape:** a supplier record with expiry, approved categories, evidence links, monitor.
- **Definition of done:** all four back-half artifacts present, or none.
- **Handoff:** to procurement.

**Block F — Modes and integrity**
- **Run modes:** **both.** Wizard for steps 1–4 (Sample 8); pipeline for steps 5–8 (Sample 9). The
  split falls exactly at the judgment boundary.
- **Rejected paths:** a single wizard covering all eight steps — rejected, because steps 5–8 need no
  judgment and putting them in a wizard trains the operator to click through, which then bleeds into
  steps 1–4 where clicking through is the actual danger.

### ▸ Relationships — Sample 6

**To Sample 2 (Supplier corespine).** Governing lineage. SU-I4 does real work here: step 2 assesses
independent evidence *only*, and the protocol never had to argue for that — it inherited a refusal.
C's refusal condition is SU-I3 applied.

**To Samples 3 and 4 (both overlays).** Two overlays over one protocol. Step 7 is Traceability; the
ordering of onboarding work against other procurement work is Lead-Time Priority's Supplier profile.
Neither overlay's rules are restated here.

**To Sample 8 (wizard) and Sample 9 (pipeline).** This is the case the definitions document names as
having **no agreed name** — a protocol whose run modes split partway through. Wizard-with-automation,
or pipeline-with-a-gate? This sample shows the split is clean and workable in practice; it does not
resolve what to call it, and the honest position is that unnamed things drift.

**To Sample 5 (the other protocol).** The contrast that makes the judgment axis concrete. Sample 5's
judgment marks run all the way to step 4; this one's stop at step 4. Same field, read the same way,
producing a different mode allocation. Neither was a style call.

---

# PART D — WIZARDS

## Sample 7 — `WZ-EXAMPLE-PROOF-APPROVAL-001` (Proof approval)

*The shape: mirrors a whole protocol, end to end.*

**Block A — Identity**
- **Name:** Proof approval wizard
- **ID / Status:** `AUTHORITY` — empty
- **Wiring state:** DECLARED
- **Invocation handle:** invoked from a proof artifact in "ready for review"

**Block B — Source binding**
- **Protocol reference:** Sample 5, in full.
- **Clause-to-step map:**

| Protocol clause | Wizard step | Judgment |
|---|---|---|
| D1 load spec version | 1 | no — automatic |
| D2 visual fidelity | 2 | **yes** |
| D3 manufacturability | 3 | **yes** |
| D4 record deviations | 4 (loops) | **yes** |
| D5 terminal decision | 5 | gate |
| D6 link decision | 6 | no — automatic |

- **Additions declaration:** **none.** Every step maps to a clause; nothing added.
- **Governing corespine and overlays:** Order Specification (Sample 1); Traceability (Sample 3).

**Block C — Operator and inputs**
- **Operator type:** either — a human reviewer, or a model acting as reviewer under supervision. The
  wizard does not change shape based on which. *(This is the falsifier from the definitions, made
  concrete: a model running this alone is still running a wizard.)*
- **Input schema:** proof artifact reference; reviewer identity.
- **Preconditions:** an authoritative, non-superseded spec version exists.
- **Session/state handling:** a partial run persists as "under review". It never resumes into a
  different spec version — if the spec superseded mid-run, the run is invalidated and restarted.

**Block D — The guided sequence** *(steps 2–4 shown; 1, 5, 6 are automatic or gates)*

*Step 2 — visual fidelity*
- **Question:** "For each spec-relevant element, does the proof match the loaded spec version?"
- **Why it cannot be pre-supplied:** the comparison is perceptual. No available input encodes it.
- **Acceptance:** a per-element matched / not-matched with a note on each mismatch.
- **Rejection:** a blanket "looks fine" with no per-element statement → returned.
- **Loop:** no.
- **On non-answer:** the run **stops and holds**. It does not default to matched. This is the single
  most important field in the sample — it is where a model would otherwise supply a plausible value
  and continue.

*Step 3 — manufacturability*
- **Question:** "Can this be produced as drawn, at the specified tolerances, by an available process?"
- **Why not pre-supplied:** requires reading the drawing against current shop capability.
- **Acceptance:** a stated position with reasoning.
- **On non-answer:** stops and holds; escalates to production engineering after 24 hours.

*Step 4 — deviations*
- **Question:** "For each deviation recorded, accept with reasoning or send back?"
- **Loop:** yes — repeats until every deviation has a terminal disposition.
- **On non-answer:** stops and holds. An un-dispositioned deviation can never become an approval.

**Block E — Outcomes**
- **Output artifact shape:** the approval record from Sample 5's block E.
- **Refusal paths:** superseded spec on load → refuse · any mismatch un-dispositioned → cannot reach
  approve · manufacturability negative without an accepted deviation → refuse.
- **Cannot-do declaration:** does not ratify · does not assign IDs · does not write status fields ·
  does not supersede a spec.
- **Handoff:** to production scheduling.
- **Run record:** which steps fired, reviewer, timestamps, every answer given.

**Block F — Integrity**
- **Mirror verification record:** clause map above, verified at draft. Re-verification on any protocol
  change is required and **currently manual** — an honest gap, shared across the set.
- **Refusal-rate note:** if this wizard never reaches a refusal path, either proofs are perfect or the
  gate is not gating. Worth watching; nothing measures it.

### ▸ Relationships — Sample 7

**To Sample 5 (its protocol).** Mirrors it 1:1, with an explicit clause map rather than a claim of
fidelity. All of this wizard's authority is inherited; it has none of its own. The additions
declaration is empty, and an empty additions declaration is the whole point — anything there would be
procedure growing in the executable layer where it cannot be reviewed except by running it.

**To Sample 1 (corespine).** Runs inside OS-I1–I4 and cannot exempt its output. Step 1 exists
*because* OS-I1 exists.

**To Sample 3 (overlay).** Step 6 is TR-C1; the refusal on a missing link is TR-C3.

**To Sample 8 (the other wizard).** The divergent pair. Sample 7 mirrors a whole protocol; Sample 8
mirrors only the front half of one. Same inventory, same shape, different span — which is the
beginning of evidence that the wizard structure generalises.

**To Samples 9 and 10 (pipelines; example: sync).** This wizard has **no pipeline sibling and cannot have one**.
Steps 2–4 require judgment. Automating them would not be automation; it would be deleting the review
and keeping the record. Worth stating plainly, because the pressure to automate a review is constant
and always sounds reasonable.

---

## Sample 8 — `WZ-EXAMPLE-SUPPLIER-ONBOARD-001` (Supplier onboarding — front half)

*The divergence: mirrors only steps 1–4 of its protocol. Its output is the input to a pipeline.*

**Block A — Identity**
- **Name:** Supplier onboarding wizard
- **ID / Status:** `AUTHORITY` — empty
- **Wiring state:** DECLARED
- **Invocation handle:** invoked from a sourcing request naming an unqualified supplier

**Block B — Source binding**
- **Protocol reference:** Sample 6, **steps 1–4 only**. The span is declared explicitly, because a
  wizard silently covering less than its protocol is indistinguishable from a wizard with missing
  steps.
- **Clause-to-step map:** D1→1, D2→2, D3→3, D4→4 (gate). Steps D5–D8 are **out of span**, handled by
  Sample 9.
- **Additions declaration:** none.
- **Governing corespine and overlays:** Supplier (Sample 2); Traceability (Sample 3), Lead-Time
  Priority (Sample 4).

**Block C — Operator and inputs**
- **Operator type:** human only. Divergence from Sample 7 — qualification is an accountable judgment,
  and accountability requires a named person. *(Note this is a deliberate constraint of this instance,
  not a property of wizards. The definitions are explicit that operator may be a model.)*
- **Input schema:** supplier identity; material category; submitted evidence set.
- **Preconditions:** material category on the approved-material list.

**Block D — The guided sequence**

*Step 1 — capability*
- **Question:** "Can this supplier produce this material category to our stated requirements?"
- **Why not pre-supplied:** requires reading evidence against requirements; no field encodes it.
- **Acceptance:** a stated position with reasoning, per requirement.
- **On non-answer:** stops. No supplier record is created — the run leaves no trace, by design.

*Step 2 — evidence sufficiency*
- **Question:** "Is the independent evidence sufficient to qualify, ignoring the supplier's own
  claims?"
- **Why not pre-supplied:** sufficiency is a judgment about evidence *quality*.
- **Rejection:** any answer resting on supplier-provided assertion → returned, citing SU-I4.
- **On non-answer:** stops.

*Step 3 — expiry*
- **Question:** "What is the qualification expiry, and on what basis?"
- **Why not pre-supplied:** basis varies by evidence type and certification regime.
- **Acceptance:** a date **and** a stated basis. A date alone is rejected — a date with no basis is
  the frozen-number failure that Sample 4's origin describes.
- **On non-answer:** stops. **There is no default expiry**, because a default expiry is the mechanism
  by which SU-I1 becomes decorative.

*Step 4 — terminal decision*
- **Gate.** Qualify or decline. Declining ends the run with a recorded reason and no record created.

**Block E — Outcomes**
- **Output artifact shape:** a **qualification decision packet** — decision, expiry with basis,
  approved categories, evidence references, decider. Not a supplier record. That is Sample 9's output.
- **Refusal paths:** affiliate-basis offer → refuse (SU-I3) · supplier-claim-only evidence → refuse
  (SU-I4) · no defensible expiry basis → refuse.
- **Cannot-do declaration:** does not create the supplier record · does not ratify · does not assign
  IDs · does not write status.
- **Handoff:** the decision packet to Sample 9.
- **Run record:** every answer, with reasoning, retained regardless of outcome — including declines.

**Block F — Integrity**
- **Mirror verification:** clause map verified for the declared span at draft.
- **Refusal-rate note:** onboarding wizards that never decline are the classic case of a gate that has
  become a formality.

### ▸ Relationships — Sample 8

**To Sample 6 (its protocol).** Mirrors steps 1–4 and declares that span explicitly. The span
declaration is the field that makes partial mirroring safe rather than indistinguishable from
incompleteness.

**To Sample 9 (the pipeline).** This is the handoff at the judgment boundary. Sample 8's output — the
decision packet — is precisely Sample 9's complete set of start-available inputs. That is not a
coincidence; it is what makes Sample 9 a legitimate pipeline. **Every judgment Sample 9 would
otherwise have needed was made here and written down.** This pair is the clearest available
illustration of the conversion lever from the definitions: you turn judgment into automation by
*resolving the judgment upstream*, not by removing the operator.

**To Sample 2 (corespine).** SU-I3 and SU-I4 appear as refusal paths, not as invented rules. SU-I1
is why step 3 has no default.

**To Sample 4 (overlay).** Where this onboarding sits against other procurement work is decided by
Lead-Time Priority's Supplier profile — not by this wizard, and not by whoever asked most recently.

**To Sample 7 (the other wizard).** Divergent in three ways: partial span vs full, human-only vs
either operator, and an intermediate packet vs a terminal artifact. The inventory absorbed all three
without modification.

---

# PART E — PIPELINES

## Sample 9 — `PL-EXAMPLE-SUPPLIER-ACTIVATION-001` (Supplier onboarding — back half)

*The shape: mirrors the tail of a protocol whose head is a wizard.*

**Block A — Identity**
- **Name:** Supplier activation pipeline
- **ID / Status:** `AUTHORITY` — empty
- **Wiring state:** DECLARED
- **Activation state:** `AUTHORITY` — **empty.** Off. Built is not on.

**Block B — Source binding**
- **Protocol reference:** Sample 6, **steps 5–8 only**, span declared.
- **Clause-to-step map:** D5→1, D6→2, D7→3, D8→4.
- **Additions declaration:** none.
- **Governing corespine and overlays:** Supplier (Sample 2); Traceability (Sample 3).
- **Decidability proof, per step:**
  - *Step 1 (create record):* every field comes from the decision packet. **No judgment.**
  - *Step 2 (register categories):* the category list is an output of wizard step 1. **No judgment.**
  - *Step 3 (traceability link):* evidence references are in the packet. **No judgment.**
  - *Step 4 (expiry monitor):* the expiry is in the packet, with its basis. **No judgment.**
  - *Summary:* every judgment was resolved in Sample 8 and written into the packet. This is the
    proof, not an assertion that it feels automatic.

**Block C — Trigger and inputs**
- **Trigger:** receipt of a qualification decision packet with decision = qualify.
- **Inputs available at start:** the complete packet. Nothing else is read.
- **Preconditions:** packet passes schema validation; decider identity present.
- **Scope limits:** one supplier per run.
- **Rate limits:** not applicable at expected volume; declared rather than omitted.

**Block D — The chain**
1. **Create supplier record.** *Rule:* map packet fields to record fields, one to one.
   *Undecidable handling:* a missing mandatory field → **stop and surface.** Never a default.
2. **Register approved categories.** *Rule:* register exactly the categories in the packet — no
   expansion to parent or sibling categories. *Undecidable:* an unrecognised category → stop.
3. **Create the traceability link.** *Rule:* link record to each evidence reference (TR-C1, TR-C2 —
   explicit, never inferred). *Undecidable:* an unresolvable reference → stop; TR-C3 blocks.
4. **Emit the expiry monitor.** *Rule:* schedule at the packet's expiry date. *Undecidable:* an expiry
   in the past → stop and surface. **Never silently extend it** — a silent extension is SU-I2 turned
   off from inside.
- **Failure handling:** any stop rolls the whole run back. A half-created supplier is SU-I1
  non-compliant and, worse, invisible.

**Block E — Run behaviour**
- **Fail-closed:** stops and surfaces on any undecidable input. It has no default branch anywhere.
- **Idempotency:** re-running with the same packet is a no-op if the record exists and matches; a
  conflict stops rather than overwrites.
- **Rollback:** all four steps reverse as a unit.
- **Run record:** steps fired, values written, source packet reference.
- **Surfacing channel:** a stop goes to the named decider from the packet — not to a generic queue.
  A stop nobody reads is a stop that did not happen.
- **Blast radius:** worst case is a supplier created with a wrong expiry, which would defeat SU-I2 for
  that supplier until the next audit. This is the reason step 4's past-expiry stop exists.

**Block F — Integrity**
- **Mirror verification:** clause map verified for the declared span.
- **Activation ratification reference:** **none — not activated.**

### ▸ Relationships — Sample 9

**To Sample 8 (the wizard).** Its complete input set. The decidability proof in block B is only true
*because* Sample 8 resolved and recorded every judgment first. Remove the wizard and this stops being
a pipeline immediately — it becomes an automation guessing at expiry dates.

**To Sample 6 (the protocol).** Both this and Sample 8 mirror one protocol, split at the judgment
boundary. Neither alone is the protocol; together they are its two run modes.

**To Sample 2 (corespine).** SU-I1 is why step 4 exists at all; SU-I2 is why a past expiry stops
rather than extends. Automation created no exemption — which is the load-bearing claim about
pipelines and governance.

**To Sample 3 (overlay).** Steps 3's rules are TR-C1 and TR-C2; the stop is TR-C3. Note that
**TR-C3's block-never-warn is doing its most important work here**, in the unattended position where
a warning would be seen by nobody.

**To Sample 10 (the other pipeline; example: sync).** Divergent: Sample 9 has a wizard sibling and mirrors a partial
span; Sample 10 (example: batch) has neither.

---

## Sample 10 — `PL-EXAMPLE-LOT-RECONCILE-001` (Nightly lot reconciliation)

*The divergence: a standalone batch. No wizard sibling, no partial span, and a much larger blast
radius.*

> **Honest gap, flagged rather than hidden:** this pipeline's protocol —
> `PR-EXAMPLE-LOT-RECONCILE-001` — is **named but not sampled** in this set, because two-per-type left
> no room for a third protocol. A pipeline with no visible protocol is exactly the failure the
> definitions warn about, so it is stated here rather than glossed. In a real set the protocol would
> be present and this note would not exist.

**Block A — Identity**
- **Name:** Nightly lot reconciliation
- **ID / Status:** `AUTHORITY` — empty
- **Wiring state:** DECLARED
- **Activation state:** `AUTHORITY` — **empty.** Off.

**Block B — Source binding**
- **Protocol reference:** `PR-EXAMPLE-LOT-RECONCILE-001` — *named, not sampled here; see the note
  above.*
- **Clause-to-step map:** would be present in a real instance; **absent here**, and its absence is a
  defect of the sample set, not a property of the pipeline.
- **Governing corespine and overlays:** Supplier (Sample 2); Traceability (Sample 3).
- **Decidability proof:** every comparison is between two recorded values. A mismatch is *detected*
  mechanically; deciding what a mismatch **means** is judgment, and is deliberately **out of scope** —
  the pipeline reports, it does not adjudicate. That scoping decision is what keeps it a pipeline.

**Block C — Trigger and inputs**
- **Trigger:** scheduled, nightly.
- **Inputs available at start:** the day's goods-receipt records and the day's production
  consumption records.
- **Preconditions:** both record sets closed for the day.
- **Scope limits:** one day's records per run. Never a backfill — a backfill is a different operation
  and would need its own protocol.
- **Rate limits:** one run per day; a second run in the same day is refused.

**Block D — The chain**
1. **Load both record sets.** *Rule:* the closed day's records only. *Undecidable:* a set not closed →
   **stop and surface.** Never partial-load.
2. **Match receipts to consumption by lot identifier.** *Rule:* exact identifier match only — never
   fuzzy, never nearest, never by quantity or timing (TR-C2: links are explicit, never inferred).
   *Undecidable:* an ambiguous identifier → record as unmatched; **never guess a match.**
3. **Classify each unmatched item** as receipt-without-consumption or consumption-without-receipt.
   *Rule:* set membership. *Undecidable:* none possible.
4. **Emit the exception report.** *Rule:* every unmatched item, with both source references.
   *Undecidable:* none.
- **Failure handling:** a failed run emits nothing and surfaces. **A partial reconciliation report is
  more dangerous than none** — it reads as a clean night with fewer exceptions.

**Block E — Run behaviour**
- **Fail-closed:** any stop means no report. It never emits what it managed to complete.
- **Idempotency:** re-running the same day reproduces the identical report. It writes no state to the
  record sets — read-only by design, which is most of why its blast radius is survivable.
- **Rollback:** not required — nothing is mutated.
- **Run record:** counts in, counts matched, counts unmatched, duration.
- **Surfacing channel:** the production supervisor, by name.
- **Blast radius:** **the largest in this set.** A silent failure means nobody learns that lots stopped
  reconciling, and the gap compounds nightly until an audit finds it. This is the case that
  manual-activation-by-default exists for, and the reason step 1 stops rather than partial-loads.

**Block F — Integrity**
- **Mirror verification:** **cannot be performed** — the protocol is not present in this set.
- **Activation ratification reference:** none — not activated.
- **Rejected paths:** fuzzy lot matching to reduce the exception count — rejected. It would have
  reduced the report by inventing links, which is TR-C2 violated and the exact failure the recall
  investigation was caused by.

### ▸ Relationships — Sample 10

**To its protocol (named, not sampled).** The relationship that *should* be here and cannot be. Worth
sitting with: without the protocol, nothing in this sample is checkable. The decidability proof is an
assertion, the clause map is absent, and mirror verification cannot run. It looks complete and is
not — which is precisely why "does a protocol exist?" is the first qualification question, and why
the answer being no is a **halt**, not a warning.

**To Sample 9 (the other pipeline).** Divergent in every dimension that matters: no wizard sibling ·
full span rather than partial · read-only rather than record-creating · scheduled rather than
event-triggered · far larger blast radius. The inventory absorbed all of it. Two divergent instances
is the *start* of evidence that the structure generalises — not sealing.

**To Sample 3 (overlay).** TR-C2 is the reason step 2 refuses fuzzy matching, and the reason the
rejected path in F was rejected. The overlay decided that, not the pipeline author.

**To Sample 4 (overlay).** Deliberately **not** attached. Reconciliation does not compete for
capacity. Stating the non-attachment is the same discipline as Sample 4 stating its exclusions —
silence would read as an oversight.

**To Samples 5 and 6 (protocols).** The contrast that closes the set. Those two protocols each have
their run modes present and mirrored. This pipeline does not — and it is the only sample here that
would fail its own qualification test.

---

# CLOSING — WHAT THE TEN SAMPLES DEMONSTRATE TOGETHER

**The interlock is real, not asserted.** Two corespines, two overlays attaching to both with
different profiles, two protocols each declaring a governing lineage, and four run modes mirroring
those protocols. Every relationship section points at another sample in this document. Nothing here
relates to a hypothetical.

**Five findings that only appear when the set is viewed whole:**

1. **Mode allocation was never a style choice.** Sample 5 gets a wizard and Sample 6 gets both,
   because their judgment-point fields say so. The decision was read off the protocol in each case.
2. **The conversion lever is visible.** Samples 8 and 9 show how judgment becomes automation — by
   being *resolved upstream and written down*, not by removing an operator. Sample 9 is a legitimate
   pipeline only because Sample 8 exists.
3. **Overlays never restated a rule.** TR-C1–C3 appear in four samples and are written once. That is
   the duplication the structure exists to prevent, avoided in practice rather than in principle.
4. **Corespines never restated an overlay's rule either**, and protocols never restated a corespine's.
   Each layer inherited downward and added only what was its own.
5. **The one broken sample is the most instructive.** Sample 10 has no protocol and therefore no
   checkable anything — while looking as complete as the other nine. That is what an unqualified
   artifact looks like from the inside, and it is why the halt conditions are the load-bearing clause
   in every instruction rather than the field lists.

**What this set does not do.** It does not seal anything. Two divergent instances per type is one
trial, not the two-plus that divergent-iteration discipline requires before generalising. It does not
resolve the pipeline naming collision — Samples 9 and 10 are both Sense A, and Sense B does not appear
here at all. And it proposes nothing for creation: every sample is fictional, in a fictional company,
with invented ID prefixes.

---

**Provenance.** Produced by Brain (Claude.ai), 2026-08-07, instantiating
`BRAIN-DRAFT_Five-Structural-Concepts_2026-08-07.md`. The Meridian domain is invented. All ten
samples are EXAMPLE-ONLY / NOT-YET-A-NODE. ID prefixes `OV-`, `PR-`, `WZ-`, `PL-` are invented for
legibility and are not proposed type codes. **Nothing here is CISEM state.**
