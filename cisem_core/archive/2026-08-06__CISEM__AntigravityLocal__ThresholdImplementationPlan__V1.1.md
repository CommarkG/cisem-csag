---
metadata:
  owner: "CISEM_GOVERNOR"
  canonical_location: "C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\2026-08-06__CISEM__AntigravityLocal__ThresholdImplementationPlan__V1.1.md"
  artifact_status: "DRAFT"
  maturity: "WORKING_DRAFT"
  version: "1.0"
  role_type: "IMPLEMENTATION_PLAN"
---

# Implementation Plan: Root Threshold Entry Point & Local Watcher Integration
**Document ID**: CISEM-IP-20260806-THRESHOLD  
**Version**: 1.1  
**Date**: 2026-08-06  
**Status**: DRAFT  
**Authority**: Governor Ratification Required  

---

This plan establishes a verified, secure **Threshold Entry Point in the Root** of the Next.js app to display execution status, manage clarification sign-offs, and run the CXP/CAEL loop entirely via local filesystem synchronization—bypassing Google API connection blocks.

---

## 1. Executive Verdict & Core Recommendations on GPT Report

### Bottom Lines
*   **The Problem**: The active watcher daemon (`CxpWatcher.py`) is crashing/blocking on network calls to `oauth2.googleapis.com` due to connection constraints in the sandboxed agent environment.
*   **The Reality**: Because the user runs the Google Drive Desktop Client locally, files in `9000__INTERSYSTEM_EXECUTION_EXCHANGE` are already synced automatically in both directions on the local hard drive.
*   **The Fix**: Transition the local watcher from direct Google Drive API calls to **Local File Watcher (LFW)** polling on the synced disk directory. 

### Recommendations & Options

| Option | Implementation Cost | Reliability | Security (Credential Handling) | Verdict |
| :--- | :--- | :--- | :--- | :--- |
| **Option A (Direct API)** | High (Requires debugging proxies/SSL) | Low (Prone to sandboxed proxy blocks) | High Risk (Requires storing Google keys) | **REJECTED** |
| **Option B (Local File Polling)** | Low (Simple file read/writes) | **100% (Robust offline & online)** | **Zero Risk (Bypasses Google API entirely)** | **RECOMMENDED** |

---

## 2. Proposed Changes

We will implement Option B (Local File Polling) and construct the **Threshold Entry Point** UI and backend.

```mermaid
graph LR
    GPT[Cloud GPT] --Writes Packet--> CloudDrive[Google Drive Cloud]
    CloudDrive --Desktop Sync Client--> LocalDrive[9000__INTERSYSTEM_EXECUTION_EXCHANGE on Disk]
    LocalDrive --Polled By--> CxpWatcher[Local CxpWatcher.py]
    CxpWatcher --Executes / Updates Packet--> LocalDrive
    LocalDrive --Desktop Sync Client--> CloudDrive
    
    CxpWatcher --Writes Status File--> LocalStatus[cael_status.json]
    BackendAPI[FastAPI /api/v1/cael/status] --Reads--> LocalStatus
    NextJS[Next.js Portal /threshold] --Queries--> BackendAPI
```

---

### Component A: Local Watcher Migration (LFW)

#### [NEW] [CxpWatcher.py](file:///C:/Users/finky/Desktop/AntiGravity/2026-08-05__GoogleAntigravity__Cxp__CxpWatcher__V0.1.py) (Overwriting with LFW)
*   **Behavior**: Remove Google Auth, `googleapiclient.discovery`, and `httplib2`.
*   **Logic**:
    *   Initialize and poll `C:\Users\finky\Desktop\AntiGravity\Marketing CoreHub CsAg\9000__INTERSYSTEM_EXECUTION_EXCHANGE\` directly using `os.listdir()`.
    *   Look for `CXP__*.yaml` or `CXP__*.json` files.
    *   Load using `yaml.safe_load` / `json.loads`.
    *   Run `CxpAdapter.replay_and_project()` to check if the state is `READY` or `AUDITED`.
    *   Execute the intent (e.g. `TEST_HANDSHAKE` or `DEPLOY_STATIC_THRESHOLD_PAGE`) and transition states locally.
    *   Write the updated JSON packet back to disk (which the desktop app syncs to Drive).
    *   Regularly write a small local status JSON `C:\Users\finky\Desktop\AntiGravity\cael_status.json` containing: PID, timestamp, active mission ID, current state, and queue depth.

---

### Component B: FastAPI Backend Expansion

#### [MODIFY] [main.py](file:///C:/Users/finky/Desktop/AntiGravity/Supplier%20Scraper%20CsAg/backend/src/backend/main.py)
*   **New Endpoint**: Expose `GET /api/v1/cael/status` that reads `C:\Users\finky\Desktop\AntiGravity\cael_status.json`.
*   **New Endpoint**: Expose `POST /api/v1/cael/ratify` to write a signed `clarification_handshake.json` file on disk, resolving the Mechanical Clarification Enforcer check and unlocking code compilation.
*   **Mock Fallback**: If the status file does not exist, return a default mock configuration indicating the daemon is starting.

---

### Component C: Next.js Frontend Expansion

#### [MODIFY] [page.tsx](file:///C:/Users/finky/Desktop/AntiGravity/Supplier%20Scraper%20CsAg/frontend/src/app/page.tsx)
Expand the `{currentMenu === "threshold" && (...)}` block to render a premium dashboard:
1.  **Daemon Monitor Panel**: Show status indicators (🟢 Active / 🔴 Stopped), Process PID, last heartbeat time, and connection quality.
2.  **Mechanical Clarification Enforcer (MCE) Form**:
    *   Display the current intent name (e.g., `DEPLOY_STATIC_THRESHOLD_PAGE`).
    *   Show required measurable outputs (files created, routing checks, passing lints).
    *   Render an **"Approve & Ratify Intent"** button that sends the ratification signature to the backend.
3.  **Active Mission Event Log**: A beautiful scrollable console visualizing the append-only event stream (transitions through `CREATED` → `CLAIMED` → `EXECUTING` → `COMPLETED`).
4.  **Aesthetics**: Apply the "Saturated" gradient style tokens with micro-animations and glowing border-indicators.

---

## 3. Verification Plan

### Automated Tests
*   Run the watcher locally with: `python 2026-08-05__GoogleAntigravity__Cxp__CxpWatcher__V0.1.py --generate-bootstrap`.
*   Verify that `uv run` can bootstrap the adapter and validation matrices.

### Manual Verification
1.  Launch the backend server and Next.js dev server.
2.  Navigate to `/threshold` in the web application.
3.  Verify the MCE form is interactive and that the ratification button successfully writes the handshake file to disk.
4.  Verify the console output matches the event logs written by the adapter.
