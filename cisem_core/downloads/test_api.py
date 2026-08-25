# Ratified Plan: CISEM-IP-20260810-FRONTEND-PLAYBOOK-REFACTOR
# Architectural Reasoning: Automated integration script to verify Priority Engine FastAPI endpoints.
# Validates path routing, cryptographic context verification, and role-gating rules.
# Parent Principles: GEMINI.md Rule 5, Rule 18.

import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    print("=== CISEM Priority Engine API Integration Test ===")
    
    # 1. Test GET /api/v1/parking-vault (Public/Read view)
    print("\n[*] Testing GET /api/v1/parking-vault...")
    res = requests.get(f"{BASE_URL}/api/v1/parking-vault")
    print(f"Response status: {res.status_code}")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    data = res.json()
    items = data.get("parked_items", [])
    print(f"Loaded {len(items)} parked items.")
    assert len(items) > 0, "No parked items returned."
    
    # 2. Test POST /api/v1/parking-vault/prioritize (No admin role - expect 403)
    print("\n[*] Testing unauthorized POST /api/v1/parking-vault/prioritize...")
    target_item = items[0]
    payload = {
        "item_id": target_item["item_id"],
        "scope": 8,
        "complexity": 7,
        "completion_needed": "Complete testing coverage",
        "urgency": 9,
        "blast_radius": 6,
        "significance": 8
    }
    
    res = requests.post(
        f"{BASE_URL}/api/v1/parking-vault/prioritize",
        json=payload
    )
    print(f"Response status (no headers): {res.status_code}")
    assert res.status_code in (401, 403), f"Expected 401 or 403, got {res.status_code}"
    
    # 3. Test POST /api/v1/parking-vault/prioritize (With signed x-tenant-context)
    print("\n[*] Testing authorized POST /api/v1/parking-vault/prioritize...")
    import hmac
    import hashlib
    import base64
    secret = "dev-secret-key-9999"
    payload_dict = {
        "tenantId": "dev-tenant-1",
        "tier": "enterprise",
        "roles": ["admin"]
    }
    payload_json = json.dumps(payload_dict)
    payload_b64 = base64.b64encode(payload_json.encode('utf-8')).decode('utf-8')
    signature = hmac.new(secret.encode('utf-8'), payload_b64.encode('utf-8'), hashlib.sha256).hexdigest()
    signed_header = f"{payload_b64}.{signature}"

    headers = {
        "x-tenant-context": signed_header
    }
    res = requests.post(
        f"{BASE_URL}/api/v1/parking-vault/prioritize",
        json=payload,
        headers=headers
    )
    print(f"Response status (with header): {res.status_code}")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    res_data = res.json()
    assert res_data.get("success") is True, "Success parameter is not True."
    
    # Check that item is updated
    updated_items = res_data.get("parked_items", [])
    updated_item = next((x for x in updated_items if x["item_id"] == target_item["item_id"]), None)
    assert updated_item is not None, "Updated item not found in list."
    assert updated_item["urgency"] == 9, "Urgency was not updated."
    assert updated_item["completion_needed"] == "Complete testing coverage", "Completion needed description not updated."
    print("[+] Priority update was successfully saved and re-sorted.")
    
    print("\n=== All API Tests Passed Successfully ===")

if __name__ == "__main__":
    try:
        run_tests()
    except Exception as e:
        print(f"\n[!] Test failed: {e}")
        exit(1)
