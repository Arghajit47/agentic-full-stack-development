import { z } from "zod";

export const API_PATHS = {
  PROPERTIES_FEATURED: "/api/properties/featured",
  REVIEWS_FEATURED: "/api/reviews/featured",
  PROPERTIES: "/api/properties",
  PROPERTY_PRICING: (slug: string) => `/api/properties/${encodeURIComponent(slug)}/pricing`,
  SETTINGS: "/api/settings",
  SERVICES: "/api/services",
  ABOUT_US: "/api/about-us",
  CONTACT_OFFICES: "/api/offices",
  CONTACT_GALLERY: "/api/gallery",
} as const;

const statSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
  icon: z.string().min(1),
});

const journeySchema = z.object({
  heading: z.string().min(1),
  body: z.string().min(1),
  imageUrl: z.string().min(1),
  stats: z.array(statSchema).min(1),
});

const valuesCardSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
});

const valuesSchema = z.object({
  heading: z.string().min(1),
  body: z.string().min(1),
  cards: z.array(valuesCardSchema).min(1),
});

const achievementCardSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const achievementsSchema = z.object({
  heading: z.string().min(1),
  body: z.string().min(1),
  cards: z.array(achievementCardSchema).min(1),
});

const aboutUsDataSchema = z.object({
  journey: journeySchema,
  values: valuesSchema,
  achievements: achievementsSchema,
});

export const aboutUsSchema = z.object({
  success: z.boolean(),
  data: aboutUsDataSchema.nullable(),
  error: z.string().optional().nullable(),
});

export const propertySchema = z.object({
  id: z.number().int(),
  slug: z.string(),
  title: z.string(),
  price: z.number().int(),
  location: z.string(),
  bedrooms: z.number().int(),
  bathrooms: z.number().int(),
  areaSqft: z.number().int(),
  imageUrl: z.string(),
  isFeatured: z.boolean(),
  galleryUrls: z.array(z.string()),
  features: z.array(z.string()),
});

export const reviewSchema = z.object({
  id: z.number().int(),
  clientName: z.string(),
  clientLocation: z.string(),
  clientAvatarUrl: z.string(),
  rating: z.number().int().min(1).max(5),
  reviewText: z.string(),
  reviewTitle: z.string().nullable(),
  propertyTitle: z.string().nullable(),
});

export const settingsSchema = z.record(z.string(), z.string());

const servicesCategorySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
});

const servicesServiceSchema = z.object({
  heading: z.string().min(1),
  subheading: z.string().min(1),
  categories: z.array(servicesCategorySchema).min(1),
  ctaHeading: z.string().min(1),
  ctaBody: z.string().min(1),
  ctaHref: z.string().min(1),
  ctaText: z.string().min(1),
});

const servicesQuickLinkSchema = z.object({
  title: z.string().min(1),
  href: z.string().min(1),
  icon: z.string().min(1),
});

const servicesIntroSchema = z.object({
  heading: z.string().min(1),
  subheading: z.string().min(1),
});

const servicesBottomCtaSchema = z.object({
  heading: z.string().min(1),
  body: z.string().min(1),
  href: z.string().min(1),
  buttonText: z.string().min(1),
});

export const servicesSchema = z.object({
  success: z.boolean(),
  data: z.object({
    intro: servicesIntroSchema,
    quickLinks: z.array(servicesQuickLinkSchema).min(1),
    services: z.array(servicesServiceSchema).min(1),
    bottomCta: servicesBottomCtaSchema,
  }),
  error: z.string().optional(),
  message: z.string().optional(),
});

export const propertyPricingSchema = z.object({
  success: z.boolean(),
  data: z.object({
    propertySlug: z.string().min(1),
    additionalFees: z.object({
      propertyTransferTax: z.number().int(),
      legalFees: z.number().int(),
      homeInspection: z.number().int(),
      propertyInsurance: z.number().int(),
      mortgageFees: z.string().min(1),
    }),
    monthlyCosts: z.object({
      propertyTaxesMonthly: z.number().int(),
      hoaFeeMonthly: z.number().int(),
    }),
    totalInitialCosts: z.object({
      downPayment: z.number().int(),
      downPaymentPct: z.number().int(),
      mortgageAmount: z.number().int(),
    }),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  }),
  error: z.null(),
});

export const propertiesResponseSchema = z.object({
  items: z.array(propertySchema),
  total: z.number().int(),
  page: z.number().int(),
  limit: z.number().int(),
});

export interface Property {
  id: number;
  slug: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  imageUrl: string;
  isFeatured: boolean;
  galleryUrls: string[];
  features: string[];
}

export interface PropertiesResponse {
  items: Property[];
  total: number;
  page: number;
  limit: number;
}

export interface Review {
  id: number;
  clientName: string;
  clientLocation: string;
  clientAvatarUrl: string;
  rating: number;
  reviewText: string;
  reviewTitle: string | null;
  propertyTitle: string | null;
}

export interface ServicesCategory {
  title: string;
  description: string;
  icon: string;
}

export interface ServicesService {
  heading: string;
  subheading: string;
  categories: ServicesCategory[];
  ctaHeading: string;
  ctaBody: string;
  ctaHref: string;
  ctaText: string;
}

export interface ServicesQuickLink {
  title: string;
  href: string;
  icon: string;
}

export interface ServicesIntro {
  heading: string;
  subheading: string;
}

export interface ServicesBottomCta {
  heading: string;
  body: string;
  href: string;
  buttonText: string;
}

export interface ServicesData {
  intro: ServicesIntro;
  quickLinks: ServicesQuickLink[];
  services: ServicesService[];
  bottomCta: ServicesBottomCta;
}

export interface AboutUsApiResponse {
  success: boolean;
  data: {
    journey: {
      heading: string;
      body: string;
      imageUrl: string;
      stats: { value: string; label: string; icon: string }[];
    };
    values: {
      heading: string;
      body: string;
      cards: { title: string; description: string; icon: string }[];
    };
    achievements: {
      heading: string;
      body: string;
      cards: { title: string; description: string }[];
    };
  } | null;
  error?: string | null;
}

export interface ServicesApiResponse {
  success: boolean;
  data: ServicesData;
  error?: string;
  message?: string;
}
