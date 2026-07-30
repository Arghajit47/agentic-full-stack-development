export const CONTACT_TEXT = {
  PAGE_TITLE: "Get in Touch with Estatein",
  OFFICES_TITLE: "Our Offices",
} as const;

export const CONTACT_ERROR_MESSAGES = {
  ERROR_FALLBACK: "Unable to load contact information",
  EMPTY_FALLBACK: "No contact information available",
} as const;

export const CONTACT_FORM_TEST_DATA = {
  firstName: "QA",
  lastName: "E2E",
  email: "qa+e2e@estatein.test",
  phone: "+15551234567",
  inquiryType: "general",
  hearAbout: "Social Media",
  message: "This is an automated integration test submission.",
} as const;
