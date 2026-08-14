# Multimodal Sales Vector Schema Integration & PostgreSQL Partitions Audit

1.1. **Introduction**:
This design plan governs **CoreCycle 9: Multimodal Sales Vector Schema Integration & PostgreSQL Partitions Audit**. It addresses potential performance bottlenecks and security isolation gaps in pgvector-based catalog searches. It proposes adding a hierarchical navigable small world (HNSW) index to the partitioned vector space, implementing dynamic partition verification rules, and creating an automated validation test script to ensure tenant query isolation.

---

## User Review Required

2.1. **Vector Index Acceleration**:
> [!IMPORTANT]
> - **HNSW Index Injection**: We will define an HNSW index on the parent table `product_embeddings` using `vector_cosine_ops`. This index automatically propagates to all child tenant partitions, converting sequential scans into fast logarithmic searches.
> - **Partition Pruning Enforcement**: The RPC search function `match_product_embeddings` will be audited to guarantee that Postgres partition pruning is triggered by filtering on `tenant_id` at the query boundary, preventing cross-tenant vector data leaks.

---

## Open Questions

3.1. **Supabase Local Testing**:
> [!NOTE]
> - **Q: How will the Postgres partition rules be validated offline?**: We will build an independent validation script `PgVectorPartitionAuditVerification__V1.0.py` that parses the schema SQL and runs offline SQL verification and partition pruning assertions.

---

## Proposed Changes

4.1. **Database Schema Components**

#### [MODIFY] [SaaS_PGVectorPartitionedSchema__V1.0.sql](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/code/2026-08-08__AntigravityLocal__YarivHuman__SaaS_PGVectorPartitionedSchema__V1.0.sql)
- Append index definition: `CREATE INDEX IF NOT EXISTS product_embeddings_hnsw_idx ON product_embeddings USING hnsw (embedding vector_cosine_ops);`.
- Verify signature constraints and compilation header tags.

#### [MODIFY] [schema.sql](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/schema.sql)
- Sync HNSW index creation script to align production backend schemas.

---

4.2. **Verification & Audit Utilities**

#### [NEW] [PgVectorPartitionAuditVerification__V1.0.py](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/2026-08-10__AntigravityLocal__YarivHuman__PgVectorPartitionAuditVerification__V1.0.py)
- Develop a Python validation script that:
  - Parses the SQL schema file and extracts partitioned keys.
  - Verifies presence of pgvector extension commands and HNSW indices.
  - Simulates query execution path checks to confirm that the `tenant_id` parameter acts as a pruning key.

#### [NEW] [update_registry_v1.42.py](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/update_registry_v1.42.py)
- Create a script to copy and upgrade the Universal Workspace Registry to version `V1.42`.
- Recalculate all workspace SHA-256 hashes to maintain compiler gate integrity.

---

## Verification Plan

5.1. **Automated Verification**:
- Run the partition verification check script:
  ```powershell
  python 2026-08-10__AntigravityLocal__YarivHuman__PgVectorPartitionAuditVerification__V1.0.py
  ```
- Run the compiler gate script to verify metadata and registry alignment:
  ```powershell
  python cisem_core/platform_core/cisem_gate.py
  ```
