import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// KAN-18 is read-only for the /services page content; no POST/PUT here. Rate limiting + Zod POST examples live in /api/newsletter.

interface Category {
  title: string;
  description: string;
  icon: string;
}

interface Service {
  heading: string;
  subheading: string;
  categories: Category[];
  ctaHeading: string;
  ctaBody: string;
  ctaHref: string;
  ctaText: string;
}

interface QuickLink {
  title: string;
  href: string;
  icon: string;
}

interface Intro {
  heading: string;
  subheading: string;
}

interface BottomCta {
  heading: string;
  body: string;
  href: string;
  buttonText: string;
}

interface ServicesData {
  intro: Intro;
  quickLinks: QuickLink[];
  services: Service[];
  bottomCta: BottomCta;
}

const FALLBACK: ServicesData = {
  intro: {
    heading: "Elevate Your Real Estate Experience",
    subheading:
      "Welcome to Estatein, where your real estate aspirations meet expert guidance. Explore our comprehensive range of services, each designed to cater to your unique needs and dreams.",
  },
  quickLinks: [
    { title: "Find Your Dream Home", href: "/properties", icon: "Home" },
    { title: "Unlock Property Value", href: "#property-selling", icon: "KeyRound" },
    { title: "Effortless Property Management", href: "#property-management", icon: "Building2" },
    { title: "Smart Investments, Informed Decisions", href: "#investment-advisory", icon: "TrendingUp" },
  ],
  services: [
    {
      heading: "Unlock Property Value",
      subheading:
        "Selling your property should be a rewarding experience, and at Estatein, we make sure it is. Our Property Selling Service is designed to maximize the value of your property, ensuring you get the best deal possible. Explore the categories below to see how we can help you at every step of your selling journey.",
      categories: [
        { title: "Valuation Mastery", description: "Discover the true worth of your property with our expert valuation services.", icon: "TrendingUp" },
        { title: "Strategic Marketing", description: "Selling a property requires more than just a listing; it demands a strategic marketing approach.", icon: "Megaphone" },
        { title: "Negotiation Wizardry", description: "Negotiating the best deal is an art, and our negotiation experts are masters of it.", icon: "Handshake" },
        { title: "Closing Success", description: "A successful sale is not complete until the closing. We guide you through the intricate closing process.", icon: "CheckCircle" },
      ],
      ctaHeading: "Unlock the Value of Your Property Today",
      ctaBody:
        "Ready to unlock the true value of your property? Explore our Property Selling Service categories and let us help you achieve the best deal possible for your valuable asset.",
      ctaHref: "#services/property-selling",
      ctaText: "Learn More",
    },
    {
      heading: "Effortless Property Management",
      subheading:
        "Owning a property should be a pleasure, not a hassle. Estatein's Property Management Service takes the stress out of property ownership, offering comprehensive solutions tailored to your needs. Explore the categories below to see how we can make property management effortless for you.",
      categories: [
        { title: "Tenant Harmony", description: "Our Tenant Management services ensure that your tenants have a smooth and reducing vacancies.", icon: "Users" },
        { title: "Maintenance Ease", description: "Say goodbye to property maintenance headaches. We handle all aspects of property upkeep.", icon: "Wrench" },
        { title: "Financial Peace of Mind", description: "Managing property finances can be complex. Our financial experts take care of rent collection.", icon: "Wallet" },
        { title: "Legal Guardian", description: "Stay compliant with property laws and regulations effortlessly.", icon: "Scale" },
      ],
      ctaHeading: "Experience Effortless Property Management",
      ctaBody:
        "Ready to experience hassle-free property management? Explore our Property Management Service categories and let us handle the complexities while you enjoy the benefits of property ownership.",
      ctaHref: "#services/property-management",
      ctaText: "Learn More",
    },
    {
      heading: "Smart Investments, Informed Decisions",
      subheading:
        "Building a real estate portfolio requires a strategic approach. Estatein's Investment Advisory Service empowers you to make smart investments and informed decisions.",
      categories: [
        { title: "Market Insight", description: "Stay ahead of market trends with our expert Market Analysis. We provide in-depth insights into real estate market conditions.", icon: "BarChart3" },
        { title: "ROI Assessment", description: "Make investment decisions with confidence. Our ROI Assessment services evaluate the potential returns on your investments.", icon: "PieChart" },
        { title: "Customized Strategies", description: "Every investor is unique, and so are their goals. We develop Customized Investment Strategies tailored to your specific needs.", icon: "Target" },
        { title: "Diversification Mastery", description: "Diversify your real estate portfolio effectively. Our experts guide you in spreading your investments across various property types and locations.", icon: "Globe" },
      ],
      ctaHeading: "Unlock Your Investment Potential",
      ctaBody:
        "Explore our Property Management Service categories and let us handle the complexities while you enjoy the benefits of property ownership.",
      ctaHref: "#services/investment-advisory",
      ctaText: "Learn More",
    },
  ],
  bottomCta: {
    heading: "Start Your Real Estate Journey Today",
    body: "Your dream property is just a click away. Whether you're looking for a new home, a strategic investment, or expert real estate advice, Estatein is here to assist you every step of the way. Take the first step towards your real estate goals and explore our available properties or get in touch with our team for personalized assistance.",
    href: "/properties",
    buttonText: "Explore Properties",
  },
};

function parseValue<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function buildIntro(rows: { slug: string; value: string }[]): Intro {
  const map = new Map(rows.map((r) => [r.slug, r.value]));
  return {
    heading: parseValue(map.get("intro-heading"), FALLBACK.intro.heading),
    subheading: parseValue(map.get("intro-subheading"), FALLBACK.intro.subheading),
  };
}

function buildQuickLinks(rows: { slug: string; value: string; order: number }[]): QuickLink[] {
  return rows
    .filter((r) => r.slug.startsWith("quickLinks-"))
    .sort((a, b) => a.order - b.order)
    .map((r) => parseValue<QuickLink>(r.value, FALLBACK.quickLinks[0]));
}

function buildService(sectionRows: { slug: string; value: string; order: number }[], sectionPrefix: string, fallback: Service): Service {
  const map = new Map(sectionRows.map((r) => [r.slug, r.value]));
  const prefix = `${sectionPrefix}-`;
  const categoryRows = sectionRows.filter((r) => r.slug.startsWith(`${prefix}category-`)).sort((a, b) => a.order - b.order);
  return {
    heading: parseValue(map.get(`${prefix}heading`), fallback.heading),
    subheading: parseValue(map.get(`${prefix}subheading`), fallback.subheading),
    categories: categoryRows.length > 0 ? categoryRows.map((r) => parseValue<Category>(r.value, fallback.categories[0])) : fallback.categories,
    ctaHeading: parseValue(map.get(`${prefix}cta-heading`), fallback.ctaHeading),
    ctaBody: parseValue(map.get(`${prefix}cta-body`), fallback.ctaBody),
    ctaHref: parseValue(map.get(`${prefix}cta-href`), fallback.ctaHref),
    ctaText: parseValue(map.get(`${prefix}cta-text`), fallback.ctaText),
  };
}

function buildBottomCta(rows: { slug: string; value: string }[]): BottomCta {
  const map = new Map(rows.map((r) => [r.slug, r.value]));
  return {
    heading: parseValue(map.get("bottomCta-heading"), FALLBACK.bottomCta.heading),
    body: parseValue(map.get("bottomCta-body"), FALLBACK.bottomCta.body),
    href: parseValue(map.get("bottomCta-href"), FALLBACK.bottomCta.href),
    buttonText: parseValue(map.get("bottomCta-button-text"), FALLBACK.bottomCta.buttonText),
  };
}

export async function GET() {
  try {
    const rows = await prisma.servicesContent.findMany({ orderBy: { order: "asc" } });

    if (rows.length === 0) {
      return NextResponse.json({ success: true, data: FALLBACK });
    }

    const bySection = new Map<string, typeof rows>();
    for (const row of rows) {
      const list = bySection.get(row.section) ?? [];
      list.push(row);
      bySection.set(row.section, list);
    }

    const data: ServicesData = {
      intro: buildIntro(bySection.get("intro") ?? []),
      quickLinks: buildQuickLinks(bySection.get("quickLinks") ?? []),
      services: [
        buildService(bySection.get("propertySelling") ?? [], "propertySelling", FALLBACK.services[0]),
        buildService(bySection.get("propertyManagement") ?? [], "propertyManagement", FALLBACK.services[1]),
        buildService(bySection.get("investmentAdvisory") ?? [], "investmentAdvisory", FALLBACK.services[2]),
      ],
      bottomCta: buildBottomCta(bySection.get("bottomCta") ?? []),
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[GET /api/services] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch services content", data: null },
      { status: 500 },
    );
  }
}
