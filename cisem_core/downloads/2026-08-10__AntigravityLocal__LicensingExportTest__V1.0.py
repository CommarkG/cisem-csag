#!/usr/bin/env python3
"""
# CISEM CODE HEADER > MANDATORY
# ratified_plan: CISEM-IP-20260810-CONSOLIDATED-MASTER-V17
# governor_signature: GOV-YARIV-20260810-GOVERNANCE-HARDENING-RATIFIED
# version: V1.0
# reasoning: |
#   Verification test suite for dynamic template export validation with Ed25519
#   asymmetric key signatures and tiered accessibility contrast checking.
#   Parent principles: AxiomsAndPrinciples V1.30 >AX-10000, >AX-50000.
"""

import os
import sys
import json
import hmac
import hashlib
import base64
import time
import requests
import subprocess
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.hazmat.primitives import serialization

def run_tests():
    print("==================================================")
    print("CISEM Template Exporter & Licensing Test Suite")
    print("==================================================")

    # 1. Load Hardcoded Ed25519 Key Pair matching route fallback
    private_pem = """-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIH7kJD6JZqQ1CP1DOl1pxWa0jfFCYJ1hKUxMlTd2Rxo5
-----END PRIVATE KEY-----"""
    public_pem = """-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAOtwrWrUuYI7YjrWZoelRYg+NhKD7FZe8kxF2zcpsFBU=
-----END PUBLIC KEY-----"""
    
    private_key = serialization.load_pem_private_key(
        private_pem.encode(),
        password=None
    )

    print("[+] Loaded static Ed25519 test key pair.")

    # 2. Check if Next.js dev server is already running on port 3000
    url = "http://localhost:3000/api/templates/export"
    server_process = None

    print("[+] Checking if Next.js dev server is already running on port 3000...")
    try:
        # Check endpoint
        res = requests.post(url, json={}, timeout=2.0)
        print("[+] Reusing active Next.js dev server on port 3000.")
    except requests.exceptions.ConnectionError:
        print("[+] Server not detected on port 3000. Launching Next.js test dev server...")
        env = os.environ.copy()
        env["LICENSE_PUBLIC_KEY"] = public_pem
        env["TENANT_SIGNING_SECRET"] = "test-secret-key-12345"
        
        server_process = subprocess.Popen(
            "npx next dev -p 3000",
            cwd=os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            env=env,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            shell=True,
            text=True
        )

        # Wait dynamically for server to boot up
        print("[+] Waiting for Next.js server to start accepting connections...")
        for i in range(30):
            try:
                requests.post(url, json={}, timeout=2.0)
                print("[+] Connection established!")
                break
            except requests.exceptions.ConnectionError:
                time.sleep(1.0)
        else:
            print("[-] Error: Next.js dev server failed to start on port 3000 in 30 seconds.")
            server_process.terminate()
            stdout, stderr = server_process.communicate()
            print("--- SERVER STDOUT ---")
            print(stdout)
            print("--- SERVER STDERR ---")
            print(stderr)
            sys.exit(1)

    # Try parsing .env file for TENANT_SIGNING_SECRET, default to dev-secret-key-9999
    signing_secret = "dev-secret-key-9999"
    # Find .env at workspace root level
    env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            for line in f:
                if line.strip().startswith("TENANT_SIGNING_SECRET="):
                    signing_secret = line.split("=")[1].strip()
                    break
    print(f"[+] Using TENANT_SIGNING_SECRET: {signing_secret}")

    def make_tenant_context_header(tenant_id, tier):
        payload = {"tenantId": tenant_id, "tier": tier, "roles": ["admin"]}
        payload_b64 = base64.b64encode(json.dumps(payload).encode('utf-8')).decode('utf-8')
        h = hmac.new(signing_secret.encode('utf-8'), payload_b64.encode('utf-8'), hashlib.sha256)
        return f"{payload_b64}.{h.hexdigest()}"

    passed_count = 0
    total_count = 0

    try:
        # TEST 1: Missing headers/Unauthorized context
        total_count += 1
        print("\n--- TEST 1: Missing TenantContext ---")
        res = requests.post(url, json={})
        print(f"Status: {res.status_code}, Response: {res.text}")
        if res.status_code == 401:
            print("[PASS]")
            passed_count += 1
        else:
            print("[FAIL]")

        # TEST 2: Missing parameters (expiresAt, signature, etc.)
        total_count += 1
        print("\n--- TEST 2: Missing Parameters ---")
        headers = {"x-tenant-context": make_tenant_context_header("dev-tenant-1", "enterprise")}
        res = requests.post(url, json={"templateId": "hero-layout-balanced", "contrastRatio": 4.8}, headers=headers)
        print(f"Status: {res.status_code}, Response: {res.text}")
        if res.status_code == 400:
            print("[PASS]")
            passed_count += 1
        else:
            print("[FAIL]")

        # TEST 3: Invalid Ed25519 signature
        total_count += 1
        print("\n--- TEST 3: Invalid Ed25519 Signature ---")
        headers = {"x-tenant-context": make_tenant_context_header("dev-tenant-1", "enterprise")}
        res = requests.post(url, json={
            "templateId": "hero-layout-balanced",
            "contrastRatio": 4.8,
            "licenseKey": "dummy-license",
            "signature": "a1b2c3d4e5f6",
            "expiresAt": "2026-12-31T00:00:00Z"
        }, headers=headers)
        print(f"Status: {res.status_code}, Response: {res.text}")
        if res.status_code == 403:
            print("[PASS]")
            passed_count += 1
        else:
            print("[FAIL]")

        # TEST 4: Valid Signature, High Contrast (Enterprise Tier)
        total_count += 1
        print("\n--- TEST 4: Valid Signature + High Contrast (Enterprise) ---")
        headers = {"x-tenant-context": make_tenant_context_header("tenant-corp-1", "enterprise")}
        expires = "2026-12-31T00:00:00Z"
        message = f"tenant-corp-1:enterprise:{expires}".encode('utf-8')
        sig = private_key.sign(message).hex()

        res = requests.post(url, json={
            "templateId": "hero-layout-balanced",
            "contrastRatio": 4.8,
            "licenseKey": public_pem,
            "signature": sig,
            "expiresAt": expires
        }, headers=headers)
        print(f"Status: {res.status_code}, Response: {res.text}")
        if res.status_code == 200 and "SUCCESS" in res.text:
            print("[PASS]")
            passed_count += 1
        else:
            print("[FAIL]")

        # TEST 5: Valid Signature, Low Contrast (Enterprise Hard-Block)
        total_count += 1
        print("\n--- TEST 5: Valid Signature + Low Contrast (Enterprise Block) ---")
        res = requests.post(url, json={
            "templateId": "hero-layout-balanced",
            "contrastRatio": 3.2,
            "licenseKey": public_pem,
            "signature": sig,
            "expiresAt": expires
        }, headers=headers)
        print(f"Status: {res.status_code}, Response: {res.text}")
        if res.status_code == 400 and "aborted" in res.text:
            print("[PASS]")
            passed_count += 1
        else:
            print("[FAIL]")

        # TEST 6: Valid Signature, Low Contrast (Pro Tier Warning)
        total_count += 1
        print("\n--- TEST 6: Valid Signature + Low Contrast (Pro Warning) ---")
        headers_pro = {"x-tenant-context": make_tenant_context_header("tenant-pro-1", "pro")}
        message_pro = f"tenant-pro-1:pro:{expires}".encode('utf-8')
        sig_pro = private_key.sign(message_pro).hex()

        res = requests.post(url, json={
            "templateId": "hero-layout-balanced",
            "contrastRatio": 3.2,
            "licenseKey": public_pem,
            "signature": sig_pro,
            "expiresAt": expires
        }, headers=headers_pro)
        print(f"Status: {res.status_code}, Response: {res.text}")
        if res.status_code == 200 and "WARNING" in res.text:
            print("[PASS]")
            passed_count += 1
        else:
            print("[FAIL]")

        # TEST 7: Valid Signature (Free Tier Block)
        total_count += 1
        print("\n--- TEST 7: Valid Signature (Free Tier Block) ---")
        headers_free = {"x-tenant-context": make_tenant_context_header("tenant-free-1", "free")}
        message_free = f"tenant-free-1:free:{expires}".encode('utf-8')
        sig_free = private_key.sign(message_free).hex()

        res = requests.post(url, json={
            "templateId": "hero-layout-balanced",
            "contrastRatio": 4.8,
            "licenseKey": public_pem,
            "signature": sig_free,
            "expiresAt": expires
        }, headers=headers_free)
        print(f"Status: {res.status_code}, Response: {res.text}")
        if res.status_code == 403 and "restricted" in res.text:
            print("[PASS]")
            passed_count += 1
        else:
            print("[FAIL]")

    finally:
        if server_process is not None:
            print("\n[+] Tearing down Next.js test dev server...")
            server_process.terminate()
            server_process.wait()

    print("==================================================")
    print(f"TEST RESULTS: {passed_count}/{total_count} Passed.")
    print("==================================================")
    
    if passed_count == total_count:
        print("[+] ALL LICENSING VERIFICATIONS COMPLETED SUCCESSFULLY.")
        sys.exit(0)
    else:
        print("[-] SOME TEST CASES FAILED.")
        sys.exit(1)

if __name__ == "__main__":
    run_tests()
