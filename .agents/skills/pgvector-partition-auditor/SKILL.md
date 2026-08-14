---
name: "pgvector-partition-auditor"
description: "Audits Supabase PostgreSQL vector partitions and HNSW indexes."
version: "1.0"
---

# PGVector Partition Auditor Skill

This skill executes database queries to verify that:
1. Product embedding child tables are correctly partitioned by tenant.
2. The HNSW index is active on the partition structure.
3. Cosine similarity queries utilize partition pruning.

## Invocation

Run the auditor via:
```bash
python cisem_core/platform_core/2026-08-10__CISEM__AntigravityLocal__PgVectorPartitionAuditVerification__V1.0.py
```
