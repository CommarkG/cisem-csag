---
metadata:
  owner: "CISEM_GOVERNOR"
  canonical_location: "C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\cisem_core\\planning\\2026-08-08__AntigravityLocal__YarivHuman__ProjectManagementAndAccountabilityFramework__V1.0.md"
  artifact_status: "DRAFT"
  maturity: "PROPOSAL"
  version: "1.0"
  inherited_authorities: []
  related_axioms: ["AX-10000", "PR-11000", "PR-13500"]
---

# Project Management and Accountability Framework

1.1. **Concept**:
This document outlines how the user can utilize the newly installed infrastructure—Git, GitHub, Vercel, Supabase, and the local compiler gate—as a unified tool for project management and development accountability. It also proposes the construction of a dedicated **Workspace Control & Accountability Dashboard** tab inside the web portal.

---

## 2. The Four Pillars of Platform Accountability

2.1. **Unifying Code, Tasks, and Database**:
Accountability in a software platform requires connecting *what was planned* (tasks) to *what was coded* (git commits) and *what is running* (database and deployments). We achieve this through four pillars:

```
                      [ Accountability Loop ]
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
   [ Task Planning ]      [ Code Verification ]   [ Live Deployment ]
   - GitHub Project Board - Local Gate Check      - Vercel Auto-Build
   - Cognitive Backlog    - Registry.yaml Hashing - Supabase DB State
```

1. **Pillar 1: Task Planning & Backlogs (Supabase)**:
   - *Current tool*: The **Cognitive Backlog** side-drawer inside the web portal. It lets you park thoughts, context notes, and impact levels directly into the database.
   - *VCS connection*: The **GitHub Project Board** (`Cisem CsAg`) tracks administrative issues and team tasks.
2. **Pillar 2: Mechanical Enforcement (Local Gate)**:
   - *Current tool*: `cisem_gate.py`. It blocks compiles if files are edited without being signed inside `Registry.yaml`, or if code comments reference undefined principles in `AxiomsAndPrinciples.md`.
3. **Pillar 3: Traceable History (Git/GitHub)**:
   - *Current tool*: Every feature development or document addition is committed and pushed. GitHub maintains a cryptographically signed timeline of exactly who made what change and when.
4. **Pillar 4: Production Hosting (Vercel)**:
   - *Current tool*: Auto-deployments. Vercel rebuilds the production application on every git push, showing live deployment logs and domain health.

---

## 3. How to Use the Current System Today

3.1. **Daily Operational Workflow**:
To maintain 100% accountability on your projects and tasks:
1. **Park ideas instantly**: Open `cisem-csag.vercel.app` on your computer, click the **Cognitive Backlog** icon in the toolbar, and enter a new thought, context note, and impact priority. This saves the task directly to your Supabase cloud instance.
2. **Commit with Task References**: When a task is resolved, commit the code using a commit message referencing the task ID (e.g. `feat: resolve backlog task #12`).
3. **Automatic Cloud Verification**: Run `git push`. GitHub receives the commit, and Vercel automatically deploys the updated code, bringing it live on `cisem-csag.vercel.app`.

---

## 4. Proposed Feature: The Interactive Accountability Dashboard

4.1. **Promoting the Drawer to a Core Web Tab**:
Currently, the cognitive backlog is a sliding drawer. We propose promoting this into a full-screen **Workspace Control & Accountability Dashboard** tab in the main B2B portal.

4.2. **Dashboard Features**:
- **Feature 1: Visual Task Kanban Board**: Displays tasks stored in Supabase (`To Do`, `In Progress`, `Done`) with subcontractor assignment widgets and progress metrics.
- **Feature 2: Registry Integrity Panel**: Scans the project files dynamically and shows a "Registry Health Check" light. If a file is out of sync or modified locally without a registry signature, it glows red.
- **Feature 3: Deploy & Commit Feed**: Pulls the latest commits from your `cisem-csag` GitHub repo and displays Vercel's build status (e.g., `Deploy Live: 5 minutes ago`).
- **Feature 4: Axiom Coverage Analyzer**: Scans production source files and visualizes what percentage of your codebase conforms to specific platform pillars (10000–90000).

---
history:
  - timestamp: "2026-08-08T23:38:00Z"
    action: "CREATED_PROJECT_MANAGEMENT_SPEC"
    actor: "GEMINI_BRAIN"
    version: "1.0"
