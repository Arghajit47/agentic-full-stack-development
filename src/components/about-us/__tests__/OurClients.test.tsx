import { describe, it, expect, beforeAll, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { OurClients } from "@/components/about-us/OurClients";
import { ourClientsMock } from "@/lib/mocks/our-clients-mocks";

// Set window width for desktop (2 cards visible at once)
beforeAll(() => {
  Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 1920 });
});

afterEach(() => {
  cleanup();
});

describe("OurClients", () => {
  it("renders section heading and subheading", () => {
    render(<OurClients data={ourClientsMock} />);

    expect(screen.getByTestId("our-clients-heading")).toHaveTextContent("Our Valued Clients");
    expect(screen.getByTestId("our-clients-subheading")).toHaveTextContent(
      "At Estatein, we have had the privilege of working with a diverse range of clients",
    );
  });

  it("renders visible client cards at desktop (both cards fit on one page)", () => {
    render(<OurClients data={ourClientsMock} />);

    const cards = screen.getAllByTestId(/^client-card-/);
    expect(cards).toHaveLength(2);
  });

  it("renders both client cards with correct company names at desktop", () => {
    render(<OurClients data={ourClientsMock} />);

    expect(screen.getByTestId("client-card-greentech-enterprises")).toBeInTheDocument();
    expect(screen.getByTestId("client-card-abc-corporation")).toBeInTheDocument();
  });

  it("renders grid container for client cards", () => {
    render(<OurClients data={ourClientsMock} />);

    const grid = screen.getByTestId("our-clients-grid");
    expect(grid).toHaveClass("grid");
  });

  it("renders section with correct background", () => {
    render(<OurClients data={ourClientsMock} />);

    const section = screen.getByTestId("our-clients-section");
    expect(section).toHaveClass("bg-zinc-950");
  });

  it("renders all Visit Website buttons for visible cards", () => {
    render(<OurClients data={ourClientsMock} />);

    const buttons = screen.getAllByTestId("client-website-button");
    expect(buttons).toHaveLength(2);
    buttons.forEach((button) => {
      expect(button).toHaveTextContent("Visit Website");
    });
  });

  it("does not render navigation arrows when all cards fit on one page at desktop", () => {
    render(<OurClients data={ourClientsMock} />);

    // With 2 cards and 2 cards visible at desktop, there's only 1 page — no arrows rendered
    expect(screen.queryByTestId("clients-prev-arrow")).not.toBeInTheDocument();
    expect(screen.queryByTestId("clients-next-arrow")).not.toBeInTheDocument();
  });
});
