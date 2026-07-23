"use client";

import Image from "next/image";
import { Home, TrendingUp, Building2, Lightbulb, ArrowUpRight } from "lucide-react";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop";

const features = [
  {
    title: "Find Your Dream Home",
    icon: Home,
    href: "#find-home",
  },
  {
    title: "Unlock Property Value",
    icon: TrendingUp,
    href: "#unlock-value",
  },
  {
    title: "Effortless Property Management",
    icon: Building2,
    href: "#management",
  },
  {
    title: "Smart Investments. Informed Decisions",
    icon: Lightbulb,
    href: "#investments",
  },
];

const stats = [
  { value: "200+", label: "Happy Customers" },
  { value: "10k+", label: "Properties For Clients" },
  { value: "16+", label: "Years of Experience" },
];

function DiscoverBadge() {
  const text = "Discover Your Dream Property · ";
  const chars = text.split("");
  const radius = 48;
  // ponytail: radius drives the circular path; angle math unused because textPath handles layout
  void chars;

  return (
    <div
      className="relative flex h-28 w-28 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/90 md:h-32 md:w-32"
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
        <text fill="#a1a1aa" fontSize="10" letterSpacing="2">
          <textPath href="#circlePath" startOffset="0%">
            {text.repeat(2)}
          </textPath>
        </text>
      </svg>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 md:h-12 md:w-12">
        <ArrowUpRight className="h-5 w-5 text-white md:h-6 md:w-6" />
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" data-testid="hero-section" className="bg-black">
      <div className="mx-auto grid max-w-[1920px] items-center gap-8 px-4 py-12 md:grid-cols-2 md:gap-6 md:px-6 md:py-16 lg:px-8 lg:py-20 xl:px-12">
        {/* Text column */}
        <div className="order-2 flex flex-col items-center text-center md:order-1 md:items-start md:text-left">
          <h1
            id="hero-heading"
            data-testid="hero-heading"
            className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl md:text-[42px] lg:text-5xl"
          >
            Discover Your Dream Property with Estatein
          </h1>
          <p
            data-testid="hero-subheading"
            className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base md:mt-5"
          >
            Your journey to finding the perfect property begins here. Explore our listings to find
            the home that matches your dreams.
          </p>

          <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row md:mt-8 md:gap-4">
            <a
              href="/properties"
              data-testid="hero-browse-properties"
              className="inline-flex items-center justify-center rounded-xl bg-[#703BF7] px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-black"
            >
              Browse Properties
            </a>
            <a
              href="#learn-more"
              data-testid="hero-learn-more"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-950 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:border-zinc-500 hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-black"
            >
              Learn More
            </a>
          </div>

          <div className="mt-8 grid w-full grid-cols-2 gap-3 md:mt-10 md:grid-cols-3 lg:gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                data-testid={`hero-stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="flex flex-col items-center rounded-xl bg-[#1a1a1a] px-4 py-4 text-center md:items-start md:px-5 md:py-5 md:text-left"
              >
                <span className="text-2xl font-semibold text-white md:text-3xl">{stat.value}</span>
                <span className="mt-1 text-sm text-zinc-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Image column */}
        <div className="relative order-1 flex items-center justify-center md:order-2 md:justify-end">
          <div className="relative aspect-[4/3] w-full max-w-xl md:aspect-square md:max-w-none lg:max-w-2xl">
            <Image
              src={HERO_IMAGE}
              alt="Modern blue glass skyscrapers"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="rounded-2xl object-cover"
              data-testid="hero-image"
            />
          </div>
          <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 lg:bottom-12 lg:left-12">
            <DiscoverBadge />
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeatureCards() {
  return (
    <section aria-label="Feature cards" data-testid="feature-cards-section" className="bg-zinc-950">
      <div className="mx-auto grid max-w-[1920px] grid-cols-2 gap-3 px-4 pb-12 sm:gap-4 md:grid-cols-4 md:gap-5 md:px-6 md:pb-16 lg:px-8 lg:pb-20 xl:gap-6 xl:px-12">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <a
              key={feature.title}
              href={feature.href}
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
