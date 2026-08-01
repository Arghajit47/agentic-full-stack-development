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
      className="flex h-full flex-col"
    >
      <div className="border-l border-[#703BF7] px-5 py-4">
        <p className="text-base font-medium text-white md:text-lg lg:text-xl">
          {step.stepNumber}
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-4 bg-gradient-to-br from-[#703BF7]/20 via-[#141414] to-[#141414] p-5 md:p-6 lg:gap-5 lg:p-10">
        <h3 className="text-base font-semibold text-white md:text-lg lg:text-2xl">
          {step.title}
        </h3>
        <p className="text-sm leading-relaxed text-zinc-400 md:text-base">
          {step.description}
        </p>
      </div>
    </li>
  );
}
