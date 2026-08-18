#!/usr/bin/env python3
"""
RATIFIED RESOLUTION : GOV-2026-08-18-ZIP-EXPORT / One-Click Reviewer Context Pack Zip Exporter
REASONING           : Bundles Axioms V1.30 and all .agents/reviewer files into a single downloadable .zip archive.
PARENT PRINCIPLES   : AxiomsAndPrinciples.md (PR-13950, Zero-Drift Context Exports)
"""

import os
import zipfile

def export_reviewer_pack_zip():
    workspace_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    zip_path = os.path.join(workspace_root, "2026-08-18__CISEM__ReviewerContextPack__Export__V1.1.zip")
    
    files_to_bundle = [
        os.path.join(workspace_root, "2026-08-10__Gemini3.5__YarivHuman__AxiomsAndPrinciples__V1.30.md"),
        os.path.join(workspace_root, ".agents", "reviewer", "RULES.md"),
        os.path.join(workspace_root, ".agents", "reviewer", "INVENTORY.md"),
        os.path.join(workspace_root, ".agents", "reviewer", "INSTRUMENTS.md"),
        os.path.join(workspace_root, ".agents", "reviewer", "DATABASE_INTENT.md"),
        os.path.join(workspace_root, ".agents", "reviewer", "GOVERNANCE_STATE.md"),
        os.path.join(workspace_root, ".agents", "reviewer", "GENERATION_METADATA.json"),
    ]

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        for f in files_to_bundle:
            if not os.path.exists(f):
                error_msg = f"FATAL REVIEWER PACK ERROR: Mandatory named export file '{os.path.basename(f)}' is missing at '{f}'. Export halted."
                print(f"[!] {error_msg}")
                raise FileNotFoundError(error_msg)
            arcname = os.path.basename(f)
            zipf.write(f, arcname)
            print(f"[+] Bundled: {arcname}")

    print(f"[ SUCCESS ] Created One-Click Export Archive: {zip_path}")

if __name__ == "__main__":
    export_reviewer_pack_zip()
