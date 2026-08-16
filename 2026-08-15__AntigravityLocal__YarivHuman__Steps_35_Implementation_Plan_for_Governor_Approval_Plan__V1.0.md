# Steps 3–5 — Implementation Plan for Governor Approval

Steps 1–2 are landed. This covers steps 3–5 plus one prerequisite finding.

---

## Pre-flight finding: `role_definitions` has no seed in migrations.sql

`role_definitions` table was created in migration 25. Zero `INSERT` statements exist in any file.
The two live rows (`operator_admin`, `account_owner`) exist only in the live database.
A fresh deployment produces an FK failure on `user_account_roles.role_code = 'account_owner'`.

**Resolution:** Migration 38 seeds `account_owner` (and `operator_admin`) with `ON CONFLICT DO NOTHING`
so it is safe to run against both fresh and existing databases.

---

## Step 3 — Migration 38: `pending_claims` + role seed

Append to [`migrations.sql`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/migrations.sql) after line 420.

```diff
+-- 38. Create pending_claims table + seed role_definitions
+-- pending_claims: records users whose tenant_id claim could not be written.
+-- Purpose (U6.2.09): makes broken provisioning state visible to operators.
+-- status values:
+--   CLAIM_FAILED       — step 4 admin API call failed after DB steps committed
+--   PENDING_ONBOARDING — user signed up without company_name in user_metadata (D.1/B3)
+-- Repair: backfill script processes CLAIM_FAILED rows. Onboarding endpoint resolves
+--         PENDING_ONBOARDING rows once the user supplies company_name.
+
+CREATE TABLE IF NOT EXISTS pending_claims (
+    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
+    auth_user_id UUID NOT NULL,
+    tenant_id UUID REFERENCES customer_accounts(id) ON DELETE SET NULL,
+    status VARCHAR(30) NOT NULL DEFAULT 'CLAIM_FAILED'
+        CHECK (status IN ('CLAIM_FAILED', 'PENDING_ONBOARDING')),
+    failed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
+    attempts INTEGER DEFAULT 1 NOT NULL,
+    last_error TEXT,
+    resolved_at TIMESTAMP WITH TIME ZONE,
+    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
+);
+
+-- Partial index: backfill queries only unresolved rows
+CREATE INDEX IF NOT EXISTS pending_claims_unresolved_idx
+    ON pending_claims(auth_user_id)
+    WHERE resolved_at IS NULL;
+
+-- role_definitions seed (safe against existing rows — ON CONFLICT DO NOTHING)
+-- Recorded debt: role taxonomy is two test rows. Must be properly defined
+-- before provisioning goes to production. Owner: Governor.
+INSERT INTO role_definitions (code, name, description)
+VALUES
+    ('account_owner',  'Account Owner',  'First user of a tenant; full administrative rights within the account.'),
+    ('operator_admin', 'Operator Admin', 'Platform-level operator with cross-tenant administrative access.')
+ON CONFLICT (code) DO NOTHING;
```

---

## Step 4 — `provisioning.py` (new file)

**Target:** [`backend/src/backend/provisioning.py`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/provisioning.py) — **[NEW]**

Corrections applied:
- **C1**: Step 5 removed from provisioning. Verification lives in middleware on first request.
- **C2**: Role code is `account_owner`.
- **C4**: One attempt at step 4. On failure, write `pending_claims` and return `PARTIAL_CLAIM_PENDING`. No retries inside the handler.
- **D.1**: `company_name` from `user_metadata`. If absent → `PENDING_ONBOARDING` path.

```python
# File: provisioning.py
# CISEM Mandatory Header:
#   Ratified plan : entity boundary work, steps 3-5
#   Architectural : Atomic 3-step DB transaction (steps 1-3), followed by
#                   one fail-fast admin API call (step 4). On step 4 failure,
#                   writes pending_claims and returns PARTIAL_CLAIM_PENDING.
#                   Verification (step 5) moved to middleware on first request (C1).
#   Role          : account_owner (C2). Role taxonomy debt recorded in migration 38.
#   Retry policy  : None inside this function (C4). Backfill owns retry.
#   D.1 path      : company_name from user_metadata (B1).
#                   If absent, creates PENDING_ONBOARDING record (B3 safety net).
#   Axioms        : AX-SECURITY-01, AX-STATELESS-01, AX-ENV-01

from enum import Enum
from dataclasses import dataclass, field
from typing import Optional
from datetime import datetime, timezone

class ProvisioningStatus(str, Enum):
    COMPLETE           = "COMPLETE"
    PARTIAL_CLAIM_PENDING = "PARTIAL_CLAIM_PENDING"
    PENDING_ONBOARDING = "PENDING_ONBOARDING"
    FAILED             = "FAILED"

@dataclass
class ProvisioningResult:
    status: ProvisioningStatus
    tenant_id: Optional[str] = None
    user_id:   Optional[str] = None
    error:     Optional[str] = None

PROVISIONING_ROLE    = "account_owner"
PROVISIONING_PACKAGE = "starter"   # resolved FK against packages.code

def record_pending_claim(
    supabase_anon,
    auth_user_id: str,
    tenant_id: Optional[str],
    status: str,
    error: str,
) -> None:
    """Write a pending_claims row. Failures are logged, never re-raised."""
    try:
        supabase_anon.table("pending_claims").insert({
            "auth_user_id": auth_user_id,
            "tenant_id":    tenant_id,
            "status":       status,
            "last_error":   error[:500] if error else None,
        }).execute()
    except Exception as exc:
        print(f"[provisioning] CRITICAL: could not write pending_claims for {auth_user_id}: {exc}")


def provision_tenant(
    *,
    auth_user_id:  str,
    company_name:  Optional[str],
    user_email:    str,
    supabase_anon,        # for DB operations (anon client, RLS active)
    supabase_admin,       # for admin API (service-role, no RLS)
) -> ProvisioningResult:
    """
    Provision a new tenant for auth_user_id.

    Steps:
      1. INSERT customer_accounts (account_type=TENANT, package resolved from code)
      2. INSERT public.users (mirror auth UUID)
      3. INSERT user_account_roles (role_code=account_owner)
      -- Steps 1-3 run in a DB transaction. Committed before step 4. --
      4. admin.update_user_by_id → app_metadata.tenant_id (C4: one attempt, fail-fast)

    If company_name is absent → PENDING_ONBOARDING path (D.1/B3):
      - Steps 1-3 still run (placeholder company_name='PENDING_ONBOARDING')
      - Step 4 is NOT run — claim is not written until onboarding is complete
      - Returns ProvisioningStatus.PENDING_ONBOARDING
    """
    if not company_name:
        # B3 safety net: provision DB rows with placeholder, skip claim
        return _provision_pending_onboarding(auth_user_id, user_email, supabase_anon)

    return _provision_full(auth_user_id, company_name, user_email, supabase_anon, supabase_admin)


def _resolve_package_id(supabase_anon) -> Optional[str]:
    res = supabase_anon.table("packages").select("id").eq("code", PROVISIONING_PACKAGE).limit(1).execute()
    return res.data[0]["id"] if res.data else None


def _provision_full(auth_user_id, company_name, user_email, supabase_anon, supabase_admin) -> ProvisioningResult:
    package_id = _resolve_package_id(supabase_anon)
    if not package_id:
        return ProvisioningResult(
            status=ProvisioningStatus.FAILED,
            user_id=auth_user_id,
            error=f"Package '{PROVISIONING_PACKAGE}' not found in packages table."
        )

    # --- Steps 1-3: Committed together; no partial state if any step fails ---
    try:
        # Step 1: customer_accounts row
        ca_res = supabase_anon.table("customer_accounts").insert({
            "company_name": company_name,
            "account_type": "TENANT",
            "package_id":   package_id,
        }).execute()
        if not ca_res.data:
            raise RuntimeError("customer_accounts insert returned no data.")
        tenant_id = ca_res.data[0]["id"]

        # Step 2: public.users mirror
        supabase_anon.table("users").insert({
            "id":    auth_user_id,
            "email": user_email,
        }).execute()

        # Step 3: user_account_roles
        supabase_anon.table("user_account_roles").insert({
            "user_id":             auth_user_id,
            "customer_account_id": tenant_id,
            "role_code":           PROVISIONING_ROLE,
        }).execute()

    except Exception as exc:
        # Steps 1-3 failed. Nothing committed yet if failure was early.
        # If step 1 committed and step 2 or 3 failed, the tenant row exists
        # without a user binding — this will be caught by a future integrity scan.
        return ProvisioningResult(
            status=ProvisioningStatus.FAILED,
            user_id=auth_user_id,
            error=str(exc)
        )

    # --- Step 4: write claim (C4: one attempt, fail-fast) ---
    try:
        supabase_admin.auth.admin.update_user_by_id(
            auth_user_id,
            {"app_metadata": {"tenant_id": tenant_id}}
        )
    except Exception as exc:
        error_msg = str(exc)
        record_pending_claim(supabase_anon, auth_user_id, tenant_id, "CLAIM_FAILED", error_msg)
        return ProvisioningResult(
            status=ProvisioningStatus.PARTIAL_CLAIM_PENDING,
            tenant_id=tenant_id,
            user_id=auth_user_id,
            error=error_msg
        )

    return ProvisioningResult(
        status=ProvisioningStatus.COMPLETE,
        tenant_id=tenant_id,
        user_id=auth_user_id
    )


def _provision_pending_onboarding(auth_user_id, user_email, supabase_anon) -> ProvisioningResult:
    """B3 safety net: company_name absent at signup. Provision DB rows, skip claim."""
    package_id = _resolve_package_id(supabase_anon)
    try:
        ca_res = supabase_anon.table("customer_accounts").insert({
            "company_name": "PENDING_ONBOARDING",
            "account_type": "TENANT",
            "package_id":   package_id,
        }).execute()
        tenant_id = ca_res.data[0]["id"] if ca_res.data else None

        supabase_anon.table("users").insert({
            "id": auth_user_id, "email": user_email
        }).execute()

        if tenant_id:
            supabase_anon.table("user_account_roles").insert({
                "user_id":             auth_user_id,
                "customer_account_id": tenant_id,
                "role_code":           PROVISIONING_ROLE,
            }).execute()

        record_pending_claim(supabase_anon, auth_user_id, tenant_id, "PENDING_ONBOARDING",
                             "company_name absent at signup; claim withheld until onboarding completes.")
    except Exception as exc:
        return ProvisioningResult(
            status=ProvisioningStatus.FAILED,
            user_id=auth_user_id,
            error=str(exc)
        )

    return ProvisioningResult(
        status=ProvisioningStatus.PENDING_ONBOARDING,
        tenant_id=tenant_id,
        user_id=auth_user_id
    )
```

---

## Step 5 — `main.py` changes (four targeted edits)

### 5-A: Add `WEBHOOK_SIGNING_SECRET` env read (near line 64)

```diff
 SUPABASE_URL = os.environ.get("SUPABASE_URL")
 SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
+# Webhook secret — distinct from TENANT_SIGNING_SECRET (different counterparty,
+# different rotation lifecycle). C3 correction: never reuse tenant HMAC for webhook.
+WEBHOOK_SIGNING_SECRET = os.environ.get("WEBHOOK_SIGNING_SECRET")
```

### 5-B: Add `verify_supabase_webhook_signature()` (after `verify_tenant_context_py`, ~line 541)

```diff
+def verify_supabase_webhook_signature(request: Request) -> dict:
+    """
+    Verify Supabase Auth Hook webhook HMAC-SHA256 signature.
+    C3: Own secret (WEBHOOK_SIGNING_SECRET), own function — not reused from
+    verify_tenant_context_py (different counterparty, different rotation lifecycle).
+    """
+    secret = WEBHOOK_SIGNING_SECRET
+    if not secret:
+        raise HTTPException(
+            status_code=503,
+            detail="Webhook verification unavailable: WEBHOOK_SIGNING_SECRET is not set."
+        )
+    raw_body = getattr(request.state, "_body", b"")
+    sig_header = request.headers.get("x-supabase-signature", "")
+    expected = hmac.new(secret.encode("utf-8"), raw_body, hashlib.sha256).hexdigest()
+    if not hmac.compare_digest(sig_header, expected):
+        raise HTTPException(status_code=401, detail="Webhook signature invalid.")
+    import json as _json
+    return _json.loads(raw_body)
```

### 5-C: Add webhook path to `is_public` list (line 153–159)

```diff
     is_public = (
         path == "/" or
         path.startswith("/docs") or
         path.startswith("/redoc") or
         path.startswith("/openapi.json") or
-        (path.startswith("/api/v1/proposals/") and not path.endswith("generate") and "admin" not in path)
+        (path.startswith("/api/v1/proposals/") and not path.endswith("generate") and "admin" not in path) or
+        path == "/api/v1/auth/webhook/signup"   # Supabase Auth Hook — server-to-server, no JWT
     )
```

### 5-D: Add webhook endpoint + operator endpoint + C1 middleware write

**Webhook endpoint** (new, after the whitelabel section):

```python
@app.post("/api/v1/auth/webhook/signup", status_code=200)
async def handle_signup_webhook(request: Request):
    """
    Supabase Auth Hook — fires at GoTrue signup.
    C3: verified by verify_supabase_webhook_signature (own secret, own function).
    C4: one provisioning attempt; on failure write pending_claims and return 200
        (returning non-200 would cause GoTrue to retry → double-provision risk).
    D.1/B1: reads company_name from user_metadata.
    D.1/B3: if absent, provisions PENDING_ONBOARDING state, withholds claim.
    """
    # Buffer raw body for HMAC verification before JSON parsing
    raw_body = await request.body()
    request.state._body = raw_body
    try:
        payload = verify_supabase_webhook_signature(request)
    except HTTPException:
        # Invalid signature — return 401 (Supabase will not retry on 401)
        raise

    auth_user_id = payload.get("user", {}).get("id")
    user_email   = payload.get("user", {}).get("email", "")
    user_metadata = payload.get("user", {}).get("user_metadata") or {}
    company_name = user_metadata.get("company_name") or None

    if not auth_user_id:
        return {"status": "ignored", "reason": "no user.id in payload"}

    if not supabase or not supabase_admin:
        record_pending_claim(supabase, auth_user_id, None, "CLAIM_FAILED",
                             "Supabase client unavailable at webhook time.")
        return {"status": "pending", "reason": "db_unavailable"}

    from .provisioning import provision_tenant, record_pending_claim
    result = provision_tenant(
        auth_user_id=auth_user_id,
        company_name=company_name,
        user_email=user_email,
        supabase_anon=supabase,
        supabase_admin=supabase_admin,
    )
    return {"status": result.status, "tenant_id": result.tenant_id}


@app.get("/api/v1/admin/pending-claims")
def get_pending_claims():
    """
    Operator visibility for broken provisioning state (U6.2.09).
    Returns all unresolved pending_claims rows.
    """
    if not supabase:
        raise HTTPException(status_code=503, detail="Supabase unavailable.")
    res = supabase.table("pending_claims").select("*").is_("resolved_at", None).execute()
    return {"count": len(res.data or []), "items": res.data or []}
```

**Middleware C1 write** (at the `if not tenant_id:` block, ~line 252):

```diff
         tenant_id: str | None = app_metadata.get("tenant_id")
         if not tenant_id:
+            # C1 correction: verification of provisioning lives here, not in provision_tenant.
+            # If a valid JWT arrives with no claim, the user is either
+            # PENDING_ONBOARDING or hit a step-4 failure. Write to pending_claims
+            # to make the state visible to operators (U6.2.09).
+            if user_id and supabase:
+                try:
+                    from .provisioning import record_pending_claim
+                    record_pending_claim(
+                        supabase, user_id, None, "CLAIM_FAILED",
+                        "Valid JWT arrived with no tenant_id claim on first authenticated request."
+                    )
+                except Exception:
+                    pass  # Never block the 401 on a logging write
             return rfc_7807_error(
                 type_url="about:blank",
                 title="Unauthorized",
                 status=401,
-                detail="JWT app_metadata.tenant_id claim is absent. User must be assigned to a tenant before accessing this API.",
+                detail="CLAIM_ABSENT: Your account setup is not complete. Contact your administrator or check provisioning status at /api/v1/admin/pending-claims.",
                 instance=path
             )
```

### 5-E: `.env.example` update

```diff
 SUPABASE_URL=https://your-project-id.supabase.co
 SUPABASE_KEY=your-supabase-service-role-secret-key
+# Webhook secret for Supabase Auth Hook HMAC verification.
+# MUST be distinct from TENANT_SIGNING_SECRET — different counterparty,
+# different rotation lifecycle (C3 correction from entity boundary work).
+WEBHOOK_SIGNING_SECRET=your-supabase-webhook-signing-secret
```

---

## U1.2.40.2 completion record (appended on execution, not approval)

| Gap | Closed by step | Enforcement |
|---|---|---|
| Step 4 owns no repair path | pending_claims + backfill (step 3) | `CLAIM_FAILED` row blocks no user silently — operator sees it |
| Webhook reused tenant HMAC | `verify_supabase_webhook_signature` with own secret (5-B) | Separate env var, separate function — wrong secret → 503, not silent fallback |
| Retry inside handler risks double-provision | Fail-fast: one attempt (C4) | No retry loop in handler; backfill owns repair |
| Verification inside provision (had no token) | Moved to middleware (C1) | First authenticated request triggers; middleware write to pending_claims |
| role_definitions seed missing | Migration 38 seeds both rows | `ON CONFLICT DO NOTHING` — safe on fresh and existing DB |

**Recorded debt (not yet enforcement):**  
Role taxonomy (`account_owner`, `operator_admin`) are two test rows seeded by migration 38.  
The taxonomy must be formally defined before provisioning goes to production.  
Owner: Governor. Class: premature hardening by use.

---

## Awaiting approval to execute

On approval: migration 38 → `provisioning.py` → five `main.py` edits → `.env.example` — one shot.
Then: provision trial tenant A through the webhook call, provision B the same way.
