#!/usr/bin/env python3
"""
# CISEM CODE HEADER -- MANDATORY
# ratified_plan: CISEM-IP-20260822-EXECUTION-WRAPPER
# governor_signature: GOV-YARIV-20260822-EXECUTION-WRAPPER-V1.0
# version: V1.0
# reasoning: |
#   Guarded command execution wrapper that runs a child process, flushes log handles,
#   and atomically writes last_execution.json only after termination to eliminate
#   reporting divergence.
"""

import sys
import os
import json
import subprocess
import time
from datetime import datetime, timezone

def run_guarded():
    if len(sys.argv) < 2:
        print("Usage: python run_guarded.py <command_string>")
        sys.exit(1)

    cmd_str = sys.argv[1]
    started_at = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    telemetry_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "..", "scratch", "telemetry")
    logs_dir = os.path.join(telemetry_dir, "logs")
    os.makedirs(logs_dir, exist_ok=True)

    timestamp_str = str(int(time.time()))
    log_filename = f"task_{timestamp_str}.log"
    log_filepath = os.path.join(logs_dir, log_filename)
    json_filepath = os.path.join(telemetry_dir, "last_execution.json")
    tmp_json_filepath = os.path.join(telemetry_dir, "last_execution.json.tmp")

    # Execute process
    proc = subprocess.Popen(
        cmd_str,
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        encoding="utf-8",
        errors="replace"
    )

    log_lines = []
    with open(log_filepath, "w", encoding="utf-8") as f_log:
        for line in proc.stdout:
            f_log.write(line)
            f_log.flush()
            log_lines.append(line)
            sys.stdout.write(line)
            sys.stdout.flush()

    proc.wait()
    exit_code = proc.returncode
    completed_at = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    # Atomic write to last_execution.json
    telemetry_payload = {
        "command": cmd_str,
        "exit_code": exit_code,
        "started_at": started_at,
        "completed_at": completed_at,
        "log_file": log_filepath,
        "total_log_lines": len(log_lines)
    }

    with open(tmp_json_filepath, "w", encoding="utf-8") as f_tmp:
        json.dump(telemetry_payload, f_tmp, indent=2)
        f_tmp.flush()
        os.fsync(f_tmp.fileno())

    os.replace(tmp_json_filepath, json_filepath)
    print(f"\n[run_guarded] Process terminated with exit code {exit_code}. Telemetry saved to {json_filepath}")
    sys.exit(exit_code)

if __name__ == "__main__":
    run_guarded()
