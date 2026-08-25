import re

fpath = r"c:\Users\finky\Desktop\AntiGravity\Cisem CsAg\2026-08-10__AntigravityLocal__YarivHuman__Combined_Frontend_Refactor_i18n_Layout_Segregation_and_Priority_Engine_Walkthrough__V1.3.md"

with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

print("Original contains '3.0 Next Steps':", "3.0 Next Steps" in content)
content = content.replace("## 3.0 Next Steps", "## Next-Step Recommendation")
print("After replacement contains '3.0 Next Steps':", "3.0 Next Steps" in content)

with open(fpath, "w", encoding="utf-8") as f:
    f.write(content)

print("File written.")

with open(fpath, "r", encoding="utf-8") as f:
    verify_content = f.read()

print("Read back contains '3.0 Next Steps':", "3.0 Next Steps" in verify_content)
pattern = r"##\s+(?:Next-Step\s+Recommendation|Next\s+Steps)"
matched = re.search(pattern, verify_content, re.IGNORECASE)
print("Regex match on read back:", matched)
if matched:
    print("Matched text:", repr(matched.group(0)))
