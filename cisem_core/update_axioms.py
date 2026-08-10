# ratified_plan: CRUEL-REVIEW-AX70000-CONSOLIDATED-V1.0
# governor_signature: GOV-YARIV-20260809-CONSOLIDATED-APPROVED
# version: V1.0
# reasoning: |
#   Script to generate AxiomsAndPrinciples V1.28 from V1.27 by adding PR-76000.

import os
import time

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
v127_path = os.path.join(ROOT_DIR, "2026-08-07__CISEM__AntigravityLocal__AxiomsAndPrinciples__V1.27.md")
v128_path = os.path.join(ROOT_DIR, "2026-08-07__CISEM__AntigravityLocal__AxiomsAndPrinciples__V1.28.md")

if not os.path.exists(v127_path):
    print(f"Error: V1.27 axioms not found at {v127_path}")
    exit(1)

with open(v127_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update metadata header
old_loc = 'canonical_location: "C:\\\\Users\\\\finky\\\\Desktop\\\\AntiGravity\\\\Cisem CsAg\\\\2026-08-07__CISEM__AntigravityLocal__AxiomsAndPrinciples__V1.27.md"'
new_loc = 'canonical_location: "C:\\\\Users\\\\finky\\\\Desktop\\\\AntiGravity\\\\Cisem CsAg\\\\2026-08-07__CISEM__AntigravityLocal__AxiomsAndPrinciples__V1.28.md"'
content = content.replace(old_loc, new_loc)

content = content.replace('version: "1.27"', 'version: "1.28"')

# 2. Insert PR-76000 after PR-75600
pr75600_text = """### PR-75600: SWIFT Trials — Provisional Execution Under AX-75000
*   **Definition**: SWIFT Implementation (`PR-84900`) and `AX-75000` are complementary. When tactical necessity requires immediate action, the SWIFT deployment serves as Trial Run #1. The corresponding `PARK-xxx` item must carry `swift_trial_run: 1` and `minimum_required: 3`. Two additional runs must be completed before placeholder promotion to permanent canonical solution.
*   **Derivation**: Derived from `AX-75000` and `PR-84900`."""

pr76000_text = """### PR-75600: SWIFT Trials — Provisional Execution Under AX-75000
*   **Definition**: SWIFT Implementation (`PR-84900`) and `AX-75000` are complementary. When tactical necessity requires immediate action, the SWIFT deployment serves as Trial Run #1. The corresponding `PARK-xxx` item must carry `swift_trial_run: 1` and `minimum_required: 3`. Two additional runs must be completed before placeholder promotion to permanent canonical solution.
*   **Derivation**: Derived from `AX-75000` and `PR-84900`.

### PR-76000: SWIFT Placeholder Verification Gate
*   **Definition**: The compiler gate must mechanically enforce that all @swift_placeholder or [SWIFT]: tags reference a valid PARK-xxx item containing active trial run markers. Any unmapped or non-trial placeholder blocks compilation.
*   **Derivation**: Derived from `AX-75000` and `PR-75600`."""

if pr75600_text in content:
    content = content.replace(pr75600_text, pr76000_text)
else:
    # Try normalized spacing
    normalized_pr75600 = pr75600_text.replace("\r\n", "\n")
    normalized_content = content.replace("\r\n", "\n")
    if normalized_pr75600 in normalized_content:
        normalized_content = normalized_content.replace(normalized_pr75600, pr76000_text.replace("\r\n", "\n"))
        content = normalized_content
    else:
        print("Error: Could not locate PR-75600 section in Axioms file.")
        exit(1)

# 3. Add history entry
history_anchor = "- **2026-08-09T21:05:00Z**: Added Pillar 70000 (Statistical Maturity & Validated Decision-Making) sub-principles AX-75000 and PR-75100 through PR-75600. (GOOGLE_ANTIGRAVITY_ADAPTER - Version 1.27)"
new_history = history_anchor + "\n- **2026-08-09T21:10:00Z**: Added PR-76000 (SWIFT Placeholder Verification Gate) to Pillar 70000. (GOOGLE_ANTIGRAVITY_ADAPTER - Version 1.28)"

if history_anchor in content:
    content = content.replace(history_anchor, new_history)
else:
    normalized_anchor = history_anchor.replace("\r\n", "\n")
    normalized_content = content.replace("\r\n", "\n")
    if normalized_anchor in normalized_content:
        normalized_content = normalized_content.replace(normalized_anchor, new_history.replace("\r\n", "\n"))
        content = normalized_content
    else:
        print("Warning: Could not locate history anchor block.")

with open(v128_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"SUCCESS: Created {v128_path}")
