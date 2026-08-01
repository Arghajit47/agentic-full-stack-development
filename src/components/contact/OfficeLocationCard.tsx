import { MapPin, Phone, Clock } from "lucide-react";
import { formatTelHref } from "@/lib/utils";

export interface OfficeLocation {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  hours: {
    weekdays: string;
    weekends: string;
  };
}

export interface OfficeLocationCardProps {
  office: OfficeLocation;
}

export function OfficeLocationCard({ office }: OfficeLocationCardProps) {
  const fullAddress = `${office.address}, ${office.city}, ${office.state} ${office.zipCode}`;

  return (
    <div
      data-testid={`office-card-${office.id}`}
      className="flex flex-col rounded-lg bg-zinc-900 p-6"
    >
      {/* Office Name */}
      <h3
        data-testid="office-name"
        className="mb-4 text-xl font-semibold text-white"
      >
        {office.name}
      </h3>

      {/* Address */}
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-violet-600/10">
          <MapPin className="h-5 w-5 text-violet-600" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-400">Address</p>
          <address
            data-testid="office-address"
            className="mt-1 text-base not-italic text-white"
          >
            {fullAddress}
          </address>
        </div>
      </div>

      {/* Phone */}
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-violet-600/10">
          <Phone className="h-5 w-5 text-violet-600" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-400">Phone</p>
          <a
            href={`tel:${formatTelHref(office.phone)}`}
            data-testid="office-phone"
            className="mt-1 block text-base text-white transition-colors hover:text-violet-600"
          >
            {office.phone}
          </a>
        </div>
      </div>

      {/* Hours */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-violet-600/10">
          <Clock className="h-5 w-5 text-violet-600" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-400">Office Hours</p>
          <div data-testid="office-hours" className="mt-1 space-y-1 text-base text-white">
            <p>
              <span className="text-zinc-400">Mon-Fri:</span> {office.hours.weekdays}
            </p>
            <p>
              <span className="text-zinc-400">Sat-Sun:</span> {office.hours.weekends}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Button */}
      <a
        href={`mailto:${encodeURIComponent(office.email)}?subject=${encodeURIComponent(`Inquiry about ${office.name}`)}`}
        data-testid="office-contact-button"
        className="mt-6 rounded-lg bg-violet-600 px-6 py-3 text-center text-base font-medium text-white transition-colors hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
      >
        Contact This Office
      </a>
    </div>
  );
}
