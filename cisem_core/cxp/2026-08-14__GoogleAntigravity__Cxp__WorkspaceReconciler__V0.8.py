#!/usr/bin/env python3
"""
# CISEM CODE HEADER > MANDATORY
# ratified_plan: CISEM-IP-20260814-RECONCILER-HARDENING
# governor_signature: GOV-YARIV-20260814-RECONCILER-HARDENING-V1.0
# version: V0.8
# reasoning: |
#   V0.8 2026-08-14:
#     S2 - Reviewer gate for --update-hashes.
#          --reviewed-by <token> argument required for actual registry writes.
#          Token read from HASH_REVIEW_TOKEN_FILE at runtime by the user Python process.
#          Agent cannot supply the token: path outside agent file-access by design (T4 property).
#          Without valid token: prints what WOULD change, exits 1, writes nothing.
#          --dry-run: preview hash changes, no token required, exits 0, writes nothing.
#     S3 - Duplicate version detector integrated into reconcile().
#          Scans canonical_directories (from registry) on disk not just registered entries.
#          Groups files by descriptor (filename minus version token). Flags coexisting versions.
#          Catches unregistered orphan versions invisible to registry-only checks.
#   All V0.7 fixes preserved: R1 (constructor in try), R2 (findings/exec exit separation),
#   R3-REV (IO failures to exec_failures), R5+W1.1 (unused exception classes deleted),
#   W1.2 (exec_failures printed to stdout and stderr).
#   Parent principles: AxiomsAndPrinciples V1.29 >AX-10000, >PR-98000.

CISEM Workspace Registry Reconciler
Version: 0.8
Description: Executable proof verifying the Universal Workspace and Accountability Registry.
             Includes: reviewer-gated hash updates (S2) and duplicate version detection (S3).
"""
import os
import re
import sys
import yaml
import hashlib

# S2: Token custody file path.
# DESIGN: This path is intentionally fixed - not configurable via env or workspace config.
# The security property is that this file lives OUTSIDE the agent accessible file tree.
# Making it configurable via an env var the agent controls would collapse the custody boundary.
# Governor creates this file manually. Agent cannot read it. This is the T4 guarantee.
HASH_REVIEW_TOKEN_FILE = r"C:\Users\finky\secure\cisem_hash_token.txt"


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
                spec = importlib.util.spec_from_file_location(
                    "CisemConfig", os.path.join(_platform_core_dir, f)
                )
                config_module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(config_module)
                break
except Exception as e:
    print(f"Warning: Failed to import CisemConfig dynamically: {e}")
    config_module = None

ROOT_DIR = config_module.ROOT_DIR if config_module else os.path.dirname(_core_dir)
CORE_DIR = config_module.CORE_DIR if config_module else _core_dir
REGISTRY_PATH = config_module.REGISTRY_PATH if config_module else os.path.join(
    CORE_DIR, "2026-08-05__CISEM__Universal_Workspace_and_Accountability_Registry__V1.4.yaml"
)

METADATA = {
    "owner": "GOOGLE_ANTIGRAVITY_ADAPTER",
    "canonical_location": r"C:\Users\finky\Desktop\AntiGravity\Cisem CsAg\cisem_core\cxp\2026-08-14__GoogleAntigravity__Cxp__WorkspaceReconciler__V0.8.py",
    "artifact_status": "DRAFT",
    "maturity": "WORKING_DRAFT",
    "version": "0.8",
    "role_type": "CANONICAL_RECONCILER_SCRIPT",
}

# ---------------------------------------------------------------------------
# S3: Duplicate version detector helper (module-level)
# ---------------------------------------------------------------------------
# CISEM filename pattern: [Date]__[From]__[To]__[Description]__[Version].[ext]
# Descriptor = everything BEFORE the last __V<major>.<minor> segment.
# Two files share a descriptor if they differ only in the version token.
# Example conflict: WorkspaceReconciler__V0.7.py vs WorkspaceReconciler__V0.8.py

def _extract_descriptor(filename):
    """
    Strip the version token from a CISEM-named file to produce a comparable descriptor.
    Returns lowercase descriptor string, or None if filename lacks a CISEM version token.

    Examples:
      '2026-08-14__GoogleAntigravity__Cxp__WorkspaceReconciler__V0.7.py'
        -> '2026-08-14__googleantigravity__cxp__workspacereconciler'
      'readme.md' -> None  (no version token)
    """
    base = os.path.splitext(filename)[0]
    m = re.match(r'^(.*?)__V\d+(?:\.\d+)*$', base, re.IGNORECASE)
    if m:
        return m.group(1).lower()
    return None


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

    def load_registry_docs(self):
        """Loads all documents in the registry YAML."""
        if not os.path.exists(REGISTRY_PATH):
            raise RegistryLoadError(f"Registry file not found at {REGISTRY_PATH}")
        with open(REGISTRY_PATH, 'r') as f:
            return list(yaml.safe_load_all(f))

    # -----------------------------------------------------------------------
    # S3: detect_duplicate_versions
    # -----------------------------------------------------------------------
    def detect_duplicate_versions(self):
        """
        S3: Scan canonical directories for files with the same descriptor but different
        version tokens coexisting on disk. Operates on directory contents not just
        registry entries so it catches unregistered orphans the registry check misses.

        Returns a list of finding strings (empty list = no conflicts found).
        """
        findings = []
        scanned_dirs = set()

        # Always include our own cxp directory plus all registry canonical dirs
        dirs_to_scan = [_cxp_dir]
        for subsystem in self.registry.get("control_plane_subsystems", []):
            canonical_dir = subsystem.get("canonical_directory", "")
            if not canonical_dir:
                continue
            if canonical_dir.startswith(".") or not os.path.isabs(canonical_dir):
                canonical_dir = os.path.abspath(os.path.join(ROOT_DIR, canonical_dir))
            dirs_to_scan.append(canonical_dir)

        for scan_dir in dirs_to_scan:
            if scan_dir in scanned_dirs:
                continue
            scanned_dirs.add(scan_dir)
            if not os.path.isdir(scan_dir):
                continue

            version_groups = {}
            try:
                for fname in os.listdir(scan_dir):
                    fpath = os.path.join(scan_dir, fname)
                    if not os.path.isfile(fpath):
                        continue
                    descriptor = _extract_descriptor(fname)
                    if descriptor is None:
                        continue
                    version_groups.setdefault(descriptor, []).append(fname)
            except Exception as e:
                findings.append(
                    f"EXEC FAILURE (S3): could not scan directory {scan_dir}: {e}"
                )
                continue

            for descriptor, files in version_groups.items():
                if len(files) > 1:
                    sorted_files = sorted(files)
                    findings.append(
                        f"DUPLICATE_VERSION_CONFLICT in {scan_dir}:\n"
                        f"    Descriptor : {descriptor}\n"
                        f"    Files      : {', '.join(sorted_files)}\n"
                        f"    Action     : Archive all but the highest active version."
                    )

        return findings

    # -----------------------------------------------------------------------
    # Core reconcile
    # -----------------------------------------------------------------------
    def reconcile(self):
        print("=== CISEM Workspace Registry Reconciliation ===")
        findings = []
        exec_failures = []   # R3-REV: second list for checks that could not run
        is_valid = True

        # 1. Verify Control Plane canonical files exist, are unique, match SHA-256
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
                    findings.append(
                        f"CRITICAL: Artifact {sub_id}:{key} does not exist at canonical location: {full_path}"
                    )
                    is_valid = False
                else:
                    if full_path in seen_canonical_paths:
                        findings.append(
                            f"CRITICAL: Duplicate ownership claim on path: {full_path} "
                            f"by {seen_canonical_paths[full_path]} and {sub_id}:{key}"
                        )
                        is_valid = False
                    seen_canonical_paths[full_path] = f"{sub_id}:{key}"

                    expected_sha = artifact.get("sha256")
                    if expected_sha:
                        try:
                            hasher = hashlib.sha256()
                            with open(full_path, "rb") as f:
                                hasher.update(f.read())
                            actual_sha = hasher.hexdigest()
                            if actual_sha != expected_sha:
                                findings.append(
                                    f"CRITICAL: Checksum mismatch for {sub_id}:{key} at {full_path}. "
                                    f"Expected: {expected_sha}, Actual: {actual_sha}"
                                )
                                is_valid = False
                            else:
                                print(f"Verified Integrity: {os.path.basename(full_path)} matches SHA-256 checksum.")
                        except Exception as e:
                            exec_failures.append(
                                f"EXEC FAILURE: could not read/hash {full_path}: {e}"
                            )
                    else:
                        print(
                            f"Verified: {os.path.basename(full_path)} exists at canonical location "
                            "(No checksum defined)."
                        )

        # 2. Obsolete Marketing CoreHub check
        marketing_dir = os.path.join(ROOT_DIR, "Marketing CoreHub CsAg")
        if os.path.exists(marketing_dir):
            findings.append("CRITICAL: Obsolete Marketing CoreHub directory still exists in workspace root.")
            is_valid = False

        # 3. SUPPLIER_SCRAPER inheritance link
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

        # 4. Google Drive transport reference
        transports = self.registry.get("transports", [])
        m_transport = next(
            (t for t in transports if t.get("transport_id") == "TRANSPORT_MARKETING_DRIVE"), None
        )
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

        # 5. S3: Duplicate version detection
        print("\n--- Duplicate Version Scan (S3) ---")
        dup_findings = self.detect_duplicate_versions()
        if dup_findings:
            for df in dup_findings:
                findings.append(df)
                is_valid = False
            print(f"  {len(dup_findings)} duplicate version conflict(s) detected.")
        else:
            print("  No duplicate version conflicts detected.")

        # --- Findings Report ---
        print("\n--- Findings Report ---")
        if findings:
            for finding in findings:
                print(f"- {finding}")
        else:
            print("No anomalies detected. Registry conforms to absolute reality.")

        if exec_failures:
            print("\n--- Execution Failures ---")
            for ef in exec_failures:
                print(f"- {ef}")

        print(f"Reconciliation Result: {'SUCCESS' if is_valid else 'FAILURE'}\n")

        return {
            "result": "SUCCESS" if is_valid else "FAILURE",
            "findings": findings,
            "exec_failures": exec_failures,
        }

    # -----------------------------------------------------------------------
    # S2: _scan_hash_changes (pure computation, no writes)
    # -----------------------------------------------------------------------
    def _scan_hash_changes(self):
        """
        Compute which registry hashes would change without writing anything.
        Returns (pending_list, docs) where pending_list is a list of tuples:
        (sub_id, key, full_path, old_sha, new_sha, artifact_dict).
        Items where old_sha == new_sha are omitted.
        """
        docs = self.load_registry_docs()
        workspace_doc = next((d for d in docs if d and "workspace" in d), None)
        if not workspace_doc:
            raise RegistryLoadError("Workspace document not found in registry.")

        pending = []
        for subsystem in workspace_doc.get("control_plane_subsystems", []):
            sub_id = subsystem.get("subsystem_id")
            canonical_dir = subsystem.get("canonical_directory", "")
            if canonical_dir.startswith(".") or not os.path.isabs(canonical_dir):
                canonical_dir = os.path.abspath(os.path.join(ROOT_DIR, canonical_dir))

            for key, artifact in subsystem.get("canonical_artifacts", {}).items():
                rel_path = artifact.get("path")
                full_path = os.path.join(canonical_dir, rel_path)
                if not os.path.exists(full_path):
                    print(f"  WARNING: File does not exist, skipping: {full_path}")
                    continue
                try:
                    hasher = hashlib.sha256()
                    with open(full_path, "rb") as f:
                        hasher.update(f.read())
                    new_sha = hasher.hexdigest()
                    old_sha = artifact.get("sha256")
                    if old_sha != new_sha:
                        pending.append((sub_id, key, full_path, old_sha, new_sha, artifact))
                    else:
                        print(f"  Unchanged {sub_id}:{key}  ({new_sha[:16]}...)")
                except Exception as e:
                    print(f"  ERROR: Could not hash {full_path}: {e}")

        return pending, docs

    # -----------------------------------------------------------------------
    # S2: update_hashes - reviewer-gated
    # -----------------------------------------------------------------------
    def update_hashes(self, reviewed_by=None, dry_run=False):
        r"""
        S2: Recalculate and update SHA-256 hashes in registry YAML.

        --dry-run:
            Prints all hashes that would change. No token required. Writes nothing. Exit 0.

        --reviewed-by <token>:
            Token is compared against HASH_REVIEW_TOKEN_FILE at runtime.
            Correct token  -> updates are written to registry.
            Wrong token    -> prints what WOULD change, exits 1, writes nothing.
            Missing token  -> prints what WOULD change, exits 1, writes nothing.

        SECURITY:
            HASH_REVIEW_TOKEN_FILE lives at C:\Users\finky\secure\ which is outside
            the agent file-access scope. The agent cannot read it so it cannot
            supply a correct token. Only the Governor running in their own shell
            can satisfy this check. This is the T4 custody property.
        """
        if dry_run:
            print("=== Hash Dry-Run Preview (no writes) ===")
            pending, _ = self._scan_hash_changes()
            if not pending:
                print("All hashes are already current. Nothing to update.")
            else:
                print(f"\nPending hash updates ({len(pending)}):")
                for sub_id, key, full_path, old_sha, new_sha, _ in pending:
                    old_display = old_sha[:16] + "..." if old_sha else "<none>"
                    print(
                        f"  {sub_id}:{key}\n"
                        f"    File : {os.path.basename(full_path)}\n"
                        f"    Old  : {old_display}\n"
                        f"    New  : {new_sha[:16]}...\n"
                    )
            print("Dry-run complete. Registry was NOT modified.")
            return

        # --- Live mode: token required ---
        print("=== Updating SHA-256 Checksums in Registry ===")

        if not reviewed_by:
            print(
                "\nERROR: --update-hashes requires --reviewed-by <token>.\n"
                "  Without a valid review token the registry will not be written.\n"
                "  Use --dry-run to preview what would change without authentication.\n"
                "\n  Token file: " + HASH_REVIEW_TOKEN_FILE + "\n"
                "  The Governor must create this file before the first authenticated run.\n"
                "  Creation commands (PowerShell):\n"
                "    New-Item -Force -Path 'C:\\Users\\finky\\secure' -ItemType Directory | Out-Null\n"
                "    '<your-token>' | Out-File -FilePath 'C:\\Users\\finky\\secure\\cisem_hash_token.txt' -Encoding utf8 -NoNewline"
            )
            print("\n--- Preview of what WOULD have changed ---")
            pending, _ = self._scan_hash_changes()
            if not pending:
                print("  All hashes already current.")
            else:
                for sub_id, key, full_path, old_sha, new_sha, _ in pending:
                    old_display = old_sha[:16] + "..." if old_sha else "<none>"
                    print(f"  WOULD UPDATE {sub_id}:{key} -> {new_sha[:16]}...  (was: {old_display})")
            sys.exit(1)

        # Read token from custody file
        if not os.path.exists(HASH_REVIEW_TOKEN_FILE):
            print(
                f"\nERROR: Review token file not found at:\n"
                f"  {HASH_REVIEW_TOKEN_FILE}\n\n"
                "  The Governor must create this file. Creation commands (PowerShell):\n"
                "    New-Item -Force -Path 'C:\\Users\\finky\\secure' -ItemType Directory | Out-Null\n"
                "    '<your-token>' | Out-File -FilePath 'C:\\Users\\finky\\secure\\cisem_hash_token.txt' -Encoding utf8 -NoNewline"
            )
            pending, _ = self._scan_hash_changes()
            if pending:
                print(f"\n  ({len(pending)} hash(es) would have been updated - none written.)")
            sys.exit(1)

        try:
            with open(HASH_REVIEW_TOKEN_FILE, 'r', encoding='utf-8') as tf:
                expected_token = tf.read().strip()
        except Exception as e:
            print(f"\nERROR: Cannot read review token file: {e}")
            sys.exit(1)

        if reviewed_by.strip() != expected_token:
            print(
                "\nERROR: Review token does not match. Registry will NOT be updated.\n"
                "  Provide the correct token value stored in the Governor custody file."
            )
            print("\n--- Preview of what WOULD have changed ---")
            pending, _ = self._scan_hash_changes()
            if not pending:
                print("  All hashes already current.")
            else:
                for sub_id, key, full_path, old_sha, new_sha, _ in pending:
                    old_display = old_sha[:16] + "..." if old_sha else "<none>"
                    print(f"  WOULD UPDATE {sub_id}:{key} -> {new_sha[:16]}...  (was: {old_display})")
            sys.exit(1)

        # Token valid - proceed with write
        print("  Review token validated. Proceeding with hash updates.")
        pending, docs = self._scan_hash_changes()

        if not pending:
            print("All checksums are already up-to-date. No save required.")
            return

        updated_count = 0
        for sub_id, key, full_path, old_sha, new_sha, artifact in pending:
            artifact["sha256"] = new_sha
            print(f"  Updated {sub_id}:{key} -> {new_sha}")
            updated_count += 1

        with open(REGISTRY_PATH, 'w') as f:
            f.write("# CISEM Universal Workspace and Accountability Registry\n\n")
            yaml.safe_dump_all(docs, f, default_flow_style=False, sort_keys=False)

        print(f"\nRegistry saved. {updated_count} hash(es) updated.")


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(
        description="CISEM Workspace Registry Reconciler V0.8",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Examples:\n"
            "  Reconcile (read-only):\n"
            "    python %(prog)s\n\n"
            "  Preview pending hash changes (no writes, no token):\n"
            "    python %(prog)s --dry-run\n\n"
            "  Update hashes with Governor review token:\n"
            "    python %(prog)s --update-hashes --reviewed-by <token>\n"
        )
    )
    parser.add_argument(
        "--update-hashes",
        action="store_true",
        help="Recalculate and update SHA-256 hashes in registry YAML. Requires --reviewed-by."
    )
    parser.add_argument(
        "--reviewed-by",
        metavar="TOKEN",
        default=None,
        help=(
            "Governor review token authorising a hash update. "
            "Must match contents of " + HASH_REVIEW_TOKEN_FILE + "."
        )
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview hash changes without modifying the registry. No token required."
    )
    args = parser.parse_args()

    if args.reviewed_by and not args.update_hashes and not args.dry_run:
        parser.error("--reviewed-by only makes sense with --update-hashes.")
    if args.dry_run and args.update_hashes:
        parser.error("--dry-run and --update-hashes are mutually exclusive.")

    try:
        reconciler = WorkspaceReconciler()   # R1: constructor inside try

        if args.dry_run:
            reconciler.update_hashes(dry_run=True)
            sys.exit(0)
        elif args.update_hashes:
            reconciler.update_hashes(reviewed_by=args.reviewed_by)
            sys.exit(0)
        else:
            result = reconciler.reconcile()
            exec_failures = result.get("exec_failures", [])
            if exec_failures:
                for ef in exec_failures:
                    print(ef, file=sys.stderr)
                sys.exit(1)
            sys.exit(0)

    except RegistryLoadError as e:   # W1.1
        print(f"FATAL ERROR: {e}", file=sys.stderr)
        sys.exit(1)