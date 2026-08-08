# Marketing & Sales Hub CsAg — Verification & Walkthrough

This document summarizes the changes made to implement the hardened SQLite schema, the multi-engine SWIFT trial harness, and the Gradio human-in-the-loop dashboard.

---

## 1. Accomplished Work

We deployed the following core modules inside the [marketing-and-sales-engine](file:///C:/Users/finky/Desktop/Claude%20Code/Core%20Sights%20Platform/marketing-and-sales-engine) folder:

### Hardened Database Schema
*   **File Created**: [`db_schema.py`](file:///C:/Users/finky/Desktop/Claude%20Code/Core%20Sights%20Platform/marketing-and-sales-engine/db_schema.py)
*   **Database Initialized**: `marketing_and_sales_hub.db`
*   **Key Controls**:
    - Journal mode set to **WAL** (Write-Ahead Logging) for safe local reads/writes.
    - Strict SQLite `CHECK` constraints to prevent VLM enum-value drifting.
    - Foreign key constraints (e.g. `trial_results` referencing `award_assets` with `ON DELETE CASCADE`).

### SWIFT Trial Harness
*   **File Created**: [`trial_harness.py`](file:///C:/Users/finky/Desktop/Claude%20Code/Core%20Sights%20Platform/marketing-and-sales-engine/trial_harness.py)
*   **Core Behaviors**:
    - Wraps `rembg-isnet` (standard V1), `birefnet-matting` (standard V2 via PyTorch), and a guided prompted segmentation mode (`sam2-guided`).
    - Computes **alpha gradient metrics** (`soft_edge_ratio` and `facet_preservation_score`) to programmatically judge quality.
    - Saves transparent PNG cutouts and white-background JPEG previews under a local output directory.
    - Persists latencies, metrics, and filepaths to `trial_results`.

### Comparison & Voting Dashboard
*   **File Created**: [`app_trial_dashboard.py`](file:///C:/Users/finky/Desktop/Claude%20Code/Core%20Sights%20Platform/marketing-and-sales-engine/app_trial_dashboard.py)
*   **Interface Capabilities**:
    - Queue-based review showing unvoted assets first.
    - Multi-viewport layout comparing the original image with cutouts from all 3 engines.
    - Background mode selector to toggle between white and transparent views.
    - One-click voting buttons that record preferences directly into SQLite.

---

## 2. Test Execution & Telemetry Results

We ran the SWIFT trial harness locally on a sample award image (`ast_test_001`):

*   **Database Setup**: Initialized database file cleanly at `C:\Users\finky\Desktop\Claude Code\Core Sights Platform\marketing-and-sales-engine\marketing_and_sales_hub.db`.
*   **FK Checks**: Verified that trying to log trial results without the asset first existing in `award_assets` triggered a correct SQLite `FOREIGN KEY constraint failed` error (confirming active structural enforcement).
*   **Harness Trial Results**:
    *   **`rembg-isnet`**: Latency: **3,598.8 ms** | Soft-Edge Ratio: **0.0329**
    *   **`birefnet-matting`**: Latency: **21,866.9 ms** | Soft-Edge Ratio: **0.0188**
    *   **`sam2-guided`**: Latency: **1,951.2 ms** | Soft-Edge Ratio: **0.0329**

All files were successfully saved under the local directory:
`C:\Users\finky\Desktop\Claude Code\Core Sights Platform\marketing-and-sales-engine\trials_output/`

---

## 3. Physical Variations Trial Ingestion & Execution

Under the Governor's gradual verification protocol, we executed the trial harness on 3 distinct material variations:

1. **`ast_var_a` (Optical Crystal with Subsurface Laser Engraving - `8fa67c98_5X5_3D_4_.jpg`)**:
   * `rembg-isnet`: Latency: **4,216.6 ms** | Soft-Edge: **0.0342**
   * `birefnet-matting`: Latency: **22,823.0 ms** | Soft-Edge: **0.0149**
   * `sam2-guided`: Latency: **2,346.2 ms** | Soft-Edge: **0.0342**

2. **`ast_var_b` (Acrylic + Wood Pedestal Base - `scan_b1667773_Ferring_award_1_layeracrylic.jpg`)**:
   * `rembg-isnet`: Latency: **1,817.0 ms** | Soft-Edge: **0.3450**
   * `birefnet-matting`: Latency: **13,654.0 ms** | Soft-Edge: **0.0959**
   * `sam2-guided`: Latency: **2,172.6 ms** | Soft-Edge: **0.3450**

3. **`ast_var_c` (Glass + UV Print - `1e26b4f4_מעמדאקרילהנפקהדיסקונטקפיטלליטושייהלוםכולל3פאזותהדפסהדוצדדית1.jpeg`)**:
   * `rembg-isnet`: Latency: **1,997.3 ms** | Soft-Edge: **0.0510**
   * `birefnet-matting`: Latency: **12,909.8 ms** | Soft-Edge: **0.0120**
   * `sam2-guided`: Latency: **2,178.5 ms** | Soft-Edge: **0.0510**

---

## 4. Gradio Dashboard Launch

* **File Modified**: [`app_trial_dashboard.py`](file:///C:/Users/finky/Desktop/Claude%20Code/Core%20Sights%20Platform/marketing-and-sales-engine/app_trial_dashboard.py) was updated to resolve a Gradio 6 deprecation crash (`AttributeError: module 'gradio' has no attribute 'Divider'`). We replaced the divider with a clean HTML separator (`hr`).
* **Active Status**: Server launched as background process `task-194`, running at `http://127.0.0.1:7860`.

