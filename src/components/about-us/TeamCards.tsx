import { TeamMember } from "./TeamMember";
import type { TeamContent } from "@/lib/types/about-us";

interface TeamCardsProps {
  data: TeamContent;
}

export function TeamCards({ data }: TeamCardsProps) {
  return (
    <section
      aria-labelledby="team-heading"
      data-testid="team-section"
      className="bg-zinc-950"
    >
      <div className="mx-auto max-w-[1920px] px-4 py-12 md:px-6 md:py-16 lg:px-8 lg:py-20 xl:px-12">
        <div className="max-w-4xl">
          <h2
            id="team-heading"
            data-testid="team-heading"
            className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl"
          >
            {data.heading}
          </h2>
          <p
            data-testid="team-body"
            className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base"
          >
            {data.body}
          </p>
        </div>

        <ul
          data-testid="team-grid"
          className="mt-10 grid list-none grid-cols-1 gap-6 sm:grid-cols-2 md:mt-12 lg:grid-cols-4 lg:gap-5 xl:gap-6 2xl:gap-8"
        >
          {data.members.map((member) => (
            <TeamMember key={member.name} member={member} />
          ))}
        </ul>
      </div>
    </section>
  );
}
