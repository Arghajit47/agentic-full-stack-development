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
  await prisma.navigationLink.deleteMany();
  await prisma.footerSection.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.heroContent.deleteMany();
  await prisma.servicesContent.deleteMany();
  await prisma.aboutPageContent.deleteMany();

  const navigationLinks = [
    { label: "Home", href: "/", order: 1, isExternal: false },
    { label: "About Us", href: "/about-us", order: 2, isExternal: false },
    { label: "Properties", href: "/properties", order: 3, isExternal: false },
    { label: "Services", href: "/services", order: 4, isExternal: false },
  ];

  for (const link of navigationLinks) {
    await prisma.navigationLink.create({ data: link });
  }

  const footerSections = [
    {
      key: "cta",
      title: "Start Your Real Estate Journey Today",
      body: "Your dream property is just a click away. Whether you're looking for a new home, a strategic investment, or expert real estate advice, Estatein is here to assist you every step of the way. Take the first step towards your real estate goals and explore our available properties or get in touch with our team for personalized assistance.",
      ctaText: "Explore Properties",
      ctaHref: "/properties",
    },
    {
      key: "newsletter",
      placeholder: "Enter Your Email",
    },
    {
      key: "bottom",
      copyright: "©2024 Estatein. All Rights Reserved.",
      legalText: "Terms & Conditions",
    },
  ];

  for (const section of footerSections) {
    await prisma.footerSection.create({ data: section });
  }

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
    { key: "nav_banner", value: JSON.stringify({ text: "Discover Your Dream Property with Estatein", cta: "Learn More", ctaHref: "/properties" }) },
  ];

  for (const s of settings) {
    await prisma.siteSetting.create({ data: s });
  }

  const heroContent = [
    { key: "heading", value: "Discover Your Dream Property with Estatein" },
    { key: "subheading", value: "Your journey to finding the perfect property begins here. Explore our listings to find the home that matches your dreams." },
    { key: "primary_cta_text", value: "Browse Properties" },
    { key: "primary_cta_href", value: "/properties" },
    { key: "secondary_cta_text", value: "Learn More" },
    { key: "secondary_cta_href", value: "#learn-more" },
    { key: "stat_happy_customers", value: "200+" },
    { key: "stat_properties", value: "10k+" },
    { key: "stat_years", value: "16+" },
    { key: "feature_find_home_title", value: "Find Your Dream Home" },
    { key: "feature_property_value_title", value: "Unlock Property Value" },
    { key: "feature_management_title", value: "Effortless Property Management" },
    { key: "feature_investments_title", value: "Smart Investments. Informed Decisions" },
  ];

  for (const h of heroContent) {
    await prisma.heroContent.create({ data: h });
  }

  const servicesContent = [
    { section: "intro", slug: "intro-heading", value: JSON.stringify("Elevate Your Real Estate Experience"), order: 1 },
    { section: "intro", slug: "intro-subheading", value: JSON.stringify("Welcome to Estatein, where your real estate aspirations meet expert guidance. Explore our comprehensive range of services, each designed to cater to your unique needs and dreams."), order: 2 },

    { section: "quickLinks", slug: "quickLinks-find-your-dream-home", value: JSON.stringify({ title: "Find Your Dream Home", href: "/properties", icon: "Home" }), order: 1 },
    { section: "quickLinks", slug: "quickLinks-unlock-property-value", value: JSON.stringify({ title: "Unlock Property Value", href: "#property-selling", icon: "KeyRound" }), order: 2 },
    { section: "quickLinks", slug: "quickLinks-effortless-property-management", value: JSON.stringify({ title: "Effortless Property Management", href: "#property-management", icon: "Building2" }), order: 3 },
    { section: "quickLinks", slug: "quickLinks-smart-investments-informed-decisions", value: JSON.stringify({ title: "Smart Investments, Informed Decisions", href: "#investment-advisory", icon: "TrendingUp" }), order: 4 },

    { section: "propertySelling", slug: "propertySelling-heading", value: JSON.stringify("Unlock Property Value"), order: 1 },
    { section: "propertySelling", slug: "propertySelling-subheading", value: JSON.stringify("Selling your property should be a rewarding experience, and at Estatein, we make sure it is. Our Property Selling Service is designed to maximize the value of your property, ensuring you get the best deal possible. Explore the categories below to see how we can help you at every step of your selling journey."), order: 2 },
    { section: "propertySelling", slug: "propertySelling-category-valuation-mastery", value: JSON.stringify({ title: "Valuation Mastery", description: "Discover the true worth of your property with our expert valuation services.", icon: "TrendingUp" }), order: 3 },
    { section: "propertySelling", slug: "propertySelling-category-strategic-marketing", value: JSON.stringify({ title: "Strategic Marketing", description: "Selling a property requires more than just a listing; it demands a strategic marketing approach.", icon: "Megaphone" }), order: 4 },
    { section: "propertySelling", slug: "propertySelling-category-negotiation-wizardry", value: JSON.stringify({ title: "Negotiation Wizardry", description: "Negotiating the best deal is an art, and our negotiation experts are masters of it.", icon: "Handshake" }), order: 5 },
    { section: "propertySelling", slug: "propertySelling-category-closing-success", value: JSON.stringify({ title: "Closing Success", description: "A successful sale is not complete until the closing. We guide you through the intricate closing process.", icon: "CheckCircle" }), order: 6 },
    { section: "propertySelling", slug: "propertySelling-cta-heading", value: JSON.stringify("Unlock the Value of Your Property Today"), order: 7 },
    { section: "propertySelling", slug: "propertySelling-cta-body", value: JSON.stringify("Ready to unlock the true value of your property? Explore our Property Selling Service categories and let us help you achieve the best deal possible for your valuable asset."), order: 8 },
    { section: "propertySelling", slug: "propertySelling-cta-href", value: JSON.stringify("#services/property-selling"), order: 9 },
    { section: "propertySelling", slug: "propertySelling-cta-text", value: JSON.stringify("Learn More"), order: 10 },

    { section: "propertyManagement", slug: "propertyManagement-heading", value: JSON.stringify("Effortless Property Management"), order: 1 },
    { section: "propertyManagement", slug: "propertyManagement-subheading", value: JSON.stringify("Owning a property should be a pleasure, not a hassle. Estatein's Property Management Service takes the stress out of property ownership, offering comprehensive solutions tailored to your needs. Explore the categories below to see how we can make property management effortless for you."), order: 2 },
    { section: "propertyManagement", slug: "propertyManagement-category-tenant-harmony", value: JSON.stringify({ title: "Tenant Harmony", description: "Our Tenant Management services ensure that your tenants have a smooth and reducing vacancies.", icon: "Users" }), order: 3 },
    { section: "propertyManagement", slug: "propertyManagement-category-maintenance-ease", value: JSON.stringify({ title: "Maintenance Ease", description: "Say goodbye to property maintenance headaches. We handle all aspects of property upkeep.", icon: "Wrench" }), order: 4 },
    { section: "propertyManagement", slug: "propertyManagement-category-financial-peace-of-mind", value: JSON.stringify({ title: "Financial Peace of Mind", description: "Managing property finances can be complex. Our financial experts take care of rent collection.", icon: "Wallet" }), order: 5 },
    { section: "propertyManagement", slug: "propertyManagement-category-legal-guardian", value: JSON.stringify({ title: "Legal Guardian", description: "Stay compliant with property laws and regulations effortlessly.", icon: "Scale" }), order: 6 },
    { section: "propertyManagement", slug: "propertyManagement-cta-heading", value: JSON.stringify("Experience Effortless Property Management"), order: 7 },
    { section: "propertyManagement", slug: "propertyManagement-cta-body", value: JSON.stringify("Ready to experience hassle-free property management? Explore our Property Management Service categories and let us handle the complexities while you enjoy the benefits of property ownership."), order: 8 },
    { section: "propertyManagement", slug: "propertyManagement-cta-href", value: JSON.stringify("#services/property-management"), order: 9 },
    { section: "propertyManagement", slug: "propertyManagement-cta-text", value: JSON.stringify("Learn More"), order: 10 },

    { section: "investmentAdvisory", slug: "investmentAdvisory-heading", value: JSON.stringify("Smart Investments, Informed Decisions"), order: 1 },
    { section: "investmentAdvisory", slug: "investmentAdvisory-subheading", value: JSON.stringify("Building a real estate portfolio requires a strategic approach. Estatein's Investment Advisory Service empowers you to make smart investments and informed decisions."), order: 2 },
    { section: "investmentAdvisory", slug: "investmentAdvisory-category-market-insight", value: JSON.stringify({ title: "Market Insight", description: "Stay ahead of market trends with our expert Market Analysis. We provide in-depth insights into real estate market conditions.", icon: "BarChart3" }), order: 3 },
    { section: "investmentAdvisory", slug: "investmentAdvisory-category-roi-assessment", value: JSON.stringify({ title: "ROI Assessment", description: "Make investment decisions with confidence. Our ROI Assessment services evaluate the potential returns on your investments.", icon: "PieChart" }), order: 4 },
    { section: "investmentAdvisory", slug: "investmentAdvisory-category-customized-strategies", value: JSON.stringify({ title: "Customized Strategies", description: "Every investor is unique, and so are their goals. We develop Customized Investment Strategies tailored to your specific needs.", icon: "Target" }), order: 5 },
    { section: "investmentAdvisory", slug: "investmentAdvisory-category-diversification-mastery", value: JSON.stringify({ title: "Diversification Mastery", description: "Diversify your real estate portfolio effectively. Our experts guide you in spreading your investments across various property types and locations.", icon: "Globe" }), order: 6 },
    { section: "investmentAdvisory", slug: "investmentAdvisory-cta-heading", value: JSON.stringify("Unlock Your Investment Potential"), order: 7 },
    { section: "investmentAdvisory", slug: "investmentAdvisory-cta-body", value: JSON.stringify("Explore our Property Management Service categories and let us handle the complexities while you enjoy the benefits of property ownership."), order: 8 },
    { section: "investmentAdvisory", slug: "investmentAdvisory-cta-href", value: JSON.stringify("#services/investment-advisory"), order: 9 },
    { section: "investmentAdvisory", slug: "investmentAdvisory-cta-text", value: JSON.stringify("Learn More"), order: 10 },

    { section: "bottomCta", slug: "bottomCta-heading", value: JSON.stringify("Start Your Real Estate Journey Today"), order: 1 },
    { section: "bottomCta", slug: "bottomCta-body", value: JSON.stringify("Your dream property is just a click away. Whether you're looking for a new home, a strategic investment, or expert real estate advice, Estatein is here to assist you every step of the way. Take the first step towards your real estate goals and explore our available properties or get in touch with our team for personalized assistance."), order: 2 },
    { section: "bottomCta", slug: "bottomCta-href", value: JSON.stringify("/properties"), order: 3 },
    { section: "bottomCta", slug: "bottomCta-button-text", value: JSON.stringify("Explore Properties"), order: 4 },
  ];

  for (const s of servicesContent) {
    await prisma.servicesContent.create({ data: s });
  }

  const aboutPageContent = [
    { section: "journey", slug: "journey-heading", value: JSON.stringify("Our Journey"), order: 1 },
    { section: "journey", slug: "journey-body", value: JSON.stringify("Our story is one of continuous growth and evolution. We started as a small team with big dreams, determined to create a real estate platform that transcended the ordinary. Over the years, we've expanded our reach, forged valuable partnerships, and gained the trust of countless clients."), order: 2 },
    { section: "journey", slug: "journey-image-url", value: JSON.stringify("https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80\u0026w=1600\u0026auto=format\u0026fit=crop"), order: 3 },
    { section: "journey", slug: "journey-stat-happy-customers", value: JSON.stringify({ value: "200+", label: "Happy Customers", icon: "Home" }), order: 4 },
    { section: "journey", slug: "journey-stat-properties-for-clients", value: JSON.stringify({ value: "10k+", label: "Properties For Clients", icon: "Home" }), order: 5 },
    { section: "journey", slug: "journey-stat-years-of-experience", value: JSON.stringify({ value: "16+", label: "Years of Experience", icon: "Home" }), order: 6 },

    { section: "values", slug: "values-heading", value: JSON.stringify("Our Values"), order: 1 },
    { section: "values", slug: "values-body", value: JSON.stringify("Our story is one of continuous growth and evolution. We started as a small team with big dreams, determined to create a real estate platform that transcended the ordinary."), order: 2 },
    { section: "values", slug: "values-card-trust", value: JSON.stringify({ title: "Trust", description: "Trust is the cornerstone of every successful real estate transaction.", icon: "ShieldCheck" }), order: 3 },
    { section: "values", slug: "values-card-excellence", value: JSON.stringify({ title: "Excellence", description: "We set the bar high for ourselves. From the properties we list to the services we provide.", icon: "Award" }), order: 4 },
    { section: "values", slug: "values-card-client-centric", value: JSON.stringify({ title: "Client-Centric", description: "Your dreams and needs are at the center of our universe. We listen, understand.", icon: "HeartHandshake" }), order: 5 },
    { section: "values", slug: "values-card-our-commitment", value: JSON.stringify({ title: "Our Commitment", description: "We are dedicated to providing you with the highest level of service, professionalism and support.", icon: "BadgeCheck" }), order: 6 },

    { section: "achievements", slug: "achievements-heading", value: JSON.stringify("Our Achievements"), order: 1 },
    { section: "achievements", slug: "achievements-body", value: JSON.stringify("Our story is one of continuous growth and evolution. We started as a small team with big dreams, determined to create a real estate platform that transcended the ordinary."), order: 2 },
    { section: "achievements", slug: "achievements-card-3-plus-years", value: JSON.stringify({ title: "3+ Years of Excellence", description: "With over 3 years in the industry, we've amassed a wealth of knowledge and experience, becoming a go-to resource for all things real estate." }), order: 3 },
    { section: "achievements", slug: "achievements-card-happy-clients", value: JSON.stringify({ title: "Happy Clients", description: "Our greatest achievement is the satisfaction of our clients. Their success stories fuel our passion for what we do." }), order: 4 },
    { section: "achievements", slug: "achievements-card-industry-recognition", value: JSON.stringify({ title: "Industry Recognition", description: "We've earned the respect of our peers and industry leaders, with accolades and awards that reflect our commitment to excellence." }), order: 5 },
  ];

  for (const a of aboutPageContent) {
    await prisma.aboutPageContent.create({ data: a });
  }

  console.log(`Seed complete: ${properties.length} properties, ${reviews.length} reviews, ${settings.length} settings, ${navigationLinks.length} nav links, ${footerSections.length} footer sections, ${heroContent.length} hero content rows, ${servicesContent.length} services content rows, ${aboutPageContent.length} about page content rows`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
