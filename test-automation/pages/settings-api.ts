import { expect } from "@playwright/test";
import { BaseAPI, type Response } from "@base/api-base";
import { API_PATHS, REQUIRED_SETTING_KEYS } from "@constants/index";

export class SettingsAPI extends BaseAPI {
  async fetchSettings(): Promise<Response> {
    return this.get(API_PATHS.SETTINGS);
  }

  getSettings(res: Response): Record<string, string> {
    return BaseAPI.assertObject(res) as Record<string, string>;
  }

  assertRequiredKeys(settings: Record<string, string>): void {
    for (const key of REQUIRED_SETTING_KEYS) {
      expect(settings[key], `key "${key}" present`).toBeDefined();
    }
  }

  assertKeyCount(settings: Record<string, string>, expected: number): void {
    expect(Object.keys(settings).length, `settings count = ${expected}`).toBe(expected);
  }
}