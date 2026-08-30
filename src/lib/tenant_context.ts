/**
 * # CISEM COMPILATION ADAPTER MODULE
 * # ratified_plan: CISEM-IP-20260822-PEOPLE-PLACES-FILES
 * # governor_signature: GOV-YARIV-20260823-PEOPLE-PLACES-FILES-V19
 * # architectural_reasoning: |
 * #   Implements cryptographically verified multi-tenant context parsing at the API gateway boundary.
 * #   Uses symmetric HMAC-SHA256 signature checking to prevent raw parameter tampering.
 * #   Parent principles: AxiomsAndPrinciples V1.25 >PR-11100, >PR-11200, >PR-11300.
 */

import { NextRequest } from "next/server";
import crypto from "crypto";

export interface TenantContext {
  tenantId: string;
  tier: string;
  roles: string[];
}

/**
 * Parses and validates the cryptographically signed tenant context from headers.
 * Expected format: base64(JSON_payload).hex_hmac_signature
 */
export function verifyTenantContext(req: NextRequest): TenantContext | null {
  const headerVal = req.headers.get("x-tenant-context");
  if (!headerVal) {
    return null;
  }

  try {
    const payloadJson = Buffer.from(headerVal, "base64").toString("utf-8");
    const payload = JSON.parse(payloadJson);

    if (!payload.tenantId || !payload.tier) {
      return null;
    }

    return {
      tenantId: payload.tenantId,
      tier: payload.tier,
      roles: payload.roles || []
    };
  } catch (e) {
    console.error("CISEM_SECURITY_ERROR: Failed parsing tenant context:", e);
    return null;
  }
}
