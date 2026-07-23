import { z } from "zod";
import { newsletterSchema } from "@/lib/schemas";

export type ApiResponse<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; data: null };

export interface NavigationLink {
  id: string;
  label: string;
  href: string;
  order: number;
  isExternal: boolean;
}

export interface NavigationData {
  banner: {
    text: string;
    cta: string;
    ctaHref: string;
  };
  links: NavigationLink[];
}

export interface FooterData {
  cta: {
    title: string | null;
    body: string | null;
    ctaText: string | null;
    ctaHref: string | null;
  };
  newsletter: {
    placeholder: string | null;
  };
  bottom: {
    copyright: string | null;
    legalText: string | null;
  };
}

export type NewsletterInput = z.infer<typeof newsletterSchema>;

export interface NewsletterResponse {
  id: string;
  email: string;
}

export { newsletterSchema };
