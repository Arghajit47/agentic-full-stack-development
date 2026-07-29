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

export const aboutJourneyStatSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
  icon: z.string().min(1),
});

export const aboutJourneySchema = z.object({
  heading: z.string().min(1),
  body: z.string().min(1),
  imageUrl: z.string().min(1),
  stats: z.array(aboutJourneyStatSchema).min(1),
});

export const aboutValueCardSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
});

export const aboutValuesSchema = z.object({
  heading: z.string().min(1),
  body: z.string().min(1),
  cards: z.array(aboutValueCardSchema).min(1),
});

export const aboutAchievementCardSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export const aboutAchievementsSchema = z.object({
  heading: z.string().min(1),
  body: z.string().min(1),
  cards: z.array(aboutAchievementCardSchema).min(1),
});

export const aboutHowItWorksStepSchema = z.object({
  stepNumber: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

export const aboutHowItWorksSchema = z.object({
  heading: z.string().min(1),
  body: z.string().min(1),
  steps: z.array(aboutHowItWorksStepSchema).min(1),
});

export const aboutTeamMemberSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  imageUrl: z.string().min(1),
  twitterUrl: z.string().min(1),
});

export const aboutTeamSchema = z.object({
  heading: z.string().min(1),
  body: z.string().min(1),
  members: z.array(aboutTeamMemberSchema).min(1),
});

export const aboutClientSchema = z.object({
  since: z.string().min(1),
  company: z.string().min(1),
  domain: z.string().min(1),
  category: z.string().min(1),
  quote: z.string().min(1),
  websiteUrl: z.string().min(1),
});

export const aboutClientsSchema = z.object({
  heading: z.string().min(1),
  subheading: z.string().min(1),
  testimonials: z.array(aboutClientSchema).min(1),
});

export const aboutUsDataSchema = z.object({
  journey: aboutJourneySchema,
  values: aboutValuesSchema,
  achievements: aboutAchievementsSchema,
  howItWorks: aboutHowItWorksSchema,
  team: aboutTeamSchema,
  clients: aboutClientsSchema,
});

export const aboutUsApiResponseSchema = z.object({
  success: z.boolean(),
  data: aboutUsDataSchema.nullable(),
  error: z.string().optional().nullable(),
});

export type AboutUsApiResponse = z.infer<typeof aboutUsApiResponseSchema>;
export type AboutUsJourney = z.infer<typeof aboutJourneySchema>;
export type AboutUsValueCard = z.infer<typeof aboutValueCardSchema>;
export type AboutUsValues = z.infer<typeof aboutValuesSchema>;
export type AboutUsAchievementCard = z.infer<typeof aboutAchievementCardSchema>;
export type AboutUsAchievements = z.infer<typeof aboutAchievementsSchema>;
export type AboutUsHowItWorksStep = z.infer<typeof aboutHowItWorksStepSchema>;
export type AboutUsHowItWorks = z.infer<typeof aboutHowItWorksSchema>;
export type AboutUsTeamMember = z.infer<typeof aboutTeamMemberSchema>;
export type AboutUsTeam = z.infer<typeof aboutTeamSchema>;
export type AboutUsClient = z.infer<typeof aboutClientSchema>;
export type AboutUsClients = z.infer<typeof aboutClientsSchema>;
export type AboutUsData = z.infer<typeof aboutUsDataSchema>;

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

export const propertyContactSubmissionSchema = z.union([
  // legacy shape used by PropertyInquiryForm on /properties/[slug]
  z.object({
    propertySlug: z.string().optional(),
    name: z.string().min(1, "Name is required").max(100, "Name too long"),
    email: z.string().email("Invalid email format").max(255, "Email too long"),
    phone: z
      .string()
      .min(10, "Phone must be at least 10 digits")
      .max(20, "Phone too long")
      .regex(/^[0-9+\-() ]+$/, "Phone contains invalid characters"),
    message: z
      .string()
      .min(10, "Message must be at least 10 characters")
      .max(1000, "Message too long"),
  }),
  // full shape emitted by PropertyContactForm on /properties
  z.object({
    propertySlug: z.string().optional(),
    firstName: z.string().min(1, "First name is required").max(100, "First name too long"),
    lastName: z.string().min(1, "Last name is required").max(100, "Last name too long"),
    email: z.string().email("Invalid email format").max(255, "Email too long"),
    phone: z
      .string()
      .min(10, "Phone must be at least 10 digits")
      .max(20, "Phone too long")
      .regex(/^[0-9+\-() ]+$/, "Phone contains invalid characters"),
    preferredLocation: z.string().min(1, "Preferred location is required").max(100),
    propertyType: z.string().min(1, "Property type is required").max(100),
    bedrooms: z.string().min(1, "Bedrooms is required").max(10),
    bathrooms: z.string().min(1, "Bathrooms is required").max(10),
    budget: z.string().min(1, "Budget is required").max(100),
    message: z
      .string()
      .min(10, "Message must be at least 10 characters")
      .max(1000, "Message too long"),
    agreeToTerms: z.boolean().refine((v) => v === true, "You must agree to the terms"),
  }),
]);

export type PropertyContactSubmissionInput = z.infer<typeof propertyContactSubmissionSchema>;

export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type ServicesCategory = z.infer<typeof categorySchema>;
export type ServicesService = z.infer<typeof serviceSchema>;
export type ServicesQuickLink = z.infer<typeof quickLinkSchema>;
export type ServicesIntro = z.infer<typeof introSchema>;
export type ServicesBottomCta = z.infer<typeof bottomCtaSchema>;
export type ServicesData = z.infer<typeof servicesSchema>;
export type ServicesApiResponse = z.infer<typeof servicesApiResponseSchema>;
