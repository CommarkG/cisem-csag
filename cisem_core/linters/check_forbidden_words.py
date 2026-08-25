# check_forbidden_words.py
# HONEST CEILING: A word scanner is defeated by splitting a string in two. IT STOPS THE ACCIDENT, NEVER THE INTENT.

import os
import sys
import json
import re

CORE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT_DIR = os.path.dirname(CORE_DIR)
CONFIG_PATH = os.path.join(CORE_DIR, "linters", "forbidden_words.json")

def check_forbidden_words_in_file(file_path):
    """Scans target source file for hardcoded personal names or email patterns outside governance headers."""
    if not os.path.exists(CONFIG_PATH):
        print(f"CISEM_GATE_WARNING: forbidden_words.json missing at {CONFIG_PATH}")
        return

    try:
        with open(CONFIG_PATH, "r", encoding="utf-8") as cf:
            cfg = json.load(cf)
    except Exception as e:
        print(f"CISEM_GATE_BLOCKED -- Failed to parse forbidden_words.json: {e}")
        sys.exit(1)

    forbidden_words = cfg.get("forbidden_words", [])
    forbidden_patterns = [re.compile(p, re.IGNORECASE) for p in cfg.get("forbidden_patterns", [])]
    exempt_patterns = cfg.get("exempt_header_patterns", [])

    if not os.path.exists(file_path):
        return

    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            lines = f.readlines()
    except Exception:
        return

    violations = []
    for idx, line in enumerate(lines, 1):
        # Exempt governance header lines or signature blocks
        if any(exempt_str in line for exempt_str in exempt_patterns):
            continue

        # Exempt line comments that explicitly mark historical signatures
        if "governor_signature" in line or "GOV-" in line:
            continue

        # Check exact forbidden word matches
        for word in forbidden_words:
            if re.search(r'\b' + re.escape(word) + r'\b', line):
                violations.append((idx, f"Hardcoded personal identity/word '{word}' found in non-exempt line: {line.strip()}"))

        # Check pattern matches (e.g. emails)
        for pat in forbidden_patterns:
            if pat.search(line):
                violations.append((idx, f"Hardcoded pattern match '{pat.pattern}' found in non-exempt line: {line.strip()}"))

    if violations:
        print(f"CISEM_GATE_BLOCKED -- Phase 29: Forbidden words/patterns detected in '{file_path}'!")
        for line_num, msg in violations[:5]:
            print(f"  Line {line_num}: {msg}")
        sys.exit(1)

    print(f"  Phase 29: PASS. No forbidden words or emails in '{os.path.basename(file_path)}'.")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        check_forbidden_words_in_file(sys.argv[1])
    else:
        print("Usage: python check_forbidden_words.py <file_path>")
