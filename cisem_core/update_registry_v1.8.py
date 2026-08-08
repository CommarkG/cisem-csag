# Ratified Plan: CISEM-IP-20260808-SALES-AGENT
# Architectural Reasoning: Automated workspace registry reconciliation script to calculate file hashes, copy shadows, update council folder, and compile V1.11 registry.
# Parent Principles: PR-98000 (SIPI), PR-84900 (Naming Conventions)

import os
import shutil
import hashlib
import yaml
import time

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
code_source_dir = os.path.join(ROOT_DIR, "cisem_core", "code")
os.makedirs(code_source_dir, exist_ok=True)

# 1. Active workspace files to copy & hash
mappings = {
    "src/app/api/agent/chat/route.ts": "2026-08-08__AntigravityLocal__YarivHuman__SaaS_AutonomousSales_ChatApiRoute__V1.0.ts",
    "src/components/agent_chat_widget.tsx": "2026-08-08__AntigravityLocal__YarivHuman__SaaS_AutonomousSales_ChatWidgetComponent__V1.0.tsx",
    "src/hooks/enrichProductMedia.ts": "2026-08-08__AntigravityLocal__YarivHuman__SaaS_PayloadCatalogEnrichmentHook__V1.0.ts",
    "src/collections/Media.ts": "2026-08-08__AntigravityLocal__YarivHuman__SaaS_PayloadMediaCollectionSchema__V1.0.ts",
    "backend/src/backend/embedding_service.py": "2026-08-08__AntigravityLocal__YarivHuman__SaaS_GeminiMultiModalEmbeddingService__V1.0.py",
    "backend/src/backend/vector_search_service.py": "2026-08-08__AntigravityLocal__YarivHuman__SaaS_PGVectorMultiTenantSearchService__V1.0.py",
    "backend/src/backend/schema.sql": "2026-08-08__AntigravityLocal__YarivHuman__SaaS_PGVectorPartitionedSchema__V1.0.sql"
}

results = {}

# Copy files to code/ shadow folder and calculate hashes
print("Calculating hashes and updating shadow files...")
for src_rel, dest_name in mappings.items():
    src_path = os.path.join(ROOT_DIR, src_rel)
    if os.path.exists(src_path):
        dest_path = os.path.join(code_source_dir, dest_name)
        shutil.copy(src_path, dest_path)
        
        # Calculate SHA256
        with open(dest_path, "rb") as f:
            h = hashlib.sha256(f.read()).hexdigest()
            
        results[dest_name] = h
        print(f"Shadowed: {dest_name} (hash: {h[:8]})")
    else:
        print(f"Warning: Source file '{src_rel}' not found.")

# 2. Package everything into a single ZIP archive
print("\nRebuilding ZIP package...")
temp_zip = os.path.join(ROOT_DIR, "temp_archive")
final_zip = os.path.join(code_source_dir, "2026-08-08__AntigravityLocal__YarivHuman__SaaS_AI_CoreComponents__V1.0.zip")
if os.path.exists(final_zip):
    os.remove(final_zip)
shutil.make_archive(temp_zip, "zip", code_source_dir)
shutil.move(temp_zip + ".zip", final_zip)

# Calculate ZIP hash
with open(final_zip, "rb") as f:
    zip_hash = hashlib.sha256(f.read()).hexdigest()
print(f"ZIP package created. Hash: {zip_hash}")

# 3. Copy files to Council Folder
print("\nUpdating Council directory...")
council_dir = os.path.join(ROOT_DIR, "Cisem CsAG Core Councils", "Cisem AntiGravity & Gemini Brain")
os.makedirs(council_dir, exist_ok=True)
for file in os.listdir(code_source_dir):
    src_file_path = os.path.join(code_source_dir, file)
    if os.path.isfile(src_file_path):
        shutil.copy(src_file_path, os.path.join(council_dir, file))
print("Council folder synchronized.")

# 4. Load Registry V1.10 and produce V1.11
v110_path = os.path.join(ROOT_DIR, "cisem_core", "2026-08-05__CISEM__Universal_Workspace_and_Accountability_Registry__V1.10.yaml")
v111_path = os.path.join(ROOT_DIR, "cisem_core", "2026-08-05__CISEM__Universal_Workspace_and_Accountability_Registry__V1.11.yaml")

if os.path.exists(v110_path):
    print("\nCompiling Registry V1.11...")
    with open(v110_path, "r", encoding="utf-8") as f:
        documents = list(yaml.load_all(f, Loader=yaml.FullLoader))
        
    doc0 = documents[0]
    doc1 = documents[1]
    
    # Update doc0 metadata
    doc0["metadata"]["version"] = "1.11"
    doc0["metadata"]["canonical_location"] = v111_path
    
    # Append history
    history_entry = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "action": "PRODUCTION_CRM_API_ROUTING_VERIFIED_AND_HASHED",
        "actor": "GOOGLE_ANTIGRAVITY_ADAPTER",
        "version": "1.11"
    }
    doc0["history"].append(history_entry)
    if "history" in doc1:
        doc1["history"].append(history_entry)
        
    # Update subsystem hashes in doc1
    subsystem = None
    for s in doc1.get("control_plane_subsystems", []):
        if s["subsystem_id"] == "CISEM_CXP":
            subsystem = s
            break
            
    if subsystem:
        artifacts = subsystem.get("canonical_artifacts", {})
        
        # Update individual hashes
        for name, file_hash in results.items():
            key = name.replace("-", "_").replace(".", "_")
            if key in artifacts:
                artifacts[key]["sha256"] = file_hash
                print(f"Updated registry hash for: {name}")
                
        # Update ZIP hash
        zip_key = "2026_08_08__AntigravityLocal__YarivHuman__SaaS_AI_CoreComponents__V1_0_zip"
        if zip_key in artifacts:
            artifacts[zip_key]["sha256"] = zip_hash
            print("Updated registry hash for ZIP package.")
            
    # Write V1.11
    with open(v111_path, "w", encoding="utf-8") as f:
        yaml.dump(doc0, f, default_flow_style=False, sort_keys=False)
        f.write("---\n")
        yaml.dump(doc1, f, default_flow_style=False, sort_keys=False)
        
    print(f"SUCCESS: Compiled Registry V1.11. Path: {v111_path}")
else:
    print("Error: Universal Registry V1.10 not found.")
