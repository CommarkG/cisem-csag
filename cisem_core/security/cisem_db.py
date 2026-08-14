"""
cisem_db.py — shared read-only accessor for CISEM security checks.

Calls the two SECURITY DEFINER functions created in the Supabase SQL editor:
    public.cisem_policy_snapshot()
    public.cisem_rls_status()

Standard library only. No venv, no pip install, no supabase-py dependency.
Reads credentials from the environment; never from a file.
"""

import json
import os
import sys
import urllib.error
import urllib.request

TIMEOUT_SECONDS = 30


def _require_env(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        sys.stderr.write(
            f"ERROR: environment variable {name} is not set.\n"
            f"Run this script from the launcher in C:\\Users\\finky\\secure\\ "
            f"so the credentials are present in the session.\n"
        )
        sys.exit(2)
    return value


def call_rpc(function_name: str):
    """POST to the PostgREST RPC endpoint and return the decoded JSON list."""
    base_url = _require_env("SUPABASE_URL").rstrip("/")
    key = _require_env("SUPABASE_KEY")

    request = urllib.request.Request(
        url=f"{base_url}/rest/v1/rpc/{function_name}",
        data=b"{}",
        method="POST",
        headers={
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
        },
    )

    try:
        with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        body = error.read().decode("utf-8", errors="replace")
        sys.stderr.write(
            f"ERROR: RPC call to {function_name} failed with HTTP {error.code}.\n"
            f"{body}\n\n"
            f"If this is a 404, the SQL function has not been created yet.\n"
            f"If this is a 401/403, the key in SUPABASE_KEY lacks EXECUTE on it.\n"
        )
        sys.exit(2)
    except urllib.error.URLError as error:
        sys.stderr.write(f"ERROR: could not reach Supabase: {error.reason}\n")
        sys.exit(2)


def fetch_policies():
    """Return the live policy list, sorted deterministically."""
    rows = call_rpc("cisem_policy_snapshot")
    return sorted(rows, key=lambda r: (r["tablename"], r["policyname"], r["cmd"]))


def fetch_rls_status():
    """Return {tablename: rowsecurity_bool} for every table in the public schema."""
    rows = call_rpc("cisem_rls_status")
    return {row["tablename"]: bool(row["rowsecurity"]) for row in rows}
