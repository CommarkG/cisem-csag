import sys
import os

sys.path.append(r"c:\Users\finky\Desktop\AntiGravity\Cisem CsAg")
from cisem_core.platform_core.cisem_gate import ROOT_DIR

print("ROOT_DIR from gate script:", ROOT_DIR)
for f in os.listdir(ROOT_DIR):
    if "walkthrough" in f.lower() and f.endswith(".md"):
        print(f, os.path.getmtime(os.path.join(ROOT_DIR, f)))
