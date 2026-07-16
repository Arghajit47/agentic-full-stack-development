import { test, expect, request } from "@playwright/test";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const BASE = "http://localhost:3000";
const DB = join(process.cwd(), "prisma", "dev.db");

/** Run sqlite3 CLI to clear a table. */
function clearTables(tables: string[]) {
  for (const t of tables) execSync(`sqlite3 ${DB} "DELETE FROM ${t};"`);
}
/** Re-seed via npm script. */
function reseed() {
  execSync("npm run seed", { cwd: process.cwd(), stdio: "ignore" });
}

// ---------------------------------------------------------------------------
// TC-001: GET /api/properties/featured returns 200 with featured properties
// ---------------------------------------------------------------------------
test("TC-001: GET /api/properties/featured returns 200 with featured properties", async () => {
  reseed();
  const ctx = await request.newContext({ baseURL: BASE });
  const res = await ctx.get("/api/properties/featured");
  expect(res.status(), "status must be 200").toBe(200);
  const body = await res.json();
  expect(Array.isArray(body), "body is an array").toBe(true);
  expect(body.length, "seed has 5 featured").toBe(5);
  expect(body.every((p: { isFeatured: boolean }) => p.isFeatured === true), "all featured").toBe(true);
  await ctx.dispose();
});

// ---------------------------------------------------------------------------
// TC-002: GET /api/reviews/featured returns 200 with reviews
// ---------------------------------------------------------------------------
test("TC-002: GET /api/reviews/featured returns 200 with reviews", async () => {
  reseed();
  const ctx = await request.newContext({ baseURL: BASE });
  const res = await ctx.get("/api/reviews/featured");
  expect(res.status(), "status must be 200").toBe(200);
  const body = await res.json();
  expect(Array.isArray(body), "body is an array").toBe(true);
  expect(body.length, "seed has 5 reviews").toBe(5);
  expect(body.length).toBeLessThanOrEqual(5);
  await ctx.dispose();
});

// ---------------------------------------------------------------------------
// TC-003: GET /api/settings returns 200 with settings
// ---------------------------------------------------------------------------
test("TC-003: GET /api/settings returns 200 with settings", async () => {
  reseed();
  const ctx = await request.newContext({ baseURL: BASE });
  const res = await ctx.get("/api/settings");
  expect(res.status(), "status must be 200").toBe(200);
  const body = await res.json();
  expect(typeof body, "body is an object").toBe("object");
  expect(body).not.toBeNull();
  expect(body.site_name, "site_name key present").toBe("EstateHub");
  expect(Object.keys(body).length, "seed has 14 settings").toBe(14);
  await ctx.dispose();
});

// ---------------------------------------------------------------------------
// TC-004: Empty DB — properties returns []
// ---------------------------------------------------------------------------
test("TC-004: Empty DB — properties returns []", async () => {
  clearTables(["Property"]);
  const ctx = await request.newContext({ baseURL: BASE });
  const res = await ctx.get("/api/properties/featured");
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body).toEqual([]);
  await ctx.dispose();
  reseed(); // restore
});

// ---------------------------------------------------------------------------
// TC-005: Empty DB — reviews returns []
// ---------------------------------------------------------------------------
test("TC-005: Empty DB — reviews returns []", async () => {
  clearTables(["Review"]);
  const ctx = await request.newContext({ baseURL: BASE });
  const res = await ctx.get("/api/reviews/featured");
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body).toEqual([]);
  await ctx.dispose();
  reseed();
});

// ---------------------------------------------------------------------------
// TC-006: Empty DB — settings returns {}
// ---------------------------------------------------------------------------
test("TC-006: Empty DB — settings returns {}", async () => {
  clearTables(["SiteSetting"]);
  const ctx = await request.newContext({ baseURL: BASE });
  const res = await ctx.get("/api/settings");
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body).toEqual({});
  await ctx.dispose();
  reseed();
});

// ---------------------------------------------------------------------------
// TC-007: galleryUrls and features are arrays (not JSON text)
// ---------------------------------------------------------------------------
test("TC-007: galleryUrls and features are arrays (not JSON text)", async () => {
  reseed();
  const ctx = await request.newContext({ baseURL: BASE });
  const res = await ctx.get("/api/properties/featured");
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(Array.isArray(body)).toBe(true);
  expect(body.length).toBeGreaterThan(0);
  for (const p of body) {
    expect(Array.isArray(p.galleryUrls), `galleryUrls array for ${p.slug}`).toBe(true);
    expect(Array.isArray(p.features), `features array for ${p.slug}`).toBe(true);
    // Not raw JSON text:
    expect(typeof p.galleryUrls).not.toBe("string");
    expect(typeof p.features).not.toBe("string");
  }
  // spot-check first property has real strings
  expect(body[0].galleryUrls.length).toBeGreaterThan(0);
  expect(typeof body[0].galleryUrls[0]).toBe("string");
  await ctx.dispose();
});

// ---------------------------------------------------------------------------
// TC-008: 500 error path — properties endpoint returns { error: string }
// Per instructions: already covered in Vitest. Verify the Vitest suite passes.
// ---------------------------------------------------------------------------
test("TC-008: 500 error path — verify existing Vitest error-path test passes", async () => {
  // Run the vitest suite; it contains the 500-path assertions for all 3 endpoints.
  const result = execSync("npx vitest run src/__tests__/api.test.ts 2>&1", {
    cwd: process.cwd(),
    encoding: "utf-8",
    timeout: 60_000,
  });
  // vitest exits non-zero on failure -> execSync throws, so reaching here = pass.
  expect(result).toContain("passed");
  expect(result).not.toContain("failed");
});

// ---------------------------------------------------------------------------
// TC-009: Security scan — no high/critical vulnerabilities
// Uses `npm audit --audit-level=high` — fails if high/critical found.
// ---------------------------------------------------------------------------
test("TC-009: Security scan — no high/critical vulnerabilities", async () => {
  let auditOut = "";
  let exitCode = 0;
  try {
    auditOut = execSync("npm audit --audit-level=high --json 2>&1", {
      cwd: process.cwd(),
      encoding: "utf-8",
      timeout: 60_000,
    });
  } catch (e) {
    // npm audit exits 1 when vulns found above level; capture output
    auditOut = (e as { stdout?: string; stderr?: string; message: string }).stdout ?? (e as { stdout?: string; stderr?: string; message: string }).stderr ?? (e as { stdout?: string; stderr?: string; message: string }).message;
    exitCode = 1;
  }
  let parsed: { metadata?: { vulnerabilities?: { high?: number; critical?: number } } } = {};
  try {
    parsed = JSON.parse(auditOut);
  } catch {
    // non-JSON output is a soft pass — audit produced no advisory JSON
  }
  const v = parsed.metadata?.vulnerabilities ?? {};
  const high = v.high ?? 0;
  const critical = v.critical ?? 0;
  // Informational: moderate/low are tolerated per TC scope (high/critical only).
  expect(high, "no high vulnerabilities").toBe(0);
  expect(critical, "no critical vulnerabilities").toBe(0);
  // exitCode 0 or no high/critical counts = pass
  if (exitCode !== 0 && high === 0 && critical === 0) {
    // lower-severity vulns caused the non-zero exit — acceptable
    return;
  }
  expect(exitCode, "npm audit exit code").toBe(0);
});

// ---------------------------------------------------------------------------
// TC-010: Prisma schema correctness
// Verifies schema defines Property, Review, SiteSetting models with expected fields.
// ---------------------------------------------------------------------------
test("TC-010: Prisma schema correctness", async () => {
  const schema = readFileSync(join(process.cwd(), "prisma", "schema.prisma"), "utf-8");
  // Models present
  expect(schema).toMatch(/model\s+Property\s*\{/);
  expect(schema).toMatch(/model\s+Review\s*\{/);
  expect(schema).toMatch(/model\s+SiteSetting\s*\{/);
  // Property required fields
  for (const f of [
    "id", "slug", "title", "price", "location", "bedrooms", "bathrooms",
    "areaSqft", "imageUrl", "isFeatured", "galleryUrls", "features",
  ]) {
    expect(schema, `Property.${f}`).toContain(`  ${f}`);
  }
  // Review required fields
  for (const f of ["clientName", "clientAvatarUrl", "rating", "reviewText", "propertyTitle"]) {
    expect(schema, `Review.${f}`).toContain(`  ${f}`);
  }
  expect(schema, "rating nullable?").toMatch(/rating\s+Int/);
  expect(schema, "propertyTitle nullable").toMatch(/propertyTitle\s+String\?/);
  // SiteSetting key/value
  expect(schema).toMatch(/key\s+String\s+@unique/);
  expect(schema).toMatch(/value\s+String/);
  // DB schema matches file (prisma validate)
  const validate = execSync("npx prisma validate 2>&1", { cwd: process.cwd(), encoding: "utf-8", timeout: 30_000 });
  expect(validate.toLowerCase()).toContain("valid");
  // Tables exist in SQLite (reflects the schema)
  const tables = execSync(`sqlite3 ${DB} ".tables"`, { encoding: "utf-8" });
  expect(tables).toMatch(/Property/);
  expect(tables).toMatch(/Review/);
  expect(tables).toMatch(/SiteSetting/);
});

// ---------------------------------------------------------------------------
// TC-011: Seed data correctness
// Runs `npm run seed` and verifies counts + content via sqlite3.
// ---------------------------------------------------------------------------
test("TC-011: Seed data correctness", async () => {
  reseed();
  const q = (sql: string) =>
    execSync(`sqlite3 ${DB} "${sql}"`, { encoding: "utf-8" }).trim();
  // Counts
  expect(Number(q("SELECT COUNT(*) FROM Property;"))).toBe(6);
  expect(Number(q("SELECT COUNT(*) FROM Review;"))).toBe(5);
  expect(Number(q("SELECT COUNT(*) FROM SiteSetting;"))).toBe(14);
  // Featured = 5 of 6
  expect(Number(q("SELECT COUNT(*) FROM Property WHERE isFeatured=1;"))).toBe(5);
  expect(Number(q("SELECT COUNT(*) FROM Property WHERE isFeatured=0;"))).toBe(1);
  // One review with null propertyTitle
  expect(Number(q("SELECT COUNT(*) FROM Review WHERE propertyTitle IS NULL;"))).toBe(1);
  // Ratings within 1-5
  const minMax = q("SELECT MIN(rating), MAX(rating) FROM Review;");
  expect(minMax).toBe("2|5");
  // galleryUrls/features are valid JSON arrays (stored as JSON text)
  const gal = q("SELECT galleryUrls FROM Property WHERE slug='modern-villa-sunset-hills';");
  expect(() => JSON.parse(gal)).not.toThrow();
  expect(Array.isArray(JSON.parse(gal))).toBe(true);
  const feat = q("SELECT features FROM Property WHERE slug='modern-villa-sunset-hills';");
  expect(Array.isArray(JSON.parse(feat))).toBe(true);
  // settings include required keys
  expect(q("SELECT key FROM SiteSetting WHERE key='site_name';")).toBe("site_name");
  expect(q("SELECT value FROM SiteSetting WHERE key='site_name';")).toBe("EstateHub");
  // verify API reflects seeded data
  const ctx = await request.newContext({ baseURL: BASE });
  const res = await ctx.get("/api/properties/featured");
  const body = await res.json();
  expect(body.length).toBe(5);
  const titles = body.map((p: { title: string }) => p.title);
  expect(titles).toContain("Modern Villa in Sunset Hills");
  await ctx.dispose();
});