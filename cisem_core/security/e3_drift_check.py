"""
e3_drift_check.py — CISEM security drift detector.

Compares the LIVE database policy state against a committed snapshot file.
The database is the source of truth; the snapshot is the expectation.

Why this exists: on 2026-08-12 a policy migration reported "Success. No rows
returned" while having silently applied only 2 of 12 statements. A success
message is not evidence. Row counts are.

Usage:
    python e3_drift_check.py             # check for drift  (exit 1 if drift)
    python e3_drift_check.py --update    # re-baseline the snapshot (deliberate)

Exit codes:
    0 = live state matches the snapshot
    1 = drift detected
    2 = could not reach the database / not configured
    3 = no snapshot exists yet (one was created; review and commit it)
"""

import json
import os
import sys

from cisem_db import fetch_policies, fetch_rls_status

SNAPSHOT_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                             "policy_snapshot.json")


def build_live_state():
    return {
        "policies": fetch_policies(),
        "rls_enabled": sorted(
            name for name, enabled in fetch_rls_status().items() if enabled
        ),
    }


def policy_key(policy):
    return f"{policy['tablename']}.{policy['policyname']} [{policy['cmd']}]"


def write_snapshot(state):
    with open(SNAPSHOT_PATH, "w", encoding="utf-8") as handle:
        json.dump(state, handle, indent=2, sort_keys=True)
        handle.write("\n")


def load_snapshot():
    with open(SNAPSHOT_PATH, "r", encoding="utf-8") as handle:
        return json.load(handle)


def compare(expected, live):
    """Return a list of human-readable drift findings."""
    findings = []

    expected_policies = {policy_key(p): p for p in expected["policies"]}
    live_policies = {policy_key(p): p for p in live["policies"]}

    for key in sorted(set(expected_policies) - set(live_policies)):
        findings.append(f"MISSING   policy that the snapshot expects: {key}")

    for key in sorted(set(live_policies) - set(expected_policies)):
        findings.append(f"UNEXPECTED policy present in the database: {key}")

    for key in sorted(set(expected_policies) & set(live_policies)):
        before, after = expected_policies[key], live_policies[key]
        for field in ("roles", "qual", "with_check"):
            if before.get(field, "") != after.get(field, ""):
                findings.append(
                    f"CHANGED   {key} field '{field}'\n"
                    f"            snapshot: {before.get(field, '') or '(empty)'}\n"
                    f"            live:     {after.get(field, '') or '(empty)'}"
                )

    expected_rls = set(expected["rls_enabled"])
    live_rls = set(live["rls_enabled"])

    for table in sorted(expected_rls - live_rls):
        findings.append(f"RLS OFF   on '{table}' — snapshot expects it enabled")
    for table in sorted(live_rls - expected_rls):
        findings.append(f"RLS ON    on '{table}' — not in the snapshot")

    return findings


def main():
    update_mode = "--update" in sys.argv
    live = build_live_state()

    if not os.path.exists(SNAPSHOT_PATH):
        write_snapshot(live)
        print("No snapshot existed. One has been created from the live database:")
        print(f"  {SNAPSHOT_PATH}")
        print(f"  {len(live['policies'])} policies, "
              f"{len(live['rls_enabled'])} tables with RLS enabled.")
        print()
        print("Review it, confirm it reflects the state you intend, then commit it.")
        return 3

    if update_mode:
        previous = load_snapshot()
        findings = compare(previous, live)
        write_snapshot(live)
        print(f"Snapshot re-baselined from the live database "
              f"({len(findings)} change(s) absorbed):")
        for finding in findings:
            print(f"  {finding}")
        print()
        print("Commit the updated snapshot with the change that motivated it.")
        return 0

    findings = compare(load_snapshot(), live)

    if not findings:
        print(f"PASS — no drift. {len(live['policies'])} policies, "
              f"{len(live['rls_enabled'])} tables with RLS enabled.")
        return 0

    print(f"DRIFT DETECTED — {len(findings)} finding(s):")
    print()
    for finding in findings:
        print(f"  {finding}")
    print()
    print("If this drift is intentional, re-run with --update to re-baseline.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
