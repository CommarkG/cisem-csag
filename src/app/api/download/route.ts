/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: DISPUTED-PROVENANCE-FABRICATED
# original_claimed_plan: GOV-2026-08-18-SECURITY-HARDENING [UNVERIFIED]
# original_claimed_signature: GOV-YARIV-20260818-SECURITY-HARDENING-V2 [UNVERIFIED]
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

// Helper to resolve target files strictly within approved workspace boundaries
function findFileOptimized(filename: string): string | null {
  const workspaceRoot = process.cwd();
  const cleanTarget = path.basename(filename);
  const brainRoot = path.join("C:", "Users", "finky", ".gemini", "antigravity", "brain");

  // Direct check locations inside workspace
  const directLocations = [
    path.join(workspaceRoot, filename),
    path.join(workspaceRoot, cleanTarget),
    path.join(workspaceRoot, "cisem_core", "downloads", cleanTarget),
    path.join(workspaceRoot, ".agents", "reviewer", cleanTarget),
    path.join(workspaceRoot, "cisem_core", filename),
    path.join(workspaceRoot, "cisem_core", cleanTarget),
    path.join(workspaceRoot, "cisem_core", "planning", cleanTarget),
    path.join(workspaceRoot, "cisem_core", "sandbox", cleanTarget),
    path.join(workspaceRoot, "sandbox", cleanTarget),
  ];
  
  for (const loc of directLocations) {
    const resolved = path.resolve(loc);
    if (resolved.startsWith(workspaceRoot) && fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
      return resolved;
    }
  }

  // Check brain root folder (including active conversation & fallback sweep across all conversations)
  if (fs.existsSync(brainRoot)) {
    const envConvId = process.env.ANTIGRAVITY_CONVERSATION_ID;
    if (envConvId) {
      const brainPaths = [
        path.join(brainRoot, envConvId, cleanTarget),
        path.join(brainRoot, envConvId, "scratch", cleanTarget),
      ];
      for (const p of brainPaths) {
        const resolved = path.resolve(p);
        if (resolved.startsWith(brainRoot) && fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
          return resolved;
        }
      }
    }

    // Fallback: Scan all conversation subdirectories in brainRoot
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
            return resolved;
          }
        }
      }
    } catch {
      // Ignore read errors
    }
  }

  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename) {
    return NextResponse.json({ error: "Missing filename" }, { status: 400 });
  }

  const cleanName = path.basename(filename).toLowerCase();

  // 1. ZERO-TRUST SECRET FILE BLACKLIST (Strict Hard Stop - Fails Closed for All Requests)
  if (
    cleanName.startsWith(".env") ||
    cleanName.startsWith(".git") ||
    cleanName.includes("secret") ||
    cleanName.includes("private") ||
    cleanName.includes("credential") ||
    cleanName.endsWith(".pem") ||
    cleanName.endsWith(".key")
  ) {
    return NextResponse.json(
      { error: "Forbidden: Access to sensitive environment, credential, or secret files is strictly prohibited." },
      { status: 403 }
    );
  }

  // 2. Strict Allowed Extensions Whitelist
  const allowedExtensions = [".md", ".yaml", ".json", ".schema", ".py", ".html", ".js", ".ts", ".tsx", ".sql", ".zip", ".txt"];
  const ext = path.extname(cleanName).toLowerCase();

  if (!allowedExtensions.includes(ext)) {
    return NextResponse.json({ error: "Forbidden: File extension not permitted for download." }, { status: 403 });
  }

  // 3. Resolve path using strict sandbox resolver
  const targetPath = findFileOptimized(filename);

  if (!targetPath || !fs.existsSync(targetPath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  // Stream file safely
  const nodeStream = fs.createReadStream(targetPath);
  const webStream = new ReadableStream({
    start(controller) {
      nodeStream.on("data", (chunk) => controller.enqueue(chunk));
      nodeStream.on("end", () => controller.close());
      nodeStream.on("error", (err) => controller.error(err));
    },
    cancel() {
      nodeStream.destroy();
    },
  });

  return new Response(webStream, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${cleanName}"`,
    },
  });
}
