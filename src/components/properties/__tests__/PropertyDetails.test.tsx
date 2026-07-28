import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { PropertyDetails } from "../PropertyDetails";
import { type PropertyDetailedInfo } from "@/mocks/property-details";

describe("PropertyDetails", () => {
  afterEach(() => {
    cleanup();
  });

  const mockProperty: PropertyDetailedInfo = {
    id: 1,
    slug: "test-property",
    title: "Test Luxury Villa",
    description: "A beautiful test property.",
    longDescription: "This is a longer description with more details about the property features and amenities.",
    price: 1250000,
    location: "Beverly Hills, CA",
    address: "123 Test Street, Beverly Hills, CA 90210",
    bedrooms: 4,
    bathrooms: 3,
    propertyType: "Villa",
    area: "3,500 sq ft",
    lotSize: "7,000 sq ft",
    yearBuilt: 2020,
    status: "For Sale",
    images: [],
    features: [
      { id: 1, name: "Bedrooms", icon: "Bed", value: "4" },
      { id: 2, name: "Bathrooms", icon: "Bath", value: "3" },
      { id: 3, name: "Area", icon: "Ruler", value: "3,500 sq ft" },
      { id: 4, name: "Lot Size", icon: "Square", value: "7,000 sq ft" }
    ],
    amenities: [
      {
        id: 1,
        category: "Interior",
        items: ["Hardwood Floors", "High Ceilings", "Smart Home"]
      },
      {
        id: 2,
        category: "Exterior",
        items: ["Garden", "Pool", "Patio"]
      }
    ],
    agentName: "John Doe",
    agentPhone: "+1 (555) 123-4567",
    agentEmail: "john.doe@test.com"
  };

  it("renders property details component", () => {
    render(<PropertyDetails property={mockProperty} />);
    expect(screen.getByTestId("property-details")).toBeInTheDocument();
  });

  it("displays property title", () => {
    render(<PropertyDetails property={mockProperty} />);
    const titles = screen.getAllByTestId("property-title");
    expect(titles[0].textContent).toBe("Test Luxury Villa");
  });

  it("displays property address", () => {
    render(<PropertyDetails property={mockProperty} />);
    const addresses = screen.getAllByTestId("property-address");
    expect(addresses[0].textContent).toBe("123 Test Street, Beverly Hills, CA 90210");
  });

  it("displays formatted price", () => {
    render(<PropertyDetails property={mockProperty} />);
    const prices = screen.getAllByTestId("property-price");
    expect(prices[0].textContent).toBe("$1,250,000");
  });

  it("displays property status badge", () => {
    render(<PropertyDetails property={mockProperty} />);
    const statuses = screen.getAllByTestId("property-status");
    expect(statuses[0].textContent).toBe("For Sale");
  });

  it("displays features grid", () => {
    render(<PropertyDetails property={mockProperty} />);
    const grids = screen.getAllByTestId("property-features-grid");
    expect(grids[0]).toBeInTheDocument();
    mockProperty.features.forEach(feature => {
      const elements = screen.getAllByTestId(`property-feature-${feature.id}`);
      expect(elements[0].textContent).toContain(feature.name);
    });
  });

  it("displays descriptions", () => {
    render(<PropertyDetails property={mockProperty} />);
    const shortDescs = screen.getAllByTestId("property-short-description");
    const longDescs = screen.getAllByTestId("property-long-description");
    expect(shortDescs[0].textContent).toBe("A beautiful test property.");
    expect(longDescs[0].textContent).toContain("This is a longer description");
  });

  it("displays amenities", () => {
    render(<PropertyDetails property={mockProperty} />);
    const amenitySections = screen.getAllByTestId("property-amenities");
    expect(amenitySections[0]).toBeInTheDocument();
    mockProperty.amenities.forEach(group => {
      const elements = screen.getAllByTestId(`amenity-group-${group.id}`);
      expect(elements[0].textContent).toContain(group.category);
    });
  });

  it("displays agent contact information", () => {
    render(<PropertyDetails property={mockProperty} />);
    const agentSections = screen.getAllByTestId("agent-contact");
    expect(agentSections[0]).toBeInTheDocument();
    
    const agentNames = screen.getAllByTestId("agent-name");
    expect(agentNames[0].textContent).toBe("John Doe");
    
    const agentPhones = screen.getAllByTestId("agent-phone");
    expect(agentPhones[0].textContent).toBe("+1 (555) 123-4567");
    
    const agentEmails = screen.getAllByTestId("agent-email");
    expect(agentEmails[0].textContent).toBe("john.doe@test.com");
  });

  it("does not render agent section when agent name is not provided", () => {
    const propertyWithoutAgent = { ...mockProperty, agentName: undefined };
    render(<PropertyDetails property={propertyWithoutAgent} />);
    // Use queryAll to handle StrictMode double render
    const agentSections = screen.queryAllByTestId("agent-contact");
    expect(agentSections.length).toBe(0);
  });

  it("applies correct status badge styling", () => {
    render(<PropertyDetails property={mockProperty} />);
    const statuses = screen.getAllByTestId("property-status");
    expect(statuses[0]).toHaveClass("bg-green-900/30");
    expect(statuses[0]).toHaveClass("text-green-400");
  });

  it("formats large prices correctly", () => {
    const expensiveProperty = { ...mockProperty, price: 15_000_000 };
    render(<PropertyDetails property={expensiveProperty} />);
    const prices = screen.getAllByTestId("property-price");
    // Check that the price contains the formatted number parts
    expect(prices[0].textContent).toContain("15");
    expect(prices[0].textContent).toContain("000");
  });

  it("has responsive grid classes", () => {
    render(<PropertyDetails property={mockProperty} />);
    const featuresGrids = screen.getAllByTestId("property-features-grid");
    expect(featuresGrids[0].className).toContain("grid");
  });
});
