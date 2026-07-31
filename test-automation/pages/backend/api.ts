import { ApiHelper } from "@base/api-base";
import {
  API_PATHS,
  propertySchema,
  reviewSchema,
  settingsSchema,
  servicesSchema,
  propertiesResponseSchema,
  aboutUsSchema,
} from "@constants/index";

export class BackendApi {
  private apiHelper: ApiHelper;

  constructor() {
    this.apiHelper = new ApiHelper();
  }

  async validateFeaturedPropertiesApi(): Promise<void> {
    const data = await this.apiHelper.getRequest(API_PATHS.PROPERTIES_FEATURED);
    this.apiHelper.assertIsArray(data, "Featured properties");

    for (const item of data) {
      const parsed = propertySchema.safeParse(item);
      this.apiHelper.assertSchemaValid(parsed, "Featured property schema");
    }
  }

  async validateFeaturedReviewsApi(): Promise<void> {
    const data = await this.apiHelper.getRequest(API_PATHS.REVIEWS_FEATURED);
    this.apiHelper.assertIsArray(data, "Featured reviews");

    for (const item of data) {
      const parsed = reviewSchema.safeParse(item);
      this.apiHelper.assertSchemaValid(parsed, "Featured review schema");
    }
  }

  async validatePropertiesApi(): Promise<void> {
    const data = await this.apiHelper.getRequest(API_PATHS.PROPERTIES);
    const parsed = propertiesResponseSchema.safeParse(data);
    this.apiHelper.assertSchemaValid(parsed, "Properties response schema");
  }

  async validateSettingsApi(): Promise<void> {
    const data = await this.apiHelper.getRequest(API_PATHS.SETTINGS);
    const parsed = settingsSchema.safeParse(data);
    this.apiHelper.assertSchemaValid(parsed, "Settings response schema");
  }

  async validateServicesApi(): Promise<void> {
    const data = await this.apiHelper.getRequest(API_PATHS.SERVICES);
    const parsed = servicesSchema.safeParse(data);
    this.apiHelper.assertSchemaValid(parsed, "Services response schema");
  }

  async validateAboutUsApi(): Promise<void> {
    const data = await this.apiHelper.getRequest(API_PATHS.ABOUT_US);
    const parsed = aboutUsSchema.safeParse(data);
    this.apiHelper.assertSchemaValid(parsed, "About Us response schema");
  }
}
