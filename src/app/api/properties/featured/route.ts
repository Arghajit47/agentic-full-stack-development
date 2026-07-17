import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parseJsonArray } from "@/lib/json-helpers";

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      where: { isFeatured: true },
      orderBy: { createdAt: "asc" },
    });

    const result = properties.map((p: typeof properties[number]) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      description: p.description,
      price: p.price,
      location: p.location,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      areaSqft: p.areaSqft,
      propertyType: p.propertyType,
      imageUrl: p.imageUrl,
      isFeatured: p.isFeatured,
      galleryUrls: parseJsonArray(p.galleryUrls),
      features: parseJsonArray(p.features),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] GET /api/properties/featured error:", error);
    return NextResponse.json({ error: "Failed to fetch featured properties" }, { status: 500 });
  }
}