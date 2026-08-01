import Image from "next/image";
import type { TeamMemberData } from "@/lib/types/about-us";

interface TeamMemberProps {
  member: TeamMemberData;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M23 4.937a9.03 9.03 0 0 1-2.593.712 4.53 4.53 0 0 0 1.985-2.499 9.05 9.05 0 0 1-2.867 1.096A4.515 4.515 0 0 0 11.73 8.36 12.82 12.82 0 0 1 2.427 3.64a4.515 4.515 0 0 0 1.397 6.025 4.49 4.49 0 0 1-2.045-.565v.057a4.516 4.516 0 0 0 3.622 4.425 4.52 4.52 0 0 1-2.04.078 4.517 4.517 0 0 0 4.217 3.134 9.055 9.055 0 0 1-5.604 1.932c-.36 0-.717-.021-1.074-.062a12.78 12.78 0 0 0 6.92 2.028c8.3 0 12.84-6.876 12.84-12.84 0-.195-.005-.39-.014-.583A9.172 9.172 0 0 0 23 4.937Z" />
    </svg>
  );
}

export function TeamMember({ member }: TeamMemberProps) {
  return (
    <li
      data-testid={`team-member-${slugify(member.name)}`}
      className="flex h-full flex-col rounded-xl bg-[#1a1a1a] p-4 md:p-5"
    >
      <div className="relative">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg sm:aspect-square md:aspect-[4/5]">
          <Image
            src={member.imageUrl}
            alt={`Portrait of ${member.name}, ${member.role}`}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-top"
            data-testid={`team-member-image-${slugify(member.name)}`}
          />
        </div>
        <a
          href={member.twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${member.name} on Twitter`}
          data-testid={`team-member-twitter-${slugify(member.name)}`}
          className="absolute -bottom-5 left-1/2 flex h-10 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-[#703BF7] text-white transition-colors duration-200 hover:bg-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
        >
          <TwitterIcon className="h-4 w-4" />
        </a>
      </div>
      <div className="mt-8 pb-1 text-center">
        <h3 className="text-base font-semibold text-white">
          {member.name}
        </h3>
        <p className="mt-1 text-sm text-[#8C8C8C]">{member.role}</p>
      </div>
    </li>
  );
}
