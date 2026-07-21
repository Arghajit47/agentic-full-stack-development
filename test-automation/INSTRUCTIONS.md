# 🚨 MANDATORY TEST AUTOMATION ARCHITECTURE & SYSTEM DIRECTIVES

> **ATTENTION ALL AI AGENTS & DEVELOPERS:**
> THIS DOCUMENT IS THE SUPREME SPECIFICATION FOR THIS REPOSITORY'S AUTOMATION FRAMEWORK.
> YOU MUST READ, COMPLY WITH, AND STRICTLY ENFORCE EVERY SINGLE RULE AND PATTERN DETAILED HEREIN.
> **ZERO TOLERANCE FOR DEVIATIONS, MOCK FALLBACKS, EXTRA SPEC FILES, OR RAW LOCATORS.**

---

## 📋 TABLE OF CONTENTS
1. [Core Architectural Philosophy](#1-core-architectural-philosophy)
2. [Folder Structure & File Naming Conventions](#2-folder-structure--file-naming-conventions)
3. [Strict Layering & Dependency Flow](#3-strict-layering--dependency-flow)
4. [Detailed Layer Specification & Templates](#4-detailed-layer-specification--templates)
   - [A. Constants Layer (`constants/`)](#a-constants-layer-constants)
   - [B. Locators Layer (`locators/`)](#b-locators-layer-locators)
   - [C. Base Layer (`base/`)](#c-base-layer-base)
   - [D. Pages Layer (`pages/`)](#d-pages-layer-pages)
   - [E. Fixtures Layer (`fixtures/`)](#e-fixtures-layer-fixtures)
   - [F. Specs Layer (`specs/`)](#f-specs-layer-specs)
5. [The 10 Non-Negotiable AI Rules (DOs & DON'Ts)](#5-the-10-non-negotiable-ai-rules-dos--donts)
6. [Verification & Definition of Done](#6-verification--definition-of-done)

---

## 1. CORE ARCHITECTURAL PHILOSOPHY

The test automation framework relies on a **Strict Page Object Model (POM) + Custom Fixtures** architecture.

Key principles:
1. **Single Source of Truth**: Text copy, expected counts, API paths, and grid configs MUST be stored in `constants/`.
2. **Full CSS Selector Encapsulation**: Locators live exclusively in `locators/` and MUST be full CSS attribute selectors (`[data-testid="..."]`).
3. **No UI Raw Locators in Pages or Specs**: Page objects pass locator keys to `this.initializationPage` methods. Specs never touch locators.
4. **Single Spec File Per UI Page or Backend Domain**: `home-page.spec.ts` handles the Home page; `properties-page.spec.ts` handles the Properties page; `api-endpoints.spec.ts` handles Backend APIs.
5. **No AI Shortcuts or Mock Fallbacks**: Tests MUST validate real, dynamic API responses against real UI elements without silent swallows, try/catch fallbacks, or dummy data injection.

---

## 2. FOLDER STRUCTURE & FILE NAMING CONVENTIONS

```
test-automation/
├── base/
│   ├── api-base.ts                  # ApiHelper class for API requests (baseURL pre-configured)
│   └── ui-base.ts                   # InitializationPage class with generic UI interactions & assertions
├── constants/
│   ├── api-constants.ts             # API endpoints, TypeScript interfaces, & Zod validation schemas
│   ├── homepage-constants.ts        # UI copy, grid column rules, expected counts for Home page
│   ├── properties-constants.ts      # UI copy, grid column rules, expected counts for Properties page
│   └── index.ts                     # Single barrel re-export for ALL constants
├── fixtures/
│   ├── api-fixtures.ts              # Playwright test extension injecting `backendApi`
│   └── ui-fixtures.ts               # Playwright test extension injecting `homepage` & `propertiesPage`
├── locators/
│   ├── homepage-locators.ts         # Full CSS attribute selectors ([data-testid="..."]) for Home page
│   └── propertiespage-locators.ts   # Full CSS attribute selectors ([data-testid="..."]) for Properties page
├── pages/
│   ├── backend/
│   │   └── api.ts                   # BackendApi page object encapsulating standalone API & schema validation
│   └── frontend/
│       ├── home-page.ts             # HomePage page object using InitializationPage & ApiHelper
│       └── properties-page.ts       # PropertiesPage page object using InitializationPage & ApiHelper
├── specs/
│   ├── backend-test/
│   │   └── api-endpoints.spec.ts    # Single spec file for backend API schema & status 200 checks
│   └── frontend-integration-test/
│       ├── home-page.spec.ts        # Single spec file for Home page UI & integration
│       └── properties-page.spec.ts  # Single spec file for Properties page UI & integration
├── global-setup.js                  # Global setup (seeds DB before test runs)
├── package.json                     # Test scripts (`npm run test`, `npm run test:ui`, `npm run test:api`)
├── playwright.config.ts             # Main Playwright configuration defining projects
└── tsconfig.json                    # TypeScript configuration with path aliases (@base, @pages, etc.)
```

---

## 3. STRICT LAYERING & DEPENDENCY FLOW

```
[ specs/ ]  ──────>  [ fixtures/ ]  ──────>  [ pages/ ]  ──────>  [ base/ ]
  (Zero logic)       (Injects POMs)       (Encapsulates actions)   (Generic helpers)
                                                    │
                                                    ▼
                                          [ locators/ & constants/ ]
                                          (Selectors & Single Source of Truth)
```

**Allowed Import Directions**:
- `specs/` CAN import from `@fixtures/*`, `@constants/*`, `@base/*`.
- `fixtures/` CAN import from `@pages/*`, `@playwright/test`.
- `pages/` CAN import from `@base/*`, `@locators/*`, `@constants/*`, `@playwright/test`.
- `base/` CAN import from `@constants/*`, `@playwright/test`.
- `locators/` and `constants/` NEVER import from `pages/`, `specs/`, or `fixtures/`.

**FORBIDDEN Imports**:
- Specs MUST NOT import locators directly.
- Specs MUST NOT import raw `page` fixtures if custom fixtures (`homepage`, `propertiesPage`, `backendApi`) are available.
- Relative imports (`../`, `../../`) are **STRICTLY PROHIBITED**. Use `@` aliases (`@base/*`, `@pages/*`, `@locators/*`, `@constants/*`, `@fixtures/*`, `@utils/*`).

---

## 4. DETAILED LAYER SPECIFICATION & TEMPLATES

### A. Constants Layer (`constants/`)
Contains all static copy text, endpoint URLs, grid column expectations, TypeScript interfaces, and Zod schemas.

**Example `constants/api-constants.ts`**:
```typescript
import { z } from "zod";

export const API_PATHS = {
  PROPERTIES_FEATURED: "/api/properties/featured",
  REVIEWS_FEATURED: "/api/reviews/featured",
  PROPERTIES: "/api/properties",
  SETTINGS: "/api/settings",
} as const;

export const propertySchema = z.object({
  id: z.number().int(),
  slug: z.string(),
  title: z.string(),
  price: z.number().int(),
  location: z.string(),
  bedrooms: z.number().int(),
  bathrooms: z.number().int(),
  areaSqft: z.number().int(),
  imageUrl: z.string(),
});
```

---

### B. Locators Layer (`locators/`)
Stores complete CSS selector strings. All keys MUST be full CSS attribute selectors using `[data-testid="..."]`.

**Example `locators/homepage-locators.ts`**:
```typescript
export const HOMEPAGE_LOCATORS = {
  featuredSection: '[data-testid="featured-section"]',
  featuredCard: '[data-testid="property-card"]',
  reviewsGrid: '[data-testid="reviews-grid"]',
  reviewCard: '[data-testid="review-card"]',
} as const;
```

---

### C. Base Layer (`base/`)
- `InitializationPage`: Provides atomic UI actions (`goto`, `click`, `fill`, `selectOption`, `expectText`, `expectVisible`, `assertGridTrackCount`, `assertNoConsoleErrors`, `assertNoImage404s`, `validateCardsDataAgainstApi`).
- `ApiHelper`: Wraps Playwright `request.newContext` pre-configured with `baseURL: BASE_URL`.

---

### D. Pages Layer (`pages/`)
Encapsulates user workflows and domain assertions into readable methods.

**Example `pages/frontend/home-page.ts`**:
```typescript
import { expect, type Page } from "@playwright/test";
import InitializationPage from "@base/ui-base";
import { ApiHelper } from "@base/api-base";
import { HOMEPAGE_LOCATORS } from "@locators/homepage-locators";
import { UI_ROUTES, UI_TEXT } from "@constants/index";

export class HomePage {
  private initializationPage: InitializationPage;
  private apiHelper: ApiHelper;

  constructor(page: Page) {
    this.initializationPage = new InitializationPage(page);
    this.apiHelper = new ApiHelper();
  }

  async assertPageComponents(): Promise<void> {
    await this.initializationPage.goto(UI_ROUTES.HOME);
    await this.initializationPage.expectVisible(HOMEPAGE_LOCATORS.featuredSection);
  }
}
```

---

### E. Fixtures Layer (`fixtures/`)
Extends Playwright `test` to inject instantiated page objects automatically.

**Example `fixtures/ui-fixtures.ts`**:
```typescript
import { test as base } from "@playwright/test";
import { HomePage } from "@pages/frontend/home-page";
import { PropertiesPage } from "@pages/frontend/properties-page";

type UiFixtures = {
  homepage: HomePage;
  propertiesPage: PropertiesPage;
};

export const test = base.extend<UiFixtures>({
  homepage: async ({ page }, use) => {
    const hp = new HomePage(page);
    await use(hp);
  },
  propertiesPage: async ({ page }, use) => {
    const pp = new PropertiesPage(page);
    await use(pp);
  },
});

export { expect } from "@playwright/test";
```

---

### F. Specs Layer (`specs/`)
Contains ONLY test declarations calling fixture methods. Zero Playwright locators, zero raw logic, zero conditionals.

**Example `specs/frontend-integration-test/home-page.spec.ts`**:
```typescript
import { test } from "@fixtures/ui-fixtures";

test.describe("Home Page Test Suite", () => {
  test("Home Page components, responsive layout", async ({ homepage }) => {
    await homepage.assertPageComponents();
  });
});
```

---

## 5. THE 10 NON-NEGOTIABLE AI RULES (DOs & DON'Ts)

### Rule 1: NO Multiple Spec Files for the Same Page / Domain
- ❌ **DON'T**: Create `home-page-part1.spec.ts`, `home-page-search.spec.ts`, or `kan-58.spec.ts`.
- ✅ **DO**: Put all UI integration tests for Home page into `specs/frontend-integration-test/home-page.spec.ts`.

### Rule 2: NO Bare / Raw Locator Strings in Page Files or Specs
- ❌ **DON'T**: Write `page.locator('.card')` or `this.initializationPage.click('submit-btn')`.
- ✅ **DO**: Store `[data-testid="submit-btn"]` in `locators/*.ts` and pass `HOMEPAGE_LOCATORS.submitBtn`.

### Rule 3: NO Relative Imports (`../` or `../../`)
- ❌ **DON'T**: `import { HomePage } from "../../pages/frontend/home-page";`
- ✅ **DO**: `import { HomePage } from "@pages/frontend/home-page";`

### Rule 4: NO Hardcoded Text, Numbers, or Base URLs
- ❌ **DON'T**: `await apiHelper.getRequest("https://real-estates-estatein.netlify.app/api/properties")` or `expect(text).toBe("Find Your Dream Property")`.
- ✅ **DO**: Use `API_PATHS.PROPERTIES` and `PROPERTIES_TEXT.HEADING` from `@constants/index`.

### Rule 5: NO Raw Logic or Loops in Spec Files
- ❌ **DON'T**: Write `for (const item of data) { ... }` or `if (condition) { ... }` inside a `test(...)` block in `specs/`.
- ✅ **DO**: Move all loops, array parsing, and assertions into Page Object methods in `pages/`.

### Rule 6: ALWAYS Validate API Responses with Zod Schemas
- ❌ **DON'T**: Check only `response.status === 200` without schema checks.
- ✅ **DO**: Call `propertySchema.safeParse(item)` and assert `parsed.success === true`.

### Rule 7: NO Try/Catch Error Swallowing or Dummy Fallbacks
- ❌ **DON'T**: Wrap failing assertions in `try { ... } catch { return dummyData; }` to mask test failures.
- ✅ **DO**: Let assertions fail naturally so root causes can be diagnosed and fixed cleanly.

### Rule 8: ALWAYS Use Project Definitions in `playwright.config.ts`
- ❌ **DON'T**: Create separate scattered config files like `playwright.ui.config.ts` or `playwright.api.config.ts`.
- ✅ **DO**: Use `playwright.config.ts` with named projects (`frontend-integration-test` and `backend-test`).

### Rule 9: NEVER Mutate or Import Test Files in Web App Source Code
- ❌ **DON'T**: Import anything from `test-automation/` inside `src/app/` or `src/components/`.
- ✅ **DO**: Keep `test-automation/` completely isolated.

### Rule 10: MANDATORY Verification Before Completing Any Task
- ❌ **DON'T**: Claim a task is complete after editing files without running verification commands.
- ✅ **DO**: Execute and confirm 100% pass on:
  1. `PATH=/usr/local/bin:$PATH npx tsc --noEmit`
  2. `npm run test` (`npm run test:api` && `npm run test:ui`)

---

## 6. VERIFICATION & DEFINITION OF DONE

Every single change to this test automation framework MUST satisfy the following Definition of Done:

1. **TypeScript Compilation**: `npx tsc --noEmit` returns **0 errors**.
2. **API Tests Pass**: `npm run test:api` passes **100% (4/4 passed)**.
3. **UI Tests Pass**: `npm run test:ui` passes **100% (11/11 passed)**.
4. **Full Test Suite Passes**: `npm run test` passes **100% (15/15 passed)**.
5. **Zero Linter/Import Violations**: No relative imports (`../`), no bare locators, no inline magic strings.