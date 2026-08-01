"use client";

import { getIcon } from "@/lib/icon-map";
import type { AboutUsValues } from "@/lib/schemas";

interface OurValuesProps {
  data: AboutUsValues;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function OurValues({ data }: OurValuesProps) {
  return (
    <section aria-labelledby="our-values-heading" className="bg-zinc-950">
      <div className="mx-auto max-w-[1920px] px-4 py-12 md:px-6 md:py-16 lg:px-8 lg:py-20 xl:px-12">
        <div className="max-w-4xl">
          <h2
            id="our-values-heading"
            data-testid="our-values-heading"
            className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl"
          >
            {data.heading}
          </h2>
          <p
            data-testid="our-values-body"
            className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base"
          >
            {data.body}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:mt-10 md:grid-cols-2">
          {data.cards.map((value) => {
            const Icon = getIcon(value.icon);
            return (
              <div
                key={value.title}
                data-testid={`our-values-card-${slugify(value.title)}`}
                className="flex flex-col rounded-xl bg-[#1a1a1a] p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#703BF7]">
                    <Icon className="h-5 w-5 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-semibold text-white">{value.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#8C8C8C]">{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
