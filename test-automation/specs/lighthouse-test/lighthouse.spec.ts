import { test, expect } from "@playwright/test";
import { runLighthouse } from "../../lighthouse/lighthouse-runner";
import { LIGHTHOUSE_THRESHOLDS, PAGES_TO_TEST, RESOLUTIONS } from "../../lighthouse/lighthouse-thresholds";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

for (const page of PAGES_TO_TEST) {
  for (const resolution of RESOLUTIONS) {
    test(`Lighthouse scores: ${page.name} at ${resolution.name} (${resolution.width}x${resolution.height})`, async () => {
      const scores = await runLighthouse({
        url: `${BASE_URL}${page.path}`,
        config: {
          formFactor: resolution.mobile ? "mobile" : "desktop",
          screenEmulation: {
            mobile: resolution.mobile,
            disabled: false,
            width: resolution.width,
            height: resolution.height,
            deviceScaleFactor: resolution.mobile ? 2 : 1,
          },
        },
      });
      expect(scores.performance, `${page.name}@${resolution.name} performance`).toBeGreaterThanOrEqual(LIGHTHOUSE_THRESHOLDS.performance);
      expect(scores.accessibility, `${page.name}@${resolution.name} accessibility`).toBeGreaterThanOrEqual(LIGHTHOUSE_THRESHOLDS.accessibility);
      expect(scores.bestPractices, `${page.name}@${resolution.name} best-practices`).toBeGreaterThanOrEqual(LIGHTHOUSE_THRESHOLDS.bestPractices);
      expect(scores.seo, `${page.name}@${resolution.name} SEO`).toBeGreaterThanOrEqual(LIGHTHOUSE_THRESHOLDS.seo);
    });
  }
}
