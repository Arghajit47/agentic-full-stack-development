# Test Automation

Playwright-based test automation for the agentic-full-stack-development project.

Isolated package — own `package.json`, `tsconfig.json`, `node_modules`. Zero dependency overlap with the dev environment.

## Structure

```mermaid
test-automation/
  constants/        All magic values (URLs, paths, field lists, seed counts, table names)
  base/             BaseAPI — common HTTP actions, assertions, DB helpers
  pages/            Page objects — one file per API/page, extends BaseAPI
  fixtures/         Playwright test.extend() — auto init/dispose page objects
  specs/            Test files — zero logic, only page object calls
  playwright.api.config.ts   API tests (workers=1, serialized)
  playwright.ui.config.ts    UI tests (parallel)
```

## Commands

```bash
npm run test:api    Run API tests (serialized)
npm run test:ui     Run UI tests (parallel)
npm run test        Run both
npm run test:report Open HTML report
```