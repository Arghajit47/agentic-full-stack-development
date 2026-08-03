"use client";

import Image from "next/image";
import { getIcon } from "@/lib/icon-map";
import type { AboutUsJourney } from "@/lib/schemas";

interface OurJourneyProps {
  data: AboutUsJourney;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function OurJourney({ data }: OurJourneyProps) {
  const Icon = getIcon(data.stats[0]?.icon ?? "Home");

  return (
    <section aria-labelledby="our-journey-heading" className="bg-zinc-950">
      <div className="mx-auto grid max-w-[1920px] items-center gap-8 px-4 py-12 md:grid-cols-2 md:gap-6 md:px-6 md:py-16 lg:px-8 lg:py-20 xl:px-12">
        <div className="order-2 flex flex-col md:order-1">
          <h2
            id="our-journey-heading"
            data-testid="our-journey-heading"
            className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl"
          >
            {data.heading}
          </h2>
          <p
            data-testid="our-journey-body"
            className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base"
          >
            {data.body}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 md:mt-10 md:grid-cols-3 lg:gap-4">
            {data.stats.map((stat) => (
              <div
                key={stat.label}
                data-testid={`our-journey-stat-${slugify(stat.label)}`}
                className="flex flex-col rounded-xl bg-[#1a1a1a] px-4 py-4 md:px-5 md:py-5"
              >
                <Icon className="mb-3 h-5 w-5 text-violet-400 md:h-6 md:w-6" aria-hidden="true" />
                <span className="text-2xl font-semibold text-white md:text-3xl">{stat.value}</span>
                <span className="mt-1 text-sm text-zinc-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative order-1 md:order-2 flex items-center justify-center">
          <Image
            src={data.imageUrl}
            alt={data.heading}
            width={680}
            height={540}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="w-full max-w-[680px] object-contain"
            data-testid="our-journey-image"
          />
        </div>
      </div>
    </section>
  );
}
