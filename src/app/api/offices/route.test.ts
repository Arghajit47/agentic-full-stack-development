import { describe, it, expect, beforeEach } from "vitest";
import { GET } from "./route";
import prisma from "@/lib/prisma";

const SEED_OFFICES = [
  {
    title: "Main Office",
    address: "123 Real Estate Avenue, New York, NY 10001",
    email: "info@estatein.com",
    phone: "+1 (212) 555-1234",
    order: 1,
  },
  {
    title: "Branch Office",
    address: "456 Property Street, Los Angeles, CA 90001",
    email: "la@estatein.com",
    phone: "+1 (323) 555-5678",
    order: 2,
  },
];

describe("GET /api/offices", () => {
  beforeEach(async () => {
    await prisma.office.deleteMany();
    for (const office of SEED_OFFICES) {
      await prisma.office.create({ data: office });
    }
  });

  it("should return offices ordered by order field", async () => {
    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data).toBeDefined();
    expect(Array.isArray(json.data)).toBe(true);
  });

  it("should return offices with required fields", async () => {
    const response = await GET();
    const json = await response.json();

    if (json.data.length > 0) {
      const office = json.data[0];
      expect(office).toHaveProperty("id");
      expect(office).toHaveProperty("title");
      expect(office).toHaveProperty("address");
      expect(office).toHaveProperty("email");
      expect(office).toHaveProperty("phone");
      expect(office).toHaveProperty("order");
    }
  });

  it("should return offices in ascending order", async () => {
    const response = await GET();
    const json = await response.json();

    if (json.data.length > 1) {
      for (let i = 0; i < json.data.length - 1; i++) {
        expect(json.data[i].order).toBeLessThanOrEqual(json.data[i + 1].order);
      }
    }
  });

  it("should return exactly 2 offices from seed data", async () => {
    const response = await GET();
    const json = await response.json();

    expect(json.data.length).toBe(2);
  });

  it("should return Main Office as first office", async () => {
    const response = await GET();
    const json = await response.json();

    expect(json.data[0].title).toBe("Main Office");
    expect(json.data[0].email).toBe("info@estatein.com");
  });

  it("should return Branch Office as second office", async () => {
    const response = await GET();
    const json = await response.json();

    expect(json.data[1].title).toBe("Branch Office");
    expect(json.data[1].email).toBe("la@estatein.com");
  });
});
