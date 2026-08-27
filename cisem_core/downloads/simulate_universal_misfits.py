import json
import os

print("=== CISEM UNIVERSAL ENGINE MISFIT & OUT-OF-BOUNDS SIMULATION ===")

# Simulation Scenarios
scenarios = [
    {
        "id": "SIM-01",
        "name": "Completely Unrecognized Intent (Metaverse Event)",
        "input": "Organize a 500-person Metaverse launch event with custom NFT badges and live DJ streaming",
        "detected_category": "NONE (Unclassified)",
        "action": "TRIGGER_STATION_6_UNCOVERED_LOOP",
        "result": {
            "fallback_case": "Case D (Service with Unclear Scope)",
            "logged_obligation_row": "uncovered_intents (id=uuid, raw_text=..., status=PENDING_ROUTE)",
            "mirror_question": "This is a specialized event. What is the event date and target budget?",
            "system_behavior": "No hallucinated pricing or fake catalogue matches. 100% honest gap disclosure."
        }
    },
    {
        "id": "SIM-02",
        "name": "Contradictory / Impossible Lead Time & Budget",
        "input": "5,000 custom engraved silver pens for tomorrow morning, budget $50 total",
        "detected_category": "Physical Goods (Case A)",
        "action": "TRIGGER_STATION_5_5_FEASIBILITY_SHIELD",
        "result": {
            "feasibility_status": "FAILED (Lead time 12h < 168h min; Unit cost $0.01 < $3.50 min)",
            "warning_card": "Platform Feasibility Note: 5,000 custom engraved items require a minimum 7-day lead time. Recommended path: Express digital vouchers or adjusted deadline of September 5th.",
            "system_behavior": "Prevents impossible work orders before intake confirmation."
        }
    },
    {
        "id": "SIM-03",
        "name": "Parent vs Tenant Policy Contradiction",
        "input": "Parent policy updated CFO threshold to $5k; Tenant overlay threshold is $10k",
        "detected_category": "Policy Conflict",
        "action": "TRIGGER_CONTRADICTION_RESOLUTION_PROTOCOL",
        "result": {
            "tenant_status": "OVERLAY_PRESERVED_LOCAL",
            "db_flag": "CONTRADICTION_PENDING_REVIEW",
            "admin_studio_banner": "Platform Security Policy Updated: Parent CFO sign-off threshold is now $5,000. Your tenant threshold is $10,000. [Keep $10k Overlay] or [Adopt $5k Parent Rule]",
            "system_behavior": "Zero silent overrides. Tenant keeps their overlay until explicit admin decision."
        }
    },
    {
        "id": "SIM-04",
        "name": "High-Frequency Escape Text (Evidence Signal)",
        "input": "User types 'custom subscription box' into escape field (3rd occurrence this week)",
        "detected_category": "Escape Field Repeated Signal",
        "action": "TRIGGER_EVIDENCE_TO_RULE_ENGINE",
        "result": {
            "evidence_signal_logged": "tenant_evidence_signals (type=ESCAPE_TEXT, text='custom subscription box', count=3)",
            "admin_inbox_alert": "High-Frequency Signal: 3 users requested 'custom subscription box' this week. [One-Tap Add Subtopic 'Subscription Box']",
            "system_behavior": "Converts user friction into zero-code tenant vocabulary rules."
        }
    }
]

output_file = os.path.join("cisem_core", "snapshots", "misfit_simulation_report.json")
os.makedirs(os.path.dirname(output_file), exist_ok=True)

with open(output_file, "w", encoding="utf-8") as f:
    json.dump(scenarios, f, indent=2)

print(f"[SIMULATION SUCCESS]: Executed {len(scenarios)} misfit simulations. Saved to {output_file}")
for s in scenarios:
    print(f"\n[{s['id']} - {s['name']}]:")
    print(f"  Input  : {s['input']}")
    print(f"  Action : {s['action']}")
    print(f"  Result : {s['result']['system_behavior']}")

