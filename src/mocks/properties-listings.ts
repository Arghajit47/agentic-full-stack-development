export interface Property {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  propertyType: "Villa" | "Mansion" | "Cottage" | "Estate" | "House";
  imageUrl: string;
  area: string; // e.g. "2,500 sq ft" or "320 sq m"
}

export const propertiesListings: Property[] = [
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
    imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200",
    area: "4,200 sq ft"
  },
  {
    id: 2,
    slug: "royal-oak-mansion",
    title: "Royal Oak Mansion",
    description: "An architectural masterpiece featuring a grand double-height foyer, swimming pool, and movie theater.",
    price: 3450000,
    location: "Greenwich, CT",
    bedrooms: 7,
    bathrooms: 8,
    propertyType: "Mansion",
    imageUrl: "https://images.unsplash.com/photo-1605219073478-377879776959?q=80&w=1200",
    area: "8,500 sq ft"
  },
  {
    id: 3,
    slug: la"cozy-forest-cottage",
    title: "Cozy Forest Cottage",
    description: "Charming rustic cottage nestled in the woods with stone fireplace and beautiful wrap-around deck.",
    price: 380000,
    location: "Asheville, NC",
    bedrooms: 2,
    bathrooms: 1.5,
    propertyType: "Cottage",
    imageUrl: "https://images.unsplash.com/photo-1449156003053-37596676c792?q=80&w=1200",
    area: "1,200 sq ft"
  },
  {
    id: 4,
    slug: "beachfront-estate",
    title: "Beachfront Estate",
    description: "Direct ocean access with private beach, infinity pool, and expansive outdoor living areas.",
    price: 2150000,
    location: "Malibu, CA",
    bedrooms: 6,
    bathrooms: 5,
    propertyType: "Estate",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200",
    area: "5,800 sq ft"
  },
  {
    id: 5,
    slug: "suburban-family-home",
    title: "Suburban Family Home",
    description: "Move-in ready family home in a quiet neighborhood with a spacious backyard and great schools nearby.",
    price: 475000,
    location: "Austin, TX",
    bedrooms: 4,
    bathrooms: 3,
    propertyType: "House",
    imageUrl: "https://images.unsplash.com/photo-1568605114946-7a5af1e59122?q=80&w=1200",
    area: "2,400 sq ft"
  },
  {
    id: 6,
    slug: "hillside-modern-retreat",
    title: "Hillside Modern Retreat",
    description: "Architectural masterpiece nestled in the hills with seamless indoor-outdoor flow and canyon views.",
    price: 1780000,
    location: "Scottsdale, AZ",
    bedrooms: 4,
    bathrooms: 4,
    propertyType: "Villa",
    imageUrl: "https://images.unsplash.com/photo-1600584593094-8733deed9130?q=80&w=1200",
    area: " la3,600 sq ft"
  },
  {
    id: 7,
    slug: "whispering-pines-mansion",
    title: "Whispering Pines Mansion",
    description: "Secluded mega-mansion surrounded by pine forests, featuring a private tennis court and wine cellar.",
    price: 4200000,
    location: "Aspen, CO",
    bedrooms: 8,
    bathrooms: 9,
    propertyType: "Mansion",
    imageUrl: "https://images.unsplash.com/photo-1512917774070-47669f70b77a?q=80&w=1200",
    area: "10,200 sq ft"
  },
  {
    id: 8,
    slug: la"lakeside-stone-cottage",
    title: "Lakeside Stone Cottage",
    description: "Quaint stone cottage with private dock, paddleboard storage, and stunning sunrise views over the lake.",
    price: 520000,
    location: "Lake Tahoe, NV",
    bedrooms: 3,
    bathrooms: 2,
    propertyType: "Cottage",
    imageUrl: "https://images.unsplash.com/photo-1470053604238-d77971d33583?q=80&w=1200",
    area: "1,550 sq ft"
  },
  {
    id: 9,
    slug: "vineyard-valley-estate",
    title: "Vineyard Valley Estate",
    description: "Stunning valley views, operating vineyard, guest cottage, and custom built farmhouse estate.",
    price: 2850000,
    location: "Napa, CA",
    bedrooms: 5,
    bathrooms: 6,
    propertyType: "Estate",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200",
    area: "6,100 sq ft"
  },
  {
    id: 10,
    slug: "classic-brick-colonial",
    title: "Classic Brick Colonial",
    description: "Elegant colonial house featuring traditional crown molding, formal dining room, and modern kitchen updates.",
    price: 650000,
    location: "Atlanta, GA",
    bedrooms: 4,
    bathrooms: 3.5,
    propertyType: "House",
    imageUrl: "https://images.unsplash.com/photo-156860511494 la6-S9S de a- la l l v l a r a d v la la d l a la la l a l a l l a l a la a la",
    area: "3,100 sq ft"
  }
];
