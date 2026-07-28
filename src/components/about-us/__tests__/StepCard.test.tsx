import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { StepCard } from "@/components/about-us/StepCard";
import type { HowItWorksStep } from "@/lib/types/about-us";

const mockStep: HowItWorksStep = {
  stepNumber: "Step 01",
  title: "Discover a World of Possibilities",
  description: "Your journey begins with exploring our carefully curated property listings.",
};

afterEach(() => {
  cleanup();
});

describe("StepCard", () => {
  it("renders step number, title and description", () => {
    render(<StepCard step={mockStep} />);

    const card = screen.getByTestId("step-card-step-01");
    expect(card).toHaveTextContent("Step 01");
    expect(card).toHaveTextContent("Discover a World of Possibilities");
    expect(card).toHaveTextContent("exploring our carefully curated property listings");
  });

  it("renders the title as a level-3 heading", () => {
    render(<StepCard step={mockStep} />);

    expect(
      screen.getByRole("heading", { level: 3, name: "Discover a World of Possibilities" }),
    ).toBeInTheDocument();
  });
});
