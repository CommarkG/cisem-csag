# =============================================================================
# File           : 2026-08-14__CisemCsAg__Security__TenantContextHmacVerification__V1.0.py
# Ratified plan  : CISEM-IP-20260814-SECURITY-HARDENING v1.0 (T4 Verification)
# Architectural  : Verifies the x-tenant-context HMAC boundary in both directions.
#                  DIRECTION-1 (forged):  wrong key  → expect 401  (rejection)
#                  DIRECTION-2 (real):    real key   → expect 200  (acceptance)
#                  One direction alone proves nothing. Both must pass.
#                  MUST be run from the launcher context carrying TENANT_SIGNING_SECRET.
# Parent axioms  : AX-SECURITY-01 (AGENTS.md ss15)
# History:
#   2026-08-14 V1.0 - Created. DO NOT DELETE until T4 has been run and reported.
#                     This file is not scratch. It is a runnable verification artifact
#                     required by an external party (Governor) in the launcher context.
# =============================================================================
"""
T4 HMAC Verification - Both Directions

Target endpoint : GET /api/v1/tenant/whitelabel
  Calls verify_tenant_context_py() directly — isolates the HMAC check.

Direction 1: Forged context (wrong key)    -> expect 401
Direction 2: Real signed context (env key) -> expect 200

Run from launcher context:
    uv run python cisem_core/security/2026-08-14__CisemCsAg__Security__TenantContextHmacVerification__V1.0.py
"""
import hmac as _hmac
import hashlib
import base64
import json
import os
import urllib.request
import urllib.error

BACKEND  = "http://localhost:8000"
ENDPOINT = BACKEND + "/api/v1/tenant/whitelabel"

# Payload used for both directions — tenantId and tier must match a real tenant
# after T3 backfill. Adjust tenantId if needed.
REAL_PAYLOAD = {"tenantId": "dev-tenant-1", "tier": "enterprise", "roles": ["member"]}


def make_signed_context(payload: dict, secret: str) -> str:
    payload_b64 = base64.b64encode(json.dumps(payload).encode()).decode()
    sig = _hmac.new(secret.encode(), payload_b64.encode(), hashlib.sha256).hexdigest()
    return payload_b64 + "." + sig


def call_endpoint(label: str, ctx_header: str) -> tuple:
    req = urllib.request.Request(
        ENDPOINT,
        headers={
            "Authorization": "Bearer dev-token",   # pre-Step-5-restart only
            "x-tenant-context": ctx_header,
        },
        method="GET",
    )
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            return resp.status, resp.read().decode()
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()
    except Exception as ex:
        return None, str(ex)


PASS = "PASS"
FAIL = "FAIL"
SKIP = "SKIP"

results = []

# --- DIRECTION 1: FORGED (wrong key) ---
print("=" * 64)
print("T4 DIRECTION-1: FORGED context (wrong key) — expect 401/403")
print("=" * 64)
forged = make_signed_context(REAL_PAYLOAD, "wrong-key-absolutely-not-real-9999")
s1, b1 = call_endpoint("FORGED", forged)
print("  Status:", s1)
print("  Body  :", b1[:300])
if s1 in (401, 403):
    r1 = PASS
    print("  RESULT:", PASS, "— forged context rejected")
elif s1 is None:
    r1 = SKIP
    print("  RESULT:", SKIP, "— backend unreachable")
else:
    r1 = FAIL
    print("  RESULT:", FAIL, "— forged context accepted, status=" + str(s1))
results.append(("DIRECTION-1 (forged rejected)", r1))

print()

# --- DIRECTION 2: REAL (env key) ---
print("=" * 64)
print("T4 DIRECTION-2: REAL signed context (env key) — expect 200")
print("=" * 64)
real_secret = os.environ.get("TENANT_SIGNING_SECRET")
if not real_secret:
    r2 = SKIP
    print("  SKIP: TENANT_SIGNING_SECRET not set in this environment.")
    print("  Run from the launcher context that carries the secret.")
    results.append(("DIRECTION-2 (real accepted)", SKIP))
else:
    real_ctx = make_signed_context(REAL_PAYLOAD, real_secret)
    s2, b2 = call_endpoint("REAL", real_ctx)
    print("  Status:", s2)
    print("  Body  :", b2[:300])
    if s2 == 200:
        r2 = PASS
        print("  RESULT:", PASS, "— real signed context accepted")
    elif s2 is None:
        r2 = SKIP
        print("  RESULT:", SKIP, "— backend unreachable")
    else:
        r2 = FAIL
        print("  RESULT:", FAIL, "— real signed context rejected, status=" + str(s2))
    results.append(("DIRECTION-2 (real accepted)", r2))

print()
print("=" * 64)
print("T4 SUMMARY")
print("=" * 64)
for label, result in results:
    print(f"  {result:4s}  {label}")

all_pass = all(r == PASS for _, r in results)
any_fail = any(r == FAIL for _, r in results)
if all_pass:
    print("\n  T4 COMPLETE: both directions verified.")
elif any_fail:
    print("\n  T4 FAILED: see FAIL entries above.")
else:
    print("\n  T4 PARTIAL: one or more directions skipped (run from launcher).")
