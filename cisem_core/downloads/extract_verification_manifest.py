#!/usr/bin/env python3
"""
CISEM Verification Manifest Auto-Extractor Tool
Parses DDL/SQL text and emits standardized verification manifest blocks:
  TABLE: name
  COLUMN: table.column
  FUNCTION: name
  POLICY: table.policyname
"""
import re
import sys

def extract_manifest(sql_text):
    creates_tables = set(re.findall(r'CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?([a_z0_9_]+)', sql_text, re.IGNORECASE))
    creates_cols = set(re.findall(r'ALTER\s+TABLE\s+(?:public\.)?([a_z0_9_]+)\s+ADD\s+COLUMN\s+(?:IF\s+NOT\s+EXISTS\s+)?([a_z0_9_]+)', sql_text, re.IGNORECASE))
    creates_funcs = set(re.findall(r'CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION\s+(?:public\.)?([a_z0_9_]+\([^)]*\))', sql_text, re.IGNORECASE))
    creates_policies = set(re.findall(r'CREATE\s+POLICY\s+([a_z0_9_]+)\s+ON\s+(?:public\.)?([a_z0_9_]+)', sql_text, re.IGNORECASE))

    all_tables = set(re.findall(r'(?:TABLE|INTO|FROM|JOIN)\s+(?:public\.)?([a_z0_9_]+)', sql_text, re.IGNORECASE))
    reserved = {'SELECT', 'WHERE', 'AND', 'OR', 'IF', 'EXISTS', 'COALESCE', 'NOW', 'ARRAY_AGG', 'NULL', 'IS', 'NOT'}
    existing_tables = {t for t in all_tables if t.upper() not in reserved and t not in creates_tables}

    print("=== AUTOMATED VERIFICATION MANIFEST ===")
    print("\n--- EXISTS (Must Pre-Exist in DB) ---")
    for t in sorted(existing_tables):
        print(f"TABLE: {t}")

    print("\n--- CREATES (Added/Created by DDL) ---")
    for t in sorted(creates_tables):
        print(f"TABLE: {t}")
    for tbl, col in sorted(creates_cols):
        print(f"COLUMN: {tbl}.{col}")
    for f in sorted(creates_funcs):
        print(f"FUNCTION: {f}")
    for pol, tbl in sorted(creates_policies):
        print(f"POLICY: {tbl}.{pol}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        with open(sys.argv[1], 'r', encoding='utf-8') as f:
            extract_manifest(f.read())
