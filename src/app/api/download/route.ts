/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: CISEM-IP-20260825-MASTER-CONSOLIDATED-V2
# governor_signature: GOV-RATIFIED-2026-08-25-MASTER-V2
# status: RATIFIED_IMPLEMENTATION
# reasoning: |
#   Fail-safe local download API route serving files securely from workspace boundaries.
# axioms_linked:
#   - PR-11100
#   - PR-11400
#   - AX-100000
*/
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");

    if (!filename) {
      return NextResponse.json({ error: "Missing filename" }, { status: 400 });
    }

    const cleanName = path.basename(filename);
    const cleanLower = cleanName.toLowerCase();

    // 1. Secret file filter
    if (
      cleanLower.startsWith(".env") ||
      cleanLower.startsWith(".git") ||
      cleanLower.includes("secret") ||
      cleanLower.includes("private") ||
      cleanLower.includes("credential") ||
      cleanLower.endsWith(".pem") ||
      cleanLower.endsWith(".key")
    ) {
      return NextResponse.json(
        { error: "Forbidden: Access to sensitive environment, credential, or secret files is strictly prohibited." },
        { status: 403 }
      );
    }

    // 2. Allowed extensions
    const allowedExtensions = [".md", ".yaml", ".json", ".schema", ".py", ".html", ".js", ".ts", ".jsx", ".tsx", ".sql", ".zip", ".txt"];
    const ext = path.extname(cleanLower);

    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json({ error: "Forbidden: File extension not permitted for download." }, { status: 403 });
    }

    // 3. Search target file locations
    const workspaceRoot = process.cwd();
    const brainRoot = path.join("C:", "Users", "finky", ".gemini", "antigravity", "brain");

    const candidateLocations = [
      path.join(workspaceRoot, "cisem_core", "downloads", cleanName),
      path.join(workspaceRoot, "cisem_core", "planning", cleanName),
      path.join(workspaceRoot, "cisem_core", "sandbox", cleanName),
      path.join(workspaceRoot, "src", "components", "views", cleanName),
      path.join(workspaceRoot, "src", "config", "schemas", cleanName),
      path.join(workspaceRoot, filename),
      path.join(workspaceRoot, cleanName),
      path.join(brainRoot, "f9d83031-b7e1-42a3-adc3-5130cf5cb069", cleanName),
      path.join(brainRoot, "f9d83031-b7e1-42a3-adc3-5130cf5cb069", "scratch", cleanName),
    ];

    let targetPath: string | null = null;
    for (const loc of candidateLocations) {
      const resolved = path.resolve(loc);
      if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
        targetPath = resolved;
        break;
      }
    }

    if (!targetPath) {
      return NextResponse.json({ error: `File not found: ${cleanName}` }, { status: 404 });
    }

    // 4. Return Uint8Array binary buffer response
    const fileBuffer = fs.readFileSync(targetPath);
    const uint8Data = new Uint8Array(fileBuffer);

    return new NextResponse(uint8Data, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${cleanName}"`,
      },
    });
  } catch (err: any) {
    console.error("DOWNLOAD_API_ERROR:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
