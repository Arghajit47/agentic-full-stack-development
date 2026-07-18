---
name: quality-analyst
description: "Quality Analyst (/qa): SDET orchestrates manual and automated QA for JIRA tickets, manages dev server lifecycle, runs E2E audits, and updates tickets."
version: 1.2.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [qa, testing, playwright, JIRA]
---

# Quality Analyst (/qa)

**Trigger Command:** `/qa <JIRA_TICKET_ID>` or `/qa <JIRA_TICKET_URL>`

## Operational Rules (Concise)

1. **JIRA Status Gate:** Verify the ticket is in "In Testing" state.
2. **Server Lifecycle Management:** Verify if the dev server (default `http://localhost:3000`) is running. Check port occupation using `lsof -i :3000`. If a zombie process occupies port 3000, run `kill -9 <PID>` to clear it. If another active service is running, start the dev server on a different port and dynamically adjust the base URL.
3. **QA Sub-task Reuse (HARD GATE):** Before creating a new QA Sub-task, run a JQL search to check if a sub-task already exists for the parent key (`parent = {parent_key} AND summary ~ "QA Testing"`). If found, reuse it and append the test results as a comment rather than creating a new sub-task.
4. **Parallel Execution:** Spawn Manual QA and Automation SDET sub-agents via `delegate_task` to run manual and Playwright E2E suites.
5. **Headless Fallback:** If browser/Chrome MCP tools are blocked or offline, use Playwright headless (`npx playwright test`) as the fallback E2E engine.
6. **Star/Image Validation:** Ensure no broken images (assert `naturalWidth > 0` after incremental scrolling) and no console errors.
7. **SQLite DB Isolation:** Ensure the test database path (`DATABASE_URL='file:./prisma/test.db'`) is isolated in `package.json` to prevent tests from wiping live dev data.
8. **QA Verdict & Routing:**
   - **PASS:** Transition ticket to "Done" and assign to Reviewer. (Never transition linked sibling tickets).
   - **FAIL:** Transition ticket to "Code Review" (or "In Progress" if direct transition not allowed), assign to Reviewer, and post failing details as the input to trigger the fix loop. (Only one re-test round allowed).
9. **Assignee Configuration:**
   - Developer: `JIRA_DEVELOPER_ACCOUNT_ID` or default `712020:c717bbd8-a925-46ed-84a4-adc7ed13a994`.
   - Reviewer: `JIRA_REVIEWER_ACCOUNT_ID` or default `712020:0b3f3265-5477-48a8-bec9-ce1d18d945d2`.
10. **Credential Safety:** NEVER print environment variables or JIRA/Git tokens to standard output or logs.

## Utility Scripts

### 1. `live_ui_layout_audit.py`
Audits running dev server, scrolling to trigger lazy-loaded images, and inspecting computed layout theme.

```python
import sys
import json
import urllib.request
import urllib.error
from html.parser import HTMLParser
import os
import time

class ImageLinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.images = []
        self.stylesheets = []
        
    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == 'img' and 'src' in attrs_dict:
            self.images.append(attrs_dict['src'])
        elif tag == 'link' and attrs_dict.get('rel') == 'stylesheet' and 'href' in attrs_dict:
            self.stylesheets.append(attrs_dict['href'])

def check_url(url, base_url):
    full_url = url if url.startswith(('http://', 'https://')) else base_url.rstrip('/') + '/' + url.lstrip('/')
    req = urllib.request.Request(full_url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=3) as res:
            return True, res.status, None
    except urllib.error.HTTPError as e:
        return False, e.code, str(e.reason)
    except Exception as e:
        return False, 0, str(e)

def audit_html(url):
    print(f"Auditing page HTML at {url}...", file=sys.stderr)
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=5) as res:
            html_content = res.read().decode('utf-8')
            status_code = res.status
    except Exception as e:
        print(json.dumps({"error": f"Failed to fetch base URL {url}: {e}"}))
        sys.exit(1)
        
    parser = ImageLinkParser()
    parser.feed(html_content)
    
    broken_images = []
    checked_images = 0
    for img_src in parser.images:
        if img_src.startswith('data:'):
            continue
        checked_images += 1
        ok, code, err = check_url(img_src, url)
        if not ok:
            broken_images.append({"src": img_src, "code": code, "error": err})
            
    broken_styles = []
    for style_href in parser.stylesheets:
        ok, code, err = check_url(style_href, url)
        if not ok:
            broken_styles.append({"href": style_href, "code": code, "error": err})
            
    report = {
        "url": url,
        "status": status_code,
        "images_found": len(parser.images),
        "images_checked": checked_images,
        "broken_images": broken_images,
        "stylesheets_found": len(parser.stylesheets),
        "broken_stylesheets": broken_styles
    }
    
    try:
        from playwright.sync_api import sync_playwright
        print("Playwright detected. Running deep E2E audit...", file=sys.stderr)
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            
            console_errors = []
            page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
            page.on("pageerror", lambda err: console_errors.append(err.message))
            
            page.goto(url)
            page.wait_for_timeout(1000)
            
            # Incremental scroll to force trigger lazy-loaded images
            page.evaluate("""async () => {
                await new Promise((resolve) => {
                    let totalHeight = 0;
                    const distance = 100;
                    const timer = setInterval(() => {
                        const scrollHeight = document.body.scrollHeight;
                        window.scrollBy(0, distance);
                        totalHeight += distance;
                        if(totalHeight >= scrollHeight){
                            clearInterval(timer);
                            resolve();
                        }
                    }, 50);
                });
            }""")
            page.wait_for_timeout(500)
            
            theme_audit = page.evaluate("""() => {
                const bodyStyle = window.getComputedStyle(document.body);
                const cards = document.querySelectorAll('[class*="card"]');
                let cardBg = 'none';
                if (cards.length > 0) {
                    cardBg = window.getComputedStyle(cards[0]).backgroundColor;
                }
                return {
                    body_bg: bodyStyle.backgroundColor,
                    body_color: bodyStyle.color,
                    card_bg: cardBg
                };
            }""")
            
            visible_broken_images = page.evaluate("""() => {
                const imgs = Array.from(document.querySelectorAll('img'));
                return imgs.filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src);
            }""")
            
            browser.close()
            report["playwright_deep_audit"] = {
                "theme_detected": theme_audit,
                "visible_broken_images": visible_broken_images,
                "console_errors": console_errors
            }
    except ImportError:
        report["playwright_deep_audit"] = {
            "status": "skipped",
            "message": "playwright package not installed."
        }
        
    print(json.dumps(report, indent=2))

if __name__ == "__main__":
    target_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"
    audit_html(target_url)
```

### 2. `create_qa_subtask.py`
Creates or comments on a JIRA QA sub-task. Checks for duplicate sub-tasks first.

```python
import os
import sys
import urllib.request
import json
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

def make_request(url, method, payload, headers):
    data = json.dumps(payload).encode('utf-8') if payload else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as res:
            body = res.read().decode('utf-8')
            if not body or res.status == 204:
                return {}
            return json.loads(body)
    except Exception as e:
        if hasattr(e, 'read'):
            err_body = e.read().decode('utf-8')
            raise Exception(f"HTTP Error {e.code}: {err_body}")
        raise e

def create_subtask(parent_key, project_key, summary, description):
    env = load_env()
    jira_url = env.get('JIRA_URL', '').rstrip('/')
    jira_email = env.get('JIRA_EMAIL')
    jira_api_key = env.get('JIRA_API_KEY')
    
    if not all([jira_url, jira_email, jira_api_key]):
        print("Error: Missing JIRA credentials in env")
        sys.exit(1)
        
    jira_base = jira_url.split("/jira/software")[0] if "/jira/software/projects" in jira_url else jira_url
    auth_str = f"{jira_email}:{jira_api_key}"
    auth_b64 = base64.b64encode(auth_str.encode('utf-8')).decode('utf-8')
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Basic {auth_b64}"
    }
    
    # 1. JQL Check for duplicates via GET
    jql = f'summary ~ "QA Testing for {parent_key}"'
    import urllib.parse
    search_url = f"{jira_base}/rest/api/2/search/jql?jql={urllib.parse.quote(jql)}&maxResults=1&fields=key"
    try:
        search_res = make_request(search_url, "GET", None, headers)
        issues = search_res.get('issues', [])
        if issues:
            sub_key = issues[0].get('key')
            print(f"Found existing QA Task/Sub-task: {sub_key}. Appending results...")
            make_request(f"{jira_base}/rest/api/2/issue/{sub_key}/comment", "POST", {"body": description}, headers)
            print("Comment posted to existing task successfully.")
            return
    except Exception as e:
        print(f"JQL search failed: {e}. Attempting creation...")
        
    # 2. Create sub-task
    payload = {
        "fields": {
            "project": {"key": project_key},
            "summary": summary,
            "description": description,
            "issuetype": {"name": "Sub-task"},
            "parent": {"key": parent_key}
        }
    }
    
    try:
        res = make_request(f"{jira_base}/rest/api/2/issue", "POST", payload, headers)
        print(f"Successfully created QA Sub-task: {res.get('key')}")
    except Exception as e:
        print(f"Failed sub-task creation: {e}. Retrying as regular Task with Relates link...")
        payload["fields"]["issuetype"] = {"name": "Task"}
        del payload["fields"]["parent"]
        try:
            res = make_request(f"{jira_base}/rest/api/2/issue", "POST", payload, headers)
            sub_key = res.get('key')
            print(f"Created QA Task: {sub_key}")
            make_request(f"{jira_base}/rest/api/2/issueLink", "POST", {
                "type": {"name": "Relates"},
                "inwardIssue": {"key": parent_key},
                "outwardIssue": {"key": sub_key}
            }, headers)
            print(f"Linked QA Task {sub_key} to Parent {parent_key}")
        except Exception as ex:
            print(f"Failed QA task fallback creation: {ex}")
            sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 5:
        print("Usage: python3 create_qa_subtask.py <PARENT_KEY> <PROJECT_KEY> <SUMMARY> <DESCRIPTION_FILE>")
        sys.exit(1)
    parent, project, summary, desc_file = sys.argv[1:5]
    with open(desc_file) as f:
        description = f.read()
    create_subtask(parent, project, summary, description)
```

### 3. `run_e2e_lifecycle.py`
Lifecycle manager that kills conflicting zombie ports, launches the Next.js development server, polls until it is ready, runs the Playwright test suite, and cleans up the server process.

```python
import os
import sys
import subprocess
import time
import urllib.request

def check_port_and_kill(port):
    print(f"Checking if port {port} is occupied...")
    try:
        res = subprocess.run(["lsof", "-t", f"-i:{port}"], capture_output=True, text=True)
        pids = [pid.strip() for pid in res.stdout.split() if pid.strip()]
        if pids:
            print(f"Port {port} occupied by PIDs: {pids}. Cleaning up zombie processes...")
            for pid in pids:
                subprocess.run(["kill", "-9", pid])
            time.sleep(1)
        else:
            print(f"Port {port} is free.")
    except Exception as e:
        print(f"Warning checking port: {e}")

def wait_for_server(url, max_attempts=15):
    print(f"Waiting for server at {url} to respond...")
    for attempt in range(max_attempts):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=2) as res:
                if res.status in (200, 301, 302):
                    print("Server is ready!")
                    return True
        except Exception:
            pass
        time.sleep(1)
    print("Error: Server did not become ready in time.")
    return False

def run_e2e(spec_path, port=3000):
    check_port_and_kill(port)
    
    # Run npm run dev in background
    run_env = os.environ.copy()
    run_env["PATH"] = "/usr/local/bin:" + run_env.get("PATH", "")
    
    print("Launching dev server...")
    dev_process = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd="..",
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        env=run_env
    )
    
    success = False
    try:
        if wait_for_server(f"http://localhost:{port}/properties"):
            print(f"Running Playwright spec: {spec_path}...")
            test_res = subprocess.run([
                "npx", "playwright", "test", spec_path, "--config=playwright.ui.config.ts"
            ], env=run_env)
            success = (test_res.returncode == 0)
    finally:
        print("Stopping dev server process...")
        dev_process.terminate()
        try:
            dev_process.wait(timeout=3)
        except subprocess.TimeoutExpired:
            dev_process.kill()
        check_port_and_kill(port)
        
    return success

if __name__ == "__main__":
    spec = sys.argv[1] if len(sys.argv) > 1 else "specs/properties-listings-ui.spec.ts"
    pt = int(sys.argv[2]) if len(sys.argv) > 2 else 3000
    ok = run_e2e(spec, pt)
    sys.exit(0 if ok else 1)
```

### 4. `create_automation_pr.py`
Commits the changes, pushes the branch, and raises a GitHub Pull Request for automation/test files automatically.

```python
import os
import sys
import urllib.request
import json
import subprocess

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

def run_cmd(args):
    res = subprocess.run(args, capture_output=True, text=True)
    if res.returncode != 0:
        raise Exception(f"Command {' '.join(args)} failed: {res.stderr}")
    return res.stdout.strip()

def raise_automation_pr(pr_number_parent, branch_name, title, description):
    env = load_env()
    token = env.get('GITHUB_TOKEN')
    if not token:
        print("Error: GITHUB_TOKEN not found in env")
        sys.exit(1)
        
    repo = "Arghajit47/agentic-full-stack-development"
    url = f"https://api.github.com/repos/{repo}/pulls"
    
    # 1. Commit and Push
    print("Staging and committing files...")
    run_cmd(["git", "add", "."])
    run_cmd(["git", "commit", "-m", f"test(automation): add test spec for {pr_number_parent}"])
    print(f"Pushing branch {branch_name} to origin...")
    run_cmd(["git", "push", "origin", branch_name])
    
    # 2. Raise PR
    payload = {
        "title": title,
        "head": branch_name,
        "base": "main",
        "body": description
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode('utf-8'),
        headers={
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github.v3+json",
            "Content-Type": "application/json"
        },
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req) as res:
            res_data = json.loads(res.read().decode('utf-8'))
            print("Successfully created Pull Request:", res_data.get("html_url"))
    except Exception as e:
        if hasattr(e, 'read'):
            print("Failed to create Pull Request:", e.read().decode('utf-8'))
        else:
            print("Failed to create Pull Request:", e)

if __name__ == "__main__":
    if len(sys.argv) < 5:
        print("Usage: python3 create_automation_pr.py <PARENT_JIRA_KEY> <BRANCH_NAME> <TITLE> <DESCRIPTION>")
        sys.exit(1)
    jira_key, branch, title, desc = sys.argv[1:5]
    raise_automation_pr(jira_key, branch, title, desc)
```

