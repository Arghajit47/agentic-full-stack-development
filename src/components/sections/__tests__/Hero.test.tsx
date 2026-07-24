import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Hero, FeatureCards } from "@/components/sections/Hero";

afterEach(() => {
  cleanup();
});

const mockHero = {
  heading: "API Heading",
  subheading: "API subheading text.",
  primaryCta: { text: "Primary", href: "/primary" },
  secondaryCta: { text: "Secondary", href: "#secondary" },
  stats: [
    { value: "1", label: "One" },
    { value: "2", label: "Two" },
    { value: "3", label: "Three" },
  ],
  features: [
    { title: "Find Your Dream Home", description: "" },
    { title: "Unlock Property Value", description: "" },
    { title: "Effortless Property Management", description: "" },
    { title: "Smart Investments. Informed Decisions", description: "" },
  ],
};

describe("Hero data render", () => {
  it("renders heading and subheading from props", () => {
    render(<Hero hero={mockHero} />);
    expect(screen.getByTestId("hero-heading")).toHaveTextContent("API Heading");
    expect(screen.getByTestId("hero-subheading")).toHaveTextContent("API subheading text.");
  });

  it("renders both CTAs from props", () => {
    render(<Hero hero={mockHero} />);
    expect(screen.getByTestId("hero-browse-properties")).toHaveAttribute("href", "/primary");
    expect(screen.getByTestId("hero-browse-properties")).toHaveTextContent("Primary");
    expect(screen.getByTestId("hero-learn-more")).toHaveAttribute("href", "#secondary");
    expect(screen.getByTestId("hero-learn-more")).toHaveTextContent("Secondary");
  });

  it("renders stats from props", () => {
    render(<Hero hero={mockHero} />);
    expect(screen.getByTestId("hero-stat-one")).toHaveTextContent("1");
    expect(screen.getByTestId("hero-stat-two")).toHaveTextContent("2");
    expect(screen.getByTestId("hero-stat-three")).toHaveTextContent("3");
  });

  it("renders the discover badge and hero image", () => {
    render(<Hero hero={mockHero} />);
    expect(screen.getByTestId("hero-discover-badge")).toBeInTheDocument();
    const img = screen.getByTestId("hero-image");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("alt", "Modern blue glass skyscrapers");
  });
});

describe("Hero loading skeleton", () => {
  it("renders skeleton placeholders while loading", () => {
    render(<Hero isLoading />);
    expect(screen.getByTestId("hero-heading-skeleton")).toBeInTheDocument();
    expect(screen.getByTestId("hero-subheading-skeleton")).toBeInTheDocument();
    expect(screen.getByTestId("hero-primary-cta-skeleton")).toBeInTheDocument();
    expect(screen.getByTestId("hero-secondary-cta-skeleton")).toBeInTheDocument();
    expect(screen.queryByTestId("hero-heading")).not.toBeInTheDocument();
  });

  it("renders feature card skeletons while loading", () => {
    render(<FeatureCards isLoading />);
    expect(screen.getByTestId("feature-card-find-your-dream-home-skeleton")).toBeInTheDocument();
    expect(screen.queryByTestId("feature-card-find-your-dream-home")).not.toBeInTheDocument();
  });
});

describe("Hero error + retry", () => {
  it("renders error state with retry button", () => {
    const retry = vi.fn();
    const err = new Error("boom");
    render(<Hero error={err} retry={retry} />);
    expect(screen.getByTestId("hero-error")).toHaveTextContent("Unable to load hero content");
    const retryButton = screen.getByTestId("hero-retry");
    expect(retryButton).toBeInTheDocument();
    fireEvent.click(retryButton);
    expect(retry).toHaveBeenCalledTimes(1);
  });
});

describe("Hero default fallback", () => {
  it("renders hardcoded defaults when no data is provided", () => {
    render(<Hero />);
    expect(screen.getByTestId("hero-heading")).toHaveTextContent("Discover Your Dream Property with Estatein");
    expect(screen.getByTestId("hero-subheading")).toHaveTextContent(
      "Your journey to finding the perfect property begins here."
    );
    expect(screen.getByTestId("hero-browse-properties")).toHaveAttribute("href", "/properties");
    expect(screen.getByTestId("hero-browse-properties")).toHaveTextContent("Browse Properties");
    expect(screen.getByTestId("hero-learn-more")).toHaveAttribute("href", "#learn-more");
    expect(screen.getByTestId("hero-learn-more")).toHaveTextContent("Learn More");
    expect(screen.getByTestId("hero-stat-happy-customers")).toHaveTextContent("200+");
    expect(screen.getByTestId("hero-stat-properties-for-clients")).toHaveTextContent("10k+");
    expect(screen.getByTestId("hero-stat-years-of-experience")).toHaveTextContent("16+");
  });

  it("does not render error banner when no error is provided", () => {
    render(<Hero />);
    expect(screen.queryByTestId("hero-error")).not.toBeInTheDocument();
  });
});

describe("FeatureCards", () => {
  it("renders all four default feature cards when no features provided", () => {
    render(<FeatureCards />);
    expect(screen.getByTestId("feature-card-find-your-dream-home")).toHaveTextContent("Find Your Dream Home");
    expect(screen.getByTestId("feature-card-unlock-property-value")).toHaveTextContent("Unlock Property Value");
    expect(screen.getByTestId("feature-card-effortless-property-management")).toHaveTextContent(
      "Effortless Property Management"
    );
    expect(screen.getByTestId("feature-card-smart-investments.-informed-decisions")).toHaveTextContent(
      "Smart Investments. Informed Decisions"
    );
  });

  it("renders feature cards from props", () => {
    const customFeatures = [
      { title: "Custom One", description: "" },
      { title: "Custom Two", description: "" },
      { title: "Custom Three", description: "" },
      { title: "Custom Four", description: "" },
    ];
    render(<FeatureCards features={customFeatures} />);
    expect(screen.getByTestId("feature-card-custom-one")).toHaveTextContent("Custom One");
    expect(screen.getByTestId("feature-card-custom-two")).toHaveTextContent("Custom Two");
    expect(screen.getByTestId("feature-card-custom-three")).toHaveTextContent("Custom Three");
    expect(screen.getByTestId("feature-card-custom-four")).toHaveTextContent("Custom Four");
  });
});
