-- SQL Schema Migration: Autonomous Sales Agent + Twenty CRM Sync
-- Enable pgvector extension and configure partitioned index tables.

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create parent table partitioned by LIST (tenant_id)
CREATE TABLE IF NOT EXISTS product_embeddings (
  id UUID DEFAULT gen_random_uuid(),
  medusa_product_id VARCHAR(255) NOT NULL,
  tenant_id VARCHAR(255) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  embedding vector(768) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (medusa_product_id, tenant_id)
) PARTITION BY LIST (tenant_id);

-- 3. Create default partition for fallback tenants
CREATE TABLE IF NOT EXISTS product_embeddings_default 
PARTITION OF product_embeddings DEFAULT;

-- 4. RPC function to perform scoped cosine similarity searches
-- This utilizes PostgreSQL partition pruning to scope the HNSW search to the tenant subset.
CREATE OR REPLACE FUNCTION match_product_embeddings(
  query_embedding vector(768),
  filter_tenant_id VARCHAR(255),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  medusa_product_id VARCHAR(255),
  title TEXT,
  image_url TEXT,
  similarity_score FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.medusa_product_id,
    p.title,
    p.image_url,
    (1 - (p.embedding <=> query_embedding))::FLOAT AS similarity_score
  FROM product_embeddings p
  WHERE p.tenant_id = filter_tenant_id
    AND (1 - (p.embedding <=> query_embedding)) >= match_threshold
  ORDER BY p.embedding <=> query_embedding ASC
  LIMIT match_count;
END;
$$;

-- 5. Create HNSW index on parent table (propagates to child partitions)
CREATE INDEX IF NOT EXISTS product_embeddings_hnsw_idx ON product_embeddings USING hnsw (embedding vector_cosine_ops);
