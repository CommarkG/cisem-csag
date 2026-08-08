import os
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
folder_id = env_vars.get("GOOGLE_DRIVE_FOLDER_ID")

# Authenticate
credentials = service_account.Credentials.from_service_account_file(
    creds_path,
    scopes=["https://www.googleapis.com/auth/drive"]
)
http = httplib2.Http(disable_ssl_certificate_validation=True)
authorized_http = google_auth_httplib2.AuthorizedHttp(credentials, http=http)
drive_service = build("drive", "v3", http=authorized_http)

# List all files in the root folder
results = drive_service.files().list(
    q=f"'{folder_id}' in parents and trashed = false",
    fields="files(id, name, mimeType)"
).execute()
files = results.get("files", [])

print("All files in Root Folder:")
for file in files:
    print(f"- {file['name']} (ID: {file['id']}, MimeType: {file['mimeType']})")

# List all files in the subfolder
subfolder_id = "1dy0hixngOGeRhvLsvi5dEY9F3Y8pl8ct"
sub_results = drive_service.files().list(
    q=f"'{subfolder_id}' in parents and trashed = false",
    fields="files(id, name, mimeType)"
).execute()
sub_files = sub_results.get("files", [])

print("\nAll files in Subfolder:")
for file in sub_files:
    print(f"- {file['name']} (ID: {file['id']}, MimeType: {file['mimeType']})")
