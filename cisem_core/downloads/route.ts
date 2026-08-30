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

async function handleRequest(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  const pathParts = params.path;
  const pathStr = pathParts.join("/");
  const searchParams = req.nextUrl.searchParams.toString();
  
  let originalCtxHeader = req.headers.get("x-tenant-context");
  
  // Verify tenant context at boundary
  // Setup request with computed x-tenant-context
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

    try {
      const safeFilename = path.basename(filename);
      const filePath = path.join(process.cwd(), "cisem_core", "downloads", safeFilename);
      
      if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }

      const fileBuffer = fs.readFileSync(filePath);
      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Disposition": `attachment; filename="${safeFilename}"`,
        },
      });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  // Proxy to FastAPI backend
  const targetUrl = `${BACKEND_URL}/${pathStr}`;
  const forwardHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (tenantCtx) {
    forwardHeaders["X-Tenant-ID"] = tenantCtx.tenantId;
    forwardHeaders["X-User-ID"] = tenantCtx.userId;
    forwardHeaders["X-User-Role"] = tenantCtx.role;
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader) forwardHeaders["Authorization"] = authHeader;

  try {
    const body = ["GET", "HEAD"].includes(req.method) ? undefined : await req.text();
    const backendRes = await fetch(targetUrl, {
      method: req.method,
      headers: forwardHeaders,
      body: body || undefined,
    });

    const contentType = backendRes.headers.get("Content-Type") || "application/json";
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
    return NextResponse.json({
      error: "Backend Unreachable: Python backend (port 8000) is offline.",
      path: pathStr,
      details: err.message
    }, { status: 502 });
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
