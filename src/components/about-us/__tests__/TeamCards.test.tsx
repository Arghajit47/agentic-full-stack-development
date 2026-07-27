import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { TeamCards } from "@/components/about-us/TeamCards";
import { teamMock } from "@/lib/mocks/about-us-mocks";

afterEach(() => {
  cleanup();
});

describe("TeamCards", () => {
  it("renders heading and body copy", () => {
    render(<TeamCards data={teamMock} />);

    expect(screen.getByTestId("team-heading")).toHaveTextContent("Meet the Estatein Team");
    expect(screen.getByTestId("team-body")).toHaveTextContent(
      "driven by the dedication and expertise of our team",
    );
  });

  it("renders all four team member cards with names and roles", () => {
    render(<TeamCards data={teamMock} />);

    const grid = screen.getByTestId("team-grid");
    const cards = within(grid).getAllByRole("listitem");
    expect(cards).toHaveLength(4);

    const members = [
      ["Max Mitchell", "Founder"],
      ["Sarah Johnson", "Chief Real Estate Officer"],
      ["David Brown", "Head of Property Management"],
      ["Michael Turner", "Legal Counsel"],
    ];
    members.forEach(([name, role], index) => {
      expect(cards[index]).toHaveTextContent(name);
      expect(cards[index]).toHaveTextContent(role);
    });
  });

  it("is labelled for accessibility via aria-labelledby", () => {
    render(<TeamCards data={teamMock} />);

    const section = screen.getByTestId("team-section");
    expect(section).toHaveAttribute("aria-labelledby", "team-heading");
    expect(screen.getByTestId("team-heading")).toHaveAttribute("id", "team-heading");
  });
});
