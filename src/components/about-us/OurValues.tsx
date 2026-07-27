"use client";

import { getIcon } from "@/lib/icon-map";

const VALUES = [
  {
    title: "Trust",
    icon: "ShieldCheck",
    description: "Trust is the cornerstone of every successful real estate transaction.",
  },
  {
    title: "Excellence",
    icon: "Award",
    description: "We set the bar high for ourselves. From the properties we list to the services we provide.",
  },
  {
    title: "Client-Centric",
    icon: "HeartHandshake",
    description: "Your dreams and needs are at the center of our universe. We listen, understand.",
  },
  {
    title: "Our Commitment",
    icon: "BadgeCheck",
    description: "We are dedicated to providing you with the highest level of service, professionalism and support.",
  },
];

export function OurValues() {
  return (
    <section aria-labelledby="our-values-heading" className="bg-zinc-950">
      <div className="mx-auto max-w-[1920px] px-4 py-12 md:px-6 md:py-16 lg:px-8 lg:py-20 xl:px-12">
        <div className="max-w-4xl">
          <h2
            id="our-values-heading"
            data-testid="our-values-heading"
            className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl"
          >
            Our Values
          </h2>
          <p
            data-testid="our-values-body"
            className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base"
          >
            Our story is one of continuous growth and evolution. We started as a small team with big dreams, determined to create a real estate platform that transcended the ordinary.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:mt-10 md:grid-cols-2 md:gap-5 lg:gap-6">
          {VALUES.map((value) => {
            const Icon = getIcon(value.icon);
            return (
              <div
                key={value.title}
                data-testid={`our-values-card-${value.title.toLowerCase().replace(/\s+/g, "-")}`}
                className="flex flex-col rounded-2xl bg-[#1a1a1a] border border-zinc-800/50 px-5 py-6 transition-colors hover:bg-[#222222] md:px-6 md:py-7"
              >
                <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-violet-500/40 bg-zinc-900 md:h-14 md:w-14">
                  <Icon className="h-5 w-5 text-violet-400 md:h-6 md:w-6" aria-hidden="true" />
                </div>
                <h3 className="text-base font-medium text-white md:text-lg">{value.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
