import { StepCard } from "./StepCard";
import type { HowItWorksContent } from "@/lib/types/about-us";

interface HowItWorksProps {
  data: HowItWorksContent;
}

export function HowItWorks({ data }: HowItWorksProps) {
  return (
    <section
      aria-labelledby="how-it-works-heading"
      data-testid="how-it-works-section"
      className="bg-zinc-950"
    >
      <div className="mx-auto max-w-[1920px] px-4 py-12 md:px-6 md:py-16 lg:px-8 lg:py-20 xl:px-12">
        <div className="max-w-4xl">
          <h2
            id="how-it-works-heading"
            data-testid="how-it-works-heading"
            className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl"
          >
            {data.heading}
          </h2>
          <p
            data-testid="how-it-works-body"
            className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base"
          >
            {data.body}
          </p>
        </div>

        <ul
          data-testid="how-it-works-grid"
          className="mt-10 grid list-none grid-cols-1 gap-5 md:mt-12 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12 xl:gap-x-8"
        >
          {data.steps.map((step) => (
            <StepCard key={step.stepNumber} step={step} />
          ))}
        </ul>
      </div>
    </section>
  );
}
