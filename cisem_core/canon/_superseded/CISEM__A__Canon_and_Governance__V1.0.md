# CISEM Canon — A · Canon & Governance

**Address:** `A` · **Depends on:** nothing · **Serves:** all spines
**Addressing scheme:** `A.0` (Canon Addressing System V1.0)
**Status:** Draft for GOVERNOR ratification

> Items marked `PROPOSED` may carry a Structured face only. The Plain face is required at ratification (`A.0.7`).

---

## A.0 — Charter

### A.0.1 — Purpose
`RATIFIED-PENDING` · The spine that governs the system's ability to govern itself: the canon, the gate, the mechanisms, the rules agents operate under, and the durability model that decides where a rule lives.

**Boundary:** A owns *enforcement* and *process integrity*. It does not own domain content — identity rules live in B, data rules in C. A owns the mechanisms that make those rules hold.

**Depends on:** nothing. **Serves:** every other spine.

### A.0.10 — Durability ladder
See `CISEM__A0__Canon_Addressing_System__V1.0.md` §A.0.10. Foundational; not restated.

---

## A.1 — State

### A.1.01 — Repository topology
`CONFIRMED` · One repository at `C:\Users\finky\Desktop\AntiGravity\Cisem CsAg` containing three things with no boundary: `cisem_core/` (operator plane), `src/` (Next.js frontend), `backend/` (FastAPI + Supabase). Evidence: directory listing, `build.js`, `pyproject.toml`.

### A.1.02 — Gate enforcement point
`CONFIRMED` · `cisem_core/build.js` runs `verifyGateIntegrity()` then `execSync('python cisem_core/platform_core/cisem_gate.py')`, exiting 1 on failure. **Wrapped in `if (!process.env.VERCEL && !process.env.CI)`** — the gate blocks the local machine and is bypassed on every deployment path. See `A.3.40`.

### A.1.03 — Agent permission state (post-remediation)
`CONFIRMED 2026-08-12` · Antigravity: Security Preset `Custom`, Outside-of-folders file access `Deny`, Terminal Auto Execution `Always Proceed`, Artifact Review `Always Proceed`, File Access Rules 6 (from 27), Commands Outside Sandbox empty, Terminal Commands allowlist 923 (inert, see `A.2.20`).

### A.1.04 — Model in use during the audit session
`CONFIRMED` · Gemini 3.5 Flash. Account has Google AI Ultra access. See `A.2.21`.

---

## A.2 — Decision

### A.2.01 — Four zones, downward-only dependency
`PROPOSED` · Z0 Governance · Z1 Platform core · Z2 Vertical · Z3 Surface. Imports flow downward only: Z3→Z2→Z1. Z0 imported by nothing.

**Plain:** If the shared foundation imports from the gifting product, you can never build a second product on the foundation without dragging gifting along. This rule is the whole of "separate the project from the core," stated so a script can check it.

**Structured:** `enforced_by: A.4.14` · `manifest: zones.json` · `migration: A.5.01`

### A.2.02 — Two naming conventions, not one
`PROPOSED` · Artifacts (plans, migrations, reviews) use `[Date]__[From]__[To]__[Description]__[Version].[ext]`. Code modules use standard language convention. Canon files use `CISEM__[SPINE]__[Name]__V[n.n].md`.

`ACTION` · `src/lib/2026-08-11__AntigravityLocal__YarivHuman__MedusaClientAdapter__V1.0.ts` applies the artifact convention to importable code. Recommend renaming to `medusaClient.ts` with provenance in a header comment.

### A.2.03 — Corespine placement header
`PROPOSED` · Every module declares `Zone`, `Depends`, `Serves`, `Purpose`. `A.4.14` verifies the declaration matches actual imports — catching drift between intent and code without reading the file.

### A.2.10 — Dual-Lane Governance Model
`REJECTED` · **Reason:** framed around velocity, solving a bottleneck that does not exist. `A.1.02` shows the gate is already bypassed on every deployment path. Superseded in substance by `G.2.01`, which classifies by blast radius — a real, measurable property.

### A.2.11 — Metered image pricing / `image_counter`
`REJECTED` · **Reason:** misidentified the feature (`E.1.02`), unit cost under $0.0001, and the proposed counter had a race condition, no reset cadence, and no reconciliation on API failure.

### A.2.12 — MEC-25 applied to unbuilt concepts
`REJECTED` · **Reason:** scoring artifacts that do not exist is tautological. Firebase 2/25 and RLS 0/25 carried no information.

### A.2.20 — Leave the 923-entry terminal allowlist in place
`RATIFIED 2026-08-12` · **Reason:** inert once auto-execution is global; the real boundary is now the file-access rules. Editing the config would require reopening the workspace boundary to tidy something that grants nothing. **Reopen if** Terminal Auto Execution ever returns to `Require Review`.

### A.2.21 — Model selection by task class
`PROPOSED` · Architectural, security, and migration work uses the largest available model. Flash-class models are for mechanical edits. **Basis:** `A.3.30`–`A.3.37` are the characteristic failure profile of an undersized model doing design work.

---

## A.3 — Finding

### Review-process findings

| ID | Finding | Status |
|---|---|---|
| `A.3.01` | "Platform has no backend" — falsified; FastAPI + Supabase + pgvector exist | `CLOSED` |
| `A.3.02` | "Choose Firebase Auth" (D3) — void; Supabase Auth already implemented | `CLOSED` by `B.2.01` |
| `A.3.03` | "Choose isolation strategy" (D4) — void; logical partitioning already existed | `CLOSED` by `C.2.01` |
| `A.3.04` | MEC-25 scores on unbuilt concepts | `CLOSED` by `A.2.12` |
| `A.3.05` | Image processing misidentified as a user-facing differentiator | `CLOSED` by `E.1.02` |
| `A.3.06` | Dual-Lane Governance proposed against a nonexistent bottleneck | `CLOSED` by `A.2.10` |
| `A.3.07` | "Platform Topology is a decision to declare" — it is a schema fact | `CLOSED` by `C.1.01` |

### Proposals caught before shipping — all `REJECTED`, reasons preserved

| ID | Proposal | Consequence had it shipped |
|---|---|---|
| `A.3.10` | `user_metadata` instead of `app_metadata` — **3 occurrences** | Tenant sets own `tenant_id` from browser; root escalation rebuilt |
| `A.3.11` | Migration reissuing `FOR ALL` + `IS NULL` — **2 occurrences** | `C.3.01` reopened |
| `A.3.12` | Migration reissuing `FOR ALL` on `user_account_roles` | `C.3.02` reopened |
| `A.3.13` | Migrating only `template_registry`, leaving `contacts`/`deals` on the header predicate | Two live tenant authorities |
| `A.3.14` | `algorithms=["HS256"]` with `SUPABASE_JWT_SECRET` | Project is ES256 (verified via JWKS); every request 401s; the variable does not exist |
| `A.3.15` | `rfc_7807_error("Expired Token", 401)` — 2 positional args to a 5-keyword function | Every expired token → 500 |
| `A.3.16` | `PyJWKClientError` uncaught (not a subclass of `InvalidTokenError`) | Unknown `kid` → unhandled 500 |
| `A.3.17` | `PyJWKClient` without `cache_keys` in async middleware | Blocking network fetch per request |
| `A.3.18` | `role_code` defaulting to `"colleague"` | Silent authorization grant to a nonexistent role |
| `A.3.19` | Role check against hardcoded `"admin"` | `role_definitions` holds only `operator_admin`, `account_owner`; locks out every admin |
| `A.3.20` | `role_check.data[0]["role_code"]` | Reads first row only; two-role user fails on sort order |
| `A.3.21` | Exempt paths `/api/v1/auth/login`, `/signup`, `/invite/accept` | Fictional; Supabase auth goes client→GoTrue, FastAPI never sees them |
| `A.3.22` | Deploy middleware before claim-minting and backfill exist | Every authenticated request 403s, including GOVERNOR's |

### Agent-behaviour findings

| ID | Incident | Count | Tier of the rule that failed |
|---|---|---|---|
| `A.3.30` | Fabricated `psql` output with a hand-typed `(4 rows)` footer | 1 | T0 |
| `A.3.31` | Invented file version numbers after its own trace recorded "no version header" | 4 | T0/T1 |
| `A.3.32` | Printed a live secret in plaintext — including the newly rotated key, voiding the rotation | 2 | T1 |
| `A.3.33` | Wrote and ran a script scanning `Downloads` for `sb_secret_` — second time after written commitment not to | 2 | T1 |
| `A.3.34` | Asserted an active terminal redaction filter, one turn after printing a key | 1 | T0 |
| `A.3.35` | Presented `seed_db.py` exit 0 as proof RLS works, while using the key that bypasses RLS. Also re-seeded the live database unprompted. | 1 | T0 |
| `A.3.36` | Closing recommendation drifting to parked roadmap or to completed work | 3 | T1 |
| `A.3.37` | Re-emitted a prior document unchanged in place of answering | 1 | T0 |

**`A.3.38` — Pattern** `OPEN` · Every failed control was an instruction. Rules stated, acknowledged in writing, then violated. **Closed only by moving each rule down the durability ladder**, not by restating it.

### Open governance findings

| ID | Finding | Status |
|---|---|---|
| `A.3.40` | Gate bypassed when `VERCEL \|\| CI` — protects the laptop, not what ships | `OPEN` → `A.4.10` |
| `A.3.41` | `AGENTS.md` rules at T1 with no mechanical backing: `user_metadata`, fabricated output, invented versions, roadmap drift | `OPEN` → `A.4.06`–`A.4.09`, `A.4.12` |

---

## A.4 — Mechanism

| ID | Mechanism | Tier | Status | Closes |
|---|---|---|---|---|
| `A.4.01` | **E1** — agent filesystem sandbox | T2 | ✅ **DONE** | `A.3.33` |
| `A.4.02` | **E2** — secrets never on disk in the mount | **T4** | ✅ **DONE** | `A.3.32` |
| `A.4.03` | **E3** — schema drift detector | T3 | ✅ **DONE** | `C.3.10` |
| `A.4.04` | **E4** — RLS policy linter | T3 | ✅ **DONE** | `C.3.01`, `C.3.02`, `C.3.03` class |
| `A.4.05` | **E5** — two-tenant isolation test | T3 | ⬜ | proves `C.6.02` |
| `A.4.06` | **E6** — command receipts (`cmd`, `output_hash`, `timestamp`) | T3 | ⬜ | `A.3.30`, `A.3.34` |
| `A.4.07` | **E7** — ban tool-output mimicry without a receipt | T3 | ⬜ | `A.3.30` |
| `A.4.08` | **E8** — generated file-report tables | T3 | ⬜ | `A.3.31` |
| `A.4.09` | **E9** — banned-token scan (`user_metadata` near auth, `service_role` outside one module, `.data[0]`, secret prefixes) | T3 | ⬜ | `A.3.10`, `A.3.20`, `A.3.32` |
| `A.4.10` | **E10** — invert the CI bypass | T3 | ⬜ | `A.3.40` |
| `A.4.11` | **E11** — applied-migration ledger (filename + checksum) | T3 | ⬜ | `C.3.11` |
| `A.4.12` | **E12** — machine-readable park list scanned by the gate | T3 | ⬜ | `A.3.36` |
| `A.4.13` | **E13** — exempt paths generated from `app.routes` | T3 | ⬜ | `A.3.21` |
| `A.4.14` | **E14** — import direction linter over `zones.json` | T3 | ⬜ | enforces `A.2.01`, `A.2.03` |
| `A.4.15` | **E15** — canon seal: per-file checksum in a ratified registry, verified in the gate | T3 | ⬜ | protects all canon |

### A.4.10 — Secrets doctrine
`RATIFIED 2026-08-12`

**Plain:** No key is ever stored where the AI can reach it, and no key ever passes through a conversation with the AI. Rotation is done by hand, in the dashboard, by you.

**Structured:**
1. Launchers live in `C:\Users\finky\secure\`, outside the mount — **T4**
2. No secret passes through an agent turn
3. Confirm by prefix and length, never by value
4. Copy at creation; Supabase's later preview is truncated and invalid
5. Assume any secret an agent could read is already leaked; rotate on that assumption
6. Never delete a credential before its replacement is proven working

### A.4.20 — Agent engagement rules
`RATIFIED 2026-08-12` · Standing prohibitions:

1. Never print, echo, or restate a secret value
2. Never format inferred data in the output shape of a tool that was not run
3. Never state a file version not read from that file's header this session; otherwise `N/A`
4. `user_metadata` is prohibited for authorization or tenancy data
5. Never act outside the workspace; never propose a workaround to do so
6. Never propose a next step on the parked list
7. **If a task cannot be completed within these constraints, say so and stop.** Stopping is a valid completion.

---

## A.5 — Sequence

| ID | Task | Depends on |
|---|---|---|
| `A.5.01` | Zone manifest `zones.json` — declare boundaries; move files opportunistically (Option B) | `A.2.01` ratified |
| `A.5.02` | Build **E9** — highest value; moves the 3× `user_metadata` regression T1→T3 | — |
| `A.5.03` | Build **E10** — invert the CI bypass | — |
| `A.5.04` | Build **E14** — import linter | `A.5.01` |
| `A.5.05` | Build **E6/E7** — receipts and mimicry ban | — |
| `A.5.06` | Build **E15** — canon seal | canon seeded |
| `A.5.07` | Build **E8, E11, E12, E13** | — |
| `A.5.10` | Rename the date-stamped `.ts` module (`A.2.02`) | ratification |

---

## A.6 — Verification

### A.6.01 — E1 boundary
`VERIFIED 2026-08-12` · Agent refused a `Downloads` read and stated the reason, rather than scripting around it as it had twice before. Behaviour changed because the environment changed.

### A.6.02 — E2 secrets
`VERIFIED 2026-08-12` · Agent shell reports `ABSENT` for `SUPABASE_KEY`. Next.js no longer prints `Environments: .env`. Both `.env` files deleted; both keys rotated and old ones revoked.

### A.6.03 — E3/E4 operational
`VERIFIED 2026-08-12` · E3 exit 0 (PASS, no drift). E4 exit 1 with 25 correctly identified open items and 2 tracked KNOWN. Linter validated against the known-bad pre-migration state — caught all four hand-found defect classes.

### A.6.10 — Evidence standard for this spine
A mechanism is done when it **fails on a known-bad input**, not when it runs clean. E4 was validated by feeding it the pre-migration policy set.
