import { z } from "zod";

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
  clientAvatarUrl: z.string(),
  rating: z.number().int().min(1).max(5),
  reviewText: z.string(),
  propertyTitle: z.string().nullable(),
});

export const settingsSchema = z.record(z.string(), z.string());