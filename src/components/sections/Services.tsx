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
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
  {
    title: "Find Your Dream Home",
    href: "/properties",
    icon: Home,
    testId: "find-your-dream-home",
  },
  {
    title: "Unlock Property Value",
    href: "#property-selling",
    icon: KeyRound,
    testId: "unlock-property-value",
  },
  {
    title: "Effortless Property Management",
    href: "#property-management",
    icon: Building2,
    testId: "effortless-property-management",
  },
  {
    title: "Smart Investments, Informed Decisions",
    href: "#investment-advisory",
    icon: TrendingUp,
    testId: "smart-investments-informed-decisions",
  },
];

const SERVICES: Service[] = [
  {
    heading: "Unlock Property Value",
    subheading:
      "Selling your property should be a rewarding experience, and at Estatein, we make sure it is. Our Property Selling Service is designed to maximize the value of your property, ensuring you get the best deal possible. Explore the categories below to see how we can help you at every step of your selling journey.",
    categories: [
      {
        title: "Valuation Mastery",
        description:
          "Discover the true worth of your property with our expert valuation services.",
        icon: TrendingUp,
      },
      {
        title: "Strategic Marketing",
        description:
          "Selling a property requires more than just a listing; it demands a strategic marketing approach.",
        icon: Megaphone,
      },
      {
        title: "Negotiation Wizardry",
        description:
          "Negotiating the best deal is an art, and our negotiation experts are masters of it.",
        icon: Handshake,
      },
      {
        title: "Closing Success",
        description:
          "A successful sale is not complete until the closing. We guide you through the intricate closing process.",
        icon: CheckCircle,
      },
    ],
    ctaHeading: "Unlock the Value of Your Property Today",
    ctaBody:
      "Ready to unlock the true value of your property? Explore our Property Selling Service categories and let us help you achieve the best deal possible for your valuable asset.",
    ctaHref: "#services/property-selling",
    ctaText: "Learn More",
    testId: "property-selling",
    anchorId: "property-selling",
  },
  {
    heading: "Effortless Property Management",
    subheading:
      "Owning a property should be a pleasure, not a hassle. Estatein's Property Management Service takes the stress out of property ownership, offering comprehensive solutions tailored to your needs. Explore the categories below to see how we can make property management effortless for you.",
    categories: [
      {
        title: "Tenant Harmony",
        description:
          "Our Tenant Management services ensure that your tenants have a smooth and reducing vacancies.",
        icon: Users,
      },
      {
        title: "Maintenance Ease",
        description:
          "Say goodbye to property maintenance headaches. We handle all aspects of property upkeep.",
        icon: Wrench,
      },
      {
        title: "Financial Peace of Mind",
        description:
          "Managing property finances can be complex. Our financial experts take care of rent collection.",
        icon: Wallet,
      },
      {
        title: "Legal Guardian",
        description:
          "Stay compliant with property laws and regulations effortlessly.",
        icon: Scale,
      },
    ],
    ctaHeading: "Experience Effortless Property Management",
    ctaBody:
      "Ready to experience hassle-free property management? Explore our Property Management Service categories and let us handle the complexities while you enjoy the benefits of property ownership.",
    ctaHref: "#services/property-management",
    ctaText: "Learn More",
    testId: "property-management",
    anchorId: "property-management",
  },
];

const INVESTMENT_SERVICE = {
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
    {
      title: "Market Insight",
      description:
        "Stay ahead of market trends with our expert Market Analysis. We provide in-depth insights into real estate market conditions.",
      icon: BarChart3,
    },
    {
      title: "ROI Assessment",
      description:
        "Make investment decisions with confidence. Our ROI Assessment services evaluate the potential returns on your investments.",
      icon: PieChart,
    },
    {
      title: "Customized Strategies",
      description:
        "Every investor is unique, and so are their goals. We develop Customized Investment Strategies tailored to your specific needs.",
      icon: Target,
    },
    {
      title: "Diversification Mastery",
      description:
        "Diversify your real estate portfolio effectively. Our experts guide you in spreading your investments across various property types and locations.",
      icon: Globe,
    },
  ],
};

const BOTTOM_CTA = {
  heading: "Start Your Real Estate Journey Today",
  body: "Your dream property is just a click away. Whether you're looking for a new home, a strategic investment, or expert real estate advice, Estatein is here to assist you every step of the way. Take the first step towards your real estate goals and explore our available properties or get in touch with our team for personalized assistance.",
  href: "/properties",
  buttonText: "Explore Properties",
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function IconRing({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-violet-500/40 bg-zinc-900 md:h-14 md:w-14">
      <Icon className="h-5 w-5 text-violet-400 md:h-6 md:w-6" aria-hidden="true" />
      <ArrowUpRight className="absolute right-0 top-0 h-3.5 w-3.5 -translate-y-1/2 translate-x-1/2 text-zinc-500 md:h-4 md:w-4" />
    </div>
  );
}

export function ServicesPageIntro() {
  return (
    <section
      aria-labelledby="services-intro-heading"
      data-testid="services-intro-section"
      className="bg-zinc-950"
    >
      <div className="mx-auto max-w-[1920px] px-4 py-12 md:px-6 md:py-16 lg:px-8 lg:py-20 xl:px-12">
        <div className="max-w-4xl">
          <h1
            id="services-intro-heading"
            data-testid="services-intro-heading"
            className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl md:text-[42px] lg:text-5xl"
          >
            Elevate Your Real Estate Experience
          </h1>
          <p
            data-testid="services-intro-subheading"
            className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base md:mt-5"
          >
            Welcome to Estatein, where your real estate aspirations meet expert guidance. Explore our comprehensive range of services, each designed to cater to your unique needs and dreams.
          </p>
        </div>
      </div>
    </section>
  );
}

export function ServicesQuickLinks() {
  return (
    <section aria-label="Service quick links" data-testid="services-quick-links-section" className="bg-zinc-950">
      <div className="mx-auto max-w-[1920px] px-4 pb-12 md:px-6 md:pb-16 lg:px-8 lg:pb-20 xl:px-12">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-4 lg:gap-6">
          {QUICK_LINKS.map((link) => {
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

        <div className="mt-8 grid grid-cols-1 gap-4 md:mt-10 md:grid-cols-2 md:gap-5 lg:grid-cols-4 lg:gap-6">
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
            <h3 className="text-lg font-semibold text-white md:text-xl">{service.ctaHeading}</h3>
            <p className="mt-2 text-sm text-zinc-400">{service.ctaBody}</p>
          </div>
          <a
            href={service.ctaHref}
            data-testid={`services-${service.testId}-cta-button`}
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#703BF7] px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            {service.ctaText}
          </a>
        </div>
      </div>
    </section>
  );
}

export function InvestmentAdvisorySection() {
  const service = INVESTMENT_SERVICE;
  return (
    <section
      id={service.anchorId}
      aria-labelledby={`${service.testId}-heading`}
      data-testid={`services-${service.testId}-section`}
      className="bg-zinc-950"
    >
      <div className="mx-auto max-w-[1920px] px-4 py-12 md:px-6 md:py-16 lg:px-8 lg:py-20 xl:px-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col">
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

            <div
              data-testid="services-investment-advisory-left-cta"
              className="mt-8 flex flex-col gap-5 rounded-2xl border border-zinc-800 bg-[#1a1a1a] px-5 py-6 md:px-8 md:py-8"
            >
              <div className="max-w-2xl">
                <h3 className="text-lg font-semibold text-white md:text-xl">{service.ctaHeading}</h3>
                <p className="mt-2 text-sm text-zinc-400">{service.ctaBody}</p>
              </div>
              <a
                href={service.ctaHref}
                data-testid="services-investment-advisory-left-cta-button"
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#703BF7] px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
              >
                {service.ctaText}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-1 lg:gap-6">
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
        </div>
      </div>
    </section>
  );
}

export function ServicesBottomCta() {
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
              {BOTTOM_CTA.heading}
            </h2>
            <p
              data-testid="services-bottom-cta-body"
              className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base"
            >
              {BOTTOM_CTA.body}
            </p>
          </div>
          <a
            href={BOTTOM_CTA.href}
            data-testid="services-bottom-cta-button"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#703BF7] px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            {BOTTOM_CTA.buttonText}
          </a>
        </div>
      </div>
    </section>
  );
}

export function ServicesPageContent() {
  return (
    <>
      <ServicesPageIntro />
      <ServicesQuickLinks />
      {SERVICES.map((service) => (
        <ServiceSection key={service.testId} service={service} />
      ))}
      <InvestmentAdvisorySection />
      <ServicesBottomCta />
    </>
  );
}

export function Services() {
  return (
    <>
      {SERVICES.map((service) => (
        <ServiceSection key={service.testId} service={service} />
      ))}
    </>
  );
}
