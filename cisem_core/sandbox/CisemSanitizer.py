#!/usr/bin/env python3
"""
# CISEM CODE HEADER -- MANDATORY
# ratified_plan: CISEM-IP-20260806-SANITIZATION-V1.0
# governor_signature: GOV-YARIV-20260806-SANITIZATION-V1.0
# version: V1.0
# reasoning: |
#   CisemSanitizer scans incoming execution packets for prompt injection threats.
#   Implements PR-58950 (Context-Related Element Grouping) by dividing packets
#   into SYSTEM_CRITICAL, ROUTINE_DATA, and METADATA_LOG groups, applying
#   custom safety assessments to each instead of a uniform blanket rule.
#   Keystone impact: Hardens the ingestion layer and couples watch blocks to gate locks.
#   Parent principles: AxiomsAndPrinciples V1.14 §PR-58950, §AX-20000.
"""

import re

# Strict threat patterns for SYSTEM_CRITICAL packets
CRITICAL_INJECTION_PATTERNS = [
    r"(?i)ignore\s+(all\s+)?(previous\s+)?instructions",
    r"(?i)bypass\s+(verification|governance|gate)",
    r"(?i)system\s+override",
    r"(?i)you\s+are\s+now\s+an?\s+admin",
    r"(?i)override\s+rules",
    r"(?i)grant\s+all\s+privileges",
    r"__import__\s*\(",
    r"eval\s*\(",
    r"exec\s*\("
]

# Soft threat patterns for ROUTINE_DATA packets (warning triggers)
ROUTINE_INJECTION_PATTERNS = [
    r"(?i)ignore\s+previous",
    r"(?i)bypass\s+gate"
]

class CisemSanitizer:
    @staticmethod
    def classify_packet_group(packet):
        """
        Classifies incoming packet into safety groups per PR-58950.
        Returns 'SYSTEM_CRITICAL', 'ROUTINE_DATA', or 'METADATA_LOG'.
        """
        packet_id = packet.get("packet_id", "").upper()
        payload = packet.get("payload", {})
        
        # Heuristics for classification
        # If payload contains code strings, schemas, or adapter modifications -> critical
        if any(k in payload for k in ("code", "script", "adapter_config", "schema")):
            return "SYSTEM_CRITICAL"
        
        # If packet ID starts with CXP-PKT-SYS -> critical
        if packet_id.startswith("CXP-PKT-SYS"):
            return "SYSTEM_CRITICAL"
            
        # Log packets -> metadata
        if "log" in str(payload).lower() or packet_id.startswith("CXP-PKT-LOG"):
            return "METADATA_LOG"
            
        # All others default to routine data
        return "ROUTINE_DATA"

    @staticmethod
    def scan(packet):
        """
        Scans a packet for prompt injection patterns based on its classified group.
        Returns (is_clean: bool, threat_signature: str or None, group_name: str)
        """
        # @swift_placeholder: PARK-003
        group = CisemSanitizer.classify_packet_group(packet)
        payload_str = str(packet.get("payload", ""))
        
        if group == "SYSTEM_CRITICAL":
            for pattern in CRITICAL_INJECTION_PATTERNS:
                if re.search(pattern, payload_str):
                    return False, f"CRITICAL_THREAT: {pattern}", group
                    
        elif group == "ROUTINE_DATA":
            for pattern in ROUTINE_INJECTION_PATTERNS:
                if re.search(pattern, payload_str):
                    return False, f"ROUTINE_WARN: {pattern}", group
                    
        # METADATA_LOG is exempt from threat blocking (Format validation only)
        return True, None, group
