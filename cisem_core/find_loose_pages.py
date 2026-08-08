import os
import yaml

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
v111_path = os.path.join(ROOT_DIR, "cisem_core", "2026-08-05__CISEM__Universal_Workspace_and_Accountability_Registry__V1.11.yaml")

with open(v111_path, "r", encoding="utf-8") as f:
    registry_content = f.read()

cisem_core_dir = os.path.join(ROOT_DIR, "cisem_core")
loose_pages = []

# Walk cisem_core folder
for root, dirs, files in os.walk(cisem_core_dir):
    # Exclude code shadow folder and caching directories
    if "code" in root or "__pycache__" in root or "sandbox" in root:
        continue
        
    for file in files:
        # Exclude active python scripts and turn counters/status
        if file.endswith((".py", ".pyc", ".json", ".yaml")):
            continue
            
        rel_path = os.path.relpath(os.path.join(root, file), cisem_core_dir).replace("\\", "/")
        
        # Check if the filename or relative path is in the registry YAML
        if file not in registry_content and rel_path not in registry_content:
            loose_pages.append(rel_path)

print("LOOSE_PAGES:", loose_pages)
