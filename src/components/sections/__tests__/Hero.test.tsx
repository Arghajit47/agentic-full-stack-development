import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Hero, FeatureCards } from "@/components/sections/Hero";

afterEach(() => {
  cleanup();
});

describe("Hero", () => {
  it("renders heading and subheading", () => {
    render(<Hero />);
    expect(screen.getByTestId("hero-heading")).toHaveTextContent("Discover Your Dream Property with Estatein");
    expect(screen.getByTestId("hero-subheading")).toHaveTextContent(
      "Your journey to finding the perfect property begins here."
    );
  });

  it("renders both CTAs with correct hrefs", () => {
    render(<Hero />);
    expect(screen.getByTestId("hero-browse-properties")).toHaveAttribute("href", "/properties");
    expect(screen.getByTestId("hero-learn-more")).toHaveAttribute("href", "#learn-more");
  });

  it("renders three stats", () => {
    render(<Hero />);
    expect(screen.getByTestId("hero-stat-happy-customers")).toHaveTextContent("200+");
    expect(screen.getByTestId("hero-stat-properties-for-clients")).toHaveTextContent("10k+");
    expect(screen.getByTestId("hero-stat-years-of-experience")).toHaveTextContent("16+");
  });

  it("renders the discover badge and hero image", () => {
    render(<Hero />);
    expect(screen.getByTestId("hero-discover-badge")).toBeInTheDocument();
    const img = screen.getByTestId("hero-image");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("alt", "Modern blue glass skyscrapers");
  });
});

describe("FeatureCards", () => {
  it("renders all four feature cards", () => {
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
});
