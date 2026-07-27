import { describe, it, expect, afterEach, vi } from "vitest";
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

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("AboutUsPage", () => {
  it("renders loading state", () => {
    mockSWR.mockReturnValue({ data: undefined, error: undefined, isLoading: true, mutate: vi.fn() });
    render(<AboutUsPage />);
    expect(screen.getByTestId("about-us-loading")).toBeInTheDocument();
  });

  it("renders error state with retry", async () => {
    const mutate = vi.fn();
    mockSWR.mockReturnValue({ data: undefined, error: new Error("boom"), isLoading: false, mutate });
    render(<AboutUsPage />);
    expect(screen.getByTestId("about-us-error")).toHaveTextContent("Unable to load About Us");
    fireEvent.click(screen.getByRole("button", { name: /retry/i }));
    await waitFor(() => expect(mutate).toHaveBeenCalled());
  });

  it("renders empty state", () => {
    mockSWR.mockReturnValue({ data: null, error: undefined, isLoading: false, mutate: vi.fn() });
    render(<AboutUsPage />);
    expect(screen.getByTestId("about-us-empty")).toBeInTheDocument();
  });

  it("renders page wrapper and sections from fetched data", () => {
    mockSWR.mockReturnValue({ data: mockData, error: undefined, isLoading: false, mutate: vi.fn() });
    render(<AboutUsPage />);
    expect(screen.getByTestId("about-us-page")).toBeInTheDocument();
    expect(screen.getByTestId("our-journey-heading")).toHaveTextContent("Our Journey");
    expect(screen.getByTestId("our-values-heading")).toHaveTextContent("Our Values");
    expect(screen.getByTestId("our-achievements-heading")).toHaveTextContent("Our Achievements");
  });
});
