# DATABASE INTENT (APPLICATION CODE BELIEFS)

> [!WARNING]
> THIS FILE RECORDS WHAT THE APPLICATION CODE BELIEVES ABOUT THE DATABASE. IT IS NOT LIVE STATE. LIVE STATE COMES ONLY FROM A GOVERNOR QUERY. A DISAGREEMENT BETWEEN THIS FILE AND THE GOVERNOR'S SCHEMA FILE IS A DEFECT, NOT A DISCREPANCY.

## Inferred Table Names (parsed dynamically from `.table(...)` calls in `main.py`)

| Table Name | Code Query Status |
| :--- | :--- |
| `acceptance_records` | ACTIVE QUERY TARGET |
| `backlog_registry` | ACTIVE QUERY TARGET |
| `branding_rate_cards` | ACTIVE QUERY TARGET |
| `branding_subcontractors` | ACTIVE QUERY TARGET |
| `catalog_items` | ACTIVE QUERY TARGET |
| `crm_customers` | ACTIVE QUERY TARGET |
| `custom_libraries` | ACTIVE QUERY TARGET |
| `customer_accounts` | ACTIVE QUERY TARGET |
| `deals` | ACTIVE QUERY TARGET |
| `document_chunks` | ACTIVE QUERY TARGET |
| `events` | ACTIVE QUERY TARGET |
| `inquiries` | ACTIVE QUERY TARGET |
| `lookup_registry` | ACTIVE QUERY TARGET |
| `packages` | ACTIVE QUERY TARGET |
| `pdf_queue` | ACTIVE QUERY TARGET |
| `pending_claims` | ACTIVE QUERY TARGET |
| `product_groups` | ACTIVE QUERY TARGET |
| `product_variations` | ACTIVE QUERY TARGET |
| `proposal_client_drafts` | ACTIVE QUERY TARGET |
| `proposals` | ACTIVE QUERY TARGET |
| `quote_lines` | ACTIVE QUERY TARGET |
| `quotes` | ACTIVE QUERY TARGET |
| `status_library` | ACTIVE QUERY TARGET |
| `supplier_mappings` | ACTIVE QUERY TARGET |
| `tag_library` | ACTIVE QUERY TARGET |
| `template_registry` | ACTIVE QUERY TARGET |
| `translations` | ACTIVE QUERY TARGET |
| `user_account_roles` | ACTIVE QUERY TARGET |
| `users` | ACTIVE QUERY TARGET |
| `vocabulary_terms` | ACTIVE QUERY TARGET |
| `work_orders` | ACTIVE QUERY TARGET |

## Backend Data Models (parsed dynamically from AST in `main.py`)

- `ClaimMintRequest`: `user_id`, `tenant_id`
- `CatalogItemCreate`: `internal_sku`, `title_he`, `category`, `description`, `supplier_lead_time_days`, `wholesale_cost`, `supplier_name`, `supplier_sku`, `supplier_product_url`
- `SubcontractorCreate`: `company_name`, `contact_name`, `specialties`, `setup_fee`, `brackets`
- `CustomerCreate`: `name`, `domain_type`
- `StatusCreate`: `code`, `label`, `description`
- `TagCreate`: `label`, `description`, `parent_id`
- `CustomLibraryCreate`: `tab_id`, `label`, `description`
- `LookupRegistryCreate`: `registry_type`, `key_name`, `value_data`, `metadata`
- `BacklogCreate`: `title`, `context`, `tags`, `impact_level`
- `DocumentChunkUpdate`: `tag_id`, `status_code`, `chunk_text`
- `ProspectScrapePayload`: `url`
- `SearchTextPayload`: `textQuery`
- `CaelRatifyPayload`: `taskId`, `intent`, `ratified_by_user`
- `CatalogSearchPayload`: `query_vector`, `similarity_threshold`, `match_count`, `category_filter`
- `WhitelabelUpdateRequest`: `custom_domain`, `git_url`, `webhook_secret`
- `ClaimResolveRequest`: `user_id`, `tenant_id`
- `CatalogSearchPayload`: `query_vector`, `similarity_threshold`, `match_count`, `category_filter`
- `ProposalGenerateRequest`: `brief_id`, `catalog_item_skus`, `applied_margin_percent`, `selected_variations`
- `WizardDuplicatePayload`: `title`, `layout_spec`, `description`
- `InquiryCreatePayload`: `contact_name`, `contact_email`, `contact_phone`, `requirements_summary`, `estimated_budget`
- `QuoteCreatePayload`: `inquiry_id`, `currency`, `valid_until`, `notes`
- `QuoteLineCreatePayload`: `description`, `quantity`, `unit_price`
- `AcceptanceCreatePayload`: `evidence_kind`, `evidence_data`, `accepted_by`
- `WorkOrderCreatePayload`: `acceptance_record_id`, `notes`