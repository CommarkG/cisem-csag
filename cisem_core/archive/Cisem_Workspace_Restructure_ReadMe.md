# CISEM Workspace Restructuring

Welcome to your new unified project workspace root: **`Cisem CsAg`**!

All codebases, universal spines, master registries (CoreHubs), and external solutions have been safely migrated and adjusted to run directly from this directory.

---

## 1. Active Services Deployed
The following services are currently running successfully under this new root directory:
1.  **FastAPI Backend**: Running on `http://127.0.0.1:8000` (`task-1771`).
2.  **Next.js Frontend**: Running on `http://localhost:3000` (`task-1775`).
3.  **Local Watcher Daemon**: Running in LFW disk polling mode on the intersystem folder (`task-1767`).

---

## 2. Universal Elements Decoupled
We have relocated and adjusted the following files:
*   `CisemSync.py` & `cisem_gate.py` are now at the root of `Cisem CsAg` and run automatically on compiles.
*   `CxpWatcher.py` and `CxpAdapter.py` are now at the root of `Cisem CsAg`, completely decoupled from any sub-project imports.
*   Internal path bindings inside `CxpWatcher.py`, `CxpAdapter.py`, and `backend/src/backend/main.py` have been automatically rewritten to match the new `Cisem CsAg` directory tree.

---

## 3. Recommended Actions
> [!IMPORTANT]
> To resume development cleanly:
> 1. Close your active folder in Cursor/VS Code (which is currently open at `AntiGravity` or `Supplier Scraper CsAg`).
> 2. Select **Open Folder...** in your editor and choose:
>    `C:\Users\finky\Desktop\AntiGravity\Cisem CsAg`
