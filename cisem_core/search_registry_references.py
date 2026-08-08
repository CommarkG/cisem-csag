import os

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

for root, dirs, files in os.walk(os.path.join(ROOT_DIR, "cisem_core")):
    for name in files:
        if name.endswith(".py"):
            fpath = os.path.join(root, name)
            with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            if "Universal_Workspace_and_Accountability_Registry" in content:
                print(f"FOUND IN: {os.path.relpath(fpath, ROOT_DIR)}")
