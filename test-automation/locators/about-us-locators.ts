export const ABOUT_US_LOCATORS = {
  aboutUsPage: '[data-testid="about-us-page"]',
  aboutUsLoading: '[data-testid="about-us-loading"]',
  aboutUsError: '[data-testid="about-us-error"]',
  aboutUsEmpty: '[data-testid="about-us-empty"]',
  journeyHeading: '[data-testid="our-journey-heading"]',
  journeyBody: '[data-testid="our-journey-body"]',
  journeyImage: '[data-testid="our-journey-image"]',
  journeyStat: '[data-testid^="our-journey-stat-"]',
  valuesHeading: '[data-testid="our-values-heading"]',
  valuesBody: '[data-testid="our-values-body"]',
  valuesCard: '[data-testid^="our-values-card-"]',
  achievementsHeading: '[data-testid="our-achievements-heading"]',
  achievementsBody: '[data-testid="our-achievements-body"]',
  achievementsCard: '[data-testid^="our-achievements-card-"]',
  statsGrid: '[data-testid="our-journey-stats-grid"]',
  valuesGrid: '[data-testid="our-values-grid"]',
  achievementsGrid: '[data-testid="our-achievements-grid"]',
} as const;

// ponytail: no separate responsive grid locators; component uses Tailwind classes, so we count cards per breakpoint instead of parsing grid-template-columns. Upgrade if Figma requires exact column asserts.