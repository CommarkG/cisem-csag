"""
CISEM Industry Vocabulary Law Pre-Commit Gate
Tool: cisem_core/tools/gate_industry_vocabulary.py
Ratified Law: AGENTS.md Position 1 Ruling Three (2026-09-02)

Scans changed files or workspace files against retired vocabulary terms and baseline counts.
"""

import sys
import os
import re
import json

RETIRED_TERMS = {
    'core cycle': [r'\bcore\s*cycle\b', r'\bcorecycle\b', r'\bcore_cycle\b'],
    'corespine': [r'\bcorespine\b', r'\bcore_spine\b', r'\bcore\s+spine\b'],
    'depth before breadth': [r'\bdepth\s+before\s+breadth\b', r'\bdepth-before-breadth\b'],
    'progressive specification': [r'\bprogressive\s+specification\b', r'\bprogressive_specification\b'],
    'maturity axis': [r'\bmaturity\s+axis\b', r'\bmaturity_axis\b']
}

BASELINE_FILE = r'C:\Users\finky\Desktop\AntiGravity\Cisem CsAg\cisem_core\retired_vocabulary_baseline.json'

def scan_file(file_path):
    if not os.path.exists(file_path):
        return {}
    
    # Exclude baseline file and the gate script itself
    if 'retired_vocabulary_baseline.json' in file_path or 'gate_industry_vocabulary.py' in file_path:
        return {}

    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception as e:
        sys.stderr.write(f"Warning reading {file_path}: {e}\n")
        return {}

    findings = {}
    for term, patterns in RETIRED_TERMS.items():
        for pat in patterns:
            matches = re.findall(pat, content, re.IGNORECASE)
            if matches:
                findings[term] = len(matches)
                break
    return findings

def main():
    target_files = sys.argv[1:]
    
    if not target_files:
        print("Usage: python gate_industry_vocabulary.py <file1> <file2> ...")
        sys.exit(1)

    blocked = False
    total_violations = 0

    print("=== CISEM INDUSTRY VOCABULARY LAW GATE CHECK ===")
    for fpath in target_files:
        results = scan_file(fpath)
        if results:
            blocked = True
            print(f"FAILED BLOCKED: File '{fpath}' contains retired vocabulary terms:")
            for term, count in results.items():
                print(f"   - '{term}': {count} occurrence(s)")
                total_violations += count
        else:
            print(f"PASSED: File '{fpath}' complies with Industry Vocabulary Law.")

    if blocked:
        print(f"\nSTATUS: BLOCKED (Total Violations: {total_violations})")
        print("Remediation: Replace retired terms with standard industry vocabulary per AGENTS.md Ruling Three.")
        sys.exit(1)
    else:
        print("\nSTATUS: PASSED (Zero Vocabulary Violations)")
        sys.exit(0)

if __name__ == '__main__':
    main()
