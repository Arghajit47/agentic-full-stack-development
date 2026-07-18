---
name: business-analyst-workflow
description: "Business Analyst Workflow (/ba, /ba-reply): Breaks down Figma designs into [Frontend], [Backend], [Integration] JIRA stories with BDD AC and contracts."
version: 1.7.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [business-analyst, jira, figma, bdd]
---

# Business Analyst Workflow (/ba)

**Trigger Commands:** `/ba`, `/ba-reply <JIRA_KEY_ID> <COMMENT_URL>`

## Operational Rules (Concise)

1. **Verify Figma Access:** Load `~/.env` or `.env`. Fetch `/v1/me` and `/v1/files/{key}`. If a `429` is hit, retry with exponential backoff.
2. **Isolate Component:** Select one granular component (e.g., "Property Card", "Contact Form") based on the sitemap. Do NOT process the entire sitemap in one go unless in direct batch mode.
3. **Capture Design Inventories:** Document the overall bg theme (dark/light RGB), text content inventory (exact strings), alignment inventory, navigation controls, card count per breakpoint, and card fields.
4. **Download Figma Screenshots Immediately:** Render and download the resolution screenshots (1920/1440/1024/768/375px) to `/tmp/` immediately during node isolation. S3 URLs expire quickly; do not wait until ticket creation.
5. **Split Into 3 JIRA Tickets:** Every component *must* be split by scope to enable parallel work:
   - `[Frontend]` — UI elements only, mock data, responsive breakpoints.
   - `[Backend]` — Endpoints, Prisma changes, Zod schema, seed data. (Needs `backend-structure-source.txt`).
   - `[Integration]` — Replacing mock calls with real API endpoints, E2E tests.
6. **Cross-Link Tickets:** Relate the 3 tickets in JIRA. Transition all to `TO DO` (or target transition). Verify the transition succeeded and log the transition.
7. **Halt Resolution (`/ba-reply`):** Parse unblock requests from JIRA comments, query designer/senior BA as needed, and reply with instructions on how to resume (e.g., `/frontend-dev-resume <JIRA_KEY> <REPLY_URL>`).
8. **Credential Safety:** NEVER print environment variables, passwords, or tokens in logs or console output.

## Utility Scripts

### 1. `validate_figma_access.py`
Tests Figma token access with retry logic.

```python
import os
import sys
import urllib.request
import urllib.error
import json
import time

def load_env():
    env = {}
    for path in [os.path.expanduser('~/.env'), '.env']:
        if os.path.exists(path):
            with open(path) as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        k, v = line.split('=', 1)
                        env[k.strip()] = v.strip().strip('"').strip("'")
    return env

def make_request(url, token):
    req = urllib.request.Request(url, headers={"X-Figma-Token": token})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=8) as res:
                return json.loads(res.read().decode('utf-8'))
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = 2 ** attempt
                print(f"Figma rate limit (429). Retrying in {wait}s...", file=sys.stderr)
                time.sleep(wait)
                continue
            raise e
    raise Exception("Max retries exceeded for Figma API")

def test_figma(file_key):
    env = load_env()
    token = env.get('FIGMA_API_KEY')
    if not token:
        print("Error: FIGMA_API_KEY not found in env")
        sys.exit(1)
    
    try:
        me = make_request("https://api.figma.com/v1/me", token)
        print(f"Figma Auth: OK ({me.get('handle')})")
        file_data = make_request(f"https://api.figma.com/v1/files/{file_key}", token)
        print(f"File Found: {file_data.get('name')}")
    except Exception as e:
        print(f"Figma Access Failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 validate_figma_access.py <FILE_KEY>")
        sys.exit(1)
    test_figma(sys.argv[1])
```

### 2. `download_and_attach_screenshots.py`
Downloads figma screenshot instantly and uploads it to JIRA issue.

```python
import os
import sys
import urllib.request
import urllib.error
import json
import time
import uuid
import base64

def load_env():
    env = {}
    for path in [os.path.expanduser('~/.env'), '.env']:
        if os.path.exists(path):
            with open(path) as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        k, v = line.split('=', 1)
                        env[k.strip()] = v.strip().strip('"').strip("'")
    return env

def make_figma_request(url, token):
    req = urllib.request.Request(url, headers={"X-Figma-Token": token})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=10) as res:
                return json.loads(res.read().decode('utf-8'))
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = 2 ** attempt
                time.sleep(wait)
                continue
            raise e
    raise Exception("Figma request failed")

def upload_attachment(figma_s3_url, jira_key, resolution):
    env = load_env()
    jira_url = env.get('JIRA_URL', '').rstrip('/')
    jira_email = env.get('JIRA_EMAIL')
    jira_api_key = env.get('JIRA_API_KEY')
    
    if not all([jira_url, jira_email, jira_api_key]):
        print("Error: Missing JIRA credentials in env")
        sys.exit(1)
        
    filename = f"screenshot-{resolution}.png"
    tmp_path = f"/tmp/{uuid.uuid4().hex}_{resolution}.png"
    
    # Download S3 Image
    try:
        urllib.request.urlretrieve(figma_s3_url, tmp_path)
    except Exception as e:
        print(f"Download failed: {e}")
        sys.exit(1)
        
    # JIRA Upload
    with open(tmp_path, "rb") as f:
        file_data = f.read()
        
    boundary = uuid.uuid4().hex
    auth_str = f"{jira_email}:{jira_api_key}"
    auth_b64 = base64.b64encode(auth_str.encode('utf-8')).decode('utf-8')
    
    jira_base = jira_url.split("/jira/software")[0] if "/jira/software/projects" in jira_url else jira_url
    url = f"{jira_base}/rest/api/2/issue/{jira_key}/attachments"
    
    headers = {
        "X-Atlassian-Token": "no-check",
        "Content-Type": f"multipart/form-data; boundary={boundary}",
        "Authorization": f"Basic {auth_b64}"
    }
    
    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="file"; filename="{filename}"\r\n'
        f"Content-Type: image/png\r\n\r\n"
    ).encode('utf-8') + file_data + f"\r\n--{boundary}--\r\n".encode('utf-8')
    
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as res:
            res_data = json.loads(res.read().decode('utf-8'))
            print(f"Attached {filename} to {jira_key} (ID: {res_data[0].get('id')})")
    except Exception as e:
        print(f"JIRA attachment failed: {e}")
        sys.exit(1)
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python3 download_and_attach_screenshots.py <S3_URL> <JIRA_KEY> <RESOLUTION>")
        sys.exit(1)
    upload_attachment(sys.argv[1], sys.argv[2], sys.argv[3])
```

### 3. `batch_create_jira_tickets.py`
Automates ticket creation, points configuration, and linking.

```python
import os
import sys
import urllib.request
import json
import base64
import argparse

def load_env():
    env = {}
    for path in [os.path.expanduser('~/.env'), '.env']:
        if os.path.exists(path):
            with open(path) as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        k, v = line.split('=', 1)
                        env[k.strip()] = v.strip().strip('"').strip("'")
    return env

def make_request(url, method, payload, headers):
    data = json.dumps(payload).encode('utf-8') if payload else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as res:
            if res.status == 204:
                return {}
            return json.loads(res.read().decode('utf-8'))
    except Exception as e:
        if hasattr(e, 'read'):
            err = e.read().decode('utf-8')
            raise Exception(f"HTTP Error {e.code}: {err}")
        raise e

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--json-file', required=True)
    parser.add_argument('--project', required=True)
    parser.add_argument('--points-field', default='customfield_10016')
    parser.add_argument('--transition', default='TO DO')
    args = parser.parse_args()
    
    if not os.path.exists(args.json_file):
        print(f"Error: {args.json_file} not found")
        sys.exit(1)
        
    with open(args.json_file) as f:
        tickets = json.load(f)
        
    env = load_env()
    jira_url = env.get('JIRA_URL', '').rstrip('/')
    jira_email = env.get('JIRA_EMAIL')
    jira_api_key = env.get('JIRA_API_KEY')
    
    if not all([jira_url, jira_email, jira_api_key]):
        print("Error: JIRA credentials missing in environment")
        sys.exit(1)
        
    jira_base = jira_url.split("/jira/software")[0] if "/jira/software/projects" in jira_url else jira_url
    auth_str = f"{jira_email}:{jira_api_key}"
    auth_b64 = base64.b64encode(auth_str.encode('utf-8')).decode('utf-8')
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Basic {auth_b64}"
    }
    
    created_keys = {}
    
    # 1. Create tickets
    for idx, t in enumerate(tickets):
        payload = {
            "fields": {
                "project": {"key": args.project},
                "summary": t['summary'],
                "description": t['description'],
                "issuetype": {"name": "Story"},
                "labels": t.get('labels', []),
                args.points_field: t.get('story_points', 0)
            }
        }
        try:
            res = make_request(f"{jira_base}/rest/api/2/issue", "POST", payload, headers)
            key = res.get('key')
            created_keys[t.get('scope', f"task_{idx}")] = key
            print(f"Created: {key} for {t.get('summary')}")
        except Exception as e:
            print(f"Failed to create {t['summary']}: {e}")
            sys.exit(1)
            
    # 2. Transition tickets
    for scope, key in created_keys.items():
        try:
            trans_res = make_request(f"{jira_base}/rest/api/2/issue/{key}/transitions", "GET", None, headers)
            todo_id = next((tr['id'] for tr in trans_res.get('transitions', []) 
                            if tr['name'].upper() == args.transition.upper()), None)
            if todo_id:
                make_request(f"{jira_base}/rest/api/2/issue/{key}/transitions", "POST", 
                             {"transition": {"id": todo_id}}, headers)
                print(f"Transitioned {key} to {args.transition}")
        except Exception as e:
            print(f"Failed to transition {key}: {e}")

    # 3. Cross-link
    for s1, k1 in created_keys.items():
        for s2, k2 in created_keys.items():
            if s1 != s2 and k1 < k2:
                try:
                    make_request(f"{jira_base}/rest/api/2/issueLink", "POST", {
                        "type": {"name": "Relates"},
                        "inwardIssue": {"key": k1},
                        "outwardIssue": {"key": k2}
                    }, headers)
                    print(f"Linked {k1} <-> {k2}")
                except Exception as e:
                    print(f"Link failed: {e}")

if __name__ == "__main__":
    main()
```
