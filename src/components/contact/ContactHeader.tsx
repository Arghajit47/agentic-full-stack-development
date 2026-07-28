import { Mail, Phone, MapPin } from "lucide-react";
import { formatTelHref } from "@/lib/utils";

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

export interface ContactHeaderProps {
  contactInfo?: ContactInfo;
}

const DEFAULT_CONTACT_INFO: ContactInfo = {
  email: "info@estatein.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main Street, New York, NY 10001",
};

export function ContactHeader({ contactInfo = DEFAULT_CONTACT_INFO }: ContactHeaderProps) {
  return (
    <section
      data-testid="contact-header"
      className="w-full bg-[#141414] px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header Title */}
        <div className="mb-12 text-center">
          <h1
            data-testid="contact-header-title"
            className="text-3xl font-semibold text-white sm:text-4xl lg:text-[48px]"
          >
            Get in Touch
          </h1>
          <p
            data-testid="contact-header-description"
            className="mt-4 text-base text-[#999999] sm:text-lg lg:text-[18px]"
          >
            We&apos;re here to help and answer any question you might have. We look forward to hearing from you.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Email */}
          <div
            data-testid="contact-info-email"
            className="flex flex-col items-center rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-center"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-600/10">
              <Mail className="h-6 w-6 text-violet-600" aria-hidden="true" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">Email</h3>
            <a
              href={`mailto:${contactInfo.email}`}
              className="text-[#999999] transition-colors hover:text-violet-600"
            >
              {contactInfo.email}
            </a>
          </div>

          {/* Phone */}
          <div
            data-testid="contact-info-phone"
            className="flex flex-col items-center rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-center"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-600/10">
              <Phone className="h-6 w-6 text-violet-600" aria-hidden="true" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">Phone</h3>
            <a
              href={`tel:${formatTelHref(contactInfo.phone)}`}
              className="text-[#999999] transition-colors hover:text-violet-600"
            >
              {contactInfo.phone}
            </a>
          </div>

          {/* Address */}
          <div
            data-testid="contact-info-address"
            className="flex flex-col items-center rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-center"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-600/10">
              <MapPin className="h-6 w-6 text-violet-600" aria-hidden="true" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">Address</h3>
            <p className="text-[#999999]">{contactInfo.address}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
