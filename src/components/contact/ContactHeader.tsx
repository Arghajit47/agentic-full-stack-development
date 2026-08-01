"use client";

import { Mail, Phone, MapPin, Share2, ArrowUpRight } from "lucide-react";
import { type ContactInfo } from "@/types/contact";

// Backwards-compatible type re-export for existing consumers/tests.
export type { ContactInfo };

const DEFAULT_CARDS = [
  {
    id: "email",
    icon: Mail,
    label: "info@estatein.com",
    href: "mailto:info@estatein.com",
    ariaLabel: "Email us at info@estatein.com",
  },
  {
    id: "phone",
    icon: Phone,
    label: "+1 (123) 456-7890",
    href: "tel:+11234567890",
    ariaLabel: "Call us at +1 (123) 456-7890",
  },
  {
    id: "hq",
    icon: MapPin,
    label: "Main Headquarters",
    href: undefined,
    ariaLabel: "Main Headquarters",
  },
  {
    id: "social",
    icon: Share2,
    label: "Instagram",
    href: "https://instagram.com/estatein",
    ariaLabel: "Visit our Instagram",
    extraLinks: [
      { label: "LinkedIn", href: "https://linkedin.com/company/estatein" },
      { label: "Facebook", href: "https://facebook.com/estatein" },
    ],
  },
];

function IconRing({ icon: Icon }: { icon: typeof Mail }) {
  return (
    <div className="relative flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20">
      <div className="absolute inset-0 rounded-full border border-violet-500/20" />
      <div className="absolute inset-2 rounded-full border border-violet-500/30" />
      <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 sm:h-12 sm:w-12">
        <Icon className="h-5 w-5 text-violet-500 sm:h-6 sm:w-6" aria-hidden="true" />
      </div>
    </div>
  );
}

export function ContactHeader({ contactInfo }: { contactInfo?: ContactInfo }) {
  // Legacy prop is accepted but ignored: the Figma design is the source of truth.
  void contactInfo;

  return (
    <section
      data-testid="contact-header"
      className="relative overflow-hidden bg-[#141414] px-4 pb-12 pt-20 sm:px-6 sm:pb-16 sm:pt-24 lg:px-8 lg:pb-20 lg:pt-28"
    >
      {/* Subtle diagonal grain/texture overlay approximating the Figma hero background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent 0, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
        }}
      />
      <div className="relative mx-auto max-w-7xl">
        <h1
          data-testid="contact-header-title"
          className="font-sans text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl"
        >
          Get in Touch with Estatein
        </h1>
        <p
          data-testid="contact-header-description"
          className="mt-4 max-w-4xl text-base leading-relaxed text-zinc-400 sm:text-lg lg:text-xl"
        >
          Welcome to Estatein&apos;s Contact Us page. We&apos;re here to assist you with any
          inquiries, requests, or feedback you may have. Whether you&apos;re looking to buy or
          sell a property, explore investment opportunities, or simply want to connect, we&apos;re
          just a message away. Reach out to us, and let&apos;s start a conversation.
        </p>
      </div>

      <div className="relative mx-auto mt-12 max-w-7xl sm:mt-16 lg:mt-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {DEFAULT_CARDS.map((card) => {
            const CardInner = (
              <div className="group relative flex flex-col items-center rounded-2xl bg-zinc-900/80 px-4 py-8 text-center transition hover:bg-zinc-900 sm:py-10">
                <ArrowUpRight
                  className="absolute right-4 top-4 h-5 w-5 text-zinc-500 transition group-hover:text-violet-500"
                  aria-hidden="true"
                />
                <IconRing icon={card.icon} />
                <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:mt-6">
                  <span className="text-base font-medium text-white sm:text-lg">{card.label}</span>
                  {card.extraLinks?.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-medium text-white underline underline-offset-4 transition hover:text-violet-400 sm:text-lg"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            );

            return card.id === "social" ? (
              <div
                key={card.id}
                data-testid={`contact-info-${card.id}`}
                aria-label={card.ariaLabel}
                className="group relative flex flex-col items-center rounded-2xl bg-zinc-900/80 px-4 py-8 text-center transition hover:bg-zinc-900 sm:py-10"
              >
                <ArrowUpRight
                  className="absolute right-4 top-4 h-5 w-5 text-zinc-500 transition group-hover:text-violet-500"
                  aria-hidden="true"
                />
                <IconRing icon={card.icon} />
                <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:mt-6">
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-medium text-white underline underline-offset-4 transition hover:text-violet-400 sm:text-lg"
                  >
                    {card.label}
                  </a>
                  {card.extraLinks?.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-medium text-white underline underline-offset-4 transition hover:text-violet-400 sm:text-lg"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : card.href ? (
              <a
                key={card.id}
                href={card.href}
                aria-label={card.ariaLabel}
                data-testid={`contact-info-${card.id}`}
              >
                {CardInner}
              </a>
            ) : (
              <div key={card.id} data-testid={`contact-info-${card.id}`} aria-label={card.ariaLabel}>
                {CardInner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
