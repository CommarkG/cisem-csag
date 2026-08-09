import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * CISEM Dashboard API Route
 * Bridges the local filesystem JSON files with the client-side Accountability Dashboard.
 * Parses cael_status.json, atv_report.json, and Registry V1.16.yaml.
 *
 * @plan_id CISEM-IP-20260809-ACCOUNTABILITY-DASHBOARD
 * @axioms_linked AX-10000, PR-13980, PR-13990
 */
export async function GET() {
  try {
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

    // 4. Parse Registry V1.16.yaml for files
    const registryPath = path.join(rootDir, "cisem_core", "2026-08-05__CISEM__Universal_Workspace_and_Accountability_Registry__V1.16.yaml");
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
            currentFile = { path: trimmed.split("path:")[1].trim().replace(/['"]/g, ""), version: "1.0", status: "DRAFT", sha256: "" };
          } else if (trimmed.startsWith("version:") && currentFile) {
            currentFile.version = trimmed.split("version:")[1].trim().replace(/['"]/g, "");
          } else if (trimmed.startsWith("status:") && currentFile) {
            currentFile.status = trimmed.split("status:")[1].trim().replace(/['"]/g, "");
          } else if (trimmed.startsWith("sha256:") && currentFile) {
            currentFile.sha256 = trimmed.split("sha256:")[1].trim().replace(/['"]/g, "");
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
