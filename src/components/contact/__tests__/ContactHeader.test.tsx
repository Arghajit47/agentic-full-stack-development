import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ContactHeader, type ContactInfo } from "../ContactHeader";

describe("ContactHeader", () => {
  afterEach(() => {
    cleanup();
  });
  it("renders the section and title", () => {
    render(<ContactHeader />);
    expect(screen.getByTestId("contact-header")).toBeInTheDocument();
    expect(screen.getByTestId("contact-header-title")).toHaveTextContent("Get in Touch with Estatein");
  });

  it("renders the description", () => {
    render(<ContactHeader />);
    expect(screen.getByTestId("contact-header-description")).toHaveTextContent(/Welcome to Estatein's Contact Us page/);
  });

  it("renders four contact cards", () => {
    render(<ContactHeader />);
    expect(screen.getByTestId("contact-info-email")).toBeInTheDocument();
    expect(screen.getByTestId("contact-info-phone")).toBeInTheDocument();
    expect(screen.getByTestId("contact-info-hq")).toBeInTheDocument();
    expect(screen.getByTestId("contact-info-social")).toBeInTheDocument();
  });

  it("renders email card with mailto link", () => {
    render(<ContactHeader />);
    const card = screen.getByTestId("contact-info-email");
    expect(card).toHaveTextContent("info@estatein.com");
    expect(card).toHaveAttribute("href", "mailto:info@estatein.com");
  });

  it("renders phone card with tel link", () => {
    render(<ContactHeader />);
    const card = screen.getByTestId("contact-info-phone");
    expect(card).toHaveTextContent("+1 (123) 456-7890");
    expect(card).toHaveAttribute("href", "tel:+11234567890");
  });

  it("renders headquarters card", () => {
    render(<ContactHeader />);
    expect(screen.getByTestId("contact-info-hq")).toHaveTextContent("Main Headquarters");
  });

  it("renders social links", () => {
    render(<ContactHeader />);
    const card = screen.getByTestId("contact-info-social");
    expect(card).toHaveTextContent("Instagram");
    expect(card).toHaveTextContent("LinkedIn");
    expect(card).toHaveTextContent("Facebook");
  });

  it("renders an icon inside each card", () => {
    render(<ContactHeader />);
    const cards = [
      screen.getByTestId("contact-info-email"),
      screen.getByTestId("contact-info-phone"),
      screen.getByTestId("contact-info-hq"),
      screen.getByTestId("contact-info-social"),
    ];
    cards.forEach((card) => {
      expect(card.querySelector("svg")).toBeInTheDocument();
    });
  });

  it("still accepts legacy contactInfo prop without crashing", () => {
    const legacy: ContactInfo = {
      email: "legacy@example.com",
      phone: "+1 999 999 9999",
      address: "Legacy Address",
    };
    render(<ContactHeader contactInfo={legacy} />);
    expect(screen.getByTestId("contact-header")).toBeInTheDocument();
  });
});
