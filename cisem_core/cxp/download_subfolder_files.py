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

# ID of 9000__INTERSYSTEM_EXECUTION_EXCHANGE
subfolder_id = "1dy0hixngOGeRhvLsvi5dEY9F3Y8pl8ct"

# Create a local subfolder in our project to store these exchange files
local_subfolder = os.path.join(os.path.dirname(__file__), "9000__INTERSYSTEM_EXECUTION_EXCHANGE")
os.makedirs(local_subfolder, exist_ok=True)

# List files in the subfolder
results = drive_service.files().list(
    q=f"'{subfolder_id}' in parents and trashed = false",
    fields="files(id, name, mimeType)"
).execute()
files = results.get("files", [])

print(f"Downloading {len(files)} files from subfolder...")

for file in files:
    file_id = file['id']
    file_name = file['name']
    mime_type = file['mimeType']
    
    try:
        if mime_type == "application/vnd.google-apps.document":
            request = drive_service.files().export_media(fileId=file_id, mimeType="text/plain")
            file_extension = ".txt"
        else:
            request = drive_service.files().get_media(fileId=file_id)
            _, ext = os.path.splitext(file_name)
            file_extension = ext if ext else ".bin"
            
        local_name = file_name if file_name.endswith(file_extension) else f"{file_name}{file_extension}"
        local_path = os.path.join(local_subfolder, local_name)
        
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
        print(f"Failed to download {file_name}: {e}")
