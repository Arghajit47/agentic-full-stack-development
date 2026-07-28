# Quick Start: Automated Pipeline

## TL;DR - How to Use

### Option 1: Full Automation (Once Configured)
```bash
# Just start with the ticket
/developer KAN-29

# Everything else happens automatically:
# → Creates PR
# → Code review runs
# → QA tests
# → Merges & closes ticket
```

### Option 2: Manual Steps (Current)
```bash
# Step by step
/developer KAN-29    # Implement & create PR
/code-review PR #54  # Review the PR
/qa KAN-29           # Test acceptance criteria
gh pr merge 54       # Merge if all pass
```

## What Got Configured

### 1. GitHub Actions ✅
**File**: `.github/workflows/automated-pipeline.yml`
- Runs on every PR
- Auto-tests code
- Auto-labels PR
- Posts pipeline status

### 2. Pipeline Config ✅
**File**: `.jcode/pipeline-config.json`
- Defines the 5-stage pipeline
- Sets auto-invoke rules
- Configures JIRA integration

### 3. Documentation ✅
**File**: `docs/AUTOMATED-PIPELINE-SETUP.md`
- Full architecture explanation
- Setup instructions
- Troubleshooting guide

## How It Should Work (Future)

```
┌─────────────┐
│   /ba       │ Create ticket
└──────┬──────┘
       │ auto-invoke
┌──────▼────────┐
│  /developer   │ Implement + PR
└──────┬────────┘
       │ auto-invoke (on PR created)
┌──────▼────────┐
│ /code-review  │ Review code
└──────┬────────┘
       │ auto-invoke (on approved)
┌──────▼────────┐
│    /qa        │ Test ACs
└──────┬────────┘
       │ auto-invoke (on pass)
┌──────▼────────┐
│  merge + done │ Auto-merge
└───────────────┘
```

## What's Missing for Full Automation

### Short-term (Easy to add)
1. **Hook in developer agent** to auto-invoke code review after PR creation
2. **Hook in code review** to auto-invoke QA after approval
3. **Add merge script** to auto-merge after QA pass

### Long-term (Requires infrastructure)
1. **Webhook server** to receive GitHub events
2. **Hermes Agent API** endpoint for external triggers
3. **Deploy** webhook server to accessible URL

## Testing the Pipeline

### Demo Script
```bash
./scripts/run-pipeline.sh KAN-29
```

This simulates the full automated flow.

### Real Test
```bash
# 1. Create a test ticket
/ba "Test pipeline automation"

# 2. Note the ticket number (e.g., KAN-XX)

# 3. Run developer agent
/developer KAN-XX

# 4. Check if it auto-invoked code review
# (Currently manual: /code-review PR #XX)

# 5. Approve the review

# 6. Check if it auto-invoked QA
# (Currently manual: /qa KAN-XX)
```

## Next Actions

### To enable auto-invoke RIGHT NOW:

1. **Modify the developer agent** to call code review after PR:
   ```typescript
   // In developer-agent-ecosystem skill
   after PR creation:
   spawn('/code-review', {pr_number: prNumber})
   ```

2. **Modify code review agent** to call QA after approval:
   ```typescript
   // In mr-code-review skill
   if (reviewStatus === 'APPROVED'):
   spawn('/qa', {ticket: extractTicket(pr.title)})
   ```

3. **Modify QA agent** to merge after pass:
   ```typescript
   // In quality-analyst skill
   if (allTestsPass):
   exec(`gh pr merge ${prNumber} --squash`)
   exec(`jcode jira transition ${ticket} "Done"`)
   ```

### Files to Edit:
- `skills/developer-agent-ecosystem.md` - Add auto-invoke after PR
- `skills/mr-code-review.md` - Add auto-invoke after approval  
- `skills/quality-analyst.md` - Add auto-merge after pass

## Configuration Reference

### Pipeline Stages
1. **BA** → Creates tickets with ACs
2. **Developer** → Implements + creates PR
3. **Code Review** → Reviews code quality
4. **QA** → Tests acceptance criteria
5. **Merge** → Merges PR + transitions ticket

### Auto-Invoke Triggers
- BA → Developer: `on-ticket-created`
- Developer → Code Review: `on-pr-created`
- Code Review → QA: `on-review-approved`
- QA → Merge: `on-qa-pass`

### Success Criteria
Each stage requires:
- **Developer**: Build passes, tests pass, PR created
- **Code Review**: APPROVED status, no blocking issues
- **QA**: All ACs met, no critical bugs
- **Merge**: All above ✅

## Questions?

Read the full setup guide:
`docs/AUTOMATED-PIPELINE-SETUP.md`
