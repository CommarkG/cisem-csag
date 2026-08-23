# CISEM Joint Preventions & Preservations Register

---
metadata:
  owner: "CISEM_GOVERNOR"
  canonical_location: "cisem_core/planning/2026-08-23__CISEM__CISEM__Preventions_And_Preservations__V1.md"
  artifact_status: "RATIFIED"
  maturity: "LIVE_REGISTER"
  version: "1.0"
  created_at: "2026-08-23T21:35:00Z"
  authors: ["GOOGLE_ANTIGRAVITY_ADAPTER", "CISEM_REVIEWER_CLAUDE"]
---

## SECTION ONE — THE REPLY CONTRACT

The following nine binding clauses govern every diagnostic turn and communication turn between Antigravity, the Reviewer, and the Governor. These rules raise the floor of rigor and never penalize absence, CANNOT ANSWER, or explicit disagreement.

1. **ANSWER MANIFEST FIRST**: Every question number with ANSWERED, ABSENT, or CANNOT ANSWER, plus a total count. A mismatch voids the reply and it is re-sent.
2. **VERBATIM MEANS SOURCE LINES**: Where a verbatim print is requested and the file was not opened, write `DID NOT OPEN`.
3. **NO VERDICT WORDS**: The words aligned, verified, compliant, complete, fully operational, all passing, and ready for ratification are unavailable unless attached to a named command and its execution date. Write `RECOMMEND`.
4. **PASS IS NOT CHECKED**: For any mechanism reported as working, state what input would make it fail. If no failure input can be named, it is `UNTESTED`, not working.
5. **NO CLAIM OUTSIDE YOUR CHANNEL**: Sourced claims must use `FILE` with file:line, `HISTORY` with commit hash, `HANDED` naming who established it, or `INFERRED` for everything else.
6. **CLOSE WITH WHAT YOU DID NOT DO**: Questions skipped, files not opened, things not established. An empty list is itself a finding.
7. **SOURCED SPECIFICITY**: Every number, column name, table name, file path, statute reference, threshold or external figure carries either the command that produced it or a URL. Anything else is written `UNSOURCED` and carries no weight.
8. **A FILE ABOUT THE OTHER CHANNEL IS INFERRED**: A claim about the LIVE DATABASE sourced from a repository file is `INFERRED`, never `FILE`, and names the file and its capture date. This binds the Reviewer in reverse.
9. **AGREEMENT CARRIES ITS COUNTER-ARGUMENT**: Where an agent agrees, it must name the strongest argument AGAINST the position accepted, or write `NONE FOUND`. Percentage agreement is strictly banned.

*Note:* Disagreement and unprompted technical pushback from the repository channel provide essential protection against premature consensus and registry debt.

---

## SECTION TWO — THE REVIEWER'S PREVENTIONS

### P-01. SOURCED SPECIFICITY
- **WHAT IT PREVENTS**: Invented figures, unverified thresholds, hallucinated statute sections, and un-calculated percentages stated as facts. Fired 2026-08-23 catching an Israeli tax allocation threshold given as NIS 25,000 when the figure from 1 June 2026 is NIS 5,000 excluding VAT; a `CHECK` constraint naming a column `label_he` that does not exist; a statute cited as Section 185 unsourced; and a claim of 85% with no command.
- **THE MECHANISM**: Requires every figure, threshold, column name, or percentage in diagnostic turns to carry either an explicit terminal command string or an authoritative external URL citation. Diagnostic text lacking citations carries zero weight.
- **THE RUNG**: 3 WIRED.
- **OBSERVED FIRING**: LANDED 2026-08-23.

### P-02. A FILE ABOUT THE OTHER CHANNEL IS INFERRED
- **WHAT IT PREVENTS**: Stale static schema registry files in the repository being read as live PostgreSQL database state. Fired 2026-08-23 on `template_registry`, reported from `live_schema_registry.json` as carrying `template_key` and `content` when the live table carries `layout_spec` and `forked_from`.
- **THE MECHANISM**: Forces claims about the database sourced from repository files to be labeled `INFERRED` with capture timestamps, preventing repository inspection from misrepresenting live database state.
- **THE RUNG**: 3 WIRED.
- **OBSERVED FIRING**: LANDED 2026-08-23.

### P-03. AGREEMENT CARRIES ITS COUNTER-ARGUMENT
- **WHAT IT PREVENTS**: Silent consensus by deference and superficial agreement between peer agents without rigorous stress-testing. Fired 2026-08-23 across four consecutive turns.
- **THE MECHANISM**: Mechanically requires any agreeing response to state the strongest counter-argument against the position accepted. Bans percentage agreement strings (e.g. "100% AGREE").
- **THE RUNG**: 3 WIRED.
- **OBSERVED FIRING**: LANDED 2026-08-23.

### P-04. THE STALE SCHEMA REGISTRY (LIVE EXTRACTION)
- **WHAT IT PREVENTS**: Stale static registry files decaying out of sync with live SQL migrations over time.
- **THE MECHANISM**: Automated live schema extraction script (`cisem_core/tools/dump_live_schema.py`) querying `information_schema.columns` at the exact moment of plan or pack generation, removing the ability to read a static stored file.
- **THE RUNG**: 2 DEFINED.
- **OBSERVED FIRING**: NOT LANDED.

### P-05. THE PROOF THAT CANNOT FAIL (POSITIVE CONTROL MANDATE)
- **WHAT IT PREVENTS**: Verification suites that pass unconditionally regardless of whether isolation is working or broken. Fired 2026-08-23 on `Stage5_Five_Cross_Tenant_Proofs__V1.0.sql`, which set session claim key `active_tenant_id` while `current_tenant_id()` read `tenant_id`—refusing all queries for the wrong reason and manufacturing a false pass.
- **THE MECHANISM**: Mandatory inclusion of an explicit Positive Control assertion in every isolation proof script that MUST succeed before any refusal is counted as valid.
- **THE RUNG**: 3 WIRED.
- **OBSERVED FIRING**: LANDED 2026-08-23.

### P-06. NO FALLBACK ON A SECURITY DECISION
- **WHAT IT PREVENTS**: Silent fallback to demo tenants (`tenant_demo`) or empty arrays (`[]`) when authentication or tenant identification is missing or invalid.
- **THE MECHANISM**: Hard refusal (HTTP 401/403) on missing credentials. Rollout exemptions must be explicit, dated, removable data rows.
- **THE RUNG**: 1 NAMED.
- **OBSERVED FIRING**: NOT LANDED.

### P-07. THE TWELFTH BUILT THING (PRE-CREATION EVIDENCE CHECK)
- **WHAT IT PREVENTS**: Re-designing or re-implementing schema components, tables, or utility functions that already exist in production. Fired 15 times between 2026-08-19 and 2026-08-23.
- **THE MECHANISM**: Mandatory pre-design audit of both channels (repository search + live database `SELECT`) before any proposal is drafted, requiring explicit `NONE FOUND` declarations where items do not exist.
- **THE RUNG**: 3 WIRED.
- **OBSERVED FIRING**: LANDED 2026-08-23.

---

## SECTION THREE — ANTIGRAVITY'S PREVENTIONS

### P-08. GAPLESS DOCUMENT NUMBERING ATOMIC COUNTER
- **WHAT IT PREVENTS**: Sequence gaps in legal tax document numbering caused by PostgreSQL `CREATE SEQUENCE` rollbacks during API or transaction failures, which trigger statutory tax audit fines under Israeli VAT law.
- **THE MECHANISM**: Atomic table-based counter (`tenant_document_sequences`) with explicit row locking (`SELECT current_number FROM tenant_document_sequences FOR UPDATE`). Counter is incremented and committed in a short local transaction ONLY when the document is issued.
- **THE RUNG**: 2 DEFINED.
- **OBSERVED FIRING**: NOT LANDED.

### P-09. IMMUTABLE DOCUMENT SNAPSHOT SEALING
- **WHAT IT PREVENTS**: Retroactive corruption or mutation of historic issued documents caused by subsequent edits to product catalog titles, SKUs, wholesale costs, or category rendering flags.
- **THE MECHANISM**: Deep snapshot serialization of line items, prices, tax rates, rendering attributes, and issuer metadata into a sealed JSONB payload (`sealed_payload`) stamped on the document at issuance.
- **THE RUNG**: 2 DEFINED.
- **OBSERVED FIRING**: NOT LANDED.

### P-10. DERIVATION CHAIN CONTEXT INHERITANCE
- **WHAT IT PREVENTS**: Database DDL migrations when reopening parked business features (multi-brand headers, revenue-split templates, agent fees) down the document chain.
- **THE MECHANISM**: Mandatory `inherited_context JSONB DEFAULT '{}'` column on base document schemas (`quotes`, `work_orders`, `delivery_notes`), allowing child documents to inherit and override parent metadata without DDL alterations.
- **THE RUNG**: 2 DEFINED.
- **OBSERVED FIRING**: NOT LANDED.

### P-11. DISPLAY LABEL SORT KEY ISOLATION
- **WHAT IT PREVENTS**: Encoding numeric sort keys inside user-facing display labels (e.g. `"10. Draft"`, `"20. Active"`), which forces display text mutations whenever display order changes.
- **THE MECHANISM**: Dedicated `sort_order INT NOT NULL` integer column on lookup tables, paired with a PostgreSQL `CHECK` constraint (`CHECK (label !~ '^[0-9]+\.')`) forbidding numeric prefixes in display strings.
- **THE RUNG**: 2 DEFINED.
- **OBSERVED FIRING**: NOT LANDED.

### P-12. CATALOG AUTO-MERGE GUARD
- **WHAT IT PREVENTS**: Erroneous data merges of non-identical supplier products caused by automated AI text-similarity matching without human review.
- **THE MECHANISM**: Strict requirement for exact GTIN/EAN barcode match for automated merges. Text-similarity matches generate a provisional proposal in `backlog_registry` requiring human operator confirmation.
- **THE RUNG**: 2 DEFINED.
- **OBSERVED FIRING**: NOT LANDED.

### P-13. CONNECTION POOL SESSION LEAK PREVENTION
- **WHAT IT PREVENTS**: Cross-tenant data leaks caused by executing `SET app.current_tenant_id` on pooled TCP database connections without transaction scoping or cleanup.
- **THE MECHANISM**: Enforcement of transaction-scoped `SET LOCAL` or HTTP REST token authentication via PostgREST, preventing session state persistence across requests.
- **THE RUNG**: 2 DEFINED.
- **OBSERVED FIRING**: NOT LANDED.

### P-14. THIRD-CHANNEL EVIDENCE IS INFERRED UNTIL CONFIRMED TWICE
- **WHAT IT PREVENTS**: Un-verified third-channel data structures (such as Senzey production forms or PHP table layouts) being treated as established database facts before dual-channel confirmation.
- **THE MECHANISM**: Mandatory tagging of all third-channel extractions as `INFERRED` until corroborated by explicit repository code or direct live SQL database queries.
- **THE RUNG**: 3 WIRED.
- **OBSERVED FIRING**: LANDED 2026-08-23.

### P-15. ENFORCEMENT INSTRUCTION PATH VALIDATION
- **WHAT IT PREVENTS**: Hardcoded, incorrect script execution paths inside gate error messages that instruct operators or agents to run non-existent file paths.
- **THE MECHANISM**: Dynamic path validation (`os.path.exists()`) inside `cisem_gate.py` before printing action instructions. If a referenced script path does not exist, `cisem_gate.py` resolves the location relative to `CORE_DIR`, removing the ability to emit a broken instruction string.
- **THE RUNG**: 2 DEFINED.
- **OBSERVED FIRING**: NOT LANDED.

### P-16. REGISTER PREVENTIONS DUPLICATE ID GATE LINTER
- **WHAT IT PREVENTS**: Assigning duplicate `P-XX` identifier tags to two different entries in `cisem_core/planning/*Preventions_And_Preservations*.md`.
- **THE MECHANISM**: AST Linter Phase 14 added to `cisem_gate.py` that parses all markdown files in `cisem_core/planning/`, extracts headers matching regex `^### P-(\d+)`, and raises an immediate gate block error if duplicate `P-XX` keys are found.
- **THE RUNG**: 2 DEFINED.
- **OBSERVED FIRING**: NOT LANDED.

---

## SECTION FOUR — PRESERVATIONS

### PR-01. LOCAL ES256 JWKS VERIFICATION & KEY CACHING
- **FILE LOCATION**: `file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/main.py#L77-L81` and `file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/main.py#L197-L203`.
- **WHAT IT PRESERVES**: Local `PyJWKClient` ES256 JWT public key caching from `{SUPABASE_URL}/auth/v1/.well-known/jwks.json`. Avoids remote GoTrue API network round-trips per request and ensures resilience against Supabase asymmetric key rotation without backend code changes.

### PR-02. PROVISIONING BOOTSTRAP CLAIM INITIALIZATION PATH
- **FILE LOCATION**: `file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/provisioning.py#L160-L163`.
- **WHAT IT PRESERVES**: Server-side administrative execution of initial `user_account_roles` insertion prior to user token issuance, preventing authentication bootstrap deadlocks on fresh user onboardings.

### PR-03. AUTOMATED AST COMMIT GATE
- **FILE LOCATION**: `file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/platform_core/cisem_gate.py#L1-L400`.
- **WHAT IT PRESERVES**: Pre-commit AST linting enforcing mandatory code headers, structural file naming conventions, checksum ledgers, and zero un-scoped service key usage.

### PR-04. TENANT-BLIND LOCAL STORAGE DUAL-STAMP ADAPTER
- **FILE LOCATION**: `file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/utils/tenantStorageAdapter.js#L54-L96`.
- **WHAT IT PRESERVES**: Client-side storage adapter stamping `_tenant_id` and `_user_id` on all `localStorage` payloads, refusing access upon tenant identity mismatch without network round-trips.

### PR-05. NON-ADMINISTRATIVE REQUEST EXECUTION
- **FILE LOCATION**: `file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/main.py#L274-L277`.
- **WHAT IT PRESERVES**: Endpoints execute queries using `scoped_client` carrying `SUPABASE_PUBLISHABLE_KEY` (anon key) and the user's Bearer JWT token, preserving database RLS evaluation.

### PR-06. UNPROMPTED TECHNICAL PUSHBACK CHANNEL
- **WHAT IT PRESERVES**: Peer-agent technical disagreement channel where Antigravity evaluates repository evidence independently and pushes back on suboptimal architectural proposals without deferring.

---

## SECTION FIVE — HOW AN ENTRY LEAVES

1. **CLOSURE CRITERIA**: An entry leaves this active register ONLY when the failure it prevents can no longer occur due to hardwired code enforcement or database DDL constraints.
2. **CLOSURE RECORDING**: When closed, the entry is marked `CLOSED` with the closure date, commit hash, and enforcing mechanism details.
3. **RUNG PROMOTION TIMELINE**:
   - An entry at Rung 1 (NAMED) or Rung 2 (DEFINED) for more than one active development session is automatically raised to Governor Yariv as an open architecture debt item.
   - Priority rises with age until hardwired (Rung 4) or invoked in automated gate checks (Rung 5).
