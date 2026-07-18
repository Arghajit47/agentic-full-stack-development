import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { type Property, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { parseJsonArray } from "@/lib/json-helpers";

// ─── Query param validation schema (KAN-10 AC) ────────────────────────────────
// AC params: ?search=&type=&featured=&page=1&limit=10
// AC limits: page min 1, limit min 1 max 50, default limit 10
export const propertyQuerySchema = z.object({
  search:   z.string().optional().default(""),
  type:     z.string().optional().default("All"),
  featured: z
    .enum(["true", "false", "1", "0"])
    .transform((v) => v === "true" || v === "1")
    .optional(),
  page:     z.coerce.number().int().min(1).optional().default(1),
  limit:    z.coerce.number().int().min(1).max(50).optional().default(10),
});

export type PropertyQuery = z.infer<typeof propertyQuerySchema>;

// ─── Response shape (KAN-10 AC) ───────────────────────────────────────────────
// { items: Property[], total: number, page: number, limit: number }
export interface PropertiesResponse {
  items: Record<string, unknown>[];
  total: number;
  page: number;
  limit: number;
}

// ─── Deserialise a raw Prisma Property row into API shape ─────────────────────
function toApiProperty(p: Property): Record<string, unknown> {
  return {
    ...p,
    galleryUrls: parseJsonArray(p.galleryUrls),
    features: parseJsonArray(p.features),
  };
}

// ─── GET /api/properties ──────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Validate query params with Zod — 400 on invalid input (AC)
    const parsed = propertyQuerySchema.safeParse({
      search:   searchParams.get("search")   ?? undefined,
      type:     searchParams.get("type")     ?? undefined,
      featured: searchParams.get("featured") ?? undefined,
      page:     searchParams.get("page")     ?? undefined,
      limit:    searchParams.get("limit")    ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { search, type, page, limit, featured } = parsed.data;

    // ─── Build Prisma WHERE clause ─────────────────────────────────────────
    // AC: search is case-insensitive contains on title, location, description
    // AC: type filters by propertyType; "All" (or omitted) means no filter
    // AC: featured filters by isFeatured boolean (optional)
    const conditions: Prisma.PropertyWhereInput[] = [];

    if (search.trim()) {
      const q = search.trim();
      // SQLite: LIKE-based contains is case-insensitive for ASCII by default
      conditions.push({
        OR: [
          { title:       { contains: q } },
          { description: { contains: q } },
          { location:    { contains: q } },
        ],
      });
    }

    if (type && type !== "All") {
      conditions.push({ propertyType: type });
    }

    if (featured !== undefined) {
      conditions.push({ isFeatured: featured });
    }

    const whereClause: Prisma.PropertyWhereInput =
      conditions.length > 0 ? { AND: conditions } : {};

    // ─── Paginated fetch — AC: skip = (page-1)*limit, take = limit ─────────
    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.property.count({ where: whereClause }),
    ]);

    // ─── Build AC-compliant response: { items, total, page, limit } ────────
    const response: PropertiesResponse = {
      items: properties.map(toApiProperty),
      total,
      page,
      limit,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[GET /api/properties] Unhandled error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
