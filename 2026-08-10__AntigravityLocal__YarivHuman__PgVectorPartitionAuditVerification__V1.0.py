#!/usr/bin/env python3
"""
# CISEM CODE HEADER > MANDATORY
# ratified_plan: CISEM-IP-20260810-VECTOR-PARTITION-AUDIT-V1.0
# governor_signature: GOV-YARIV-20260810-GOVERNANCE-HARDENING-RATIFIED
# version: V1.0
# reasoning: |
#   Verifies that postgres partitioned schemas for pgvector contain HNSW indexes
#   and use partition pruning keys in query functions to secure and accelerate searches.
#   Parent principles: AxiomsAndPrinciples V1.30 >AX-10000, >PR-11100, >PR-11300.
#   Resolves: Verification of PGVector Partition and Index constraints.
"""

import os
import re
import sys

def run_audit():
    print("=============================================================")
    print("CISEM PGVector & Partition Schema Audit Verifier v1.0")
    print("=============================================================")

    base_dir = os.path.dirname(os.path.abspath(__file__))
    schema_path = os.path.join(base_dir, "backend", "src", "backend", "schema.sql")

    if not os.path.exists(schema_path):
        print(f"[-] ERROR: Schema file not found at: {schema_path}")
        return False

    print(f"[+] Found schema file: {schema_path}")
    with open(schema_path, "r", encoding="utf-8") as f:
        sql_content = f.read()

    # 1. Check for pgvector extension
    if "CREATE EXTENSION IF NOT EXISTS vector;" in sql_content:
        print("[+] Check 1 PASSED: pgvector extension is enabled.")
    else:
        print("[-] Check 1 FAILED: pgvector extension load statement missing.")
        return False

    # 2. Check for Partitioned Table by LIST (tenant_id)
    partition_match = re.search(
        r"CREATE TABLE IF NOT EXISTS\s+product_embeddings\s*\(.*?\)\s*PARTITION BY LIST\s*\(\s*tenant_id\s*\);",
        sql_content,
        re.DOTALL | re.IGNORECASE
    )
    if partition_match or "PARTITION BY LIST (tenant_id)" in sql_content:
        print("[+] Check 2 PASSED: Table 'product_embeddings' is correctly partitioned by list (tenant_id).")
    else:
        print("[-] Check 2 FAILED: Table 'product_embeddings' is not partitioned by tenant_id.")
        return False

    # 3. Check for HNSW index creation on the parent table
    hnsw_match = re.search(
        r"CREATE INDEX IF NOT EXISTS\s+\w+\s+ON\s+product_embeddings\s+USING\s+hnsw\s*\(\s*embedding\s+vector_cosine_ops\s*\);",
        sql_content,
        re.DOTALL | re.IGNORECASE
    )
    if hnsw_match or "USING hnsw (embedding vector_cosine_ops)" in sql_content:
        print("[+] Check 3 PASSED: HNSW index is defined on product_embeddings(embedding).")
    else:
        print("[-] Check 3 FAILED: HNSW index is missing or not configured with vector_cosine_ops.")
        return False

    # 4. Check for partition pruning in match_product_embeddings function
    # It must contain: WHERE p.tenant_id = filter_tenant_id (or similar mapping)
    pruning_match = re.search(
        r"WHERE\s+\w+\.tenant_id\s*=\s*filter_tenant_id",
        sql_content,
        re.DOTALL | re.IGNORECASE
    )
    if pruning_match or "p.tenant_id = filter_tenant_id" in sql_content:
        print("[+] Check 4 PASSED: match_product_embeddings RPC function filters on tenant_id to leverage partition pruning.")
    else:
        print("[-] Check 4 FAILED: match_product_embeddings RPC does not filter on tenant_id at the top level of queries.")
        return False

    print("\n[+] Success: All PGVector & Partition Schema checks passed cleanly!")
    return True

if __name__ == "__main__":
    success = run_audit()
    if success:
        sys.exit(0)
    else:
        sys.exit(1)
