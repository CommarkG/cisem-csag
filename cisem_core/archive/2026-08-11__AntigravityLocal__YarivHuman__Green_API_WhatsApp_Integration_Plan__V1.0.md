# Implementation Plan: Green API WhatsApp Integration

This document outlines the design blueprint for integrating **Green API** to enable actual WhatsApp message notifications for team members and external customers.

---

## 1.0 Proposed Architecture

### 1.1 Store Configuration Schema
We will extend `useAdminStore.js` and `useNotificationStore.js` to store:
* **Global Green API Credentials**: Backup parameters used when a specific user doesn't have an instance configured.
  * `greenApiIdInstance` (string)
  * `greenApiTokenInstance` (string)
* **Team-Level Credentials**: Map parameters for each team member inside `useCollabStore.js` or `useAdminStore.js`'s team state so they can use their own WhatsApp account instances.

### 1.2 Secure API Gateway Router
We will build a Next.js API route `src/app/api/v1/whatsapp/send/route.ts`:
* Receives target contact number (`to`), message payload (`text`), and `senderId` (optional, to look up user-specific credentials).
* Selects the correct `idInstance` and `apiTokenInstance`.
* Calls the official Green API endpoint: `https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`
* Automatically falls back to a sandbox simulation log if no credentials are configured, ensuring 100% offline development safety.

### 1.3 Settings Calibration UI
We will add a "Green API Connection Calibration" section inside settings:
* Allows configuring global backup instance settings.
* Integrates a dropdown to map individual team member accounts to custom Green API instance credentials.
* Includes a testing interface to send immediate trial messages and log direct API responses.

---

## 2.0 Four-Question Checkpoint

1. **What already exists?**
   * Simulated WhatsApp log in `SettingsView.jsx` and `useNotificationStore.js`.
   * Standard `showToast` system.
2. **Where should this belong?**
   * The proxy endpoint belongs in `src/app/api/v1/whatsapp/send/route.ts`.
   * The settings inputs belong in `SettingsView.jsx` next to notifications.
3. **What will this affect?**
   * Unlocks real WhatsApp message delivery for event notifications.
4. **What is the smallest executable proof that validates this decision?**
   * Compiling with zero errors (`npm run build`) and completing a successful simulation loop.

---

## 3.0 Proposed Changes

### [NEW] [route.ts](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/app/api/v1/whatsapp/send/route.ts)
* Create the Next.js API route to delegate requests to `api.green-api.com` with secure custom credentials routing.

### [MODIFY] [useAdminStore.js](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/stores/useAdminStore.js)
* Store global `greenApiIdInstance` and `greenApiTokenInstance` fields, and add a helper action `setGreenApiCredentials`.

### [MODIFY] [SettingsView.jsx](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/components/views/SettingsView.jsx)
* Build the Green API connection Calibration form, allowing settings configurations for both global and individual members.

---

## 4.0 Verification Plan

### Automated Tests
* Run compilation:
  ```powershell
  npx tsc --noEmit
  npm run build
  ```
