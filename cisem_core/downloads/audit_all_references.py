# scratch/audit_all_references.py
import os
import re

root_dir = "C:/Users/finky/Desktop/AntiGravity/Cisem CsAg"

target_files = [
    os.path.join(root_dir, "AGENTS.md"),
    os.path.join(root_dir, "GEMINI.md"),
    os.path.join(root_dir, ".agents", "reviewer", "RULES.md"),
    os.path.join(root_dir, ".agents", "reviewer", "INVENTORY.md"),
    os.path.join(root_dir, "cisem_core", "planning", "ratified_plans_manifest.json")
]

referenced_mds = set()

for tf in target_files:
    if os.path.exists(tf):
        with open(tf, "r", encoding="utf-8") as f:
            matches = re.findall(r"([2026\-[0-9]{2}\-[0-9]{2}__[a-zA-Z0-9_\-]+\.md)", f.read())
            for m in matches:
                referenced_mds.add(m)

missing = []
for ref in sorted(list(referenced_mds)):
    found = False
    for r, dirs, files in os.walk(root_dir):
        if ref in files:
            found = True
            break
    if not found:
        missing.append(ref)

print(f"Total Timestamped MD References Audited across Governance Files: {len(referenced_mds)}")
print(f"TOTAL MISSING RATIFIED DOCUMENTS: {len(missing)}")
for idx, m in enumerate(missing, 1):
    print(f"  {idx}. {m}")
