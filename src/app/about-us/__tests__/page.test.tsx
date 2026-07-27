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
  });
});
