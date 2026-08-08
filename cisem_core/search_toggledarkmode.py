import os

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fpath = os.path.join(ROOT_DIR, "src", "app", "page.tsx")

with open(fpath, "r", encoding="utf-8") as f:
    lines = f.readlines()

print("TOGGLE_DARKMODE_SEARCH_RESULTS:")
for i, line in enumerate(lines):
    if "toggledarkmode" in line.lower() or "isdarkmode" in line.lower():
        print(f"Line {i+1}: {line.strip()}")
