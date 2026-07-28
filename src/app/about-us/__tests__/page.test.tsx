import { describe, it, expect, afterEach, vi, beforeEach } from "vitest";
import { render, screen, cleanup, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import AboutUsPage from "@/app/about-us/page";

const mockData = {
  journey: {
    heading: "Our Journey",
    body: "Journey body",
    imageUrl: "https://example.com/journey.jpg",
    stats: [{ value: "200+", label: "Happy Customers", icon: "Home" }],
  },
  values: {
    heading: "Our Values",
    body: "Values body",
    cards: [{ title: "Trust", description: "Trust desc", icon: "ShieldCheck" }],
  },
  achievements: {
    heading: "Our Achievements",
    body: "Achievements body",
    cards: [{ title: "Award", description: "Award desc" }],
  },
  howItWorks: {
    heading: "Navigating the Estatein Experience",
    body: "How it works body",
    steps: [
      { stepNumber: "Step 01", title: "Discover", description: "Discover desc" },
      { stepNumber: "Step 02", title: "Narrow Down", description: "Narrow desc" },
      { stepNumber: "Step 03", title: "Guidance", description: "Guidance desc" },
      { stepNumber: "Step 04", title: "See It", description: "See it desc" },
      { stepNumber: "Step 05", title: "Decide", description: "Decide desc" },
      { stepNumber: "Step 06", title: "Deal", description: "Deal desc" },
    ],
  },
  team: {
    heading: "Meet the Estatein Team",
    body: "Team body",
    members: [
      { name: "Sarah Johnson", role: "CEO", imageUrl: "/team/sarah.png", twitterUrl: "https://twitter.com" },
      { name: "David Brown", role: "CTO", imageUrl: "/team/david.jpg", twitterUrl: "https://twitter.com" },
      { name: "Michael Turner", role: "Legal", imageUrl: "/team/michael.jpg", twitterUrl: "https://twitter.com" },
      { name: "Max Mitchell", role: "Founder", imageUrl: "/team/max.jpg", twitterUrl: "https://twitter.com" },
    ],
  },
  clients: {
    heading: "Our Valued Clients",
    subheading: "Clients subheading",
    testimonials: [
      {
        since: "Since 2018",
        company: "GreenTech",
        domain: "Commercial",
        category: "Retail",
        quote: "Great service",
        websiteUrl: "https://example.com",
      },
      {
        since: "Since 2019",
        company: "ABC Corp",
        domain: "Commercial",
        category: "Office",
        quote: "Excellent",
        websiteUrl: "https://example.com",
      },
    ],
  },
};

const mockSWR = vi.hoisted(() => vi.fn());

vi.mock("@/lib/api", () => ({
  useAboutUs: mockSWR,
}));

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.useRealTimers();
});

function renderAndHydrate(returnValue: ReturnType<typeof mockSWR>) {
  mockSWR.mockReturnValue(returnValue);
  render(<AboutUsPage />);
  // flush useSyncExternalStore hydration so tests see post-hydration UI
  vi.advanceTimersByTime(0);
}

describe("AboutUsPage", () => {
  it("renders loading state", () => {
    renderAndHydrate({ data: undefined, error: undefined, isLoading: true, mutate: vi.fn() });
    expect(screen.getByTestId("about-us-loading")).toBeInTheDocument();
  });

  it("renders error state with retry", async () => {
    const mutate = vi.fn();
    renderAndHydrate({ data: undefined, error: new Error("boom"), isLoading: false, mutate });
    expect(screen.getByTestId("about-us-error")).toHaveTextContent("Unable to load About Us");
    fireEvent.click(screen.getByRole("button", { name: /retry/i }));
    await waitFor(() => expect(mutate).toHaveBeenCalled());
  });

  it("renders empty state", () => {
    renderAndHydrate({ data: null, error: undefined, isLoading: false, mutate: vi.fn() });
    expect(screen.getByTestId("about-us-empty")).toBeInTheDocument();
  });

  it("renders page wrapper and sections from fetched data", () => {
    renderAndHydrate({ data: mockData, error: undefined, isLoading: false, mutate: vi.fn() });
    expect(screen.getByTestId("about-us-page")).toBeInTheDocument();
    expect(screen.getByTestId("our-journey-heading")).toHaveTextContent("Our Journey");
    expect(screen.getByTestId("our-values-heading")).toHaveTextContent("Our Values");
    expect(screen.getByTestId("our-achievements-heading")).toHaveTextContent("Our Achievements");
    expect(screen.getByTestId("our-clients-heading")).toHaveTextContent("Our Valued Clients");
    expect(screen.getAllByTestId(/^client-card-/)).toHaveLength(2);
  });

  it("renders How It Works and Team from API data when available", () => {
    renderAndHydrate({ data: mockData, error: undefined, isLoading: false, mutate: vi.fn() });
    expect(screen.getByTestId("how-it-works-heading")).toHaveTextContent(
      "Navigating the Estatein Experience",
    );
    expect(screen.getAllByTestId(/^step-card-step-/)).toHaveLength(6);
    expect(screen.getByTestId("team-heading")).toHaveTextContent("Meet the Estatein Team");
    expect(screen.getAllByTestId(/^team-member-(?!image|twitter)/)).toHaveLength(4);
  });

  it("does not render How It Works and Team in loading state", () => {
    renderAndHydrate({ data: undefined, error: undefined, isLoading: true, mutate: vi.fn() });
    expect(screen.getByTestId("about-us-loading")).toBeInTheDocument();
    expect(screen.queryByTestId("how-it-works-section")).not.toBeInTheDocument();
    expect(screen.queryByTestId("team-section")).not.toBeInTheDocument();
  });

  it("does not render How It Works and Team in error state", () => {
    renderAndHydrate({ data: undefined, error: new Error("boom"), isLoading: false, mutate: vi.fn() });
    expect(screen.getByTestId("about-us-error")).toBeInTheDocument();
    expect(screen.queryByTestId("how-it-works-section")).not.toBeInTheDocument();
    expect(screen.queryByTestId("team-section")).not.toBeInTheDocument();
  });

  it("does not render How It Works and Team in empty state", () => {
    renderAndHydrate({ data: null, error: undefined, isLoading: false, mutate: vi.fn() });
    expect(screen.getByTestId("about-us-empty")).toBeInTheDocument();
    expect(screen.queryByTestId("how-it-works-section")).not.toBeInTheDocument();
    expect(screen.queryByTestId("team-section")).not.toBeInTheDocument();
  });
});
