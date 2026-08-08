import os
import io
import httplib2
import google_auth_httplib2
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Parse .env
env_vars = {}
env_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(env_path):
    with open(env_path, "r") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, val = line.split("=", 1)
                env_vars[key.strip()] = val.strip().strip('"').strip("'")

creds_path = env_vars.get("GOOGLE_APPLICATION_CREDENTIALS")

# Authenticate
credentials = service_account.Credentials.from_service_account_file(
    creds_path,
    scopes=["https://www.googleapis.com/auth/drive"]
)
http = httplib2.Http(disable_ssl_certificate_validation=True)
authorized_http = google_auth_httplib2.AuthorizedHttp(credentials, http=http)
drive_service = build("drive", "v3", http=authorized_http)

# ID of 9000__INTERSYSTEM_EXECUTION_EXCHANGE
subfolder_id = "1dy0hixngOGeRhvLsvi5dEY9F3Y8pl8ct"

print("Fetching files from subfolder 9000__INTERSYSTEM_EXECUTION_EXCHANGE...")
results = drive_service.files().list(
    q=f"'{subfolder_id}' in parents and trashed = false",
    fields="files(id, name, mimeType)"
).execute()
files = results.get("files", [])

print(f"Found {len(files)} files in subfolder:")
for file in files:
    print(f"- {file['name']} (ID: {file['id']}, MimeType: {file['mimeType']})")
