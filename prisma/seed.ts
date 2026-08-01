import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PROPERTY_TITLES = [
  "Seawide Serenity Villa",
  "Metropolitan House",
  "Rustic Retreat Cottage",
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

const REVIEW_TITLES = [
  "Exceptional Service!",
  "Efficient and Reliable",
  "Trusted Advisors",
  "Made Buying Easy",
  "Highly Recommend",
  "Outstanding Support",
  "Smooth Closing",
  "Perfect Rental Help",
  "Great First-Time Buyer Experience",
  "Virtual Tours Saved Time",
];

const REVIEW_LOCATIONS = [
  "USA, California",
  "USA, Florida",
  "USA, Nevada",
  "USA, Texas",
  "USA, New York",
  "USA, Massachusetts",
  "USA, Washington",
  "USA, Illinois",
  "USA, Colorado",
  "USA, Oregon",
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

const FIGMA_REVIEWS = [
  {
    clientName: "Wade Warren",
    clientLocation: "USA, California",
    clientAvatarUrl: "/images/reviewers/wade-warren.jpg",
    rating: 5,
    reviewTitle: "Exceptional Service!",
    reviewText: "Our experience with Estatein was outstanding. Their team's dedication and professionalism made finding our dream home a breeze. Highly recommended!",
  },
  {
    clientName: "Emelie Thomson",
    clientLocation: "USA, Florida",
    clientAvatarUrl: "/images/reviewers/emelie-thomson.jpg",
    rating: 5,
    reviewTitle: "Efficient and Reliable",
    reviewText: "Estatein provided us with top-notch service. They helped us sell our property quickly and at a great price. We couldn't be happier with the results.",
  },
  {
    clientName: "John Mans",
    clientLocation: "USA, Nevada",
    clientAvatarUrl: "/images/reviewers/john-mans.jpg",
    rating: 5,
    reviewTitle: "Trusted Advisors",
    reviewText: "The Estatein team guided us through the entire buying process. Their knowledge and commitment to our needs were impressive. Thank you for your support!",
  },
  {
    clientName: "Emily Raynald",
    clientLocation: "France, Rennes",
    clientAvatarUrl: "/images/reviewers/emily-raynald.jpg",
    rating: 5,
    reviewTitle: "Exceptional Service!",
    reviewText: "Estatein made buying our first home a breeze. The team was professional, attentive, and guided us every step of the way. Highly recommend!",
  },
  {
    clientName: "Maksym Voznichka",
    clientLocation: "Ukraine, Odessa",
    clientAvatarUrl: "/images/reviewers/maksym-voznichka.jpg",
    rating: 5,
    reviewTitle: "Trusted Advisors",
    reviewText: "Exceptional service from Estatein! They found us the perfect property within our budget and handled all the details seamlessly. Truly a stress-free experience.",
  },
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
  await prisma.office.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.propertyPricing.deleteMany();

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

  const properties = PROPERTY_TITLES.map((title, i) => {
    // For the first 6 properties, create a gallery with multiple images
    // For others, just use a single image
    const mainImageIndex = (i % 6) + 1;
    const galleryUrls = i < 6
      ? [
          `/images/properties/property-${mainImageIndex}.jpg`,
          `/images/properties/property-${((mainImageIndex) % 6) + 1}.jpg`,
          `/images/properties/property-${((mainImageIndex + 1) % 6) + 1}.jpg`,
          `/images/properties/property-${((mainImageIndex + 2) % 6) + 1}.jpg`,
        ]
      : [`/images/properties/property-${mainImageIndex}.jpg`];

    return {
      slug: slugify(title),
      title,
      description: `${title} — ${FEATURES[i].join(", ")}. A beautiful home waiting for the right buyer.`,
      price: i === 0 ? 1250000 : i === 1 ? 600000 : i === 2 ? 350000 : 250000 + i * 75000 + (i % 3) * 25000,
      location: LOCATIONS[i],
      bedrooms: 1 + (i % 6),
      bathrooms: 1 + (i % 4),
      areaSqft: 800 + i * 250,
      propertyType: PROPERTY_TYPES[i],
      imageUrl: `/images/properties/property-${mainImageIndex}.jpg`,
      isFeatured: true,
      galleryUrls: JSON.stringify(galleryUrls),
      features: JSON.stringify(FEATURES[i]),
    };
  });

  for (const p of properties) {
    await prisma.property.create({ data: p });
  }

  const propertyTitles = properties.map((p) => p.title);
  const reviews = REVIEW_NAMES.map((clientName, i) => {
    const propertyTitle = i % 4 === 0 ? null : propertyTitles[i % propertyTitles.length];
    if (i < FIGMA_REVIEWS.length) {
      return { ...FIGMA_REVIEWS[i], propertyTitle };
    }
    return {
      clientName,
      clientLocation: REVIEW_LOCATIONS[i % REVIEW_LOCATIONS.length],
      clientAvatarUrl: avatarUrl(clientName),
      rating: (i % 5) + 1,
      reviewTitle: REVIEW_TITLES[i % REVIEW_TITLES.length],
      reviewText: REVIEW_TEXTS[i % REVIEW_TEXTS.length],
      propertyTitle,
    };
  });

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
    { key: "properties_subheading", value: "Explore our handpicked selection of featured properties. Each listing offers a glimpse into exceptional homes and investments available through Estatein. Click View Details for more information." },
    { key: "reviews_heading", value: "What Our Clients Say" },
    { key: "reviews_subheading", value: "Real stories from happy homeowners" },
    { key: "footer_about", value: "EstateHub is a premier real estate platform connecting buyers with their dream homes." },
    { key: "footer_contact_email", value: "hello@estatehub.com" },
    { key: "footer_contact_phone", value: "+1 (555) 123-4567" },
    { key: "footer_address", value: "123 Real Estate Ave, New York, NY 10001" },
    { key: "featured_count", value: "20" },
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
    { section: "journey", slug: "journey-image-url", value: JSON.stringify("/images/about-hero.png"), order: 3 },
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

    { section: "howItWorks", slug: "howItWorks-heading", value: JSON.stringify("Navigating the Estatein Experience"), order: 1 },
    { section: "howItWorks", slug: "howItWorks-body", value: JSON.stringify("At Estatein, we've designed a straightforward process to help you find and purchase your dream property with ease. Here's a step-by-step guide to how it all works."), order: 2 },
    { section: "howItWorks", slug: "howItWorks-step-01", value: JSON.stringify({ stepNumber: "Step 01", title: "Discover a World of Possibilities", description: "Your journey begins with exploring our carefully curated property listings. Use our intuitive search tools to filter properties based on your preferences, including location, type, size, and budget." }), order: 3 },
    { section: "howItWorks", slug: "howItWorks-step-02", value: JSON.stringify({ stepNumber: "Step 02", title: "Narrowing Down Your Choices", description: "Once you've found properties that catch your eye, save them to your account or make a shortlist. This allows you to compare and revisit your favorites as you make your decision." }), order: 4 },
    { section: "howItWorks", slug: "howItWorks-step-03", value: JSON.stringify({ stepNumber: "Step 03", title: "Personalized Guidance", description: "Have questions about a property or need more information? Our dedicated team of real estate experts is just a call or message away." }), order: 5 },
    { section: "howItWorks", slug: "howItWorks-step-04", value: JSON.stringify({ stepNumber: "Step 04", title: "See It for Yourself", description: "Arrange viewings of the properties you're interested in. We'll coordinate with the property owners and accompany you to ensure you get a firsthand look at your potential new home." }), order: 6 },
    { section: "howItWorks", slug: "howItWorks-step-05", value: JSON.stringify({ stepNumber: "Step 05", title: "Making Informed Decisions", description: "Before making an offer, our team will assist you with due diligence, including property inspections, legal checks, and market analysis. We want you to be fully informed and confident in your choice." }), order: 7 },
    { section: "howItWorks", slug: "howItWorks-step-06", value: JSON.stringify({ stepNumber: "Step 06", title: "Getting the Best Deal", description: "We'll help you negotiate the best terms and prepare your offer. Our goal is to secure the property at the right price and on favorable terms." }), order: 8 },

    { section: "team", slug: "team-heading", value: JSON.stringify("Meet the Estatein Team"), order: 1 },
    { section: "team", slug: "team-body", value: JSON.stringify("At Estatein, our success is driven by the dedication and expertise of our team. Get to know the people behind our mission to make your real estate dreams a reality."), order: 2 },
    { section: "team", slug: "team-member-max-mitchell", value: JSON.stringify({ name: "Max Mitchell", role: "Founder", imageUrl: "/images/team/team-max.jpg", twitterUrl: "https://twitter.com/estatein" }), order: 3 },
    { section: "team", slug: "team-member-sarah-johnson", value: JSON.stringify({ name: "Sarah Johnson", role: "Chief Real Estate Officer", imageUrl: "/images/team/team-sarah.jpg", twitterUrl: "https://twitter.com/estatein" }), order: 4 },
    { section: "team", slug: "team-member-david-brown", value: JSON.stringify({ name: "David Brown", role: "Head of Property Management", imageUrl: "/images/team/team-david.jpg", twitterUrl: "https://twitter.com/estatein" }), order: 5 },
    { section: "team", slug: "team-member-michael-turner", value: JSON.stringify({ name: "Michael Turner", role: "Legal Counsel", imageUrl: "/images/team/team-michael.jpg", twitterUrl: "https://twitter.com/estatein" }), order: 6 },

    // Clients section
    { section: "clients", slug: "clients-heading", value: JSON.stringify("Our Valued Clients"), order: 1 },
    { section: "clients", slug: "clients-subheading", value: JSON.stringify("At Estatein, we have had the privilege of working with a diverse range of clients across various industries. Here are some of the clients we've had the pleasure of serving"), order: 2 },
    { section: "clients", slug: "clients-testimonial-abc", value: JSON.stringify({ since: "Since 2019", company: "ABC Corporation", domain: "Commercial Real Estate", category: "Luxury Home Development", quote: "Estatein's expertise in finding the perfect office space for our growing team was outstanding. They understood our needs and delivered beyond expectations.", websiteUrl: "https://example.com" }), order: 3 },
    { section: "clients", slug: "clients-testimonial-greentech", value: JSON.stringify({ since: "Since 2018", company: "GreenTech Enterprises", domain: "Commercial Real Estate", category: "Retail Space", quote: "Estatein's ability to identify prime retail locations helped us expand our brand presence. Their attention to detail and market insights were invaluable.", websiteUrl: "https://example.com" }), order: 4 },
  ];

  for (const a of aboutPageContent) {
    await prisma.aboutPageContent.create({ data: a });
  }

  // ─── Contact Submissions (KAN-30) ─────────────────────────────────────────────
  const contactSubmissions = [
    {
      propertySlug: properties[0].slug,
      name: "John Anderson",
      email: "john.anderson@example.com",
      phone: "+1-555-0101",
      message: "I'm interested in scheduling a viewing for this beautiful villa. Could you provide more details about the neighborhood and nearby amenities?",
      ipHash: "demo-hash-1",
    },
    {
      propertySlug: properties[1].slug,
      name: "Maria Garcia",
      email: "maria.garcia@example.com",
      phone: "+1-555-0202",
      message: "This penthouse looks amazing! I'd like to know more about the HOA fees, parking options, and building amenities.",
      ipHash: "demo-hash-2",
    },
    {
      propertySlug: properties[2].slug,
      name: "David Chen",
      email: "david.chen@example.com",
      phone: "+1-555-0303",
      message: "Very interested in this beachfront property. Can we arrange a virtual tour this week? Also, what's the flood insurance situation?",
      ipHash: "demo-hash-3",
    },
    {
      propertySlug: null,
      name: "Lisa Thompson",
      email: "lisa.thompson@example.com",
      phone: "+1-555-0404",
      message: "I'm looking for a family home in the Austin area with at least 4 bedrooms and a good school district. Can you help me find suitable properties?",
      ipHash: "demo-hash-4",
    },
    {
      propertySlug: properties[4].slug,
      name: "Robert Williams",
      email: "robert.williams@example.com",
      phone: "+1-555-0505",
      message: "Interested in this luxury condo as an investment property. What's the rental market like in this area? Can you provide income projections?",
      ipHash: "demo-hash-5",
    },
    {
      propertySlug: null,
      name: "Emily Johnson",
      email: "emily.johnson@example.com",
      phone: "+1-555-0606",
      message: "First-time buyer here! I need guidance on the home buying process, mortgage options, and what to look for in a starter home.",
      ipHash: "demo-hash-6",
    },
    {
      propertySlug: properties[8].slug,
      name: "Michael Brown",
      email: "michael.brown@example.com",
      phone: "+1-555-0707",
      message: "Lake house looks perfect for our family! Questions: Is there a dock? What's the lake access policy? Any restrictions on boats?",
      ipHash: "demo-hash-7",
    },
    {
      propertySlug: properties[10].slug,
      name: "Sarah Martinez",
      email: "sarah.martinez@example.com",
      phone: "+1-555-0808",
      message: "I love the riverside location! Could you send me comparable sales in the area? Also interested in property tax information.",
      ipHash: "demo-hash-8",
    },
  ];

  for (const submission of contactSubmissions) {
    await prisma.contactSubmission.create({ data: submission });
  }

  // ─── Offices (KAN-45) ─────────────────────────────────────────────────────────
  const offices = [
    {
      title: "Main Office",
      address: "123 Real Estate Avenue, New York, NY 10001",
      email: "info@estatein.com",
      phone: "+1 (212) 555-1234",
      order: 1,
    },
    {
      title: "Branch Office",
      address: "456 Property Street, Los Angeles, CA 90001",
      email: "la@estatein.com",
      phone: "+1 (323) 555-5678",
      order: 2,
    },
  ];

  for (const office of offices) {
    await prisma.office.create({ data: office });
  }

  // ─── Gallery Images (KAN-45) ──────────────────────────────────────────────────
  const galleryImages = [
    { imageUrl: "/images/properties/property-1.jpg", caption: "Luxury Villa Exterior", order: 1 },
    { imageUrl: "/images/properties/property-2.jpg", caption: "Modern Living Room", order: 2 },
    { imageUrl: "/images/properties/property-3.jpg", caption: "Spacious Kitchen", order: 3 },
    { imageUrl: "/images/properties/property-4.jpg", caption: "Master Bedroom Suite", order: 4 },
    { imageUrl: "/images/properties/property-5.jpg", caption: "Outdoor Entertainment Area", order: 5 },
    { imageUrl: "/images/properties/property-6.jpg", caption: "Swimming Pool & Garden", order: 6 },
  ];

  for (const image of galleryImages) {
    await prisma.galleryImage.create({ data: image });
  }

  // ─── Property Pricing (KAN-114) ──────────────────────────────────────────────
  for (const property of properties) {
    await prisma.propertyPricing.upsert({
      where: { propertySlug: property.slug },
      update: {},
      create: {
        propertySlug: property.slug,
        propertyTransferTax: 25000,
        legalFees: 3000,
        homeInspection: 500,
        propertyInsurance: 1200,
        mortgageFees: 'Varies',
        propertyTaxesMonthly: 1250,
        hoaFeeMonthly: 300,
        downPayment: 250000,
        downPaymentPct: 20,
        mortgageAmount: 1000000,
      },
    });
  }

  // ─── General Inquiries (KAN-42) ───────────────────────────────────────────────
  const generalInquiries = [
    {
      inquiryType: "general",
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      phone: "+1-555-1111",
      message: "I'd like to learn more about your real estate services. Do you offer virtual tours for out-of-state buyers?",
      ipHash: "demo-hash-gen-1",
    },
    {
      inquiryType: "support",
      name: "Bob Williams",
      email: "bob.williams@example.com",
      phone: "+1-555-2222",
      message: "I'm having trouble accessing my account dashboard. Can someone from support help me reset my password?",
      ipHash: "demo-hash-gen-2",
    },
    {
      inquiryType: "partnership",
      name: "Carol Davis",
      email: "carol.davis@realtycorp.com",
      phone: "+1-555-3333",
      message: "Our company is interested in partnering with Estatein for commercial property listings. Please contact me to discuss opportunities.",
      ipHash: "demo-hash-gen-3",
    },
    {
      inquiryType: "careers",
      name: "David Brown",
      email: "david.brown@jobmail.com",
      phone: "+1-555-4444",
      message: "I'm a licensed real estate agent with 5 years of experience. Are there any openings for sales agents in your New York office?",
      ipHash: "demo-hash-gen-4",
    },
    {
      inquiryType: "general",
      name: "Emma Wilson",
      email: "emma.wilson@example.com",
      phone: "+1-555-5555",
      message: "What are your commission rates for selling a property? I have a 4-bedroom home in Austin that I'd like to list.",
      ipHash: "demo-hash-gen-5",
    },
    {
      inquiryType: "support",
      name: "Frank Miller",
      email: "frank.miller@example.com",
      phone: "+1-555-6666",
      message: "The property search filter isn't working correctly on mobile. It's not showing results when I select 'waterfront' properties.",
      ipHash: "demo-hash-gen-6",
    },
    {
      inquiryType: "partnership",
      name: "Grace Lee",
      email: "grace.lee@mortgagepro.com",
      phone: "+1-555-7777",
      message: "We're a mortgage company looking to establish a referral partnership. We can offer competitive rates for your clients.",
      ipHash: "demo-hash-gen-7",
    },
    {
      inquiryType: "careers",
      name: "Henry Taylor",
      email: "henry.taylor@careermail.com",
      phone: "+1-555-8888",
      message: "I'm a property photographer and videographer. Do you have freelance opportunities for listing photography?",
      ipHash: "demo-hash-gen-8",
    },
    {
      inquiryType: "general",
      name: "Iris Martinez",
      email: "iris.martinez@example.com",
      phone: "+1-555-9999",
      message: "Do you provide property management services? I own several rental properties and need professional management.",
      ipHash: "demo-hash-gen-9",
    },
    {
      inquiryType: "support",
      name: "Jack Anderson",
      email: "jack.anderson@example.com",
      phone: "+1-555-0000",
      message: "I submitted a contact form 3 days ago but haven't received a response. My inquiry ID is #12345. Can you follow up?",
      ipHash: "demo-hash-gen-10",
    },
  ];

  for (const inquiry of generalInquiries) {
    await prisma.generalInquiry.create({ data: inquiry });
  }

  console.log(`Seed complete: ${properties.length} properties, ${reviews.length} reviews, ${settings.length} settings, ${navigationLinks.length} nav links, ${footerSections.length} footer sections, ${heroContent.length} hero content rows, ${servicesContent.length} services content rows, ${aboutPageContent.length} about page content rows, ${contactSubmissions.length} contact submissions, ${offices.length} offices, ${galleryImages.length} gallery images, ${properties.length} property pricing records, ${generalInquiries.length} general inquiries`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
