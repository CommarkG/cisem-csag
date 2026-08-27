import urllib.request
import json

url = "http://localhost:4321/api/v1/tenant/members"
try:
    req = urllib.request.Request(url, headers={"Authorization": "Bearer fake_token"})
    with urllib.request.urlopen(req) as response:
        print("STATUS:", response.status)
        data = json.loads(response.read().decode('utf-8'))
        print("DATA:", json.dumps(data, indent=2))
except Exception as e:
    print("ERROR:", e)
