#!/usr/bin/env python3
"""
# CISEM CODE HEADER > MANDATORY
# ratified_plan: CISEM-IP-20260807-PLANNING-SPINE
# governor_signature: GOV-YARIV-20260807-PLANNING-SPINE-V1.0
# version: V0.7
# reasoning: |
#   This script reconciles the registry schema structure against reality on disk.
#   It verifies existence, path uniqueness, and computes file checksum hashes
#   to detect silent edits or corruption of critical Control Plane resources.
#   Added --update-hashes flag to automate yaml hash commits.
#   V0.7 2026-08-14:
#     R1  — WorkspaceReconciler() constructor moved inside try block.
#     R2  — Findings exit 0; execution failures exit non-zero. No longer conflated.
#     R3-REV — Hash IO failures go to exec_failures list (second list), not findings.
#              Every other check continues regardless.
#     R5+W1.1 — ReconciliationError / ReconcilerExecutionError deleted. Class was
#              unreachable after R2. RegistryLoadError covers the only unrecoverable path.
#     W1.2 — exec_failures printed to stdout under "--- Execution Failures ---" heading
#            so a stdout reader sees that checks did not run, PLUS copied to stderr.
#   Parent principles: AxiomsAndPrinciples V1.20 >AX-10000, >PR-98000.

CISEM Workspace Registry Reconciler
Version: 0.7
Description: Executable proof verifying the Universal Workspace and Accountability Registry.
"""
import os
import sys
import yaml
import hashlib
import re

# Custom Exceptions
class RegistryLoadError(Exception):
    """Raised when the Universal Registry fails to load."""
    pass

# ReconciliationError / ReconcilerExecutionError DELETED (W1.1).
# After R2+R3-REV, reconcile() never raises on findings or exec failures.
# RegistryLoadError covers the only unrecoverable path (load_registry).

# Dynamic Config Import
_cxp_dir = os.path.dirname(os.path.abspath(__file__))
_core_dir = os.path.dirname(_cxp_dir)
_platform_core_dir = os.path.join(_core_dir, "platform_core")
if _platform_core_dir not in sys.path:
    sys.path.insert(0, _platform_core_dir)

try:
    import importlib.util
    config_module = None
    if os.path.exists(_platform_core_dir):
        for f in os.listdir(_platform_core_dir):
            if "CisemConfig" in f and f.endswith(".py"):
                spec = importlib.util.spec_from_file_location("CisemConfig", os.path.join(_platform_core_dir, f))
                config_module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(config_module)
                break
except Exception as e:
    print(f"Warning: Failed to import CisemConfig dynamically: {e}")
    config_module = None

ROOT_DIR = config_module.ROOT_DIR if config_module else os.path.dirname(_core_dir)
CORE_DIR = config_module.CORE_DIR if config_module else _core_dir
REGISTRY_PATH = config_module.REGISTRY_PATH if config_module else os.path.join(CORE_DIR, "2026-08-05__CISEM__Universal_Workspace_and_Accountability_Registry__V1.4.yaml")

# Metadata block
METADATA = {
    "owner": "GOOGLE_ANTIGRAVITY_ADAPTER",
    "canonical_location": "C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\cisem_core\\cxp\\2026-08-14__GoogleAntigravity__Cxp__WorkspaceReconciler__V0.7.py",
    "artifact_status": "DRAFT",
    "maturity": "WORKING_DRAFT",
    "version": "0.7",
    "role_type": "CANONICAL_RECONCILER_SCRIPT"
}

class WorkspaceReconciler:
    def __init__(self):
        self.registry = self.load_registry()

    def load_registry(self):
        """Loads and parses the YAML workspace registry."""
        if not os.path.exists(REGISTRY_PATH):
            raise RegistryLoadError(f"Registry file not found at {REGISTRY_PATH}")
        with open(REGISTRY_PATH, 'r') as f:
            docs = list(yaml.safe_load_all(f))
            for doc in docs:
                if doc and "workspace" in doc:
                    return doc
            raise RegistryLoadError("Workspace key not found in registry yaml.")

    def reconcile(self):
        print("=== CISEM Workspace Registry Reconciliation ===")
        findings = []
        exec_failures = []   # R3-REV: second list for checks that could not run
        is_valid = True

        # 1. Verify Control Plane canonical files exist, are unique, and match SHA-256 checksums
        control_plane_subsystems = self.registry.get("control_plane_subsystems", [])
        seen_canonical_paths = {}

        for subsystem in control_plane_subsystems:
            sub_id = subsystem.get("subsystem_id")
            canonical_dir = subsystem.get("canonical_directory")

            if canonical_dir.startswith(".") or not os.path.isabs(canonical_dir):
                canonical_dir = os.path.abspath(os.path.join(ROOT_DIR, canonical_dir))

            artifacts = subsystem.get("canonical_artifacts", {})

            for key, artifact in artifacts.items():
                rel_path = artifact.get("path")
                full_path = os.path.join(canonical_dir, rel_path)

                if not os.path.exists(full_path):
                    findings.append(f"CRITICAL: Artifact {sub_id}:{key} does not exist at canonical location: {full_path}")
                    is_valid = False
                else:
                    # Check uniqueness
                    if full_path in seen_canonical_paths:
                        findings.append(f"CRITICAL: Duplicate ownership claim on path: {full_path} by {seen_canonical_paths[full_path]} and {sub_id}:{key}")
                        is_valid = False
                    seen_canonical_paths[full_path] = f"{sub_id}:{key}"

                    # Verify SHA-256 checksum
                    expected_sha = artifact.get("sha256")
                    if expected_sha:
                        try:
                            hasher = hashlib.sha256()
                            with open(full_path, "rb") as f:
                                hasher.update(f.read())
                            actual_sha = hasher.hexdigest()

                            if actual_sha != expected_sha:
                                findings.append(f"CRITICAL: Checksum mismatch for {sub_id}:{key} at {full_path}. Expected: {expected_sha}, Actual: {actual_sha}")
                                is_valid = False
                            else:
                                print(f"Verified Integrity: {os.path.basename(full_path)} matches SHA-256 checksum.")
                        except Exception as e:
                            # R3-REV: IO/read failure is an EXECUTION FAILURE, not a finding.
                            # The check could not run. Every other check continues regardless.
                            exec_failures.append(f"EXEC FAILURE: could not read/hash {full_path}: {e}")
                    else:
                        print(f"Verified: {os.path.basename(full_path)} exists at canonical location (No checksum defined).")

        # 2. Detect and report if any CXP file is still under obsolete folders
        marketing_dir = os.path.join(ROOT_DIR, "Marketing CoreHub CsAg")
        if os.path.exists(marketing_dir):
            findings.append("CRITICAL: Obsolete Marketing CoreHub directory still exists in workspace root.")
            is_valid = False

        # 3. Resolve project-to-subsystem inheritance link for SUPPLIER_SCRAPER
        projects = self.registry.get("projects", [])
        scraper_project = next((p for p in projects if p.get("project_id") == "SUPPLIER_SCRAPER"), None)
        if not scraper_project:
            findings.append("CRITICAL: Project SUPPLIER_SCRAPER missing in registry.")
            is_valid = False
        else:
            inherits = scraper_project.get("inherits", {}).get("control_plane_subsystems", [])
            if "CISEM_CXP" in inherits:
                print("Verified: SUPPLIER_SCRAPER project-to-subsystem inheritance link resolved.")
            else:
                findings.append("CRITICAL: SUPPLIER_SCRAPER does not inherit CISEM_CXP subsystem.")
                is_valid = False

        # 4. Resolve Google Drive transport reference
        transports = self.registry.get("transports", [])
        m_transport = next((t for t in transports if t.get("transport_id") == "TRANSPORT_MARKETING_DRIVE"), None)
        if not m_transport:
            findings.append("CRITICAL: TRANSPORT_MARKETING_DRIVE is missing in registry.")
            is_valid = False
        else:
            sync_path = m_transport.get("local_sync_path")
            if not os.path.exists(sync_path):
                findings.append(f"WARNING: Sync path for transport does not exist: {sync_path}")
                is_valid = False
            else:
                print(f"Verified: Google Drive transport local sync path resolved: {sync_path}")

        # --- Findings Report (stdout) ---
        print("\n--- Findings Report ---")
        if findings:
            for finding in findings:
                print(f"- {finding}")
        else:
            print("No anomalies detected. Registry conforms to absolute reality.")

        # W1.2: exec_failures also printed to stdout so a stdout-only reader sees
        # that one or more checks did not run. stderr copy is written in __main__.
        if exec_failures:
            print("\n--- Execution Failures ---")
            for ef in exec_failures:
                print(f"- {ef}")

        print(f"Reconciliation Result: {'SUCCESS' if is_valid else 'FAILURE'}\n")

        # R2: findings are a SUCCESSFUL run (checks ran, found disagreements).
        # Execution failures are checked by __main__ to set exit code.
        # No raise here.
        return {
            "result": "SUCCESS" if is_valid else "FAILURE",
            "findings": findings,
            "exec_failures": exec_failures,
        }

    def load_registry_docs(self):
        """Loads all documents in the registry YAML."""
        if not os.path.exists(REGISTRY_PATH):
            raise RegistryLoadError(f"Registry file not found at {REGISTRY_PATH}")
        with open(REGISTRY_PATH, 'r') as f:
            return list(yaml.safe_load_all(f))

    def update_hashes(self):
        """Recalculates and updates SHA-256 hashes in registry YAML."""
        print("=== Updating SHA-256 Checksums in Registry ===")
        docs = self.load_registry_docs()

        # Find the document with the workspace key
        workspace_doc = None
        for doc in docs:
            if doc and "workspace" in doc:
                workspace_doc = doc
                break

        if not workspace_doc:
            raise RegistryLoadError("Workspace document not found in registry.")

        control_plane_subsystems = workspace_doc.get("control_plane_subsystems", [])
        updated_count = 0

        for subsystem in control_plane_subsystems:
            sub_id = subsystem.get("subsystem_id")
            canonical_dir = subsystem.get("canonical_directory")

            if canonical_dir.startswith(".") or not os.path.isabs(canonical_dir):
                canonical_dir = os.path.abspath(os.path.join(ROOT_DIR, canonical_dir))

            artifacts = subsystem.get("canonical_artifacts", {})
            for key, artifact in artifacts.items():
                rel_path = artifact.get("path")
                full_path = os.path.join(canonical_dir, rel_path)

                if os.path.exists(full_path):
                    try:
                        hasher = hashlib.sha256()
                        with open(full_path, "rb") as f:
                            hasher.update(f.read())
                        actual_sha = hasher.hexdigest()

                        old_sha = artifact.get("sha256")
                        if old_sha != actual_sha:
                            artifact["sha256"] = actual_sha
                            print(f"Updated {sub_id}:{key} hash -> {actual_sha}")
                            updated_count += 1
                        else:
                            print(f"Unchanged {sub_id}:{key} hash ({actual_sha})")
                    except Exception as e:
                        print(f"ERROR: Failed to hash {full_path}: {e}")
                else:
                    print(f"WARNING: File does not exist for hash calculation: {full_path}")

        if updated_count > 0:
            with open(REGISTRY_PATH, 'w') as f:
                f.write("# CISEM Universal Workspace and Accountability Registry\n\n")
                yaml.safe_dump_all(docs, f, default_flow_style=False, sort_keys=False)
            print(f"Registry updated successfully. Saved {updated_count} new hashes.")
        else:
            print("All checksums are already up-to-date. No save required.")

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description="CISEM Workspace Registry Reconciler")
    parser.add_argument("--update-hashes", action="store_true", help="Recalculate and update SHA-256 hashes in registry YAML.")
    args = parser.parse_args()

    try:
        reconciler = WorkspaceReconciler()   # R1: constructor inside try; RegistryLoadError caught below
        if args.update_hashes:
            reconciler.update_hashes()
            sys.exit(0)
        else:
            result = reconciler.reconcile()
            exec_failures = result.get("exec_failures", [])
            if exec_failures:
                # W1.2: stderr copy — stdout already printed these under "--- Execution Failures ---"
                for ef in exec_failures:
                    print(ef, file=sys.stderr)
                sys.exit(1)
            # R2: findings without exec failures = successful run; exit 0.
            sys.exit(0)
    except RegistryLoadError as e:   # W1.1: catch RegistryLoadError alone; ReconcilerExecutionError deleted
        print(f"FATAL ERROR: {e}", file=sys.stderr)
        sys.exit(1)
