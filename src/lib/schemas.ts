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

export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type ServicesCategory = z.infer<typeof categorySchema>;
export type ServicesService = z.infer<typeof serviceSchema>;
export type ServicesQuickLink = z.infer<typeof quickLinkSchema>;
export type ServicesIntro = z.infer<typeof introSchema>;
export type ServicesBottomCta = z.infer<typeof bottomCtaSchema>;
export type ServicesData = z.infer<typeof servicesSchema>;
export type ServicesApiResponse = z.infer<typeof servicesApiResponseSchema>;
