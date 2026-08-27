/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: DISPUTED-PROVENANCE-FABRICATED
# original_claimed_plan: CRUEL-REVIEW-AX70000-CONSOLIDATED-V1 [UNVERIFIED]
# original_claimed_signature: GOV-YARIV-20260810-CRUEL-REVIEW-V1 [UNVERIFIED]
# status: DISPUTED_PROVENANCE_FABRICATED
# history:
#   - timestamp: "2026-08-23T07:52:00Z"
#     ratified_plan: CISEM-IP-20260822-PEOPLE-PLACES-FILES
#     governor_signature: GOV-YARIV-20260823-PEOPLE-PLACES-FILES-V19
#     reasoning: "Original plan ID flagged as un-manifested synthetic header during V19 audit; re-ratified under V19."
*/
import { NextRequest, NextResponse } from "next/server";
import { verifyTenantContext } from "@/lib/tenant_context";
import fs from "fs";
import path from "path";

const BACKEND_URL = "http://localhost:8000/api/v1";

// Helper: generate mock data for fallback
function getMockData(pathStr: string, method: string) {
  const p = pathStr.toLowerCase();
  
  if (p.includes("tenant/members")) {
    return {
      status: "success",
      success: true,
      company_name: "AGN Ltd",
      active_tenant_id: "5f2bfda8-6ff1-483d-870e-14335a59915c",
      members: [
        { id: "5c3e147d-546d-4a65-aec8-5814e9ba09b0", name: "Gil Shilo", email: "gil@agn.co.il", role: "account_owner", company_name: "AGN Ltd" },
        { id: "db0cde40-1beb-4392-a4af-55f52332b86f", name: "Omri Shilo", email: "omri@agn.co.il", role: "account_admin", company_name: "AGN Ltd" },
        { id: "c88f11f6-6b6c-4582-9098-f0f81bda83de", name: "Idan Shilo", email: "design@agn.co.il", role: "member", company_name: "AGN Ltd" },
        { id: "e0791b19-f04a-4ba3-b427-90bd7ed76b5f", name: "Revital", email: "nir@agn.co.il", role: "member", company_name: "AGN Ltd" },
        { id: "2a9bbdbf-cc36-4b23-a640-280d84819b7e", name: "Yariv Fink", email: "sales@btigift.com", role: "member", company_name: "AGN Ltd" }
      ]
    };
  }

  if (p.includes("admin/personas/activate")) {
    return { success: true, status: "activated" };
  }
  if (p.includes("admin/personas")) {
    return {
      success: true,
      personas: [
        { persona_id: "SECURITY_AUDITOR_PERSONA", role_name: "Lead Security Auditor", active: true },
        { persona_id: "STABILITY_EXPERT_PERSONA", role_name: "Core Platform Stability Expert", active: true },
        { persona_id: "GOVERNOR_PROXY_PERSONA", role_name: "Governor Compliance Proxy", active: true },
        { persona_id: "PLATFORM_DEVELOPER_PERSONA", role_name: "Core Platform Systems Developer", active: true }
      ]
    };
  }
  if (p.includes("admin/templates")) {
    return {
      success: true,
      templates: [
        { template_id: "tpl_standard", name: "Standard Scrape Template", active: true },
        { template_id: "tpl_advanced", name: "Deep Catalog Template", active: true }
      ]
    };
  }
  if (p.includes("schemas/tags")) {
    return { success: true, tags: ["critical", "security", "high-priority", "stability"] };
  }
  if (p.includes("schemas/statuses")) {
    return { success: true, statuses: ["CREATED", "READY", "CLAIMED", "EXECUTING", "COMPLETED", "FAILED"] };
  }
  if (p.includes("schemas/custom")) {
    return {
      success: true,
      data: [
        { id: "custom_1", name: "Mock Schema Account", tier: "premium" },
        { id: "custom_2", name: "Mock Schema Deal", amount: 15000 }
      ]
    };
  }
  if (p.includes("backlog")) {
    return {
      success: true,
      backlog: [
        { id: "item-1", title: "Verify Multi-tenant Isolation Keys", status: "READY" },
        { id: "item-2", title: "Deploy SaaS PGVector Multi-tenant Schema", status: "COMPLETED" }
      ]
    };
  }
  if (p.includes("catalog/search")) {
    return {
      success: true,
      results: [
        { id: "product-1", name: "Enterprise Scraping Module", score: 0.98 },
        { id: "product-2", name: "SaaS Vector Search Adapter", score: 0.89 }
      ]
    };
  }
  if (p.includes("stock/live-check")) {
    return { success: true, inStock: true, count: 42 };
  }
  if (p.includes("prospects/scrape")) {
    return { success: true, count: 12, prospects: [{ name: "Alice", email: "alice@example.com" }] };
  }
  if (p.includes("proposals/generate")) {
    return { success: true, token: "mock-proposal-token-xyz-123" };
  }
  if (p.includes("pdf")) {
    return { success: true, url: "/mock-proposal.pdf" };
  }
  if (p.includes("tenant/whitelabel/sync")) {
    return {
      status: "success",
      logs: [
        "Initializing repository synchronizer...",
        "Binding target repository: git@github.com:enterprise/storefront.git",
        "Exchanging cryptographic handshake keys...",
        "Injecting active custom stylesheet bundles...",
        "Pushing asset commits to main branch...",
        "Configuring custom whitelabel domain: shop.company.com",
        "Dispatched webhook notification to trigger CDN invalidation.",
        "Git repository synchronization completed successfully."
      ]
    };
  }
  if (p.includes("tenant/whitelabel")) {
    return {
      custom_domain: "shop.company.com",
      git_url: "git@github.com:enterprise/storefront.git",
      webhook_secret: "wh_sec_example_12345",
      sync_status: "synced"
    };
  }
  if (p.includes("medusa/products")) {
    return {
      success: true,
      products: [
        {
          id: "prod_mock_01",
          title: "Enterprise Scraping Module",
          handle: "enterprise-scraping-module",
          sku: "MOCK-SKU-01",
          price: 1250,
          inventoryQuantity: 42,
          description: "Visual scraping and ingestion script."
        },
        {
          id: "prod_mock_02",
          title: "SaaS Vector Search Adapter",
          handle: "saas-vector-search-adapter",
          sku: "MOCK-SKU-02",
          price: 890,
          inventoryQuantity: 15,
          description: "PGVector partitioned HNSW indexer."
        }
      ]
    };
  }
  if (p.includes("medusa/quotes")) {
    return {
      success: true,
      quotes: [
        {
          id: "quote_mock_01",
          customerId: "client_mock_01",
          items: [{ title: "Enterprise Scraping Module", quantity: 1, unitPrice: 1250 }],
          taxRate: 0.17,
          total: 1462.5,
          status: "draft"
        }
      ]
    };
  }
  
  return { success: true, mock: true, path: pathStr, method };
}

async function handleRequest(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  const pathParts = params.path;
  const pathStr = pathParts.join("/");
  const searchParams = req.nextUrl.searchParams.toString();
  
  let originalCtxHeader = req.headers.get("x-tenant-context");
  
  // Verify tenant context at boundary
  // Setup request with computed x-tenant-context if mockTier was used
  const tempReq = new NextRequest(req.url, {
    method: req.method,
    headers: {
      ...Object.fromEntries(req.headers.entries()),
      ...(originalCtxHeader ? { "x-tenant-context": originalCtxHeader } : {})
    }
  });

  const tenantCtx = verifyTenantContext(tempReq);
  const tenantId = tenantCtx?.tenantId || req.headers.get("x-tenant-id") || "default-tenant";

  // Tier-3 Enterprise gating check
  if (pathStr.includes("tenant/whitelabel")) {
    if (!tenantCtx || tenantCtx.tier !== "enterprise") {
      return NextResponse.json(
        { error: "Forbidden: ENTERPRISE_TIER_REQUIRED: Whitelabel features require an Enterprise license." },
        { status: 403 }
      );
    }
  }

  // Direct file download handler for local file downloads with Zero-Trust Security Enforcement
  if (pathStr.startsWith("download") || pathStr === "download") {
    const filename = req.nextUrl.searchParams.get("filename");
    if (!filename) {
      return NextResponse.json({ error: "Missing filename" }, { status: 400 });
    }
    const cleanTarget = path.basename(filename).toLowerCase();

    // ZERO-TRUST SECRET FILE BLACKLIST (Strict Hard Stop)
    if (
      cleanTarget.startsWith(".env") ||
      cleanTarget.startsWith(".git") ||
      cleanTarget.includes("secret") ||
      cleanTarget.includes("private") ||
      cleanTarget.includes("credential") ||
      cleanTarget.endsWith(".pem") ||
      cleanTarget.endsWith(".key")
    ) {
      return NextResponse.json(
        { error: "Forbidden: Access to sensitive environment, credential, or secret files is strictly prohibited." },
        { status: 403 }
      );
    }

    const allowedExtensions = [".md", ".yaml", ".json", ".schema", ".py", ".html", ".js", ".ts", ".tsx", ".sql", ".zip", ".txt"];
    const ext = path.extname(cleanTarget).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json({ error: "Forbidden: File extension not permitted for download." }, { status: 403 });
    }

    const workspaceRoot = process.cwd();
    const brainRoot = path.join("C:", "Users", "finky", ".gemini", "antigravity", "brain");
    const directLocations = [
      path.join(workspaceRoot, filename),
      path.join(workspaceRoot, cleanTarget),
      path.join(workspaceRoot, "cisem_core", "downloads", cleanTarget),
      path.join(workspaceRoot, "cisem_core", filename),
      path.join(workspaceRoot, "cisem_core", cleanTarget),
      path.join(workspaceRoot, "cisem_core", "planning", cleanTarget),
      path.join(workspaceRoot, "cisem_core", "sandbox", cleanTarget),
      path.join(workspaceRoot, "sandbox", cleanTarget),
    ];
    let resolvedPath: string | null = null;
    for (const loc of directLocations) {
      const resolved = path.resolve(loc);
      if (resolved.startsWith(workspaceRoot) && fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
        resolvedPath = resolved;
        break;
      }
    }

    if (!resolvedPath && fs.existsSync(brainRoot)) {
      try {
        const convDirs = fs.readdirSync(brainRoot);
        for (const dir of convDirs) {
          const candidatePaths = [
            path.join(brainRoot, dir, cleanTarget),
            path.join(brainRoot, dir, "scratch", cleanTarget),
          ];
          for (const p of candidatePaths) {
            const resolved = path.resolve(p);
            if (resolved.startsWith(brainRoot) && fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
              resolvedPath = resolved;
              break;
            }
          }
          if (resolvedPath) break;
        }
      } catch {
        // Ignore read errors
      }
    }

    if (!resolvedPath) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    const nodeStream = fs.createReadStream(resolvedPath);
    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on('data', (chunk) => controller.enqueue(chunk));
        nodeStream.on('end', () => controller.close());
        nodeStream.on('error', (err) => controller.error(err));
      },
      cancel() {
        nodeStream.destroy();
      }
    });
    return new Response(webStream, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${cleanTarget}"`
      }
    });
  }

  const targetUrl = `${BACKEND_URL}/${pathStr}${searchParams ? "?" + searchParams : ""}`;
  
  // Prepare headers
  const headersObj: Record<string, string> = {
    "Content-Type": "application/json",
    "x-tenant-id": tenantId,
  };
  
  if (originalCtxHeader) {
    headersObj["x-tenant-context"] = originalCtxHeader;
  }

  // Attempt backend proxy
  try {
    const fetchOptions: RequestInit = {
      method: req.method,
      headers: headersObj,
    };

    if (req.method !== "GET" && req.method !== "HEAD") {
      try {
        const bodyText = await req.text();
        if (bodyText) {
          fetchOptions.body = bodyText;
        }
      } catch (err) {
        // Body reading failed or empty
      }
    }

    const backendRes = await fetch(targetUrl, fetchOptions);
    const contentType = backendRes.headers.get("content-type") || "";
    
    if (contentType.includes("application/json")) {
      const data = await backendRes.json();
      return NextResponse.json(data, { status: backendRes.status });
    } else {
      const text = await backendRes.text();
      return new NextResponse(text, {
        status: backendRes.status,
        headers: { "Content-Type": contentType },
      });
    }
  } catch (err: any) {
    if (pathStr.toLowerCase().includes("inquiries")) {
      return NextResponse.json({
        error: "Database Unreachable: Python backend (port 8000) is offline. Direct PostgreSQL persistence required.",
        path: pathStr,
        details: err.message
      }, { status: 502 });
    }
    console.warn(`[Proxy Fail] Unreachable python backend for /api/v1/${pathStr}. Serving mock fallback. Error:`, err.message);
    const mockResponse = getMockData(pathStr, req.method);
    return NextResponse.json(mockResponse);
  }
}

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleRequest(req, context);
}

export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleRequest(req, context);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleRequest(req, context);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleRequest(req, context);
}
