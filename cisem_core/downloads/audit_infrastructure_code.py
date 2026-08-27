import os
import re

print("=== STATION 7 CODE SIDE INFRASTRUCTURE AUDIT ===")

root_dir = r"C:\Users\finky\Desktop\AntiGravity\Cisem CsAg"

items_to_check = {
    "1. inquiries Table Handling": r"\binquiries\b",
    "2. Vocabulary / Classification KIND": r"\bvocabulary\b|\bkind\b",
    "3. Urgency Field / Vocabulary": r"\burgency\b",
    "4. Idempotency Key Handling": r"\bidempotency\b|\bidempotency_key\b",
    "5. Inquiry Version Column": r"\bversion\b",
    "6. Human-Facing Numbering (INQ-...)": r"\binq-|\bnumbering\b|\binquiry_number\b",
    "7. Counterparty Mapping Types": r"\bcounterparty\b|\bcounterparty_id\b",
    "8. Catalogue / Inventory Lookup": r"\bcatalogue\b|\bcatalog\b",
    "9. AI Pocket Wrapper / Handshake": r"\bpocket\b|\bai_pocket\b",
    "10. Work Order Seal Frozen Target": r"\bseal\b|\bfrozen_target\b"
}

for label, pattern in items_to_check.items():
    matches = []
    for dirpath, dirnames, filenames in os.walk(os.path.join(root_dir, "src")):
        for fn in filenames:
            if fn.endswith((".tsx", ".jsx", ".ts", ".js")):
                fp = os.path.join(dirpath, fn)
                with open(fp, "r", encoding="utf-8", errors="ignore") as f:
                    lines = f.readlines()
                for i, line in enumerate(lines, 1):
                    if re.search(pattern, line, re.IGNORECASE):
                        rel = os.path.relpath(fp, root_dir)
                        matches.append(f"{rel}:{i}")
                        if len(matches) >= 3:
                            break
                if len(matches) >= 3:
                    break
        if len(matches) >= 3:
            break

    # Also check backend
    for dirpath, dirnames, filenames in os.walk(os.path.join(root_dir, "backend")):
        for fn in filenames:
            if fn.endswith((".py", ".sql")):
                fp = os.path.join(dirpath, fn)
                with open(fp, "r", encoding="utf-8", errors="ignore") as f:
                    lines = f.readlines()
                for i, line in enumerate(lines, 1):
                    if re.search(pattern, line, re.IGNORECASE):
                        rel = os.path.relpath(fp, root_dir)
                        matches.append(f"{rel}:{i}")
                        if len(matches) >= 5:
                            break

    print(f"\n{label}:")
    if matches:
        for m in matches[:5]:
            print(f"  - {m}")
    else:
        print("  - NONE FOUND")
