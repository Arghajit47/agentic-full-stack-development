"use client";

import {
  TrendingUp,
  Megaphone,
  Handshake,
  CheckCircle,
  Users,
  Wrench,
  Wallet,
  Scale,
  BarChart3,
  PieChart,
  Target,
  Globe,
  Home,
  KeyRound,
  Building2,
  ArrowUpRight,
  RotateCcw,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ServicesData } from "@/lib/api";

const ICON_MAP: Record<string, LucideIcon> = {
  Home,
  KeyRound,
  Building2,
  TrendingUp,
  Users,
  Wrench,
  Wallet,
  Scale,
  BarChart3,
  PieChart,
  Target,
  Globe,
  Megaphone,
  Handshake,
  CheckCircle,
};

interface ServiceCategory {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface Service {
  heading: string;
  subheading: string;
  categories: ServiceCategory[];
  ctaHeading: string;
  ctaBody: string;
  ctaHref: string;
  ctaText: string;
  testId: string;
  anchorId: string;
}

interface QuickLink {
  title: string;
  href: string;
  icon: LucideIcon;
  testId: string;
}

const QUICK_LINKS: QuickLink[] = [
  { title: "Find Your Dream Home", href: "/properties", icon: getIcon("Home"), testId: "find-your-dream-home" },
  { title: "Unlock Property Value", href: "#property-selling", icon: getIcon("KeyRound"), testId: "unlock-property-value" },
  { title: "Effortless Property Management", href: "#property-management", icon: getIcon("Building2"), testId: "effortless-property-management" },
  { title: "Smart Investments, Informed Decisions", href: "#investment-advisory", icon: getIcon("TrendingUp"), testId: "smart-investments-informed-decisions" },
];

const PROPERTY_SELLING: Service = {
  heading: "Unlock Property Value",
  subheading:
    "Selling your property should be a rewarding experience, and at Estatein, we make sure it is. Our Property Selling Service is designed to maximize the value of your property, ensuring you get the best deal possible. Explore the categories below to see how we can help you at every step of your selling journey.",
  categories: [
    { title: "Valuation Mastery", description: "Discover the true worth of your property with our expert valuation services.", icon: getIcon("TrendingUp") },
    { title: "Strategic Marketing", description: "Selling a property requires more than just a listing; it demands a strategic marketing approach.", icon: getIcon("Megaphone") },
    { title: "Negotiation Wizardry", description: "Negotiating the best deal is an art, and our negotiation experts are masters of it.", icon: getIcon("Handshake") },
    { title: "Closing Success", description: "A successful sale is not complete until the closing. We guide you through the intricate closing process.", icon: getIcon("CheckCircle") },
  ],
  ctaHeading: "Unlock the Value of Your Property Today",
  ctaBody:
    "Ready to unlock the true value of your property? Explore our Property Selling Service categories and let us help you achieve the best deal possible for your valuable asset.",
  ctaHref: "#services/property-selling",
  ctaText: "Learn More",
  testId: "property-selling",
  anchorId: "property-selling",
};

const PROPERTY_MANAGEMENT: Service = {
  heading: "Effortless Property Management",
  subheading:
    "Owning a property should be a pleasure, not a hassle. Estatein's Property Management Service takes the stress out of property ownership, offering comprehensive solutions tailored to your needs. Explore the categories below to see how we can make property management effortless for you.",
  categories: [
    { title: "Tenant Harmony", description: "Our Tenant Management services ensure that your tenants have a smooth and reducing vacancies.", icon: getIcon("Users") },
    { title: "Maintenance Ease", description: "Say goodbye to property maintenance headaches. We handle all aspects of property upkeep.", icon: getIcon("Wrench") },
    { title: "Financial Peace of Mind", description: "Managing property finances can be complex. Our financial experts take care of rent collection.", icon: getIcon("Wallet") },
    { title: "Legal Guardian", description: "Stay compliant with property laws and regulations effortlessly.", icon: getIcon("Scale") },
  ],
  ctaHeading: "Experience Effortless Property Management",
  ctaBody:
    "Ready to experience hassle-free property management? Explore our Property Management Service categories and let us handle the complexities while you enjoy the benefits of property ownership.",
  ctaHref: "#services/property-management",
  ctaText: "Learn More",
  testId: "property-management",
  anchorId: "property-management",
};

const INVESTMENT_SERVICE: Service = {
  heading: "Smart Investments, Informed Decisions",
  subheading:
    "Building a real estate portfolio requires a strategic approach. Estatein's Investment Advisory Service empowers you to make smart investments and informed decisions.",
  ctaHeading: "Unlock Your Investment Potential",
  ctaBody:
    "Explore our Property Management Service categories and let us handle the complexities while you enjoy the benefits of property ownership.",
  ctaHref: "#services/investment-advisory",
  ctaText: "Learn More",
  testId: "investment-advisory",
  anchorId: "investment-advisory",
  categories: [
    { title: "Market Insight", description: "Stay ahead of market trends with our expert Market Analysis. We provide in-depth insights into real estate market conditions.", icon: getIcon("BarChart3") },
    { title: "ROI Assessment", description: "Make investment decisions with confidence. Our ROI Assessment services evaluate the potential returns on your investments.", icon: getIcon("PieChart") },
    { title: "Customized Strategies", description: "Every investor is unique, and so are their goals. We develop Customized Investment Strategies tailored to your specific needs.", icon: getIcon("Target") },
    { title: "Diversification Mastery", description: "Diversify your real estate portfolio effectively. Our experts guide you in spreading your investments across various property types and locations.", icon: getIcon("Globe") },
  ],
};

const DEFAULT_BOTTOM_CTA = {
  heading: "Start Your Real Estate Journey Today",
  body: "Your dream property is just a click away. Whether you're looking for a new home, a strategic investment, or expert real estate advice, Estatein is here to assist you every step of the way. Take the first step towards your real estate goals and explore our available properties or get in touch with our team for personalized assistance.",
  href: "/properties",
  buttonText: "Explore Properties",
};

function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? ArrowUpRight;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function mapApiService(apiService: ServicesData["services"][number], testId: string, anchorId: string): Service {
  return {
    heading: apiService.heading,
    subheading: apiService.subheading,
    categories: apiService.categories.map((c) => ({ ...c, icon: getIcon(c.icon) })),
    ctaHeading: apiService.ctaHeading,
    ctaBody: apiService.ctaBody,
    ctaHref: apiService.ctaHref,
    ctaText: apiService.ctaText,
    testId,
    anchorId,
  };
}

function mapApiQuickLink(apiLink: ServicesData["quickLinks"][number]): QuickLink {
  return {
    title: apiLink.title,
    href: apiLink.href,
    icon: getIcon(apiLink.icon),
    testId: slugify(apiLink.title),
  };
}

function deriveQuickLinks(apiLinks: ServicesData["quickLinks"] | undefined): QuickLink[] {
  if (!apiLinks || apiLinks.length === 0) return QUICK_LINKS;
  return apiLinks.map(mapApiQuickLink);
}

function deriveServices(apiServices: ServicesData["services"] | undefined): Service[] {
  const defaults = [PROPERTY_SELLING, PROPERTY_MANAGEMENT, INVESTMENT_SERVICE];
  if (!apiServices || apiServices.length === 0) return defaults;
  const ids = ["property-selling", "property-management", "investment-advisory"];
  return apiServices.map((s, i) =>
    mapApiService(s, ids[i] ?? slugify(s.heading), ids[i] ?? slugify(s.heading)),
  );
}

export interface ServicesPageContentProps {
  data?: ServicesData | null;
  isLoading?: boolean;
  error?: Error | null;
  retry?: () => void;
}

function ServicesSkeleton() {
  return (
    <section data-testid="services-skeleton" aria-label="Loading services" className="bg-zinc-950">
      <div className="mx-auto max-w-[1920px] px-4 py-12 md:px-6 md:py-16 lg:px-8 lg:py-20 xl:px-12">
        <div className="max-w-4xl space-y-4">
          <div className="h-10 w-3/4 animate-pulse rounded-lg bg-zinc-800 sm:h-12 md:h-14" />
          <div className="h-16 w-full max-w-2xl animate-pulse rounded-lg bg-zinc-800" />
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-4 lg:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col rounded-2xl bg-[#1a1a1a] px-5 py-6 md:px-6 md:py-7">
              <div className="mb-4 h-12 w-12 animate-pulse rounded-full bg-zinc-800 md:h-14 md:w-14" />
              <div className="h-5 w-40 animate-pulse rounded bg-zinc-800" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesError({ retry, message }: { retry?: () => void; message?: string }) {
  return (
    <section data-testid="services-error" aria-live="polite" className="bg-zinc-950">
      <div className="mx-auto max-w-[1920px] px-4 py-12 md:px-6 md:py-16 lg:px-8 lg:py-20 xl:px-12">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-zinc-800 bg-[#1a1a1a] px-5 py-8 text-center md:px-8 md:py-10">
          <p className="text-zinc-300">{message ?? "Unable to load services content."}</p>
          {retry ? (
            <button
              type="button"
              onClick={retry}
              data-testid="services-error-retry"
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Retry
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function IconRing({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-violet-500/40 bg-zinc-900 md:h-14 md:w-14">
      <Icon className="h-5 w-5 text-violet-400 md:h-6 md:w-6" aria-hidden="true" />
    </div>
  );
}

function ServicesPageIntro({ intro }: { intro?: ServicesData["intro"] }) {
  return (
    <section aria-labelledby="services-intro-heading" data-testid="services-intro-section" className="bg-zinc-950">
      <div className="mx-auto max-w-[1920px] px-4 py-12 md:px-6 md:py-16 lg:px-8 lg:py-20 xl:px-12">
        <div className="max-w-4xl">
          <h1
            id="services-intro-heading"
            data-testid="services-intro-heading"
            className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl md:text-[42px] lg:text-5xl"
          >
            {intro?.heading ?? "Elevate Your Real Estate Experience"}
          </h1>
          <p
            data-testid="services-intro-subheading"
            className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base md:mt-5"
          >
            {intro?.subheading ??
              "Welcome to Estatein, where your real estate aspirations meet expert guidance. Explore our comprehensive range of services, each designed to cater to your unique needs and dreams."}
          </p>
        </div>
      </div>
    </section>
  );
}

function ServicesQuickLinks({ links }: { links?: QuickLink[] }) {
  const displayLinks = links ?? QUICK_LINKS;
  return (
    <section aria-label="Service quick links" data-testid="services-quick-links-section" className="bg-zinc-950">
      <div className="mx-auto max-w-[1920px] px-4 pb-12 md:px-6 md:pb-16 lg:px-8 lg:pb-20 xl:px-12">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-4 lg:gap-6">
          {displayLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.testId}
                href={link.href}
                data-testid={`services-quick-link-${link.testId}`}
                className="group flex flex-col rounded-2xl bg-[#1a1a1a] px-5 py-6 transition-colors hover:bg-[#222222] focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-zinc-950 md:px-6 md:py-7"
              >
                <IconRing icon={Icon} />
                <span className="text-base font-medium text-white md:text-lg">{link.title}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ServiceSection({ service }: { service: Service }) {
  return (
    <section
      id={service.anchorId}
      aria-labelledby={`${service.testId}-heading`}
      data-testid={`services-${service.testId}-section`}
      className="bg-zinc-950"
    >
      <div className="mx-auto max-w-[1920px] px-4 py-12 md:px-6 md:py-16 lg:px-8 lg:py-20 xl:px-12">
        <div className="max-w-4xl">
          <h2
            id={`${service.testId}-heading`}
            data-testid={`services-${service.testId}-heading`}
            className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl"
          >
            {service.heading}
          </h2>
          <p
            data-testid={`services-${service.testId}-subheading`}
            className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base"
          >
            {service.subheading}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:mt-10 md:grid-cols-2 md:gap-5 lg:grid-cols-4 lg:gap-6 xl:grid-cols-4">
          {service.categories.map((category) => {
            const Icon = category.icon;
            return (
              <a
                key={category.title}
                href={service.ctaHref}
                data-testid={`services-${service.testId}-card-${slugify(category.title)}`}
                className="group flex flex-col rounded-2xl bg-[#1a1a1a] px-5 py-6 transition-colors hover:bg-[#222222] focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-zinc-950 md:px-6 md:py-7"
              >
                <IconRing icon={Icon} />
                <h3 className="text-base font-medium text-white md:text-lg">{category.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{category.description}</p>
              </a>
            );
          })}
        </div>

        <div
          data-testid={`services-${service.testId}-cta`}
          className="mt-8 flex flex-col gap-5 rounded-2xl border border-zinc-800 bg-[#1a1a1a] px-5 py-6 md:mt-10 md:flex-row md:items-center md:justify-between md:px-8 md:py-8"
        >
          <div className="max-w-2xl">
            <a
              href={service.ctaHref}
              className="inline-flex items-center gap-2 text-lg font-semibold text-white transition-colors hover:text-violet-400 md:text-xl"
            >
              {service.ctaHeading}
              <ArrowUpRight className="h-5 w-5 shrink-0 text-[#703BF7]" aria-hidden="true" />
            </a>
            <p className="mt-2 text-sm text-zinc-400">{service.ctaBody}</p>
          </div>
          <a
            href={service.ctaHref}
            data-testid={`services-${service.testId}-cta-button`}
            className="inline-flex shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-transparent px-6 py-3.5 text-sm font-medium text-white transition-colors hover:border-violet-500 hover:text-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            {service.ctaText}
          </a>
        </div>
      </div>
    </section>
  );
}

function InvestmentAdvisorySection({ service }: { service?: Service }) {
  const displayService = service ?? INVESTMENT_SERVICE;
  return (
    <section
      id={displayService.anchorId}
      aria-labelledby={`${displayService.testId}-heading`}
      data-testid={`services-${displayService.testId}-section`}
      className="bg-zinc-950"
    >
      <div className="mx-auto max-w-[1920px] px-4 py-12 md:px-6 md:py-16 lg:px-8 lg:py-20 xl:px-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col">
            <div className="max-w-4xl">
              <h2
                id={`${displayService.testId}-heading`}
                data-testid={`services-${displayService.testId}-heading`}
                className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl"
              >
                {displayService.heading}
              </h2>
              <p
                data-testid={`services-${displayService.testId}-subheading`}
                className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base"
              >
                {displayService.subheading}
              </p>
            </div>

            <div
              data-testid="services-investment-advisory-left-cta"
              className="mt-8 flex flex-col gap-5 rounded-2xl border border-zinc-800 bg-[#1a1a1a] px-5 py-6 md:px-8 md:py-8"
            >
              <div className="max-w-2xl">
                <a
                  href={displayService.ctaHref}
                  className="inline-flex items-center gap-2 text-lg font-semibold text-white transition-colors hover:text-violet-400 md:text-xl"
                >
                  {displayService.ctaHeading}
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-[#703BF7]" aria-hidden="true" />
                </a>
                <p className="mt-2 text-sm text-zinc-400">{displayService.ctaBody}</p>
              </div>
              <a
                href={displayService.ctaHref}
                data-testid="services-investment-advisory-left-cta-button"
                className="inline-flex shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-transparent px-6 py-3.5 text-sm font-medium text-white transition-colors hover:border-violet-500 hover:text-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
              >
                {displayService.ctaText}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-1 lg:gap-6">
            {displayService.categories.map((category) => {
              const Icon = category.icon;
              return (
                <a
                  key={category.title}
                  href={displayService.ctaHref}
                  data-testid={`services-${displayService.testId}-card-${slugify(category.title)}`}
                  className="group flex flex-col rounded-2xl bg-[#1a1a1a] px-5 py-6 transition-colors hover:bg-[#222222] focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-zinc-950 md:px-6 md:py-7"
                >
                  <IconRing icon={Icon} />
                  <h3 className="text-base font-medium text-white md:text-lg">{category.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400">{category.description}</p>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesBottomCta({ bottomCta }: { bottomCta?: ServicesData["bottomCta"] }) {
  const data = bottomCta ?? DEFAULT_BOTTOM_CTA;
  return (
    <section aria-labelledby="services-bottom-cta-heading" data-testid="services-bottom-cta-section" className="bg-zinc-950">
      <div className="mx-auto max-w-[1920px] px-4 py-12 md:px-6 md:py-16 lg:px-8 lg:py-20 xl:px-12">
        <div className="flex flex-col gap-8 rounded-2xl border border-zinc-800 bg-[#1a1a1a] px-5 py-8 md:flex-row md:items-end md:justify-between md:px-8 md:py-10">
          <div className="max-w-3xl">
            <h2
              id="services-bottom-cta-heading"
              data-testid="services-bottom-cta-heading"
              className="text-2xl font-semibold text-white sm:text-3xl md:text-4xl"
            >
              {data.heading}
            </h2>
            <p data-testid="services-bottom-cta-body" className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
              {data.body}
            </p>
          </div>
          <a
            href={data.href}
            data-testid="services-bottom-cta-button"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#703BF7] px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            {data.buttonText}
          </a>
        </div>
      </div>
    </section>
  );
}

export function ServicesPageContent({ data, isLoading, error, retry }: ServicesPageContentProps) {
  if (isLoading) {
    return (
      <>
        <ServicesSkeleton />
        <ServicesSkeleton />
      </>
    );
  }

  if (error) {
    return <ServicesError retry={retry} message={error.message} />;
  }

  const services = deriveServices(data?.services);
  const quickLinks = deriveQuickLinks(data?.quickLinks);
  const intro = data?.intro;
  const bottomCta = data?.bottomCta;
  const isEmpty = !data || (data.services !== undefined && data.services.length === 0);

  return (
    <>
      {isEmpty ? (
        <section data-testid="services-empty" aria-live="polite" className="bg-zinc-950">
          <div className="mx-auto max-w-[1920px] px-4 py-12 text-center md:px-6 md:py-16 lg:px-8 lg:py-20 xl:px-12">
            <p className="text-zinc-400">No services content available.</p>
          </div>
        </section>
      ) : null}
      <ServicesPageIntro intro={intro} />
      <ServicesQuickLinks links={quickLinks} />
      {services.slice(0, 2).map((service) => (
        <ServiceSection key={service.testId} service={service} />
      ))}
      <InvestmentAdvisorySection service={services[2]} />
      {/* Bottom CTA removed - Footer provides the "Start Your Real Estate Journey Today" section */}
    </>
  );
}

export function Services() {
  return (
    <>
      {[PROPERTY_SELLING, PROPERTY_MANAGEMENT].map((service) => (
        <ServiceSection key={service.testId} service={service} />
      ))}
    </>
  );
}
