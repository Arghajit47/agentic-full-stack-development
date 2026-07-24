import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// KAN-47 is read-only for the Hero/CTA scope; no POST/PUT here. Rate limiting + Zod POST examples live in /api/newsletter.

const FALLBACK = {
  heading: "Discover Your Dream Property with Estatein",
  subheading: "Your journey to finding the perfect property begins here. Explore our listings to find the home that matches your dreams.",
  primaryCta: { text: "Browse Properties", href: "/properties" },
  secondaryCta: { text: "Learn More", href: "#learn-more" },
  stats: [
    { value: "200+", label: "Happy Customers" },
    { value: "10k+", label: "Properties For Clients" },
    { value: "16+", label: "Years of Experience" },
  ],
  features: [
    { title: "Find Your Dream Home", description: "" },
    { title: "Unlock Property Value", description: "" },
    { title: "Effortless Property Management", description: "" },
    { title: "Smart Investments. Informed Decisions", description: "" },
  ],
};

const HERO_KEYS = [
  "heading",
  "subheading",
  "primary_cta_text",
  "primary_cta_href",
  "secondary_cta_text",
  "secondary_cta_href",
  "stat_happy_customers",
  "stat_properties",
  "stat_years",
  "feature_find_home_title",
  "feature_property_value_title",
  "feature_management_title",
  "feature_investments_title",
];

function parseHeroContent(rows: { key: string; value: string }[]) {
  const map = new Map(rows.map((r) => [r.key, r.value]));

  const statHappy = map.get("stat_happy_customers") ?? FALLBACK.stats[0].value;
  const statProperties = map.get("stat_properties") ?? FALLBACK.stats[1].value;
  const statYears = map.get("stat_years") ?? FALLBACK.stats[2].value;

  return {
    heading: map.get("heading") || FALLBACK.heading,
    subheading: map.get("subheading") || FALLBACK.subheading,
    primaryCta: {
      text: map.get("primary_cta_text") || FALLBACK.primaryCta.text,
      href: map.get("primary_cta_href") || FALLBACK.primaryCta.href,
    },
    secondaryCta: {
      text: map.get("secondary_cta_text") || FALLBACK.secondaryCta.text,
      href: map.get("secondary_cta_href") || FALLBACK.secondaryCta.href,
    },
    stats: [
      { value: statHappy, label: "Happy Customers" },
      { value: statProperties, label: "Properties For Clients" },
      { value: statYears, label: "Years of Experience" },
    ],
    features: [
      { title: map.get("feature_find_home_title") || FALLBACK.features[0].title, description: "" },
      { title: map.get("feature_property_value_title") || FALLBACK.features[1].title, description: "" },
      { title: map.get("feature_management_title") || FALLBACK.features[2].title, description: "" },
      { title: map.get("feature_investments_title") || FALLBACK.features[3].title, description: "" },
    ],
  };
}

export async function GET() {
  try {
    const [heroRows, propertyCount, reviewCount] = await Promise.all([
      prisma.heroContent.findMany({ where: { key: { in: HERO_KEYS } } }),
      prisma.property.count(),
      prisma.review.count(),
    ]);

    const hero = parseHeroContent(heroRows);

    // Override stats with computed DB values when present; keep configured suffix/value otherwise.
    hero.stats[0].value = heroRows.find((r) => r.key === "stat_happy_customers")?.value ?? `${reviewCount >= 1000 ? `${Math.round(reviewCount / 1000)}k` : reviewCount}+`;
    hero.stats[1].value = heroRows.find((r) => r.key === "stat_properties")?.value ?? `${propertyCount >= 1000 ? `${Math.round(propertyCount / 1000)}k` : propertyCount}+`;

    return NextResponse.json({ success: true, data: hero });
  } catch (error) {
    console.error("[GET /api/hero] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch hero content", data: null },
      { status: 500 },
    );
  }
}
