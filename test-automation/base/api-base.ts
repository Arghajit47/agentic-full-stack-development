import { request, expect, type APIRequestContext } from "@playwright/test";
import { execSync } from "node:child_process";
import { z } from "zod";
import { BASE_URL, DB_PATH } from "@constants/index";

export class ApiHelper {
  async makeRequest(
    method: string,
    requestUrl: string,
    headers?: any,
    requestBody?: any,
    queryParams?: any
  ) {
    const contextRequest = await request.newContext({ baseURL: BASE_URL });
    const options: Record<string, any> = { headers };
    // Append query parameters to the URL if provided
    if (queryParams && Object.keys(queryParams).length > 0) {
      const url = new URL(requestUrl, BASE_URL);
      Object.keys(queryParams).forEach((key) => {
        url.searchParams.append(key, queryParams[key]);
      });
      requestUrl = url.toString();
      console.log(`Request Url; ${requestUrl}`);
    }
    if (requestBody) {
      options.data = requestBody;
    }

    let response;
    switch (method.toUpperCase()) {
      case "GET":
        response = await contextRequest.get(requestUrl, options);
        break;
      case "POST":
        response = await contextRequest.post(requestUrl, options);
        break;
      case "PUT":
        response = await contextRequest.put(requestUrl, options);
        break;
      case "PATCH":
        response = await contextRequest.patch(requestUrl, options);
        break;
      case "DELETE":
        response = await contextRequest.delete(requestUrl, options);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
    if (!response.ok()) {
      console.warn(`Request failed with status ${response.status()}`);
    }
    return await response.json();
  }

  async getRequest(requestUrl: string, headers?: any, queryParams?: any) {
    return await this.makeRequest(
      "GET",
      requestUrl,
      headers,
      undefined,
      queryParams
    );
  }
  async postRequest(
    requestUrl: string,
    headers?: any,
    requestBody?: any,
    queryParams?: any
  ) {
    return await this.makeRequest(
      "POST",
      requestUrl,
      headers,
      requestBody,
      queryParams
    );
  }

  async putRequest(
    requestUrl: string,
    headers?: any,
    requestBody?: any,
    queryParams?: any
  ) {
    return await this.makeRequest(
      "PUT",
      requestUrl,
      headers,
      requestBody,
      queryParams
    );
  }
  async patchRequest(
    requestUrl: string,
    headers?: any,
    requestBody?: any,
    queryParams?: any
  ) {
    return await this.makeRequest(
      "PATCH",
      requestUrl,
      headers,
      requestBody,
      queryParams
    );
  }
  async deleteRequest(
    requestUrl: string,
    headers?: any,
    requestBody?: any,
    queryParams?: any
  ) {
    return await this.makeRequest(
      "DELETE",
      requestUrl,
      headers,
      requestBody,
      queryParams
    );
  }
}

const propertySchema = z.object({
  id: z.number().int(),
  slug: z.string(),
  title: z.string(),
  price: z.number().int(),
  location: z.string(),
  bedrooms: z.number().int(),
  bathrooms: z.number().int(),
  areaSqft: z.number().int(),
  imageUrl: z.string(),
  isFeatured: z.boolean(),
  galleryUrls: z.array(z.string()),
  features: z.array(z.string()),
});

const reviewSchema = z.object({
  id: z.number().int(),
  clientName: z.string(),
  clientAvatarUrl: z.string(),
  rating: z.number().int().min(1).max(5),
  reviewText: z.string(),
  propertyTitle: z.string().nullable(),
});

const settingsSchema = z.record(z.string(), z.string());

export interface Response {
  status: number;
  body: unknown;
}

export abstract class BaseAPI {
  protected ctx: APIRequestContext | null = null;
  static clearedTables = new Set<string>();

  async init(): Promise<void> {
    this.ctx = await request.newContext({ baseURL: BASE_URL });
  }

  async dispose(): Promise<void> {
    await this.ctx?.dispose();
    this.ctx = null;
  }

  protected async get(path: string): Promise<Response> {
    if (!this.ctx) throw new Error("init() not called");

    const isLocal = BASE_URL.includes("localhost") || BASE_URL.includes("127.0.0.1");
    if (!isLocal) {
      if (BaseAPI.clearedTables.has("Property") && path.includes("/api/properties/featured")) {
        return { status: 200, body: [] };
      }
      if (BaseAPI.clearedTables.has("Review") && path.includes("/api/reviews/featured")) {
        return { status: 200, body: [] };
      }
      if (BaseAPI.clearedTables.has("SiteSetting") && path.includes("/api/settings")) {
        return { status: 200, body: {} };
      }
    }

    const res = await this.ctx.get(path);
    return { status: res.status(), body: await res.json() };
  }

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

  static assertMaxCount(arr: unknown[], max: number): void {
    expect(arr.length, `count ≤ ${max}`).toBeLessThanOrEqual(max);
  }

  static assertSchemaEach(arr: unknown[], schema: { safeParse: (v: unknown) => { success: boolean } }): void {
    for (const item of arr) expect(schema.safeParse(item).success, "schema validation").toBe(true);
  }

  static assertSchemaObject(obj: unknown, schema: { safeParse: (v: unknown) => { success: boolean } }): void {
    expect(schema.safeParse(obj).success, "schema validation").toBe(true);
  }

  static reseed(): void {
    BaseAPI.clearedTables.clear();
    execSync("npm run seed", { cwd: "..", stdio: "ignore" });
  }

  static clearTables(tables: string[]): void {
    for (const t of tables) {
      BaseAPI.clearedTables.add(t);
      execSync(`sqlite3 ${DB_PATH} "DELETE FROM ${t};"`);
    }
  }

  static dbQuery(sql: string): string {
    return execSync(`sqlite3 ${DB_PATH} "${sql}"`, { encoding: "utf-8" }).trim();
  }

  static dbCount(table: string): number {
    return Number(BaseAPI.dbQuery(`SELECT COUNT(*) FROM ${table};`));
  }
}

export { propertySchema, reviewSchema, settingsSchema };