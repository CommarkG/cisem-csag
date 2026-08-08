/**
 * CISEM Exchange Protocol (CXP) Cloud Orchestrator & Auditor
 * Version: 0.1
 * Platform: Google Apps Script (GAS)
 * Description: Polls Drive, validates packets, calls OpenAI to audit execution, and signs/appends events.
 */

// Source of Truth Metadata
const METADATA = {
  owner: "CISEM_GOVERNOR",
  canonical_location: "C:\\Users\\finky\\Desktop\\AntiGravity\\2026-08-05__GoogleAntigravity__Cxp__GasOrchestrator__V0.1.js",
  artifact_status: "DRAFT",
  maturity: "WORKING_DRAFT",
  version: "0.1",
  role_type: "CANONICAL_ORCHESTRATOR_SCRIPT"
};

// Configuration Constants
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const FOLDER_ID = "1dy0hixngOGeRhvLsvi5dEY9F3Y8pl8ct"; // Sync Exchange Folder

/**
 * Main loop: Polls the target Drive folder for active packets.
 */
function checkAndProcessExchangePackets() {
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const files = folder.getFiles();

  while (files.hasNext()) {
    const file = files.next();
    const name = file.getName();
    
    // Only process CXP YAML files
    if (name.startsWith("CXP__") && (name.endsWith(".yaml") || name.endsWith(".yml"))) {
      Logger.log("Processing exchange file: " + name);
      try {
        processPacketFile(file);
      } catch (err) {
        Logger.log("Error processing packet " + name + ": " + err.toString());
      }
    }
  }
}

/**
 * Parses, validates, and processes a single packet file.
 */
function processPacketFile(file) {
  let fileContent;
  const mimeType = file.getMimeType();

  if (mimeType === "application/vnd.google-apps.document") {
    const doc = DocumentApp.openById(file.getId());
    fileContent = doc.getBody().getText();
  } else {
    fileContent = file.getAs("text/plain").getDataAsString();
  }

  const packet = parseYaml(fileContent);

  if (!packet) {
    Logger.log("Failed to parse YAML content for file: " + file.getName());
    return;
  }

  const derivedView = packet.derived_view || {};
  const currentState = derivedView.current_state;

  Logger.log("Current derived state for packet: " + currentState);

  // Trigger Audit if local execution has successfully completed
  if (currentState === "COMPLETED") {
    Logger.log("Packet execution is completed. Triggering OpenAI Auditor...");
    executeOpenAiAudit(file, packet);
  }
}

/**
 * Calls the OpenAI completions API to audit the execution outputs against acceptance criteria.
 */
function executeOpenAiAudit(file, packet) {
  const scriptProperties = PropertiesService.getScriptProperties();
  const apiKey = scriptProperties.getProperty("OPENAI_API_KEY");

  if (!apiKey) {
    Logger.log("ERROR: OPENAI_API_KEY script property is missing. Skipping audit.");
    return;
  }

  // Dynamic model configuration logic (aligned with GEMINI.md V1.2 rule 4)
  let modelName = "gpt-4o"; // Standard recommendation
  const requestModel = getDeepValue(packet, "derived_view.execution_control.cloud_model.model");
  if (requestModel) {
    modelName = requestModel;
  } else {
    const envModel = scriptProperties.getProperty("OPENAI_MODEL");
    if (envModel) {
      modelName = envModel;
    }
  }

  Logger.log("Using auditor model: " + modelName);

  // Construct prompt containing intent, output, evidence, and acceptance criteria
  const execution = packet.immutable_request.execution || {};
  const governance = packet.immutable_request.governance || {};
  const response = packet.derived_view.response || {};

  const systemPrompt = "You are the CISEM Cloud Auditor agent. Your job is to verify that the local execution outputs (stdout/stderr/evidence) match the acceptance criteria, parameters, and intent of the requested packet. Output your response as a strict JSON block containing 'result' ('VERIFIED' or 'REJECTED') and 'rationale' (string explanation). Do not output other text.";

  const userPrompt = `
  Intent: ${execution.intent}
  Parameters: ${JSON.stringify(execution.parameters)}
  Acceptance Criteria: ${JSON.stringify(governance.acceptance_criteria)}
  
  Execution Response:
  Stdout: ${response.stdout}
  Stderr: ${response.stderr}
  Evidence: ${JSON.stringify(response.evidence)}
  `;

  const payload = {
    model: modelName,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.0,
    response_format: { type: "json_object" }
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + apiKey
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const apiResponse = UrlFetchApp.fetch(OPENAI_API_URL, options);
  const responseCode = apiResponse.getResponseCode();
  const responseText = apiResponse.getContentText();

  if (responseCode !== 200) {
    Logger.log("OpenAI API call failed with code " + responseCode + ": " + responseText);
    return;
  }

  const resultObj = JSON.parse(responseText);
  const contentText = resultObj.choices[0].message.content;
  const auditResult = JSON.parse(contentText); // Expects {result: "VERIFIED"|"REJECTED", rationale: "..."}

  Logger.log("Audit auditResult: " + JSON.stringify(auditResult));

  // Append new event and update the file
  appendAuditEvent(file, packet, auditResult);
}

/**
 * Appends the audit event to the packet file and transitions state to AUDITED.
 */
function appendAuditEvent(file, packet, auditResult) {
  const events = packet.event_stream || [];
  const seqNum = events.length + 1;
  const prevEventId = events[events.length - 1].event_id;
  const timestampStr = new Date().toISOString();

  const eventType = auditResult.result === "VERIFIED" ? "AUDIT_VERIFIED" : "AUDIT_REJECTED";
  const toState = auditResult.result === "VERIFIED" ? "AUDITED" : "FAILED";

  const auditEvent = {
    event_id: "CXP-EVT-20260805-000001-" + padZero(seqNum, 6),
    event_type: eventType,
    sequence_number: seqNum,
    previous_event_id: prevEventId,
    packet_id: packet.immutable_request.header.packet_id,
    actor: {
      identity: "CISEM_CLOUD_AUDITOR",
      role: "CLOUD_AUDITOR"
    },
    occurred_at: timestampStr,
    recorded_at: timestampStr,
    transition: {
      from_state: "COMPLETED",
      to_state: toState,
      transition_id: "CXP-T-" + padZero(seqNum, 3)
    },
    payload: {
      rationale: auditResult.rationale
    }
  };

  // Append event
  packet.event_stream.push(auditEvent);
  
  // Update projections
  packet.derived_view.current_state = toState;
  packet.derived_view.audit = {
    result: auditResult.result,
    auditor_id: "CISEM_CLOUD_AUDITOR",
    timestamp: timestampStr,
    rationale: auditResult.rationale
  };

  // Save updated file back to Google Drive
  const updatedYaml = dumpYaml(packet);
  if (file.getMimeType() === "application/vnd.google-apps.document") {
    const doc = DocumentApp.openById(file.getId());
    doc.getBody().setText(updatedYaml);
  } else {
    file.setContent(updatedYaml);
  }
  Logger.log("Packet " + file.getName() + " updated and saved with audit status: " + toState);
}

// Helper Utilities

function padZero(num, size) {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

function getDeepValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

/**
 * Naive mock parser (Google Apps Script does not have native YAML parser;
 * in practice, you import a library like js-yaml, or parse JSON-compatible subset).
 */
function parseYaml(text) {
  // Safe fallback if JSON formatting is used or using basic regex mapping
  try {
    return JSON.parse(text);
  } catch (e) {
    // In actual deployment, import js-yaml library inside Apps Script project
    return null; 
  }
}

function dumpYaml(obj) {
  return JSON.stringify(obj, null, 2);
}
