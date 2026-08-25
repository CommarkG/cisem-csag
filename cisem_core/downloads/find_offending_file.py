import os
import re

ROOT_DIR = r"c:\Users\finky\Desktop\AntiGravity\Cisem CsAg"

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
print("Sorted walkthroughs:")
for wt in walkthroughs:
    print(wt[0], os.path.basename(wt[1]))

latest_walkthrough = walkthroughs[0][1]
print("\nTarget file checked by gate:", latest_walkthrough)

with open(latest_walkthrough, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

pattern = r"##\s+(?:Next-Step\s+Recommendation|Next\s+Steps)"
matched = re.search(pattern, content, re.IGNORECASE)
print("Regex match:", matched)
if not matched:
    print("Failed walkthrough content:")
    print(repr(content[-300:]))
