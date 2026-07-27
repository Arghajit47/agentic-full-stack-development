import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { GET } from "@/app/api/about-us/route";
import { aboutUsApiResponseSchema } from "@/lib/schemas";
import prisma from "@/lib/prisma";

const JOURNEY_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop";
async function getJson(res: Response) {
  return res.json();
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
  });
});
