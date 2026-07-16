import { test } from "@fixtures/api-fixtures";
import { BaseAPI, settingsSchema } from "@base/api-base";
import { SEED_COUNTS, TABLES } from "@constants/index";

test.describe("Site Settings API", () => {
  test("returns 200 with settings object", async ({ settingsApi }) => {
    const res = await settingsApi.fetchSettings();
    BaseAPI.assertStatus(res, 200);
    settingsApi.getSettings(res);
  });

  test("returns 14 key-value pairs including all required keys", async ({ settingsApi }) => {
    const res = await settingsApi.fetchSettings();
    const settings = settingsApi.getSettings(res);
    settingsApi.assertRequiredKeys(settings);
    settingsApi.assertKeyCount(settings, SEED_COUNTS.SETTINGS);
  });

  test("settings match settingsSchema", async ({ settingsApi }) => {
    const res = await settingsApi.fetchSettings();
    const settings = settingsApi.getSettings(res);
    BaseAPI.assertSchemaObject(settings, settingsSchema);
  });

  test("empty DB returns {} not error", async ({ settingsApi }) => {
    BaseAPI.clearTables([TABLES.SITE_SETTING]);
    const res = await settingsApi.fetchSettings();
    BaseAPI.assertEmptyObject(res);
  });
});