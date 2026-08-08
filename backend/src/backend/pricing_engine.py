# pricing_engine.py
from dataclasses import dataclass
from decimal import Decimal, ROUND_HALF_UP
from datetime import date

@dataclass
class PricingInput:
    quantity: int
    product_wholesale_cost: Decimal
    subcontractor_unit_cost: Decimal
    subcontractor_setup_fee: Decimal
    total_freight_cost: Decimal
    target_margin_percent: Decimal  # e.g. 35 for 35%

@dataclass
class TimelineInput:
    event_date: date
    supplier_lead_time_days: int
    subcontractor_turnaround_days: int

@dataclass
class PricingOutput:
    total_cost_per_unit: Decimal
    total_order_cost: Decimal
    client_unit_price: Decimal
    total_order_revenue: Decimal
    total_profit: Decimal

def calculate_quote_pricing(data: PricingInput) -> PricingOutput:
    # 1. Setup Fee Amortization
    setup_fee_per_unit = data.subcontractor_setup_fee / Decimal(data.quantity)
    
    # 2. Freight Amortization
    freight_per_unit = data.total_freight_cost / Decimal(data.quantity)
    
    # 3. Total Cost Per Unit
    unit_cost = (
        data.product_wholesale_cost + 
        data.subcontractor_unit_cost + 
        setup_fee_per_unit + 
        freight_per_unit
    )
    
    # 4. Client Unit Price with Margin
    margin_decimal = data.target_margin_percent / Decimal(100)
    client_unit_price = unit_cost / (Decimal(1) - margin_decimal)
    
    # Rounding to 2 decimal places
    client_unit_price = client_unit_price.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    total_order_cost = (unit_cost * Decimal(data.quantity)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    total_order_revenue = (client_unit_price * Decimal(data.quantity)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    total_profit = total_order_revenue - total_order_cost

    return PricingOutput(
        total_cost_per_unit=unit_cost.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP),
        total_order_cost=total_order_cost,
        client_unit_price=client_unit_price,
        total_order_revenue=total_order_revenue,
        total_profit=total_profit
    )

def check_timeline_feasibility(data: TimelineInput) -> str:
    """
    Verifies Event Date Feasibility Lock:
    Importer Delivery Lead Time + Branding Turnaround <= Days to Client Event.
    """
    days_to_event = (data.event_date - date.today()).days
    total_required_days = data.supplier_lead_time_days + data.subcontractor_turnaround_days
    
    if total_required_days <= days_to_event:
        return "feasible"
    else:
        return "timeline_warning"
