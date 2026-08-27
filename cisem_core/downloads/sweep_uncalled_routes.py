import os
import re
import glob

backend_file = r"C:\Users\finky\Desktop\AntiGravity\Cisem CsAg\backend\src\backend\main.py"
with open(backend_file, "r", encoding="utf-8") as f:
    content = f.read()

# Find all FastAPI endpoint routes
route_matches = re.findall(r'@app\.(?:get|post|put|delete)\(["\'](/api/v1/[^"\']+)["\']', content)
unique_routes = sorted(list(set(route_matches)))
print(f"Total Unique Backend API Routes Found: {len(unique_routes)}")

# Read all frontend code files
src_dir = r"C:\Users\finky\Desktop\AntiGravity\Cisem CsAg\src"
frontend_files = [os.path.join(dp, f) for dp, dn, filenames in os.walk(src_dir) for f in filenames if f.endswith(('.tsx', '.jsx', '.ts', '.js'))]

frontend_content = ""
for ff in frontend_files:
    try:
        with open(ff, "r", encoding="utf-8") as f:
            frontend_content += f.read() + "\n"
    except Exception:
        pass

uncalled_routes = []
for r in unique_routes:
    # Normalize route (e.g. remove path params for matching like /api/v1/inquiries/{id})
    base_route = r.split('{')[0].rstrip('/')
    if base_route not in frontend_content:
        uncalled_routes.append(r)

print(f"Uncalled / Un-wired Backend Routes Count: {len(uncalled_routes)}")
print("Uncalled Routes List:")
for ur in uncalled_routes[:15]:
    print(f" - {ur}")
