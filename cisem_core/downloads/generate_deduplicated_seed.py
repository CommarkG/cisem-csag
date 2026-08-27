# scratch/generate_deduplicated_seed.py
import os

out_sql_path = os.path.join(os.getcwd(), "backend", "src", "backend", "migrations_20260825_backlog_seed.sql")

subquery_tenant = "(SELECT id FROM customer_accounts WHERE company_name = 'CISEM Platform' LIMIT 1)"

sql_lines = [
    "-- migrations_20260825_backlog_seed.sql",
    "-- RATIFIED BY GOVERNOR YARIV 2026-08-25: Deduplicated Backlog Migration (10 Items)",
    "-- Zero Hardcoded UUID Literals. Subquery resolves customer_accounts.company_name = 'CISEM Platform' in PostgreSQL.",
    "ALTER TABLE backlog_registry ADD COLUMN IF NOT EXISTS customer_account_id UUID REFERENCES customer_accounts(id) ON DELETE CASCADE;",
    "ALTER TABLE backlog_registry ADD COLUMN IF NOT EXISTS subject_category VARCHAR(50) DEFAULT 'SYSTEM_SPINE' NOT NULL;",
    "ALTER TABLE backlog_registry ADD COLUMN IF NOT EXISTS unblocks_count INTEGER DEFAULT 0;",
    "ALTER TABLE backlog_registry ADD COLUMN IF NOT EXISTS occurrence_count INTEGER DEFAULT 1;",
    "ALTER TABLE backlog_registry ADD COLUMN IF NOT EXISTS dependencies TEXT[] DEFAULT '{}'::text[];",
    "ALTER TABLE backlog_registry ADD COLUMN IF NOT EXISTS reconnect_trigger TEXT;",
    "ALTER TABLE backlog_registry DROP CONSTRAINT IF EXISTS check_impact_level;",
    "ALTER TABLE backlog_registry ADD CONSTRAINT check_impact_level CHECK (impact_level IN ('LOW', 'MEDIUM', 'HIGH', 'KEYSTONE'));",
    ""
]

deduped_items = [
    {
        "serial_code": "BACKLOG-SYS-001",
        "subject_category": "SYSTEM_SPINE",
        "title": "Naked Numbers Class -- Context/Reasoning missing for raw numbers",
        "context": "ATV Naked Number Audit detected 20 occurrences of raw numbers across documentation files without surrounding context keywords. Aggregated into a single defect class item.",
        "tags": "ARRAY['[AUDIT.RIGIDITY]', '[DOCUMENTATION.CONTEXT]']::text[]",
        "status": "backlog_raw",
        "impact_level": "MEDIUM",
        "unblocks_count": 3,
        "occurrence_count": 20,
        "dependencies": "ARRAY['CISEM-IP-20260806-CONTEXT-ADAPTIVE-V1.0']::text[]",
        "reconnect_trigger": "Document number contextualization linter clean pass"
    },
    {
        "serial_code": "BACKLOG-SYS-002",
        "subject_category": "SYSTEM_SPINE",
        "title": "Underactivated Mechanisms Class -- 7 mechanisms underactivated",
        "context": "ATV audit detected 7 compiler and sync mechanisms with underactivated trigger counts (CISEM-GATE-V2, CISEM-SYNC-V1.1, CISEM-WATCHER-LOCK, CISEM-ATV-V1, CISEM-TURN-COUNTER, CISEM-PERSONA-AUDITOR, CISEM-REGISTRY). Aggregated into single mechanism activation item.",
        "tags": "ARRAY['[IMPROVEMENT.GAP]', '[ACTIVATION.UNDERACTIVATED]']::text[]",
        "status": "backlog_raw",
        "impact_level": "KEYSTONE",
        "unblocks_count": 7,
        "occurrence_count": 7,
        "dependencies": "ARRAY['CISEM-IP-20260806-ANTITHEATER-V1.0', 'CISEM-IP-20260806-UNDERACTIVATED-V1.0']::text[]",
        "reconnect_trigger": "100% trigger activation targets met across all 7 mechanisms"
    },
    {
        "serial_code": "BACKLOG-SYS-003",
        "subject_category": "PERFORMANCE",
        "title": "Edge Cache Caching Lag for UI theme swaps",
        "context": "Switching themes in dashboard portal has latency lag on Vercel Edge. Needs client hydration bypass.",
        "tags": "ARRAY['[PERFORMANCE.CACHE]', '[UI.THEME]']::text[]",
        "status": "backlog_raw",
        "impact_level": "HIGH",
        "unblocks_count": 2,
        "occurrence_count": 1,
        "dependencies": "ARRAY['CISEM-IP-20260825-MASTER-CONSOLIDATED-V2']::text[]",
        "reconnect_trigger": "Edge cache hydration latency < 50ms"
    },
    {
        "serial_code": "BACKLOG-SYS-004",
        "subject_category": "SYSTEM_SPINE",
        "title": "Decoupled Local Watcher Lock-Before-Sync block",
        "context": "Prevent watcher daemon from syncing unapproved file changes using temporary state files.",
        "tags": "ARRAY['[STABILITY.LOCKS]', '[ARCHITECTURE.SYNC]']::text[]",
        "status": "backlog_raw",
        "impact_level": "MEDIUM",
        "unblocks_count": 4,
        "occurrence_count": 1,
        "dependencies": "ARRAY['CISEM-IP-20260805-CXP-MIGRATION', 'CISEM-IP-20260806-GATE-HARDENING']::text[]",
        "reconnect_trigger": "Watcher lock witness verification"
    },
    {
        "serial_code": "BACKLOG-SYS-005",
        "subject_category": "SECURITY",
        "title": "MCE Ingestion Sanitization against prompt injection",
        "context": "Sanitizer layer that scans brief text inputs dropped in Drive for prompt injection patterns prior to DB insertion.",
        "tags": "ARRAY['[SECURITY.INJECTION]', '[INGESTION.SANITIZATION]']::text[]",
        "status": "backlog_raw",
        "impact_level": "HIGH",
        "unblocks_count": 5,
        "occurrence_count": 1,
        "dependencies": "ARRAY['CISEM-IP-20260806-GATE-HARDENING', 'CISEM-IP-20260806-SANITIZATION-V1.0']::text[]",
        "reconnect_trigger": "Zero prompt injection vulnerability pass"
    },
    {
        "serial_code": "BACKLOG-SYS-006",
        "subject_category": "SYSTEM_SPINE",
        "title": "Deep Root Continuous Improvement Loop",
        "context": "Every implementation must be measured against original intent post-completion. If outcome delta > 10%, auto-generate a new item.",
        "tags": "ARRAY['[ARCHITECTURE.IMPROVEMENT]', '[IMPROVEMENT.LOOP]']::text[]",
        "status": "backlog_raw",
        "impact_level": "KEYSTONE",
        "unblocks_count": 8,
        "occurrence_count": 1,
        "dependencies": "ARRAY['CISEM-IP-20260806-GATE-HARDENING']::text[]",
        "reconnect_trigger": "Outcome delta audit verification < 10%"
    },
    {
        "serial_code": "BACKLOG-SYS-007",
        "subject_category": "AUDIT_TELEMETRY",
        "title": "Persona Audit Scenario Coverage Gap -- Only 30% persona coverage",
        "context": "ATV detected 70% of registered personas never triggered in scenario tests. Platform scenarios require broader persona coverage.",
        "tags": "ARRAY['[IMPROVEMENT.GAP]', '[AUDIT.COVERAGE]']::text[]",
        "status": "backlog_raw",
        "impact_level": "MEDIUM",
        "unblocks_count": 2,
        "occurrence_count": 1,
        "dependencies": "ARRAY['CISEM-IP-20260806-PERSONA-EXPANSION-V1.0']::text[]",
        "reconnect_trigger": "100% persona audit activation"
    },
    {
        "serial_code": "BACKLOG-SYS-008",
        "subject_category": "AUDIT_TELEMETRY",
        "title": "Beneficial Drift -- Scenario findings surfaced constructive opportunities",
        "context": "ATV surfaced constructive findings from expert personas representing genuine platform improvement opportunities.",
        "tags": "ARRAY['[BENEFICIAL.DRIFT]', '[AUDIT.POSITIVE]']::text[]",
        "status": "backlog_raw",
        "impact_level": "LOW",
        "unblocks_count": 1,
        "occurrence_count": 1,
        "dependencies": "ARRAY['CISEM-IP-20260806-ANTITHEATER-V1.0']::text[]",
        "reconnect_trigger": "Beneficial drift ratification"
    },
    {
        "serial_code": "BACKLOG-SYS-009",
        "subject_category": "AUDIT_TELEMETRY",
        "title": "Contextual Audit Gap -- Low persona relevance in security scenarios",
        "context": "ATV Contextual check detected expected security auditor personas did not fire during stability lock scenario tests.",
        "tags": "ARRAY['[IMPROVEMENT.GAP]', '[AUDIT.CONTEXTUAL]']::text[]",
        "status": "backlog_raw",
        "impact_level": "LOW",
        "unblocks_count": 1,
        "occurrence_count": 1,
        "dependencies": "ARRAY['CISEM-IP-20260806-CONTEXT-ADAPTIVE-V1.0']::text[]",
        "reconnect_trigger": "Contextual check alignment"
    },
    {
        "serial_code": "BACKLOG-PROD-001",
        "subject_category": "PRODUCT_PIPELINE",
        "title": "Universal Inquiry-to-Project (ITP) Pipeline Integration",
        "context": "Wire brief intake, AI vector product matching (/api/v1/vector-search), instant proposal engine, public review tokens, and automated project dispatch into a single-row stepper.",
        "tags": "ARRAY['[PRODUCT.ITP]', '[PIPELINE.INQUIRY]', '[WORKFLOW.PROJECT]']::text[]",
        "status": "backlog_raw",
        "impact_level": "KEYSTONE",
        "unblocks_count": 10,
        "occurrence_count": 1,
        "dependencies": "ARRAY['CISEM-IP-20260824-UNIVERSAL-INQUIRY-V1']::text[]",
        "reconnect_trigger": "End-to-end ITP proposal generation under 2s"
    }
]

for item in deduped_items:
    sql = f"INSERT INTO backlog_registry (serial_code, subject_category, title, context, tags, status, impact_level, unblocks_count, occurrence_count, customer_account_id, dependencies, reconnect_trigger) VALUES ('{item['serial_code']}', '{item['subject_category']}', '{item['title'].replace('\'', '\'\'')}', '{item['context'].replace('\'', '\'\'')}', {item['tags']}, '{item['status']}', '{item['impact_level']}', {item['unblocks_count']}, {item['occurrence_count']}, {subquery_tenant}, {item['dependencies']}, '{item['reconnect_trigger'].replace('\'', '\'\'')}') ON CONFLICT (serial_code) DO UPDATE SET subject_category = EXCLUDED.subject_category, title = EXCLUDED.title, context = EXCLUDED.context, tags = EXCLUDED.tags, status = EXCLUDED.status, impact_level = EXCLUDED.impact_level, unblocks_count = EXCLUDED.unblocks_count, occurrence_count = EXCLUDED.occurrence_count, customer_account_id = EXCLUDED.customer_account_id, dependencies = EXCLUDED.dependencies, reconnect_trigger = EXCLUDED.reconnect_trigger;"
    sql_lines.append(sql)

with open(out_sql_path, "w", encoding="utf-8") as f:
    f.write("\n".join(sql_lines))

print(f"[SUCCESS] Wrote {len(deduped_items)} deduplicated migration statements with SUBQUERY TENANT RESOLUTION into {out_sql_path}")
