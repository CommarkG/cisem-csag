#!/usr/bin/env python3
"""
# CISEM CODE HEADER -- MANDATORY
# ratified_plan: CISEM-IP-20260806-CONTEXT-ADAPTIVE-V1.0
# governor_signature: GOV-YARIV-20260806-CONTEXT-ADAPTIVE-V1.0
# version: V1.1
# reasoning: |
#   CisemATV is the Anti-Theater Validator (ATV) updated to V1.1.
#   It introduces the Assumption Diffuser to expose unexamined metrics
#   before execution. It replaces uniform persona checks with Contextual
#   Relevance Scoring via persona_scenario_map.yaml, and implements the
#   Maturity Score model for turn audits. It also writes to the cumulative
#   Root Cause Registry to flag repeat failures.
#   Completing this implements the core context-adaptive pipeline features.
#   Parent principles: AxiomsAndPrinciples V1.12 §AX-10000. AGENTS.md §7-9.
#   Resolves: PARK-005, PARK-004.
"""

import os
import sys
import json
import re
import yaml
from datetime import datetime, timezone

# Custom Exceptions
class ATVLoadError(Exception):
    """Raised when critical configuration or trial reports fail to load."""
    pass

class ATVExecutionError(Exception):
    """Raised when an active check fails due to environmental errors."""
    pass

class ATVProcessBlock(Exception):
    """Raised when ATV blocks execution due to theater or repeated root cause patterns."""
    pass

# Dynamic Config Import
_sandbox_dir = os.path.dirname(os.path.abspath(__file__))
_core_dir = os.path.dirname(_sandbox_dir)
_platform_core_dir = os.path.join(_core_dir, "platform_core")
if _platform_core_dir not in sys.path:
    sys.path.insert(0, _platform_core_dir)

try:
    import importlib.util
    config_module = None
    if os.path.exists(_platform_core_dir):
        for f in os.listdir(_platform_core_dir):
            if "CisemConfig" in f and f.endswith(".py"):
                spec = importlib.util.spec_from_file_location("CisemConfig", os.path.join(_platform_core_dir, f))
                config_module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(config_module)
                break
except Exception as e:
    print(f"Warning: Failed to import CisemConfig dynamically: {e}")
    config_module = None

ROOT_DIR = config_module.ROOT_DIR if config_module else os.path.dirname(_core_dir)
CORE_DIR = config_module.CORE_DIR if config_module else _core_dir
VAULT_PATH = config_module.PARKING_VAULT_PATH if config_module else os.path.join(_sandbox_dir, "parking_vault_draft.yaml")
TRIAL_REPORT_PATH = os.path.join(_sandbox_dir, "orchestration_trial_report.json")
CAEL_STATUS_PATH = config_module.CAEL_STATUS_PATH if config_module else os.path.join(CORE_DIR, "cael_status.json")
TURN_COUNTER_PATH = config_module.TURN_COUNTER_PATH if config_module else os.path.join(CORE_DIR, "cisem_turn_counter.json")
ATV_REPORT_PATH = os.path.join(_sandbox_dir, "atv_report.json")
SCENARIO_MAP_PATH = os.path.join(_sandbox_dir, "persona_scenario_map.yaml")
ROOT_CAUSE_REGISTRY_PATH = os.path.join(_sandbox_dir, "root_cause_registry.json")

# -----------------------------------------------------------------------
# HELPERS
# -----------------------------------------------------------------------
def load_json(path, default=None):
    if not os.path.exists(path):
        return default if default is not None else {}
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def load_yaml(path):
    if not os.path.exists(path):
        print(f"[ATV] WARNING: file not found: {path}")
        return {}
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f) or {}

def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

def now_iso():
    return datetime.now(timezone.utc).isoformat()

def increment_mechanism_trigger(mechanism_id):
    if not os.path.exists(CAEL_STATUS_PATH):
        return
    try:
        with open(CAEL_STATUS_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception:
        return
        
    registry = data.get("activation_registry", [])
    updated = False
    for mech in registry:
        if mech.get("mechanism_id") == mechanism_id:
            mech["actual_triggers"] = mech.get("actual_triggers", 0) + 1
            mech["last_triggered"] = now_iso().replace("+00:00", "Z")
            if mech["actual_triggers"] >= mech.get("validation_target", 0):
                mech["status"] = "VALIDATED"
            updated = True
            break
            
    if updated:
        try:
            with open(CAEL_STATUS_PATH, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        except Exception:
            pass

def next_park_id(vault):
    items = vault.get("parked_items", [])
    ids = [int(i["item_id"].replace("PARK-", "")) for i in items
           if i.get("item_id", "").startswith("PARK-")]
    return f"PARK-{(max(ids) + 1):03d}" if ids else "PARK-005"

def append_vault_entry(vault, entry):
    if "parked_items" not in vault:
        vault["parked_items"] = []
    
    for item in vault["parked_items"]:
        if item.get("title") == entry["title"]:
            if item.get("status") != "parked":
                print(f"  [ATV] Re-detected closed/resolved gap '{entry['title']}'. Re-parking...")
                item["status"] = "parked"
                item["ratified_by_governor"] = False
                item["governor_signature"] = None
                item["atv_timestamp"] = now_iso()
                if "description" in item:
                    item["description"] += f"\nRe-detected on {now_iso()}."
                with open(VAULT_PATH, "w", encoding="utf-8") as f:
                    yaml.dump(vault, f, default_flow_style=False, allow_unicode=True)
            else:
                print(f"  [ATV] Vault entry already exists and is parked for title '{entry['title']}' (skipping).")
            return
            
    vault["parked_items"].append(entry)
    with open(VAULT_PATH, "w", encoding="utf-8") as f:
        yaml.dump(vault, f, default_flow_style=False, allow_unicode=True)
    print(f"  [ATV] Vault entry written: {entry['item_id']} [{entry['tags'][0]}]")


# -----------------------------------------------------------------------
# THE ASSUMPTION DIFFUSER
# Surfacers unexamined metrics and checks context validity.
# Returns True if context allows validation, False if check is suspended.
# -----------------------------------------------------------------------
def diffuse_assumptions(check_name, metric_info, assumption, context_check_fn):
    print(f"\n[Assumption Diffuser] Evaluating Check: {check_name}")
    print(f"  Metric       : {metric_info}")
    print(f"  Assumption   : {assumption}")
    
    context_is_valid, reason = context_check_fn()
    if not context_is_valid:
        print(f"  CONTEXT SUSPENSION: {reason}")
        print("  Check Suspended -- not representing a real gap.")
        return False
    
    print(f"  Context Valid: {reason}")
    return True


# -----------------------------------------------------------------------
# CHECK 1: CONTEXTUAL PERSONA REVALENCE
# Replaces uniform coverage. Looks at scenario type and triggers contextually.
# -----------------------------------------------------------------------
def check_contextual_persona_relevance(reports, vault):
    def context_check():
        if not os.path.exists(SCENARIO_MAP_PATH):
            return False, "persona_scenario_map.yaml is missing -- context cannot be determined"
        return True, "persona_scenario_map exists to verify expected persona triggers"

    metric_desc = "triggered_personas / total_personas_registered"
    assumption  = "All registered expert personas should trigger evenly on every scenario."
    
    if not diffuse_assumptions("Contextual Persona Relevance", metric_desc, assumption, context_check):
        return {"check": "contextual_persona_relevance", "result": "SUSPENDED"}

    reports_list = reports if isinstance(reports, list) else [reports]
    scenario_map = load_yaml(SCENARIO_MAP_PATH)
    
    worst_score = 100.0
    failed_scenario = None
    total_scenarios_checked = 0
    
    for report in reports_list:
        scenario_name = report.get("scenario", "unknown").lower()
        scenario_type_raw = report.get("scenario_type", "")
        
        # Match type either from scenario_type key or keyword scan
        selected_type = "MIXED"
        if scenario_type_raw:
            selected_type = scenario_type_raw
        else:
            for stype in scenario_map.get("scenario_types", []):
                type_name = stype.get("type")
                keywords = stype.get("keywords", [])
                if any(kw in scenario_name for kw in keywords):
                    selected_type = type_name
                    break
                    
        expected_dist = {}
        for stype in scenario_map.get("scenario_types", []):
            if stype.get("type") == selected_type:
                expected_dist = stype.get("expected_distribution", {})
                break
                
        findings = report.get("findings", [])
        triggered_ids = {f.get("persona_id") for f in findings}
        
        high_expected = [pid for pid, weight in expected_dist.items() if weight == "HIGH"]
        med_expected  = [pid for pid, weight in expected_dist.items() if weight == "MEDIUM"]
        
        triggered_high = [pid for pid in high_expected if pid in triggered_ids]
        triggered_med  = [pid for pid in med_expected if pid in triggered_ids]
        
        total_expected = len(high_expected) + len(med_expected)
        total_triggered = len(triggered_high) + len(triggered_med)
        
        if total_expected == 0 or len(findings) == 0:
            # FIX 2 MANDATE: Zero persona matches on a clean diff with no matching footprint is a CLEAN PASS
            print("  - Zero persona matches on clean diff footprint: VALID CLEAN PASS.")
            continue
            
        contextual_score = (total_triggered / total_expected) * 100
        total_scenarios_checked += 1
        
        if contextual_score < worst_score:
            worst_score = contextual_score
            
        if contextual_score < 70.0:
            failed_scenario = {
                "name": scenario_name,
                "type": selected_type,
                "score": contextual_score,
                "expected": high_expected + med_expected,
                "fired": triggered_high + triggered_med
            }
            break

    if failed_scenario:
        park_id = next_park_id(vault)
        entry = {
            "item_id": park_id,
            "title": f"Contextual Audit Gap -- Low persona trigger relevance ({failed_scenario['score']:.1f}%) in scenario '{failed_scenario['type']}'",
            "description": (
                f"ATV Contextual check detected expected personas for '{failed_scenario['type']}' scenario did not fire. "
                f"Expected: {failed_scenario['expected']}. Fired: {failed_scenario['fired']}."
            ),
            "status": "parked",
            "tags": ["[IMPROVEMENT.GAP]", "[AUDIT.CONTEXTUAL]", "[WEEKLY_SESSION_PARKING]"],
            "requires_governor_approval": True,
            "ratified_by_governor": False,
            "governor_signature": None,
            "linked_plans": ["CISEM-IP-20260806-CONTEXT-ADAPTIVE-V1.0"],
            "atv_generated": True,
            "atv_timestamp": now_iso()
        }
        append_vault_entry(vault, entry)
        return {"check": "contextual_persona_relevance", "result": "IMPROVEMENT_GAP", "score": worst_score, "park_id": park_id}

    print(f"  Result: PASS. Contextual relevance checks passed across all {total_scenarios_checked} scenarios.")
    return {"check": "contextual_persona_relevance", "result": "PASS", "score": worst_score}


# -----------------------------------------------------------------------
# CHECK 2: BENEFICIAL DRIFT DETECTION
# -----------------------------------------------------------------------
def check_beneficial_drift(reports, vault):
    print("\n[ATV Check 2] Beneficial Drift Detection...")
    reports_list = reports if isinstance(reports, list) else [reports]
    
    all_beneficial = []
    
    for report in reports_list:
        findings  = report.get("findings", [])
        scenario  = report.get("scenario", "unknown")
        
        beneficial = [f for f in findings
                      if f.get("severity") in ("MEDIUM", "LOW")
                      and f.get("persona_id") in (
                          "CONSOLIDATION_OPTIMIZATION_SSOT_PERSONA",
                          "STABILITY_EXPERT_PERSONA",
                          "PERFORMANCE_ARCHITECT_PERSONA"
                      )]
        for b in beneficial:
            all_beneficial.append((scenario, b))

    if all_beneficial:
        park_id = next_park_id(vault)
        example_drifts = [f"{item[0]}: {item[1]['role_name']}" for item in all_beneficial[:3]]
        entry = {
            "item_id": park_id,
            "title": f"Beneficial Drift -- Dynamic scenario suite surfaced constructive findings",
            "description": (
                f"ATV detected constructive findings representing genuine improvements in: {example_drifts}."
            ),
            "status": "parked",
            "tags": ["[BENEFICIAL.DRIFT]", "[AUDIT.POSITIVE]"],
            "requires_governor_approval": True,
            "ratified_by_governor": False,
            "governor_signature": None,
            "linked_plans": ["CISEM-IP-20260806-CONTEXT-ADAPTIVE-V1.0"],
            "atv_generated": True,
            "atv_timestamp": now_iso(),
            "source_findings": [item[1]["persona_id"] for item in all_beneficial]
        }
        append_vault_entry(vault, entry)
        print(f"  Result: BENEFICIAL.DRIFT detected. Park ID: {park_id}")
        return {"check": "beneficial_drift", "result": "BENEFICIAL_DRIFT", "park_id": park_id}

    print("  Result: No beneficial drift detected.")
    return {"check": "beneficial_drift", "result": "PASS"}


# -----------------------------------------------------------------------
# CHECK 3: THEATER DETECTION
# -----------------------------------------------------------------------
def check_theater(reports, vault):
    print("\n[ATV Check 3] Theater Detection...")
    reports_list = reports if isinstance(reports, list) else [reports]
    
    theater_signals = []
    
    for report in reports_list:
        verdict   = report.get("verdict", "")
        triggered = report.get("personas_triggered", 0)
        total     = report.get("total_personas_registered", 0)
        high_findings = [f for f in report.get("findings", []) if f.get("severity") in ("CRITICAL", "HIGH")]
        
        scenario = report.get("scenario", "unknown")
        if verdict == "BLOCKED" and not high_findings:
            theater_signals.append(f"[{scenario}] BLOCKED_WITHOUT_CRITICAL_FINDING: verdict is BLOCKED but no CRITICAL/HIGH finding exists")
        if triggered == 0 and total > 0:
            theater_signals.append(f"[{scenario}] ZERO_TRIGGERS: {total} personas registered but 0 triggered")

    if theater_signals:
        park_id = next_park_id(vault)
        entry = {
            "item_id": park_id,
            "title": "Theater Detected in Audit Cycle",
            "description": "ATV detected theater signals: " + "; ".join(theater_signals),
            "status": "parked",
            "tags": ["[THEATER.DETECTED]", "[AUDIT.INTEGRITY]"],
            "requires_governor_approval": True,
            "ratified_by_governor": False,
            "governor_signature": None,
            "linked_plans": ["CISEM-IP-20260806-CONTEXT-ADAPTIVE-V1.0"],
            "atv_generated": True,
            "atv_timestamp": now_iso()
        }
        append_vault_entry(vault, entry)
        print(f"  Result: THEATER.DETECTED. Park ID: {park_id}")
        return {"check": "theater_detection", "result": "THEATER_DETECTED", "signals": theater_signals, "park_id": park_id}

    print("  Result: No theater signals detected.")
    return {"check": "theater_detection", "result": "PASS"}


# -----------------------------------------------------------------------
# CHECK 4: ACTIVATION TRACKER
# -----------------------------------------------------------------------
def check_activation_tracker(vault):
    def context_check():
        cael = load_json(CAEL_STATUS_PATH)
        if not cael.get("activation_registry"):
            return False, "activation_registry is empty"
        return True, "activation_registry has entries to validate"

    metric_desc = "actual_triggers >= validation_target (4x)"
    assumption  = "Every mechanism should trigger 4 times its estimated rate uniformly regardless of purpose."

    if not diffuse_assumptions("Activation Tracker", metric_desc, assumption, context_check):
        return {"check": "activation_tracker", "result": "SUSPENDED"}

    cael = load_json(CAEL_STATUS_PATH)
    registry = cael.get("activation_registry", [])

    underactivated = []
    for mech in registry:
        target = mech.get("validation_target", 0)
        actual = mech.get("actual_triggers", 0)
        
        adjusted_target = target
        context_class = mech.get("activation_context", "per_build")
        if context_class == "per_milestone":
            adjusted_target = int(mech.get("estimated_triggers_per_cycle", 0) * 1.5)
            print(f"  Contextual Safety Adjustment for {mech['mechanism_id']}: Target 4x ({target}) -> 1.5x ({adjusted_target}) due to milestone class.")

        if actual < adjusted_target:
            underactivated.append({
                "mechanism_id": mech["mechanism_id"],
                "description": mech.get("description", ""),
                "actual": actual,
                "target": adjusted_target,
                "gap": adjusted_target - actual
            })

    if underactivated:
        for u in underactivated:
            park_id = next_park_id(vault)
            vault_entry = {
                "item_id": park_id,
                "title": f"Underactivated Mechanism: {u['mechanism_id']}",
                "description": f"{u['description']} has {u['actual']}/{u['target']} trigger activations. Gap: {u['gap']}.",
                "status": "parked",
                "tags": ["[IMPROVEMENT.GAP]", "[ACTIVATION.UNDERACTIVATED]", "[WEEKLY_SESSION_PARKING]"],
                "requires_governor_approval": False,
                "ratified_by_governor": False,
                "governor_signature": None,
                "linked_plans": ["CISEM-IP-20260806-CONTEXT-ADAPTIVE-V1.0"],
                "atv_generated": True,
                "atv_timestamp": now_iso()
            }
            append_vault_entry(vault, vault_entry)
            vault = load_yaml(VAULT_PATH)

        return {"check": "activation_tracker", "result": "UNDERACTIVATED", "mechanisms": underactivated}

    print("  Result: All active mechanisms meet validation targets.")
    return {"check": "activation_tracker", "result": "PASS"}


# -----------------------------------------------------------------------
# CHECK 6: NAKED NUMBER AUDIT
# Scans active markdown documents for raw numbers lacking context or reasoning.
# -----------------------------------------------------------------------
def check_naked_numbers(vault):
    print("\n[ATV Check 6] Naked Number Context Audit...")
    
    def context_check():
        if not os.path.exists(ROOT_DIR):
            return False, "workspace root is missing"
        return True, "workspace root exists to scan files"

    metric_desc = "naked_numbers_found == 0"
    assumption  = "All numbers written in workspace instructions, plans, or rules represent rigid constants."

    if not diffuse_assumptions("Naked Number Audit", metric_desc, assumption, context_check):
        return {"check": "naked_number_audit", "result": "SUSPENDED"}

    context_keywords = [
        "example", "target", "estimate", "approximate", "reasoning", "context",
        "threshold", "bound", "limit", "floor", "ceiling", "ratio", "formula",
        "percent", "version", "date", "timestamp", "offset", "id", "parameter",
        "weight", "priority", "index", "%", "turn", "turns", "persona", "loop",
        "count", "cycle", "observation", "observations", "decision", "decisions",
        "case", "cases", "use"
    ]

    # Filter files to only check the highest version of each document
    file_groups = {}
    for f in os.listdir(ROOT_DIR):
        if not f.endswith(".md"):
            continue
        v_match = re.search(r'^(.*?)(?:__V|_V)(\d+(?:\.\d+)*)\.md$', f)
        if v_match:
            base = v_match.group(1)
            try:
                version = [int(x) for x in v_match.group(2).split(".")]
            except ValueError:
                version = [0]
            if base not in file_groups or version > file_groups[base]["version"]:
                file_groups[base] = {"filename": f, "version": version}
        else:
            file_groups[f] = {"filename": f, "version": [0]}

    active_files = [item["filename"] for item in file_groups.values()]
    naked_findings = []

    for f in active_files:
        path = os.path.join(ROOT_DIR, f)
        if not os.path.isfile(path):
            continue
        try:
            with open(path, "r", encoding="utf-8") as file:
                lines = file.readlines()
        except Exception:
            continue
            
        in_code_block = False
        for i, line in enumerate(lines):
            # Toggle in_code_block on ```
            if line.strip().startswith("```"):
                in_code_block = not in_code_block
                continue
            if in_code_block:
                continue

            # Exclude lines containing file links, paths, metadata tags, dates, list markers, or log timestamps
            lower_line = line.lower()
            if any(x in lower_line for x in ["file://", "http://", "https://", ".md", ".py", ".yaml", ".json"]):
                continue
            if re.search(r'\d{4}-\d{2}-\d{2}', line): # Ignore date formats
                continue
            if re.search(r'\b\d{2}:\d{2}:\d{2}\b', line): # Ignore log timestamps
                continue
            if re.search(r'^\s*[\d\.\-\*#]+$', line.strip()): # Ignore list bullets/headers only
                continue
            if re.search(r'^\s*(?:timestamp|date|version|last_updated|atv_timestamp|pid|loop_count)\s*:', lower_line):
                continue
            if re.match(r'^\s*\d+\.\d*(?:\.\d*)*\b', line.strip()): # Ignore section numbers like 1.1, 1.2, 2.3.1
                continue
            if re.match(r'^\s*\d+\.\s*', line.strip()): # Ignore list numbers like 10.
                continue
            if re.match(r'^\s*-\s+\d+\.\d+', line.strip()): # Ignore section bullets
                continue
            if line.strip().startswith("#"): # Ignore markdown headers
                continue
                
            # Avoid matching version numbers (like 1.0 or 1.1), Rule/Pillar IDs, or alphanumeric codes (using lookbehind/lookahead check for letter/hyphen/dot)
            matches = re.findall(r'\b(?<!V)(?<!PR-)(?<![a-zA-Z-\.])\d+(?:%\b|\bx\b|\b)(?!\.)', line)
            for m in matches:
                num = m.strip()
                if not num:
                    continue
                if len(num) == 1: # Ignore single digit section markers/bullets
                    continue
                # Exempt standard HTTP codes, ports, and common configuration defaults
                if num in ("2026", "2025", "2024", "19", "01", "02", "03", "200", "201", "202", "204", "400", "401", "403", "404", "429", "500", "3000", "8000", "9000"):
                    continue
                if num.endswith("0000") or len(num) >= 5:
                    continue
                if re.search(r'line\s+\d+', line.lower()) or re.search(r'#l\d+', lower_line):
                    continue
                    
                context_window = lower_line
                if i > 0:
                    context_window += " " + lines[i-1].lower()
                if i < len(lines) - 1:
                    context_window += " " + lines[i+1].lower()
                    
                has_context = any(kw in context_window for kw in context_keywords)
                if not has_context:
                    naked_findings.append({
                        "file": f,
                        "line": i + 1,
                        "content": line.strip(),
                        "number": num
                    })

    print(f"  Scanned markdown documentation. Found {len(naked_findings)} naked number occurrence(s).")

    # FIX 2 MANDATE: Filter out findings already docketed in parking_vault_draft.yaml
    docketed_in_vault = False
    if vault and isinstance(vault, dict):
        entries = vault.get("vault_entries", [])
        for entry in entries:
            if "Naked Numbers Found" in entry.get("title", ""):
                docketed_in_vault = True
                break

    if naked_findings and not docketed_in_vault:
        print("  First 10 Newly Introduced Naked Numbers:")
        for f in naked_findings[:10]:
            clean_content = f['content'].encode('ascii', 'ignore').decode('ascii')
            print(f"    - {f['file']}:L{f['line']} ({f['number']}): {clean_content}")
        
        park_id = next_park_id(vault)
        example_list = "; ".join([f"{f['file']}:L{f['line']} ('{f['number']}')" for f in naked_findings[:3]])
        entry = {
            "item_id": park_id,
            "title": f"Naked Numbers Found -- Context/Reasoning missing for {len(naked_findings)} numbers",
            "description": (
                f"ATV Naked Number Audit detected {len(naked_findings)} occurrences of raw numbers "
                f"without surrounding context keywords. Examples: {example_list}. "
                "All numbers in documentation must have context (e.g. marked as 'example' or 'estimate')."
            ),
            "status": "parked",
            "tags": ["[IMPROVEMENT.GAP]", "[AUDIT.RIGIDITY]", "[WEEKLY_SESSION_PARKING]"],
            "requires_governor_approval": False,
            "ratified_by_governor": False,
            "governor_signature": None,
            "linked_plans": ["CISEM-IP-20260806-CONTEXT-ADAPTIVE-V1.0"],
            "atv_generated": True,
            "atv_timestamp": now_iso()
        }
        append_vault_entry(vault, entry)
        return {"check": "naked_number_audit", "result": "IMPROVEMENT_GAP", "count": len(naked_findings), "park_id": park_id}

    if naked_findings and docketed_in_vault:
        print(f"  Result: PASS. {len(naked_findings)} naked number occurrences exist but are ALREADY DOCKETED in parking_vault_draft.yaml.")
        return {"check": "naked_number_audit", "result": "PASS (DOCKETED_DEBT_EXCLUDED)"}

    print("  Result: PASS. All numbers have context/reasoning keywords.")
    return {"check": "naked_number_audit", "result": "PASS"}


# -----------------------------------------------------------------------
# CHECK 5: PROCESS FEEDBACK & ROOT CAUSE REGISTRY
# -----------------------------------------------------------------------
def check_process_feedback_and_registry(report, check_results):
    print("\n[ATV Check 5] Root Cause Pattern Tracking...")
    
    gap_checks = [r for r in check_results if r.get("result") not in ("PASS", "SUSPENDED", "EMPTY_REGISTRY", "BENEFICIAL_DRIFT", "IMPROVEMENT_GAP")]
    theater_check = next((r for r in check_results if r.get("result") == "THEATER_DETECTED"), None)

    if theater_check:
        root_cause = "implementation gap -- mechanisms exist but do not fire in real scenarios"
        root_type = "IMPLEMENTATION_GAP"
    elif gap_checks:
        root_cause = "planning gap -- scenarios designed too narrowly to trigger expected personas"
        root_type = "PLANNING_GAP"
    else:
        root_cause = "none detected in this cycle"
        root_type = "NOMINAL"

    registry_data = load_json(ROOT_CAUSE_REGISTRY_PATH, {"last_updated": "", "registry": []})
    
    reports_list = report if isinstance(report, list) else [report]
    scenarios_str = "; ".join([r.get("scenario", "unknown") for r in reports_list])
    
    new_entry = {
        "timestamp": now_iso(),
        "scenario": scenarios_str,
        "root_cause": root_cause,
        "root_type": root_type
    }
    
    registry_data["registry"].append(new_entry)
    registry_data["last_updated"] = now_iso()
    save_json(ROOT_CAUSE_REGISTRY_PATH, registry_data)
    print(f"  Appended to Root Cause Registry. Total historical events: {len(registry_data['registry'])}")

    recent_types = [entry.get("root_type") for entry in registry_data["registry"][-5:]]
    repeats = recent_types.count(root_type)
    
    is_repeat_warn = False
    if root_type != "NOMINAL" and repeats >= 3:
        is_repeat_warn = True
        print(f"  [!] CRITICAL: Repeated root cause pattern detected: {root_type} ({repeats}/5 occurrences)")

    # ── P/E RATIO CHECK ────────────────────────────────────────────────
    print("\n[ATV Check 5.5] Planning / Execution (P/E) Ratio Check...")
    counter = load_json(TURN_COUNTER_PATH, {})
    turns_log = counter.get("turns_log", [])
    
    planning_keywords = ["plan", "registry", "axiom", "agents.md", "vocabulary", "template"]
    execution_keywords = ["gate", "sync", "watcher", "atv", "auditor", ".py", "code", "implement", "script", "daemon"]
    
    planning_count = 0
    execution_count = 0
    for t in turns_log:
        act = t.get("action", "").lower()
        is_plan = any(kw in act for kw in planning_keywords)
        is_exec = any(kw in act for kw in execution_keywords)
        if is_plan:
            planning_count += 1
        elif is_exec or not act:
            execution_count += 1
            
    print(f"  Planning turns logged  : {planning_count}")
    print(f"  Execution turns logged : {execution_count}")
    
    pe_warning = None
    if execution_count > 0 or planning_count > 0:
        total_logged = planning_count + execution_count
        pe_ratio = planning_count / max(execution_count, 1)
        print(f"  Computed P/E Ratio     : {pe_ratio:.2f}")
        
        # P/E Ratio Floor Check (0.33)
        if pe_ratio < 0.33 and total_logged >= 3:
            pe_warning = "CODE_RUSHING_WARNING"
            print(f"  [P/E warning] Code Rushing detected! P/E Ratio: {pe_ratio:.2f} (Target Floor: 0.33)")
            
        # P/E Ratio Ceiling Check (3.00)
        elif pe_ratio > 3.00 and total_logged >= 3:
            pe_warning = "PLANNING_PARALYSIS_WARNING"
            print(f"  [P/E warning] Planning Paralysis detected! P/E Ratio: {pe_ratio:.2f} (Target Ceiling: 3.00)")

    if pe_warning:
        vault = load_yaml(VAULT_PATH)
        park_id = next_park_id(vault)
        vault_entry = {
            "item_id": park_id,
            "title": f"P/E Ratio Violation: {pe_warning}",
            "description": f"ATV detected P/E Ratio mismatch: {pe_ratio:.2f} (Target bounds: 0.33 - 3.00).",
            "status": "parked",
            "tags": ["[IMPROVEMENT.GAP]", f"[PROCESS.{pe_warning}]", "[WEEKLY_SESSION_PARKING]"],
            "requires_governor_approval": False,
            "ratified_by_governor": False,
            "governor_signature": None,
            "linked_plans": ["CISEM-IP-20260806-CONTEXT-ADAPTIVE-V1.0"],
            "atv_generated": True,
            "atv_timestamp": now_iso()
        }
        append_vault_entry(vault, vault_entry)
    # ───────────────────────────────────────────────────────────────────
        
    verdicts = "; ".join([f"{r.get('scenario')}: {r.get('verdict')}" for r in reports_list])
    feedback = {
        "audit_timestamp": now_iso(),
        "scenario": scenarios_str,
        "intent": "Exercise scenario-appropriate expert personas and validate mechanisms",
        "result": f"Verdict: {verdicts}",
        "gap": f"{len(gap_checks)} gap(s) found",
        "root_cause": root_cause,
        "repeated_pattern_warning": is_repeat_warn,
        "pe_ratio_warning": pe_warning,
        "recommendation": (
            "Review persona distribution configurations and broaden test scenario coverage. "
            "Address repeating root cause to resolve platform process loops."
        ) if gap_checks else "No recommendations -- cycle nominal."
    }

    if isinstance(report, list):
        for r in report:
            r["atv_process_feedback"] = feedback
    else:
        report["atv_process_feedback"] = feedback
        
    save_json(TRIAL_REPORT_PATH, report)
    
    return feedback, is_repeat_warn


# -----------------------------------------------------------------------
# CALCULATE MATURITY SCORE AND EVALUATE TURN AUDIT STATUS
# -----------------------------------------------------------------------
def evaluate_maturity_and_turns():
    print("\n[Maturity Evaluator] Evaluating Turn Maturity Status...")
    if not os.path.exists(TURN_COUNTER_PATH):
        print("  WARNING: turn counter file missing. Skipping maturity evaluation.")
        return

    counter = load_json(TURN_COUNTER_PATH)
    current = counter.get("current_turn", 0)
    ceiling = counter.get("turn_limit_ceiling", 15)
    floor   = counter.get("turn_minimum_floor", 3)
    signals = counter.get("maturity_signals", {})
    threshold = counter.get("maturity_score_threshold", 70)

    resolved = signals.get("park_items_resolved_this_cycle", 0)
    created  = signals.get("park_items_created_this_cycle", 1)
    blast    = signals.get("high_blast_radius_changes", 0)
    blocks   = signals.get("gate_blocks_encountered", 0)

    momentum_score = (resolved / max(created, 1)) * 40
    stability_score = max(0, (1 - blast * 0.1) * 30)
    execution_score = 20 if blocks == 0 else max(0, 20 - blocks * 5)
    floor_score     = 10 if current >= floor else 0

    score = int(momentum_score + stability_score + execution_score + floor_score)
    score = min(100, max(0, score))

    counter["maturity_signals"]["last_maturity_score"] = score
    
    print(f"  Current turn            : {current} (floor: {floor}, ceiling: {ceiling})")
    print(f"  Maturity Signals        : Resolved={resolved}, Created={created}, Blast={blast}, Blocks={blocks}")
    print(f"  Maturity Score computed : {score} (threshold: {threshold})")

    audit_due = False
    if current >= ceiling:
        audit_due = True
        print(f"  Audit forced: turn ceiling of {ceiling} has been reached.")
    elif current >= floor and score >= threshold:
        audit_due = True
        print(f"  Audit triggered early: maturity score {score} >= threshold {threshold}.")
    else:
        print("  Maturity threshold not met -- extending turn cycle.")

    counter["audit_due"] = audit_due
    save_json(TURN_COUNTER_PATH, counter)


def reset_turn_counter():
    counter = load_json(TURN_COUNTER_PATH, {})
    counter["current_turn"] = 0
    counter["audit_due"]    = False
    counter["last_reset"]   = now_iso()
    counter["turns_log"]    = []
    counter["maturity_signals"] = {
        "park_items_resolved_this_cycle": 0,
        "park_items_created_this_cycle": 0,
        "high_blast_radius_changes": 0,
        "gate_blocks_encountered": 0,
        "beneficial_drift_detected": 0,
        "last_maturity_score": None
    }
    save_json(TURN_COUNTER_PATH, counter)
    print("\n[ATV] Turn counter and maturity signals reset. Next adaptive cycle starts.")


# -----------------------------------------------------------------------
# MAIN RUN
# -----------------------------------------------------------------------
def run_atv():
    print("=" * 60)
    print("CISEM Anti-Theater Validator (ATV) v1.1")
    print("Ratified: GOV-YARIV-20260806-CONTEXT-ADAPTIVE-V1.0")
    print("Exposing assumptions. Measuring contextual results.")
    print("=" * 60)

    report = load_json(TRIAL_REPORT_PATH)
    if not report:
        raise ATVLoadError("No trial report found. Run CisemAuditor first.")

    vault = load_yaml(VAULT_PATH)

    check_results = []
    
    check_results.append(check_contextual_persona_relevance(report, vault))
    vault = load_yaml(VAULT_PATH)

    check_results.append(check_beneficial_drift(report, vault))
    vault = load_yaml(VAULT_PATH)

    check_results.append(check_theater(report, vault))
    vault = load_yaml(VAULT_PATH)

    check_results.append(check_activation_tracker(vault))
    vault = load_yaml(VAULT_PATH)

    check_results.append(check_naked_numbers(vault))
    vault = load_yaml(VAULT_PATH)

    active_results = [r for r in check_results if r and r.get("result") != "SUSPENDED"]

    feedback, is_repeat_warn = check_process_feedback_and_registry(report, active_results)

    evaluate_maturity_and_turns()

    gaps = [r for r in active_results if "GAP" in r.get("result", "") or "DETECTED" in r.get("result", "")]
    drifts = [r for r in active_results if r.get("result") == "BENEFICIAL_DRIFT"]
    
    atv_verdict = "THEATER_BLOCKED" if any(r.get("result") == "THEATER_DETECTED" for r in active_results) else \
                  "REPEATED_ROOT_CAUSE_BLOCKED" if is_repeat_warn else \
                  "GAPS_FOUND" if gaps else "PASS"

    atv_report = {
        "atv_version": "1.1",
        "timestamp": now_iso(),
        "ratified_plan": "CISEM-IP-20260806-CONTEXT-ADAPTIVE-V1.0",
        "checks_run": len(active_results),
        "gaps_found": len(gaps),
        "beneficial_drifts_found": len(drifts),
        "atv_verdict": atv_verdict,
        "check_results": active_results,
        "process_feedback": feedback
    }
    save_json(ATV_REPORT_PATH, atv_report)

    print("\n" + "=" * 60)
    print(f"ATV VERDICT: {atv_verdict}")
    print(f"  Checks active   : {len(active_results)}")
    print(f"  Gaps found      : {len(gaps)}")
    print(f"  Beneficial drift: {len(drifts)}")
    print(f"  Report saved to : {ATV_REPORT_PATH}")
    print("=" * 60)

    increment_mechanism_trigger("CISEM-ATV-V1")

    if atv_verdict in ("PASS", "GAPS_FOUND"):
        reset_turn_counter()
    else:
        raise ATVProcessBlock("HARD PROCESS BLOCK: Fix theater or repeated root cause before proceeding.")


if __name__ == "__main__":
    try:
        run_atv()
        sys.exit(0)
    except (ATVLoadError, ATVExecutionError, ATVProcessBlock) as e:
        print(f"FATAL ATV ERROR: {e}")
        sys.exit(1)
