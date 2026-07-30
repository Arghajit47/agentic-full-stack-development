import { test } from "@fixtures/ui-fixtures";

test.describe("Contact Page Suite", () => {
  test("Contact page renders with header and office section", async ({ contactPage }) => {
    await contactPage.navigateToContact();
    await contactPage.assertPageRenders();
  });

  test("Contact page office and gallery data matches API", async ({ contactPage }) => {
    await contactPage.assertHeadingsMatchApi();
  });

  test("Contact page has no console or image errors", async ({ contactPage }) => {
    await contactPage.assertNoConsoleErrors();
    await contactPage.assertNoImage404s();
  });

  test("Contact page general contact form submits successfully", async ({ contactPage }) => {
    await contactPage.submitGeneralContactForm();
  });
});
