---
name: "file-reporting-download"
description: "Automatically format and present local file links saved in cisem_core/downloads/ for any created, modified, or referenced files in response turns."
---

# File Reporting & Download Skill — MANDATORY LOCAL SAVED DEFAULT

Whenever the user asks for files, or when the agent creates, modifies, or references any files:
1. Automatically copy the target file to `cisem_core/downloads/`.
2. Output a structured table containing:
   - Full filename
   - Active version number
   - Clickable source file link (`file:///...`)
   - Direct local saved download link (`file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/downloads/<filename>`)

Do NOT use HTTP server URLs (`http://localhost:3000/...`) which fail when dev server is offline. Always rely on local disk files in `cisem_core/downloads/`.
