import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [links, bannerSetting] = await Promise.all([
      prisma.navigationLink.findMany({ orderBy: { order: "asc" } }),
      prisma.siteSetting.findUnique({ where: { key: "nav_banner" } }),
    ]);

    const banner = bannerSetting
      ? (JSON.parse(bannerSetting.value) as Record<string, string>)
      : { text: "Discover Your Dream Property with Estatein", cta: "Learn More", ctaHref: "/properties" };

    return NextResponse.json({
      success: true,
      data: {
        banner,
        links,
      },
    });
  } catch (error) {
    console.error("[GET /api/navigation] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch navigation", data: null },
      { status: 500 },
    );
  }
}
