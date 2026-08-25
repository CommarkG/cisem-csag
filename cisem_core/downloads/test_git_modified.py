import os
import subprocess
import sys

ROOT_DIR = r"c:\Users\finky\Desktop\AntiGravity\Cisem CsAg"

def get_git_modified_files():
    try:
        kwargs = {"capture_output": True, "text": True}
        res = subprocess.run(["git", "status", "--porcelain"], cwd=ROOT_DIR, **kwargs)
        if res.returncode != 0:
            print("git returned non-zero")
            return None
        
        files = []
        for line in res.stdout.splitlines():
            if len(line) > 3:
                fpath = line[3:].strip()
                if " -> " in fpath:
                    fpath = fpath.split(" -> ")[-1].strip()
                abs_path = os.path.abspath(os.path.join(ROOT_DIR, fpath))
                print(f"Parsed line: '{line}' -> fpath: '{fpath}' -> exists: {os.path.exists(abs_path)}")
                if os.path.exists(abs_path):
                    files.append(abs_path)
        return files
    except Exception as e:
        print(f"Exception: {e}")
        return None

files = get_git_modified_files()
print(f"Found {len(files) if files else 0} files.")
