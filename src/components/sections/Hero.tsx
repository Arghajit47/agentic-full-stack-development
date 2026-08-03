"use client";

import Image from "next/image";
import { Home, TrendingUp, Building2, Lightbulb, ArrowUpRight, Loader2, RotateCcw } from "lucide-react";
import { type HeroContentData, type HeroFeature, type HeroStat } from "@/lib/api";

const HERO_IMAGE = "/images/hero-building.jpg";

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

function HeroSkeleton() {
  return (
    <section data-testid="hero-section" className="flex flex-col overflow-hidden">
      <div className="relative mx-auto my-8 grid w-full max-w-[1920px] grid-cols-1 content-center px-4 md:my-0 md:grid-cols-2 md:gap-[60px] md:px-6 lg:px-8 xl:px-12 desktop:gap-20">
        <div className="order-2 flex flex-col justify-center gap-[60px] md:order-1">
          <div className="flex flex-col gap-6">
            <div
              data-testid="hero-heading-skeleton"
              className="h-10 w-full max-w-2xl animate-pulse rounded-lg bg-zinc-800 sm:h-12 md:h-14"
            />
            <div
              data-testid="hero-subheading-skeleton"
              className="h-16 w-full max-w-xl animate-pulse rounded-lg bg-zinc-800"
            />
          </div>
          <div className="flex w-full flex-col items-center gap-4 md:flex-row">
            <div
              data-testid="hero-primary-cta-skeleton"
              className="h-12 w-full animate-pulse rounded-xl bg-zinc-800 md:w-40"
            />
            <div
              data-testid="hero-secondary-cta-skeleton"
              className="h-12 w-full animate-pulse rounded-xl bg-zinc-800 md:w-40"
            />
          </div>
          <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {DEFAULT_STATS.map((stat) => (
              <div
                key={stat.label}
                data-testid={`hero-stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}-skeleton`}
                className="flex flex-col items-center gap-2 rounded-xl bg-[#1a1a1a] px-4 py-4 md:items-start md:px-3.5 md:py-3.5"
              >
                <div className="h-8 w-16 animate-pulse rounded bg-zinc-800 md:h-9" />
                <div className="h-4 w-24 animate-pulse rounded bg-zinc-800" />
              </div>
            ))}
          </div>
        </div>
        <div className="relative order-1 mb-[72px] h-[302px] animate-pulse overflow-hidden rounded-xl bg-zinc-800 md:order-2 md:mb-0 md:min-h-[622px]" data-testid="property-gallery-skeleton" />
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
    <section
      aria-labelledby="hero-heading"
      data-testid="hero-section"
      className="relative flex flex-col overflow-hidden"
    >
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
      <div className="relative mx-auto my-8 grid w-full max-w-[1920px] grid-cols-1 content-center px-4 md:my-0 md:grid-cols-2 md:gap-[60px] md:px-6 lg:px-8 xl:px-12 desktop:gap-20">
        {/* Text column */}
        <div className="order-2 flex flex-col justify-center gap-[60px] md:order-1">
          <div className="flex flex-col gap-6">
            <h1
              id="hero-heading"
              data-testid="hero-heading"
              className="text-[28px] font-semibold leading-[1.2] sm:text-[36px] xl:text-[46px] desktop:text-6xl"
            >
              {data.heading}
            </h1>
            <p
              data-testid="hero-subheading"
              className="text-[14px] font-medium text-[#999999] xl:text-base desktop:text-lg"
            >
              {data.subheading}
            </p>
          </div>

          <div className="flex w-full flex-col items-center gap-4 md:flex-row desktop:gap-5">
            <a
              href={data.secondaryCta.href}
              data-testid="hero-learn-more"
              aria-label={`${data.secondaryCta.text} about Estatein properties`}
              className="w-full rounded-[8px] border border-[#262626] bg-[#141414] px-[20px] py-[14px] text-center text-[14px] font-medium text-white transition hover:bg-zinc-950 md:w-fit desktop:rounded-[10px] desktop:px-[24px] desktop:py-[18px] desktop:text-[18px]"
            >
              {data.secondaryCta.text}
            </a>
            <a
              href={data.primaryCta.href}
              data-testid="hero-browse-properties"
              className="w-full rounded-[8px] border border-[#262626] bg-[#703BF7] px-[20px] py-[14px] text-center text-[14px] font-medium text-white transition hover:opacity-80 sm:w-fit desktop:rounded-[10px] desktop:px-[24px] desktop:py-[18px] desktop:text-[18px]"
            >
              {data.primaryCta.text}
            </a>
          </div>

          {error ? (
            <div
              data-testid="hero-error"
              role="alert"
              className="flex w-full flex-col items-center gap-3 rounded-xl bg-zinc-950 px-4 py-4 text-center text-zinc-300 sm:flex-row sm:justify-between sm:text-left md:px-5 md:py-5"
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

          <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 desktop:gap-5">
            {data.stats.map((stat, i) => (
              <div
                key={stat.label}
                data-testid={`hero-stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={`flex flex-col items-center gap-[2px] rounded-xl border border-[#262626] bg-[#141414] p-4 md:items-start md:p-3.5 desktop:p-4${i === data.stats.length - 1 ? " col-span-2 md:col-span-1" : ""}`}
              >
                <span className="text-2xl font-bold leading-normal text-white md:text-[30px] desktop:text-[40px]">{stat.value}</span>
                <span className="text-center text-[14px] font-medium leading-normal text-[#999999] md:text-left xl:text-base desktop:text-lg">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Image column */}
        <div className="relative order-1 mb-[72px] h-[302px] overflow-hidden rounded-xl border border-[#262626] md:order-2 md:mb-0 md:min-h-[622px] md:overflow-visible md:rounded-none md:border-none desktop:min-h-[814px]">
          <div className="absolute left-0 right-0 z-30 h-full translate-x-0 md:w-[calc(50vw-30px)]">
            <Image
              src={HERO_IMAGE}
              alt="Modern blue glass skyscrapers"
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 768px) 100vw, 50vw"
              className="z-20 object-cover"
              data-testid="hero-image"
            />
          </div>
        </div>

        {/* Badge — positioned at column boundary */}
        <div
          className="absolute top-[250px] z-40 ml-4 md:left-[calc(50%+30px)] md:top-24 md:ml-0 md:-translate-x-1/2 desktop:top-36"
          data-testid="hero-discover-badge"
        >
          <Image
            src="/images/badge.png"
            alt="badge"
            width={175}
            height={175}
            className="h-[116px] w-[116px] object-cover md:h-32 md:w-32 desktop:h-[175px] desktop:w-[175px]"
          />
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
      <section data-testid="feature-cards-section" className="my-2 grid grid-cols-2 gap-[10px] border border-[#262626] bg-zinc-950 p-[10px] outline outline-8 outline-[#141414] md:grid-cols-4 desktop:gap-5 desktop:p-5">
        {DEFAULT_FEATURES.map((feature) => (
          <div
            key={feature.title}
            data-testid={`feature-card-${feature.title.toLowerCase().replace(/\s+/g, "-")}-skeleton`}
            className="flex flex-col items-center gap-5 rounded-xl border border-[#262626] bg-[#141414] px-4 py-[30px] text-center desktop:px-5 desktop:py-10"
          >
            <div className="h-[60px] w-[60px] animate-pulse rounded-full bg-zinc-800" />
            <div className="h-5 w-32 animate-pulse rounded bg-zinc-800" />
          </div>
        ))}
      </section>
    );
  }

  const displayFeatures = features ?? DEFAULT_FEATURES;

  return (
    <section
      aria-label="Feature cards"
      data-testid="feature-cards-section"
      className="my-2 grid grid-cols-2 gap-[10px] border border-[#262626] bg-zinc-950 p-[10px] outline outline-8 outline-[#141414] md:grid-cols-4 desktop:gap-5 desktop:p-5"
    >
      {displayFeatures.map((feature) => {
        const Icon = FEATURE_ICONS[feature.title] ?? Home;
        return (
          <a
            key={feature.title}
            data-testid={`feature-card-${feature.title.toLowerCase().replace(/\s+/g, "-")}`}
            className="group relative flex cursor-pointer items-center justify-center rounded-xl border border-[#262626] bg-[#141414] px-4 py-[30px] text-center transition-colors hover:bg-[#1e1e1e] focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-zinc-950 desktop:px-5 desktop:py-10"
          >
            <div className="flex flex-col items-center gap-5">
              <div className="relative flex h-[60px] w-[60px] items-center justify-center rounded-full border border-violet-500/40 bg-zinc-900 desktop:h-[82px] desktop:w-[82px]">
                <Icon className="h-6 w-6 text-violet-400 desktop:h-8 desktop:w-8" aria-hidden="true" />
                <ArrowUpRight className="absolute right-0 top-0 h-4 w-4 -translate-y-1/2 translate-x-1/2 text-zinc-500 transition-colors group-hover:text-white" />
              </div>
              <span className="text-sm font-medium text-white md:text-base">{feature.title}</span>
            </div>
          </a>
        );
      })}
    </section>
  );
}

export { Loader2 };
