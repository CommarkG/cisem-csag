import os
import io
import httplib2
import google_auth_httplib2
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

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

# List of files to download
files_to_download = [
    # (File ID, Local Filename, MimeType)
    ("1CjXl29CHcKv9sNFvYRWpez5_ViqtV_1Jxu4dkYZV-UI", "2100__CISEM__Marketing_Platform_Trial__Root_and_Index__V0.1.txt", "application/vnd.google-apps.document"),
    ("1E75Th0eemFcE-frfNSYhXMuyY5zvt4yaGstrz7W-gxs", "0020__CISEM__Google_Antigravity__Current_Request__V0.1.txt", "application/vnd.google-apps.document")
]

local_subfolder = os.path.join(os.path.dirname(__file__), "9000__INTERSYSTEM_EXECUTION_EXCHANGE")
os.makedirs(local_subfolder, exist_ok=True)

for file_id, local_name, mime_type in files_to_download:
    local_path = os.path.join(local_subfolder, local_name)
    print(f"Downloading {local_name}...")
    try:
        request = drive_service.files().export_media(fileId=file_id, mimeType="text/plain")
        fh = io.BytesIO()
        downloader = MediaIoBaseDownload(fh, request)
        done = False
        while not done:
            status, done = downloader.next_chunk()
        
        fh.seek(0)
        with open(local_path, "wb") as f:
            f.write(fh.read())
        print(f"Saved to {local_path}")
    except Exception as e:
        print(f"Failed: {e}")
