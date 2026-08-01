import { test } from "@fixtures/ui-fixtures";

test("Property details page renders live API data", async ({ propertyDetailsPage }) => {
  await propertyDetailsPage.assertLiveApiDataValidation();
});

test("Property details pricing breakdown loads from API", async ({ propertyDetailsPage }) => {
  await propertyDetailsPage.assertPricingBreakdownFromApi();
});

test("Property details inquiry form submits", async ({ propertyDetailsPage }) => {
  await propertyDetailsPage.assertInquiryFormSubmission();
});

test("Property details page is responsive at all breakpoints", async ({ propertyDetailsPage }) => {
  await propertyDetailsPage.assertResponsiveLayout();
});

test("Property details page has no console or image errors", async ({ propertyDetailsPage }) => {
  await propertyDetailsPage.assertNoConsoleOrImageErrors();
});

test("KAN-120: Note card label is white and container is center-aligned (no border pill)", async ({ propertyDetailsPage }) => {
  await propertyDetailsPage.assertNoteCardAlignment();
});
