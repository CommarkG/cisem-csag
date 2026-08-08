import os

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fpath = os.path.join(ROOT_DIR, "src", "app", "page.tsx")

with open(fpath, "r", encoding="utf-8") as f:
    lines = f.readlines()

print("LOCALSTORAGE_OR_EFFECT_SEARCH_RESULTS:")
for i, line in enumerate(lines[:300]):
    if "localstorage" in line.lower() or "useeffect" in line.lower() or "dark" in line.lower():
        print(f"Line {i+1}: {line.strip()}")
