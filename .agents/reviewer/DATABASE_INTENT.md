# DATABASE INTENT (APPLICATION CODE BELIEFS)

> [!WARNING]
> THIS FILE RECORDS WHAT THE APPLICATION CODE BELIEVES ABOUT THE DATABASE. IT IS NOT LIVE STATE. LIVE STATE COMES ONLY FROM A GOVERNOR QUERY. A DISAGREEMENT BETWEEN THIS FILE AND THE GOVERNOR'S SCHEMA FILE IS A DEFECT, NOT A DISCREPANCY.

## Inferred Application Table Dependencies & Queries (from backend/src/backend/main.py)

| Table Name | Query Usage / Route Context | Code Status |
| :--- | :--- | :--- |
| `catalog_items` | Search & CRUD endpoints (`POST /api/v1/catalog/items`, `POST /catalog/search`) | ACTIVE |
| `supplier_mappings` | Multi-criteria supplier prioritization (`get_prioritized_suppliers`) | ACTIVE |
| `branding_subcontractors` | Subcontractor management (`POST /api/v1/subcontractors`) | ACTIVE |
| `branding_rate_cards` | Subcontractor rate card mapping | ACTIVE |
| `customer_accounts` | Tenant boundary context (`request.state.tenant_id`) | ACTIVE |
| `users` | User identity fallback seed (`ingest_wisdom.py`) | ACTIVE |
| `contacts` | CRM default contact query (`seed_db.py`) | ACTIVE |
| `lookup_registry` | Currency conversion registry lookup (`registry_type = currency_conversion`) | ACTIVE |
| `template_registry` | Pipeline duplication (`POST /api/v1/templates/{id}/duplicate`) | ACTIVE |
| `document_chunks` | Brief chunk vector indexing | DEPRECATED (501) |
| `briefs` | Legacy brief persistence | RETIRED (501) |
| `deals` | Legacy deal persistence | RETIRED (410) |

## Backend Pydantic Data Models
- `CatalogItemCreate`: `internal_sku`, `title_he`, `category`, `wholesale_cost`, `currency`
- `SubcontractorCreate`: `company_name`, `contact_name`, `specialties`, `brackets`
- `BriefQualifyRequest`: `raw_text`, `client_id`
- `WizardDuplicatePayload`: `new_title`, `target_tenant_id`