---
metadata:
  owner: "CISEM_GOVERNOR"
  canonical_location: "C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\2026-08-06__CISEM__AntigravityLocal__IgnitionGapAnalysis__V1.0.md"
  artifact_status: "DRAFT"
  maturity: "WORKING_DRAFT"
  version: "1.0"
  role_type: "WALKTHROUGH"
---

# CISEM Core: Ignition Use Cases & Gap Analysis (v1.0.0)

This audit analyzes the **15 Ignition Scenarios** that trigger execution cycles, identifies the architectural gaps in our current Local Gateway Gates (LGG) and Workspace Guard (CWG) designs, and outlines the remedies to close them.

---

## Part 1: The 15 Ignition Use Cases

### 1. Human Drop of Supplier Catalog Excel File
*   *Trigger*: A Partner drops `catalog_2026.xlsx` into the Drive exchange.
*   *Intent*: Ingest and parse supplier items into the Postgres database.

### 2. Human Ingestion of Customer Brief Document (PDF/Docx)
*   *Trigger*: A Buyer uploads `client_brief.docx` to Drive.
*   *Intent*: Clarify constraints and extract product options.

### 3. Human Slash Command `/goal` in Chat
*   *Trigger*: Operator Admin types `/goal build dynamic matrix viewer` in the portal.
*   *Intent*: Autonomously compile a new registered template layout.

### 4. Automated Scheduled Poller (Hourly Heartbeat)
*   *Trigger*: A cron schedule triggers the CxpWatcher daemon to check connectivity.
*   *Intent*: Audit and report runtime service status.

### 5. Webhook from External Billing System (Stripe Payment Success)
*   *Trigger*: Stripe calls `/api/v1/billing/webhook` for a Pro Tier upgrade.
*   *Intent*: Dynamically update project tier limits in the Registry.

### 6. Sub-Project Pre-Build Compiler Gate Check Failure
*   *Trigger*: Local compiler runs `cisem_gate.py` and detects unaligned configs.
*   *Intent*: Halt build and trigger a local quarantine process.

### 7. Workspace Guard Directory Drift Alert
*   *Trigger*: An agent attempts to write an unapproved file on disk.
*   *Intent*: Move file to `.quarantine/` and block gateway.

### 8. Cloud Orchestrator Event Rollback Sync
*   *Trigger*: Cloud Orchestrator detects a validation failure in Drive packet.
*   *Intent*: Reset local adapter to last known stable state.

### 9. Guest User Requesting Anonymous Scraper Preview
*   *Trigger*: Guest clicks "Test Scraper" on landing page form.
*   *Intent*: Run a single-site query under restricted sandbox limits.

### 10. Partner Admin Modifying Style Tokens via UI Switcher
*   *Trigger*: Partner selects "Saturated theme" in header.
*   *Intent*: Toggle HTML attributes on Vercel Edge middleware.

### 11. Multi-Model Audit Review Gate Activation
*   *Trigger*: Reviewer adapter detects a complete code package in Drive exchange.
*   *Intent*: Activate code review cycle condition checks.

### 12. Local Environment Network Disconnection Recovery
*   *Trigger*: Watcher daemon detects SSL protocol connection failure.
*   *Intent*: Enter local offline mode and preserve active state in memory.

### 13. Operator Admin Granting Delegated Approval
*   *Trigger*: Top Admin clicks "Delegate" on a sub-tenant's template checklist.
*   *Intent*: Issue a limited-time signature key.

### 14. Inintersystem API Call from External Module
*   *Trigger*: A separate project (e.g. Planning Core) calls `/api/v1/cael/status`.
*   *Intent*: Fetch daemon uptime and queue depth.

### 15. Auto-Scaling Queue Threshold Violation
*   *Trigger*: Active task queue length exceeds 10 packets.
*   *Intent*: Trigger an alert to provision additional watcher instances.

---

## Part 2: Gap Analysis & Technical Remedies

### Gap 1: Semantic Injection via File Ingestion (Use Case 1 & 2)
*   *The Gap*: An uploaded Excel or Word file can contain instructions ("prompt injection") that command the parser agent to bypass the registry check.
*   *The Remedy*: **MCE Input Sanitization Layer**. The parser engine must extract *only structured values* (rows, text strings) and never pass raw file text directly to the agent's executable prompts without validating them against a strict structural parser schema first.

### Gap 2: Race Condition in Watcher Sync (Use Case 7 & 8)
*   *The Gap*: If a file creation is blocked by the Workspace Guard but the watcher daemon has already synced the draft packet to Google Drive, the cloud orchestrator will process an unaligned state.
*   *The Remedy*: **Lock-Before-Sync Transaction Protocol**. The local watcher daemon must require a verification handshake from `WorkspaceReconciler.py` *before* attempting to push any file state to Google Drive.

### Gap 3: Edge Middleware Token Sync Latency (Use Case 10)
*   *The Gap*: When a partner switches their theme token in the UI, Vercel Edge caching might serve the old theme for up to 30 seconds, causing layout shift warning logs.
*   *The Remedy*: **Header-Bypassed Client Hydration**. If `x-matrix-applied-skin` is switched, the client-side app immediately loads the local storage fallback token override, while the Edge cache updates asynchronously in the background.

### Gap 4: Local Offline State Desynchronization (Use Case 12)
*   *The Gap*: If the internet cuts out while a task is in `EXECUTING` state, the local adapter will continue running, but the cloud registry will think it is hung or dead, triggering a duplicate run.
*   *The Remedy*: **Heartbeat Lease Times**. A claimed packet has a lease time (e.g., 5 minutes). If the local daemon does not renew the lease, the cloud orchestrator locks the packet and transitions it to `BLOCKED`.
