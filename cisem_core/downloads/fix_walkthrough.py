import traceback

fpath = r"c:\Users\finky\Desktop\AntiGravity\Cisem CsAg\2026-08-10__AntigravityLocal__YarivHuman__Combined_Frontend_Refactor_i18n_Layout_Segregation_and_Priority_Engine_Walkthrough__V1.3.md"
try:
    with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    print("Before replace:", repr("## 3.0 Next Steps" in content))
    content = content.replace("## 3.0 Next Steps", "## Next Steps")
    print("After replace:", repr("## 3.0 Next Steps" in content))

    with open(fpath, "w", encoding="utf-8") as f:
        f.write(content)
    print("Write complete!")
except Exception as e:
    traceback.print_exc()
