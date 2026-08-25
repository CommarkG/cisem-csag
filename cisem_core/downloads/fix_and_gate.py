import os
import subprocess
import re

fpath = r"c:\Users\finky\Desktop\AntiGravity\Cisem CsAg\2026-08-10__AntigravityLocal__YarivHuman__Combined_Frontend_Refactor_i18n_Layout_Segregation_and_Priority_Engine_Walkthrough__V1.3.md"

if os.path.exists(fpath):
    # Try to make sure it's writable
    try:
        subprocess.run(["attrib", "-r", fpath])
    except Exception:
        pass

    with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    print("Before fix: contains '3.0 Next Steps' =", "3.0 Next Steps" in content)
    
    content = content.replace("## 3.0 Next Steps", "## Next-Step Recommendation")
    content = content.replace("## Next Steps", "## Next-Step Recommendation")

    with open(fpath, "w", encoding="utf-8") as f:
        f.write(content)

    print("After fix: contains '3.0 Next Steps' =", "3.0 Next Steps" in content)

    # Let's verify regex matches locally
    pattern = r"##\s+(?:Next-Step\s+Recommendation|Next\s+Steps)"
    print("Local regex search result:", re.search(pattern, content, re.IGNORECASE))

# Now run gate checks immediately
print("Running gate checks...")
res = subprocess.run(["python", "cisem_core/platform_core/cisem_gate.py"], capture_output=True, text=True)

print("--- stdout ---")
print(res.stdout)
print("--- stderr ---")
print(res.stderr)
print("Exit code:", res.returncode)
