import { describe, it, expect, vi, afterEach, beforeEach, beforeAll } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import HomePage from "@/app/page";
import { featuredProperties } from "@/mocks/featured-properties";
import { testimonials } from "@/mocks/testimonials";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const mockUseHero = vi.hoisted(() => vi.fn());
const mockUseFeaturedProperties = vi.hoisted(() => vi.fn());
const mockUseFeaturedReviews = vi.hoisted(() => vi.fn());

vi.mock("@/lib/api", () => ({
  useHero: mockUseHero,
  useFeaturedProperties: mockUseFeaturedProperties,
  useFeaturedReviews: mockUseFeaturedReviews,
}));

const defaultHero = {
  data: {
    heading: "Find Your Dream Home",
    subheading: "Discover the perfect property with Estatein.",
    primaryCta: { text: "Browse Properties", href: "/properties" },
    secondaryCta: { text: "Contact Us", href: "/contact" },
    stats: [{ value: "200+", label: "Properties" }],
    features: [{ title: "Trusted", description: "Reliable service" }],
  },
  isLoading: false,
  error: null,
  mutate: vi.fn(),
};

const defaultPropertyHook = {
  data: featuredProperties,
  isLoading: false,
  error: null,
  mutate: vi.fn(),
};

const defaultReviewHook = {
  data: testimonials,
  isLoading: false,
  error: null,
  mutate: vi.fn(),
};

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: vi.fn().mockResolvedValue({}),
  });
});

beforeAll(() => {
  Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 1920 });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function renderHome() {
  mockUseHero.mockReturnValue(defaultHero);
  mockUseFeaturedProperties.mockReturnValue(defaultPropertyHook);
  mockUseFeaturedReviews.mockReturnValue(defaultReviewHook);
  return render(<HomePage />);
}

describe("HomePage", () => {
  it("renders featured properties section", async () => {
    renderHome();
    await waitFor(() => {
      expect(screen.getByTestId("featured-properties-section")).toBeInTheDocument();
    });
  });

  it("renders testimonials section", async () => {
    renderHome();
    await waitFor(() => {
      expect(screen.getByTestId("testimonials-section")).toBeInTheDocument();
    });
  });

  it("renders property cards from API data", async () => {
    renderHome();
    await waitFor(() => {
      expect(screen.getAllByTestId(/property-card/)).toHaveLength(3);
    });
  });

  it("renders review cards from API data", async () => {
    renderHome();
    await waitFor(() => {
      expect(screen.getAllByTestId(/review-card/)).toHaveLength(3);
    });
  });

  it("shows loading skeleton for properties when featured properties hook is loading", async () => {
    mockUseHero.mockReturnValue(defaultHero);
    mockUseFeaturedProperties.mockReturnValue({ data: undefined, isLoading: true, error: null, mutate: vi.fn() });
    mockUseFeaturedReviews.mockReturnValue(defaultReviewHook);
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getAllByTestId(/property-skeleton/)).toHaveLength(3);
    });
  });

  it("shows empty state for properties when API returns empty data", async () => {
    mockUseHero.mockReturnValue(defaultHero);
    mockUseFeaturedProperties.mockReturnValue({ data: [], isLoading: false, error: null, mutate: vi.fn() });
    mockUseFeaturedReviews.mockReturnValue(defaultReviewHook);
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByTestId("no-properties")).toHaveTextContent("No properties found");
    });
  });
});
