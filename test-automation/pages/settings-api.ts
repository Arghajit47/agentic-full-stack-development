import { expect } from "@playwright/test";
import { BaseAPI, type Response } from "../base/api-base";

const PATH = "/api/settings";
const REQUIRED_KEYS = ["properties_heading", "properties_subheading", "reviews_heading", "reviews_subheading"] as const;

/** Page-specific actions/assertions for the Site Settings API. */
export class SettingsAPI extends BaseAPI {
  async fetchSettings(): Promise<Response> {
    return this.get(PATH);
  }

  getSettings(res: Response): Record<string, string> {
    return BaseAPI.assertObject(res) as Record<string, string>;
  }

  assertRequiredKeys(settings: Record<string, string>): void {
    for (const key of REQUIRED_KEYS) {
      expect(settings[key], `key "${key}" present`).toBeDefined();
    }
  }

  assertKeyCount(settings: Record<string, string>, expected: number): void {
    expect(Object.keys(settings).length, `settings count = ${expected}`).toBe(expected);
  }
}