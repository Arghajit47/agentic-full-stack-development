import { ApiHelper } from "@base/api-base";
import {
  API_PATHS,
  CONTACT_TEXT,
  CONTACT_ERROR_MESSAGES,
  UI_ROUTES,
} from "@constants/index";
import { CONTACT_LOCATORS } from "@locators/contact-locators";
import { expect, type Page } from "@playwright/test";
import InitializationPage from "@base/ui-base";

export interface OfficeApiData {
  id: number;
  title: string;
  address: string;
  email: string;
  phone: string;
  order: number;
}

export interface GalleryImageApiData {
  id: number;
  imageUrl: string;
  caption?: string;
  order: number;
}

export interface ContactApiResponse {
  success: boolean;
  data: OfficeApiData[] | GalleryImageApiData[];
  error?: string;
}

export class ContactPage {
  private initializationPage: InitializationPage;
  private apiHelper: ApiHelper;

  constructor(page: Page) {
    this.initializationPage = new InitializationPage(page);
    this.apiHelper = new ApiHelper();
  }

  async navigateToContact(): Promise<void> {
    await this.initializationPage.goto(UI_ROUTES.CONTACT);
  }

  async assertPageRenders(): Promise<void> {
    await this.initializationPage.expectVisible(CONTACT_LOCATORS.contactPage);
    await this.initializationPage.expectText(
      CONTACT_LOCATORS.contactHeaderTitle,
      CONTACT_TEXT.PAGE_TITLE
    );
    await this.initializationPage.expectText(
      CONTACT_LOCATORS.officeLocationsTitle,
      CONTACT_TEXT.OFFICES_TITLE
    );
  }

  async assertHeadingsMatchApi(): Promise<void> {
    const officesResponse = (await this.apiHelper.getRequest(API_PATHS.CONTACT_OFFICES)) as ContactApiResponse;
    const galleryResponse = (await this.apiHelper.getRequest(API_PATHS.CONTACT_GALLERY)) as ContactApiResponse;
    const offices = officesResponse.data as OfficeApiData[];
    const gallery = galleryResponse.data as GalleryImageApiData[];

    await this.navigateToContact();

    const page = this.initializationPage.page;
    await expect(page.locator(CONTACT_LOCATORS.officeCard)).toHaveCount(offices.length);
    await expect(page.locator(CONTACT_LOCATORS.galleryImage)).toHaveCount(gallery.length);

    for (let i = 0; i < offices.length; i++) {
      await expect(page.locator(CONTACT_LOCATORS.officeCard).nth(i)).toContainText(offices[i].title);
    }

    for (let i = 0; i < gallery.length; i++) {
      await expect(page.locator(CONTACT_LOCATORS.galleryImage).nth(i)).toBeVisible();
    }
  }

  async assertNoConsoleErrors(): Promise<void> {
    await this.initializationPage.assertNoConsoleErrors(
      UI_ROUTES.CONTACT,
      CONTACT_LOCATORS.contactPage
    );
  }

  async assertNoImage404s(): Promise<void> {
    await this.initializationPage.assertNoImage404s(UI_ROUTES.CONTACT);
  }
}
