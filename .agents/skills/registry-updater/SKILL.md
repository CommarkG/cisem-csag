---
name: "registry-updater"
description: "Updates files and tracks version listings inside the accountability registry."
version: "1.0"
---

# Registry Updater Skill

This skill synchronizes file structures, checks registry consistency, and increments registry yaml files.

## Invocation

Run the registry updates by creating and executing the matching `update_registry` script in `cisem_core/`.
For example:
```bash
python cisem_core/update_registry_v1.43.py
```
