import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaInMemoryUpload

# Manually parse .env file to avoid external dependency issues
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

print(f"Credentials Path: {creds_path}")
print(f"Folder ID: {folder_id}")

if not creds_path or not os.path.exists(creds_path):
    print("Error: GOOGLE_APPLICATION_CREDENTIALS path is invalid or file does not exist.")
    exit(1)

if not folder_id:
    print("Error: GOOGLE_DRIVE_FOLDER_ID is not defined in .env.")
    exit(1)

import httplib2
import google_auth_httplib2

# Authenticate
credentials = service_account.Credentials.from_service_account_file(
    creds_path,
    scopes=["https://www.googleapis.com/auth/drive"]
)

# Disable SSL validation for local test script
http = httplib2.Http(disable_ssl_certificate_validation=True)
authorized_http = google_auth_httplib2.AuthorizedHttp(credentials, http=http)

drive_service = build("drive", "v3", http=authorized_http)

# 1. Test List files
print("Testing file listing...")
results = drive_service.files().list(
    q=f"'{folder_id}' in parents and trashed = false",
    fields="files(id, name)"
).execute()
files = results.get("files", [])
print(f"Listing completed. Found {len(files)} files in folder:")
for file in files:
    print(f"- {file['name']} (ID: {file['id']})")

# 2. Test Write file
print("\nTesting file creation...")
file_metadata = {
    "name": "connection_test.txt",
    "parents": [folder_id]
}
media = MediaInMemoryUpload(b"Google Drive API connection test successful!", mimetype="text/plain")
created_file = drive_service.files().create(
    body=file_metadata,
    media_body=media,
    fields="id"
).execute()

print(f"Successfully created 'connection_test.txt' in folder! File ID: {created_file.get('id')}")
