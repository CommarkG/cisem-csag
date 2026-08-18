"""
RATIFIED RESOLUTION : GOV-2026-08-16-TENANCY / Webhook Signature Verification Utility
REASONING           : Provides client-side HMAC-SHA256 signature verification for external SaaS partner applications.
PARENT PRINCIPLES   : AxiomsAndPrinciples.md (U1.2.32.7, Webhook Security Verification)
"""

import hmac
import hashlib
import json

def verify_cisem_webhook_signature(payload_bytes: bytes, signature_header: str, signing_secret: str) -> bool:
    """
    Verifies the X-CISEM-Signature header against raw HTTP POST body bytes.
    
    :param payload_bytes: Raw HTTP request body bytes
    :param signature_header: Value of X-CISEM-Signature header (e.g. 'sha256=abcdef...')
    :param signing_secret: Shared webhook secret key
    :return: True if signature is valid, False otherwise
    """
    if not signature_header or not signature_header.startswith("sha256="):
        return False

    expected_signature = signature_header.split("sha256=")[1]
    computed_signature = hmac.new(
        signing_secret.encode("utf-8"),
        payload_bytes,
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(computed_signature, expected_signature)
