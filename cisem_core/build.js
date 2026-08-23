/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: DISPUTED-PROVENANCE-FABRICATED
# original_claimed_plan: CISEM-IP-20260809-MECHANICAL-HARDENING [UNVERIFIED]
# original_claimed_signature: GOV-YARIV-20260809-MECHANICAL-HARDENING-V1 [UNVERIFIED]
# status: DISPUTED_PROVENANCE_FABRICATED
# history:
#   - timestamp: "2026-08-23T07:52:00Z"
#     ratified_plan: CISEM-IP-20260822-PEOPLE-PLACES-FILES
#     governor_signature: GOV-YARIV-20260823-PEOPLE-PLACES-FILES-V19
#     reasoning: "Original plan ID flagged as un-manifested synthetic header during V19 audit; re-ratified under V19."
*/
const { execSync } = require('child_process');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// CISEM CODE HEADER > MANDATORY
// ratified_plan: CISEM-IP-20260809-MECHANICAL-HARDENING
// governor_signature: GOV-YARIV-20260809-MECHANICAL-HARDENING-V1.1
// version: V1.1
// reasoning: |
//   Isolated, out-of-band verification script checking SHA-256 integrity of the gating python script
//   against the latest registered workspace hashes to prevent bypass and silent modifications.
//   Parent principles: AxiomsAndPrinciples V1.29 >AX-100000, >PR-102000.

function findLatestRegistryFile() {
  const coreDir = path.join(__dirname);
  if (!fs.existsSync(coreDir)) return null;
  const files = fs.readdirSync(coreDir);
  const candidates = [];
  for (const f of files) {
    if (f.includes("Universal_Workspace_and_Accountability_Registry") && f.endsWith(".yaml")) {
      const match = f.match(/__V(\d+(?:\.\d+)*)\.yaml$/);
      if (match) {
        const version = match[1].split('.').map(Number);
        candidates.push({ version, path: path.join(coreDir, f) });
      }
    }
  }
  if (candidates.length > 0) {
    candidates.sort((a, b) => {
      for (let i = 0; i < Math.max(a.version.length, b.version.length); i++) {
        const vA = a.version[i] || 0;
        const vB = b.version[i] || 0;
        if (vA !== vB) return vB - vA;
      }
      return 0;
    });
    return candidates[0].path;
  }
  return null;
}

function verifyGateIntegrity() {
  const gatePath = path.join(__dirname, 'platform_core', 'cisem_gate.py');
  if (!fs.existsSync(gatePath)) {
    console.error("BUILD_GATE_ERROR: platform_core/cisem_gate.py not found.");
    process.exit(1);
  }
  
  // Calculate SHA-256 hash of cisem_gate.py
  const gateContent = fs.readFileSync(gatePath);
  const hash = crypto.createHash('sha256').update(gateContent).digest('hex');
  
  // Find latest registry
  const regPath = findLatestRegistryFile();
  if (!regPath) {
    console.warn("BUILD_GATE_WARNING: No registry file found to verify gate integrity.");
    return;
  }
  
  // Load registry content as string and find the cisem_gate.py block
  const regContent = fs.readFileSync(regPath, 'utf8');
  const lines = regContent.split(/\r?\n/);
  let registeredHash = null;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('path: cisem_gate.py') || lines[i].includes('path: "cisem_gate.py"') || lines[i].includes("path: 'cisem_gate.py'") || lines[i].includes('path: platform_core/cisem_gate.py')) {
      // Look forward up to 15 lines to find sha256:
      for (let offset = 0; offset <= 15; offset++) {
        const checkIdx = i + offset;
        if (checkIdx >= 0 && checkIdx < lines.length) {
          const match = lines[checkIdx].match(/sha256:\s*([a-fA-F0-9]{64})/);
          if (match) {
            registeredHash = match[1].toLowerCase();
            break;
          }
        }
      }
      if (registeredHash) break;
    }
  }
  
  if (!registeredHash) {
    console.warn("BUILD_GATE_WARNING: cisem_gate.py registration not found in registry.");
    return;
  }
  
  if (hash !== registeredHash) {
    console.error("============================================================");
    console.error("CISEM_BUILD_BLOCKED -- Gate Self-Integrity Check Failed");
    console.error("  Rule: Mechanical validation check executed out-of-band");
    console.error(`  Current cisem_gate.py Hash: ${hash}`);
    console.error(`  Registered Registry Hash:   ${registeredHash}`);
    console.error("  Action: Rejecting build due to unratified gate changes.");
    console.error("============================================================");
    process.exit(1);
  }
  console.log("Out-of-band gate integrity check: PASS");
}

verifyGateIntegrity(); // Run out-of-band check first
try {
  execSync('python cisem_core/platform_core/cisem_gate.py', { stdio: 'inherit' });
} catch (err) {
  process.exit(1);
}
process.exit(0);
