#!/usr/bin/env python3
# ratified_plan: CISEM-IP-20260807-INGESTION-SPINE
# governor_signature: GOV-YARIV-20260807-INGESTION-SPINE-V1.0
"""
CISEM Wisdom Ingestor Script
Description: Parses versioned master design documents, segments them logically, 
             and writes chunks to Supabase document_chunks with 'brief_raw' status.
"""

import os
import re
import sys
import uuid
import httpx
from dotenv import load_dotenv
from supabase import create_client, Client
from supabase.lib.client_options import SyncClientOptions

# Load environment
CORE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(CORE_DIR)
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
load_dotenv(os.path.join(BACKEND_DIR, ".env"))

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("[ERROR] Supabase credentials not found in environment.")
    sys.exit(1)

# Initialize Supabase client
http_client = httpx.Client(verify=False)
options = SyncClientOptions(httpx_client=http_client)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY, options=options)

def get_active_workspace_id():
    """Queries workspace ID from DB or returns a fallback."""
    try:
        res = supabase.table("workspaces").select("id").limit(1).execute()
        if res.data:
            return res.data[0]["id"]
    except Exception as e:
        print(f"Warning: could not query workspace ID: {e}")
    return str(uuid.uuid4())

def get_any_client_id(workspace_id):
    """Queries a valid user ID from the users table, or creates a default user if empty."""
    try:
        res = supabase.table("users").select("id").limit(1).execute()
        if res.data:
            return res.data[0]["id"]
            
        # Insert a default user profile to satisfy the foreign key constraint
        dummy_user = {
            "email": "governor@cisem.local",
            "full_name": "Yariv Governor",
            "workspace_id": workspace_id
        }
        print("[*] No user found in 'users' table. Creating default user...")
        res_insert = supabase.table("users").insert(dummy_user).execute()
        if res_insert.data:
            return res_insert.data[0]["id"]
    except Exception as e:
        print(f"Warning: could not query/create user ID: {e}")
    return str(uuid.uuid4())

def chunk_document(text, chunk_size_chars=1500):
    """
    Splits text by markdown headers or logical paragraph boundaries.
    Ensures chunks are reasonably sized and carry structural context.
    """
    sections = re.split(r'(?=\n##\s+)', text)
    chunks = []
    
    for section in sections:
        section = section.strip()
        if not section:
            continue
            
        if len(section) <= chunk_size_chars:
            chunks.append(section)
        else:
            paragraphs = [p.strip() for p in section.split("\n\n") if p.strip()]
            current_chunk = []
            current_len = 0
            
            for para in paragraphs:
                if current_len + len(para) > chunk_size_chars and current_chunk:
                    chunks.append("\n\n".join(current_chunk))
                    current_chunk = [para]
                    current_len = len(para)
                else:
                    current_chunk.append(para)
                    current_len += len(para)
                    
            if current_chunk:
                chunks.append("\n\n".join(current_chunk))
                
    return chunks

def run_ingestion():
    master_file = os.path.join(ROOT_DIR, "2026-08-07__CISEM__AntigravityLocal__FiveStructuralConcepts__V1.0.md")
    if not os.path.exists(master_file):
        print(f"[ERROR] Master file not found at: {master_file}")
        sys.exit(1)
        
    print(f"[*] Reading master concepts file: {os.path.basename(master_file)}")
    with open(master_file, "r", encoding="utf-8") as f:
        raw_content = f.read()
        
    workspace_id = get_active_workspace_id()
    client_id = get_any_client_id(workspace_id)
    print(f"[*] Active Workspace ID resolved to: {workspace_id}")
    print(f"[*] Active Client ID (User ID) resolved to: {client_id}")
    
    # Insert into briefs table matching the database schema
    brief_data = {
        "raw_requirements": raw_content,
        "completeness_score": 100,
        "title": "Five Structural Concepts Master Definition",
        "target_quantity": 1,
        "target_unit_budget": 0.00,
        "parsed_constraints": {
            "document_type": "CANONICAL_PHILOSOPHICAL_ROOT",
            "role": "system_wisdom",
            "source": "Claude AI Draft Ingestion",
            "original_filename": "BRAIN-DRAFT_Five-Structural-Concepts_2026-08-07.md"
        },
        "workspace_id": workspace_id,
        "client_id": client_id
    }
    
    print("[*] Saving raw document to briefs table...")
    res = supabase.table("briefs").insert(brief_data).execute()
    if not res.data:
        print("[ERROR] Failed to save raw brief data.")
        sys.exit(1)
        
    brief_id = res.data[0]["id"]
    print(f"[+] Document saved with ID: {brief_id}")
    
    # Chunk and insert into document_chunks table
    print("[*] Segmenting document into logical chunks...")
    chunks = chunk_document(raw_content)
    print(f"[*] Total logical segments: {len(chunks)}")
    
    for idx, chunk in enumerate(chunks):
        serial_code = f"BC-{brief_id[:8]}-{idx+1:02d}"
        supabase.table("document_chunks").insert({
            "serial_code": serial_code,
            "parent_type": "brief",
            "parent_id": brief_id,
            "chunk_text": chunk,
            "status_code": "brief_raw",  # Maps to raw_and_context status
            "sequence_order": idx + 1
        }).execute()
        print(f"  [+] Ingested chunk {idx+1}/{len(chunks)}: {serial_code}")
        
    print("[+] Ingestion Completed successfully.")
    
if __name__ == "__main__":
    run_ingestion()
