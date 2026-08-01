import { test } from "@fixtures/ui-fixtures";

test("Lighthouse scores: Home page at all resolutions", async ({ lighthouseAuditPage }) => {
  await lighthouseAuditPage.assertScoresForPage("Home", "/");
});

test("Lighthouse scores: Properties page at all resolutions", async ({ lighthouseAuditPage }) => {
  await lighthouseAuditPage.assertScoresForPage("Properties", "/properties");
});

test("Lighthouse scores: Services page at all resolutions", async ({ lighthouseAuditPage }) => {
  await lighthouseAuditPage.assertScoresForPage("Services", "/services");
});

test("Lighthouse scores: About Us page at all resolutions", async ({ lighthouseAuditPage }) => {
  await lighthouseAuditPage.assertScoresForPage("About Us", "/about-us");
});

test("Lighthouse scores: Contact page at all resolutions", async ({ lighthouseAuditPage }) => {
  await lighthouseAuditPage.assertScoresForPage("Contact", "/contact");
});
