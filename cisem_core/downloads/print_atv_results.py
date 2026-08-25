import json

report_path = r"c:\Users\finky\Desktop\AntiGravity\Cisem CsAg\cisem_core\sandbox\orchestration_trial_report.json"
with open(report_path, "r", encoding="utf-8") as f:
    report = json.load(f)

print("Orchestration Trial Report keys:", report.keys() if isinstance(report, dict) else len(report))
if isinstance(report, list):
    for idx, r in enumerate(report):
        print(f"Report {idx}: scenario={r.get('scenario')}, verdict={r.get('verdict')}")
else:
    print(f"Report: scenario={report.get('scenario')}, verdict={report.get('verdict')}")

atv_report_path = r"c:\Users\finky\Desktop\AntiGravity\Cisem CsAg\cisem_core\sandbox\atv_report.json"
try:
    with open(atv_report_path, "r", encoding="utf-8") as f:
        atv = json.load(f)
    print("\nATV Report check results:")
    for res in atv.get("check_results", []):
        print(f"Check: {res.get('check_name')}, Result: {res.get('result')}")
except Exception as e:
    print("Failed to read ATV report:", e)
