# CISEM SECURITY AND GOVERNANCE INSTRUMENTS
> Derived 100% dynamically from disk scan. Zero hardcoded lists. Documentation (.md) strictly excluded from invokers.

| Instrument Name | Relative File Path | Invoker Boundary | Failure Behavior | Proof Status |
| :--- | :--- | :--- | :--- | :--- |
| `2026-08-14__CISEM__AntigravityLocal__ContinuousAuditorDaemon__V1.3.py` | `cisem_core/platform_core/2026-08-14__CISEM__AntigravityLocal__ContinuousAuditorDaemon__V1.3.py` | NO INVOKER FOUND | Writes metrics to `cael_status.json` | **PARTIAL PASS** |
| `2026-08-14__CISEM__AntigravityLocal__ContinuousAuditorLivenessCheck__V1.0.py` | `cisem_core/platform_core/2026-08-14__CISEM__AntigravityLocal__ContinuousAuditorLivenessCheck__V1.0.py` | NO INVOKER FOUND | Writes metrics to `cael_status.json` | UNPROVEN |
| `2026-08-14__CisemCsAg__Security__SecretLiteralLinter__V1.0.py` | `cisem_core/security/2026-08-14__CisemCsAg__Security__SecretLiteralLinter__V1.0.py` | `cisem_core/security/2026-08-14__CisemCsAg__Security__SecretLiteralLinter__V1.0.py` | NO EXPLICIT FAILURE BEHAVIOR DETECTED | UNPROVEN |
| `2026-08-14__CisemCsAg__Security__SecretLiteralLinter__V1.1.py` | `cisem_core/security/2026-08-14__CisemCsAg__Security__SecretLiteralLinter__V1.1.py` | `cisem_core/platform_core/cisem_gate.py`, `cisem_core/security/2026-08-14__CisemCsAg__Security__SecretLiteralLinter__V1.1.py` | NO EXPLICIT FAILURE BEHAVIOR DETECTED | **PARTIAL PASS** |
| `CisemATV.py` | `cisem_core/sandbox/CisemATV.py` | `cisem_core/platform_core/2026-08-14__CISEM__AntigravityLocal__ContinuousAuditorDaemon__V1.3.py`, `cisem_core/platform_core/cisem_gate.py` | Exits code 1 / `gate_block()` | **PARTIAL PASS** |
| `CisemAuditor.py` | `cisem_core/sandbox/CisemAuditor.py` | `cisem_core/platform_core/2026-08-14__CISEM__AntigravityLocal__ContinuousAuditorDaemon__V1.3.py`, `cisem_core/platform_core/cisem_gate.py` | Exits code 1 / `gate_block()` | **PARTIAL PASS** |
| `CisemSanitizer.py` | `cisem_core/sandbox/CisemSanitizer.py` | `cisem_core/cxp/2026-08-05__GoogleAntigravity__Cxp__CxpWatcher__V0.1.py` | NO EXPLICIT FAILURE BEHAVIOR DETECTED | **PARTIAL PASS** |
| `admin-journey-simulator` | `.agents/skills/admin-journey-simulator/SKILL.md` | NO INVOKER FOUND | NO EXPLICIT FAILURE BEHAVIOR DETECTED | **PARTIAL PASS** |
| `cisem_gate.py` | `cisem_core/platform_core/cisem_gate.py` | `cisem_core/platform_core/cisem_gate.py`, `scratch/fix_and_gate.py` | Exits code 1 / `gate_block()` | **PARTIAL PASS** |
| `continuous-auditor` | `.agents/skills/continuous-auditor/SKILL.md` | NO INVOKER FOUND | Writes metrics to `cael_status.json` | **PARTIAL PASS** |
| `dependency-graph-visualizer` | `.agents/skills/dependency-graph-visualizer/SKILL.md` | `.agents/hooks.json` | NO EXPLICIT FAILURE BEHAVIOR DETECTED | **PARTIAL PASS** |
| `file-reporting-download` | `.agents/skills/file-reporting-download/SKILL.md` | NO INVOKER FOUND | NO EXPLICIT FAILURE BEHAVIOR DETECTED | **PARTIAL PASS** |
| `gate-keeper` | `.agents/skills/gate-keeper/SKILL.md` | `.agents/hooks.json` | NO EXPLICIT FAILURE BEHAVIOR DETECTED | **PARTIAL PASS** |
| `gradual-trial-protocol` | `.agents/skills/gradual-trial-protocol/SKILL.md` | NO INVOKER FOUND | NO EXPLICIT FAILURE BEHAVIOR DETECTED | **PARTIAL PASS** |
| `mbcs-verifier` | `.agents/skills/mbcs-verifier/SKILL.md` | NO INVOKER FOUND | Rejects non-compliant turn contract | **PARTIAL PASS** |
| `pgvector-partition-auditor` | `.agents/skills/pgvector-partition-auditor/SKILL.md` | `.agents/hooks.json` | NO EXPLICIT FAILURE BEHAVIOR DETECTED | **PARTIAL PASS** |
| `registry-updater` | `.agents/skills/registry-updater/SKILL.md` | NO INVOKER FOUND | NO EXPLICIT FAILURE BEHAVIOR DETECTED | **PARTIAL PASS** |
| `stock_verifier.py` | `backend/src/backend/stock_verifier.py` | NO INVOKER FOUND | NO EXPLICIT FAILURE BEHAVIOR DETECTED | UNPROVEN |