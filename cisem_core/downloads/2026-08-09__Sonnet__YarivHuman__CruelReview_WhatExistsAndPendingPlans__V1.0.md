<!--
# CISEM CODE HEADER > MANDATORY
# ratified_plan: N/A — Audit and Review Document
# governor_signature: GOV-YARIV-REVIEW-MANDATE-20260809
# version: V1.0
# reasoning: |
#   Fierce, unfiltered critical review of all existing files, infrastructure,
#   and pending plans as of 2026-08-09. Written at Governor mandate.
#   Parent principles: AxiomsAndPrinciples V1.26 > AX-10000, PR-13000, PR-13990.
-->

# CISEM Cruel Review — What Exists and Pending Plans
**Date**: 2026-08-09  
**Reviewer**: Antigravity (Gemini 2.5 Pro)  
**Mandate**: Governor-issued. Fierce but polite.  

---

## 0. Executive Verdict

The platform is architecturally rich on paper and functionally hollow in execution.
The documentation-to-running-code ratio is approximately 40:1.
The planning-to-validated-impact ratio is approximately 8:1.
Most "validated_impact" statuses in the parking vault were self-awarded during planning turns,
not measured post-deployment.

This is not a failing project. It is a pre-launch project suffering from planning addiction.

---

## 1. The Single Biggest Theater Item: The Entire App Calls a Dead Backend

### 1.1. Finding
page.tsx (3,583 lines) calls http://localhost:8000 approximately 17+ times for:
brief qualification, catalog search, proposal generation, PDF generation,
subcontractor registration, customer workspace creation, persona fetching,
template fetching, backlog operations, and stock live-check.

### 1.2. The Problem
http://localhost:8000 is the Supplier Scraper CsAg backend — which the Governor
officially placed out of scope until September 2026.
Every button, every form, every panel silently fails or catches a console.error.

### 1.3. Why This Is Theater
The platform LOOKS operational: navigation bar, dark mode, CRM tab, design studio.
But every data fetch returns a network error. The CRM Pipeline shows hardcoded mock deals.
Templates are empty. Backlog is empty. All persona data is empty.
This is theater: a working interface rendering a completely non-functional system.

### 1.4. Root Resolution Path
LOCAL: Audit every fetch("http://localhost:8000/...") call. For each:
  A) Mock it with realistic fixture data until the backend exists.
  B) Connect it to an existing Next.js API route.
  C) Disable the panel with a "Coming in September" placeholder.

CORE RULE: No UI panel may call an external backend URL not verified as active
before every release checkpoint. cisem_gate.py must scan page.tsx for localhost:PORT
calls and cross-reference against known_active_services.json. Unverified = BLOCKED.

HOW AGENTS DETECT: gate catches at pre-build; validation_metrics must include
backend_dependency_verified field.

---

## 2. Model Router: Architecture Document Without an Engine

### 2.1. Finding
cisem_core/routing/ contains ONLY: Dockerfile + docker-compose.yml.
ZERO source code files. No package.json. No src/. No index.ts.
The Dockerfile runs npm run build and expects dist/index.js that does not exist.

### 2.2. Why This Is Theater
The ModelRouterArchitectureBlueprint is excellent. It describes account rotation,
p50/p95 latency scoring, cascading fallback. None of this exists in code.
docker compose up would fail at COPY package*.json because there is no package.json.

### 2.3. Root Resolution Path
LOCAL: Create cisem_core/routing/src/index.ts (actual proxy server),
cisem_core/routing/package.json with express, http-proxy-middleware.
NOT done until docker compose up succeeds and a real curl returns an LLM response.

CORE RULE: A Dockerfile in the registry MUST have a companion package.json or
requirements.txt in the same directory. Dockerfile without dependencies = Theater Artifact.

---

## 3. Parking Vault: 19 Self-Awarded validated_impact Statuses

### 3.1. Finding
Vault status distribution: 19 validated_impact, 8 parked, 1 ratified.

### 3.2. The Problem
None of the 19 validated_impact entries contain:
- outcome_measurement field
- delta_percentage measurement (except PARK-005 which is a gap, not a success)
- timestamp of when measurement was taken vs. when plan was executed
- measurement_method description
Statuses were marked DURING planning conversations, not after deployment verification.

### 3.3. Root Resolution Path
LOCAL: Audit every validated_impact entry. Answer: What was expected? What was measured?
When? Entries that cannot answer must be downgraded to ratified_pending_measurement.

CORE: validated_impact status BLOCKED by schema validation unless outcome_measurement,
measurement_timestamp, and outcome_delta_pct fields are populated.
cisem_gate.py must run yamale schema enforcement on vault before any registry commit.

AGENT PREVENTION: "An agent may not set validated_impact during a planning turn."

---

## 4. CisemAuditor.py: Keyword Matching Is Not Expert Review

### 4.1. Finding
The multi-persona auditor triggers personas based on keyword presence in hardcoded mock diffs:
"def access_check(): token = bypass_token; if admin_bypass: unlock_privileges() # backdoor"
This is a self-fulfilling test. The auditor is guaranteed to find the keywords it was seeded with.
No actual platform code is being audited.

### 4.2. The Problem
There is no mechanism to feed a real git diff into the auditor.
No substantive expert reasoning (just: "Triggered by: keyword match ['bypass']").
Not integrated into the gate before a plan is ratified.

### 4.3. Root Resolution Path
LOCAL: Add --diff-file argument to CisemAuditor.py. Wire to read real git diff.
Each persona comment must include which axiom/principle is at risk.

CORE: Graduate from keyword matching to AST-based analysis OR real LLM calls per persona.
Gate rule: "A plan may not enter implementation until CisemAuditor.py has been run
against the specific plan diff and produced a non-BLOCKED verdict."

AGENT DETECTION: Gate checks last_auditor_run_timestamp in plan metadata.
If older than last file modification, gate blocks.

---

## 5. Workspace Root: 13 Orphan Version Files — Document Swamp

### 5.1. Finding
Workspace root contains 13 sequential versions of the same document:
Consolidated_Ingestion_Routing... V1.5 through V1.16, plus V1.3, V1.4 variants.
Plus multiple Gate_Hardening_, Sandbox_Trial_, Threshold_, Witness_Positioning_ docs.

### 5.2. Why This Is Theater
GEMINI.md Section 2 enforces naming with version increments but NOT deprecation
of superseded versions. Every document looks "current." None are definitively superseded.

### 5.3. Root Resolution Path
LOCAL: Create cisem_core/archive/. Move all non-latest versions there.
Workspace root should contain ZERO planning documents.

CORE: cisem_gate.py must scan workspace root for .md files not in root-approved list.
Any file at root depth triggers WORKSPACE.CONTAMINATION warning.

---

## 6. tenant_context.ts: The Security Fallback Is an Open Backdoor

### 6.1. Finding
If TENANT_SIGNING_SECRET is not set AND no header is sent:
function returns full enterprise/admin session automatically.

In local development — the ONLY current deployment — TENANT_SIGNING_SECRET
is almost certainly not set. Every request succeeds with admin enterprise privileges.

### 6.2. Root Resolution Path
LOCAL: Remove the double-null fallback. Replace with NODE_ENV===development guard.
Add TENANT_SIGNING_SECRET=dev-secret-9999 to .env and .env.example.

CORE: cisem_gate.py must scan .env.example for all required security env vars.
Missing variables = gate block.
Axiom: "All cryptographic guards must log WARNING on every development fallback activation."

---

## 7. Sandbox Folder: Plans Without Code

### 7.1. Finding
sandbox/ contains: crm/, knowledge_hub/, landing_page/, social_media/, vocabulary/, website/
— every folder contains ONLY a README.md.
Marketing and Image Processing plans are registered but sandbox is empty scaffolding.

### 7.2. Root Resolution Path
CORE: Gradual trial protocol must add gate: "A sandbox directory may not remain README-only
for more than 2 development sessions after registration."

IMMEDIATE ACTION: Build the first minimal trial component — a standalone landing page
generator that does not depend on any external backend. THIS is the declared next trial.

---

## 8. dist/ Folder: Wrong Directory, Wrong Purpose

### 8.1. Finding
/dist/ contains ZIP archives, .ts files, .tsx files, .py services, and a SQL schema.
In a Next.js project, /dist/ is RESERVED for compiled build output.
Using it as a deliverables archive is a naming collision.
npm run build will contaminate or conflict with these files.

### 8.2. Root Resolution Path
LOCAL: Rename /dist/ to /cisem_core/deliverables/.
CORE: cisem_gate.py: /dist/ is reserved. Any manually created file in /dist/ = WORKSPACE.CONTAMINATION.

---

## 9. 10-Turn Audit Loop: Planned But Never Running

### 9.1. Finding
Rule 8 in AGENTS.md: improvement loop fires at maturity signals, min 3 turns, max 15.
cisem_turn_counter.json exists. Dashboard reads it. But:
- Nothing auto-increments the counter.
- ATV only runs when manually executed as a Python script.
- No event that reads the counter and triggers an ATV run.

### 9.2. Why This Is Theater
The turn counter is a number in a JSON file. No feedback loop to anything.
The entire self-correction system is scripts that only run when a human decides to run them.

### 9.3. Root Resolution Path
LOCAL: Wire turn counter increment into /api/agent/chat/route.ts POST handler.
Add /api/system/trigger-atv endpoint. Dashboard shows audit_required: true when ceiling hit.

CORE: Improvement loop must be event-driven, not script-driven.
Axiom: "No improvement loop may depend on human memory to trigger it."

---

## 10. How Agents Default Into Theater — Root Cause

### 10.1. The Pattern
Agent creates plan → declares it "ratified" → writes document → marks parking vault
validated_impact → moves on.
Missing step always: connecting the output to something that RUNS and is MEASURED.

### 10.2. Prevention at Planning Stage
Add to AGENTS.md (mandatory anti-theater gate):

  ANTI-THEATER PLANNING GATE — Required Before Any Implementation Is Declared Done:
  1. Can I run it right now? (If no: it is not done)
  2. What is the measurable output I will observe? (If "I will document it": it is not done)
  3. Who or what will verify it is still working in 7 days? (If "manual check": add auto-trigger)

---

## 11. What Is Genuinely Solid (Not Theater)

- /api/dashboard/route.ts: Reads real filesystem files, parses registry, verifies tenant. Functional.
- /api/agent/chat/route.ts: OpenRouter + Gemini dual-route with Twenty CRM tool calling. REAL code. Works when keys are set.
- /api/download/route.ts: Exists and serves downloads.
- tenant_context.ts: HMAC-SHA256 implementation is correct. Only fallback needs hardening.
- CisemATV.py: Maturity scoring model, assumption diffuser, root cause registry are sophisticated and real.
- AxiomsAndPrinciples.md V1.26: The document itself is exceptionally mature. Sound enterprise-grade rules.

---

## 12. Priority Resolution Order (Keystone Sequencing)

Priority 1 — Fix Dead Backend Dependency (unlocks 8 UI panels, real user testing, chat demo)
  Audit all localhost:8000 calls. Mock, redirect, or disable each panel.

Priority 2 — Build Model Router Engine (unlocks multi-model routing, cost control)
  Add src/index.ts to cisem_core/routing/. Make Docker runnable.

Priority 3 — Harden tenant_context.ts Fallback (unlocks real security boundary)
  Remove silent admin fallback. Add .env.example.

Priority 4 — Wire Turn Counter Auto-Increment (unlocks CAEL loop, automatic ATV)
  Add increment to chat route. Add /api/system/trigger-atv endpoint.

Priority 5 — Archive Workspace Root Documents (unlocks clean context for future sessions)
  Move 13+ orphan files to cisem_core/archive/.

Priority 6 — Harden cisem_gate.py with Theater-Detection Rules (prevents recurrence)
  Add checks: localhost dependency, Dockerfile sans manifest, workspace contamination,
  validated_impact without measurement fields.

---

## 13. Recommended Immediate Next Step

13.1. RECOMMENDATION: Approve Priority 1 (Dead Backend Fix) as the next implementation session.

13.2. REASONING: The platform cannot demonstrate a single end-to-end user flow.
The chat widget IS connected to a working /api/agent/chat/route.ts — but renders inside
a UI where every surrounding panel silently fails. Fixing the dead dependencies by mocking
them or switching to the working Next.js API layer will make the platform demonstrable.

13.3. WHAT THIS UNLOCKS: Chat widget demo-ready with Twenty CRM tool calling.
Dashboard shows real registry metrics. Platform moves from architectural draft to working prototype.

13.4. WHAT HAPPENS IF WE DON'T: Every additional plan adds to the 40:1 doc-to-code ratio.
The platform remains impressive on paper and invisible in practice.

---
*End of Cruel Review V1.0 — 2026-08-09*
