/**
 * # CISEM COMPILATION ADAPTER MODULE
 * # ratified_plan: CISEM-IP-20260809-TENANT-CONTEXT-VALIDATION
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
  const secret = process.env.TENANT_SIGNING_SECRET;
  const headerVal = req.headers.get("x-tenant-context");

  // Fallback for development if no signature and no secret is set
  if (!secret && !headerVal) {
    return {
      tenantId: "dev-tenant-1",
      tier: "enterprise",
      roles: ["admin", "developer"]
    };
  }

  if (!headerVal) {
    return null;
  }

  try {
    const parts = headerVal.split(".");
    if (parts.length !== 2) {
      return null;
    }

    const payloadBase64 = parts[0];
    const signature = parts[1];

    const hmac = crypto.createHmac("sha256", secret || "dev-fallback-secret-key-9999");
    hmac.update(payloadBase64);
    const expectedSignature = hmac.digest("hex");

    if (signature !== expectedSignature) {
      console.warn("CISEM_SECURITY_ALERT: Tenant context signature mismatch.");
      return null;
    }

    const payloadJson = Buffer.from(payloadBase64, "base64").toString("utf-8");
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
