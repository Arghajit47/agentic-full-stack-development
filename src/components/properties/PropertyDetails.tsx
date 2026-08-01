"use client";

import { Fragment } from "react";
import { Bed, Bath, Ruler, Square, Calendar, Car, Home, Tag, Zap, Phone, Mail } from "lucide-react";
import { type PropertyDetailedInfo } from "@/lib/schemas";

interface PropertyDetailsProps {
  property: PropertyDetailedInfo;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Bed, Bath, Ruler, Square, Calendar, Car, Home, Tag,
};

export function PropertyDetails({ property }: PropertyDetailsProps) {
  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
  };

  const allAmenityItems = property.amenities.flatMap((group) => group.items);

  const statFeatures = property.features
    .filter((f) => ["Bed", "Bath", "Ruler"].includes(f.icon))
    .slice(0, 3);

  return (
    <div data-testid="property-details">
      {/* Description + Key Features — Two-Column Layout */}
      <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-zinc-800 md:grid-cols-2">
        {/* Left Column — Description */}
        <div className="border-b border-zinc-800 p-6 sm:p-8 md:p-12 md:border-b-0 md:border-r">
          <h2 className="mb-4 text-2xl font-bold text-white">Description</h2>
          <p
            data-testid="property-short-description"
            className="leading-relaxed text-zinc-400"
          >
            {property.description}
          </p>

          {/* Stats Row */}
          {statFeatures.length > 0 && (
            <div className="mt-8 flex items-start">
              {statFeatures.map((feature, index) => (
                <Fragment key={feature.id}>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                      {getIcon(feature.icon)}
                      <span>{feature.name}</span>
                    </div>
                    <span
                      data-testid={`stat-${feature.icon.toLowerCase()}`}
                      className="text-lg font-semibold text-white"
                    >
                      {feature.value}
                    </span>
                  </div>
                  {index < statFeatures.length - 1 && (
                    <div className="mx-4 w-px self-stretch bg-zinc-700" />
                  )}
                </Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Right Column — Key Features and Amenities */}
        <div className="p-6 sm:p-8 md:p-12">
          <h2 className="mb-6 text-2xl font-bold text-white">
            Key Features and Amenities
          </h2>
          <ul data-testid="property-amenities" className="space-y-4">
            {allAmenityItems.map((item, index) => (
              <li
                key={index}
                data-testid={`amenity-item-${index}`}
                className="flex items-center gap-3 border-l-2 border-violet-600 py-1 pl-4"
              >
                <Zap className="h-4 w-4 shrink-0 text-violet-400" />
                <span className="text-sm text-zinc-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Agent Contact Section */}
      {property.agentName && (
        <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
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
                  className="transition-colors hover:text-violet-400"
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
                  className="transition-colors hover:text-violet-400"
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
