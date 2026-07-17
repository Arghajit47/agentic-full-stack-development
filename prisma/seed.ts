import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PROPERTY_TITLES = [
  "Modern Villa in Sunset Hills",
  "Downtown Loft Penthouse",
  "Beachfront Cottage in Malibu",
  "Suburban Family Home in Austin",
  "Luxury Condo with Miami Skyline View",
  "Cozy Studio Cabin in Aspen",
  "Garden Estate in Napa Valley",
  "Urban Penthouse in Chicago",
  "Lake House in Seattle",
  "Mountain Cabin in Denver",
  "Riverside Apartment in Boston",
  "Historic Townhouse in Nashville",
  "Modern Bungalow in Portland",
  "Skyline Tower in San Diego",
  "Cozy Studio in Phoenix",
  "Grand Mansion in Atlanta",
  "Seaside Villa in Dallas",
  "Parkside Duplex in San Francisco",
  "Executive Suite in Philadelphia",
  "Country Farmhouse in Las Vegas",
];

const LOCATIONS = [
  "Sunset Hills, CA",
  "Downtown, NY",
  "Malibu, CA",
  "Austin, TX",
  "Miami, FL",
  "Aspen, CO",
  "Napa Valley, CA",
  "Chicago, IL",
  "Seattle, WA",
  "Denver, CO",
  "Boston, MA",
  "Nashville, TN",
  "Portland, OR",
  "San Diego, CA",
  "Phoenix, AZ",
  "Atlanta, GA",
  "Dallas, TX",
  "San Francisco, CA",
  "Philadelphia, PA",
  "Las Vegas, NV",
];

const PROPERTY_TYPES = [
  "Villa", "Penthouse", "Cottage", "House", "Condo", "Cabin",
  "Estate", "Penthouse", "House", "Cabin", "Apartment", "Townhouse",
  "Bungalow", "Tower", "Studio", "Mansion", "Villa", "Duplex", "Suite", "Farmhouse",
];

const FEATURES = [
  ["Swimming Pool", "Smart Home", "Solar Panels", "Garden"],
  ["Floor-to-Ceiling Windows", "City View", "Concierge"],
  ["Ocean View", "Private Beach Access", "Fireplace", "Patio"],
  ["Backyard", "Garage", "Open Kitchen", "Study Room"],
  ["Skyline View", "Gym Access", "Rooftop Pool", "Doorman"],
  ["Mountain View", "Wood Stove", "Hiking Trails Nearby"],
  ["Vineyard View", "Wine Cellar", "Chef's Kitchen", "Guest House"],
  ["High Ceilings", "Private Terrace", "Gourmet Kitchen"],
  ["Dock Access", "Waterfront", "Floor-to-Ceiling Windows"],
  ["Hot Tub", "Ski Access", "Stone Fireplace"],
  ["River View", "Balcony", "Fitness Center"],
  ["Original Hardwood", "Courtyard", "Updated Kitchen"],
  ["Craftsman Details", "Front Porch", "Modern Appliances"],
  ["Panoramic Views", "Concierge", "Pool"],
  ["Minimalist Design", "Rooftop Access", "Co-working Space"],
  ["Home Theater", "Wine Room", "Pool House"],
  ["Private Beach", "Outdoor Kitchen", "Infinity Pool"],
  ["Park View", "Garage", "Roof Deck"],
  ["Concierge", "Business Center", "Valet Parking"],
  ["Barn", "Acreage", "Porch Swing"],
];

const REVIEW_NAMES = [
  "Sarah Johnson", "Michael Chen", "Emily Rodriguez", "David Kim", "Jessica Williams",
  "Robert Brown", "Amanda Davis", "James Miller", "Laura Wilson", "Daniel Moore",
  "Sophia Taylor", "Christopher Anderson", "Olivia Thomas", "Matthew Jackson", "Ava White",
  "Ethan Harris", "Isabella Martin", "William Thompson", "Mia Garcia", "Alexander Martinez",
];

const REVIEW_TEXTS = [
  "Absolutely seamless experience from start to finish. Highly recommended!",
  "Great service and a professional team. They understood exactly what we wanted.",
  "The best real estate decision we ever made. Exceeded all expectations.",
  "Good overall, though the process took a bit longer than expected.",
  "Communication could have been better, but the property was nice.",
  "Outstanding market knowledge and attention to detail. Would use again.",
  "Friendly agents and a smooth closing process. Very happy with our new home.",
  "Helped us find the perfect rental in a competitive market. Thank you!",
  "Honest advice and no pressure. Exactly what we needed as first-time buyers.",
  "The virtual tours saved us so much time. Found our home within two weeks.",
];

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function avatarUrl(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=703BF7&color=fff&size=128`;
}

async function main() {
  await prisma.property.deleteMany();
  await prisma.review.deleteMany();
  await prisma.siteSetting.deleteMany();

  const properties = PROPERTY_TITLES.map((title, i) => ({
    slug: slugify(title),
    title,
    description: `${title} — ${FEATURES[i].join(", ")}. A beautiful home waiting for the right buyer.`,
    price: 250000 + i * 75000 + (i % 3) * 25000,
    location: LOCATIONS[i],
    bedrooms: 1 + (i % 6),
    bathrooms: 1 + (i % 4),
    areaSqft: 800 + i * 250,
    propertyType: PROPERTY_TYPES[i],
    imageUrl: `/images/properties/property-${(i % 6) + 1}.jpg`,
    isFeatured: true,
    galleryUrls: JSON.stringify([
      `/images/properties/property-${(i % 6) + 1}.jpg`,
    ]),
    features: JSON.stringify(FEATURES[i]),
  }));

  for (const p of properties) {
    await prisma.property.create({ data: p });
  }

  const propertyTitles = properties.map((p) => p.title);
  const reviews = REVIEW_NAMES.map((clientName, i) => ({
    clientName,
    clientAvatarUrl: avatarUrl(clientName),
    rating: i < 5 ? [5, 5, 4, 5, 4][i] : (i % 5) + 1,
    reviewText: REVIEW_TEXTS[i % REVIEW_TEXTS.length],
    propertyTitle: i % 4 === 0 ? null : propertyTitles[i % propertyTitles.length],
  }));

  for (const r of reviews) {
    await prisma.review.create({ data: r });
  }

  const settings = [
    { key: "site_name", value: "EstateHub" },
    { key: "site_tagline", value: "Find Your Perfect Home" },
    { key: "hero_heading", value: "Discover Your Dream Home" },
    { key: "hero_subheading", value: "Browse curated featured properties handpicked by our experts" },
    { key: "hero_cta_text", value: "View Properties" },
    { key: "properties_heading", value: "Featured Properties" },
    { key: "properties_subheading", value: "Explore our handpicked selection of premium homes" },
    { key: "reviews_heading", value: "What Our Clients Say" },
    { key: "reviews_subheading", value: "Real stories from happy homeowners" },
    { key: "footer_about", value: "EstateHub is a premier real estate platform connecting buyers with their dream homes." },
    { key: "footer_contact_email", value: "hello@estatehub.com" },
    { key: "footer_contact_phone", value: "+1 (555) 123-4567" },
    { key: "footer_address", value: "123 Real Estate Ave, New York, NY 10001" },
    { key: "cta_button_text", value: "Get Started" },
  ];

  for (const s of settings) {
    await prisma.siteSetting.create({ data: s });
  }

  console.log(`Seed complete: ${properties.length} properties, ${reviews.length} reviews, ${settings.length} settings`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
