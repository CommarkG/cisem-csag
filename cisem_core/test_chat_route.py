import requests
import json

payload = {
    "messages": [
        {"role": "user", "content": "Please call your tool to save my contact details: my name is John Doe and my email is john.doe@example.com."}
    ],
    "tenantId": "test-tenant-123"
}

print("Executing test POST request with explicit tool command...")
try:
    res = requests.post("http://localhost:3000/api/agent/chat", json=payload, timeout=20)
    print("HTTP STATUS:", res.status_code)
    print("RESPONSE JSON:")
    print(json.dumps(res.json(), indent=2, ensure_ascii=False))
except Exception as e:
    print("ERROR calling API route:", e)
