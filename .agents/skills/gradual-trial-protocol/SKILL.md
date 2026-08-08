---
name: "gradual-trial-protocol"
description: "Enforces a gradual batch trial process for validating features, workflows, or data processing pipelines, preventing premature scale."
---

# Yariv Gradual Trial Protocol (Y-GTP)

This skill governs all feature trials, pipeline executions, and batch processing experiments on the CISEM platform. It enforces a strict, incremental validation sequence to ensure quality metrics are met before scaling.

---

## 1. Core Principle
> "There is no point in jumping to batch processing if results are not ratified on multiple types and gradually batch stress tested."
- **The Golden Rule**: The target is never to process massive batches (e.g., 3,000 items) all at once. Always scale in balanced, quantity-controlled, validated increments.

---

## 2. The 4-Step Gradual Validation Sequence

Every new processing pipeline or data ingestion run must follow this sequence:

### Step 1: Test One Classic (N = 1)
- **Action**: Run the process on a single, classic representative candidate.
- **Goal**: Reach perfect execution results, profile the telemetry, and define the baseline success criteria.

### Step 2: Stress-Test Variations (N = 3 Diverse Types)
- **Action**: Select 3 different/diverse candidates to challenge the baseline definition.
- **Goal**: Stress-test the boundaries, enhance the parser/pipeline to support all variations, and achieve perfect results across all 3.

### Step 3: Small-Batch Verification (3 of Each Type)
- **Action**: Take 3 candidates of each validated type and run them concurrently.
- **Goal**: Confirm coordination, verify concurrency locks, and adjust performance parameters until execution is flawless.

### Step 4: Geometric Batch Scaling (6 → 12 → 24 → ...)
- **Action**: Double the batch size sequentially (6 of each, then 12 of each, then 24, etc.).
- **Goal**: Measure performance, verify memory/resource stability at each milestone, and halt scaling immediately if a quality delta exceeds 10%.
