# scratch/generate_backlog_seed.py
import yaml
import os
import json

yaml_path = os.path.join(os.getcwd(), "cisem_core", "sandbox", "parking_vault_draft.yaml")
out_sql_path = os.path.join(os.getcwd(), "backend", "src", "backend", "migrations_20260825_backlog_seed.sql")

with open(yaml_path, "r", encoding="utf-8") as f:
    data = yaml.safe_load(f)

items = data.get("parked_items", [])

sql_lines = [
    "-- migrations_20260825_backlog_seed.sql",
    "-- RATIFIED BY GOVERNOR YARIV 2026-08-25: Spine Backlog Migration (45 Items)",
    "ALTER TABLE backlog_registry ADD COLUMN IF NOT EXISTS customer_account_id UUID REFERENCES customer_accounts(id) ON DELETE CASCADE;",
    "ALTER TABLE backlog_registry ADD COLUMN IF NOT EXISTS dependencies TEXT[] DEFAULT '{}'::text[];",
    "ALTER TABLE backlog_registry ADD COLUMN IF NOT EXISTS reconnect_trigger TEXT;",
    ""
]

system_tenant = "5c3e147d-546d-4a65-aec8-5814e9ba09b0" # AGN Ltd / System Core Tenant

for item in items:
    s_code = item.get("item_id", "PARK-UNK")
    title = item.get("title", "").replace("'", "''")
    context = item.get("description", "").replace("'", "''")
    
    tags_arr = item.get("tags", [])
    tags_formatted = "ARRAY[" + ", ".join([f"'{t.replace('\'', '\'\'')}'" for t in tags_arr]) + "]::text[]" if tags_arr else "'{}'::text[]"
    
    status = "backlog_raw"
    impact = item.get("status", "low").replace("'", "''")
    
    deps_arr = item.get("linked_plans", [])
    deps_formatted = "ARRAY[" + ", ".join([f"'{d.replace('\'', '\'\'')}'" for d in deps_arr]) + "]::text[]" if deps_arr else "'{}'::text[]"
    
    trigger = item.get("completion_needed", "Auto-docketed from system audit").replace("'", "''")
    
    sql = f"INSERT INTO backlog_registry (serial_code, title, context, tags, status, impact_level, customer_account_id, dependencies, reconnect_trigger) VALUES ('{s_code}', '{title}', '{context}', {tags_formatted}, '{status}', '{impact}', '{system_tenant}', {deps_formatted}, '{trigger}') ON CONFLICT (serial_code) DO UPDATE SET title = EXCLUDED.title, context = EXCLUDED.context, tags = EXCLUDED.tags, impact_level = EXCLUDED.impact_level, dependencies = EXCLUDED.dependencies, reconnect_trigger = EXCLUDED.reconnect_trigger;"
    sql_lines.append(sql)

with open(out_sql_path, "w", encoding="utf-8") as f:
    f.write("\n".join(sql_lines))

print(f"[SUCCESS] Wrote {len(items)} migration seed statements into {out_sql_path}")
