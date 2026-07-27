import type { HowItWorksStep } from "@/lib/types/about-us";

interface StepCardProps {
  step: HowItWorksStep;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function StepCard({ step }: StepCardProps) {
  return (
    <li
      data-testid={`step-card-${slugify(step.stepNumber)}`}
      className="flex h-full flex-col border-l border-[#703BF7]"
    >
      <p className="px-4 py-4 text-base font-medium text-white md:px-5 md:text-lg">
        {step.stepNumber}
      </p>
      <div className="flex flex-1 flex-col rounded-br-xl border border-zinc-800/60 border-l-0 bg-gradient-to-br from-[#1e182c] via-[#141414] to-[#141414] px-5 py-6 transition-colors duration-200 hover:border-zinc-700 md:px-6 md:py-7">
        <h3 className="text-base font-semibold text-white md:text-lg lg:text-xl">
          {step.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400 md:text-base">
          {step.description}
        </p>
      </div>
    </li>
  );
}
