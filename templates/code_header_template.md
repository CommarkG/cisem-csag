# CISEM Mandatory Code Header — Template
**File:** `2026-08-06__CISEM__AntigravityLocal__CodeHeaderTemplate__V1.0.md`
**Version:** 1.0
**Ratified by:** GOV-YARIV-20260806-GATE-HARDENING-V1.0

---

## Purpose

Every Python source file, daemon script, or utility written within the CISEM platform **must** begin with the following header block in a docstring or comment. The `cisem_gate.py` Phase 3 check scans the first 50 lines of each submitted file and will exit 1 if this header is absent.

---

## Template (copy-paste into every new source file)

```python
#!/usr/bin/env python3
"""
# CISEM CODE HEADER — MANDATORY
# ratified_plan: <PLAN-ID e.g. CISEM-IP-20260806-GATE-HARDENING>
# governor_signature: <GOV-YARIV-YYYYMMDD-SHORT-PLAN-ID>
# version: V1.0
# reasoning: |
#   This file implements [WHAT IT DOES — be specific].
#   It resolves [PLAN-ID] and addresses [PARK-ID if applicable].
#   Architectural reasoning: [WHY this approach was chosen over alternatives].
#   Keystone impact: [What does completing this file unlock or enable?]
#   Parent principles: AxiomsAndPrinciples V1.12, §[PILLAR-ID], §[PR-ID].
"""
```

---

## Rules

1. **Every field is mandatory.** Blank or placeholder values (`<...>`) will fail the gate.
2. **`ratified_plan`** must match a plan ID that either:
   - Exists as a ratified entry in `parking_vault_draft.yaml`, OR
   - Carries a direct `GOV-YARIV-` signature (logged for next audit cycle).
3. **`governor_signature`** must begin with `GOV-YARIV-` exactly.
4. **`reasoning`** must be human-readable prose — not a copy of the plan title.
5. **`version`** must be incremented whenever the file is substantively changed.

---

## Example — Correctly Filled Header

```python
#!/usr/bin/env python3
"""
# CISEM CODE HEADER — MANDATORY
# ratified_plan: CISEM-IP-20260806-GATE-HARDENING
# governor_signature: GOV-YARIV-20260806-GATE-HARDENING-V1.0
# version: V2.0
# reasoning: |
#   This file is the root enforcement gate for the CISEM platform.
#   It implements four-phase blocking: .gate_lock detection, sync check,
#   mandatory header validation, and Parking Vault linkage. Completing
#   this file directly unblocks: Code Header enforcement, AI-Pocket wrapper,
#   Watcher-Lock readout, and the 10-Turn Audit loop.
#   Parent principles: AxiomsAndPrinciples V1.12 §AX-10000, §PR-13900.
"""
```

---

*This template is part of the CISEM platform's hardwired Senior Builder protocol.*
*Governed by: AGENTS.md §6 (Mandatory Reasoning Headers in Code).*
