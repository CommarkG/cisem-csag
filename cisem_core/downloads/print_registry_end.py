import json

registry_path = r"c:\Users\finky\Desktop\AntiGravity\Cisem CsAg\cisem_core\sandbox\root_cause_registry.json"
with open(registry_path, "r", encoding="utf-8") as f:
    data = json.load(f)

print("Last 10 entries:")
for idx, entry in enumerate(data["registry"][-10:]):
    print(idx, entry.get("timestamp"), entry.get("root_type"), repr(entry.get("root_cause")))
