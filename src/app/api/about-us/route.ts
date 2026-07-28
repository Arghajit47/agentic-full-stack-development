import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// KAN-24 is read-only for the About Us scope; no POST/PUT here. Rate limiting + Zod POST examples live in /api/newsletter.

const JOURNEY_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop";

const FALLBACK = {
  journey: {
    heading: "Our Journey",
    body: "Our story is one of continuous growth and evolution. We started as a small team with big dreams, determined to create a real estate platform that transcended the ordinary. Over the years, we've expanded our reach, forged valuable partnerships, and gained the trust of countless clients.",
    imageUrl: JOURNEY_IMAGE,
    stats: [
      { value: "200+", label: "Happy Customers", icon: "Home" },
      { value: "10k+", label: "Properties For Clients", icon: "Home" },
      { value: "16+", label: "Years of Experience", icon: "Home" },
    ],
  },
  values: {
    heading: "Our Values",
    body: "Our story is one of continuous growth and evolution. We started as a small team with big dreams, determined to create a real estate platform that transcended the ordinary.",
    cards: [
      {
        title: "Trust",
        description: "Trust is the cornerstone of every successful real estate transaction.",
        icon: "ShieldCheck",
      },
      {
        title: "Excellence",
        description:
          "We set the bar high for ourselves. From the properties we list to the services we provide.",
        icon: "Award",
      },
      {
        title: "Client-Centric",
        description:
          "Your dreams and needs are at the center of our universe. We listen, understand.",
        icon: "HeartHandshake",
      },
      {
        title: "Our Commitment",
        description:
          "We are dedicated to providing you with the highest level of service, professionalism and support.",
        icon: "BadgeCheck",
      },
    ],
  },
  achievements: {
    heading: "Our Achievements",
    body: "Our story is one of continuous growth and evolution. We started as a small team with big dreams, determined to create a real estate platform that transcended the ordinary.",
    cards: [
      {
        title: "3+ Years of Excellence",
        description:
          "With over 3 years in the industry, we've amassed a wealth of knowledge and experience, becoming a go-to resource for all things real estate.",
      },
      {
        title: "Happy Clients",
        description:
          "Our greatest achievement is the satisfaction of our clients. Their success stories fuel our passion for what we do.",
      },
      {
        title: "Industry Recognition",
        description:
          "We've earned the respect of our peers and industry leaders, with accolades and awards that reflect our commitment to excellence.",
      },
    ],
  },
  howItWorks: {
    heading: "Navigating the Estatein Experience",
    body: "At Estatein, we've designed a straightforward process to help you find and purchase your dream property with ease. Here's a step-by-step guide to how it all works.",
    steps: [
      {
        stepNumber: "Step 01",
        title: "Discover a World of Possibilities",
        description:
          "Your journey begins with exploring our carefully curated property listings. Use our intuitive search tools to filter properties based on your preferences, including location, type, size, and budget.",
      },
      {
        stepNumber: "Step 02",
        title: "Narrowing Down Your Choices",
        description:
          "Once you've found properties that catch your eye, save them to your account or make a shortlist. This allows you to compare and revisit your favorites as you make your decision.",
      },
      {
        stepNumber: "Step 03",
        title: "Personalized Guidance",
        description:
          "Have questions about a property or need more information? Our dedicated team of real estate experts is just a call or message away.",
      },
      {
        stepNumber: "Step 04",
        title: "See It for Yourself",
        description:
          "Arrange viewings of the properties you're interested in. We'll coordinate with the property owners and accompany you to ensure you get a firsthand look at your potential new home.",
      },
      {
        stepNumber: "Step 05",
        title: "Making Informed Decisions",
        description:
          "Before making an offer, our team will assist you with due diligence, including property inspections, legal checks, and market analysis. We want you to be fully informed and confident in your choice.",
      },
      {
        stepNumber: "Step 06",
        title: "Getting the Best Deal",
        description:
          "We'll help you negotiate the best terms and prepare your offer. Our goal is to secure the property at the right price and on favorable terms.",
      },
    ],
  },
  team: {
    heading: "Meet the Estatein Team",
    body: "At Estatein, our success is driven by the dedication and expertise of our team. Get to know the people behind our mission to make your real estate dreams a reality.",
    members: [
      {
        name: "Sarah Johnson",
        role: "Chief Real Estate Officer",
        imageUrl: "/images/team/team-sarah.png",
        twitterUrl: "https://twitter.com/estatein",
      },
      {
        name: "David Brown",
        role: "Head of Property Management",
        imageUrl: "/images/team/team-david.jpg",
        twitterUrl: "https://twitter.com/estatein",
      },
      {
        name: "Michael Turner",
        role: "Legal Counsel",
        imageUrl: "/images/team/team-michael.jpg",
        twitterUrl: "https://twitter.com/estatein",
      },
      {
        name: "Max Mitchell",
        role: "Founder",
        imageUrl: "/images/team/team-max.jpg",
        twitterUrl: "https://twitter.com/estatein",
      },
    ],
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

interface AboutPageRow {
  section: string;
  slug: string;
  value: string;
  order: number;
}

interface Stat {
  value: string;
  label: string;
  icon: string;
}

interface Card {
  title: string;
  description: string;
  icon?: string;
}

interface HowItWorksStep {
  stepNumber: string;
  title: string;
  description: string;
}

interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
  twitterUrl: string;
}

function buildSection(rows: AboutPageRow[], section: string) {
  return rows.filter((r) => r.section === section).sort((a, b) => a.order - b.order);
}

function buildJourney(rows: AboutPageRow[]) {
  const sectionRows = buildSection(rows, "journey");
  const map = new Map(sectionRows.map((r) => [r.slug, r.value]));
  const statRows = sectionRows.filter((r) => r.slug.startsWith("journey-stat-"));
  const stats = statRows.length > 0
    ? statRows.map((r) => parseValue<Stat>(r.value, FALLBACK.journey.stats[0]))
    : FALLBACK.journey.stats;

  return {
    heading: parseValue(map.get("journey-heading"), FALLBACK.journey.heading),
    body: parseValue(map.get("journey-body"), FALLBACK.journey.body),
    imageUrl: parseValue(map.get("journey-image-url"), FALLBACK.journey.imageUrl),
    stats,
  };
}

function buildValues(rows: AboutPageRow[]) {
  const sectionRows = buildSection(rows, "values");
  const map = new Map(sectionRows.map((r) => [r.slug, r.value]));
  const cardRows = sectionRows.filter((r) => r.slug.startsWith("values-card-"));
  const cards = cardRows.length > 0
    ? cardRows.map((r) => parseValue<Card>(r.value, FALLBACK.values.cards[0]))
    : FALLBACK.values.cards;

  return {
    heading: parseValue(map.get("values-heading"), FALLBACK.values.heading),
    body: parseValue(map.get("values-body"), FALLBACK.values.body),
    cards,
  };
}

function buildAchievements(rows: AboutPageRow[]) {
  const sectionRows = buildSection(rows, "achievements");
  const map = new Map(sectionRows.map((r) => [r.slug, r.value]));
  const cardRows = sectionRows.filter((r) => r.slug.startsWith("achievements-card-"));
  const cards = cardRows.length > 0
    ? cardRows.map((r) => parseValue<Card>(r.value, FALLBACK.achievements.cards[0]))
    : FALLBACK.achievements.cards;

  return {
    heading: parseValue(map.get("achievements-heading"), FALLBACK.achievements.heading),
    body: parseValue(map.get("achievements-body"), FALLBACK.achievements.body),
    cards,
  };
}

function buildHowItWorks(rows: AboutPageRow[]) {
  const sectionRows = buildSection(rows, "howItWorks");
  const map = new Map(sectionRows.map((r) => [r.slug, r.value]));
  const stepRows = sectionRows.filter((r) => r.slug.startsWith("howItWorks-step-"));
  const steps = stepRows.length > 0
    ? stepRows.map((r) => parseValue<HowItWorksStep>(r.value, FALLBACK.howItWorks.steps[0]))
    : FALLBACK.howItWorks.steps;

  return {
    heading: parseValue(map.get("howItWorks-heading"), FALLBACK.howItWorks.heading),
    body: parseValue(map.get("howItWorks-body"), FALLBACK.howItWorks.body),
    steps,
  };
}

function buildTeam(rows: AboutPageRow[]) {
  const sectionRows = buildSection(rows, "team");
  const map = new Map(sectionRows.map((r) => [r.slug, r.value]));
  const memberRows = sectionRows.filter((r) => r.slug.startsWith("team-member-"));
  const members = memberRows.length > 0
    ? memberRows.map((r) => parseValue<TeamMember>(r.value, FALLBACK.team.members[0]))
    : FALLBACK.team.members;

  return {
    heading: parseValue(map.get("team-heading"), FALLBACK.team.heading),
    body: parseValue(map.get("team-body"), FALLBACK.team.body),
    members,
  };
}

export async function GET() {
  try {
    const rows = await prisma.aboutPageContent.findMany({ orderBy: { order: "asc" } });

    const data = {
      journey: buildJourney(rows),
      values: buildValues(rows),
      achievements: buildAchievements(rows),
      howItWorks: buildHowItWorks(rows),
      team: buildTeam(rows),
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[GET /api/about-us] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch about us content", data: null },
      { status: 500 },
    );
  }
}
