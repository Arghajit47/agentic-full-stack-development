export interface CTASectionProps {
  headlineStart?: string;
  headlineAccent?: string;
  body?: string;
  buttonLabel?: string;
  buttonHref?: string;
}

export function CTASection({
  headlineStart = "Start your financial journey with ",
  headlineAccent = "YourBank today!",
  body = "Ready to take control of your finances? Join YourBank now, and let us help you achieve your financial goals with our tailored solutions and exceptional customer service",
  buttonLabel = "Open Account",
  buttonHref = "/",
}: CTASectionProps) {
  return (
    <section
      data-testid="cta-section"
      aria-labelledby="cta-heading"
      className="w-full bg-zinc-950"
    >
      <div className="mx-auto max-w-[1920px] px-4 py-12 md:px-6 md:py-16 lg:px-8 lg:py-20 xl:px-12">
        <div className="relative flex flex-col items-center gap-8 overflow-hidden rounded-2xl bg-[#1A1A1A] px-5 py-10 md:flex-row md:items-center md:justify-between md:px-12 md:py-16 lg:px-16">
          {/*
            TODO: Replace this CSS placeholder with the exported Figma SVG once the
            Local AI Bridge plugin is synced to the correct page.
            curl "http://localhost:47291/api/node/11:89115/svg" --output public/assets/illustrations/abstract_design.svg
            Abstract Design node 11:89115 (desktop 298x283) / 108:2699 (laptop 202x192) / 113:4994 (mobile 151x143)
          */}
          <div
            data-testid="cta-abstract-decoration"
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -top-16 h-72 w-72 opacity-30 md:-left-12 md:-top-12 md:h-80 md:w-80 lg:h-96 lg:w-96"
            style={{
              backgroundImage:
                "radial-gradient(circle at center, #CAFF33 2px, transparent 2.5px)",
              backgroundSize: "18px 18px",
            }}
          />

          <div className="relative z-10 w-full max-w-3xl text-center md:text-left">
            <h2
              id="cta-heading"
              data-testid="cta-heading"
              className="text-2xl font-semibold leading-tight text-white sm:text-3xl md:text-4xl lg:text-[40px] lg:leading-[48px]"
            >
              {headlineStart}
              <span className="text-[#CAFF33]">{headlineAccent}</span>
            </h2>
            <p
              data-testid="cta-body"
              className="mt-3 text-sm leading-relaxed text-[#999999] sm:text-base"
            >
              {body}
            </p>
          </div>

          <a
            href={buttonHref}
            data-testid="cta-button"
            className="relative z-10 inline-flex shrink-0 items-center justify-center rounded-[82px] bg-[#CAFF33] px-8 py-3.5 text-sm font-medium text-[#0a0a0a] transition-all hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-[#CAFF33] focus:ring-offset-2 focus:ring-offset-[#1A1A1A] md:px-10 md:py-4"
          >
            {buttonLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
