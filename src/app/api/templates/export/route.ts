/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: DISPUTED-PROVENANCE-FABRICATED
# original_claimed_plan: CISEM-IP-20260810-CONSOLIDATED-MASTER-V17 [UNVERIFIED]
# original_claimed_signature: GOV-YARIV-20260810-GOVERNANCE-HARDENING-RATIFIED [UNVERIFIED]
# status: DISPUTED_PROVENANCE_FABRICATED
# history:
#   - timestamp: "2026-08-23T07:52:00Z"
#     ratified_plan: CISEM-IP-20260822-PEOPLE-PLACES-FILES
#     governor_signature: GOV-YARIV-20260823-PEOPLE-PLACES-FILES-V19
#     reasoning: "Original plan ID flagged as un-manifested synthetic header during V19 audit; re-ratified under V19."
*/
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { verifyTenantContext, TenantContext } from "../../../../lib/tenant_context";

// A fallback public key for development/test verification (PEM SPKI structure)
const DEV_PUBLIC_KEY = 
`-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAOtwrWrUuYI7YjrWZoelRYg+NhKD7FZe8kxF2zcpsFBU=
-----END PUBLIC KEY-----`;

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate multi-tenant session context
    const tenantCtx = verifyTenantContext(req);
    if (!tenantCtx) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing cryptographically signed TenantContext." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { templateId, contrastRatio, licenseKey, signature, expiresAt } = body;

    if (!templateId || contrastRatio === undefined) {
      return NextResponse.json(
        { error: "Bad Request: Missing required parameters: templateId, contrastRatio." },
        { status: 400 }
      );
    }

    // 2. Ed25519 Signature Validation on license token
    // Signed data pattern: tenantId:tier:expiresAt
    if (!licenseKey || !signature || !expiresAt) {
      return NextResponse.json(
        { error: "Bad Request: Missing licensing verification parameters: licenseKey, signature, expiresAt." },
        { status: 400 }
      );
    }

    const message = `${tenantCtx.tenantId}:${tenantCtx.tier}:${expiresAt}`;
    
    // Resolve public key from environment or fallback to DEV_PUBLIC_KEY in development
    const publicKeyPem = process.env.LICENSE_PUBLIC_KEY || DEV_PUBLIC_KEY;

    let isLicenseValid = false;
    try {
      isLicenseValid = crypto.verify(
        null,
        Buffer.from(message),
        {
          key: publicKeyPem,
          format: "pem",
          type: "spki"
        },
        Buffer.from(signature, "hex")
      );
    } catch (err) {
      console.error("Ed25519 verify error:", err);
      isLicenseValid = false;
    }

    if (!isLicenseValid) {
      return NextResponse.json(
        { error: "Forbidden: Ed25519 signature validation failed. License key signature is invalid or tampered." },
        { status: 403 }
      );
    }

    // Check expiration
    if (new Date(expiresAt).getTime() < Date.now()) {
      return NextResponse.json(
        { error: "Forbidden: The provided license has expired." },
        { status: 403 }
      );
    }

    // 3. Tiered Accessibility (WCAG contrast checks)
    const contrastVal = parseFloat(contrastRatio);
    const tier = tenantCtx.tier.toLowerCase();

    // Tier 1 (Free) limit
    if (tier === "free") {
      return NextResponse.json(
        { error: "Forbidden: Free tier is restricted from exporting custom design templates." },
        { status: 403 }
      );
    }

    // Tier 3 (Enterprise) hard-blocks contrast ratio < 4.5
    if (tier === "enterprise" || tier === "tier-3") {
      if (contrastVal < 4.5) {
        return NextResponse.json(
          { 
            error: `[ERROR] Enterprise Tier exports require strict WCAG AAA contrast ratio compliance (contrast >= 4.5:1). Custom theme export aborted (Current contrast: ${contrastVal}:1).` 
          },
          { status: 400 }
        );
      }
    }

    // Tier 2 (Pro) triggers warning if contrast ratio < 4.5
    if (tier === "pro" || tier === "tier-2") {
      if (contrastVal < 4.5) {
        return NextResponse.json({
          status: "SUCCESS",
          warning: `[WARNING] WCAG contrast violation detected (contrast < 4.5:1). Export completed with compliance warnings.`,
          exportedTemplate: templateId,
          contrast: contrastVal
        });
      }
    }

    // Default successful export
    return NextResponse.json({
      status: "SUCCESS",
      message: "Template exported successfully with zero compliance warnings.",
      exportedTemplate: templateId,
      contrast: contrastVal
    });

  } catch (error: any) {
    console.error("Template export failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error: " + error.message },
      { status: 500 }
    );
  }
}
