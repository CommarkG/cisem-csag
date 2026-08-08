import os

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
transcript_path = "C:\\Users\\finky\\.gemini\\antigravity\\brain\\7ab8f311-e871-43fb-b5f8-6671cb1eb4c9\\.system_generated\\logs\\transcript.jsonl"

if os.path.exists(transcript_path):
    with open(transcript_path, "r", encoding="utf-8") as f:
        for i, line in enumerate(f):
            if "blink" in line.lower() or "flicker" in line.lower():
                print(f"Line {i}: {line[:300]}...")
else:
    print("Transcript not found.")
