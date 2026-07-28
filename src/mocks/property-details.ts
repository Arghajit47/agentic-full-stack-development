export interface PropertyImage {
  id: number;
  url: string;
  alt: string;
  caption?: string;
}

export interface PropertyFeature {
  id: number;
  name: string;
  icon: string; // lucide-react icon name
  value: string;
}

export interface PropertyAmenity {
  id: number;
  category: string;
  items: string[];
}

export interface PropertyDetailedInfo {
  id: number;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  price: number;
  location: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  propertyType: "Villa" | "Mansion" | "Cottage" | "Estate" | "House";
  area: string;
  lotSize?: string;
  yearBuilt?: number;
  status: "For Sale" | "For Rent" | "Sold" | "Pending";
  images: PropertyImage[];
  features: PropertyFeature[];
  amenities: PropertyAmenity[];
  agentName?: string;
  agentPhone?: string;
  agentEmail?: string;
}

export const propertyDetailsData: PropertyDetailedInfo[] = [
  {
    id: 1,
    slug: "modern-luxury-villa",
    title: "Modern Luxury Villa",
    description: "Spacious contemporary villa with floor-to-ceiling windows, open-plan living, and a private garden.",
    longDescription: "Experience the epitome of modern luxury in this exquisitely designed contemporary villa. Featuring expansive floor-to-ceiling windows that flood the interior with natural light, this home seamlessly blends indoor and outdoor living. The open-plan design creates a fluid, spacious environment perfect for both entertaining and everyday family life. Step outside to your private garden oasis, complete with mature landscaping and multiple outdoor living areas.",
    price: 1250000,
    location: "Beverly Hills, CA",
    address: "456 Sunset Boulevard, Beverly Hills, CA 90210",
    bedrooms: 5,
    bathrooms: 4,
    propertyType: "Villa",
    area: "4,200 sq ft",
    lotSize: "8,500 sq ft",
    yearBuilt: 2020,
    status: "For Sale",
    images: [
      {
        id: 1,
        url: "/images/properties/property-1.jpg",
        alt: "Modern Luxury Villa - Exterior",
        caption: "Stunning contemporary exterior with clean lines"
      },
      {
        id: 2,
        url: "/images/properties/property-1-interior-1.jpg",
        alt: "Modern Luxury Villa - Living Room",
        caption: "Spacious open-plan living area"
      },
      {
        id: 3,
        url: "/images/properties/property-1-interior-2.jpg",
        alt: "Modern Luxury Villa - Kitchen",
        caption: "Gourmet kitchen with premium appliances"
      },
      {
        id: 4,
        url: "/images/properties/property-1-interior-3.jpg",
        alt: "Modern Luxury Villa - Master Bedroom",
        caption: "Luxurious master suite"
      },
      {
        id: 5,
        url: "/images/properties/property-1-exterior-2.jpg",
        alt: "Modern Luxury Villa - Garden",
        caption: "Private garden and outdoor living space"
      }
    ],
    features: [
      { id: 1, name: "Bedrooms", icon: "Bed", value: "5" },
      { id: 2, name: "Bathrooms", icon: "Bath", value: "4" },
      { id: 3, name: "Area", icon: "Ruler", value: "4,200 sq ft" },
      { id: 4, name: "Lot Size", icon: "Square", value: "8,500 sq ft" },
      { id: 5, name: "Year Built", icon: "Calendar", value: "2020" },
      { id: 6, name: "Parking", icon: "Car", value: "3 Garage" },
      { id: 7, name: "Property Type", icon: "Home", value: "Villa" },
      { id: 8, name: "Status", icon: "Tag", value: "For Sale" }
    ],
    amenities: [
      {
        id: 1,
        category: "Interior",
        items: [
          "Hardwood Floors",
          "High Ceilings",
          "Walk-in Closets",
          "Smart Home System",
          "Central AC & Heating",
          "Fireplace"
        ]
      },
      {
        id: 2,
        category: "Exterior",
        items: [
          "Private Garden",
          "Outdoor Kitchen",
          "Swimming Pool",
          "Patio",
          "Landscaped Yard",
          "Sprinkler System"
        ]
      },
      {
        id: 3,
        category: "Additional",
        items: [
          "Security System",
          "Gated Community",
          "Solar Panels",
          "EV Charging Station",
          "Storage Room",
          "Laundry Room"
        ]
      }
    ],
    agentName: "Sarah Johnson",
    agentPhone: "+1 (310) 555-0123",
    agentEmail: "sarah.johnson@realestate.com"
  },
  {
    id: 2,
    slug: "royal-oak-mansion",
    title: "Royal Oak Mansion",
    description: "An architectural masterpiece featuring a grand double-height foyer, swimming pool, and movie theater.",
    longDescription: "Step into grandeur with this exceptional architectural masterpiece. The Royal Oak Mansion showcases impeccable craftsmanship and attention to detail throughout. From the moment you enter the grand double-height foyer with its stunning chandelier, you'll be captivated by the elegance and sophistication. This estate offers the ultimate in luxury living with world-class amenities including a resort-style swimming pool, state-of-the-art movie theater, and expansive entertainment spaces.",
    price: 3450000,
    location: "Greenwich, CT",
    address: "123 Royal Oak Drive, Greenwich, CT 06830",
    bedrooms: 7,
    bathrooms: 8,
    propertyType: "Mansion",
    area: "8,500 sq ft",
    lotSize: "2.5 acres",
    yearBuilt: 2018,
    status: "For Sale",
    images: [
      {
        id: 1,
        url: "/images/properties/property-2.jpg",
        alt: "Royal Oak Mansion - Exterior",
        caption: "Majestic mansion with classical architecture"
      },
      {
        id: 2,
        url: "/images/properties/property-2-interior-1.jpg",
        alt: "Royal Oak Mansion - Foyer",
        caption: "Grand double-height foyer"
      },
      {
        id: 3,
        url: "/images/properties/property-2-interior-2.jpg",
        alt: "Royal Oak Mansion - Living Room",
        caption: "Elegant formal living room"
      },
      {
        id: 4,
        url: "/images/properties/property-2-pool.jpg",
        alt: "Royal Oak Mansion - Pool",
        caption: "Resort-style swimming pool"
      },
      {
        id: 5,
        url: "/images/properties/property-2-theater.jpg",
        alt: "Royal Oak Mansion - Theater",
        caption: "Private movie theater"
      }
    ],
    features: [
      { id: 1, name: "Bedrooms", icon: "Bed", value: "7" },
      { id: 2, name: "Bathrooms", icon: "Bath", value: "8" },
      { id: 3, name: "Area", icon: "Ruler", value: "8,500 sq ft" },
      { id: 4, name: "Lot Size", icon: "Square", value: "2.5 acres" },
      { id: 5, name: "Year Built", icon: "Calendar", value: "2018" },
      { id: 6, name: "Parking", icon: "Car", value: "4 Garage" },
      { id: 7, name: "Property Type", icon: "Home", value: "Mansion" },
      { id: 8, name: "Status", icon: "Tag", value: "For Sale" }
    ],
    amenities: [
      {
        id: 1,
        category: "Interior",
        items: [
          "Marble Floors",
          "Crown Molding",
          "Wine Cellar",
          "Library",
          "Home Theater",
          "Elevator",
          "Chef's Kitchen"
        ]
      },
      {
        id: 2,
        category: "Exterior",
        items: [
          "Swimming Pool & Spa",
          "Tennis Court",
          "Outdoor Kitchen",
          "Gazebo",
          "Fountain",
          "Manicured Gardens"
        ]
      },
      {
        id: 3,
        category: "Additional",
        items: [
          "24/7 Security",
          "Guest House",
          "Gym",
          "Sauna",
          "Generator",
          "Whole-house Audio"
        ]
      }
    ],
    agentName: "Michael Chen",
    agentPhone: "+1 (203) 555-0456",
    agentEmail: "michael.chen@realestate.com"
  },
  {
    id: 3,
    slug: "cozy-forest-cottage",
    title: "Cozy Forest Cottage",
    description: "Charming rustic cottage nestled in the woods with stone fireplace and beautiful wrap-around deck.",
    longDescription: "Escape to your private retreat in this charming rustic cottage, perfectly nestled among towering trees. This cozy haven features authentic wood beams, a magnificent stone fireplace, and a beautiful wrap-around deck where you can enjoy your morning coffee while listening to birdsong. The cottage offers a perfect blend of rustic charm and modern comfort, ideal for those seeking a peaceful sanctuary away from the hustle and bustle.",
    price: 380000,
    location: "Asheville, NC",
    address: "789 Forest Trail, Asheville, NC 28801",
    bedrooms: 2,
    bathrooms: 1.5,
    propertyType: "Cottage",
    area: "1,200 sq ft",
    lotSize: "0.75 acres",
    yearBuilt: 2015,
    status: "For Sale",
    images: [
      {
        id: 1,
        url: "/images/properties/property-3.jpg",
        alt: "Cozy Forest Cottage - Exterior",
        caption: "Charming cottage nestled in the woods"
      },
      {
        id: 2,
        url: "/images/properties/property-3-interior-1.jpg",
        alt: "Cozy Forest Cottage - Living Room",
        caption: "Cozy living room with stone fireplace"
      },
      {
        id: 3,
        url: "/images/properties/property-3-deck.jpg",
        alt: "Cozy Forest Cottage - Deck",
        caption: "Wrap-around deck with forest views"
      },
      {
        id: 4,
        url: "/images/properties/property-3-bedroom.jpg",
        alt: "Cozy Forest Cottage - Bedroom",
        caption: "Peaceful master bedroom"
      }
    ],
    features: [
      { id: 1, name: "Bedrooms", icon: "Bed", value: "2" },
      { id: 2, name: "Bathrooms", icon: "Bath", value: "1.5" },
      { id: 3, name: "Area", icon: "Ruler", value: "1,200 sq ft" },
      { id: 4, name: "Lot Size", icon: "Square", value: "0.75 acres" },
      { id: 5, name: "Year Built", icon: "Calendar", value: "2015" },
      { id: 6, name: "Parking", icon: "Car", value: "2 Carport" },
      { id: 7, name: "Property Type", icon: "Home", value: "Cottage" },
      { id: 8, name: "Status", icon: "Tag", value: "For Sale" }
    ],
    amenities: [
      {
        id: 1,
        category: "Interior",
        items: [
          "Wood Beam Ceilings",
          "Stone Fireplace",
          "Updated Kitchen",
          "Hardwood Floors",
          "Skylights"
        ]
      },
      {
        id: 2,
        category: "Exterior",
        items: [
          "Wrap-around Deck",
          "Fire Pit",
          "Garden Area",
          "Storage Shed",
          "Mountain Views"
        ]
      },
      {
        id: 3,
        category: "Additional",
        items: [
          "Wood Stove",
          "Well Water",
          "Septic System",
          "Wildlife Viewing"
        ]
      }
    ],
    agentName: "Emily Parker",
    agentPhone: "+1 (828) 555-0789",
    agentEmail: "emily.parker@realestate.com"
  }
];

export function getPropertyDetailBySlug(slug: string): PropertyDetailedInfo | undefined {
  return propertyDetailsData.find(property => property.slug === slug);
}
