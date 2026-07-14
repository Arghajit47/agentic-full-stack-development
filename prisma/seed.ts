import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean slate
  await prisma.property.deleteMany();
  await prisma.review.deleteMany();
  await prisma.siteSetting.deleteMany();

  // --- 6 Properties (5 featured, 1 not) ---
  const properties = [
    {
      slug: "modern-villa-sunset-hills",
      title: "Modern Villa in Sunset Hills",
      price: 1250000,
      location: "Sunset Hills, CA",
      bedrooms: 4,
      bathrooms: 3,
      areaSqft: 3200,
      imageUrl: "https://images.unsplash.com/photo-1613442765392-71f49fe1a4c9?w=800",
      isFeatured: true,
      galleryUrls: JSON.stringify([
        "https://images.unsplash.com/photo-1613442765392-71f49fe1a4c9?w=800",
        "https://images.unsplash.com/photo-1600596542815-ff1a8d6c943c?w=800",
      ]),
      features: JSON.stringify(["Swimming Pool", "Smart Home", "Solar Panels", "Garden"]),
    },
    {
      slug: "downtown-loft-penthouse",
      title: "Downtown Loft Penthouse",
      price: 875000,
      location: "Downtown, NY",
      bedrooms: 2,
      bathrooms: 2,
      areaSqft: 1800,
      imageUrl: "https://images.unsplash.com/photo-1600585154340-be2b97a7d1f1?w=800",
      isFeatured: true,
      galleryUrls: JSON.stringify([
        "https://images.unsplash.com/photo-1600585154340-be2b97a7d1f1?w=800",
        "https://images.unsplash.com/photo-1600585152220-90c63e269f09?w=800",
      ]),
      features: JSON.stringify(["Floor-to-Ceiling Windows", "City View", "Concierge"]),
    },
    {
      slug: "beachfront-cottage-malibu",
      title: "Beachfront Cottage in Malibu",
      price: 2100000,
      location: "Malibu, CA",
      bedrooms: 3,
      bathrooms: 2,
      areaSqft: 2400,
      imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c899?w=800",
      isFeatured: true,
      galleryUrls: JSON.stringify([
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c899?w=800",
        "https://images.unsplash.com/photo-1505228391849-ea6f2a9a8d2d?w=800",
      ]),
      features: JSON.stringify(["Ocean View", "Private Beach Access", "Fireplace", "Patio"]),
    },
    {
      slug: "suburban-family-home-austin",
      title: "Suburban Family Home in Austin",
      price: 540000,
      location: "Austin, TX",
      bedrooms: 5,
      bathrooms: 3,
      areaSqft: 3600,
      imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
      isFeatured: true,
      galleryUrls: JSON.stringify([
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
        "https://images.unsplash.com/photo-1583847268970-a3e8a9b6c2e3?w=800",
      ]),
      features: JSON.stringify(["Backyard", "Garage", "Open Kitchen", "Study Room"]),
    },
    {
      slug: "luxury-condo-miami-skyline",
      title: "Luxury Condo with Miami Skyline View",
      price: 980000,
      location: "Miami, FL",
      bedrooms: 3,
      bathrooms: 3,
      areaSqft: 2100,
      imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3a10f657?w=800",
      isFeatured: true,
      galleryUrls: JSON.stringify([
        "https://images.unsplash.com/photo-1545324418-cc1a3a10f657?w=800",
        "https://images.unsplash.com/photo-1493809842364-78817add864c?w=800",
      ]),
      features: JSON.stringify(["Skyline View", "Gym Access", "Rooftop Pool", "Doorman"]),
    },
    {
      slug: "cozy-studio-cabin-aspenn",
      title: "Cozy Studio Cabin in Aspen",
      price: 320000,
      location: "Aspen, CO",
      bedrooms: 1,
      bathrooms: 1,
      areaSqft: 650,
      imageUrl: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800",
      isFeatured: false,
      galleryUrls: JSON.stringify([
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800",
      ]),
      features: JSON.stringify(["Mountain View", "Wood Stove", "Hiking Trails Nearby"]),
    },
  ];

  for (const p of properties) {
    await prisma.property.create({ data: p });
  }

  // --- 5 Reviews (ratings 1-5, one with null propertyTitle) ---
  const reviews = [
    {
      clientName: "Sarah Johnson",
      clientAvatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      rating: 5,
      reviewText: "Absolutely seamless experience from start to finish. Found our dream home in under a week!",
      propertyTitle: "Modern Villa in Sunset Hills",
    },
    {
      clientName: "Michael Chen",
      clientAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      rating: 4,
      reviewText: "Great service and professional team. They understood exactly what we were looking for.",
      propertyTitle: "Downtown Loft Penthouse",
    },
    {
      clientName: "Emily Rodriguez",
      clientAvatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      rating: 5,
      reviewText: "The best real estate decision we ever made. The beachfront property exceeded all expectations.",
      propertyTitle: "Beachfront Cottage in Malibu",
    },
    {
      clientName: "David Kim",
      clientAvatarUrl: "https://images.unsplash.com/photo-1500648767731-6d968f1f1b1f?w=100",
      rating: 3,
      reviewText: "Good overall, though the process took a bit longer than expected. Happy with the result.",
      propertyTitle: null,
    },
    {
      clientName: "Jessica Williams",
      clientAvatarUrl: "https://images.unsplash.com/photo-1534528741775-1254dd9d9b0f?w=100",
      rating: 2,
      reviewText: "Communication could have been better. The property was nice but some details were overlooked.",
      propertyTitle: "Suburban Family Home in Austin",
    },
  ];

  for (const r of reviews) {
    await prisma.review.create({ data: r });
  }

  // --- 14 Site Settings ---
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

  console.log("Seed complete: 6 properties, 5 reviews, 14 settings");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });