export interface Property {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  imageUrl: string;
}

export const featuredProperties: Property[] = [
  {
    id: 1,
    slug: "modern-luxury-villa",
    title: "Modern Luxury Villa",
    description: "Spacious contemporary villa with floor-to-ceiling windows, open-plan living, and a private garden.",
    price: 1250000,
    location: "Beverly Hills, CA",
    bedrooms: 5,
    bathrooms: 4,
    propertyType: "Villa",
    imageUrl: "/images/properties/property-1.jpg",
  },
  {
    id: 2,
    slug: "downtown-penthouse",
    title: "Downtown Penthouse",
    description: "Stunning top-floor penthouse with panoramic city views and premium finishes throughout.",
    price: 895000,
    location: "New York, NY",
    bedrooms: 3,
    bathrooms: 2,
    propertyType: "Penthouse",
    imageUrl: "/images/properties/property-2.jpg",
  },
  {
    id: 3,
    slug: "beachfront-estate",
    title: "Beachfront Estate",
    description: "Direct ocean access with private beach, infinity pool, and expansive outdoor living areas.",
    price: 2150000,
    location: "Malibu, CA",
    bedrooms: 6,
    bathrooms: 5,
    propertyType: "Estate",
    imageUrl: "/images/properties/property-3.jpg",
  },
  {
    id: 4,
    slug: "suburban-family-home",
    title: "Suburban Family Home",
    description: "Move-in ready family home in a quiet neighborhood with great schools nearby.",
    price: 475000,
    location: "Austin, TX",
    bedrooms: 4,
    bathrooms: 3,
    propertyType: "House",
    imageUrl: "/images/properties/property-4.jpg",
  },
  {
    id: 5,
    slug: "contemporary-loft",
    title: "Contemporary Loft",
    description: "Industrial-chic loft with exposed brick, high ceilings, and modern amenities.",
    price: 620000,
    location: "Chicago, IL",
    bedrooms: 2,
    bathrooms: 2,
    propertyType: "Loft",
    imageUrl: "/images/properties/property-5.jpg",
  },
  {
    id: 6,
    slug: "hillside-modern-retreat",
    title: "Hillside Modern Retreat",
    description: "Architectural masterpiece nestled in the hills with seamless indoor-outdoor flow.",
    price: 1780000,
    location: "Scottsdale, AZ",
    bedrooms: 4,
    bathrooms: 4,
    propertyType: "Villa",
    imageUrl: "/images/properties/property-6.jpg",
  },
];
