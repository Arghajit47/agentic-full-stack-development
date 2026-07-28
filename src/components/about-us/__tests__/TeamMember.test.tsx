import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { TeamMember } from "@/components/about-us/TeamMember";
import type { TeamMemberData } from "@/lib/types/about-us";

const mockMember: TeamMemberData = {
  name: "Max Mitchell",
  role: "Founder",
  imageUrl: "/images/team/team-max.jpg",
  twitterUrl: "https://twitter.com/estatein",
};

afterEach(() => {
  cleanup();
});

describe("TeamMember", () => {
  it("renders name, role and portrait image", () => {
    render(<TeamMember member={mockMember} />);

    const card = screen.getByTestId("team-member-max-mitchell");
    expect(card).toHaveTextContent("Max Mitchell");
    expect(card).toHaveTextContent("Founder");

    const image = screen.getByTestId("team-member-image-max-mitchell");
    expect(image).toHaveAttribute("alt", "Portrait of Max Mitchell, Founder");
    expect(image).toHaveAttribute("loading", "lazy");
  });

  it("renders an accessible twitter link opening in a new tab", () => {
    render(<TeamMember member={mockMember} />);

    const link = screen.getByTestId("team-member-twitter-max-mitchell");
    expect(link).toHaveAttribute("href", "https://twitter.com/estatein");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveAccessibleName("Visit Max Mitchell on Twitter");
  });
});
