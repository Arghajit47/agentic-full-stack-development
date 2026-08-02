"use client";

import Image from "next/image";
import { Home, TrendingUp, Building2, Lightbulb, ArrowUpRight, Loader2, RotateCcw } from "lucide-react";
import { type HeroContentData, type HeroFeature, type HeroStat } from "@/lib/api";

const HERO_IMAGE = "/images/hero-building.svg";

const DEFAULT_FEATURES: HeroFeature[] = [
  { title: "Find Your Dream Home", description: "" },
  { title: "Unlock Property Value", description: "" },
  { title: "Effortless Property Management", description: "" },
  { title: "Smart Investments. Informed Decisions", description: "" },
];

const DEFAULT_STATS: HeroStat[] = [
  { value: "200+", label: "Happy Customers" },
  { value: "10k+", label: "Properties For Clients" },
  { value: "16+", label: "Years of Experience" },
];

const DEFAULT_DATA: HeroContentData = {
  heading: "Discover Your Dream Property with Estatein",
  subheading:
    "Your journey to finding the perfect property begins here. Explore our listings to find the home that matches your dreams.",
  primaryCta: { text: "Browse Properties", href: "/properties" },
  secondaryCta: { text: "Learn More", href: "#learn-more" },
  stats: DEFAULT_STATS,
  features: DEFAULT_FEATURES,
};

const FEATURE_ICONS: Record<string, typeof Home> = {
  "Find Your Dream Home": Home,
  "Unlock Property Value": TrendingUp,
  "Effortless Property Management": Building2,
  "Smart Investments. Informed Decisions": Lightbulb,
};

function DiscoverBadge() {
  const text = "Discover Your Dream Property · ";
  const radius = 48;

  return (
    <div
      className="relative flex h-[117px] w-[117px] items-center justify-center rounded-full border border-[#1e1c1c]/80 bg-[#141414] lg:h-[129px] lg:w-[129px] desktop:h-[175px] desktop:w-[175px]"
      aria-hidden="true"
      data-testid="hero-discover-badge"
    >
      <svg
        className="absolute inset-0 h-full w-full animate-[spin_20s_linear_infinite]"
        viewBox="0 0 120 120"
      >
        <defs>
          <path
            id="circlePath"
            d={`M 60, 60 m -${radius}, 0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
          />
        </defs>
        <text fill="white" fontSize="10" letterSpacing="2">
          <textPath href="#circlePath" startOffset="0%">
            {text}
          </textPath>
        </text>
      </svg>
      <div className="flex h-[53px] w-[53px] items-center justify-center rounded-full border border-[#1e1c1c]/80 bg-[#1a1a1a] lg:h-[59px] lg:w-[59px] desktop:h-20 desktop:w-20">
        <ArrowUpRight className="h-[22px] w-[22px] text-white lg:h-6 lg:w-6 desktop:h-[34px] desktop:w-[34px]" />
      </div>
    </div>
  );
}

function HeroSkeleton() {
  return (
    <section data-testid="hero-section" className="bg-[#141414]">
      <div className="mx-auto grid max-w-[1920px] items-center gap-8 px-4 py-12 md:px-6 md:py-16 lg:grid-cols-2 lg:gap-6 lg:px-8 lg:py-20 xl:px-12">
        <div className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left">
          <div
            data-testid="hero-heading-skeleton"
            className="h-10 w-full max-w-2xl animate-pulse rounded-lg bg-zinc-800 sm:h-12 md:h-14"
          />
          <div
            data-testid="hero-subheading-skeleton"
            className="mt-4 h-16 w-full max-w-xl animate-pulse rounded-lg bg-zinc-800 md:mt-5"
          />
          <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row md:mt-8 md:gap-4">
            <div
              data-testid="hero-primary-cta-skeleton"
              className="h-12 w-full animate-pulse rounded-xl bg-zinc-800 sm:w-40"
            />
            <div
              data-testid="hero-secondary-cta-skeleton"
              className="h-12 w-full animate-pulse rounded-xl bg-zinc-800 sm:w-40"
            />
          </div>
          <div className="mt-8 grid w-full grid-cols-2 gap-3 md:grid-cols-3 lg:mt-10 lg:gap-4">
            {DEFAULT_STATS.map((stat) => (
              <div
                key={stat.label}
                data-testid={`hero-stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}-skeleton`}
                className="flex flex-col items-center gap-2 rounded-xl bg-[#1a1a1a] px-4 py-4 lg:items-start lg:px-5 lg:py-5"
              >
                <div className="h-8 w-16 animate-pulse rounded bg-zinc-800 md:h-9" />
                <div className="h-4 w-24 animate-pulse rounded bg-zinc-800" />
              </div>
            ))}
          </div>
        </div>
        <div className="relative order-1 flex items-center justify-center lg:order-2 lg:justify-end">
          <div className="relative aspect-[4/3] w-full animate-pulse rounded-2xl bg-zinc-800 lg:aspect-square lg:max-w-2xl" />
        </div>
      </div>
    </section>
  );
}

export interface HeroProps {
  hero?: HeroContentData | null;
  isLoading?: boolean;
  error?: Error | null;
  retry?: () => void;
}

export function Hero({ hero, isLoading, error, retry }: HeroProps) {
  if (isLoading) return <HeroSkeleton />;

  const data = hero ?? DEFAULT_DATA;

  return (
    <section aria-labelledby="hero-heading" data-testid="hero-section" className="relative overflow-hidden bg-[#141414]">
      {/* Abstract design corner decorations */}
      <Image
        src="/images/abstract-design-left.png"
        alt=""
        aria-hidden="true"
        width={473}
        height={258}
        className="pointer-events-none absolute bottom-0 left-0 select-none opacity-40"
        priority={false}
      />
      <Image
        src="/images/abstract-design-right.png"
        alt=""
        aria-hidden="true"
        width={555}
        height={259}
        className="pointer-events-none absolute bottom-0 right-0 select-none opacity-40"
        priority={false}
      />
      <div className="relative mx-auto grid max-w-[1920px] items-center gap-8 px-4 py-12 md:px-6 md:py-16 lg:grid-cols-2 lg:gap-6 lg:px-8 lg:py-20 xl:px-12">
        {/* Text column */}
        <div className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left">
          <h1
            id="hero-heading"
            data-testid="hero-heading"
            className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-5xl"
          >
            {data.heading}
          </h1>
          <p
            data-testid="hero-subheading"
            className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base md:mt-5"
          >
            {data.subheading}
          </p>

          <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row md:mt-8 md:gap-4">
            <a
              href={data.secondaryCta.href}
              data-testid="hero-learn-more"
              aria-label={`${data.secondaryCta.text} about Estatein properties`}
              className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-950 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:border-zinc-500 hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-black"
            >
              {data.secondaryCta.text}
            </a>
            <a
              href={data.primaryCta.href}
              data-testid="hero-browse-properties"
              className="inline-flex items-center justify-center rounded-xl bg-[#703BF7] px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-black"
            >
              {data.primaryCta.text}
            </a>
          </div>

          {error ? (
            <div
              data-testid="hero-error"
              role="alert"
              className="mt-6 flex w-full flex-col items-center gap-3 rounded-xl bg-zinc-950 px-4 py-4 text-center text-zinc-300 sm:flex-row sm:justify-between sm:text-left md:mt-8 md:px-5 md:py-5"
            >
              <span className="text-sm">Unable to load hero content. Showing fallback data.</span>
              {retry ? (
                <button
                  type="button"
                  onClick={retry}
                  data-testid="hero-retry"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Retry
                </button>
              ) : null}
            </div>
          ) : null}

          <div className="mt-8 grid w-full grid-cols-2 gap-3 md:grid-cols-3 lg:mt-10 lg:gap-4">
            {data.stats.map((stat) => (
              <div
                key={stat.label}
                data-testid={`hero-stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="flex flex-col items-center rounded-xl bg-[#1a1a1a] px-4 py-4 text-center lg:items-start lg:px-5 lg:py-5 lg:text-left"
              >
                <span className="text-2xl font-semibold text-white md:text-3xl">{stat.value}</span>
                <span className="mt-1 text-sm text-zinc-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Image column */}
        <div className="relative order-1 flex items-center justify-center lg:order-2 lg:justify-end">
          <div className="relative isolate aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#2A213F] lg:aspect-square lg:max-w-2xl">
            <Image
              src="/images/abstract-design-hero.png"
              alt=""
              aria-hidden="true"
              fill
              className="object-cover opacity-0"
            />
            <Image
              src={HERO_IMAGE}
              alt="Modern blue glass skyscrapers"
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 768px) 100vw, 50vw"
              data-testid="hero-image"
            />
            <div className="absolute left-4 top-4 lg:left-auto lg:right-8 lg:top-8">
              <DiscoverBadge />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export interface FeatureCardsProps {
  features?: HeroFeature[];
  isLoading?: boolean;
}

export function FeatureCards({ features, isLoading }: FeatureCardsProps) {
  if (isLoading) {
    return (
      <section data-testid="feature-cards-section" className="bg-zinc-950">
        <div className="mx-auto grid max-w-[1920px] grid-cols-2 gap-3 px-4 pb-12 sm:gap-4 md:grid-cols-4 md:gap-5 md:px-6 md:pb-16 lg:px-8 lg:pb-20 xl:gap-6 xl:px-12">
          {DEFAULT_FEATURES.map((feature) => (
            <div
              key={feature.title}
              data-testid={`feature-card-${feature.title.toLowerCase().replace(/\s+/g, "-")}-skeleton`}
              className="flex flex-col items-center gap-3 rounded-2xl bg-[#1a1a1a] px-4 py-6 md:items-start md:px-5 md:py-7 lg:px-6 lg:py-8"
            >
              <div className="h-12 w-12 animate-pulse rounded-full bg-zinc-800 md:h-14 md:w-14" />
              <div className="h-5 w-32 animate-pulse rounded bg-zinc-800" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  const displayFeatures = features ?? DEFAULT_FEATURES;

  return (
    <section aria-label="Feature cards" data-testid="feature-cards-section" className="bg-zinc-950">
      <div className="mx-auto grid max-w-[1920px] grid-cols-2 gap-3 px-4 pb-12 sm:gap-4 md:grid-cols-4 md:gap-5 md:px-6 md:pb-16 lg:px-8 lg:pb-20 xl:gap-6 xl:px-12">
        {displayFeatures.map((feature) => {
          const Icon = FEATURE_ICONS[feature.title] ?? Home;
          return (
            <a
              key={feature.title}
              href="#"
              data-testid={`feature-card-${feature.title.toLowerCase().replace(/\s+/g, "-")}`}
              className="group flex flex-col items-center rounded-2xl bg-[#1a1a1a] px-4 py-6 text-center transition-colors hover:bg-[#222222] focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-zinc-950 md:items-start md:px-5 md:py-7 md:text-left lg:px-6 lg:py-8"
            >
              <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-violet-500/40 bg-zinc-900 md:h-14 md:w-14">
                <Icon className="h-5 w-5 text-violet-400 md:h-6 md:w-6" aria-hidden="true" />
                <ArrowUpRight className="absolute right-0 top-0 h-3.5 w-3.5 -translate-y-1/2 translate-x-1/2 text-zinc-500 transition-colors group-hover:text-white md:h-4 md:w-4" />
              </div>
              <span className="text-sm font-medium text-white md:text-base">{feature.title}</span>
            </a>
          );
        })}
      </div>
    </section>
  );
}

export { Loader2 };
