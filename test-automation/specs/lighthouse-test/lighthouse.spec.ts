import { test } from "@fixtures/ui-fixtures";

test("Lighthouse scores: Home page at all resolutions", async ({ lighthouseAuditPage }, testInfo) => {
  await lighthouseAuditPage.assertScoresForPage("Home", "/", testInfo);
});

test("Lighthouse scores: Properties page at all resolutions", async ({ lighthouseAuditPage }, testInfo) => {
  await lighthouseAuditPage.assertScoresForPage("Properties", "/properties", testInfo);
});

test("Lighthouse scores: Services page at all resolutions", async ({ lighthouseAuditPage }, testInfo) => {
  await lighthouseAuditPage.assertScoresForPage("Services", "/services", testInfo);
});

test("Lighthouse scores: About Us page at all resolutions", async ({ lighthouseAuditPage }, testInfo) => {
  await lighthouseAuditPage.assertScoresForPage("About Us", "/about-us", testInfo);
});

test("Lighthouse scores: Contact page at all resolutions", async ({ lighthouseAuditPage }, testInfo) => {
  await lighthouseAuditPage.assertScoresForPage("Contact", "/contact", testInfo);
});

test("Lighthouse scores: Learn More page at all resolutions", async ({ lighthouseAuditPage }, testInfo) => {
  await lighthouseAuditPage.assertScoresForPage("Learn More", "/learn-more", testInfo);
});
