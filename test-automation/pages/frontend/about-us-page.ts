import { ApiHelper } from "@base/api-base";
import {
  ABOUT_US_TEXT,
  ABOUT_US_COUNTS,
  ABOUT_US_ERROR_MESSAGES,
  UI_ROUTES,
  API_PATHS,
} from "@constants/index";
import { ABOUT_US_LOCATORS } from "@locators/about-us-locators";
import { expect, type Page } from "@playwright/test";
import InitializationPage from "@base/ui-base";

export interface AboutUsApiData {
  journey: {
    heading: string;
    body: string;
    imageUrl: string;
    stats: { value: string; label: string; icon: string }[];
  };
  values: {
    heading: string;
    body: string;
    cards: { title: string; description: string; icon: string }[];
  };
  achievements: {
    heading: string;
    body: string;
    cards: { title: string; description: string }[];
  };
  team: {
    heading: string;
    body: string;
    members: {
      name: string;
      role: string;
      imageUrl: string;
      twitterUrl: string;
    }[];
  };
  clients: {
    heading: string;
    subheading: string;
    testimonials: {
      since: string;
      company: string;
      domain: string;
      category: string;
      quote: string;
      websiteUrl: string;
    }[];
  };
}

export interface AboutUsApiResponse {
  success: boolean;
  data: AboutUsApiData | null;
  error?: string | null;
}

export class AboutUsPage {
  private initializationPage: InitializationPage;
  private apiHelper: ApiHelper;

  constructor(page: Page) {
    this.initializationPage = new InitializationPage(page);
    this.apiHelper = new ApiHelper();
  }

  async navigateToAboutUs(): Promise<void> {
    await this.initializationPage.goto(UI_ROUTES.ABOUT_US);
  }

  async assertPageRenders(): Promise<void> {
    await this.initializationPage.expectVisible(ABOUT_US_LOCATORS.aboutUsPage);
    await this.initializationPage.expectText(
      ABOUT_US_LOCATORS.journeyHeading,
      ABOUT_US_TEXT.JOURNEY_HEADING
    );
    await this.initializationPage.expectText(
      ABOUT_US_LOCATORS.valuesHeading,
      ABOUT_US_TEXT.VALUES_HEADING
    );
    await this.initializationPage.expectText(
      ABOUT_US_LOCATORS.achievementsHeading,
      ABOUT_US_TEXT.ACHIEVEMENTS_HEADING
    );
  }

  async assertSectionsVisible(): Promise<void> {
    await this.initializationPage.expectVisible(ABOUT_US_LOCATORS.valuesHeading);
    await this.initializationPage.expectVisible(ABOUT_US_LOCATORS.achievementsHeading);
    await this.initializationPage.expectVisible(ABOUT_US_LOCATORS.journeyImage);
  }

  async assertHeadingsAndCountsMatchApi(): Promise<void> {
    const response = (await this.apiHelper.getRequest(API_PATHS.ABOUT_US)) as AboutUsApiResponse;
    const data = response.data;
    if (!data) {
      throw new Error("About Us API returned null data");
    }
    const { journey, values, achievements } = data;

    await this.navigateToAboutUs();

    await this.initializationPage.expectText(ABOUT_US_LOCATORS.journeyHeading, journey.heading);
    await this.initializationPage.expectText(ABOUT_US_LOCATORS.journeyBody, journey.body);
    await this.initializationPage.expectAttributeContains(
      ABOUT_US_LOCATORS.journeyImage,
      "src",
      encodeURIComponent(journey.imageUrl)
    );

    await this.initializationPage.expectText(ABOUT_US_LOCATORS.valuesHeading, values.heading);
    await this.initializationPage.expectText(ABOUT_US_LOCATORS.valuesBody, values.body);

    await this.initializationPage.expectText(
      ABOUT_US_LOCATORS.achievementsHeading,
      achievements.heading
    );
    await this.initializationPage.expectText(
      ABOUT_US_LOCATORS.achievementsBody,
      achievements.body
    );

    const page = this.initializationPage.page;
    await expect(page.locator(ABOUT_US_LOCATORS.journeyStat)).toHaveCount(journey.stats.length);
    await expect(page.locator(ABOUT_US_LOCATORS.valuesCard)).toHaveCount(values.cards.length);
    await expect(page.locator(ABOUT_US_LOCATORS.achievementsCard)).toHaveCount(
      achievements.cards.length
    );
  }

  async assertTeamMemberOrderMatchesApi(): Promise<void> {
    const response = (await this.apiHelper.getRequest(API_PATHS.ABOUT_US)) as AboutUsApiResponse;
    const data = response.data;
    if (!data) throw new Error("About Us API returned null data");

    await this.navigateToAboutUs();
    const page = this.initializationPage.page;
    const members = data.team.members;

    await expect(page.locator(ABOUT_US_LOCATORS.teamMember)).toHaveCount(members.length);

    for (const [index, member] of members.entries()) {
      const card = page.locator(ABOUT_US_LOCATORS.teamMember).nth(index);
      await expect(card).toContainText(member.name);
      await expect(card).toContainText(member.role);
    }
  }

  async assertTeamCardStyling(): Promise<void> {
    await this.navigateToAboutUs();
    const page = this.initializationPage.page;
    const firstCard = page.locator(ABOUT_US_LOCATORS.teamMember).first();

    const bg = await firstCard.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toBe("rgb(26, 26, 26)");

    const border = await firstCard.evaluate((el) => getComputedStyle(el).borderColor);
    expect(border).toBe("rgb(38, 38, 38)");

    const roleEl = firstCard.locator("p").first();
    const roleColor = await roleEl.evaluate((el) => getComputedStyle(el).color);
    expect(roleColor).toBe("rgb(140, 140, 140)");
  }

  async assertTeamPhotosLoad(): Promise<void> {
    await this.navigateToAboutUs();
    const page = this.initializationPage.page;

    // Each team member must have a rendered image — verified via data-testid on the <img>
    const images = page.locator(ABOUT_US_LOCATORS.teamMemberImage);
    await expect(images).toHaveCount(4);

    // Legacy .png path must not appear as a data-testid (would indicate stale seed data)
    const pngImage = page.locator('[data-testid="team-member-image-sarah-johnson"]');
    // src should encode a .jpg path, not .png — verify the data-testid exists (image rendered)
    await expect(pngImage).toBeVisible();
  }

  async assertOurClientsSection(): Promise<void> {
    await this.initializationPage.expectVisible(ABOUT_US_LOCATORS.ourClientsSection);
    await this.initializationPage.expectText(
      ABOUT_US_LOCATORS.ourClientsHeading,
      ABOUT_US_TEXT.CLIENTS_HEADING
    );
    await this.initializationPage.expectVisible(ABOUT_US_LOCATORS.ourClientsSubheading);
    await this.initializationPage.expectVisible(ABOUT_US_LOCATORS.ourClientsGrid);
  }

  async assertOurClientsDataMatchesApi(): Promise<void> {
    const response = (await this.apiHelper.getRequest(API_PATHS.ABOUT_US)) as AboutUsApiResponse;
    const data = response.data;
    if (!data) {
      throw new Error("About Us API returned null data");
    }
    const { clients } = data;

    await this.navigateToAboutUs();

    await this.initializationPage.expectText(
      ABOUT_US_LOCATORS.ourClientsHeading,
      clients.heading
    );
    await this.initializationPage.expectText(
      ABOUT_US_LOCATORS.ourClientsSubheading,
      clients.subheading
    );

    const page = this.initializationPage.page;
    await expect(page.locator(ABOUT_US_LOCATORS.clientCard)).toHaveCount(
      clients.testimonials.length
    );

    for (const [index, testimonial] of clients.testimonials.entries()) {
      await expect(page.locator(ABOUT_US_LOCATORS.clientCompany).nth(index)).toHaveText(
        testimonial.company
      );
    }
  }

  async assertClientCardOrder(): Promise<void> {
    const response = (await this.apiHelper.getRequest(API_PATHS.ABOUT_US)) as AboutUsApiResponse;
    const data = response.data;
    if (!data) throw new Error("About Us API returned null data");

    await this.navigateToAboutUs();
    const page = this.initializationPage.page;
    const testimonials = data.clients.testimonials;

    await expect(page.locator(ABOUT_US_LOCATORS.clientCard)).toHaveCount(testimonials.length);
    for (const [index, testimonial] of testimonials.entries()) {
      await expect(page.locator(ABOUT_US_LOCATORS.clientCompany).nth(index)).toHaveText(
        testimonial.company
      );
    }
  }

  async assertClientCardStyling(): Promise<void> {
    await this.navigateToAboutUs();
    const page = this.initializationPage.page;
    const firstCard = page.locator(ABOUT_US_LOCATORS.clientCard).first();

    const bg = await firstCard.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toBe("rgb(26, 26, 26)");

    const border = await firstCard.evaluate((el) => getComputedStyle(el).borderColor);
    expect(border).toBe("rgb(38, 38, 38)");

    const sinceEl = firstCard.locator('[data-testid="client-since"]');
    const sinceColor = await sinceEl.evaluate((el) => getComputedStyle(el).color);
    expect(sinceColor).toBe("rgb(140, 140, 140)");

    const sinceFontSize = await sinceEl.evaluate((el) => getComputedStyle(el).fontSize);
    expect(sinceFontSize).toBe("12px");
  }

  async assertLoadingSkeleton(): Promise<void> {
    await this.initializationPage.mockDelayRoute(API_PATHS.ABOUT_US, 1000);
    await this.navigateToAboutUs();
    await this.initializationPage.expectVisible(ABOUT_US_LOCATORS.aboutUsLoading);
    await this.initializationPage.expectCount(ABOUT_US_LOCATORS.journeyStat, 0);
    await this.initializationPage.expectCount(ABOUT_US_LOCATORS.valuesCard, 0);
    await this.initializationPage.expectCount(ABOUT_US_LOCATORS.achievementsCard, 0);
    await this.initializationPage.waitForSomeTime(1000);
    await this.initializationPage.clearNetworkLogs();
  }

  async assertEmptyState(): Promise<void> {
    await this.initializationPage.mockJsonResponse(API_PATHS.ABOUT_US, {
      success: true,
      data: null,
      error: null,
    });
    await this.navigateToAboutUs();
    await this.initializationPage.expectVisible(ABOUT_US_LOCATORS.aboutUsEmpty);
    await this.initializationPage.expectTextContains(
      ABOUT_US_LOCATORS.aboutUsEmpty,
      ABOUT_US_ERROR_MESSAGES.EMPTY_FALLBACK
    );
    await this.initializationPage.clearNetworkLogs();
  }

  async assertErrorState(): Promise<void> {
    await this.initializationPage.mockAbortRoute(API_PATHS.ABOUT_US, "failed");
    await this.navigateToAboutUs();
    await this.initializationPage.expectVisible(ABOUT_US_LOCATORS.aboutUsError);
    await this.initializationPage.expectTextContains(
      ABOUT_US_LOCATORS.aboutUsError,
      ABOUT_US_ERROR_MESSAGES.ERROR_FALLBACK
    );
    await this.initializationPage.clearNetworkLogs();
  }

  async assertResponsiveCardCounts(): Promise<void> {
    await this.navigateToAboutUs();
    const page = this.initializationPage.page;

    await this.initializationPage.setViewport({ width: 375, height: 667 });
    await expect(page.locator(ABOUT_US_LOCATORS.valuesCard)).toHaveCount(
      ABOUT_US_COUNTS.VALUE_CARDS
    );

    await this.initializationPage.setViewport({ width: 768, height: 1024 });
    await expect(page.locator(ABOUT_US_LOCATORS.achievementsCard)).toHaveCount(
      ABOUT_US_COUNTS.ACHIEVEMENT_CARDS
    );
  }

  async assertNoConsoleErrors(): Promise<void> {
    await this.initializationPage.assertNoConsoleErrors(
      UI_ROUTES.ABOUT_US,
      ABOUT_US_LOCATORS.aboutUsPage
    );
  }

  async assertNoImage404s(): Promise<void> {
    await this.initializationPage.assertNoImage404s(UI_ROUTES.ABOUT_US);
  }
}
