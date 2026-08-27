import re

main_path = r"C:\Users\finky\Desktop\AntiGravity\Cisem CsAg\backend\src\backend\main.py"
with open(main_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

print(f"Total Lines in main.py: {len(lines)}")

silent_fallbacks = []

for i, line in enumerate(lines):
    if "except" in line and ":" in line:
        # Inspect the next 5 lines for data-returning fallback patterns
        block = "".join(lines[i:i+8])
        if "return {" in block or "return [" in block or "db_save_" in block or "db_get_" in block or "print(" in block and "return" in block and "raise" not in block:
            # Filter out standard 500 error raises
            if "raise HTTPException" not in block and "raise " not in block:
                silent_fallbacks.append((i + 1, line.strip(), block.strip()))

print(f"Total Silent Fallback Blocks Found in main.py: {len(silent_fallbacks)}")
print("=" * 70)
for line_num, header, blk in silent_fallbacks:
    print(f"Line {line_num}: {header}")
    print(f"Snippet:\n{blk}")
    print("-" * 50)
