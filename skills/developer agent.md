---
name: developer-agent-ecosystem
description: "Developer Team Ecosystem (/developer): Dispatches Frontend/Backend/Integration sub-agents per JIRA ticket, enforces branch naming and Design Theme, and auto-triggers code review."
version: 1.5.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [developer, JIRA, git, PR]
---

# Developer Agent Ecosystem (/developer)

**Trigger Command:** `/developer <JIRA_TICKET_ID_OR_URL>`

## Operational Rules (Concise)

1. **Verify State & Branch:** Pull latest main and checkout branch: `<JIRA_KEY>-<PAGE>-<SECTION>-<SCOPE>` (e.g., `KAN-9-Home-FeaturedProperties-Frontend`).
2. **Access Verification (HARD GATE):** Verify `gh auth status`. Ensure reviewer token is separated from developer token (do NOT use GITHUB_REVIEWER_TOKEN for git push / PR creation).
3. **Design theme & PIL Sampling:** For Frontend, sample screenshot pixels programmatically using PIL at coordinates to build the `DESIGN THEME` (bg theme, text colors, card bg, accent colors). Include these values in the context.
4. **Tailwind Breakpoint Mapping:** Detect the project's Tailwind config to map AC breakpoints to Tailwind responsive prefixes (do not assume defaults).
5. **Image URL Validation:** Run `check_image_urls.py` on mock URLs. Any 404 must be flagged to the developer to resolve.
6. **Backend Plan:** Backend/Integration tickets require `backend-structure-source.txt` (halt and request via `/ba-reply` if missing).
7. **DOD Enforcement:** TypeScript clean (`npx tsc --noEmit`), unit/E2E tests pass, no console errors, and no broken images.
8. **Git Push & PR Creation:** Commit as `<JIRA_KEY> <msg>`, push to the feature branch, and create the PR. If assigning reviewer `Postman-test-bit` fails (e.g. invite pending), proceed with PR creation and log a warning rather than crashing.
9. **Transition Ticket:** Move JIRA ticket to "Code Review" and assign to Reviewer, then invoke `/code-review <MR_URL>`. Log transition `{JIRA_KEY}: {oldStatus} → {newStatus}, assignee → {accountId}`.
10. **Credential Safety (STRICT):** NEVER print, log, or output GITHUB_TOKEN, JIRA_TOKEN, or ~/.env contents to stdout or stderr.

## Utility Scripts

### 1. `figma_pixel_sampler.py`
Samples pixel colors from screenshots and reads Tailwind breakpoints.

```python
import sys
import json
import os
import re

try:
    from PIL import Image
except ImportError:
    print(json.dumps({"error": "PIL/Pillow not installed. Run: pip install pillow"}))
    sys.exit(1)

def detect_tailwind_breakpoints():
    defaults = {"sm": "640px", "md": "768px", "lg": "1024px", "xl": "1280px", "2xl": "1536px"}
    for f in ["tailwind.config.ts", "tailwind.config.js", "tailwind.config.mjs"]:
        if os.path.exists(f):
            try:
                with open(f) as file:
                    content = file.read()
                    screens = re.findall(r'screens:\s*\{(.*?)\}', content, re.DOTALL)
                    if screens:
                        pairs = re.findall(r'[\'"]?([a-zA-Z0-9_-]+)[\'"]?\s*:\s*[\'"]?([0-9a-zA-Z_-]+)[\'"]?', screens[0])
                        if pairs:
                            return dict(pairs)
            except Exception:
                pass
    return defaults

def sample_pixels(image_path, points):
    if not os.path.exists(image_path):
        print(json.dumps({"error": f"Image not found: {image_path}"}))
        sys.exit(1)
        
    try:
        img = Image.open(image_path).convert('RGB')
        w, h = img.size
        results = {"width": w, "height": h, "tailwind_breakpoints": detect_tailwind_breakpoints(), "colors": {}}
        
        for name, coords in points.items():
            x, y = coords
            if x < 0 or x >= w or y < 0 or y >= h:
                results["colors"][name] = {"status": "out_of_bounds", "x": x, "y": y}
                continue
            r, g, b = img.getpixel((x, y))
            results["colors"][name] = {
                "rgb": f"rgb({r},{g},{b})",
                "hex": f"#{r:02x}{g:02x}{b:02x}"
            }
        print(json.dumps(results, indent=2))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 figma_pixel_sampler.py <IMAGE_PATH> '<POINTS_JSON>'")
        sys.exit(1)
    try:
        pts = json.loads(sys.argv[2])
    except Exception as e:
        print(json.dumps({"error": f"Invalid JSON: {e}"}))
        sys.exit(1)
    sample_pixels(sys.argv[1], pts)
```

### 2. `check_image_urls.py`
Checks a list of image URLs for broken 404 errors.

```python
import sys
import json
import urllib.request
import urllib.error

def check_urls(urls):
    results = {}
    for url in urls:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        try:
            with urllib.request.urlopen(req, timeout=5) as res:
                results[url] = {"status": "ok", "code": res.status}
        except urllib.error.HTTPError as e:
            results[url] = {"status": "broken", "code": e.code}
        except Exception as e:
            results[url] = {"status": "error", "error": str(e)}
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 check_image_urls.py <URL1> <URL2> ... or JSON list")
        sys.exit(1)
    args = sys.argv[1:]
    if len(args) == 1 and args[0].strip().startswith('['):
        try:
            urls = json.loads(args[0])
        except Exception:
            urls = args
    else:
        urls = args
    check_urls(urls)
```

### 3. `verify_github_pr_access.py`
Verifies Git credentials and repository permissions safely.

```python
import subprocess
import sys
import json
import os

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

def verify_access():
    env = load_env()
    dev_token = env.get('GITHUB_TOKEN')
    
    run_env = os.environ.copy()
    if dev_token:
        run_env['GITHUB_TOKEN'] = dev_token
        
    try:
        res = subprocess.run(["gh", "auth", "status"], capture_output=True, text=True, env=run_env)
        status = {
            "gh_auth_ok": res.returncode == 0,
            "gh_auth_output": res.stderr + res.stdout,
            "token_loaded": dev_token is not None
        }
    except FileNotFoundError:
        status = {
            "gh_auth_ok": False,
            "gh_auth_output": "Error: 'gh' CLI tool not found in PATH.",
            "token_loaded": dev_token is not None
        }
    
    if os.path.exists(".git"):
        try:
            remote_res = subprocess.run(["git", "remote", "get-url", "origin"], capture_output=True, text=True)
            if remote_res.returncode == 0:
                status["git_remote"] = remote_res.stdout.strip()
        except Exception as e:
            status["git_error"] = str(e)
            
    print(json.dumps(status, indent=2))
    if not status["gh_auth_ok"]:
        sys.exit(1)

if __name__ == "__main__":
    verify_access()
```
