import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const categorySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
});

const serviceSchema = z.object({
  heading: z.string().min(1),
  subheading: z.string().min(1),
  categories: z.array(categorySchema).min(1),
  ctaHeading: z.string().min(1),
  ctaBody: z.string().min(1),
  ctaHref: z.string().min(1),
  ctaText: z.string().min(1),
});

const quickLinkSchema = z.object({
  title: z.string().min(1),
  href: z.string().min(1),
  icon: z.string().min(1),
});

const introSchema = z.object({
  heading: z.string().min(1),
  subheading: z.string().min(1),
});

const bottomCtaSchema = z.object({
  heading: z.string().min(1),
  body: z.string().min(1),
  href: z.string().min(1),
  buttonText: z.string().min(1),
});

export const servicesSchema = z.object({
  intro: introSchema,
  quickLinks: z.array(quickLinkSchema).min(1),
  services: z.array(serviceSchema).min(1),
  bottomCta: bottomCtaSchema,
});

export const servicesApiResponseSchema = z.object({
  success: z.boolean(),
  data: servicesSchema,
  error: z.string().optional(),
  message: z.string().optional(),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type ServicesCategory = z.infer<typeof categorySchema>;
export type ServicesService = z.infer<typeof serviceSchema>;
export type ServicesQuickLink = z.infer<typeof quickLinkSchema>;
export type ServicesIntro = z.infer<typeof introSchema>;
export type ServicesBottomCta = z.infer<typeof bottomCtaSchema>;
export type ServicesData = z.infer<typeof servicesSchema>;
export type ServicesApiResponse = z.infer<typeof servicesApiResponseSchema>;

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

export type NewsletterResponse = {
  id: string;
  email: string;
};

export interface HeroCta {
  text: string;
  href: string;
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface HeroFeature {
  title: string;
  description: string;
}

export interface HeroContentData {
  heading: string;
  subheading: string;
  primaryCta: HeroCta;
  secondaryCta: HeroCta;
  stats: HeroStat[];
  features: HeroFeature[];
}

export type HeroApiResponse = ApiResponse<HeroContentData>;

export interface Office {
  id: number;
  title: string;
  address: string;
  email: string;
  phone: string;
  order: number;
}

export interface GalleryImage {
  id: number;
  imageUrl: string;
  caption?: string;
  order: number;
}

export interface FeaturedProperty {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  propertyType: string;
  imageUrl: string;
  isFeatured: boolean;
  galleryUrls: string[];
  features: string[];
}

export interface FeaturedReview {
  id: number;
  clientName: string;
  clientLocation: string;
  clientAvatarUrl: string;
  rating: number;
  reviewText: string;
  propertyTitle: string | null;
}
