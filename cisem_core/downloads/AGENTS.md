<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:cisem-agent-reporting-rules -->
# CISEM Document Reporting & Versioning Enforcement — MANDATORY LOCAL SAVED DEFAULT

Whenever any file is created, modified, or referenced in a response turn, the agent MUST automatically copy the file to `cisem_core/downloads/` and output a direct, working local download link in `file:///` format pointing to `file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/downloads/<filename>`.

Do NOT rely on HTTP server links (`http://localhost:3000/...`). Always copy files to `cisem_core/downloads/` and provide direct `file:///` links that open locally on disk.

Example format:
- *Full Filename*: `2026-08-25__AntigravityLocal__YarivGovernor__MasterConsolidatedExecutionPlan__V2.0.md`
- *Active Version*: `Version 2.0`
- *Clickable Link*: [MasterConsolidatedExecutionPlan V2.0](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/planning/2026-08-25__AntigravityLocal__YarivGovernor__MasterConsolidatedExecutionPlan__V2.0.md)
- *Local Download Link*: [Download Local MD File](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/downloads/2026-08-25__AntigravityLocal__YarivGovernor__MasterConsolidatedExecutionPlan__V2.0.md)
<!-- END:cisem-agent-reporting-rules -->
