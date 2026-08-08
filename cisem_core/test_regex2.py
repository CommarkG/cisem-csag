import os
import re

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fpath = os.path.join(ROOT_DIR, "2026-08-08__AntigravityLocal__YarivHuman__Walkthrough_Target_Studio_Operator_Architecture_Results_Walkthrough__V1.0.md")

with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

print("File Length:", len(content))
print("Match:", re.search(r"##\s+(?:Next-Step\s+Recommendation|Next\s+Steps)", content, re.IGNORECASE))
print("Last 200 chars:", repr(content[-200:]))
