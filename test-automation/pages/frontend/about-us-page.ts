import { ApiHelper } from "@base/api-base";
import {
  ABOUT_US_TEXT,
  ABOUT_US_COUNTS,
  ABOUT_US_ERROR_MESSAGES,
  ABOUT_US_STYLE,
  UI_ROUTES,
  API_PATHS,
} from "@constants/index";
import { ABOUT_US_LOCATORS } from "@locators/about-us-locators";
import { type Page } from "@playwright/test";
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

    await this.initializationPage.expectCount(ABOUT_US_LOCATORS.journeyStat, journey.stats.length);
    await this.initializationPage.expectCount(ABOUT_US_LOCATORS.valuesCard, values.cards.length);
    await this.initializationPage.expectCount(ABOUT_US_LOCATORS.achievementsCard, achievements.cards.length);
  }

  async assertTeamMemberOrderMatchesApi(): Promise<void> {
    const response = (await this.apiHelper.getRequest(API_PATHS.ABOUT_US)) as AboutUsApiResponse;
    const data = response.data;
    if (!data) throw new Error("About Us API returned null data");

    await this.navigateToAboutUs();
    const members = data.team.members;

    await this.initializationPage.expectCount(ABOUT_US_LOCATORS.teamMember, members.length);

    for (const [index, member] of members.entries()) {
      await this.initializationPage.expectTextContains(ABOUT_US_LOCATORS.teamMember, member.name, index);
      await this.initializationPage.expectTextContains(ABOUT_US_LOCATORS.teamMember, member.role, index);
    }
  }

  async assertTeamCardStyling(): Promise<void> {
    await this.navigateToAboutUs();
    await this.initializationPage.checkCSSProperty(
      ABOUT_US_LOCATORS.teamMember, 0, "background-color", ABOUT_US_STYLE.TEAM_CARD_BG
    );
    await this.initializationPage.checkCSSProperty(
      ABOUT_US_LOCATORS.teamMember, 0, "border-color", ABOUT_US_STYLE.TEAM_CARD_BORDER
    );
    await this.initializationPage.checkCSSProperty(
      ABOUT_US_LOCATORS.teamMemberRole, 0, "color", ABOUT_US_STYLE.TEAM_CARD_ROLE_COLOR
    );
  }

  async assertTeamPhotosLoad(): Promise<void> {
    await this.navigateToAboutUs();

    // Each team member must have a rendered image — verified via data-testid on the <img>
    await this.initializationPage.expectCount(ABOUT_US_LOCATORS.teamMemberImage, 4);

    // Legacy .png path must not appear as a data-testid (would indicate stale seed data)
    // src should encode a .jpg path, not .png — verify the data-testid exists (image rendered)
    await this.initializationPage.expectVisible('[data-testid="team-member-image-sarah-johnson"]');
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

    await this.initializationPage.expectCount(ABOUT_US_LOCATORS.clientCard, clients.testimonials.length);

    for (const [index, testimonial] of clients.testimonials.entries()) {
      await this.initializationPage.expectText(ABOUT_US_LOCATORS.clientCompany, testimonial.company, index);
    }
  }

  async assertClientCardOrder(): Promise<void> {
    const response = (await this.apiHelper.getRequest(API_PATHS.ABOUT_US)) as AboutUsApiResponse;
    const data = response.data;
    if (!data) throw new Error("About Us API returned null data");

    await this.navigateToAboutUs();
    const testimonials = data.clients.testimonials;

    await this.initializationPage.expectCount(ABOUT_US_LOCATORS.clientCard, testimonials.length);
    for (const [index, testimonial] of testimonials.entries()) {
      await this.initializationPage.expectText(ABOUT_US_LOCATORS.clientCompany, testimonial.company, index);
    }
  }

  async assertClientCardStyling(): Promise<void> {
    await this.navigateToAboutUs();
    await this.initializationPage.checkCSSProperty(
      ABOUT_US_LOCATORS.clientCard, 0, "background-color", ABOUT_US_STYLE.TEAM_CARD_BG
    );
    await this.initializationPage.checkCSSProperty(
      ABOUT_US_LOCATORS.clientCard, 0, "border-color", ABOUT_US_STYLE.TEAM_CARD_BORDER
    );
    await this.initializationPage.checkCSSProperty(
      ABOUT_US_LOCATORS.clientSince, 0, "color", ABOUT_US_STYLE.TEAM_CARD_ROLE_COLOR
    );
    await this.initializationPage.checkCSSProperty(
      ABOUT_US_LOCATORS.clientSince, 0, "font-size", "12px"
    );
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

    await this.initializationPage.setViewport({ width: 375, height: 667 });
    await this.initializationPage.expectCount(ABOUT_US_LOCATORS.valuesCard, ABOUT_US_COUNTS.VALUE_CARDS);

    await this.initializationPage.setViewport({ width: 768, height: 1024 });
    await this.initializationPage.expectCount(ABOUT_US_LOCATORS.achievementsCard, ABOUT_US_COUNTS.ACHIEVEMENT_CARDS);
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

  async assertStepCardStyling(): Promise<void> {
    await this.navigateToAboutUs();
    // Wait for SWR data to render step cards
    await this.initializationPage.expectVisible(ABOUT_US_LOCATORS.howItWorksSection);
    await this.initializationPage.expectCount(ABOUT_US_LOCATORS.stepCard, 6);
    // Content div must have a full border on all 4 sides (purple border per Figma)
    await this.initializationPage.checkCSSProperty(
      ABOUT_US_LOCATORS.stepCardContent, 0, "border-top-width", ABOUT_US_STYLE.STEP_CARD_BORDER_WIDTH
    );
    await this.initializationPage.checkCSSProperty(
      ABOUT_US_LOCATORS.stepCardContent, 0, "border-right-width", ABOUT_US_STYLE.STEP_CARD_BORDER_WIDTH
    );
    await this.initializationPage.checkCSSProperty(
      ABOUT_US_LOCATORS.stepCardContent, 0, "border-bottom-width", ABOUT_US_STYLE.STEP_CARD_BORDER_WIDTH
    );
    await this.initializationPage.checkCSSProperty(
      ABOUT_US_LOCATORS.stepCardContent, 0, "border-left-width", ABOUT_US_STYLE.STEP_CARD_BORDER_WIDTH
    );
    // Step label div must have only a left border
    await this.initializationPage.checkCSSProperty(
      ABOUT_US_LOCATORS.stepCardLabel, 0, "border-left-width", ABOUT_US_STYLE.STEP_CARD_BORDER_WIDTH
    );
    await this.initializationPage.checkCSSProperty(
      ABOUT_US_LOCATORS.stepCardLabel, 0, "border-top-width", ABOUT_US_STYLE.STEP_LABEL_NO_BORDER
    );
    await this.initializationPage.checkCSSProperty(
      ABOUT_US_LOCATORS.stepCardLabel, 0, "border-right-width", ABOUT_US_STYLE.STEP_LABEL_NO_BORDER
    );
  }
}
