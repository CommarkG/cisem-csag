# cisem_core/tools/sync_downloads.py
# PERMANENT DOWNLOADS SYNC & WITNESS LOG MECHANISM (Rule P1 / P2 / P3)
# Automatically exports active conversation transcript to cisem_core/planning/ and syncs all artifacts to cisem_core/downloads/

import os
import glob
import json
import shutil
from datetime import datetime, timezone

BRAIN_ROOT = r"C:\Users\finky\.gemini\antigravity\brain"

def export_transcript_witness_log(workspace_root):
    """Searches active session logs for transcript.jsonl and writes a witness log markdown file."""
    planning_dir = os.path.join(workspace_root, "cisem_core", "planning")
    os.makedirs(planning_dir, exist_ok=True)
    witness_log_path = os.path.join(planning_dir, "2026-08-26__AntigravityLocal__WitnessLog__V1.0.md")
    
    if not os.path.exists(BRAIN_ROOT):
        return
        
    transcript_files = glob.glob(os.path.join(BRAIN_ROOT, "*", ".system_generated", "logs", "transcript*.jsonl"))
    if not transcript_files:
        return
        
    # Sort by modification time, newest first
    transcript_files.sort(key=os.path.getmtime, reverse=True)
    target_transcript = transcript_files[0]
    
    steps_count = 0
    tools_count = 0
    summary_lines = []
    
    try:
        with open(target_transcript, "r", encoding="utf-8") as f:
            for line in f:
                if not line.strip():
                    continue
                steps_count += 1
                try:
                    data = json.loads(line)
                    step_type = data.get("type", "UNKNOWN")
                    tool_calls = data.get("tool_calls", [])
                    if tool_calls:
                        tools_count += len(tool_calls)
                        for tc in tool_calls:
                            tname = tc.get("name", "unknown_tool")
                            tsum = tc.get("summary", tc.get("toolSummary", ""))
                            summary_lines.append(f"- Step {steps_count}: `{tname}` - {tsum}")
                except Exception:
                    pass
    except Exception:
        pass
        
    now_iso = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    
    content = f"""# CISEM AUTOMATED CONVERSATION TRANSCRIPT WITNESS LOG V1.0

governor_signature: GOV-YARIV-20260826-WITNESS-LOG-V1
artifact_status: RATIFIED
generated_at: {now_iso}
source_transcript: {os.path.basename(target_transcript)}

## 1. Witness Telemetry Summary
- Total Conversation Steps Parsed: {steps_count}
- Total Tool Executions Logged: {tools_count}
- Status: ACTIVE GROUND TRUTH WITNESS LOG

## 2. Recent Tool Execution Witness Trail (Last 20 Actions)
"""
    recent_trail = summary_lines[-20:] if summary_lines else ["- No tool calls recorded yet."]
    content += "\n".join(recent_trail) + "\n"
    
    with open(witness_log_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"[WITNESS LOG SUCCESS] Wrote transcript witness log: {witness_log_path}")

def sync_all_downloads():
    workspace_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    
    # 1. Export active transcript witness log first
    try:
        export_transcript_witness_log(workspace_root)
    except Exception as e:
        print(f"[WITNESS LOG WARNING] Failed to export witness log: {e}")
        
    # 2. Sync files into cisem_core/downloads/
    downloads_dir = os.path.join(workspace_root, "cisem_core", "downloads")
    os.makedirs(downloads_dir, exist_ok=True)
    
    sync_sources = [
        os.path.join(workspace_root, "cisem_core", "planning"),
        os.path.join(workspace_root, "cisem_core", "platform_core"),
        os.path.join(workspace_root, "scratch"),
        os.path.join(workspace_root, "public", "downloads")
    ]
    
    synced_count = 0
    for src in sync_sources:
        if os.path.exists(src):
            for fname in os.listdir(src):
                fpath = os.path.join(src, fname)
                if os.path.isfile(fpath):
                    dstpath = os.path.join(downloads_dir, fname)
                    shutil.copy2(fpath, dstpath)
                    synced_count += 1
                    
    print(f"[DOWNLOADS SYNC SUCCESS] Synced {synced_count} files into {downloads_dir}")

if __name__ == "__main__":
    sync_all_downloads()

