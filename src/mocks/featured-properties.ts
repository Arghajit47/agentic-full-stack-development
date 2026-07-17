export interface Property {
  id: number;
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
    title: "Modern Luxury Villa",
    description: "Spacious contemporary villa with floor-to-ceiling windows, open-plan living, and a private garden.",
    price: 1250000,
    location: "Beverly Hills, CA",
    bedrooms: 5,
    bathrooms: 4,
    propertyType: "Villa",
    imageUrl:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    title: "Downtown Penthouse",
    description: "Stunning top-floor penthouse with panoramic city views and premium finishes throughout.",
    price: 895000,
    location: "New York, NY",
    bedrooms: 3,
    bathrooms: 2,
    propertyType: "Penthouse",
    imageUrl:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    title: "Beachfront Estate",
    description: "Direct ocean access with private beach, infinity pool, and expansive outdoor living areas.",
    price: 2150000,
    location: "Malibu, CA",
    bedrooms: 6,
    bathrooms: 5,
    propertyType: "Estate",
    imageUrl:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    title: "Suburban Family Home",
    description: "Move-in ready family home in a quiet neighborhood with great schools nearby.",
    price: 475000,
    location: "Austin, TX",
    bedrooms: 4,
    bathrooms: 3,
    propertyType: "House",
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    title: "Contemporary Loft",
    description: "Industrial-chic loft with exposed brick, high ceilings, and modern amenities.",
    price: 620000,
    location: "Chicago, IL",
    bedrooms: 2,
    bathrooms: 2,
    propertyType: "Loft",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 6,
    title: "Hillside Modern Retreat",
    description: "Architectural masterpiece nestled in the hills with seamless indoor-outdoor flow.",
    price: 1780000,
    location: "Scottsdale, AZ",
    bedrooms: 4,
    bathrooms: 4,
    propertyType: "Villa",
    imageUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80",
  },
];