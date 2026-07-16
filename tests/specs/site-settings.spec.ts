import { test, expect } from "@playwright/test";
import { SettingsAPI } from "../pages/settings-api";
import { BaseAPI, settingsSchema } from "../base/api-base";

test.describe("Site Settings API", () => {
  let api: SettingsAPI;

  test.beforeEach(async () => {
    BaseAPI.reseed();
    api = new SettingsAPI();
    await api.init();
  });

  test.afterEach(async () => {
    await api.dispose();
  });

  test("returns 200 with settings object", async () => {
    const res = await api.fetchSettings();
    BaseAPI.assertStatus(res, 200);
    api.getSettings(res);
  });

  test("returns 14 key-value pairs including all required keys", async () => {
    const res = await api.fetchSettings();
    const settings = api.getSettings(res);
    api.assertRequiredKeys(settings);
    api.assertKeyCount(settings, 14);
  });

  test("settings match settingsSchema", async () => {
    const res = await api.fetchSettings();
    const settings = api.getSettings(res);
    BaseAPI.assertSchemaObject(settings, settingsSchema);
  });

  test("empty DB returns {} not error", async () => {
    BaseAPI.clearTables(["SiteSetting"]);
    const res = await api.fetchSettings();
    BaseAPI.assertEmptyObject(res);
  });
});