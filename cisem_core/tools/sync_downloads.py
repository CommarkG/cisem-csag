# cisem_core/tools/sync_downloads.py
# PERMANENT DOWNLOADS SYNC MECHANISM (Rule P1 / P2 / P3)
# Automatically copies all planning documents, artifacts, and visual proofs to cisem_core/downloads/

import os
import shutil

def sync_all_downloads():
    workspace_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    downloads_dir = os.path.join(workspace_root, "cisem_core", "downloads")
    os.makedirs(downloads_dir, exist_ok=True)
    
    sync_sources = [
        os.path.join(workspace_root, "cisem_core", "planning"),
        os.path.join(workspace_root, "cisem_core", "platform_core"),
        os.path.join(workspace_root, "scratch"),
        os.path.join(workspace_root, "public", "downloads")
    ]
    
    synced_count = 0
    for src in sync_sources:
        if os.path.exists(src):
            for fname in os.listdir(src):
                fpath = os.path.join(src, fname)
                if os.path.isfile(fpath):
                    dstpath = os.path.join(downloads_dir, fname)
                    shutil.copy2(fpath, dstpath)
                    synced_count += 1
                    
    print(f"[DOWNLOADS SYNC SUCCESS] Synced {synced_count} files into {downloads_dir}")

if __name__ == "__main__":
    sync_all_downloads()
