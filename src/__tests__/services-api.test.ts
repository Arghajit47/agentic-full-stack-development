import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { GET as getServices } from "@/app/api/services/route";
import { GET as getHero } from "@/app/api/hero/route";
import { GET as getNavigation } from "@/app/api/navigation/route";
import { GET as getFooter } from "@/app/api/footer/route";
import prisma from "@/lib/prisma";

async function getJson(res: Response) {
  return res.json();
}

const SEEDED_SERVICES_CONTENT = [
  { section: "intro", slug: "intro-heading", value: JSON.stringify("Elevate Your Real Estate Experience"), order: 1 },
  { section: "intro", slug: "intro-subheading", value: JSON.stringify("Welcome to Estatein, where your real estate aspirations meet expert guidance."), order: 2 },

  { section: "quickLinks", slug: "quickLinks-find-your-dream-home", value: JSON.stringify({ title: "Find Your Dream Home", href: "/properties", icon: "Home" }), order: 1 },
  { section: "quickLinks", slug: "quickLinks-unlock-property-value", value: JSON.stringify({ title: "Unlock Property Value", href: "#property-selling", icon: "KeyRound" }), order: 2 },

  { section: "propertySelling", slug: "propertySelling-heading", value: JSON.stringify("Unlock Property Value"), order: 1 },
  { section: "propertySelling", slug: "propertySelling-subheading", value: JSON.stringify("Selling your property should be a rewarding experience."), order: 2 },
  { section: "propertySelling", slug: "propertySelling-category-valuation-mastery", value: JSON.stringify({ title: "Valuation Mastery", description: "Discover the true worth of your property.", icon: "TrendingUp" }), order: 3 },
  { section: "propertySelling", slug: "propertySelling-category-strategic-marketing", value: JSON.stringify({ title: "Strategic Marketing", description: "Selling a property requires a strategic marketing approach.", icon: "Megaphone" }), order: 4 },
  { section: "propertySelling", slug: "propertySelling-cta-heading", value: JSON.stringify("Unlock the Value of Your Property Today"), order: 5 },
  { section: "propertySelling", slug: "propertySelling-cta-body", value: JSON.stringify("Ready to unlock the true value of your property?"), order: 6 },
  { section: "propertySelling", slug: "propertySelling-cta-href", value: JSON.stringify("#services/property-selling"), order: 7 },
  { section: "propertySelling", slug: "propertySelling-cta-text", value: JSON.stringify("Learn More"), order: 8 },

  { section: "propertyManagement", slug: "propertyManagement-heading", value: JSON.stringify("Effortless Property Management"), order: 1 },
  { section: "propertyManagement", slug: "propertyManagement-subheading", value: JSON.stringify("Owning a property should be a pleasure, not a hassle."), order: 2 },
  { section: "propertyManagement", slug: "propertyManagement-category-tenant-harmony", value: JSON.stringify({ title: "Tenant Harmony", description: "Our Tenant Management services ensure smooth tenants.", icon: "Users" }), order: 3 },
  { section: "propertyManagement", slug: "propertyManagement-cta-heading", value: JSON.stringify("Experience Effortless Property Management"), order: 4 },
  { section: "propertyManagement", slug: "propertyManagement-cta-body", value: JSON.stringify("Ready to experience hassle-free property management?"), order: 5 },
  { section: "propertyManagement", slug: "propertyManagement-cta-href", value: JSON.stringify("#services/property-management"), order: 6 },
  { section: "propertyManagement", slug: "propertyManagement-cta-text", value: JSON.stringify("Learn More"), order: 7 },

  { section: "investmentAdvisory", slug: "investmentAdvisory-heading", value: JSON.stringify("Smart Investments, Informed Decisions"), order: 1 },
  { section: "investmentAdvisory", slug: "investmentAdvisory-subheading", value: JSON.stringify("Building a real estate portfolio requires a strategic approach."), order: 2 },
  { section: "investmentAdvisory", slug: "investmentAdvisory-category-market-insight", value: JSON.stringify({ title: "Market Insight", description: "Stay ahead of market trends.", icon: "BarChart3" }), order: 3 },
  { section: "investmentAdvisory", slug: "investmentAdvisory-cta-heading", value: JSON.stringify("Unlock Your Investment Potential"), order: 4 },
  { section: "investmentAdvisory", slug: "investmentAdvisory-cta-body", value: JSON.stringify("Explore our Investment Advisory categories."), order: 5 },
  { section: "investmentAdvisory", slug: "investmentAdvisory-cta-href", value: JSON.stringify("#services/investment-advisory"), order: 6 },
  { section: "investmentAdvisory", slug: "investmentAdvisory-cta-text", value: JSON.stringify("Learn More"), order: 7 },

  { section: "bottomCta", slug: "bottomCta-heading", value: JSON.stringify("Start Your Real Estate Journey Today"), order: 1 },
  { section: "bottomCta", slug: "bottomCta-body", value: JSON.stringify("Your dream property is just a click away."), order: 2 },
  { section: "bottomCta", slug: "bottomCta-href", value: JSON.stringify("/properties"), order: 3 },
  { section: "bottomCta", slug: "bottomCta-button-text", value: JSON.stringify("Explore Properties"), order: 4 },
];

describe("GET /api/services (KAN-18)", () => {
  beforeEach(async () => {
    await prisma.servicesContent.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("returns 200 with expected services shape and seeded values", async () => {
    for (const row of SEEDED_SERVICES_CONTENT) {
      await prisma.servicesContent.create({ data: row });
    }

    const res = await getServices();
    expect(res.status).toBe(200);
    const body = await getJson(res);
    expect(body.success).toBe(true);
    expect(body.data.intro.heading).toBe("Elevate Your Real Estate Experience");
    expect(body.data.quickLinks).toHaveLength(2);
    expect(body.data.quickLinks[0]).toEqual({ title: "Find Your Dream Home", href: "/properties", icon: "Home" });
    expect(body.data.services).toHaveLength(3);
    expect(body.data.services[0].heading).toBe("Unlock Property Value");
    expect(body.data.services[0].categories).toHaveLength(2);
    expect(body.data.services[0].categories[0]).toEqual({ title: "Valuation Mastery", description: "Discover the true worth of your property.", icon: "TrendingUp" });
    expect(body.data.services[1].heading).toBe("Effortless Property Management");
    expect(body.data.services[2].heading).toBe("Smart Investments, Informed Decisions");
    expect(body.data.bottomCta.heading).toBe("Start Your Real Estate Journey Today");
    expect(body.data.bottomCta.href).toBe("/properties");
  });

  it("falls back to defaults when ServicesContent is empty", async () => {
    const res = await getServices();
    expect(res.status).toBe(200);
    const body = await getJson(res);
    expect(body.success).toBe(true);
    expect(body.data.intro.heading).toBe("Elevate Your Real Estate Experience");
    expect(body.data.quickLinks).toHaveLength(4);
    expect(body.data.services).toHaveLength(3);
    expect(body.data.services[0].categories).toHaveLength(4);
    expect(body.data.bottomCta.buttonText).toBe("Explore Properties");
  });

  it("does not break existing hero, navigation and footer endpoints", async () => {
    const hero = await getHero();
    expect(hero.status).toBe(200);
    const heroBody = await getJson(hero);
    expect(heroBody.success).toBe(true);

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
