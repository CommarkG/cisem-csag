#!/usr/bin/env python3
import sys
import re
import os

def audit_cr_ext_dependencies(sql_content: str) -> list:
    """
    Scans SQL DDL statements for illegal CR -> EXT dependency references.
    Prohibited: A CR table (cr_*) having a Foreign Key or REFERENCE to an EXT table (ext_*).
    """
    violations = []
    
    # Pattern 1: ALTER TABLE cr_* ADD CONSTRAINT ... REFERENCES ext_*
    fk_matches = re.findall(
        r"ALTER\s+TABLE\s+(cr_\w+)\s+ADD\s+CONSTRAINT\s+\w+\s+FOREIGN\s+KEY\s*\([^)]+\)\s*REFERENCES\s+(ext_\w+)",
        sql_content,
        re.IGNORECASE
    )
    for cr_table, ext_table in fk_matches:
        violations.append(f"Prohibited FK: CR table '{cr_table}' references EXT table '{ext_table}'")

    # Pattern 2: Inside CREATE TABLE cr_*, a column definition with REFERENCES ext_*
    create_table_blocks = re.findall(
        r"CREATE\s+TABLE\s+(cr_\w+)\s*\(([^;]+)\);",
        sql_content,
        re.IGNORECASE | re.DOTALL
    )
    for cr_table, body in create_table_blocks:
        ref_matches = re.findall(r"REFERENCES\s+(ext_\w+)", body, re.IGNORECASE)
        for ext_table in ref_matches:
            violations.append(f"Prohibited Column Reference: CR table '{cr_table}' references EXT table '{ext_table}'")

    return violations

def main():
    if len(sys.argv) > 1:
        target_path = sys.argv[1]
        with open(target_path, "r", encoding="utf-8") as f:
            content = f.read()
    else:
        # Default scan on stdin or workspace migrations
        content = sys.stdin.read() if not sys.stdin.isatty() else ""

    violations = audit_cr_ext_dependencies(content)

    if violations:
        print("STATUS: BLOCKED")
        print(f"CR -> EXT Dependency Rule Violations Found: {len(violations)}")
        for v in violations:
            print(f"  - [RULE VIOLATION]: {v}")
        sys.exit(1)
    else:
        print("STATUS: PASSED")
        print("Zero CR -> EXT dependency violations found.")
        sys.exit(0)

if __name__ == "__main__":
    main()
