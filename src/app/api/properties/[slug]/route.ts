import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parseJsonArray } from "@/lib/json-helpers";
import {
  propertyDetailedInfoSchema,
  propertyDetailApiResponseSchema,
  type PropertyDetailedInfo,
} from "@/lib/schemas";

// ─── Helpers ────────────────────────────────────────────────────────────────

const PROPERTY_ICONS: Record<string, string> = {
  bedrooms: "Bed",
  bathrooms: "Bath",
  area: "Ruler",
  lotSize: "Square",
  yearBuilt: "Calendar",
  parking: "Car",
  propertyType: "Home",
  status: "Tag",
};

const AGENTS = [
  { name: "Sarah Johnson", phone: "+1 (310) 555-0123", email: "sarah.johnson@realestate.com" },
  { name: "Michael Chen", phone: "+1 (203) 555-0456", email: "michael.chen@realestate.com" },
  { name: "Emily Parker", phone: "+1 (828) 555-0789", email: "emily.parker@realestate.com" },
];

function pickAgent(id: number) {
  return AGENTS[(id - 1) % AGENTS.length];
}

function toTitleCase(str: string) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

function derivePropertyType(raw: string): PropertyDetailedInfo["propertyType"] {
  // ponytail: DB has wider enum than UI schema; collapse non-UI types to closest match
  const normalized = toTitleCase(raw.trim());
  const allowed = new Set([<const>"Villa", "Mansion", "Cottage", "Estate", "House"]);
  if (allowed.has(normalized as PropertyDetailedInfo["propertyType"])) {
    return normalized as PropertyDetailedInfo["propertyType"];
  }
  if (normalized === "Penthouse" || normalized === "Tower" || normalized === "Duplex" || normalized === "Suite") {
    return "House";
  }
  if (normalized === "Condo" || normalized === "Apartment" || normalized === "Townhouse" || normalized === "Bungalow") {
    return "House";
  }
  if (normalized === "Cabin" || normalized === "Studio" || normalized === "Farmhouse") {
    return "Cottage";
  }
  return "House";
}

function buildImages(id: number, galleryUrls: string[], title: string): PropertyDetailedInfo["images"] {
  return galleryUrls.length > 0
    ? galleryUrls.map((url, index) => ({
        id: index + 1,
        url,
        alt: `${title} - Image ${index + 1}`,
        caption: index === 0 ? title : undefined,
      }))
    : [
        {
          id: 1,
          url: `/images/properties/property-${(id % 6) + 1}.jpg`,
          alt: `${title} - Main Image`,
          caption: title,
        },
      ];
}

function buildFeatures(property: {
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  propertyType: string;
  id: number;
  rawFeatures: string[];
}): PropertyDetailedInfo["features"] {
  const { bedrooms, bathrooms, areaSqft, propertyType, rawFeatures } = property;
  const base: PropertyDetailedInfo["features"] = [
    { id: 1, name: "Bedrooms", icon: PROPERTY_ICONS.bedrooms, value: String(bedrooms) },
    { id: 2, name: "Bathrooms", icon: PROPERTY_ICONS.bathrooms, value: String(bathrooms) },
    { id: 3, name: "Area", icon: PROPERTY_ICONS.area, value: `${areaSqft.toLocaleString()} sq ft` },
    { id: 4, name: "Property Type", icon: PROPERTY_ICONS.propertyType, value: propertyType },
    { id: 5, name: "Status", icon: PROPERTY_ICONS.status, value: "For Sale" },
  ];

  let nextId = base.length + 1;
  for (const feature of rawFeatures) {
    const name = toTitleCase(feature);
    const key = feature.toLowerCase().replace(/\s+/g, "");
    const icon = PROPERTY_ICONS[key] ?? "Home";
    base.push({ id: nextId++, name, icon, value: "Yes" });
  }
  return base;
}

function buildAmenities(rawFeatures: string[]): PropertyDetailedInfo["amenities"] {
  // ponytail: group DB features into generic amenity buckets
  const interior = rawFeatures.filter((f) =>
    ["smart home", "hardwood floors", "high ceilings", "fireplace", "gourmet kitchen", "chef's kitchen", "wine cellar", "library", "elevator", "home theater"].some((k) =>
      f.toLowerCase().includes(k),
    ),
  );
  const exterior = rawFeatures.filter((f) =>
    ["pool", "garden", "patio", "deck", "yard", "garage", "beach", "view", "dock", "courtyard", "front porch", "barn", "acreage", "porch swing"].some((k) =>
      f.toLowerCase().includes(k),
    ),
  );
  const additional = rawFeatures.filter((f) => !interior.includes(f) && !exterior.includes(f));

  const groups: PropertyDetailedInfo["amenities"] = [];
  let id = 1;
  if (interior.length > 0) groups.push({ id: id++, category: "Interior", items: interior.map(toTitleCase) });
  if (exterior.length > 0) groups.push({ id: id++, category: "Exterior", items: exterior.map(toTitleCase) });
  if (additional.length > 0) groups.push({ id: id++, category: "Additional", items: additional.map(toTitleCase) });

  if (groups.length === 0) {
    groups.push({ id: 1, category: "Features", items: ["Contact agent for details."] });
  }
  return groups;
}

export function transformPropertyToDetailed(property: {
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
  galleryUrls: string;
  features: string;
}): PropertyDetailedInfo {
  const rawFeatures = parseJsonArray(property.features);
  const rawGallery = parseJsonArray(property.galleryUrls);
  const propertyType = derivePropertyType(property.propertyType);
  const agent = pickAgent(property.id);

  return {
    id: property.id,
    slug: property.slug,
    title: property.title,
    description: property.description,
    longDescription: `${property.title} is a stunning ${propertyType.toLowerCase()} located in ${property.location}. ${property.description} This exceptional home offers the perfect blend of style, comfort, and convenience for modern living.`,
    price: property.price,
    location: property.location,
    address: `${property.title}, ${property.location}`,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    propertyType,
    area: `${property.areaSqft.toLocaleString()} sq ft`,
    lotSize: `${(property.areaSqft * 1.5).toLocaleString()} sq ft`,
    yearBuilt: 2010 + (property.id % 15),
    status: "For Sale",
    images: buildImages(property.id, rawGallery, property.title),
    features: buildFeatures({
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      areaSqft: property.areaSqft,
      propertyType,
      id: property.id,
      rawFeatures,
    }),
    amenities: buildAmenities(rawFeatures),
    agentName: agent.name,
    agentPhone: agent.phone,
    agentEmail: agent.email,
  };
}

// ─── GET /api/properties/[slug] ───────────────────────────────────────────────
// Fetch a single property by slug with full details including gallery images
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { success: false, data: null, error: "Invalid slug parameter" },
        { status: 400 }
      );
    }

    const property = await prisma.property.findUnique({
      where: { slug },
    });

    if (!property) {
      return NextResponse.json(
        { success: false, data: null, error: "Property not found" },
        { status: 404 }
      );
    }

    const transformed = transformPropertyToDetailed(property);
    const parsed = propertyDetailedInfoSchema.safeParse(transformed);
    if (!parsed.success) {
      console.error("[GET /api/properties/[slug]] schema validation failed:", parsed.error);
      return NextResponse.json(
        { success: false, data: null, error: "Invalid property data" },
        { status: 500 }
      );
    }

    const response = { success: true, data: parsed.data };
    propertyDetailApiResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("[GET /api/properties/[slug]] Unhandled error:", error);
    return NextResponse.json(
      { success: false, data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
