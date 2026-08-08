import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Optimized helper to resolve target files directly without performing heavy recursive scans
function findFileOptimized(filename: string): string | null {
  const workspaceRoot = process.cwd();
  const cleanTarget = path.basename(filename);
  
  // Direct check locations in workspace
  // Direct check locations in workspace
  const directLocations = [
    path.join(workspaceRoot, filename),
    path.join(workspaceRoot, "cisem_core", filename),
    path.join(workspaceRoot, "cisem_core", "planning", filename),
    path.join(workspaceRoot, "cisem_core", "sandbox", filename),
    path.join(workspaceRoot, "sandbox", filename),
    "C:\\Users\\finky\\Desktop\\AntiGravity\\Sandbox Csag\\" + filename,
    "C:\\Users\\finky\\Desktop\\AntiGravity\\Sandbox Csag\\Marketing & Sales\\" + filename,
    "C:\\Users\\finky\\Desktop\\AntiGravity\\Sandbox Csag\\Marketing & Sales\\Image processing\\" + filename,
    path.join(workspaceRoot, cleanTarget),
    path.join(workspaceRoot, "cisem_core", cleanTarget),
    path.join(workspaceRoot, "cisem_core", "planning", cleanTarget),
    path.join(workspaceRoot, "cisem_core", "sandbox", cleanTarget),
    path.join(workspaceRoot, "sandbox", cleanTarget),
  ];
  
  for (const loc of directLocations) {
    if (fs.existsSync(loc) && fs.statSync(loc).isFile()) {
      return loc;
    }
  }

  // Check brain root folder
  const brainRoot = "C:\\Users\\finky\\.gemini\\antigravity\\brain";
  if (fs.existsSync(brainRoot)) {
    // 0. Extract conversation UUID from filename if present
    const uuidMatch = filename.match(/\b([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\b/i);
    if (uuidMatch) {
      const convId = uuidMatch[1];
      const brainPaths = [
        brainRoot + "\\" + convId + "\\" + cleanTarget,
        brainRoot + "\\" + convId + "\\scratch\\" + cleanTarget,
      ];
      for (const p of brainPaths) {
        if (fs.existsSync(p) && fs.statSync(p).isFile()) {
          return p;
        }
      }
    }

    // 1. Direct check using conversation ID from environment
    const envConvId = process.env.ANTIGRAVITY_CONVERSATION_ID;
    if (envConvId) {
      const directBrainPaths = [
        brainRoot + "\\" + envConvId + "\\" + cleanTarget,
        brainRoot + "\\" + envConvId + "\\scratch\\" + cleanTarget,
      ];
      for (const p of directBrainPaths) {
        if (fs.existsSync(p) && fs.statSync(p).isFile()) {
          return p;
        }
      }
    }
    
    // 2. Direct checks in active brain subdirectories sorted by modification time
    try {
      const entries = fs.readdirSync(brainRoot, { withFileTypes: true });
      const dirs = entries
          .filter(e => e.isDirectory() && e.name !== "scratch" && e.name !== "tempmediaStorage")
          .map(e => {
            const fullPath = brainRoot + "\\" + e.name;
            return { name: e.name, path: fullPath, mtime: fs.statSync(fullPath).mtimeMs };
          })
          .sort((a, b) => b.mtime - a.mtime);
         
      for (const d of dirs) {
        const brainPaths = [
          d.path + "\\" + cleanTarget,
          d.path + "\\scratch\\" + cleanTarget,
        ];
        for (const p of brainPaths) {
          if (fs.existsSync(p) && fs.statSync(p).isFile()) {
            return p;
          }
        }
      }
    } catch (e) {}
  }
  
  // Fallback recursive helper restricted to code and planning folders
  function findFileRecursively(dir: string, targetName: string): string | null {
    if (!fs.existsSync(dir)) return null;
    const queue = [dir];
    while (queue.length > 0) {
      const currentDir = queue.shift()!;
      try {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(currentDir, entry.name);
          if (entry.isDirectory()) {
            if (![".git", "node_modules", ".next", "out"].includes(entry.name)) {
              queue.push(fullPath);
            }
          } else if (entry.isFile()) {
            if (entry.name === targetName || fullPath.endsWith(targetName)) {
              return fullPath;
            }
          }
        }
      } catch (e) {}
    }
    return null;
  }

  // Scan workspace subfolders only
  const fallbackDirs = [
    path.join(workspaceRoot, "cisem_core"),
    path.join(workspaceRoot, "src")
  ];
  for (const dir of fallbackDirs) {
    const found = findFileRecursively(dir, cleanTarget);
    if (found) return found;
  }

  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename) {
    return NextResponse.json({ error: "Missing filename" }, { status: 400 });
  }

  // Security: only allow safe document and configuration extensions
  const allowedExtensions = [".md", ".yaml", ".json", ".schema", ".py", ".html", ".js", ".ts", ".tsx", ".sql", ".zip", ".local"];
  const ext = path.extname(filename).toLowerCase();
  const base = path.basename(filename).toLowerCase();
  
  const allowedFilenames = [".env", ".gitignore", ".env.local"];
  
  if (!allowedExtensions.includes(ext) && !allowedFilenames.includes(base)) {
    return NextResponse.json({ error: "Forbidden file extension" }, { status: 403 });
  }

  const workspaceRoot = process.cwd();
  const cleanName = path.basename(filename);

  // Resolve path using optimized file resolver
  let targetPath = findFileOptimized(filename);

  if (!targetPath || !fs.existsSync(targetPath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  // Use Node ReadStream converted to Web ReadableStream for zero-memory streaming
  const nodeStream = fs.createReadStream(targetPath);
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
      "Content-Disposition": `attachment; filename="${cleanName}"`
    }
  });
}
