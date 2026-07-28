import type { ClientTestimonial } from "@/lib/types/our-clients";

interface ClientCardProps {
  client: ClientTestimonial;
}

export function ClientCard({ client }: ClientCardProps) {
  return (
    <article
      data-testid={`client-card-${client.company.toLowerCase().replace(/\s+/g, "-")}`}
      className="relative rounded-xl bg-zinc-900 p-6 shadow-lg md:p-8"
    >
      {/* Since Label */}
      <p
        data-testid="client-since"
        className="text-sm text-zinc-400 md:text-base"
      >
        {client.since}
      </p>

      {/* Company Name and Website Button Row */}
      <div className="mt-4 flex items-start justify-between gap-4">
        <h3
          data-testid="client-company"
          className="text-xl font-semibold text-white md:text-2xl lg:text-3xl"
        >
          {client.company}
        </h3>
        <a
          href={client.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${client.company} website`}
          data-testid="client-website-button"
          className="shrink-0 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          Visit Website
        </a>
      </div>

      {/* Domain and Category Meta Row */}
      <div
        data-testid="client-meta"
        className="mt-6 flex items-center gap-4 border-t border-zinc-800 pt-4"
      >
        <div className="flex-1">
          <p className="text-xs text-zinc-500 md:text-sm">Domain</p>
          <p
            data-testid="client-domain"
            className="mt-1 text-sm text-white md:text-base"
          >
            {client.domain}
          </p>
        </div>
        <div className="h-10 w-px bg-zinc-700" aria-hidden="true" />
        <div className="flex-1">
          <p className="text-xs text-zinc-500 md:text-sm">Category</p>
          <p
            data-testid="client-category"
            className="mt-1 text-sm text-white md:text-base"
          >
            {client.category}
          </p>
        </div>
      </div>

      {/* Quote Block */}
      <div className="mt-6 rounded-lg bg-zinc-800/50 p-4 md:p-5">
        <p className="text-sm font-medium text-zinc-400">What They Said 🤗</p>
        <blockquote
          data-testid="client-quote"
          className="mt-2 text-sm leading-relaxed text-white md:text-base"
        >
          &ldquo;{client.quote}&rdquo;
        </blockquote>
      </div>
    </article>
  );
}
