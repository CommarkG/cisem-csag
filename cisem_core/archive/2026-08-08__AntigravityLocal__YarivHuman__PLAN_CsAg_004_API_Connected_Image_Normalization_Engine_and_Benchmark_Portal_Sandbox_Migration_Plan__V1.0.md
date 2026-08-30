---
metadata:
  owner: "YarivHuman"
  version: "5.0"
  plan_id: "PLAN-CsAg-004"
  canonical_location: "C:\\Users\\finky\\.gemini\\antigravity\\brain\\c9d9679c-ed17-4a39-80de-5dd6cc829351\\implementation_plan.md"
---

# PLAN-CsAg-004: API-Connected Image Normalization Engine & Benchmark Portal (Sandbox Migration)

We are building the modular `Image Normalization Engine` in the Sandbox CsAg workspace. The system will connect OpenAI and Google Image generation APIs, support user-provided API keys in the UI to utilize free tier subscriptions, and run the `Crystal_Product_Normalization_v1.1` prompt template on the 10 batch assets.

## User Review Required

> [!NOTE]
> **Free Tier Strategy**:
> - The Google Adapter will connect to **Google AI Studio (Gemini API)** which offers a generous free tier for developers, rather than the paid enterprise Vertex AI platform.
> - **In-Memory User Keys**: We will add a **🔑 API Credentials** settings panel at the top of the Gradio dashboard. If the operator enters their own keys, the pipeline will use them *in-memory* for generation, falling back to the server's `.env` configurations only if blank.

---

## Proposed Changes

### Component 1: Image Normalization Engine API Adapters

Inside the new project home [`Marketing & Sales/Image processing`](file:///c:/Users/finky/Desktop/AntiGravity/Sandbox%20Csag/Marketing%20&%20Sales/Image%20processing) we will implement:
1. **Unified Engine Interface (`api/normalization_engine.py`)**:
   - Manages API client initialization dynamically based on the model selected and credentials supplied.
   - Standardizes input parameters: `Original Product Image`, `Target Reference Image`, and the prompt template (`Crystal_Product_Normalization_v1.1`).
2. **Google Adapter (`api/adapters/google_adapter.py`)**:
   - Connects to the **Google AI Studio** Gemini API.
   - Leverages Imagen 3 (free-tier enabled) with direct `subject_reference` and `style_reference` inputs for precise shape preservation.
3. **OpenAI Adapter (`api/adapters/openai_adapter.py`)**:
   - Connects to the OpenAI API.
   - Performs a multimodal pre-analysis on `gpt-4o` to draft the layout directives, then dispatches the job to `dall-e-3`.

#### [NEW] [normalization_engine.py](file:///c:/Users/finky/Desktop/AntiGravity/Sandbox%20Csag/Marketing%20&%20Sales/Image%20processing/api/normalization_engine.py)
#### [NEW] [google_adapter.py](file:///c:/Users/finky/Desktop/AntiGravity/Sandbox%20Csag/Marketing%20&%20Sales/Image%20processing/api/adapters/google_adapter.py)
#### [NEW] [openai_adapter.py](file:///c:/Users/finky/Desktop/AntiGravity/Sandbox%20Csag/Marketing%20&%20Sales/Image%20processing/api/adapters/openai_adapter.py)

---

### Component 2: Benchmark Runner Script

We will implement `2026-08-08__AntigravityLocal__YarivHuman__API_BenchmarkRunner__V1.0.py` inside the Sandbox CsAg project directory:
- Sequentially processes the queue assets using the unified `Crystal_Product_Normalization_v1.1` template.
- Outputs comparison files to `trials_output/api_benchmark/`.

#### [NEW] [API_BenchmarkRunner.py](file:///c:/Users/finky/Desktop/AntiGravity/Sandbox%20Csag/Marketing%20&%20Sales/Image%20processing/2026-08-08__AntigravityLocal__YarivHuman__API_BenchmarkRunner__V1.0.py)

---

### Component 3: Comparative Dashboard & User Key Settings

We will update the Gradio focused review dashboard `app_trial_dashboard_focused.py`:
- Add a top-level expandable **🔑 API Credentials & Model Settings** panel containing inputs for `Google API Key` and `OpenAI API Key`.
- Add a dropdown model selector (`DALL-E 3`, `Imagen 3 1K`, `Imagen 3 Pro`) under each comparison card to let users dynamically swap models.
- Build the **Scoring & Cost Matrix** table for side-by-side operator voting, committing results to `api_benchmark_scores` in `marketing_and_sales_hub.db`.

#### [MODIFY] [app_trial_dashboard_focused.py](file:///c:/Users/finky/Desktop/AntiGravity/Sandbox%20Csag/Marketing%20&%20Sales/Image%20processing/app_trial_dashboard_focused.py)
#### [MODIFY] [db_schema.py](file:///c:/Users/finky/Desktop/AntiGravity/Sandbox%20Csag/Marketing%20&%20Sales/Image%20processing/db_schema.py)

---

## Verification Plan

### Automated Tests
- Run `db_schema.py` to create the benchmark scoring table in SQLite.
- Execute a dry-run test of the Google AI Studio Imagen 3 adapter using an in-memory key to confirm generation.

### Manual Verification
- Load the dashboard, input a custom key in the settings panel, and trigger a generation to confirm the cache-busting pipeline displays the result.
