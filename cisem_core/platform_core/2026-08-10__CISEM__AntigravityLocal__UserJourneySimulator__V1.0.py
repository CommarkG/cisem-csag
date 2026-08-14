# -*- coding: utf-8 -*-
"""
# CISEM CODE HEADER > MANDATORY
# ratified_plan: CISEM-IP-20260810-VECTOR-PARTITION-AUDIT-V1.0
# governor_signature: GOV-YARIV-20260810-GOVERNANCE-HARDENING-RATIFIED
# version: V1.0
# reasoning: |
#   Simulates the complete admin/operator user journey from brief ingestion, deal insertion,
#   vector catalog searching, proposal compilation, and CRM board stage updates.
#   Parent principles: AxiomsAndPrinciples V1.30 >AX-10000, >AX-50000.
"""

import sys
import requests
import json

BASE_URL = "http://localhost:8000/api/v1"
HEADERS = {"Authorization": "Bearer dev-token"}

def print_result(step: str, success: bool, details: str = ""):
    status = "PASS" if success else "FAIL"
    color = "\033[92m" if success else "\033[91m"
    reset = "\033[0m"
    print(f"[{color}{status}{reset}] {step} - {details}")

def run_simulation():
    print("="*60)
    print("CISEM Admin User Journey Simulation - Run Start")
    print("="*60)

    # Step 1: Ingest Client Brief
    print("\n--- Step 1: Ingest Client Brief ---")
    brief_payload = {
        "client_id": "Acme HighTech LTD",
        "raw_text": "We need 200 high-quality laptop bags and promotional Bluetooth speakers for our annual corporate event. The budget is up to 150 ILS per unit. Event date is 2026-09-15."
    }
    try:
        res = requests.post(f"{BASE_URL}/briefs/qualify", json=brief_payload, headers=HEADERS, timeout=10)
        if res.status_code == 200:
            brief_data = res.json()
            brief_id = brief_data.get("brief_id")
            score = brief_data.get("completeness_score")
            print_result("Ingest Brief", True, f"Brief ID: {brief_id}, Completeness: {score}%")
        else:
            print_result("Ingest Brief", False, f"HTTP {res.status_code}: {res.text}")
            return
    except Exception as e:
        print_result("Ingest Brief", False, str(e))
        return

    # Step 2: Verify CRM Deal Ingestion Stage
    print("\n--- Step 2: Verify CRM Deal Ingested Stage ---")
    try:
        res = requests.get(f"{BASE_URL}/crm/deals", headers=HEADERS, timeout=10)
        if res.status_code == 200:
            deals = res.json().get("deals", [])
            # Search for deal containing brief_id in its logs/raw_text or is in Lead Ingestion
            matching_deals = [d for d in deals if d.get("stage") == "Lead Ingestion"]
            if matching_deals:
                deal = matching_deals[0]
                print_result("CRM Deal Check", True, f"Deal ID: {deal.get('id')}, Client: {deal.get('client')}, Stage: {deal.get('stage')}, Value: {deal.get('value')}")
            else:
                print_result("CRM Deal Check", False, "No deal found in Lead Ingestion stage.")
        else:
            print_result("CRM Deal Check", False, f"HTTP {res.status_code}")
    except Exception as e:
        print_result("CRM Deal Check", False, str(e))

    # Step 3: Search Catalog via Vector Similarity
    print("\n--- Step 3: Search Catalog via Vector Similarity ---")
    search_payload = {
        "query_vector": [1.0] + [0.0] * 767,
        "similarity_threshold": 0.1,
        "match_count": 5,
        "category_filter": "Bags"
    }
    try:
        res = requests.post(f"{BASE_URL}/catalog/search", json=search_payload, headers=HEADERS, timeout=10)
        if res.status_code == 200:
            results = res.json()
            if results:
                print_result("Catalog Vector Search", True, f"Found {len(results)} matches. First match SKU: {results[0].get('item', {}).get('internal_sku')}")
                catalog_skus = [r.get("item", {}).get("internal_sku") for r in results[:2]]
            else:
                print_result("Catalog Vector Search", False, "No search results returned.")
                catalog_skus = ["BTI-BAG-1042", "BTI-TECH-2050"]
        else:
            print_result("Catalog Vector Search", False, f"HTTP {res.status_code}")
            catalog_skus = ["BTI-BAG-1042", "BTI-TECH-2050"]
    except Exception as e:
        print_result("Catalog Vector Search", False, str(e))
        catalog_skus = ["BTI-BAG-1042", "BTI-TECH-2050"]

    # Step 4: Compile & Generate Proposal
    print("\n--- Step 4: Generate Proposal ---")
    proposal_payload = {
        "brief_id": brief_id,
        "catalog_item_skus": catalog_skus,
        "applied_margin_percent": 35.00
    }
    try:
        res = requests.post(f"{BASE_URL}/proposals/generate", json=proposal_payload, headers=HEADERS, timeout=10)
        if res.status_code == 200:
            prop_data = res.json()
            token = prop_data.get("public_token")
            print_result("Proposal Generation", True, f"Token: {token}, Share link: {prop_data.get('whatsapp_share_link')}")
        else:
            print_result("Proposal Generation", False, f"HTTP {res.status_code}: {res.text}")
    except Exception as e:
        print_result("Proposal Generation", False, str(e))

    # Step 5: Verify CRM Deal Stage Progressed
    print("\n--- Step 5: Verify CRM Deal Stage Progressed ---")
    try:
        res = requests.get(f"{BASE_URL}/crm/deals", headers=HEADERS, timeout=10)
        if res.status_code == 200:
            deals = res.json().get("deals", [])
            sent_deals = [d for d in deals if d.get("stage") == "Proposal Sent"]
            if sent_deals:
                deal = sent_deals[0]
                print_result("CRM Stage Update Check", True, f"Deal stage correctly updated to: {deal.get('stage')}, Value: {deal.get('value')}")
            else:
                print_result("CRM Stage Update Check", False, "No deals found in Proposal Sent stage.")
        else:
            print_result("CRM Stage Update Check", False, f"HTTP {res.status_code}")
    except Exception as e:
        print_result("CRM Stage Update Check", False, str(e))

    print("\n" + "="*60)
    print("CISEM Admin User Journey Simulation - Run End")
    print("="*60)

if __name__ == "__main__":
    run_simulation()
