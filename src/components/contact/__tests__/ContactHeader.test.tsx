import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ContactHeader, ContactInfo } from "../ContactHeader";

describe("ContactHeader", () => {
  describe("Rendering", () => {
    it("should render the header section", () => {
      render(<ContactHeader />);

      const headers = screen.queryAllByTestId("contact-header");
      expect(headers.length).toBeGreaterThan(0);
    });

    it("should render the title and description", () => {
      render(<ContactHeader />);

      const titles = screen.queryAllByTestId("contact-header-title");
      const descriptions = screen.queryAllByTestId("contact-header-description");
      
      expect(titles.length).toBeGreaterThan(0);
      expect(titles[0]).toHaveTextContent("Get in Touch");
      expect(descriptions.length).toBeGreaterThan(0);
      expect(descriptions[0]).toHaveTextContent(/We're here to help and answer any question/);
    });

    it("should render all three contact info cards", () => {
      render(<ContactHeader />);

      const emails = screen.queryAllByTestId("contact-info-email");
      const phones = screen.queryAllByTestId("contact-info-phone");
      const addresses = screen.queryAllByTestId("contact-info-address");
      
      expect(emails.length).toBeGreaterThan(0);
      expect(phones.length).toBeGreaterThan(0);
      expect(addresses.length).toBeGreaterThan(0);
    });
  });

  describe("Default Contact Information", () => {
    it("should display default email", () => {
      render(<ContactHeader />);

      const emailCards = screen.queryAllByTestId("contact-info-email");
      expect(emailCards.length).toBeGreaterThan(0);
      expect(emailCards[0]).toHaveTextContent("info@estatein.com");
    });

    it("should display default phone", () => {
      render(<ContactHeader />);

      const phoneCards = screen.queryAllByTestId("contact-info-phone");
      expect(phoneCards.length).toBeGreaterThan(0);
      expect(phoneCards[0]).toHaveTextContent("+1 (555) 123-4567");
    });

    it("should display default address", () => {
      render(<ContactHeader />);

      const addressCards = screen.queryAllByTestId("contact-info-address");
      expect(addressCards.length).toBeGreaterThan(0);
      expect(addressCards[0]).toHaveTextContent("123 Main Street, New York, NY 10001");
    });
  });

  describe("Custom Contact Information", () => {
    const customContactInfo: ContactInfo = {
      email: "custom@example.com",
      phone: "+1 (999) 888-7777",
      address: "456 Custom Ave, Los Angeles, CA 90001",
    };

    it("should display custom email when provided", () => {
      render(<ContactHeader contactInfo={customContactInfo} />);

      const emailCards = screen.queryAllByTestId("contact-info-email");
      expect(emailCards.length).toBeGreaterThan(0);
      expect(emailCards[emailCards.length - 1]).toHaveTextContent("custom@example.com");
    });

    it("should display custom phone when provided", () => {
      render(<ContactHeader contactInfo={customContactInfo} />);

      const phoneCards = screen.queryAllByTestId("contact-info-phone");
      expect(phoneCards.length).toBeGreaterThan(0);
      expect(phoneCards[phoneCards.length - 1]).toHaveTextContent("+1 (999) 888-7777");
    });

    it("should display custom address when provided", () => {
      render(<ContactHeader contactInfo={customContactInfo} />);

      const addressCards = screen.queryAllByTestId("contact-info-address");
      expect(addressCards.length).toBeGreaterThan(0);
      expect(addressCards[addressCards.length - 1]).toHaveTextContent("456 Custom Ave, Los Angeles, CA 90001");
    });
  });

  describe("Icons", () => {
    it("should render email icon", () => {
      render(<ContactHeader />);

      const emailCards = screen.queryAllByTestId("contact-info-email");
      expect(emailCards.length).toBeGreaterThan(0);
      const icon = emailCards[0].querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it("should render phone icon", () => {
      render(<ContactHeader />);

      const phoneCards = screen.queryAllByTestId("contact-info-phone");
      expect(phoneCards.length).toBeGreaterThan(0);
      const icon = phoneCards[0].querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it("should render address icon", () => {
      render(<ContactHeader />);

      const addressCards = screen.queryAllByTestId("contact-info-address");
      expect(addressCards.length).toBeGreaterThan(0);
      const icon = addressCards[0].querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe("Links", () => {
    it("should have mailto link for email", () => {
      render(<ContactHeader />);

      const emailCards = screen.queryAllByTestId("contact-info-email");
      expect(emailCards.length).toBeGreaterThan(0);
      const link = emailCards[0].querySelector('a[href^="mailto:"]');
      expect(link).toHaveAttribute("href", "mailto:info@estatein.com");
    });

    it("should have tel link for phone", () => {
      render(<ContactHeader />);

      const phoneCards = screen.queryAllByTestId("contact-info-phone");
      expect(phoneCards.length).toBeGreaterThan(0);
      const link = phoneCards[0].querySelector('a[href^="tel:"]');
      expect(link).toHaveAttribute("href", "tel:+1(555)123-4567");
    });

    it("should create proper tel link from formatted phone number", () => {
      const customInfo: ContactInfo = {
        email: "test@test.com",
        phone: "+1 (555) 123-4567",
        address: "123 Test St",
      };

      render(<ContactHeader contactInfo={customInfo} />);

      const phoneCards = screen.queryAllByTestId("contact-info-phone");
      expect(phoneCards.length).toBeGreaterThan(0);
      const link = phoneCards[0].querySelector('a[href^="tel:"]');
      // Should strip out everything except numbers and +
      expect(link).toHaveAttribute("href", "tel:+1(555)123-4567");
    });
  });

  describe("Styling and Layout", () => {
    it("should have proper card headings", () => {
      render(<ContactHeader />);

      const emailCards = screen.queryAllByTestId("contact-info-email");
      const phoneCards = screen.queryAllByTestId("contact-info-phone");
      const addressCards = screen.queryAllByTestId("contact-info-address");

      expect(emailCards.length).toBeGreaterThan(0);
      expect(phoneCards.length).toBeGreaterThan(0);
      expect(addressCards.length).toBeGreaterThan(0);

      expect(emailCards[0].querySelector('h3')).toHaveTextContent("Email");
      expect(phoneCards[0].querySelector('h3')).toHaveTextContent("Phone");
      expect(addressCards[0].querySelector('h3')).toHaveTextContent("Address");
    });

    it("should apply grid layout classes", () => {
      render(<ContactHeader />);

      const headers = screen.queryAllByTestId("contact-header");
      expect(headers.length).toBeGreaterThan(0);
      const grid = headers[0].querySelector('.grid');
      expect(grid).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have aria-hidden on decorative icons", () => {
      render(<ContactHeader />);

      const emailCards = screen.queryAllByTestId("contact-info-email");
      expect(emailCards.length).toBeGreaterThan(0);
      const icon = emailCards[0].querySelector('svg');
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });

    it("should have semantic HTML structure", () => {
      render(<ContactHeader />);

      const headers = screen.queryAllByTestId("contact-header");
      expect(headers.length).toBeGreaterThan(0);
      const section = headers[0];
      expect(section.tagName).toBe("SECTION");

      const titles = screen.queryAllByTestId("contact-header-title");
      expect(titles.length).toBeGreaterThan(0);
      const title = titles[0];
      expect(title.tagName).toBe("H1");

      const emailCards = screen.queryAllByTestId("contact-info-email");
      expect(emailCards.length).toBeGreaterThan(0);
      const heading = emailCards[0].querySelector('h3');
      expect(heading).toBeInTheDocument();
    });
  });
});
