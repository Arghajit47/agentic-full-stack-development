import { ClientCard } from "./ClientCard";
import type { OurClientsContent } from "@/lib/types/our-clients";

interface OurClientsProps {
  data: OurClientsContent;
}

export function OurClients({ data }: OurClientsProps) {
  return (
    <section
      aria-labelledby="our-clients-heading"
      data-testid="our-clients-section"
      className="bg-zinc-950"
    >
      <div className="mx-auto max-w-[1920px] px-4 py-12 md:px-6 md:py-16 lg:px-8 lg:py-20 xl:px-12">
        <div className="max-w-4xl">
          <h2
            id="our-clients-heading"
            data-testid="our-clients-heading"
            className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl"
          >
            {data.heading}
          </h2>
          <p
            data-testid="our-clients-subheading"
            className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base md:text-lg"
          >
            {data.subheading}
          </p>
        </div>

        <div
          data-testid="our-clients-grid"
          className="mt-10 grid grid-cols-1 gap-6 md:mt-12 lg:grid-cols-2 lg:gap-8 xl:gap-12"
        >
          {data.clients.map((client) => (
            <ClientCard key={client.company} client={client} />
          ))}
        </div>
      </div>
    </section>
  );
}
