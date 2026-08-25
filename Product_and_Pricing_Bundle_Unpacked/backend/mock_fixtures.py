# mock_fixtures.py (Sample Offline Test Fixtures)

MOCK_SUPPLIER_CATALOG = [
    {
        "internal_sku": "BTI-BAG-1042",
        "title_he": "תיק גב למחשב - הרווארד",
        "category": "Bags",
        "wholesale_cost": 25.00,
        "supplier_name": "Wave2",
        "supplier_sku": "TX6106",
        "supplier_product_url": "https://www.wave2.co.il/items/tx6106",
        "attributes": {"material": "RPET Melange", "laptop_size": "15.6 inch"},
        "supplier_lead_time_days": 5
    },
    {
        "internal_sku": "BTI-TECH-2050",
        "title_he": "רמקול בלוטוס POLO WOOPER",
        "category": "Gadgets",
        "wholesale_cost": 38.85,
        "supplier_name": "Polo Swiss",
        "supplier_sku": "AP5054",
        "supplier_product_url": "https://www.polo.co.il/items/ap5054",
        "attributes": {"battery": "4000mAh", "bluetooth": "5.0"},
        "supplier_lead_time_days": 3
    }
]

MOCK_SUBCONTRACTORS = [
    {
        "company_name": "Gal Laser Netanya",
        "technique": "laser_engraving",
        "setup_fee": 80.00,
        "rate_cards": [
            {"min_qty": 1, "max_qty": 99, "unit_cost": 6.00, "turnaround_days": 4},
            {"min_qty": 100, "max_qty": 499, "unit_cost": 4.00, "turnaround_days": 3},
            {"min_qty": 500, "max_qty": 10000, "unit_cost": 2.50, "turnaround_days": 2}
        ]
    }
]
