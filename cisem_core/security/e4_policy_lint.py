"""
e4_policy_lint.py — CISEM Row-Level Security policy linter.

Asserts security invariants against the LIVE database. Every rule below
encodes a real defect found by hand during the 2026-08-11/12 audit, so that
none of them ever has to be found by hand again.

Usage:
    python e4_policy_lint.py

Exit codes:
    0 = all invariants hold (known issues may still be listed)
    1 = at least one ERROR
    2 = could not reach the database / not configured
"""

import sys

from cisem_db import fetch_policies, fetch_rls_status

# ---------------------------------------------------------------------------
# Configuration — edit deliberately, never to silence a finding you don't
# understand. Anything added here should be traceable to a decision.
# ---------------------------------------------------------------------------

# Tables intended to have RLS enabled and ZERO policies (deny-all to the
# client; reached only through server-side code holding the secret key).
INTENTIONALLY_DENY_ALL = {
    "user_account_roles",
}

# Pre-existing policies not yet migrated to the app_metadata authority.
# Each entry is an open item, reported as KNOWN rather than ERROR so the
# linter stays actionable. Remove an entry when the policy is fixed.
KNOWN_ISSUES = {
    ("branding_subcontractors", "Admins and Sales Agents Only on Subcontractors"):
        "Legacy role gate; not tenant-scoped; SELECT-only so writes deny-all.",
    ("supplier_mappings", "Admins and Sales Agents Only on Supplier Mappings"):
        "Legacy role gate; not tenant-scoped; SELECT-only so writes deny-all.",
}

# The single approved tenant-identity authority.
APPROVED_AUTHORITY = "app_metadata"

# Forbidden authority: client-supplied HTTP headers are forgeable.
FORBIDDEN_AUTHORITY = "request.headers"

WRITE_COMMANDS = {"INSERT", "UPDATE", "ALL"}


def lint():
    policies = fetch_policies()
    rls_status = fetch_rls_status()

    errors = []
    known = []

    def report(table, policy_name, message):
        entry = f"{table}.{policy_name}: {message}"
        if (table, policy_name) in KNOWN_ISSUES:
            known.append(entry)
        else:
            errors.append(entry)

    # -- Rule 1 -------------------------------------------------------------
    # A table with RLS enabled and no policy denies everyone. That is correct
    # only when intended; otherwise it is an outage waiting for the key swap.
    tables_with_policies = {p["tablename"] for p in policies}
    for table, enabled in sorted(rls_status.items()):
        if not enabled:
            continue
        if table in tables_with_policies or table in INTENTIONALLY_DENY_ALL:
            continue
        errors.append(
            f"{table}: RLS is enabled but no policy exists — this table will "
            f"return zero rows once the backend stops using the secret key."
        )

    for policy in policies:
        table = policy["tablename"]
        name = policy["policyname"]
        cmd = (policy["cmd"] or "").upper()
        roles = policy.get("roles", "")
        qual = policy.get("qual", "") or ""
        with_check = policy.get("with_check", "") or ""

        # -- Rule 2 ---------------------------------------------------------
        # A read predicate permitting a NULL owner must never reach a write
        # path. This is the template_registry escalation: FOR ALL + IS NULL
        # let any tenant insert, update, and delete operator canonicals.
        if cmd in WRITE_COMMANDS and "IS NULL" in qual.upper():
            report(table, name,
                   f"cmd={cmd} with 'IS NULL' in USING — permits writing rows "
                   f"with a NULL owner. Split into a SELECT policy and strict "
                   f"write policies.")

        # -- Rule 3 ---------------------------------------------------------
        # FOR ALL / INSERT / UPDATE without WITH CHECK silently reuses USING
        # as the write predicate. This produced two separate escalations.
        if cmd in WRITE_COMMANDS and not with_check.strip():
            report(table, name,
                   f"cmd={cmd} has no WITH CHECK — USING is being reused as "
                   f"the write predicate.")

        # -- Rule 4 ---------------------------------------------------------
        # Grant to the role that should have it, not to everyone.
        role_list = [r.strip() for r in roles.split(",") if r.strip()]
        if "public" in role_list or "anon" in role_list:
            report(table, name,
                   f"granted to {{{roles}}} — should target 'authenticated' "
                   f"or another explicit role.")

        # -- Rule 5 ---------------------------------------------------------
        # One tenant authority. A forgeable header is not an authority.
        if FORBIDDEN_AUTHORITY in qual or FORBIDDEN_AUTHORITY in with_check:
            report(table, name,
                   f"reads tenant identity from '{FORBIDDEN_AUTHORITY}', which "
                   f"the caller controls. Use the signed JWT claim.")

        # -- Rule 6 ---------------------------------------------------------
        # Advisory: flag predicates that reference no recognised authority.
        combined = qual + with_check
        if combined.strip() and not (
            APPROVED_AUTHORITY in combined
            or "auth.uid" in combined
            or "auth.jwt" in combined
        ):
            report(table, name,
                   "predicate references no recognised identity source "
                   "(app_metadata / auth.uid / auth.jwt) — verify it is "
                   "intentional.")

    return policies, rls_status, errors, known


def main():
    policies, rls_status, errors, known = lint()

    enabled_count = sum(1 for v in rls_status.values() if v)
    print(f"Scanned {len(policies)} policies across "
          f"{len(rls_status)} tables ({enabled_count} with RLS enabled).")
    print()

    if known:
        print(f"KNOWN ({len(known)}) — tracked, not blocking:")
        for entry in known:
            print(f"  - {entry}")
        print()

    if errors:
        print(f"ERRORS ({len(errors)}):")
        for entry in errors:
            print(f"  ! {entry}")
        print()
        print("FAIL")
        return 1

    print("PASS — all invariants hold.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
