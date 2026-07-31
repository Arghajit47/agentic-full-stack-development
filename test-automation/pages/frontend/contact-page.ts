import {
  ApiHelper,
} from "@base/api-base";
import {
  API_PATHS,
  CONTACT_TEXT,
  CONTACT_ERROR_MESSAGES,
  CONTACT_FORM_TEST_DATA,
  UI_ROUTES,
} from "@constants/index";
import { CONTACT_LOCATORS } from "@locators/contact-locators";
import { type Page } from "@playwright/test";
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

    await this.initializationPage.expectCount(CONTACT_LOCATORS.officeCard, offices.length);
    await this.initializationPage.expectCount(CONTACT_LOCATORS.galleryImage, gallery.length);

    for (let i = 0; i < offices.length; i++) {
      await this.initializationPage.expectTextContains(CONTACT_LOCATORS.officeCard, offices[i].title, i);
    }

    for (let i = 0; i < gallery.length; i++) {
      await this.initializationPage.expectVisible(CONTACT_LOCATORS.galleryImage, i);
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

  async submitGeneralContactForm(): Promise<void> {
    const data = CONTACT_FORM_TEST_DATA;
    await this.navigateToContact();

    await this.initializationPage.fill(CONTACT_LOCATORS.firstNameInput, data.firstName);
    await this.initializationPage.fill(CONTACT_LOCATORS.lastNameInput, data.lastName);
    await this.initializationPage.fill(CONTACT_LOCATORS.emailInput, data.email);
    await this.initializationPage.fill(CONTACT_LOCATORS.phoneInput, data.phone);
    await this.initializationPage.fill(CONTACT_LOCATORS.messageTextarea, data.message);
    await this.initializationPage.selectOption(CONTACT_LOCATORS.inquiryTypeSelect, data.inquiryType);
    await this.initializationPage.selectOption(CONTACT_LOCATORS.hearAboutSelect, data.hearAbout);
    await this.initializationPage.checkCheckbox(CONTACT_LOCATORS.termsCheckbox);

    await this.initializationPage.clickOnElement(CONTACT_LOCATORS.submitButton);
    await this.initializationPage.expectVisible(CONTACT_LOCATORS.formSuccess, 0);
  }
}
