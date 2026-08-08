# dto_models.py (Pydantic FastAPI)
from pydantic import BaseModel, Field
from typing import List, Optional
from decimal import Decimal
from datetime import date

# 1. CATEGORY HIERARCHY DTO
class ProductGroupDTO(BaseModel):
    id: str
    name: str
    parent_id: Optional[str] = None
    level: int

    class Config:
        from_attributes = True

# 2. PRODUCT VARIATIONS DTO
class ProductVariationDTO(BaseModel):
    id: str
    catalog_item_id: str
    variation_type: str  # 'color', 'size', 'material'
    value: str           # e.g. 'Royal Blue'
    cost_modifier: Decimal

    class Config:
        from_attributes = True

# 3. CLIENT-SAFE VARIATIONS DTO (Hides Cost Surcharges)
class ClientProductVariationDTO(BaseModel):
    id: str
    variation_type: str
    value: str

    class Config:
        from_attributes = True

# 4. ADMIN BACK OFFICE DTO (Full Cost/Margin Visibility)
class AdminCatalogItemDTO(BaseModel):
    id: str
    internal_sku: str
    title_he: str
    category: str
    product_group_id: Optional[str] = None
    description: Optional[str] = None
    image_urls: List[str] = []
    supplier_name: str
    supplier_sku: str
    supplier_product_url: str
    wholesale_cost: Decimal
    calculated_client_price: Decimal
    profit_margin_percent: Decimal
    currency_code: str = "ILS"
    supplier_lead_time_days: int = 5
    variations: List[ProductVariationDTO] = []

    class Config:
        from_attributes = True

# 5. CLIENT PROPOSAL DTO (Strict Cost/Surcharge Masking)
class ClientCatalogItemDTO(BaseModel):
    id: str
    internal_sku: str            # Displayed as e.g. 'BTI-BAG-1042'
    title_he: str
    category: str
    product_group_id: Optional[str] = None
    description: Optional[str] = None
    image_urls: List[str] = []
    client_unit_price: Decimal   # Final computed retail price ONLY
    currency_code: str = "ILS"
    variations: List[ClientProductVariationDTO] = [] # Surcharges are hidden; pricing updates via API callbacks

    class Config:
        from_attributes = True

# 6. BRIEF QUALIFICATION SCHEMAS
class BriefQualifyRequest(BaseModel):
    client_id: str
    raw_text: str

class ParsedConstraints(BaseModel):
    target_quantity: int
    budget_unit_max: Optional[Decimal] = None
    currency: str = "ILS"
    event_date: Optional[date] = None
    categories: List[str] = []

class BriefQualifyResponse(BaseModel):
    brief_id: str
    completeness_score: int
    parsed_constraints: ParsedConstraints
    clarifying_questions: List[str] = []

# 7. PROPOSAL SCHEMAS
class ProposalGenerateRequest(BaseModel):
    brief_id: str
    catalog_item_skus: List[str]
    applied_margin_percent: Decimal
    selected_variations: Optional[List[str]] = [] # list of variation IDs to apply surcharges

class ProposalClientDraftSubmit(BaseModel):
    selection_matrix: dict # Maps SKU to selected variations and quantity details

class BrandAssetsUploadDTO(BaseModel):
    company_name: str
    tax_id: Optional[str] = None
    industry: Optional[str] = None
    brand_assets: dict
