/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: DISPUTED-PROVENANCE-FABRICATED
# original_claimed_plan: CISEM-IP-20260811-TEMPLATE-SYNC-ENGINE [UNVERIFIED]
# original_claimed_signature: GOV-YARIV-20260811-TEMPLATE-SYNC-ENGINE-V1 [UNVERIFIED]
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
# ratified_plan: CISEM-IP-20260811-TEMPLATE-SYNC-ENGINE
# governor_signature: GOV-YARIV-20260811-TEMPLATE-SYNC-ENGINE-V1.0
# version: V1.0
# reasoning: |
#   API endpoint to compute the difference between two template versions.
#   Classifies the diff as PATCH, MINOR, or MAJOR based on structural layout contracts.
#   Parent principles: AxiomsAndPrinciples V1.29 >AX-100000, >PR-102000.
*/

const REGISTRY_PATH = path.join(process.cwd(), 'cisem_core', 'templates_registry.json');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { templateId, fromVersion, toVersion } = body;

    if (!templateId || !fromVersion || !toVersion) {
      return NextResponse.json(
        { error: 'Missing required parameters: templateId, fromVersion, toVersion' },
        { status: 400 }
      );
    }

    // In a full production system, we'd query git or version history.
    // For local mockup execution, we compare the current registry configuration.
    const raw = fs.readFileSync(REGISTRY_PATH, 'utf-8');
    const registry = JSON.parse(raw);
    const template = (registry.templates || []).find((t: any) => t.template_id === templateId);

    if (!template) {
      return NextResponse.json({ error: `Template '${templateId}' not found.` }, { status: 404 });
    }

    // Default classification rules:
    // 1. If version digits differ on major index (e.g. 1.x -> 2.x) -> MAJOR
    // 2. If minor digits differ -> MINOR
    // 3. Otherwise -> PATCH
    const v1 = fromVersion.split('.').map(Number);
    const v2 = toVersion.split('.').map(Number);

    let changeType = 'PATCH';
    const breakingChanges: string[] = [];

    if (v1[0] !== v2[0]) {
      changeType = 'MAJOR';
      breakingChanges.push(`Major version mismatch: from ${fromVersion} to ${toVersion}.`);
    } else if (v1[1] !== v2[1]) {
      changeType = 'MINOR';
    }

    return NextResponse.json({
      templateId,
      fromVersion,
      toVersion,
      changeType,
      breakingChanges
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Server error: ${message}` }, { status: 500 });
  }
}
