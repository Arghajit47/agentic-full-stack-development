import { expect } from "@playwright/test";
import { ApiHelper } from "@base/api-base";
import {
  API_PATHS,
  propertySchema,
  reviewSchema,
  settingsSchema,
  propertiesResponseSchema,
} from "@constants/index";

export class BackendApi {
  private apiHelper: ApiHelper;

  constructor() {
    this.apiHelper = new ApiHelper();
  }

  async validateFeaturedPropertiesApi(): Promise<void> {
    const data = await this.apiHelper.getRequest(API_PATHS.PROPERTIES_FEATURED);
    expect(Array.isArray(data), "Featured properties should return an array").toBe(true);

    for (const item of data) {
      const parsed = propertySchema.safeParse(item);
      expect(
        parsed.success,
        `Featured property schema error: ${JSON.stringify(parsed.error?.format())}`
      ).toBe(true);
    }
  }

  async validateFeaturedReviewsApi(): Promise<void> {
    const data = await this.apiHelper.getRequest(API_PATHS.REVIEWS_FEATURED);
    expect(Array.isArray(data), "Featured reviews should return an array").toBe(true);

    for (const item of data) {
      const parsed = reviewSchema.safeParse(item);
      expect(
        parsed.success,
        `Featured review schema error: ${JSON.stringify(parsed.error?.format())}`
      ).toBe(true);
    }
  }

  async validatePropertiesApi(): Promise<void> {
    const data = await this.apiHelper.getRequest(API_PATHS.PROPERTIES);
    const parsed = propertiesResponseSchema.safeParse(data);
    expect(
      parsed.success,
      `Properties response schema error: ${JSON.stringify(parsed.error?.format())}`
    ).toBe(true);
  }

  async validateSettingsApi(): Promise<void> {
    const data = await this.apiHelper.getRequest(API_PATHS.SETTINGS);
    const parsed = settingsSchema.safeParse(data);
    expect(
      parsed.success,
      `Settings response schema error: ${JSON.stringify(parsed.error?.format())}`
    ).toBe(true);
  }
}
