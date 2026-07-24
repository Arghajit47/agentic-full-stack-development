import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { GET as getHero } from "@/app/api/hero/route";
import { GET as getNavigation } from "@/app/api/navigation/route";
import { GET as getFooter } from "@/app/api/footer/route";
import prisma from "@/lib/prisma";

async function getJson(res: Response) {
  return res.json();
}

describe("GET /api/hero (KAN-47)", () => {
  beforeEach(async () => {
    await prisma.heroContent.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("returns 200 with expected hero shape and seeded values", async () => {
    const heroRows = [
      { key: "heading", value: "Discover Your Dream Property with Estatein" },
      { key: "subheading", value: "Your journey to finding the perfect property begins here. Explore our listings." },
      { key: "primary_cta_text", value: "Browse Properties" },
      { key: "primary_cta_href", value: "/properties" },
      { key: "secondary_cta_text", value: "Learn More" },
      { key: "secondary_cta_href", value: "#learn-more" },
      { key: "stat_happy_customers", value: "200+" },
      { key: "stat_properties", value: "10k+" },
      { key: "stat_years", value: "16+" },
      { key: "feature_find_home_title", value: "Find Your Dream Home" },
      { key: "feature_property_value_title", value: "Unlock Property Value" },
      { key: "feature_management_title", value: "Effortless Property Management" },
      { key: "feature_investments_title", value: "Smart Investments. Informed Decisions" },
    ];
    for (const h of heroRows) {
      await prisma.heroContent.create({ data: h });
    }

    const res = await getHero();
    expect(res.status).toBe(200);
    const body = await getJson(res);
    expect(body.success).toBe(true);
    expect(body.data.heading).toBe("Discover Your Dream Property with Estatein");
    expect(body.data.subheading).toContain("Your journey");
    expect(body.data.primaryCta).toEqual({ text: "Browse Properties", href: "/properties" });
    expect(body.data.secondaryCta).toEqual({ text: "Learn More", href: "#learn-more" });
    expect(body.data.stats).toHaveLength(3);
    expect(body.data.features).toHaveLength(4);
    expect(body.data.features[0].title).toBe("Find Your Dream Home");
  });

  it("falls back to defaults when HeroContent is empty", async () => {
    const res = await getHero();
    expect(res.status).toBe(200);
    const body = await getJson(res);
    expect(body.success).toBe(true);
    expect(body.data.heading).toBe("Discover Your Dream Property with Estatein");
    expect(body.data.primaryCta.text).toBe("Browse Properties");
    expect(body.data.stats[0].label).toBe("Happy Customers");
    expect(body.data.features).toHaveLength(4);
  });

  it("does not break existing navigation and footer endpoints", async () => {
    const nav = await getNavigation();
    expect(nav.status).toBe(200);
    const navBody = await getJson(nav);
    expect(navBody.success).toBe(true);

    const footer = await getFooter();
    expect(footer.status).toBe(200);
    const footerBody = await getJson(footer);
    expect(footerBody.success).toBe(true);
  });
});
