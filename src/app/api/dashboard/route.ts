/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: PRE-RATIFICATION-LEGACY
# governor_signature: GOV-LEGACY-BASELINE
# status: PRE_RATIFICATION_LEGACY
# reasoning: |
#   File created prior to formal plan ratification governance. Preserved as legacy baseline.
*/
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { verifyTenantContext } from "../../../lib/tenant_context";

/**
 * CISEM Dashboard API Route
 * Bridges the local filesystem JSON files with the client-side Accountability Dashboard.
 *
 * @plan_id CISEM-IP-20260809-TENANT-CONTEXT-VALIDATION
 * @axioms_linked AX-10000, PR-11100, PR-11200
 */
function findLatestRegistryPath(rootDir: string): string {
  const coreDir = path.join(rootDir, "cisem_core");
  if (!fs.existsSync(coreDir)) {
    return path.join(coreDir, "2026-08-05__CISEM__Universal_Workspace_and_Accountability_Registry__V1.20.yaml");
  }
  const files = fs.readdirSync(coreDir);
  const candidates = files.filter(f => f.includes("Universal_Workspace_and_Accountability_Registry") && f.endsWith(".yaml"));
  if (candidates.length === 0) {
    return path.join(coreDir, "2026-08-05__CISEM__Universal_Workspace_and_Accountability_Registry__V1.20.yaml");
  }
  
  const sorted = candidates.map(f => {
    const match = f.match(/__V(\d+(?:\.\d+)*)\.yaml$/);
    const versionParts = match ? match[1].split(".").map(Number) : [0];
    return { file: f, versionParts };
  }).sort((a, b) => {
    const len = Math.max(a.versionParts.length, b.versionParts.length);
    for (let i = 0; i < len; i++) {
      const partA = a.versionParts[i] || 0;
      const partB = b.versionParts[i] || 0;
      if (partA !== partB) {
        return partB - partA;
      }
    }
    return 0;
  });
  
  return path.join(coreDir, sorted[0].file);
}

export async function GET(req: NextRequest) {
  try {
    const tenantContext = verifyTenantContext(req);
    if (!tenantContext) {
      return NextResponse.json({ error: "Unauthorized tenant session context. Cryptographic mismatch." }, { status: 401 });
    }

    const rootDir = process.cwd();
    
    // 1. Read Turn Counter
    const turnCounterPath = path.join(rootDir, "cisem_core", "cisem_turn_counter.json");
    let turnData = { current_turn: 0, turn_limit_ceiling: 15 };
    if (fs.existsSync(turnCounterPath)) {
      try {
        const content = fs.readFileSync(turnCounterPath, "utf-8");
        turnData = JSON.parse(content);
      } catch (e) {
        console.error("Error parsing turn counter JSON:", e);
      }
    }
    
    // 2. Read CAEL Status (for activation registry and queue)
    const caelStatusPath = path.join(rootDir, "cisem_core", "cael_status.json");
    let caelData = { activation_registry: [], active_packets_in_queue: [] };
    if (fs.existsSync(caelStatusPath)) {
      try {
        const content = fs.readFileSync(caelStatusPath, "utf-8");
        caelData = JSON.parse(content);
      } catch (e) {
        console.error("Error parsing cael status JSON:", e);
      }
    }
    
    // 3. Read ATV Report
    const atvReportPath = path.join(rootDir, "cisem_core", "sandbox", "atv_report.json");
    let atvData = { gaps_found: 0, beneficial_drifts_found: 0, atv_verdict: "NOMINAL", check_results: [], process_feedback: {} };
    if (fs.existsSync(atvReportPath)) {
      try {
        const content = fs.readFileSync(atvReportPath, "utf-8");
        atvData = JSON.parse(content);
      } catch (e) {
        console.error("Error parsing atv report JSON:", e);
      }
    }

    // 4. Read local WPTH template registry JSON payload
    const templateRegistryPath = path.join(rootDir, "cisem_core", "templates_registry.json");
    let templatePayload = { templates: [], pages: [] };
    if (fs.existsSync(templateRegistryPath)) {
      try {
        const content = fs.readFileSync(templateRegistryPath, "utf-8");
        templatePayload = JSON.parse(content);
      } catch (e) {
        console.error("Error parsing template registry JSON:", e);
      }
    }

    // 5. Read permission metadata for tier-aware access to the template hub and page catalog
    const permissionRegistryPath = path.join(rootDir, "cisem_core", "template_hub_permissions_registry.json");
    let permissionPayload = { version: "1.0.0", schema: "wpth_tier_permission_contract_v1", tiers: [] };
    if (fs.existsSync(permissionRegistryPath)) {
      try {
        const content = fs.readFileSync(permissionRegistryPath, "utf-8");
        permissionPayload = JSON.parse(content);
      } catch (e) {
        console.error("Error parsing permission registry JSON:", e);
      }
    }

    // 6. Dynamically parse the highest active version of the Accountability Registry
    const registryPath = findLatestRegistryPath(rootDir);
    let registeredFiles: any[] = [];
    if (fs.existsSync(registryPath)) {
      try {
        const lines = fs.readFileSync(registryPath, "utf-8").split("\n");
        let currentFile: any = null;
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("path:")) {
            if (currentFile && currentFile.path) {
              registeredFiles.push(currentFile);
            }
            currentFile = { 
              path: trimmed.split("path:")[1].trim().replace(/['"]/g, ""), 
              version: "1.0", 
              status: "DRAFT", 
              sha256: "",
              validation_metrics: {
                flow_completion: "PENDING",
                code_implementation: "PENDING",
                optimization: "PENDING",
                consolidation: "PENDING",
                permission_compliance: "PENDING"
              }
            };
          } else if (trimmed.startsWith("version:") && currentFile) {
            currentFile.version = trimmed.split("version:")[1].trim().replace(/['"]/g, "");
          } else if (trimmed.startsWith("status:") && currentFile) {
            currentFile.status = trimmed.split("status:")[1].trim().replace(/['"]/g, "");
          } else if (trimmed.startsWith("sha256:") && currentFile) {
            currentFile.sha256 = trimmed.split("sha256:")[1].trim().replace(/['"]/g, "");
          } else if (trimmed.startsWith("flow_completion:") && currentFile) {
            currentFile.validation_metrics.flow_completion = trimmed.split("flow_completion:")[1].trim().replace(/['"]/g, "");
          } else if (trimmed.startsWith("code_implementation:") && currentFile) {
            currentFile.validation_metrics.code_implementation = trimmed.split("code_implementation:")[1].trim().replace(/['"]/g, "");
          } else if (trimmed.startsWith("optimization:") && currentFile) {
            currentFile.validation_metrics.optimization = trimmed.split("optimization:")[1].trim().replace(/['"]/g, "");
          } else if (trimmed.startsWith("consolidation:") && currentFile) {
            currentFile.validation_metrics.consolidation = trimmed.split("consolidation:")[1].trim().replace(/['"]/g, "");
          } else if (trimmed.startsWith("permission_compliance:") && currentFile) {
            currentFile.validation_metrics.permission_compliance = trimmed.split("permission_compliance:")[1].trim().replace(/['"]/g, "");
          }
        }
        if (currentFile && currentFile.path) {
          registeredFiles.push(currentFile);
        }
      } catch (e) {
        console.error("Error parsing registry YAML:", e);
      }
    }

    return NextResponse.json({
      success: true,
      turnData: {
        current: turnData.current_turn,
        ceiling: turnData.turn_limit_ceiling
      },
      queue: caelData.active_packets_in_queue || [],
      registry: caelData.activation_registry || [],
      files: registeredFiles,
      templates: templatePayload.templates || [],
      pages: templatePayload.pages || [],
      permissions: permissionPayload,
      atv: {
        gaps: atvData.gaps_found || 0,
        drifts: atvData.beneficial_drifts_found || 0,
        verdict: atvData.atv_verdict || "NOMINAL",
        results: atvData.check_results || [],
        feedback: atvData.process_feedback || {}
      }
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || "Failed to load dashboard metrics"
    }, { status: 500 });
  }
}
