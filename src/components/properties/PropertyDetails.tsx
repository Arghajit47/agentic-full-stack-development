"use client";

import { 
  Bed, 
  Bath, 
  Ruler, 
  Square, 
  Calendar, 
  Car, 
  Home, 
  Tag,
  MapPin,
  Phone,
  Mail
} from "lucide-react";
import { type PropertyDetailedInfo } from "@/lib/schemas";

interface PropertyDetailsProps {
  property: PropertyDetailedInfo;
}

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Bed,
  Bath,
  Ruler,
  Square,
  Calendar,
  Car,
  Home,
  Tag,
};

export function PropertyDetails({ property }: PropertyDetailsProps) {
  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
  };

  return (
    <div data-testid="property-details" className="space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 
              data-testid="property-title"
              className="text-3xl font-bold text-white md:text-4xl"
            >
              {property.title}
            </h1>
            <div className="mt-2 flex items-center gap-2 text-zinc-400">
              <MapPin className="h-4 w-4 shrink-0" />
              <p data-testid="property-address" className="text-sm">
                {property.address}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm uppercase tracking-wider text-zinc-500">
              Price
            </p>
            <p 
              data-testid="property-price"
              className="mt-1 text-3xl font-bold text-white md:text-4xl"
            >
              {priceFormatter.format(property.price)}
            </p>
            <span 
              data-testid="property-status"
              className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                property.status === "For Sale"
                  ? "bg-green-900/30 text-green-400 border border-green-800"
                  : property.status === "For Rent"
                  ? "bg-blue-900/30 text-blue-400 border border-blue-800"
                  : property.status === "Sold"
                  ? "bg-zinc-800/50 text-zinc-400 border border-zinc-700"
                  : "bg-yellow-900/30 text-yellow-400 border border-yellow-800"
              }`}
            >
              {property.status}
            </span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div 
          data-testid="property-features-grid"
          className="grid grid-cols-2 gap-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 sm:grid-cols-3 md:grid-cols-4"
        >
          {property.features.map((feature) => (
            <div
              key={feature.id}
              data-testid={`property-feature-${feature.id}`}
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-600/10 text-violet-400">
                {getIcon(feature.icon)}
              </div>
              <div>
                <p className="text-xs text-zinc-500">{feature.name}</p>
                <p className="text-sm font-semibold text-white">{feature.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Description Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">About This Property</h2>
        <div className="space-y-3 text-zinc-300">
          <p data-testid="property-short-description" className="leading-relaxed">
            {property.description}
          </p>
          <p data-testid="property-long-description" className="leading-relaxed">
            {property.longDescription}
          </p>
        </div>
      </div>

      {/* Amenities Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Amenities & Features</h2>
        <div 
          data-testid="property-amenities"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {property.amenities.map((amenityGroup) => (
            <div
              key={amenityGroup.id}
              data-testid={`amenity-group-${amenityGroup.id}`}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6"
            >
              <h3 className="mb-4 text-lg font-semibold text-white">
                {amenityGroup.category}
              </h3>
              <ul className="space-y-2">
                {amenityGroup.items.map((item, index) => (
                  <li
                    key={index}
                    data-testid={`amenity-item-${amenityGroup.id}-${index}`}
                    className="flex items-start gap-2 text-sm text-zinc-300"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Contact Section */}
      {property.agentName && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 className="mb-4 text-2xl font-bold text-white">Contact Agent</h2>
          <div data-testid="agent-contact" className="space-y-3">
            <div>
              <p className="text-sm text-zinc-500">Listing Agent</p>
              <p data-testid="agent-name" className="text-lg font-semibold text-white">
                {property.agentName}
              </p>
            </div>
            
            {property.agentPhone && (
              <div className="flex items-center gap-2 text-zinc-300">
                <Phone className="h-4 w-4 shrink-0 text-zinc-500" />
                <a
                  href={`tel:${property.agentPhone}`}
                  data-testid="agent-phone"
                  className="hover:text-violet-400 transition-colors"
                >
                  {property.agentPhone}
                </a>
              </div>
            )}
            
            {property.agentEmail && (
              <div className="flex items-center gap-2 text-zinc-300">
                <Mail className="h-4 w-4 shrink-0 text-zinc-500" />
                <a
                  href={`mailto:${property.agentEmail}`}
                  data-testid="agent-email"
                  className="hover:text-violet-400 transition-colors"
                >
                  {property.agentEmail}
                </a>
              </div>
            )}

            <button
              type="button"
              data-testid="contact-agent-button"
              className="mt-4 w-full rounded-lg bg-violet-600 px-6 py-3 font-medium text-white transition-colors hover:bg-violet-500"
            >
              Schedule a Viewing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
