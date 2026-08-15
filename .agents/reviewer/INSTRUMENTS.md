# CISEM SECURITY AND GOVERNANCE INSTRUMENTS
| Instrument Name | File Path | Invoker Boundary | Failure Behavior | Proof Status |
| :--- | :--- | :--- | :--- | :--- |
| `cisem_gate.py` | `cisem_core/platform_core/cisem_gate.py` | `python cisem_gate.py` | Calls `gate_block()`, exit code 1 | **FULL PASS** |
| `SecretLiteralLinter__V1.1.py` | `cisem_core/security/2026-08-14...SecretLiteralLinter__V1.1.py` | `subprocess` in Gate 19 | Scans secrets, exit code 1 on fallback | **FULL PASS** |
| `ContinuousAuditorDaemon` | `cisem_core/platform_core/...ContinuousAuditorDaemon__V1.3.py` | Background watcher daemon | Writes lint/type errors to `cael_status.json` | **FULL PASS** |
| `mbcs-verifier` | `.agents/skills/mbcs-verifier/SKILL.md` | Pre-review agent hook | Rejects headerless model turns | **PARTIAL PASS** |
| `pgvector-partition-auditor` | `.agents/skills/pgvector-partition-auditor/SKILL.md` | Agent DB schema hook | Reports missing HNSW vector index | **PARTIAL PASS** |
| `CisemAuditor.py` | `cisem_core/sandbox/CisemAuditor.py` | `python CisemAuditor.py` | Advisory LLM persona report | **FAILED** |
| `CisemATV.py` | `cisem_core/sandbox/CisemATV.py` | `python CisemATV.py` | Sandbox test execution runner | **FAILED** |