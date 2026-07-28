import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { OurClients } from "@/components/about-us/OurClients";
import { ourClientsMock } from "@/lib/mocks/our-clients-mocks";

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

  it("renders correct number of client cards", () => {
    render(<OurClients data={ourClientsMock} />);

    const cards = screen.getAllByTestId(/^client-card-/);
    expect(cards).toHaveLength(2);
  });

  it("renders both client cards with correct company names", () => {
    render(<OurClients data={ourClientsMock} />);

    expect(screen.getByTestId("client-card-greentech-enterprises")).toBeInTheDocument();
    expect(screen.getByTestId("client-card-abc-corporation")).toBeInTheDocument();
  });

  it("applies responsive grid classes", () => {
    render(<OurClients data={ourClientsMock} />);

    const grid = screen.getByTestId("our-clients-grid");
    expect(grid).toHaveClass("grid", "grid-cols-1", "lg:grid-cols-2");
  });

  it("renders section with correct background", () => {
    render(<OurClients data={ourClientsMock} />);

    const section = screen.getByTestId("our-clients-section");
    expect(section).toHaveClass("bg-zinc-950");
  });

  it("renders all Visit Website buttons", () => {
    render(<OurClients data={ourClientsMock} />);

    const buttons = screen.getAllByTestId("client-website-button");
    expect(buttons).toHaveLength(2);
    buttons.forEach((button) => {
      expect(button).toHaveTextContent("Visit Website");
    });
  });
});
