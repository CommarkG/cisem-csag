import os
import sys
import re

baseline_path = r'C:\Users\finky\secure\cisem_identity_fallback_baseline.txt'

# Ensure secure baseline file directory exists
os.makedirs(os.path.dirname(baseline_path), exist_ok=True)

# Set baseline count to 10 if not present
if not os.path.exists(baseline_path):
    with open(baseline_path, 'w', encoding='utf-8') as f:
        f.write("10")
    print(f"Created baseline file at {baseline_path} with count 10")

with open(baseline_path, 'r', encoding='utf-8') as f:
    baseline_count = int(f.read().strip())

components_dir = r'C:\Users\finky\Desktop\AntiGravity\Cisem CsAg\src\components'
string_fallback_pattern = re.compile(r'(\b[\w\.]+\s*\|\|\s*[\'"][^\'"]+[\'"])')
identity_terms = ['company', 'tenant', 'user', 'role', 'owner', 'author', 'dima', 'agn', 'admin', 'guest', 'inq', 'inquiry', 'quote', 'ref', 'reference']

identity_findings = []

for root, dirs, files in os.walk(components_dir):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.tsx'):
            path = os.path.join(root, file)
            rel_path = os.path.relpath(path, components_dir)
            with open(path, 'r', encoding='utf-8', errors='ignore') as file_obj:
                for line_idx, line in enumerate(file_obj, 1):
                    line_str = line.strip()
                    if 'translations[' in line or 'localStorage' in line or 'useState(' in line:
                        continue
                    
                    matches = string_fallback_pattern.findall(line_str)
                    for m in matches:
                        m_clean = m.strip()
                        left_side, right_side = m_clean.split('||', 1)
                        left_side = left_side.strip()
                        right_side = right_side.strip().strip('\'"')

                        left_lower = left_side.lower()
                        right_lower = right_side.lower()

                        # Check identity terms
                        if any(term in left_lower for term in identity_terms) or any(term in right_lower for term in ['dima', 'agn', 'admin', 'user', 'guest', '5f2bfda8']):
                            identity_findings.append({
                                'file': rel_path,
                                'line': line_idx,
                                'expression': m_clean
                            })

current_count = len(identity_findings)

print("=== IDENTITY FALLBACK COMMIT GATE ===")
print(f"Baseline Allowed Count: {baseline_count}")
print(f"Current Detected Identity Fallbacks: {current_count}\n")

if current_count > baseline_count:
    print("STATUS: BLOCKED")
    print(f"ERROR: Identity fallback count ({current_count}) exceeds allowed baseline ({baseline_count}).")
    print("New identity fallbacks detected:")
    for f in identity_findings:
        print(f"  - {f['file']}:{f['line']} | {f['expression']}")
    sys.exit(1)
else:
    print("STATUS: PASSED")
    print(f"SUCCESS: Identity fallback count ({current_count}) is within allowed baseline ({baseline_count}).")
    sys.exit(0)
