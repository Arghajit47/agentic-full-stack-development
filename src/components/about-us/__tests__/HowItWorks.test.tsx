import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { HowItWorks } from "@/components/about-us/HowItWorks";
import { howItWorksMock } from "@/lib/mocks/about-us-mocks";

afterEach(() => {
  cleanup();
});

describe("HowItWorks", () => {
  it("renders heading and body copy", () => {
    render(<HowItWorks data={howItWorksMock} />);

    expect(screen.getByTestId("how-it-works-heading")).toHaveTextContent(
      "Navigating the Estatein Experience",
    );
    expect(screen.getByTestId("how-it-works-body")).toHaveTextContent(
      "step-by-step guide to how it all works",
    );
  });

  it("renders all six step cards in order", () => {
    render(<HowItWorks data={howItWorksMock} />);

    const grid = screen.getByTestId("how-it-works-grid");
    const cards = within(grid).getAllByRole("listitem");
    expect(cards).toHaveLength(6);

    const titles = [
      "Discover a World of Possibilities",
      "Narrowing Down Your Choices",
      "Personalized Guidance",
      "See It for Yourself",
      "Making Informed Decisions",
      "Getting the Best Deal",
    ];
    titles.forEach((title, index) => {
      expect(cards[index]).toHaveTextContent(title);
      expect(cards[index]).toHaveTextContent(`Step 0${index + 1}`);
    });
  });

  it("is labelled for accessibility via aria-labelledby", () => {
    render(<HowItWorks data={howItWorksMock} />);

    const section = screen.getByTestId("how-it-works-section");
    expect(section).toHaveAttribute("aria-labelledby", "how-it-works-heading");
    expect(screen.getByTestId("how-it-works-heading")).toHaveAttribute(
      "id",
      "how-it-works-heading",
    );
  });
});
