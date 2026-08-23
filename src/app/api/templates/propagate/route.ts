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

/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: CISEM-IP-20260811-TEMPLATE-SYNC-ENGINE
# governor_signature: GOV-YARIV-20260811-TEMPLATE-SYNC-ENGINE-V1.0
# version: V1.2
# reasoning: |
#   API route for template propagation has been deprecated.
#   All synchronization is now handled statefully by the persistent Python background daemon
#   to prevent HTTP-level request timeouts.
#   Parent principles: AxiomsAndPrinciples V1.30 >AX-10000, >PR-11300, >AX-40000.
*/

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { 
      error: 'This HTTP API endpoint is deprecated. Template propagation is executed statefully by the template_propagation_scheduler.py background daemon.' 
    }, 
    { status: 410 }
  );
}

export async function GET(req: NextRequest) {
  return NextResponse.json(
    { 
      error: 'This HTTP API endpoint is deprecated. Template propagation is executed statefully by the template_propagation_scheduler.py background daemon.' 
    }, 
    { status: 410 }
  );
}
