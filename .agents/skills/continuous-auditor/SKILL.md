---
name: "continuous-auditor"
description: "Monitors the workspace health, lints, types, and writes status to cael_status.json."
version: "1.2"
---

# Continuous Auditor Skill

This skill is running in the background as a daemon to continuously verify type compilation, schema integrity, and lint warnings.

## Invocation

Run the continuous auditor daemon:
```bash
python cisem_core/platform_core/2026-08-14__CISEM__AntigravityLocal__ContinuousAuditorDaemon__V1.3.py
```
