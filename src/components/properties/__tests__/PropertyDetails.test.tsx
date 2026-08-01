import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { PropertyDetails } from "../PropertyDetails";
import { type PropertyDetailedInfo } from "@/lib/schemas";

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

  it("renders Description heading", () => {
    render(<PropertyDetails property={mockProperty} />);
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("renders Key Features and Amenities heading", () => {
    render(<PropertyDetails property={mockProperty} />);
    expect(screen.getByText("Key Features and Amenities")).toBeInTheDocument();
  });

  it("displays property description", () => {
    render(<PropertyDetails property={mockProperty} />);
    const desc = screen.getByTestId("property-short-description");
    expect(desc.textContent).toBe("A beautiful test property.");
  });

  it("displays stat features in two-column layout", () => {
    render(<PropertyDetails property={mockProperty} />);
    expect(screen.getByTestId("stat-bed").textContent).toBe("4");
    expect(screen.getByTestId("stat-bath").textContent).toBe("3");
    expect(screen.getByTestId("stat-ruler").textContent).toBe("3,500 sq ft");
  });

  it("displays flattened amenity items", () => {
    render(<PropertyDetails property={mockProperty} />);
    const amenitiesSection = screen.getByTestId("property-amenities");
    expect(amenitiesSection).toBeInTheDocument();
    expect(screen.getByTestId("amenity-item-0").textContent).toContain("Hardwood Floors");
    expect(screen.getByTestId("amenity-item-3").textContent).toContain("Garden");
  });

  it("displays all amenity items flattened across categories", () => {
    render(<PropertyDetails property={mockProperty} />);
    const allItems = mockProperty.amenities.flatMap((g) => g.items);
    allItems.forEach((item, index) => {
      expect(screen.getByTestId(`amenity-item-${index}`).textContent).toContain(item);
    });
  });

  it("displays agent contact information", () => {
    render(<PropertyDetails property={mockProperty} />);
    expect(screen.getByTestId("agent-contact")).toBeInTheDocument();
    expect(screen.getByTestId("agent-name").textContent).toBe("John Doe");
    expect(screen.getByTestId("agent-phone").textContent).toBe("+1 (555) 123-4567");
    expect(screen.getByTestId("agent-email").textContent).toBe("john.doe@test.com");
  });

  it("does not render agent section when agent name is not provided", () => {
    const propertyWithoutAgent = { ...mockProperty, agentName: undefined };
    render(<PropertyDetails property={propertyWithoutAgent} />);
    const agentSections = screen.queryAllByTestId("agent-contact");
    expect(agentSections.length).toBe(0);
  });

  it("renders two-column layout container", () => {
    render(<PropertyDetails property={mockProperty} />);
    const details = screen.getByTestId("property-details");
    expect(details.querySelector(".grid")).toBeInTheDocument();
  });
});
