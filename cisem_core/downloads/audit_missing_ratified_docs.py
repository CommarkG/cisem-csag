# scratch/audit_missing_ratified_docs.py
import os
import yaml
import re

root_dir = "C:/Users/finky/Desktop/AntiGravity/Cisem CsAg"
registry_path = os.path.join(root_dir, "cisem_core", "2026-08-05__CISEM__Universal_Workspace_and_Accountability_Registry__V1.44.yaml")

missing_files = []

if os.path.exists(registry_path):
    with open(registry_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Extract file references with .md extension
    md_refs = re.findall(r"([a-zA-Z0-9_\-]+\.md)", content)
    unique_refs = sorted(list(set(md_refs)))
    
    for ref in unique_refs:
        # Search for file in root_dir recursively
        found = False
        for r, dirs, files in os.walk(root_dir):
            if ref in files:
                found = True
                break
        if not found:
            missing_files.append(ref)

print(f"Total MD References Audited: {len(unique_refs)}")
print(f"TOTAL MISSING RATIFIED DOCUMENTS: {len(missing_files)}")
for idx, m in enumerate(missing_files, 1):
    print(f"  {idx}. {m}")
