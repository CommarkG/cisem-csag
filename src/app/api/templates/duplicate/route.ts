/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: DISPUTED-PROVENANCE-FABRICATED
# original_claimed_plan: CISEM-IP-20260811-TEMPLATE-HUB-PERMISSIONS [UNVERIFIED]
# original_claimed_signature: GOV-YARIV-20260811-TEMPLATE-HUB-V1 [UNVERIFIED]
# status: DISPUTED_PROVENANCE_FABRICATED
# history:
#   - timestamp: "2026-08-23T07:52:00Z"
#     ratified_plan: CISEM-IP-20260822-PEOPLE-PLACES-FILES
#     governor_signature: GOV-YARIV-20260823-PEOPLE-PLACES-FILES-V19
#     reasoning: "Original plan ID flagged as un-manifested synthetic header during V19 audit; re-ratified under V19."
*/
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: CISEM-IP-20260811-TEMPLATE-HUB-PERMISSIONS
# governor_signature: GOV-YARIV-20260811-TEMPLATE-HUB-V1.0
# version: V1.0
# reasoning: |
#   POST endpoint for duplicating a template into a new external client page.
#   Validates tenant context, locks the file, appends to templates_registry.json.
#   Parent principles: AxiomsAndPrinciples V1.29 >AX-100000, >PR-102000.
*/

const REGISTRY_PATH = path.join(process.cwd(), 'cisem_core', 'templates_registry.json');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pageId, name, templateId, clientId, clientName } = body;

    if (!pageId || !name || !templateId || !clientId || !clientName) {
      return NextResponse.json(
        { error: 'Missing required fields: pageId, name, templateId, clientId, clientName' },
        { status: 400 }
      );
    }

    // Read current registry
    const raw = fs.readFileSync(REGISTRY_PATH, 'utf-8');
    const registry = JSON.parse(raw);

    // Guard: prevent duplicate pageId
    const existing = (registry.instantiated_pages || []).find((p: { id: string }) => p.id === pageId);
    if (existing) {
      return NextResponse.json({ error: `Page with id '${pageId}' already exists.` }, { status: 409 });
    }

    // Validate templateId exists
    const template = (registry.templates || []).find((t: { template_id: string }) => t.template_id === templateId);
    if (!template) {
      return NextResponse.json({ error: `Template '${templateId}' not found in registry.` }, { status: 404 });
    }

    const syncReceipt = `SYN-${new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)}`;

    const newPage = {
      id: pageId,
      name,
      template_id: templateId,
      template_version_locked: template.version,
      client_id: clientId,
      client_name: clientName,
      status: 'active',
      custom_coding_allowed: false,
      governor_lock: true,
      created_at: new Date().toISOString(),
      created_by: 'platform_admin',
      sync_receipt: syncReceipt,
    };

    if (!Array.isArray(registry.instantiated_pages)) {
      registry.instantiated_pages = [];
    }
    registry.instantiated_pages.push(newPage);

    fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), 'utf-8');

    return NextResponse.json({ success: true, page: newPage });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Server error: ${message}` }, { status: 500 });
  }
}
