# seed_db.py
import os
import sys
from decimal import Decimal
from supabase import create_client, Client
from dotenv import load_dotenv

import httpx
from supabase.lib.client_options import SyncClientOptions

# Load env variables from backend directory or parent
load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY") # Use Service Role Key for bypass of RLS during seeding

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: SUPABASE_URL and SUPABASE_KEY (service role) must be set in your environment or .env file.")
    sys.exit(1)

# Disable SSL verification for development/debugging network proxies
http_client = httpx.Client(verify=False)
options = SyncClientOptions(httpx_client=http_client)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY, options=options)

def seed_database():
    print("Connecting to Supabase...")
    
    # 1. Seed CRM customer accounts and contacts for pipeline testing
    print("Seeding CRM Customer accounts...")
    customer_res = supabase.table("customer_accounts").upsert({
        "company_name": "Acme HighTech LTD",
        "tax_id": "512345678",
        "industry": "Software",
        "brand_assets": {
            "logo_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150",
            "hex_colors": ["#4F46E5", "#06B6D4"]
        },
        "credit_terms": "Net-30",
        "account_type": "CRM_CLIENT"   # explicit: this is a CRM fixture, not a tenant
    }).execute()
    customer_id = customer_res.data[0]["id"]
    
    contact_res = supabase.table("contacts").upsert({
        "customer_account_id": customer_id,
        "name": "David Cohen",
        "email": "david@acme-hightech.co.il",
        "whatsapp": "+972541234567"
    }).execute()
    contact_id = contact_res.data[0]["id"]

    # 3. Seed Category Hierarchy (L0 -> L1 -> L2)
    print("Seeding product groups...")
    # L0 Main Topics
    l0_bags = supabase.table("product_groups").upsert({"name": "תיקים ופתרונות נשיאה", "level": 0}).execute().data[0]
    l0_tech = supabase.table("product_groups").upsert({"name": "גאדג'טים וטכנולוגיה", "level": 0}).execute().data[0]
    
    # L1 Sub Topics
    l1_backpacks = supabase.table("product_groups").upsert({"name": "תיקי גב", "parent_id": l0_bags["id"], "level": 1}).execute().data[0]
    l1_speakers = supabase.table("product_groups").upsert({"name": "רמקולים בלוטוס", "parent_id": l0_tech["id"], "level": 1}).execute().data[0]
    
    # L2 Sub-Sub Topics
    l2_laptop_bags = supabase.table("product_groups").upsert({"name": "תיקי גב למחשב", "parent_id": l1_backpacks["id"], "level": 2}).execute().data[0]
    l2_portable_speakers = supabase.table("product_groups").upsert({"name": "רמקולים ניידים", "parent_id": l1_speakers["id"], "level": 2}).execute().data[0]
    
    print("Category hierarchy seeded.")

    # 4. Insert Subcontractors
    print("Seeding subcontractors...")
    sub_res = supabase.table("branding_subcontractors").upsert({
        "company_name": "Gal Laser Netanya",
        "contact_name": "Gal",
        "specialties": ["laser_engraving", "uv_print"]
    }).execute()
    
    if not sub_res.data:
        print("Failed to insert subcontractor.")
        return
    sub_id = sub_res.data[0]["id"]
    print(f"Subcontractor created: {sub_id}")
    
    # 5. Insert Subcontractor Rate Cards
    print("Seeding subcontractor rate cards...")
    rate_cards = [
        {"subcontractor_id": sub_id, "technique": "laser_engraving", "setup_fee": 80.00, "min_quantity": 1, "max_quantity": 99, "unit_cost": 6.00, "turnaround_days": 4},
        {"subcontractor_id": sub_id, "technique": "laser_engraving", "setup_fee": 80.00, "min_quantity": 100, "max_quantity": 499, "unit_cost": 4.00, "turnaround_days": 3},
        {"subcontractor_id": sub_id, "technique": "laser_engraving", "setup_fee": 80.00, "min_quantity": 500, "max_quantity": 10000, "unit_cost": 2.50, "turnaround_days": 2}
    ]
    supabase.table("branding_rate_cards").upsert(rate_cards).execute()
    print("Subcontractor rate cards seeded.")
    
    # 6. Insert Catalog Items linked to Category Hierarchy
    print("Seeding catalog items...")
    mock_vector = [0.0] * 1536
    mock_vector[0] = 1.0
    
    catalog_items = [
        {
            "internal_sku": "BTI-BAG-1042",
            "title_he": "תיק גב למחשב - הרווארד",
            "category": "Bags",
            "product_group_id": l2_laptop_bags["id"],
            "description": "תיק גב יוקרתי למחשב נייד בעיצוב אלגנטי",
            "attributes": {"material": "RPET Melange", "laptop_size": "15.6 inch"},
            "image_urls": ["🎒"],
            "currency_code": "ILS",
            "supplier_lead_time_days": 5,
            "embedding": mock_vector
        },
        {
            "internal_sku": "BTI-TECH-2050",
            "title_he": "רמקול בלוטוס POLO WOOPER",
            "category": "Gadgets",
            "product_group_id": l2_portable_speakers["id"],
            "description": "רמקול בלוטוס איכותי ועוצמתי לסלולרי",
            "attributes": {"battery": "4000mAh", "bluetooth": "5.0"},
            "image_urls": ["🔊"],
            "currency_code": "ILS",
            "supplier_lead_time_days": 3,
            "embedding": mock_vector
        }
    ]
    
    cat_res = supabase.table("catalog_items").upsert(catalog_items).execute()
    if not cat_res.data:
        print("Failed to insert catalog items.")
        return
        
    bag_id = next(item["id"] for item in cat_res.data if item["internal_sku"] == "BTI-BAG-1042")
    speaker_id = next(item["id"] for item in cat_res.data if item["internal_sku"] == "BTI-TECH-2050")
    
    # 7. Seed Variations for items (color/size parameters)
    print("Seeding product variations...")
    variations = [
        # Bag color variations
        {"catalog_item_id": bag_id, "variation_type": "color", "value": "כחול מלנז'", "cost_modifier": 0.00},
        {"catalog_item_id": bag_id, "variation_type": "color", "value": "שחור פחם", "cost_modifier": 0.00},
        # Bag size variations
        {"catalog_item_id": bag_id, "variation_type": "size", "value": "15.6 אינץ'", "cost_modifier": 0.00},
        {"catalog_item_id": bag_id, "variation_type": "size", "value": "17.3 אינץ'", "cost_modifier": 5.00},
        # Speaker variations
        {"catalog_item_id": speaker_id, "variation_type": "color", "value": "שחור מט", "cost_modifier": 0.00},
        {"catalog_item_id": speaker_id, "variation_type": "color", "value": "לבן כסף", "cost_modifier": 2.50}
    ]
    supabase.table("product_variations").upsert(variations).execute()
    print("Product variations seeded.")
    
    # 8. Insert Supplier mappings (pointers)
    print("Seeding supplier mappings...")
    mappings = [
        {
            "catalog_item_id": bag_id,
            "supplier_name": "Wave2",
            "supplier_sku": "TX6106",
            "supplier_product_url": "https://www.wave2.co.il/items/tx6106",
            "wholesale_cost": 25.00
        },
        {
            "catalog_item_id": speaker_id,
            "supplier_name": "Polo Swiss",
            "supplier_sku": "AP5054",
            "supplier_product_url": "https://www.polo.co.il/items/ap5054",
            "wholesale_cost": 38.85
        }
    ]
    supabase.table("supplier_mappings").upsert(mappings).execute()
    print("Supplier mappings seeded.")
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_database()
