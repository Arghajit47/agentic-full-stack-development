import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { OfficeLocationCard, type OfficeLocation } from "../OfficeLocationCard";

const mockOffice: OfficeLocation = {
  id: 1,
  name: "New York Headquarters",
  address: "123 Fifth Avenue",
  city: "New York",
  state: "NY",
  zipCode: "10003",
  phone: "+1 (212) 555-0100",
  email: "newyork@estatein.com",
  hours: {
    weekdays: "9:00 AM - 6:00 PM",
    weekends: "10:00 AM - 4:00 PM",
  },
};

describe("OfficeLocationCard", () => {
  afterEach(() => {
    cleanup();
  });
  it("renders office name correctly", () => {
    render(<OfficeLocationCard office={mockOffice} />);
    expect(screen.getByTestId("office-name")).toHaveTextContent("New York Headquarters");
  });

  it("renders full address correctly", () => {
    render(<OfficeLocationCard office={mockOffice} />);
    const address = screen.getByTestId("office-address");
    expect(address).toHaveTextContent("123 Fifth Avenue, New York, NY 10003");
  });

  it("renders phone number with correct href", () => {
    render(<OfficeLocationCard office={mockOffice} />);
    const phoneLink = screen.getByTestId("office-phone");
    expect(phoneLink).toHaveTextContent("+1 (212) 555-0100");
    expect(phoneLink).toHaveAttribute("href", "tel:+1(212)555-0100");
  });

  it("renders office hours correctly", () => {
    render(<OfficeLocationCard office={mockOffice} />);
    const hours = screen.getByTestId("office-hours");
    expect(hours).toHaveTextContent("Mon-Fri:");
    expect(hours).toHaveTextContent("9:00 AM - 6:00 PM");
    expect(hours).toHaveTextContent("Sat-Sun:");
    expect(hours).toHaveTextContent("10:00 AM - 4:00 PM");
  });

  it("renders contact button with correct mailto link", () => {
    render(<OfficeLocationCard office={mockOffice} />);
    const contactButton = screen.getByTestId("office-contact-button");
    expect(contactButton).toHaveTextContent("Contact This Office");
    expect(contactButton).toHaveAttribute(
      "href",
      "mailto:newyork%40estatein.com?subject=Inquiry%20about%20New%20York%20Headquarters"
    );
  });

  it("renders with correct test id", () => {
    render(<OfficeLocationCard office={mockOffice} />);
    expect(screen.getByTestId("office-card-1")).toBeInTheDocument();
  });

  it("renders all icons", () => {
    const { container } = render(<OfficeLocationCard office={mockOffice} />);
    // Check for icon containers
    const iconContainers = container.querySelectorAll(".bg-violet-600\\/10");
    expect(iconContainers.length).toBe(3); // MapPin, Phone, Clock
  });

  it("renders address as semantic address element", () => {
    render(<OfficeLocationCard office={mockOffice} />);
    const address = screen.getByTestId("office-address");
    expect(address.tagName).toBe("ADDRESS");
  });

  it("handles different office IDs", () => {
    const office2 = { ...mockOffice, id: 99 };
    render(<OfficeLocationCard office={office2} />);
    expect(screen.getByTestId("office-card-99")).toBeInTheDocument();
  });

  it("handles office with closed weekends", () => {
    const office = {
      ...mockOffice,
      hours: {
        weekdays: "9:00 AM - 5:00 PM",
        weekends: "Closed",
      },
    };
    render(<OfficeLocationCard office={office} />);
    const hours = screen.getByTestId("office-hours");
    expect(hours).toHaveTextContent("Closed");
  });

  it("applies hover styles with transition classes", () => {
    const { container } = render(<OfficeLocationCard office={mockOffice} />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("hover:border-violet-600/50");
    expect(card.className).toContain("transition-colors");
  });

  it("renders phone link with hover transition", () => {
    render(<OfficeLocationCard office={mockOffice} />);
    const phoneLink = screen.getByTestId("office-phone");
    expect(phoneLink.className).toContain("hover:text-violet-600");
    expect(phoneLink.className).toContain("transition-colors");
  });

  it("renders contact button with focus styles", () => {
    render(<OfficeLocationCard office={mockOffice} />);
    const contactButton = screen.getByTestId("office-contact-button");
    expect(contactButton.className).toContain("focus:ring-2");
    expect(contactButton.className).toContain("focus:ring-violet-600");
  });

  it("sanitizes phone number for tel link", () => {
    const office = {
      ...mockOffice,
      phone: "+1 (555) 123-4567",
    };
    render(<OfficeLocationCard office={office} />);
    const phoneLink = screen.getByTestId("office-phone");
    expect(phoneLink).toHaveAttribute("href", "tel:+1(555)123-4567");
  });
});
