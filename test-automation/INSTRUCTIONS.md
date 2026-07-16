# Test Automation Instructions

Strict rules. No exceptions. Code review enforces every line below.

## 1. Architecture

POM-Fixture pattern. Three layers, strict dependency direction:

```
specs/ → fixtures/ → pages/ → base/
                                ↑
                            constants/
```

- **base/**: `BaseAPI` abstract class. Common HTTP actions (`get`), common assertions (`assertStatus`, `assertArray`, `assertObject`, `assertEmptyArray`, `assertEmptyObject`, `assertMaxCount`, `assertSchemaEach`, `assertSchemaObject`), DB helpers (`reseed`, `clearTables`, `dbQuery`, `dbCount`). No page-specific logic. Never instantiate directly.
- **pages/**: One file per API endpoint or page. Extends `BaseAPI`. Contains page-specific actions (fetch, get entities) and page-specific assertions (assertAllFeatured, assertRatingRange, assertRequiredKeys). All assertions use `expect` from `@playwright/test`. No inline test data — use constants.
- **fixtures/**: `test.extend()` wrappers. Auto `reseed()` + `init()` before test, auto `dispose()` after. Specs never call `init()` or `dispose()` manually.
- **specs/**: Test files. Zero logic. Each test calls page object methods and `BaseAPI` static assertions only. No `execSync`, `readFileSync`, `fetch`, `request`, no loops, no conditionals, no try/catch. If you need any of that, it goes in a page object.
- **constants/**: All magic values. Single source of truth. No hardcoded strings or numbers anywhere else.

## 2. Naming Conventions

| Artifact | Rule | Example |
|----------|------|---------|
| Spec file | Functionality name, kebab-case, `.spec.ts` | `featured-properties.spec.ts` |
| Page file | Entity name, kebab-case, `-api.ts` suffix | `properties-api.ts` |
| Base file | `api-base.ts` | — |
| Fixture file | `api-fixtures.ts` | — |
| Constants file | `test-constants.ts` + `index.ts` barrel | — |
| Test title | Plain English, describes the behavior | `returns 200 with featured properties` |
| Page class | PascalCase, entity + API suffix | `PropertiesAPI`, `SchemaAPI` |
| Page method | camelCase, verb + noun | `fetchFeatured`, `assertAllFeatured` |
| Base assertion | `assert` + What + `assertStatus`, `assertArray` | — |
| Constant | UPPER_SNAKE_CASE | `SEED_COUNTS.PROPERTIES` |
| Constant group | UPPER_SNAKE_CASE object | `API_PATHS`, `TABLES` |

Spec files are named by functionality, NEVER by ticket ID. `featured-properties.spec.ts` not `kan-7.spec.ts`.

## 3. Constants

All magic values live in `constants/test-constants.ts`. Re-exported via `constants/index.ts`.

Current constants:
- `BASE_URL`, `DB_PATH`, `SCHEMA_PATH` — environment paths
- `API_PATHS` — endpoint paths
- `PROPERTY_FIELDS`, `REVIEW_FIELDS` — schema field lists
- `REQUIRED_SETTING_KEYS` — required setting keys
- `SEED_COUNTS` — expected seed data counts
- `MAX_FEATURED` — max returned items per endpoint
- `TABLES` — DB table names
- `RATING_RANGE` — valid rating bounds

Rules:
- No hardcoded numbers in specs, pages, or base. Use constants.
- No hardcoded strings (URLs, paths, table names) in specs, pages, or base. Use constants.
- Adding a new endpoint or page? Add its path, fields, and counts to constants first.
- Constants are `as const` objects. Keys are UPPER_SNAKE_CASE.

## 4. Import Statements

Use `@` path aliases ONLY. No `../` or `../../` in import statements.

| Alias | Maps to |
|-------|---------|
| `@base/*` | `./base/*` |
| `@pages/*` | `./pages/*` |
| `@fixtures/*` | `./fixtures/*` |
| `@constants/*` | `./constants/*` |
| `@src/*` | `../src/*` (dev source, use sparingly) |

Correct:
```ts
import { test, expect } from "@fixtures/api-fixtures";
import { BaseAPI, propertySchema } from "@base/api-base";
import { API_PATHS, SEED_COUNTS } from "@constants/index";
import { PropertiesAPI } from "@pages/properties-api";
```

Wrong:
```ts
import { test } from "../fixtures/api-fixtures";       // NO
import { BaseAPI } from "../../base/api-base";          // NO
import { propertySchema } from "../../src/lib/validators"; // NO — inline in base instead
```

Runtime file paths (not imports) like `../prisma/dev.db` in constants are acceptable — those are filesystem paths, not module imports.

## 5. Spec File Scope

A spec file tests ONE functionality. Not one ticket, not one endpoint group — one functionality.

- `featured-properties.spec.ts` — all tests for the featured properties API
- `featured-reviews.spec.ts` — all tests for the featured reviews API
- `site-settings.spec.ts` — all tests for the site settings API
- `security-and-seed.spec.ts` — security scan, schema validation, seed data correctness

Each test in a spec:
1. Calls a page object method (action or assertion)
2. Calls a `BaseAPI` static assertion if needed
3. Nothing else

```ts
test("returns 200 with featured properties", async ({ propertiesApi }) => {
  const res = await propertiesApi.fetchFeatured();
  BaseAPI.assertStatus(res, 200);
  const props = propertiesApi.getProperties(res);
  expect(props.length).toBe(SEED_COUNTS.FEATURED_PROPERTIES);
});
```

If a test needs `execSync`, `readFileSync`, `fetch`, a loop, a try/catch, or any branching logic — that logic goes in a page object method. The spec calls the method.

## 6. Fixtures

Fixtures in `fixtures/api-fixtures.ts` auto-manage page object lifecycle:

- `propertiesApi` — reseed + init before, dispose after
- `reviewsApi` — reseed + init before, dispose after
- `settingsApi` — reseed + init before, dispose after
- `schemaApi` — init before, dispose after (no reseed — schema tests manage their own seed state)

Specs use fixture injection: `async ({ propertiesApi }) => { ... }`. No `beforeEach`/`afterEach` for page objects.

Adding a new page object:
1. Create the class in `pages/`
2. Add it to `Fixtures` type in `fixtures/api-fixtures.ts`
3. Add the fixture setup (reseed if needed, init, use, dispose)
4. Use in specs via injection

## 7. Configuration

Two Playwright configs, split by test type:

| Config | Workers | Parallel | Use for |
|--------|---------|----------|---------|
| `playwright.api.config.ts` | 1 | false | API tests (shared SQLite DB) |
| `playwright.ui.config.ts` | default | true | UI tests (isolated browser contexts) |

API tests must serialize — they share a single SQLite file. UI tests run parallel — each test gets its own browser context.

## 8. Package Isolation

This package is forever isolated from the dev environment.

- Own `package.json` — no shared dependencies
- Own `tsconfig.json` — own path aliases
- Own `node_modules/` — gitignored
- Root `eslint.config.mjs` excludes `test-automation/**`
- Root `tsconfig.json` excludes `test-automation`

Never add `@playwright/test` to the root `package.json`. Never import from `test-automation/` in dev source code. Never import dev source code in test files (if needed, duplicate the type/schema — do not cross the boundary).

## 9. What Goes Where

| Need | Location |
|-----|----------|
| New endpoint path | `constants/test-constants.ts` → `API_PATHS` |
| New expected count | `constants/test-constants.ts` → `SEED_COUNTS` |
| New DB table name | `constants/test-constants.ts` → `TABLES` |
| Common assertion used by 2+ pages | `base/api-base.ts` as static method |
| Page-specific assertion | That page's file in `pages/` |
| New HTTP action (POST, PUT, DELETE) | `base/api-base.ts` as protected method |
| New page/endpoint test | New spec file in `specs/`, named by functionality |
| New page object | New file in `pages/`, extends `BaseAPI` |
| Zod schema for response validation | `base/api-base.ts` (inline, not imported from dev) |

## 10. Review Checklist

Before opening a PR, verify:

- [ ] Zero `../` in import statements
- [ ] Zero hardcoded strings/numbers in specs and pages (all from constants)
- [ ] Zero logic in spec files (no execSync, readFileSync, loops, try/catch, conditionals)
- [ ] Spec files named by functionality, not ticket ID
- [ ] New constants added to `constants/test-constants.ts` with UPPER_SNAKE_CASE
- [ ] New page objects extend `BaseAPI`
- [ ] New page objects added to fixtures if used by specs
- [ ] `npx tsc --noEmit` passes in both dev and test-automation
- [ ] `npm run lint` passes (root, 0 errors)
- [ ] All tests pass