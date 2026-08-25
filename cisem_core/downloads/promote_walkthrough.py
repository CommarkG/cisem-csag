import os

old_path = r"c:\Users\finky\Desktop\AntiGravity\Cisem CsAg\2026-08-10__AntigravityLocal__YarivHuman__Combined_Frontend_Refactor_i18n_Layout_Segregation_and_Priority_Engine_Walkthrough__V1.3.md"
new_path = r"c:\Users\finky\Desktop\AntiGravity\Cisem CsAg\2026-08-10__AntigravityLocal__YarivHuman__Combined_Frontend_Refactor_i18n_Layout_Segregation_and_Priority_Engine_Walkthrough__V1.4.md"

if os.path.exists(old_path):
    with open(old_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
    
    content = content.replace("V1.3", "V1.4")
    content = content.replace("## 3.0 Next Steps", "## Next-Step Recommendation")
    content = content.replace("## Next Steps", "## Next-Step Recommendation")
    
    with open(new_path, "w", encoding="utf-8") as f:
        f.write(content)
        
    os.remove(old_path)
    print("Version bumped to V1.4 and V1.3 deleted.")
else:
    print("Old V1.3 path not found.")
