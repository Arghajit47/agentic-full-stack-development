// Shared types for contact forms
// Extracted to avoid circular dependencies and client/server boundary issues

export const INQUIRY_TYPES = ["general", "support", "partnership", "careers"] as const;
export type InquiryType = (typeof INQUIRY_TYPES)[number];
