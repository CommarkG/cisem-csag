import os
import re
import sys

sys.path.append(r"c:\Users\finky\Desktop\AntiGravity\Cisem CsAg")
from cisem_core.platform_core.cisem_gate import ROOT_DIR

walkthroughs = []
for f in os.listdir(ROOT_DIR):
    if "walkthrough" in f.lower() and f.endswith(".md"):
        if "marketing" in f.lower() or "sales" in f.lower() or "cosmic" in f.lower() or "operator" in f.lower() or "walkthrough__v1.0" in f.lower():
            continue
        fpath = os.path.join(ROOT_DIR, f)
        try:
            mtime = os.path.getmtime(fpath)
            walkthroughs.append((mtime, fpath))
        except Exception:
            pass

walkthroughs.sort(key=lambda x: x[0], reverse=True)
latest_walkthrough = walkthroughs[0][1]
print("Latest walkthrough selected by gate:", latest_walkthrough)

with open(latest_walkthrough, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

print("File content length:", len(content))
pattern = r"##\s+(?:Next-Step\s+Recommendation|Next\s+Steps)"
matched = re.search(pattern, content, re.IGNORECASE)
print("Regex pattern:", pattern)
print("Regex match in debug:", matched)
if matched:
    print("Matched text:", repr(matched.group(0)))
else:
    print("No match found!")
