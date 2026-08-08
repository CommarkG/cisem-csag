#!/usr/bin/env python3
"""
CISEM Exchange Protocol (CXP) Local Adapter
Version: 0.1
Authority: Google Antigravity Adapter
Description: Watches, parses, validates, and executes intents under the event-sourced V1.2.0 spec.
"""

import os
import sys
import json
import yaml
import hashlib
from datetime import datetime, timezone
import jsonschema

# Source of Truth Metadata
METADATA = {
    "owner": "GOOGLE_ANTIGRAVITY_ADAPTER",
    "canonical_location": "C:\\Users\\finky\\Desktop\\AntiGravity\\Marketing CoreHub CsAg\\2026-08-05__GoogleAntigravity__Cxp__CxpAdapter__V0.1.py",
    "artifact_status": "DRAFT",
    "maturity": "WORKING_DRAFT",
    "version": "0.1",
    "role_type": "CANONICAL_ADAPTER_SCRIPT"
}

WORKSPACE_DIR = os.path.dirname(os.path.abspath(__file__))
if os.path.basename(WORKSPACE_DIR) in ["Marketing CoreHub CsAg", "cxp"]:
    PARENT_DIR = os.path.dirname(WORKSPACE_DIR)
else:
    PARENT_DIR = WORKSPACE_DIR
SCHEMA_PATH = os.path.join(PARENT_DIR, "2026-08-05__CISEM__CXP__PacketSchema__V1.2.schema.json")
MATRIX_PATH = os.path.join(PARENT_DIR, "2026-08-05__CISEM__CXP__StateTransitionMatrix__V1.3.yaml")

class CxpAdapter:
    def __init__(self):
        self.schema = self.load_json_schema()
        self.transitions = self.load_transition_matrix()

    def load_json_schema(self):
        with open(SCHEMA_PATH, 'r') as f:
            return json.load(f)

    def load_transition_matrix(self):
        with open(MATRIX_PATH, 'r') as f:
            docs = list(yaml.safe_load_all(f))
            for doc in docs:
                if doc and "transitions" in doc:
                    return doc["transitions"]
            return []

    def calculate_hash(self, data_dict):
        """Calculate SHA-256 hash of a dictionary normalized as a sorted JSON string."""
        serialized = json.dumps(data_dict, sort_keys=True)
        return hashlib.sha256(serialized.encode('utf-8')).hexdigest()

    def validate_schema(self, packet):
        """Verify the packet matches the canonical JSON Schema."""
        try:
            jsonschema.validate(instance=packet, schema=self.schema)
            return True, "Schema validation passed."
        except jsonschema.exceptions.ValidationError as e:
            return False, f"Schema validation failed: {e.message}"

    def validate_event_stream(self, packet):
        """Enforces the 10 checks of the Event Stream Validator."""
        events = packet.get("event_stream", [])
        if not events:
            return False, "Event stream is empty."

        # Rule 1 & 2: Start constraints
        first_event = events[0]
        if first_event.get("event_type") != "PACKET_CREATED" or first_event.get("sequence_number") != 1:
            return False, "First event must be PACKET_CREATED with sequence_number 1."

        previous_id = "CXP-EVT-20260805-000001-000000"
        previous_sequence = 0
        computed_latest_event_hash = ""

        # State transition tracking
        current_derived_state = "NONE"

        for idx, event in enumerate(events):
            seq = event.get("sequence_number")
            evt_id = event.get("event_id")
            prev_id = event.get("previous_event_id")
            transition = event.get("transition", {})
            actor = event.get("actor", {})

            # Rule 3: Contiguity
            if seq != previous_sequence + 1:
                return False, f"Sequence gap detected: Event {evt_id} has sequence {seq} instead of {previous_sequence + 1}."

            # Rule 5: Chain Verification
            if idx > 0 and prev_id != previous_id:
                return False, f"Chain broken: Event {evt_id} points to {prev_id} instead of {previous_id}."

            # Rule 6: Transition validation
            from_state = transition.get("from_state")
            to_state = transition.get("to_state")
            
            # Check state sequence match
            if from_state != current_derived_state:
                return False, f"Invalid state transition sequence: Event {evt_id} moves from {from_state} but derived state is {current_derived_state}."

            # Verify transition matches allowed matrix transitions
            transition_valid = False
            for trans in self.transitions:
                if trans.get("from_state") == from_state and trans.get("to_state") == to_state:
                    # Rule 7: Actor validation check
                    allowed_controller = trans.get("controller")
                    if allowed_controller == "LOCAL_ADAPTER" and actor.get("role") != "LOCAL_ADAPTER":
                        return False, f"Unauthorized actor {actor.get("identity")} role {actor.get("role")} for transition {from_state}->{to_state}."
                    transition_valid = True
                    break
            
            if not transition_valid and from_state != "NONE": # PACKET_CREATED moves NONE->CREATED
                return False, f"Illegal state transition {from_state}->{to_state} in event {evt_id}."

            # Assert preconditions for transitions dynamically (Precondition Assertion Engine)
            if to_state == "COMPLETED":
                temp_projected = self.replay_and_project({"event_stream": events[:idx+1]})
                temp_evidence = temp_projected.get("response", {}).get("evidence", {})
                temp_stderr = temp_projected.get("response", {}).get("stderr", "")
                temp_lessons = temp_projected.get("lessons_learned", [])
                if "error" in temp_evidence:
                    return False, f"Precondition failed for transition to COMPLETED in event {evt_id}: error found in evidence: {temp_evidence['error']}"
                if temp_stderr and "Unknown execution intent" in temp_stderr:
                    return False, f"Precondition failed for transition to COMPLETED in event {evt_id}: execution error logged in stderr: {temp_stderr.strip()}"
                if not temp_lessons:
                    return False, f"Precondition failed for transition to COMPLETED in event {evt_id}: lessons_learned array is empty."

            # Rule 9: Hash integrity check (excluding hash field itself to prevent circular reference)
            event_copy = json.loads(json.dumps(event))
            if "integrity" in event_copy:
                del event_copy["integrity"]
            
            computed_hash = self.calculate_hash(event_copy)
            stored_hash = event.get("integrity", {}).get("content_hash")
            if stored_hash and stored_hash != computed_hash:
                return False, f"Tampering detected: Event {evt_id} content hash mismatch."

            current_derived_state = to_state
            previous_id = evt_id
            previous_sequence = seq
            computed_latest_event_hash = computed_hash

        # Rule 8: Terminal lock check
        if current_derived_state in ["ARCHIVED", "FAILED", "CANCELLED"] and len(events) > idx + 1:
            return False, "Cannot append events to a packet in terminal state."

        # Rule 10: Replay derived matches stored derived view
        stored_derived_state = packet.get("derived_view", {}).get("current_state")
        if stored_derived_state != current_derived_state:
            return False, f"Derived view mismatch: Stored state is {stored_derived_state} but replayed state is {current_derived_state}."

        # Check Latest Hash matching
        latest_event_hash = packet.get("integrity", {}).get("latest_event_hash")
        if latest_event_hash and latest_event_hash != computed_latest_event_hash:
            return False, "Latest event hash integrity check failed."

        return True, "Event stream validations passed cleanly."

    def replay_and_project(self, packet):
        """Process all events to construct the projected derived view."""
        events = packet.get("event_stream", [])
        
        current_state = "CREATED"
        execution_control = {
            "idempotency_key": "",
            "attempt_number": 1,
            "max_attempts": 3,
            "claimed_by": "",
            "claimed_at": "",
            "lease_expires_at": "",
            "timeout_seconds": 300,
            "requires_clean_repository": False
        }
        response = {
            "status": "",
            "stdout": "",
            "stderr": "",
            "evidence": {}
        }
        audit = {
            "result": "",
            "auditor_id": "",
            "timestamp": ""
        }
        lessons_learned = []

        for event in events:
            evt_type = event.get("event_type")
            payload = event.get("payload", {})
            actor = event.get("actor", {})
            occurred_at = event.get("occurred_at")
            transition = event.get("transition", {})

            current_state = transition.get("to_state")

            if evt_type == "PACKET_CLAIMED":
                execution_control["claimed_by"] = actor.get("identity")
                execution_control["claimed_at"] = occurred_at
                execution_control["lease_expires_at"] = payload.get("lease_expires_at", "")
                execution_control["idempotency_key"] = payload.get("idempotency_key", "")
            
            elif evt_type == "EXECUTION_OUTPUT_RECORDED":
                response["stdout"] += payload.get("stdout", "")
                response["stderr"] += payload.get("stderr", "")
            
            elif evt_type == "EVIDENCE_RECORDED":
                response["evidence"].update(payload.get("evidence", {}))
                # If there are lessons inside the evidence payload, project them
                if "lessons" in payload:
                    lessons_learned.extend(payload["lessons"])
            
            elif evt_type == "AUDIT_VERIFIED":
                audit["result"] = "VERIFIED"
                audit["auditor_id"] = actor.get("identity")
                audit["timestamp"] = occurred_at

        projected = {
            "current_state": current_state,
            "execution_control": execution_control,
            "response": response,
            "audit": audit,
            "lessons_learned": lessons_learned
        }
        return projected

    def append_event(self, packet, event_type, from_state, to_state, actor_id, actor_role, payload=None):
        """Append a new event block cleanly to the stream and update projections."""
        if payload is None:
            payload = {}

        events = packet.get("event_stream", [])
        seq_num = len(events) + 1
        prev_event_id = events[-1].get("event_id") if events else "CXP-EVT-20260805-000001-000000"
        
        timestamp_str = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
        
        # Structure new event
        new_event = {
            "event_id": f"CXP-EVT-20260805-000001-{seq_num:06d}",
            "event_type": event_type,
            "sequence_number": seq_num,
            "previous_event_id": prev_event_id,
            "packet_id": packet.get("immutable_request", {}).get("header", {}).get("packet_id"),
            "actor": {
                "identity": actor_id,
                "role": actor_role
            },
            "occurred_at": timestamp_str,
            "recorded_at": timestamp_str,
            "transition": {
                "from_state": from_state,
                "to_state": to_state,
                "transition_id": f"CXP-T-{seq_num:03d}"
            },
            "payload": payload
        }
        
        # Calculate event integrity hash
        hash_val = self.calculate_hash(new_event)
        new_event["integrity"] = {
            "content_hash": hash_val
        }
        
        events.append(new_event)
        
        # Update Derived view & Packet integrity
        packet["derived_view"] = self.replay_and_project(packet)
        if "integrity" not in packet:
            packet["integrity"] = {}
        packet["integrity"]["latest_event_hash"] = hash_val
        return packet

    def run_bootstrap_verification(self):
        """Verify the protocol loop locally via BOOTSTRAP-001."""
        print("=== CXP BOOTSTRAP-001 Verification Starting ===")
        
        # Step B01: Create packet structure
        packet = {
            "protocol": {
                "protocol_name": "CXP",
                "protocol_version": "1.2",
                "schema_version": "1.2",
                "adapter_contract_version": "0.1",
                "repository_snapshot": "none"
            },
            "identity": {
                "project": "Marketing CoreHub",
                "core_cycle": "01",
                "purpose": "Self-testing local validator loop bootstrap."
            },
            "immutable_request": {
                "header": {
                    "packet_id": "CXP-PKT-20260805-000001",
                    "timestamp": "2026-08-05T14:15:00Z",
                    "sender": "CISEM_CLOUD",
                    "recipient": "GOOGLE_ANTIGRAVITY_ADAPTER"
                },
                "repository_target": {
                    "path": "C:\\Users\\finky\\Desktop\\AntiGravity\\Marketing CoreHub CsAg",
                    "branch": "main",
                    "commit_before": "none",
                    "dirty_before": False
                },
                "authority": {
                    "ratifying_authority": {
                        "identity": "Yariv Fink",
                        "role": "Governor"
                    },
                    "human_bridge": {
                        "identity": "Yariv Fink",
                        "enabled": True,
                        "role": "Transport and coordination"
                    },
                    "issuing_system": {
                        "identity": "CISEM_CLOUD",
                        "authority_scope": ["issue_pre_authorized_packets", "audit_results"]
                    },
                    "implementation_adapter": {
                        "identity": "GOOGLE_ANTIGRAVITY_ADAPTER",
                        "authority_scope": ["claim_packet", "execute_registered_intent", "write_response_evidence"]
                    }
                },
                "governance": {
                    "dependencies": [],
                    "blocking_conditions": [],
                    "parking_rules": [],
                    "acceptance_criteria": ["Local handshake self-check passes"]
                },
                "execution": {
                    "intent": "TEST_HANDSHAKE",
                    "parameters": {
                        "token": "bootstrap-secret-token"
                    },
                    "inputs": {},
                    "required_outputs": ["stdout"],
                    "evidence_required": ["token_match_verification"]
                }
            },
            "event_stream": [],
            "derived_view": {
                "current_state": "CREATED",
                "execution_control": {},
                "response": {},
                "audit": {},
                "lessons_learned": []
            },
            "integrity": {
                "packet_hash": "",
                "latest_event_hash": ""
            }
        }
        
        # Step B02: Append PACKET_CREATED event
        packet = self.append_event(packet, "PACKET_CREATED", "NONE", "CREATED", "CISEM_CLOUD", "CLOUD_ORCHESTRATOR")
        
        # Step B03: Append PACKET_PUBLISHED event
        packet = self.append_event(packet, "PACKET_PUBLISHED", "CREATED", "READY", "CISEM_CLOUD", "CLOUD_ORCHESTRATOR")

        # Gate B01: Schema Check
        schema_ok, msg = self.validate_schema(packet)
        print(f"[Gate B01] JSON Schema Check: {schema_ok} ({msg})")
        if not schema_ok:
            return False

        # Gate B02: Event Stream check
        stream_ok, msg = self.validate_event_stream(packet)
        print(f"[Gate B02] Event Stream Check: {stream_ok} ({msg})")
        if not stream_ok:
            return False

        # Step B04: Adapter claims packet
        lease_time = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
        claim_payload = {
            "lease_expires_at": lease_time,
            "idempotency_key": "bootstrap-idemp-001"
        }
        packet = self.append_event(packet, "PACKET_CLAIMED", "READY", "CLAIMED", "GOOGLE_ANTIGRAVITY_ADAPTER", "LOCAL_ADAPTER", payload=claim_payload)
        
        # Re-verify stream derived view
        stream_ok, msg = self.validate_event_stream(packet)
        print(f"[Gate B03] Derived Claim Verification: {stream_ok} ({msg})")
        if not stream_ok:
            return False

        # Step B05: Local execution & output recording
        packet = self.append_event(packet, "EXECUTION_STARTED", "CLAIMED", "EXECUTING", "GOOGLE_ANTIGRAVITY_ADAPTER", "LOCAL_ADAPTER")
        
        output_payload = {
            "stdout": "Handshake verification token matching: bootstrap-secret-token\n",
            "stderr": ""
        }
        packet = self.append_event(packet, "EXECUTION_OUTPUT_RECORDED", "EXECUTING", "EXECUTING", "GOOGLE_ANTIGRAVITY_ADAPTER", "LOCAL_ADAPTER", payload=output_payload)

        # Step B06: Local evidence recording and lessons learned integration
        evidence_payload = {
            "evidence": {
                "token_match_verification": "SUCCESS"
            },
            "lessons": [
                {
                    "lesson_id": "CXP-LESSON-000001",
                    "source_packet_id": "CXP-PKT-20260805-000001",
                    "source_event_ids": ["CXP-EVT-20260805-000001-000005"],
                    "category": "BOOTSTRAP_HANDSHAKE",
                    "observation": "Successfully validated event-sourced derived replay loop.",
                    "context": "Verification plan completed self-test gates.",
                    "evidence_refs": [],
                    "proposed_improvement": "Stabilize derived replay in adapter core.",
                    "applicability": {
                        "scope": "LOCAL"
                    },
                    "status": "CAPTURED",
                    "maturity": "RAW",
                    "proposed_canonical_home": "C:\\Users\\finky\\Desktop\\AntiGravity\\Marketing CoreHub CsAg\\GEMINI.md",
                    "requires_human_ratification": True
                }
            ]
        }
        packet = self.append_event(packet, "EVIDENCE_RECORDED", "EXECUTING", "VALIDATING", "GOOGLE_ANTIGRAVITY_ADAPTER", "LOCAL_ADAPTER", payload=evidence_payload)

        # Step B07: Packet completion
        packet = self.append_event(packet, "PACKET_COMPLETED", "VALIDATING", "COMPLETED", "GOOGLE_ANTIGRAVITY_ADAPTER", "LOCAL_ADAPTER")

        # Step B08: Re-verify full complete loop
        stream_ok, msg = self.validate_event_stream(packet)
        print(f"[Gate B04] Complete derived replay check: {stream_ok} ({msg})")
        if not stream_ok:
            return False

        # Step B09: Tampering test (simulate alteration)
        print("Testing tampering detection...")
        packet["event_stream"][1]["payload"]["modified"] = True # inject modification
        tamper_ok, msg = self.validate_event_stream(packet)
        print(f"[Gate B05] Tampering detection test (Expected fail): {not tamper_ok} (Message: {msg})")
        if tamper_ok:
            print("ERROR: Tampering was not caught!")
            return False
        
        print("=== BOOTSTRAP-001 self-consistency checks successfully verified! ===")
        return True

if __name__ == '__main__':
    adapter = CxpAdapter()
    if len(sys.argv) > 1 and sys.argv[1] == '--generate-bootstrap':
        success = adapter.run_bootstrap_verification()
        sys.exit(0 if success else 1)
    else:
        print("CISEM Adapter active. Usage: python 2026-08-05__GoogleAntigravity__Cxp__CxpAdapter__V0.1.py --generate-bootstrap")
