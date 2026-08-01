"use client";

import type { AboutUsAchievements } from "@/lib/schemas";

interface OurAchievementsProps {
  data: AboutUsAchievements;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function OurAchievements({ data }: OurAchievementsProps) {
  return (
    <section aria-labelledby="our-achievements-heading" className="bg-zinc-950">
      <div className="mx-auto max-w-[1920px] px-4 py-12 md:px-6 md:py-16 lg:px-8 lg:py-20 xl:px-12">
        <div className="max-w-4xl">
          <h2
            id="our-achievements-heading"
            data-testid="our-achievements-heading"
            className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl"
          >
            {data.heading}
          </h2>
          <p
            data-testid="our-achievements-body"
            className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base"
          >
            {data.body}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:mt-10 md:grid-cols-3 md:gap-5 lg:gap-6">
          {data.cards.map((achievement) => (
            <div
              key={achievement.title}
              data-testid={`our-achievements-card-${slugify(achievement.title)}`}
              className="flex flex-col rounded-2xl bg-[#1a1a1a] px-5 py-6 transition-colors hover:bg-[#222222] md:px-6 md:py-7"
            >
              <h3 className="text-base font-medium text-white md:text-lg">{achievement.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
