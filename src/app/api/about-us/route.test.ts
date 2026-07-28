import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { GET } from "@/app/api/about-us/route";
import { aboutUsApiResponseSchema } from "@/lib/schemas";
import prisma from "@/lib/prisma";

const JOURNEY_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop";

const HOW_IT_WORKS_STEP_01 = {
  stepNumber: "Step 01",
  title: "Discover a World of Possibilities",
  description: "Your journey begins with exploring our carefully curated property listings. Use our intuitive search tools to filter properties based on your preferences, including location, type, size, and budget.",
};

const TEAM_SARAH = {
  name: "Sarah Johnson",
  role: "Chief Real Estate Officer",
  imageUrl: "/images/team/team-sarah.png",
  twitterUrl: "https://twitter.com/estatein",
};

const CLIENT_GREENTECH = {
  since: "Since 2018",
  company: "GreenTech Enterprises",
  domain: "Commercial Real Estate",
  category: "Retail Space",
  quote: "Estatein's ability to identify prime retail locations helped us expand our brand presence.",
  websiteUrl: "https://example.com",
};

async function getJson(res: Response) {
  return res.json();
}

function howItWorksRows() {
  return [
    { section: "howItWorks", slug: "howItWorks-heading", value: JSON.stringify("Navigating the Estatein Experience"), order: 1 },
    { section: "howItWorks", slug: "howItWorks-body", value: JSON.stringify("Body how it works"), order: 2 },
    { section: "howItWorks", slug: "howItWorks-step-01", value: JSON.stringify(HOW_IT_WORKS_STEP_01), order: 3 },
    { section: "howItWorks", slug: "howItWorks-step-02", value: JSON.stringify({ stepNumber: "Step 02", title: "T2", description: "D2" }), order: 4 },
    { section: "howItWorks", slug: "howItWorks-step-03", value: JSON.stringify({ stepNumber: "Step 03", title: "T3", description: "D3" }), order: 5 },
    { section: "howItWorks", slug: "howItWorks-step-04", value: JSON.stringify({ stepNumber: "Step 04", title: "T4", description: "D4" }), order: 6 },
    { section: "howItWorks", slug: "howItWorks-step-05", value: JSON.stringify({ stepNumber: "Step 05", title: "T5", description: "D5" }), order: 7 },
    { section: "howItWorks", slug: "howItWorks-step-06", value: JSON.stringify({ stepNumber: "Step 06", title: "T6", description: "D6" }), order: 8 },
  ];
}

function teamRows() {
  return [
    { section: "team", slug: "team-heading", value: JSON.stringify("Meet the Estatein Team"), order: 1 },
    { section: "team", slug: "team-body", value: JSON.stringify("Body team"), order: 2 },
    { section: "team", slug: "team-member-sarah-johnson", value: JSON.stringify(TEAM_SARAH), order: 3 },
    { section: "team", slug: "team-member-david-brown", value: JSON.stringify({ name: "David Brown", role: "Head of Property Management", imageUrl: "/images/team/team-david.jpg", twitterUrl: "https://twitter.com/estatein" }), order: 4 },
    { section: "team", slug: "team-member-michael-turner", value: JSON.stringify({ name: "Michael Turner", role: "Legal Counsel", imageUrl: "/images/team/team-michael.jpg", twitterUrl: "https://twitter.com/estatein" }), order: 5 },
    { section: "team", slug: "team-member-max-mitchell", value: JSON.stringify({ name: "Max Mitchell", role: "Founder", imageUrl: "/images/team/team-max.jpg", twitterUrl: "https://twitter.com/estatein" }), order: 6 },
  ];
}

function clientsRows() {
  return [
    { section: "clients", slug: "clients-heading", value: JSON.stringify("Our Valued Clients"), order: 1 },
    { section: "clients", slug: "clients-subheading", value: JSON.stringify("Subheading clients"), order: 2 },
    { section: "clients", slug: "clients-testimonial-greentech", value: JSON.stringify(CLIENT_GREENTECH), order: 3 },
    { section: "clients", slug: "clients-testimonial-abc", value: JSON.stringify({ since: "Since 2019", company: "ABC Corporation", domain: "Commercial Real Estate", category: "Luxury Home Development", quote: "Quote ABC", websiteUrl: "https://example.com" }), order: 4 },
  ];
}

describe("GET /api/about-us", () => {
  beforeEach(async () => {
    await prisma.aboutPageContent.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("returns 200 with seeded journey, values and achievements", async () => {
    const rows = [
      { section: "journey", slug: "journey-heading", value: JSON.stringify("Our Journey"), order: 1 },
      { section: "journey", slug: "journey-body", value: JSON.stringify("Body journey"), order: 2 },
      { section: "journey", slug: "journey-image-url", value: JSON.stringify(JOURNEY_IMAGE), order: 3 },
      { section: "journey", slug: "journey-stat-happy-customers", value: JSON.stringify({ value: "200+", label: "Happy Customers", icon: "Home" }), order: 4 },
      { section: "journey", slug: "journey-stat-properties-for-clients", value: JSON.stringify({ value: "10k+", label: "Properties For Clients", icon: "Home" }), order: 5 },
      { section: "journey", slug: "journey-stat-years-of-experience", value: JSON.stringify({ value: "16+", label: "Years of Experience", icon: "Home" }), order: 6 },
      { section: "values", slug: "values-heading", value: JSON.stringify("Our Values"), order: 1 },
      { section: "values", slug: "values-body", value: JSON.stringify("Body values"), order: 2 },
      { section: "values", slug: "values-card-trust", value: JSON.stringify({ title: "Trust", description: "desc", icon: "ShieldCheck" }), order: 3 },
      { section: "values", slug: "values-card-excellence", value: JSON.stringify({ title: "Excellence", description: "desc", icon: "Award" }), order: 4 },
      { section: "values", slug: "values-card-client-centric", value: JSON.stringify({ title: "Client-Centric", description: "desc", icon: "HeartHandshake" }), order: 5 },
      { section: "values", slug: "values-card-our-commitment", value: JSON.stringify({ title: "Our Commitment", description: "desc", icon: "BadgeCheck" }), order: 6 },
      { section: "achievements", slug: "achievements-heading", value: JSON.stringify("Our Achievements"), order: 1 },
      { section: "achievements", slug: "achievements-body", value: JSON.stringify("Body achievements"), order: 2 },
      { section: "achievements", slug: "achievements-card-3-plus-years", value: JSON.stringify({ title: "3+ Years of Excellence", description: "desc" }), order: 3 },
      { section: "achievements", slug: "achievements-card-happy-clients", value: JSON.stringify({ title: "Happy Clients", description: "desc" }), order: 4 },
      { section: "achievements", slug: "achievements-card-industry-recognition", value: JSON.stringify({ title: "Industry Recognition", description: "desc" }), order: 5 },
      ...howItWorksRows(),
      ...teamRows(),
      ...clientsRows(),
    ];

    for (const row of rows) {
      await prisma.aboutPageContent.create({ data: row });
    }

    const res = await GET();
    expect(res.status).toBe(200);
    const body = await getJson(res);

    const parsed = aboutUsApiResponseSchema.safeParse(body);
    expect(parsed.success).toBe(true);

    expect(body.data.journey.heading).toBe("Our Journey");
    expect(body.data.journey.imageUrl).toBe(JOURNEY_IMAGE);
    expect(body.data.journey.stats).toHaveLength(3);
    expect(body.data.journey.stats[0].label).toBe("Happy Customers");
    expect(body.data.values.cards).toHaveLength(4);
    expect(body.data.values.cards[0].icon).toBe("ShieldCheck");
    expect(body.data.achievements.cards).toHaveLength(3);
    expect(body.data.achievements.cards[1].title).toBe("Happy Clients");
    expect(body.data.howItWorks.heading).toBe("Navigating the Estatein Experience");
    expect(body.data.howItWorks.steps).toHaveLength(6);
    expect(body.data.howItWorks.steps[0]).toEqual(HOW_IT_WORKS_STEP_01);
    expect(body.data.team.heading).toBe("Meet the Estatein Team");
    expect(body.data.team.members).toHaveLength(4);
    expect(body.data.team.members[0]).toEqual(TEAM_SARAH);
    expect(body.data.clients.heading).toBe("Our Valued Clients");
    expect(body.data.clients.testimonials).toHaveLength(2);
    expect(body.data.clients.testimonials[0]).toEqual(CLIENT_GREENTECH);
  });

  it("returns fallback data when DB is empty", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await getJson(res);

    expect(body.success).toBe(true);
    expect(body.data.journey.heading).toBe("Our Journey");
    expect(body.data.journey.imageUrl).toBe(JOURNEY_IMAGE);
    expect(body.data.journey.stats).toHaveLength(3);
    expect(body.data.values.cards).toHaveLength(4);
    expect(body.data.achievements.cards).toHaveLength(3);
    expect(body.data.howItWorks.steps).toHaveLength(6);
    expect(body.data.team.members).toHaveLength(4);
    expect(body.data.clients.testimonials).toHaveLength(2);
    const parsed = aboutUsApiResponseSchema.safeParse(body);
    expect(parsed.success).toBe(true);
  });
});
