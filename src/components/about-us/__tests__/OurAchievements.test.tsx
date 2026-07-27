import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { OurAchievements } from "@/components/about-us/OurAchievements";
import type { AboutUsAchievements } from "@/lib/schemas";

const mockAchievements: AboutUsAchievements = {
  heading: "Our Achievements",
  body: "Our story is one of continuous growth and evolution.",
  cards: [
    { title: "3+ Years of Excellence", description: "With over 3 years in the industry." },
    { title: "Happy Clients", description: "Our greatest achievement." },
    { title: "Industry Recognition", description: "We've earned the respect." },
  ],
};

afterEach(() => {
  cleanup();
});

describe("OurAchievements", () => {
  it("renders heading, body and three achievement cards from props", () => {
    render(<OurAchievements data={mockAchievements} />);

    expect(screen.getByTestId("our-achievements-heading")).toHaveTextContent("Our Achievements");
    expect(screen.getByTestId("our-achievements-body")).toHaveTextContent("continuous growth and evolution");

    expect(screen.getByTestId("our-achievements-card-3-years-of-excellence")).toHaveTextContent("3+ Years of Excellence");
    expect(screen.getByTestId("our-achievements-card-happy-clients")).toHaveTextContent("Happy Clients");
    expect(screen.getByTestId("our-achievements-card-industry-recognition")).toHaveTextContent("Industry Recognition");
  });
});
