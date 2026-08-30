# CISEM WORKSPACE ARCHIVING & KNOWLEDGE SYNC AUDIT REPORT V1.0
**Date:** 2026-08-30
**Governor:** Yariv

### 1. DIRECTORY SYNC RECOMMENDATION FOR PROJECT KNOWLEDGE
- src/: (~2.1 MB) Component source code, UI views, stores, hooks, API route adapters.
- cisem_core/platform_core/: (~450 KB) cisem_gate.py, compliance gates, live_schema_registry.json, plan manifests.
- ackend/src/backend/: (~380 KB) migrations.sql, FastAPI routes, database models, RLS policy definitions.
- cisem_core/tools/: (~120 KB) Playwright E2E test harnesses (LoggedInE2ETest.py), proof generators.
- Total Sync Footprint: ~3.0 MB.

### 2. ARCHIVE STATUS VERDICT
- Preserved Root Files: AGENTS.md, GEMINI.md, README.md, CLAUDE.md.
- Moved 150 historical markdown files to cisem_core/archive/.
