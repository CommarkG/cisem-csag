import os
import sys
import json
from supabase import create_client

def get_env_credentials():
    env_vars = {}
    for env_file in ['.env.local', '.env']:
        path = os.path.join(r'c:\Users\finky\Desktop\AntiGravity\Cisem CsAg', env_file)
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        k, v = line.split('=', 1)
                        env_vars[k.strip()] = v.strip().strip('"').strip("'")
    
    url = env_vars.get('NEXT_PUBLIC_SUPABASE_URL') or os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
    key = env_vars.get('SUPABASE_SERVICE_ROLE_KEY') or env_vars.get('NEXT_PUBLIC_SUPABASE_ANON_KEY') or os.environ.get('NEXT_PUBLIC_SUPABASE_ANON_KEY')
    return url, key

def execute_read_query(table_name, select_cols="*", limit=50):
    url, key = get_env_credentials()
    if not url or not key:
        print("[FAIL CLOSED]: Missing Supabase credentials in environment or .env.local.")
        sys.exit(1)
        
    sb = create_client(url, key)
    try:
        res = sb.table(table_name).select(select_cols).limit(limit).execute()
        return {
            "table": table_name,
            "row_count": len(res.data) if res.data is not None else 0,
            "data": res.data
        }
    except Exception as e:
        print(f"[QUERY ERROR]: Failed to query {table_name}: {e}")
        return {"table": table_name, "row_count": 0, "error": str(e)}

if __name__ == "__main__":
    table = sys.argv[1] if len(sys.argv) > 1 else "cr_document_types"
    res = execute_read_query(table)
    print(f"=== DB READ CHANNEL VERIFICATION: {res['table']} ===")
    print(f"Rows Returned: {res['row_count']}")
    print(json.dumps(res.get("data", []), indent=2))
