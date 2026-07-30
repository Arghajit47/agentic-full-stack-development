// Shared types for contact forms
// Extracted to avoid circular dependencies and client/server boundary issues

export const INQUIRY_TYPES = ["general", "support", "partnership", "careers"] as const;
export type InquiryType = (typeof INQUIRY_TYPES)[number];

export const HEAR_ABOUT_TYPES = [
  "Social Media",
  "Search Engine",
  "Friend/Family",
  "Advertisement",
  "Other",
] as const;
export type HearAboutType = (typeof HEAR_ABOUT_TYPES)[number];

export interface ContactSocialLink {
  label: string;
  href: string;
}

export interface ContactCard {
  id: string;
  icon: "email" | "phone" | "location" | "social";
  label: string;
  href?: string;
  socialLinks?: ContactSocialLink[];
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}
