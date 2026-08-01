export const ABOUT_US_TEXT = {
  JOURNEY_HEADING: "Our Journey",
  VALUES_HEADING: "Our Values",
  ACHIEVEMENTS_HEADING: "Our Achievements",
  CLIENTS_HEADING: "Our Valued Clients",
} as const;

export const ABOUT_US_COUNTS = {
  JOURNEY_STATS: 3,
  VALUE_CARDS: 4,
  ACHIEVEMENT_CARDS: 3,
} as const;

export const ABOUT_US_GRID_COLS = {
  JOURNEY_STATS_MOBILE: 2,
  JOURNEY_STATS_TABLET: 3,
  VALUES_DESKTOP: 2,
  VALUES_MOBILE: 1,
  ACHIEVEMENTS_DESKTOP: 3,
  ACHIEVEMENTS_TABLET: 2,
  ACHIEVEMENTS_MOBILE: 1,
} as const;

export const ABOUT_US_ERROR_MESSAGES = {
  ERROR_FALLBACK: "Unable to load About Us",
  EMPTY_FALLBACK: "No About Us content available",
} as const;

export const ABOUT_US_STYLE = {
  TEAM_CARD_BG: "rgb(26, 26, 26)",
  TEAM_CARD_BORDER: "rgb(38, 38, 38)",
  TEAM_CARD_ROLE_COLOR: "rgb(140, 140, 140)",
  STEP_CARD_BORDER_WIDTH: "1px",
  STEP_LABEL_NO_BORDER: "0px",
} as const;