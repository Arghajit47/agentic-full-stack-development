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
export type ServicesCategoryInput = z.infer<typeof categorySchema>;
export type ServicesServiceInput = z.infer<typeof serviceSchema>;
export type ServicesQuickLinkInput = z.infer<typeof quickLinkSchema>;
export type ServicesIntroInput = z.infer<typeof introSchema>;
export type ServicesBottomCtaInput = z.infer<typeof bottomCtaSchema>;
export type ServicesDataInput = z.infer<typeof servicesSchema>;
export type ServicesApiResponseInput = z.infer<typeof servicesApiResponseSchema>;
