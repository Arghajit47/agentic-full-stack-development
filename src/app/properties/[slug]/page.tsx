"use client";

import { useParams, notFound } from "next/navigation";
import { PropertyGallery } from "@/components/properties/PropertyGallery";
import { PropertyDetails } from "@/components/properties/PropertyDetails";
import { PricingBreakdown } from "@/components/properties/PricingBreakdown";
import { PropertyInquiryForm } from "@/components/properties/PropertyInquiryForm";
import { propertyDetailsData } from "@/mocks/property-details";

export default function PropertyDetailsPage() {
  const params = useParams();
  const slug = params?.slug as string;

  // Find property by slug
  const property = propertyDetailsData.find((p) => p.slug === slug);

  if (!property) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Property Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">{property.title}</h1>
          <p className="mt-2 text-lg text-zinc-400">{property.location}</p>
        </div>

        {/* Gallery */}
        <PropertyGallery images={property.gallery} title={property.title} />

        {/* Property Details */}
        <div className="mt-12">
          <PropertyDetails property={property} />
        </div>

        {/* Pricing Breakdown */}
        <div className="mt-12">
          <PricingBreakdown
            propertyTitle={property.title}
            pricing={property.pricing}
          />
        </div>

        {/* Inquiry Form */}
        <div className="mt-12">
          <PropertyInquiryForm
            propertyTitle={property.title}
            propertyLocation={property.location}
          />
        </div>
      </div>
    </div>
  );
}
