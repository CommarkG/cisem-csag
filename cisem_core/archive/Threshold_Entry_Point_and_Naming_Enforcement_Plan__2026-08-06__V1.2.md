# Implementation Plan: Threshold Entry Point & Naming Enforcement
**Document ID**: CISEM-IP-20260806-THRESHOLD-NAMING  
**Version**: 1.2  
**Date**: 2026-08-06  
**Status**: DRAFT  
**Authority**: Governor Ratification Required  

---

## 1. Resolution: Dropping SupplierScraper & Relocating to Root

To eliminate project drift and keep core architectural elements centralized:
1.  **Drop `Supplier Scraper`**: We will completely delete the `Supplier Scraper CsAg` directory.
2.  **Root Frontend Migration**: The Next.js frontend application currently inside `Supplier Scraper CsAg/frontend` will be relocated to the workspace root `C:\Users\finky\Desktop\AntiGravity\`. The root folder itself becomes the primary unified Next.js dashboard portal for CISEM.
3.  **Root Backend Migration**: The FastAPI backend application currently inside `Supplier Scraper CsAg/backend` will be relocated to `C:\Users\finky\Desktop\AntiGravity\backend\`.
4.  **Registry Updates**: We will de-register `SUPPLIER_SCRAPER` and update the root `Universal_Workspace_and_Accountability_Registry` to reflect the root frontend and central backend structure.

---

## 2. Proposed Technical Steps

### Step 1: Directory Restructuring (Offline Transition)
*   Move `Supplier Scraper CsAg/frontend/*` to the workspace root `C:\Users\finky\Desktop\AntiGravity\`.
*   Move `Supplier Scraper CsAg/backend/*` to `C:\Users\finky\Desktop\AntiGravity\backend\`.
*   Delete the empty `Supplier Scraper CsAg` directory.

### Step 2: Naming Enforcement Script
We will update `cisem_gate.py` to check for versioned naming:
*   Before compilation, it checks if any newly edited implementation plans or walkthroughs in the private brain folder have a corresponding identical copy in the root matching the pattern: `<DocName>__YYYY-MM-DD__V<Version>.md`.
*   If the copy is missing or does not match the content hash of the private artifact, `cisem_gate.py` will exit with code `1`, blocking all execution tools.

### Step 3: Local Watcher (CxpWatcher) Refactor
*   Modify `CxpWatcher.py` (or rename to `CxpLocalWatcher.py`) to poll `C:\Users\finky\Desktop\AntiGravity\Marketing CoreHub CsAg\9000__INTERSYSTEM_EXECUTION_EXCHANGE` directly on disk using `os.listdir()`.
*   Bypass `googleapiclient` authentication to avoid DNS/SSL blocks.
*   Periodically output the running state to `C:\Users\finky\Desktop\AntiGravity\cael_status.json`.

### Step 4: Expose Status Endpoint
*   Expose `/api/v1/cael/status` in the root backend `backend/src/backend/main.py` to read `cael_status.json` and return daemon metrics.

### Step 5: Next.js Threshold Page UI
*   Expand `{currentMenu === "threshold" && (...)}` in `src/app/page.tsx` (now in the root) to display:
    *   **Daemon Monitor Panel** (PID, status, heartbeat).
    *   **MCE Form**: Shows current task, required outputs, and a button to approve/ratify.
    *   **CXP Event Log**: Scrollable panel of packet transitions.

---

## 3. Communication Handoff to Cloud GPT
We will write a packet response in the exchange folder acknowledging GPT's status report and stating:
> *"Local adapter has successfully received the CXP operating model update. We will provide our detailed comments and corrections regarding the CoreSpiral architectural review in a subsequent governed packet once the local Threshold path and naming enforcements are verified active."*

---

## 4. Verification Plan
*   **Verification 1**: Intentionally write an unversioned file; verify `cisem_gate.py` blocks compilation and prints a naming error.
*   **Verification 2**: Run the local watcher on disk; verify `TEST-001` completes via local file changes.
*   **Verification 3**: Open Next.js app, go to `/threshold`, and verify the dashboard successfully renders the daemon's heartbeat status and event log.
