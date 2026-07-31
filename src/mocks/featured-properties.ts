export interface Property {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  propertyType: string;
  imageUrl: string;
  isFeatured: boolean;
  galleryUrls: string[];
  features: string[];
}

export const featuredProperties: Property[] = [
  {
    id: 1,
    slug: "seawide-serenity-villa",
    title: "Seawide Serenity Villa",
    description: "Seawide Serenity Villa — Swimming Pool, Smart Home, Solar Panels, Garden. A beautiful home waiting for the right buyer.",
    price: 1250000,
    location: "Sunset Hills, CA",
    bedrooms: 1,
    bathrooms: 1,
    areaSqft: 800,
    propertyType: "Villa",
    imageUrl: "/images/properties/property-1.jpg",
    isFeatured: true,
    galleryUrls: ["/images/properties/property-1.jpg"],
    features: ["Swimming Pool", "Smart Home", "Solar Panels", "Garden"],
  },
  {
    id: 2,
    slug: "metropolitan-haven",
    title: "Metropolitan Haven",
    description: "Metropolitan Haven — Floor-to-Ceiling Windows, City View, Concierge. A beautiful home waiting for the right buyer.",
    price: 600000,
    location: "Downtown, NY",
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1050,
    propertyType: "Penthouse",
    imageUrl: "/images/properties/property-2.jpg",
    isFeatured: true,
    galleryUrls: ["/images/properties/property-2.jpg"],
    features: ["Floor-to-Ceiling Windows", "City View", "Concierge"],
  },
  {
    id: 3,
    slug: "rustic-retreat-cottage",
    title: "Rustic Retreat Cottage",
    description: "Rustic Retreat Cottage — Ocean View, Private Beach Access, Fireplace, Patio. A beautiful home waiting for the right buyer.",
    price: 350000,
    location: "Malibu, CA",
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 1300,
    propertyType: "Cottage",
    imageUrl: "/images/properties/property-3.jpg",
    isFeatured: true,
    galleryUrls: ["/images/properties/property-3.jpg"],
    features: ["Ocean View", "Private Beach Access", "Fireplace", "Patio"],
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
    areaSqft: 2800,
    propertyType: "House",
    imageUrl: "/images/properties/property-4.jpg",
    isFeatured: true,
    galleryUrls: ["/images/properties/property-4.jpg"],
    features: ["Garage", "Garden"],
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
    areaSqft: 1500,
    propertyType: "Loft",
    imageUrl: "/images/properties/property-5.jpg",
    isFeatured: true,
    galleryUrls: ["/images/properties/property-5.jpg"],
    features: ["High ceilings", "Gym"],
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
    areaSqft: 4800,
    propertyType: "Villa",
    imageUrl: "/images/properties/property-6.jpg",
    isFeatured: true,
    galleryUrls: ["/images/properties/property-6.jpg"],
    features: ["Hill view", "Pool"],
  },
];
