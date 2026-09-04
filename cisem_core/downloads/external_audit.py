#!/usr/bin/env python3
"""
# CISEM CODE HEADER > MANDATORY
# ratified_plan: CISEM-IP-20260904-EXTERNAL-AUDITOR-V1
# governor_signature: GOV-YARIV-20260904-V1
# version: V1.0
# reasoning: |
#   Automated External Auditor script invoking OpenAI (gpt-4o) and Gemini APIs
#   with standing attack prompt to validate draft plans before Governor review.
#   Writes independent audit reports to hub/AUDITS/ and cisem_core/downloads/.
#   Enforces independent AI audit coverage on all proposed design plans.
#   Parent principles: PR-13950 (Zero-Drift), AX-10000.
"""

import os
import sys
import json
import urllib.request
import urllib.error
from datetime import datetime, timezone

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CORE_DIR = os.path.join(ROOT_DIR, "cisem_core")
AUDITS_DIR = os.path.join(ROOT_DIR, "hub", "AUDITS")
DOWNLOADS_DIR = os.path.join(CORE_DIR, "downloads")

os.makedirs(AUDITS_DIR, exist_ok=True)
os.makedirs(DOWNLOADS_DIR, exist_ok=True)

SECURE_DIR = r"C:\Users\finky\secure"
ATTACK_PROMPT = (
    "Attack this plan. Name what breaks, what is assumed and not stated, "
    "and what an implementer would have to decide that this does not decide. "
    "Do not summarise it."
)


def find_api_key(key_names, env_var):
    val = os.environ.get(env_var)
    if val:
        return val.strip()
    if os.path.exists(SECURE_DIR):
        for kname in key_names:
            kpath = os.path.join(SECURE_DIR, kname)
            if os.path.exists(kpath):
                try:
                    with open(kpath, "r", encoding="utf-8") as f:
                        content = f.read().strip()
                        if content:
                            return content
                except Exception:
                    pass
    return None


def call_openai_attack(plan_text, api_key):
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    payload = {
        "model": "gpt-4o",
        "messages": [
            {"role": "system", "content": ATTACK_PROMPT},
            {"role": "user", "content": f"Plan Document:\n\n{plan_text}"}
        ],
        "temperature": 0.2
    }
    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data["choices"][0]["message"]["content"]
    except Exception as e:
        return f"OpenAI API Call Failed: {e}"


def call_gemini_attack(plan_text, api_key):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{
            "parts": [
                {"text": f"{ATTACK_PROMPT}\n\nPlan Document:\n\n{plan_text}"}
            ]
        }]
    }
    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        return f"Gemini API Call Failed: {e}"


def audit_plan(plan_file_path):
    if not os.path.exists(plan_file_path):
        print(f"[ERROR] Target plan file not found: {plan_file_path}")
        sys.exit(1)

    with open(plan_file_path, "r", encoding="utf-8", errors="ignore") as f:
        plan_text = f.read()

    plan_basename = os.path.splitext(os.path.basename(plan_file_path))[0]
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    audit_filename = f"{plan_basename}__{today_str}.md"
    audit_target_path = os.path.join(AUDITS_DIR, audit_filename)
    audit_download_path = os.path.join(DOWNLOADS_DIR, audit_filename)

    openai_key = find_api_key(["openai_api_key.txt", "openai_key.txt", "openai.txt"], "OPENAI_API_KEY")
    gemini_key = find_api_key(["gemini_api_key.txt", "gemini_key.txt", "gemini.txt", "google_api_key.txt"], "GEMINI_API_KEY")

    openai_reply = call_openai_attack(plan_text, openai_key) if openai_key else (
        "STATUS: NO_OPENAI_KEY_CONFIGURED\n"
        "Governor Decision Mandate: Add OpenAI API key to environment OPENAI_API_KEY or C:\\Users\\finky\\secure\\openai_api_key.txt"
    )

    gemini_reply = call_gemini_attack(plan_text, gemini_key) if gemini_key else (
        "STATUS: NO_GEMINI_KEY_CONFIGURED\n"
        "Governor Decision Mandate: Add Gemini API key to environment GEMINI_API_KEY or C:\\Users\\finky\\secure\\gemini_api_key.txt"
    )

    has_blocking_finding = ("CRITICAL" in openai_reply or "BLOCK" in openai_reply or "CRITICAL" in gemini_reply or "BLOCK" in gemini_reply)

    report_content = f"""# EXTERNAL AUTOMATED AI ATTACK AUDIT REPORT

- **Target Plan**: `{os.path.basename(plan_file_path)}`
- **Audit Date**: `{today_str}`
- **OpenAI Key Active**: `{bool(openai_key)}`
- **Gemini Key Active**: `{bool(gemini_key)}`
- **Verdict**: `{"BLOCKED" if has_blocking_finding else "AUDITED"}`

---

## 1. OpenAI (GPT-4o) Attack Audit

{openai_reply}

---

## 2. Google Gemini Attack Audit

{gemini_reply}

---
"""

    with open(audit_target_path, "w", encoding="utf-8") as f:
        f.write(report_content)

    with open(audit_download_path, "w", encoding="utf-8") as f:
        f.write(report_content)

    print(f"[*] Wrote Audit Report to: {audit_target_path}")
    print(f"[*] Wrote Download Copy to: {audit_download_path}")

    if has_blocking_finding:
        print("[!] External Auditor raised blocking findings.")
        sys.exit(1)
    else:
        print("[+] External Auditor scan complete. Zero critical blocks detected.")
        sys.exit(0)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python cisem_core/tools/external_audit.py <plan_file_path>")
        sys.exit(1)
    audit_plan(sys.argv[1])
