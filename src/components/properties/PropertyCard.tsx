"use client";

import { Bed, Bath, Ruler, MapPin } from "lucide-react";
import { type Property } from "@/mocks/properties-listings";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

interface PropertyCardProps {
  property: Property;
  onPropertyClick?: (slug: string) => void;
}

export function PropertyCard({ property, onPropertyClick = (slug) => console.log(slug) }: PropertyCardProps) {
  return (
    <article
      data-testid="property-card"
      className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/60"
    >
      <div className="overflow-hidden rounded-lg">
        <img
          src={property.imageUrl}
          alt={property.title}
          className="aspect-[4/3] w-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </div>
      
      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
          <span>{property.location}</span>
        </div>

        <h3
          data-testid={`property-title-${property.id}`}
          className="mt-2 text-left text-lg font-semibold text-white"
        >
          {property.title}
        </h3>
        
        <p
          data-testid={`property-description-${property.id}`}
          className="mt-1 line-clamp-2 text-left text-sm text-zinc-400"
        >
          {property.description}
        </p>

        <div
          className="mt-4 grid grid-cols-3 gap-2 border-t border-zinc-800/80 pt-4 text-xs font-medium text-zinc-400"
          data-testid={`property-specs-${property.id}`}
        >
          <span className="flex items-center gap-1">
            <Bed className="h-4 w-4 shrink-0 text-zinc-500" />
            {property.bedrooms} Bed
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-4 w-4 shrink-0 text-zinc-500" />
            {property.bathrooms} Bath
          </span>
          <span className="flex items-center gap-1">
            <Ruler className="h-4 w-4 shrink-0 text-zinc-500" />
            {property.area}
          </span>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-zinc-800/80 pt-4" data-testid={`property-price-${property.id}`}>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500" data-testid={`price-label-${property.id}`}>
              Price
            </p>
            <p className="text-lg font-bold text-white">
              {priceFormatter.format(property.price)}
            </p>
          </div>
          
          <button
            type="button"
            data-testid={`view-details-${property.id}`}
            onClick={() => onPropertyClick(property.slug)}
            className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors duration-150"
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}
