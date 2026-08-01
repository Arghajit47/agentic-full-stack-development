"use client";

import { OfficeLocationCard, type OfficeLocation } from "./OfficeLocationCard";

export interface OfficeLocationsProps {
  offices?: OfficeLocation[];
}

const DEFAULT_OFFICES: OfficeLocation[] = [
  {
    id: 1,
    name: "New York Headquarters",
    address: "123 Fifth Avenue",
    city: "New York",
    state: "NY",
    zipCode: "10003",
    phone: "+1 (212) 555-0100",
    email: "newyork@estatein.com",
    hours: {
      weekdays: "9:00 AM - 6:00 PM",
      weekends: "10:00 AM - 4:00 PM",
    },
  },
  {
    id: 2,
    name: "Los Angeles Office",
    address: "456 Sunset Boulevard",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90028",
    phone: "+1 (323) 555-0200",
    email: "losangeles@estatein.com",
    hours: {
      weekdays: "8:30 AM - 5:30 PM",
      weekends: "Closed",
    },
  },
  {
    id: 3,
    name: "Chicago Branch",
    address: "789 Michigan Avenue",
    city: "Chicago",
    state: "IL",
    zipCode: "60611",
    phone: "+1 (312) 555-0300",
    email: "chicago@estatein.com",
    hours: {
      weekdays: "9:00 AM - 6:00 PM",
      weekends: "10:00 AM - 3:00 PM",
    },
  },
  {
    id: 4,
    name: "Miami Office",
    address: "321 Ocean Drive",
    city: "Miami",
    state: "FL",
    zipCode: "33139",
    phone: "+1 (305) 555-0400",
    email: "miami@estatein.com",
    hours: {
      weekdays: "9:00 AM - 5:00 PM",
      weekends: "Closed",
    },
  },
];

export function OfficeLocations({ offices = DEFAULT_OFFICES }: OfficeLocationsProps) {
  return (
    <section
      data-testid="office-locations"
      className="w-full bg-[#141414] px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12">
          <h2
            data-testid="office-locations-title"
            className="text-3xl font-semibold text-white sm:text-4xl lg:text-[40px]"
          >
            Our Offices
          </h2>
          <p
            data-testid="office-locations-description"
            className="mt-4 text-base text-[#999999] sm:text-lg"
          >
            Visit us at any of our locations. Our experienced team is ready to assist you with all your real estate needs.
          </p>
        </div>

        {/* Office Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {offices.map((office) => (
            <OfficeLocationCard key={office.id} office={office} />
          ))}
        </div>

        {/* Empty State */}
        {offices.length === 0 && (
          <div
            data-testid="office-locations-empty"
            className="flex h-64 items-center justify-center rounded-lg bg-zinc-900"
          >
            <p className="text-lg text-zinc-400">No office locations available</p>
          </div>
        )}
      </div>
    </section>
  );
}
