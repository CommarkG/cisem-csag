import os

for f in os.listdir("."):
    if "Combined_Frontend_Refactor" in f and f.endswith(".md"):
        print(f, os.path.getmtime(f))
