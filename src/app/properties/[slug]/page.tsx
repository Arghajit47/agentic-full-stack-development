"use client";

import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import { PropertyGallery } from "@/components/properties/PropertyGallery";
import { PropertyDetails } from "@/components/properties/PropertyDetails";
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
          <p className="mt-4 text-3xl font-bold text-violet-500">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }).format(property.price)}
          </p>
        </div>

        {/* Gallery */}
        <PropertyGallery images={property.images} title={property.title} />

        {/* Property Details */}
        <div className="mt-12">
          <PropertyDetails property={property} />
        </div>

        {/* Long Description */}
        <div className="mt-12 rounded-lg border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">About This Property</h2>
          <p className="text-zinc-300 leading-relaxed">{property.longDescription}</p>
        </div>

        {/* Inquiry Form */}
        <div className="mt-12">
          <PropertyInquiryForm
            propertySlug={property.slug}
            propertyTitle={property.title}
          />
        </div>
      </div>
    </div>
  );
}
