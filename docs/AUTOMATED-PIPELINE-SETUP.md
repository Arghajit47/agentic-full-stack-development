# Automated Development Pipeline Configuration

This document explains how the automated development pipeline works and how to configure it.

## Architecture

```
┌─────────────┐
│   BA Agent  │ Creates JIRA tickets with acceptance criteria
└──────┬──────┘
       │
       ↓ (auto-invoke)
┌──────────────┐
│ Dev Agent    │ Implements feature, creates PR
└──────┬───────┘
       │
       ↓ (GitHub Action + webhook)
┌──────────────┐
│ Code Review  │ Reviews PR, posts feedback
└──────┬───────┘
       │
       ↓ (if approved)
┌──────────────┐
│  QA Agent    │ Tests against acceptance criteria
└──────┬───────┘
       │
       ↓ (if passed)
┌──────────────┐
│ Merge & Done │ Auto-merge PR, transition JIRA to Done
└──────────────┘
```

## Components

### 1. GitHub Actions Workflow
**File**: `.github/workflows/automated-pipeline.yml`

**Triggers**:
- On PR opened/updated to `main`
- Runs tests automatically
- Extracts JIRA ticket from PR title
- Auto-labels PR based on type (frontend/backend/integration)
- Posts status comment on PR

**Configuration**:
```yaml
# Already configured in .github/workflows/automated-pipeline.yml
# No changes needed
```

### 2. Jcode Agent Orchestration
**File**: `.jcode/pipeline-config.json` (to be created)

**Workflow Rules**:
```json
{
  "pipeline": {
    "enabled": true,
    "stages": [
      {
        "name": "development",
        "skill": "developer-agent-ecosystem",
        "trigger": "manual",
        "autoInvokeNext": true
      },
      {
        "name": "code-review",
        "skill": "mr-code-review",
        "trigger": "on-pr-created",
        "autoInvokeNext": "on-approval"
      },
      {
        "name": "qa",
        "skill": "quality-analyst",
        "trigger": "on-review-approved",
        "autoInvokeNext": "on-pass"
      },
      {
        "name": "merge",
        "action": "auto-merge",
        "trigger": "on-qa-pass",
        "jiraTransition": "Done"
      }
    ]
  }
}
```

### 3. GitHub Webhooks (Optional but Recommended)

Configure webhooks in GitHub repo settings to trigger agents:

**Settings → Webhooks → Add webhook**

**Webhook URLs** (replace with your Hermes Agent endpoint):
```
https://your-hermes-instance.com/webhook/pr-event
```

**Events to subscribe**:
- ✅ Pull requests
- ✅ Pull request reviews
- ✅ Status checks

**Payload**:
The webhook will receive PR data and trigger the appropriate agent.

## How to Use

### Manual Trigger (Current Approach)
```bash
# After creating a ticket in JIRA
/developer KAN-29

# This should auto-invoke the next steps, but currently needs:
/code-review PR #54
/qa KAN-29
```

### Automated Trigger (Future Setup)

Once webhooks are configured:

1. **Create JIRA ticket** → `/ba` skill
2. **Start development** → `/developer KAN-XX`
3. **Push code & create PR** → GitHub Action runs tests
4. **Code review triggered** → Agent reviews PR automatically
5. **If approved** → QA agent runs automatically
6. **If QA passes** → PR merges, JIRA → Done

## Configuration Files Needed

### 1. Create `.jcode/pipeline-config.json`
```json
{
  "pipeline": {
    "enabled": true,
    "autoInvokeChain": [
      "developer-agent-ecosystem",
      "mr-code-review",
      "quality-analyst"
    ],
    "jira": {
      "transitionOnMerge": "Done",
      "commentOnPR": true
    },
    "github": {
      "autoMerge": true,
      "requireReviewApproval": true,
      "requireQAPass": true
    }
  }
}
```

### 2. Create `.jcode/webhook-handler.ts` (if using webhooks)
```typescript
// Webhook handler to receive GitHub events and trigger agents
import { spawn } from 'child_process';

export async function handlePRWebhook(payload: any) {
  const prNumber = payload.number;
  const prTitle = payload.pull_request.title;
  const ticket = extractJiraTicket(prTitle);
  
  if (payload.action === 'opened' || payload.action === 'synchronize') {
    // Trigger code review agent
    spawn('jcode', ['/code-review', `PR #${prNumber}`]);
  }
  
  if (payload.action === 'review' && payload.review.state === 'approved') {
    // Trigger QA agent
    spawn('jcode', ['/qa', ticket]);
  }
}

function extractJiraTicket(title: string): string {
  const match = title.match(/\[?([A-Z]+-\d+)\]?/);
  return match ? match[1] : '';
}
```

### 3. Update `.env` with webhook secrets
```bash
# Add to your .env file
GITHUB_WEBHOOK_SECRET=your-webhook-secret-here
HERMES_AGENT_URL=http://localhost:3000
```

## Testing the Pipeline

### Test Manually
```bash
# 1. Create a test ticket
/ba create ticket "Test automation pipeline"

# 2. Implement feature
/developer KAN-XX

# 3. Verify auto-invoke (check console output)
# Should see: "✅ Implementation complete, triggering code review..."

# 4. Check PR was created and labeled
gh pr view

# 5. Verify code review was triggered
# Check PR comments for review results

# 6. Approve PR (simulate)
gh pr review --approve

# 7. Verify QA was auto-triggered
# Check PR comments for QA results
```

### Test with Webhooks
```bash
# 1. Start webhook listener (if configured)
npm run webhook-server

# 2. Create PR via GitHub UI
# 3. Watch console for automatic agent invocations
# 4. Approve PR
# 5. Watch for auto-merge after QA pass
```

## Current Status

### ✅ Implemented
- Developer agent creates PR
- GitHub Actions run tests on PR
- JIRA ticket updated with PR link
- PR auto-labeled based on type

### ⏳ To Configure
- **Auto-invoke code review** after PR creation
- **Auto-invoke QA** after review approval
- **Auto-merge** after QA pass
- **Webhook integration** for event-driven triggers

### 📝 Next Steps

1. **Short-term** (No webhook setup needed):
   - Add post-PR-creation hook in developer agent to invoke code review
   - Add post-review hook to invoke QA agent
   
2. **Long-term** (Full automation):
   - Set up webhook server
   - Configure GitHub webhooks
   - Deploy Hermes Agent with webhook endpoint

## Skills Involved

| Skill | Purpose | Trigger |
|-------|---------|---------|
| `/ba` | Business Analyst - Creates tickets | Manual |
| `/developer` | Developer - Implements feature | Manual or auto from `/ba` |
| `/code-review` | Reviews PR code | **Should be auto** from PR creation |
| `/qa` | Tests against acceptance criteria | **Should be auto** after review approval |

## References

- **Developer Ecosystem Skill**: `skills/developer-agent-ecosystem.md`
- **Code Review Skill**: `skills/mr-code-review.md`
- **QA Skill**: `skills/quality-analyst.md`
- **GitHub Actions**: `.github/workflows/automated-pipeline.yml`

## Troubleshooting

### Pipeline not auto-invoking?
Check:
1. Is `pipeline.enabled: true` in config?
2. Are the skill names correct?
3. Check Jcode console for errors
4. Verify JIRA credentials in `.env`

### Webhook not receiving events?
Check:
1. Webhook URL is accessible (use ngrok for local testing)
2. GitHub webhook secret matches `.env`
3. Check GitHub webhook delivery logs
4. Verify firewall settings

### Agent stuck or not responding?
Check:
1. Agent session status: `jcode status`
2. Check agent logs
3. Restart stuck agents: `jcode kill <session>`
