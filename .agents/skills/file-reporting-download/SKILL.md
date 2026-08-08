---
name: "file-reporting-download"
description: "Automatically format and present local file links and Next.js dev server status for any created, modified, or referenced files in response turns."
---

# File Reporting & Download Skill

This skill ensures that whenever the user asks for files, or when the agent creates, modifies, or references any files, the agent must output a structured list/table containing:
1. The full filename of the file.
2. The active version number.
3. A clickable file link in `file:///` format (using forward slashes).
4. A local HTTP download link pointing to `http://localhost:3000/api/download?filename=<basename>`.

## Next.js Download Server Verification

If the Next.js development server is stopped (e.g. after a system restart), start it in the background using:
```bash
npm run dev
```

The download API route is located at [`src/app/api/download/route.ts`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/app/api/download/route.ts). It recursively scans the workspace and all brain directories to find files and serve them securely.
