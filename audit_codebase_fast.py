import os
import re
import json

terminal_tables_db = [
    "state_transitions", "rules", "custom_libraries", "classification_nodes",
    "branding_rate_cards", "catalog_item_sandbox_variants", "pdf_queue", "pending_claims",
    "platform_change_requests", "marks", "decision_records", "round_artifacts",
    "team_closure", "account_closure", "crm_customers", "document_chunks",
    "vocabulary_transitions", "unit_composition", "inquiry_units", "quote_lines",
    "catalog_item_tags", "branding_subcontractors", "supplier_mappings", "proposal_items",
    "proposals", "briefs", "user_account_roles", "package_feature_grants",
    "feature_registry", "packages", "role_definitions", "tag_library", "lookup_registry"
]

referenced_tables_db = [
    "status_library", "customer_accounts", "inquiries", "quotes", "catalog_items",
    "price_lists", "price_list_lines", "entity_aliases", "shipping_methods", "users",
    "workspaces", "template_registry", "navigation_menu_items", "app_registry",
    "contacts", "deals", "backlog_registry", "tenant_installations", "tenant_api_keys",
    "tenant_usage_logs", "tenant_webhook_logs", "product_groups", "product_variations",
    "proposal_client_drafts", "attachments", "events", "column_provenance_logs",
    "tenant_sequence_counters", "freight_zone_rates", "supplier_cost_brackets",
    "work_orders", "work_center_operations", "inventory_levels"
]

all_62_tables = sorted(list(set(terminal_tables_db + referenced_tables_db)))

search_dirs = [
    r'C:\Users\finky\Desktop\AntiGravity\Cisem CsAg\src',
    r'C:\Users\finky\Desktop\AntiGravity\Cisem CsAg\backend'
]

ignore_dirs = {'node_modules', '.next', '.git', 'dist', 'build', '.gemini'}

corpus = []
for s_dir in search_dirs:
    for root, dirs, files in os.walk(s_dir):
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        for file in files:
            if file.endswith(('.js', '.jsx', '.ts', '.tsx', '.py', '.sql')) and file != 'database.types.ts':
                p = os.path.join(root, file)
                try:
                    with open(p, 'r', encoding='utf-8', errors='ignore') as f:
                        corpus.append(f.read())
                except Exception:
                    pass

full_text = "\n".join(corpus)

codebase_status = {}

for tbl in all_62_tables:
    escaped = re.escape(tbl)
    has_read = bool(re.search(r"(\.from\(['\"]" + escaped + r"['\"]\)\.select|\.table\(['\"]" + escaped + r"['\"]\)\.select|SELECT.*FROM\s+" + escaped + r"\b)", full_text, re.I))
    has_write = bool(re.search(r"(\.from\(['\"]" + escaped + r"['\"]\)\.(insert|update|upsert|delete)|\.table\(['\"]" + escaped + r"['\"]\)\.(insert|update|upsert|delete)|(INSERT INTO|UPDATE|DELETE FROM)\s+" + escaped + r"\b)", full_text, re.I))
    
    if not has_read and not has_write:
        if re.search(r"['\"]" + escaped + r"['\"]", full_text):
            has_read = True

    if has_read and has_write:
        st = 'READ & WRITTEN'
    elif has_read:
        st = 'READ'
    elif has_write:
        st = 'WRITTEN'
    else:
        st = 'NEITHER'

    codebase_status[tbl] = st

counts = {'READ & WRITTEN': 0, 'READ': 0, 'WRITTEN': 0, 'NEITHER': 0}
for tbl, st in codebase_status.items():
    counts[st] += 1

neither_list = sorted([tbl for tbl, st in codebase_status.items() if st == 'NEITHER'])

true_orphans = sorted([tbl for tbl in all_62_tables if tbl in terminal_tables_db and codebase_status[tbl] == 'NEITHER'])
valid_leaves = sorted([tbl for tbl in all_62_tables if tbl in terminal_tables_db and codebase_status[tbl] != 'NEITHER'])
silent_ghosts = sorted([tbl for tbl in all_62_tables if tbl not in terminal_tables_db and codebase_status[tbl] == 'NEITHER'])

out = {
    'total': len(all_62_tables),
    'counts': counts,
    'neither_count': len(neither_list),
    'neither_list': neither_list,
    'true_orphans_count': len(true_orphans),
    'true_orphans': true_orphans,
    'valid_leaves_count': len(valid_leaves),
    'valid_leaves': valid_leaves,
    'silent_ghosts_count': len(silent_ghosts),
    'silent_ghosts': silent_ghosts,
    'details': codebase_status
}

out_path = r'C:\Users\finky\Desktop\AntiGravity\Cisem CsAg\exact_62_table_audit.json'

with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(out, f, indent=2)

print("AUDIT_FILE_WRITTEN_TO_WORKSPACE")
