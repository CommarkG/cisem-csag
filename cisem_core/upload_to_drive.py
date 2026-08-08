# Ratified Plan: CISEM-IP-20260808-SALES-AGENT
# Architectural Reasoning: Google Drive uploader script utilizing configured service accounts and SSL verification bypass.
# Parent Principles: PR-98000 (SIPI), PR-84900 (Naming Conventions)

import os
import sys
import httplib2
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

def upload_file_to_drive(local_filepath: str) -> str:
    if not os.path.exists(local_filepath):
        print(f"Error: Local file '{local_filepath}' does not exist.")
        return None

    # Load environment variables manually
    env_vars = {}
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    env_path = os.path.join(root_dir, ".env")
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    env_vars[key.strip()] = val.strip().strip('"').strip("'")

    creds_path = env_vars.get("GOOGLE_APPLICATION_CREDENTIALS")
    folder_id = env_vars.get("GOOGLE_DRIVE_FOLDER_ID")

    if not creds_path or not os.path.exists(creds_path):
        print("Error: GOOGLE_APPLICATION_CREDENTIALS path is invalid or file does not exist.")
        return None

    if not folder_id:
        print("Error: GOOGLE_DRIVE_FOLDER_ID is not defined in .env.")
        return None

    try:
        # Authenticate
        credentials = service_account.Credentials.from_service_account_file(
            creds_path,
            scopes=["https://www.googleapis.com/auth/drive"]
        )

        # Disable SSL verification for enterprise proxies
        http = httplib2.Http(disable_ssl_certificate_validation=True)
        import google_auth_httplib2
        authorized_http = google_auth_httplib2.AuthorizedHttp(credentials, http=http)

        drive_service = build("drive", "v3", http=authorized_http)

        filename = os.path.basename(local_filepath)
        file_metadata = {
            "name": filename,
            "parents": [folder_id]
        }
        
        media = MediaFileUpload(local_filepath, resumable=True)
        
        # Check if file already exists in folder to update it, or create a new one
        query = f"'{folder_id}' in parents and name = '{filename}' and trashed = false"
        results = drive_service.files().list(q=query, fields="files(id)").execute()
        files = results.get("files", [])

        if files:
            file_id = files[0]["id"]
            updated_file = drive_service.files().update(
                fileId=file_id,
                media_body=media
            ).execute()
            print(f"SUCCESS: Updated file '{filename}' in Drive. File ID: {file_id}")
            return file_id
        else:
            created_file = drive_service.files().create(
                body=file_metadata,
                media_body=media,
                fields="id"
            ).execute()
            file_id = created_file.get("id")
            print(f"SUCCESS: Created new file '{filename}' in Drive. File ID: {file_id}")
            return file_id

    except Exception as e:
        print(f"Error uploading file to Drive: {e}")
        return None

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python upload_to_drive.py <local_filepath>")
        sys.exit(1)
    
    upload_file_to_drive(sys.argv[1])
