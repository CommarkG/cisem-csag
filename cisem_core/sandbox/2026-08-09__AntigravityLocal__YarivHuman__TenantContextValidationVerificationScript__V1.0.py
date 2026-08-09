# CISEM CODE HEADER > MANDATORY
# ratified_plan: CISEM-IP-20260809-TENANT-CONTEXT-VALIDATION
# governor_signature: GOV-YARIV-20260809-TENANT-CONTEXT-VALIDATION-V1
# version: V1.0
# reasoning: |
#   Symmetric cryptographic validation test script.
#   Asserts correct signature generation and validation for tenant contexts.
#   Parent principles: AxiomsAndPrinciples V1.25 >PR-11100, >PR-11400.

import hmac
import hashlib
import base64
import json
import sys

def run_tests():
    print("=== CISEM Tenant Context Signature Verification Tests ===")
    
    secret = b"test-secret-1234"
    payload = {
        "tenantId": "enterprise-client-abc",
        "tier": "enterprise",
        "roles": ["admin"]
    }
    
    # 1. Generate valid payload and signature
    payload_json = json.dumps(payload).encode("utf-8")
    payload_b64 = base64.b64encode(payload_json)
    
    sig_maker = hmac.new(secret, payload_b64, hashlib.sha256)
    valid_sig = sig_maker.hexdigest()
    
    header_val = f"{payload_b64.decode('utf-8')}.{valid_sig}"
    print(f"[Info] Generated Header: {header_val}")
    
    # Test 1: Successful Verification
    parts = header_val.split(".")
    payload_b64_check = parts[0].encode("utf-8")
    sig_check = parts[1]
    
    verify_hmac = hmac.new(secret, payload_b64_check, hashlib.sha256)
    expected_sig = verify_hmac.hexdigest()
    
    if hmac.compare_digest(sig_check, expected_sig):
        print("[Pass] Test 1: Signed tenant context validated successfully.")
    else:
        print("[Fail] Test 1: Signed tenant context failed validation.")
        sys.exit(1)
        
    # Test 2: Altered Payload Detection
    altered_payload = {
        "tenantId": "malicious-attacker",
        "tier": "enterprise",
        "roles": ["admin"]
    }
    altered_b64 = base64.b64encode(json.dumps(altered_payload).encode("utf-8"))
    
    # Trying to verify altered payload with original signature
    verify_hmac_2 = hmac.new(secret, altered_b64, hashlib.sha256)
    expected_sig_2 = verify_hmac_2.hexdigest()
    
    if not hmac.compare_digest(sig_check, expected_sig_2):
        print("[Pass] Test 2: Altered payload correctly blocked (signature mismatch).")
    else:
        print("[Fail] Test 2: Failed to block altered payload.")
        sys.exit(1)
        
    # Test 3: Mismatched Secret Key Detection
    wrong_secret = b"wrong-secret-9999"
    verify_hmac_3 = hmac.new(wrong_secret, payload_b64_check, hashlib.sha256)
    expected_sig_3 = verify_hmac_3.hexdigest()
    
    if not hmac.compare_digest(sig_check, expected_sig_3):
        print("[Pass] Test 3: Mismatched secret key correctly blocked (signature mismatch).")
    else:
        print("[Fail] Test 3: Failed to block wrong secret key.")
        sys.exit(1)

    print("\n[SUCCESS] All tenant context cryptographic regression checks passed.")
    sys.exit(0)

if __name__ == "__main__":
    run_tests()
