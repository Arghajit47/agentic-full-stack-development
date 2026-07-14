import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      take: 5,
      orderBy: { createdAt: "asc" },
    });

    const result = reviews.map((r) => ({
      id: r.id,
      clientName: r.clientName,
      clientAvatarUrl: r.clientAvatarUrl,
      rating: r.rating,
      reviewText: r.reviewText,
      propertyTitle: r.propertyTitle,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] GET /api/reviews/featured error:", error);
    return NextResponse.json({ error: "Failed to fetch featured reviews" }, { status: 500 });
  }
}