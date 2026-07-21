import { z } from "zod";

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
}

export interface Review {
  id: number;
  clientName: string;
  clientAvatarUrl: string;
  rating: number;
  reviewText: string;
  propertyTitle: string | null;
}

export interface PropertiesResponse {
  items: Property[];
  total: number;
  page: number;
  limit: number;
}

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

export const propertiesResponseSchema = z.object({
  items: z.array(propertySchema),
  total: z.number().int(),
  page: z.number().int(),
  limit: z.number().int(),
});
