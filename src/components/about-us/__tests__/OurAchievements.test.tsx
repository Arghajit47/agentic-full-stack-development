import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { OurAchievements } from "@/components/about-us/OurAchievements";

afterEach(() => {
  cleanup();
});

describe("OurAchievements", () => {
  it("renders heading, body and three achievement cards", () => {
    render(<OurAchievements />);

    expect(screen.getByTestId("our-achievements-heading")).toHaveTextContent("Our Achievements");
    expect(screen.getByTestId("our-achievements-body")).toHaveTextContent("continuous growth and evolution");

    expect(screen.getByTestId("our-achievements-card-3-years-of-excellence")).toHaveTextContent("3+ Years of Excellence");
    expect(screen.getByTestId("our-achievements-card-happy-clients")).toHaveTextContent("Happy Clients");
    expect(screen.getByTestId("our-achievements-card-industry-recognition")).toHaveTextContent("Industry Recognition");
  });
});
