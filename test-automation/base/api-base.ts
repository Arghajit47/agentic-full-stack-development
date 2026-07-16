import { request, expect, type APIRequestContext } from "@playwright/test";
import { execSync } from "node:child_process";
import { propertySchema, reviewSchema, settingsSchema } from "../../src/lib/validators";

const BASE_URL = "http://localhost:3000";
const DB = "../prisma/dev.db";

/** Base API test class — common HTTP actions, assertions, and DB helpers. */
export abstract class BaseAPI {
  protected ctx: APIRequestContext | null = null;

  async init(): Promise<void> {
    this.ctx = await request.newContext({ baseURL: BASE_URL });
  }

  async dispose(): Promise<void> {
    await this.ctx?.dispose();
    this.ctx = null;
  }

  // ── HTTP ──────────────────────────────────────────────────────

  protected async get(path: string): Promise<Response> {
    if (!this.ctx) throw new Error("init() not called");
    const res = await this.ctx.get(path);
    return { status: res.status(), body: await res.json() };
  }

  // ── Assertions ────────────────────────────────────────────────

  static assertStatus(res: Response, expected: number): void {
    expect(res.status, `status must be ${expected}`).toBe(expected);
  }

  static assertArray(res: Response): unknown[] {
    expect(Array.isArray(res.body), "body is an array").toBe(true);
    return res.body as unknown[];
  }

  static assertObject(res: Response): Record<string, unknown> {
    expect(typeof res.body, "body is an object").toBe("object");
    expect(res.body, "body is not null").not.toBeNull();
    return res.body as Record<string, unknown>;
  }

  static assertEmptyArray(res: Response): void {
    BaseAPI.assertStatus(res, 200);
    expect(res.body, "body is empty array").toEqual([]);
  }

  static assertEmptyObject(res: Response): void {
    BaseAPI.assertStatus(res, 200);
    expect(res.body, "body is empty object").toEqual({});
  }

  static assertError500(res: Response): void {
    expect(res.status, "status is 500").toBe(500);
    expect(typeof (res.body as { error: unknown }).error, "error is string").toBe("string");
  }

  static assertMaxCount(arr: unknown[], max: number): void {
    expect(arr.length, `count ≤ ${max}`).toBeLessThanOrEqual(max);
  }

  static assertSchemaEach(arr: unknown[], schema: { safeParse: (v: unknown) => { success: boolean } }): void {
    for (const item of arr) {
      expect(schema.safeParse(item).success, "schema validation").toBe(true);
    }
  }

  static assertSchemaObject(obj: unknown, schema: { safeParse: (v: unknown) => { success: boolean } }): void {
    expect(schema.safeParse(obj).success, "schema validation").toBe(true);
  }

  // ── DB helpers ────────────────────────────────────────────────

  static reseed(): void {
    execSync("npm run seed", { cwd: "..", stdio: "ignore" });
  }

  static clearTables(tables: string[]): void {
    for (const t of tables) execSync(`sqlite3 ${DB} "DELETE FROM ${t};"`);
  }

  static dbQuery(sql: string): string {
    return execSync(`sqlite3 ${DB} "${sql}"`, { encoding: "utf-8" }).trim();
  }

  static dbCount(table: string): number {
    return Number(BaseAPI.dbQuery(`SELECT COUNT(*) FROM ${table};`));
  }
}

export interface Response {
  status: number;
  body: unknown;
}

export { propertySchema, reviewSchema, settingsSchema };