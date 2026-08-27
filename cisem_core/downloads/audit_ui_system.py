import os
import glob
import re

print("=== CISEM UI/UX SYSTEM AUDIT ===")

# 1. Check Theme & Token Files
theme_files = [
    r"C:\Users\finky\Desktop\AntiGravity\Cisem CsAg\src\theme.ts",
    r"C:\Users\finky\Desktop\AntiGravity\Cisem CsAg\src\styles\design-tokens.css",
    r"C:\Users\finky\Desktop\AntiGravity\Cisem CsAg\src\styles\globals.css"
]

for tf in theme_files:
    if os.path.exists(tf):
        print(f"[FOUND THEME FILE]: {tf} ({os.path.getsize(tf)} bytes)")
    else:
        print(f"[MISSING THEME FILE]: {tf}")

# 2. Check Layout & Shared Components
shared_dir = r"C:\Users\finky\Desktop\AntiGravity\Cisem CsAg\src\components"
shared_components = glob.glob(os.path.join(shared_dir, "**", "*.tsx"), recursive=True) + glob.glob(os.path.join(shared_dir, "**", "*.jsx"), recursive=True)

print(f"\nTotal Components in src/components/: {len(shared_components)}")
print("Sample Components Found:")
for sc in shared_components[:15]:
    rel = os.path.relpath(sc, shared_dir)
    print(f" - {rel}")

# 3. Check Forbidden System Words in UI Viewports
views_dir = r"C:\Users\finky\Desktop\AntiGravity\Cisem CsAg\src\components\views"
view_files = glob.glob(os.path.join(views_dir, "*.tsx")) + glob.glob(os.path.join(views_dir, "*.jsx"))

forbidden_words = ["PostgreSQL", "Supabase", "RATIFIED", "CoreCycle", "Stage 1", "counterparty_id", "customer_account_id"]

print("\n=== FORBIDDEN SYSTEM WORDS SCAN IN VIEWPORTS ===")
for vf in view_files:
    vname = os.path.basename(vf)
    with open(vf, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Exclude code comments from scan
    code_body = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    code_body = re.sub(r'//.*', '', code_body)

    found_words = [w for w in forbidden_words if w in code_body]
    if found_words:
        print(f"[FORBIDDEN WORDS DETECTED] {vname}: {found_words}")
    else:
        print(f"[CLEAN VIEWPORT] {vname}: Zero forbidden system words.")

