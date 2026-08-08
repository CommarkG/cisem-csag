# Rule: workspace_alignment.md - Workspace Directory Verification

## Principle
Never assume the active workspace directory is correct when starting a session or establishing a new setup (such as configuration files, credentials, new directories, or scripts). Always check the directory tree and verify you are in the correct project directory (e.g., separating Marketing, Planning, and Supplier Scraper) before writing files, installing packages, or executing commands.

## Instructions
1. **Verify Workspace Path:** At the start of a session or when establishing new configurations/credentials, verify the absolute path of the current workspace directory against the user's target project.
2. **Explicit Directory Hierarchy Check:** Before running commands or writing files, verify the working directory matches the target project (e.g., do not configure files for "Marketing" inside the "Supplier Scraper" directory).
3. **Re-orient if Needed:** If the current workspace does not match the target project, request permissions for the correct path and execute tasks in that target path, or alert the user to the mismatch.

## Mandatory File Naming and Versioning Convention
Every file created by the agent (scripts, artifacts, configurations, or documents) must follow a structured naming pattern that details what it is, who created it, who it is sent to, the date, and its version.

**Required Format:**
`[Date-or-Prefix]__[From]__[To]__[Description]__[Version].[ext]`

*Example:* `2026-08-05__AntigravityLocal__YarivHuman__CxpSpecification__V1.0.md`

No generic filenames (like `script.py` or `temp.txt`) are permitted. This rule is binding for all file creations.

## Mandatory Socratic Restraint (Anti-Freestyling)
1. **Restraint Over Coding**: Never modify source code without planning mode approval. This restriction is mechanically enforced in the workspace by the background watcher daemon (`CxpWatcher`) and compile gates (`cisem_gate.py`), which immediately lock the compiler on unapproved edits.
2. **Planned Verification**: All modifications must flow through an approved `implementation_plan.md` and be logged in `walkthrough.md`.

## Mandatory Clickable Live Links & Download Actions
1. **Always Link Files & Symbols**: For every file created, modified, or referenced in the response, you must output a clickable markdown link containing the `file:///` absolute path protocol.
2. **Always Provide a Local Download Link**: You must also provide a local HTTP download link pointing to `/api/download?filename=...` on the local Next.js dev server.
3. **Format**:
   - *Clickable Link*: `[filename.ext](file:///C:/absolute/path/to/filename.ext)` (using forward slashes for Windows paths).
   - *Download Link*: `[Download MD File](http://localhost:3000/api/download?filename=filename.ext)`


