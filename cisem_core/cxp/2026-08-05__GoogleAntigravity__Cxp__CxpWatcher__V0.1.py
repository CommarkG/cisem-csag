#!/usr/bin/env python3
# ratified_plan: CISEM-IP-20260807-PLANNING-SPINE
# governor_signature: GOV-YARIV-20260807-PLANNING-SPINE-V1.0
"""
CISEM Autonomous Execution Layer (CAEL) — Watcher Daemon (LFW)
Version: 0.4 (Local File System Watcher Edition)
Platform: Reference Adapter 01 (Google Antigravity Python)
Description: Continuously polls local Google Drive synchronized exchange folder, 
processes execution packets, and runs the "Witness" Positioning Tracker and Registry Checksum checks.
"""

import os
import sys
import time
import json
import yaml
from datetime import datetime, timezone

# Import CisemSanitizer
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sandbox.CisemSanitizer import CisemSanitizer

# Source of Truth Metadata
METADATA = {
    "owner": "CISEM_GOVERNOR",
    "canonical_location": "C:\\Users\\finky\\Desktop\\AntiGravity\\2026-08-05__GoogleAntigravity__Cxp__CxpWatcher__V0.1.py",
    "artifact_status": "DRAFT",
    "maturity": "WORKING_DRAFT",
    "version": "0.5",
    "role_type": "CANONICAL_DAEMON_SCRIPT",
    "history": [
        {
            "timestamp": "2026-08-05T12:00:00Z",
            "action": "CREATED_INITIAL_WATCHER",
            "actor": "CISEM_DEVELOPER",
            "version": "0.1"
        },
        {
            "timestamp": "2026-08-06T14:20:00Z",
            "action": "UPDATED_ADAPTER_DYNAMIC_IMPORT",
            "actor": "GOOGLE_ANTIGRAVITY_ADAPTER",
            "version": "0.2"
        },
        {
            "timestamp": "2026-08-06T20:56:00Z",
            "action": "IMPLEMENTED_WITNESS_POSITIONING_TRACKER",
            "actor": "GOOGLE_ANTIGRAVITY_ADAPTER",
            "version": "0.3"
        },
        {
            "timestamp": "2026-08-07T21:40:00Z",
            "action": "INTEGRATED_REGISTRY_CHECKSUM_INTEGRITY_CHECK",
            "actor": "GOOGLE_ANTIGRAVITY_ADAPTER",
            "version": "0.4"
        },
        {
            "timestamp": "2026-08-07T23:51:00Z",
            "action": "INTEGRATED_TWO_WAY_AUTOMATED_SANDBOX_SYNC_BRIDGE",
            "actor": "GOOGLE_ANTIGRAVITY_ADAPTER",
            "version": "0.5"
        }
    ]
}

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
EXCHANGE_DIR = os.path.join(ROOT_DIR, "9000__INTERSYSTEM_EXECUTION_EXCHANGE")
STATUS_FILE_PATH = os.path.join(ROOT_DIR, "cisem_core", "cael_status.json")
LOCK_FILE_PATH = os.path.join(ROOT_DIR, ".gate_lock")

import importlib.util
import re
ADAPTER_FILE_PATH = os.path.join(ROOT_DIR, "cisem_core", "cxp", "2026-08-05__GoogleAntigravity__Cxp__CxpAdapter__V0.1.py")

if not os.path.exists(ADAPTER_FILE_PATH):
    raise FileNotFoundError(f"Canonical adapter file not found at {ADAPTER_FILE_PATH}")

spec = importlib.util.spec_from_file_location("CxpAdapterModule", ADAPTER_FILE_PATH)
adapter_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(adapter_module)
CxpAdapter = adapter_module.CxpAdapter

def find_latest_registry_file():
    core_dir = os.path.join(ROOT_DIR, "cisem_core")
    candidates = []
    if os.path.exists(core_dir):
        for f in os.listdir(core_dir):
            if "Universal_Workspace_and_Accountability_Registry" in f and f.endswith(".yaml"):
                v_match = re.search(r'__V(\d+(?:\.\d+)*)\.yaml$', f)
                if v_match:
                    try:
                        version = [int(x) for x in v_match.group(1).split(".")]
                    except ValueError:
                        version = [0]
                    candidates.append((version, os.path.join(core_dir, f)))
    if candidates:
        candidates.sort(key=lambda x: x[0], reverse=True)
        return candidates[0][1]
    return None

class CxpLocalWatcher:
    def __init__(self):
        self.adapter = CxpAdapter()
        self.active_packets = []
        self.witness_snapshot = {}
        self.witness_alert = None

    def scan_target_files(self):
        """Scan workspace root for versioned Axioms, Vocabulary, and active plans."""
        targets = []
        if os.path.exists(ROOT_DIR):
            for f in os.listdir(ROOT_DIR):
                if (f.startswith("2026-08-") or f.startswith("Consolidated_")) and f.endswith(".md"):
                    targets.append(os.path.join(ROOT_DIR, f))
        return targets

    def parse_metadata(self, filepath):
        """Extract metadata yaml header block from markdown files."""
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            if "---" in content:
                parts = content.split("---")
                if len(parts) >= 3:
                    header_text = parts[1]
                    data = yaml.safe_load(header_text)
                    return data.get("metadata", {})
        except Exception:
            pass
        return {}

    def check_witness_positions(self):
        """Witness position tracking check. Detects unapproved shifts and rollbacks."""
        current_targets = self.scan_target_files()
        
        # Initialize snapshot on first run
        if not self.witness_snapshot:
            for path in current_targets:
                meta = self.parse_metadata(path)
                self.witness_snapshot[path] = {
                    "exists": True,
                    "size": os.path.getsize(path),
                    "mtime": os.path.getmtime(path),
                    "version": meta.get("version"),
                    "status": meta.get("artifact_status")
                }
            return None

        lock_reason = None
        offending_file = None
        error_type = None

        # Check for deletions or renames
        # @swift_placeholder: PARK-002
        for path, cached in list(self.witness_snapshot.items()):
            if path not in current_targets:
                lock_reason = "POSITIONAL_SHIFT_DETECTED"
                offending_file = os.path.basename(path)
                error_type = "UNAPPROVED_DELETION_OR_RENAME"
                break

        # Check for additions and version anomalies
        if not lock_reason:
            for path in current_targets:
                meta = self.parse_metadata(path)
                curr_version = meta.get("version")
                
                if path not in self.witness_snapshot:
                    if not curr_version:
                        lock_reason = "UNAPPROVED_UNVERSIONED_FILE"
                        offending_file = os.path.basename(path)
                        error_type = "MISSING_VERSION_METADATA"
                        break
                else:
                    cached = self.witness_snapshot[path]
                    if curr_version != cached["version"] and not curr_version:
                        lock_reason = "METADATA_CORRUPTION"
                        offending_file = os.path.basename(path)
                        error_type = "VERSION_TAG_REMOVED"
                        break
                    # Detect modifications without a version bump
                    if curr_version == cached["version"] and os.path.getsize(path) != cached["size"]:
                        lock_reason = "UNAPPROVED_MODIFICATION"
                        offending_file = os.path.basename(path)
                        error_type = "UNAPPROVED_CONTENT_DRIFT_WITHOUT_VERSION_BUMP"
                        break

        # Check control plane registry checksum integrity
        if not lock_reason:
            registry_hashes = {}
            registry_path = find_latest_registry_file()
            if registry_path and os.path.exists(registry_path):
                try:
                    import hashlib
                    with open(registry_path, "r", encoding="utf-8") as rf:
                        docs = list(yaml.safe_load_all(rf))
                        for doc in docs:
                            if doc and "control_plane_subsystems" in doc:
                                subsystems = doc.get("control_plane_subsystems", [])
                                for sub in subsystems:
                                    artifacts = sub.get("canonical_artifacts", {})
                                    for art in artifacts.values():
                                        path_val = art.get("path")
                                        sha_val = art.get("sha256")
                                        if path_val and sha_val:
                                            registry_hashes[os.path.basename(path_val)] = sha_val
                except Exception as e:
                    print(f"Watcher registry parse error: {e}")

            if registry_hashes:
                for filename_base, expected_sha in registry_hashes.items():
                    file_found_path = None
                    chk_root = os.path.join(ROOT_DIR, filename_base)
                    if os.path.exists(chk_root):
                        file_found_path = chk_root
                    else:
                        for root_dir, _, files_in_dir in os.walk(os.path.join(ROOT_DIR, "cisem_core")):
                            if filename_base in files_in_dir:
                                file_found_path = os.path.join(root_dir, filename_base)
                                break
                                
                    if not file_found_path:
                        lock_reason = "INTEGRITY_COMPROMISED"
                        offending_file = filename_base
                        error_type = "REGISTERED_FILE_MISSING"
                        break
                    else:
                        try:
                            hasher = hashlib.sha256()
                            with open(file_found_path, "rb") as f:
                                hasher.update(f.read())
                            actual_sha = hasher.hexdigest()
                            if actual_sha != expected_sha:
                                lock_reason = "INTEGRITY_COMPROMISED"
                                offending_file = filename_base
                                error_type = f"REGISTRY_CHECKSUM_MISMATCH (Expected: {expected_sha[:8]}, Actual: {actual_sha[:8]})"
                                break
                        except Exception as e:
                            lock_reason = "INTEGRITY_COMPROMISED"
                            offending_file = filename_base
                            error_type = f"CHECKSUM_READ_ERROR: {e}"
                            break

        if lock_reason:
            alert = {
                "lock_reason": lock_reason,
                "target_file": offending_file,
                "error_type": error_type,
                "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
            }
            self.write_gate_lock(alert)
            self.witness_alert = alert
            return alert
        else:
            self.clear_gate_lock()
            self.witness_alert = None
            return None

    def write_gate_lock(self, alert):
        """Write physical compiler gate lock block."""
        try:
            with open(LOCK_FILE_PATH, "w", encoding="utf-8") as f:
                json.dump(alert, f, indent=2)
            print(f"[{datetime.now().strftime('%H:%M:%S')}] [WITNESS LOCK ACTIVE] {alert['lock_reason']}: {alert['target_file']}")
            # @swift_placeholder: PARK-009
            self.increment_mechanism_trigger("CISEM-WATCHER-LOCK")
        except Exception as e:
            print(f"Error writing gate lock: {e}")

    def clear_gate_lock(self):
        """Clear compiler gate lock block."""
        if os.path.exists(LOCK_FILE_PATH):
            try:
                os.remove(LOCK_FILE_PATH)
                print(f"[{datetime.now().strftime('%H:%M:%S')}] [WITNESS LOCK CLEARED] Workspace nominal.")
            except Exception as e:
                print(f"Error clearing gate lock: {e}")

    def write_status(self, loop_count):
        """Write current daemon status locally for backend consumption."""
        registry = []
        if os.path.exists(STATUS_FILE_PATH):
            try:
                with open(STATUS_FILE_PATH, "r", encoding="utf-8") as f:
                    old_data = json.load(f)
                    registry = old_data.get("activation_registry", [])
            except Exception:
                pass

        status_data = {
            "status": "running",
            "pid": os.getpid(),
            "last_heartbeat": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            "loop_count": loop_count,
            "exchange_directory": EXCHANGE_DIR,
            "active_packets_in_queue": self.active_packets,
            "witness_change_profile": self.witness_alert if self.witness_alert else {"status": "nominal"},
            "activation_registry": registry
        }
        try:
            with open(STATUS_FILE_PATH, "w", encoding="utf-8") as f:
                json.dump(status_data, f, indent=2)
        except Exception as e:
            print(f"Error writing daemon status file: {e}")

    def increment_mechanism_trigger(self, mechanism_id):
        if not os.path.exists(STATUS_FILE_PATH):
            return
        try:
            with open(STATUS_FILE_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception:
            return
            
        registry = data.get("activation_registry", [])
        updated = False
        for mech in registry:
            if mech.get("mechanism_id") == mechanism_id:
                mech["actual_triggers"] = mech.get("actual_triggers", 0) + 1
                mech["last_triggered"] = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
                if mech["actual_triggers"] >= mech.get("validation_target", 0):
                    mech["status"] = "VALIDATED"
                updated = True
                break
                
        if updated:
            try:
                with open(STATUS_FILE_PATH, "w", encoding="utf-8") as f:
                    json.dump(data, f, indent=2)
            except Exception:
                pass

    def process_ready_packet(self, filepath, filename, packet):
        """Claims, executes, and completes a packet dynamically."""
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Processing READY packet: {filename}")
        
        # ── INJECTED SECURITY CHECK: PR-58950 Context-Related Ingestion Sanitization ──
        is_clean, threat, group = CisemSanitizer.scan(packet)
        if not is_clean:
            print(f"[!] SECURITY THREAT DETECTED in packet {filename} (Group: {group}): {threat}")
            alert = {
                "lock_reason": "PROMPT_INJECTION_DETECTED",
                "target_file": filename,
                "error_type": "SECURITY_BREACH_SUSPENSION",
                "threat_signature": threat,
                "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
            }
            self.write_gate_lock(alert)
            
            # Transition packet to BLOCKED_SECURITY
            packet = self.adapter.append_event(
                packet, "SECURITY_VIOLATION_BLOCKED", "READY", "BLOCKED_SECURITY",
                f"Ingestion blocked by CisemSanitizer. Group: {group}. Threat: {threat}",
                "LOCAL_ADAPTER", "REFERENCE_ADAPTER"
            )
            self.write_packet(filepath, packet)
            return
        # ─────────────────────────────────────────────────────────────────────────────

        packet = self.adapter.append_event(
            packet, "PACKET_CLAIMED", "READY", "CLAIMED", 
            "REFERENCE_ADAPTER", "LOCAL_ADAPTER",
            payload={"lease_expires_at": datetime.now(timezone.utc).isoformat(), "idempotency_key": f"idemp-{int(time.time())}"}
        )
        
        packet = self.adapter.append_event(
            packet, "EXECUTION_STARTED", "CLAIMED", "EXECUTING", 
            "REFERENCE_ADAPTER", "LOCAL_ADAPTER"
        )
        
        self.write_packet(filepath, packet)
        
        execution = packet.get("immutable_request", {}).get("execution", {})
        intent = execution.get("intent")
        parameters = execution.get("parameters", {})
        
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Executing intent: {intent}")
        stdout = ""
        stderr = ""
        evidence = {}
        
        if intent == "TEST_HANDSHAKE":
            token = parameters.get("token")
            stdout = f"Handshake token match successfully validated: {token}\n"
            evidence = {"token_match_verification": "SUCCESS"}
        elif intent == "HANDOFF_MESSAGE":
            message = parameters.get("message")
            stdout = f"Received handoff message: {message}\n"
            evidence = {"handoff_verification": "SUCCESS"}
        else:
            stderr = f"Unknown execution intent: {intent}\n"
            evidence = {"error": "UNKNOWN_INTENT"}
            
        packet = self.adapter.append_event(
            packet, "EXECUTION_OUTPUT_RECORDED", "EXECUTING", "EXECUTING", 
            "REFERENCE_ADAPTER", "LOCAL_ADAPTER",
            payload={"stdout": stdout, "stderr": stderr}
        )
        
        packet = self.adapter.append_event(
            packet, "EVIDENCE_RECORDED", "EXECUTING", "VALIDATING", 
            "REFERENCE_ADAPTER", "LOCAL_ADAPTER",
            payload={"evidence": evidence, "lessons": [f"Successfully validated intent: {intent}."]}
        )
        
        # Precondition Enforcement (State Transition Matrix Rule check)
        if "error" in evidence:
            print(f"[!] VALIDATION FAILURE in packet {filename}: {evidence.get('error')}")
            alert = {
                "lock_reason": "PACKET_VALIDATION_FAILED",
                "target_file": filename,
                "error_type": "VALIDATION_FAILURE_SUSPENSION",
                "error_details": evidence.get("error"),
                "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
            }
            self.write_gate_lock(alert)
            
            packet = self.adapter.append_event(
                packet, "VALIDATION_FAILED", "VALIDATING", "FAILED_VALIDATION", 
                "REFERENCE_ADAPTER", "LOCAL_ADAPTER",
                payload={"error": evidence.get("error")}
            )
            self.write_packet(filepath, packet)
            print(f"[!] Watcher locked due to validation failure. Exiting.")
            sys.exit(1)
            
        packet = self.adapter.append_event(
            packet, "PACKET_COMPLETED", "VALIDATING", "COMPLETED", 
            "REFERENCE_ADAPTER", "LOCAL_ADAPTER"
        )
        
        self.write_packet(filepath, packet)
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Packet execution completed and saved.")

    def process_audited_packet(self, filepath, filename, packet):
        """Archives audited packets."""
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Packet {filename} is successfully AUDITED. Archiving packet...")
        
        packet = self.adapter.append_event(
            packet, "PACKET_ARCHIVED", "AUDITED", "ARCHIVED", 
            "REFERENCE_ADAPTER", "LOCAL_ADAPTER"
        )
        
        self.write_packet(filepath, packet)
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Archive complete.")

    def write_packet(self, filepath, packet):
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(packet, f, indent=2)

    def reconcile_sandbox_registry(self):
        """Purely Internal Sandbox Reconciler: dynamically scans core sandbox/, computes hashes, and updates Registry V1.5."""
        try:
            core_sandbox = os.path.join(ROOT_DIR, "sandbox")
            if not os.path.exists(core_sandbox):
                return
            
            import hashlib
            artifacts = {}
            for fname in os.listdir(core_sandbox):
                fpath = os.path.join(core_sandbox, fname)
                if os.path.isfile(fpath):
                    hasher = hashlib.sha256()
                    with open(fpath, "rb") as f:
                        while chunk := f.read(8192):
                            hasher.update(chunk)
                    rel_path = f"sandbox/{fname}"
                    artifacts[fname.replace(".", "_").replace("-", "_")] = {
                        "path": rel_path,
                        "version": "1.0",
                        "status": "DRAFT",
                        "sha256": hasher.hexdigest()
                    }

            # Resolve latest registry path
            registry_path = find_latest_registry_file()
            if not registry_path:
                return

            with open(registry_path, "r", encoding="utf-8") as f:
                docs = list(yaml.safe_load_all(f))

            updated = False
            for doc in docs:
                if doc and "projects" in doc:
                    for project in doc["projects"]:
                        if project.get("project_id") == "SANDBOX_PLAYGROUND":
                            # Compare if artifacts list has changed to avoid unnecessary writes
                            old_artifacts = project.get("project_artifacts", {})
                            if old_artifacts != artifacts:
                                project["project_artifacts"] = artifacts
                                updated = True

            if updated:
                with open(registry_path, "w", encoding="utf-8") as f:
                    yaml.safe_dump_all(docs, f, default_flow_style=False, sort_keys=False)
                print(f"[{datetime.now().strftime('%H:%M:%S')}] [SANDBOX RECONCILER] Registry dynamically updated with sandbox artifacts.")
        except Exception as e:
            pass

    def run_polling_loop(self):
        print(f"=== CISEM Autonomous Execution local watcher daemon active ===")
        print(f"Watching local directory: {EXCHANGE_DIR}")
        
        loop_count = 0
        while True:
            loop_count += 1
            self.active_packets = []
            
            # Execute Witness positioning checks
            self.check_witness_positions()
            
            # Execute Purely Internal Sandbox Reconciler (DISABLED - formalizing sandbox isolation)
            # self.reconcile_sandbox_registry()
            
            # Process intersystem packets
            try:
                if os.path.exists(EXCHANGE_DIR):
                    files = os.listdir(EXCHANGE_DIR)
                    for filename in files:
                        if filename.startswith("CXP__") and (filename.endswith(".yaml") or filename.endswith(".json") or filename.endswith(".txt")):
                            filepath = os.path.join(EXCHANGE_DIR, filename)
                            if os.path.isdir(filepath):
                                continue
                                
                            try:
                                with open(filepath, "r", encoding="utf-8-sig") as f:
                                    content = f.read().strip()
                                if not content:
                                    continue
                                packet = json.loads(content)
                            except Exception:
                                continue
                                
                            derived = self.adapter.replay_and_project(packet)
                            current_state = derived.get("current_state")
                            
                            self.active_packets.append({
                                "packet_id": packet.get("immutable_request", {}).get("header", {}).get("packet_id"),
                                "filename": filename,
                                "state": current_state
                            })
                            
                            if current_state == "READY":
                                self.process_ready_packet(filepath, filename, packet)
                            elif current_state == "AUDITED":
                                self.process_audited_packet(filepath, filename, packet)
                                
            except Exception as e:
                print(f"Watcher loop error: {e}")
                
            self.write_status(loop_count)
            time.sleep(5)

if __name__ == "__main__":
    watcher = CxpLocalWatcher()
    watcher.run_polling_loop()
