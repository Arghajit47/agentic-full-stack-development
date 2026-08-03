import Link from "next/link";

export default function LearnMorePage() {
  return (
    <main data-testid="learn-more-page" className="bg-[#0A0A0A] min-h-screen">
      {/* SECTION 1 — Header */}
      <section data-testid="learn-more-header" className="bg-[#141414] py-16 md:py-20 lg:py-24 px-4 md:px-8 lg:px-16 xl:px-24 text-center">
        {/* Eyebrow pill */}
        <div data-testid="learn-more-eyebrow" className="inline-flex items-center gap-2 border border-[#262626] rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#703BF7] inline-block" />
          <span className="text-sm text-[#A1A1AA]">Discover</span>
        </div>
        {/* H1 */}
        <h1 data-testid="learn-more-title" className="text-[30px] md:text-[36px] lg:text-[42px] xl:text-[48px] font-semibold text-white mb-6 leading-tight">
          Learn More About Estatein
        </h1>
        {/* Subtitle */}
        <p data-testid="learn-more-subtitle" className="max-w-[800px] mx-auto text-[#A1A1AA] leading-relaxed text-sm md:text-base">
          Your trusted partner in finding the perfect property. We combine deep market expertise with a personalized approach to make every real estate journey smooth and successful.
        </p>
      </section>

      {/* SECTION 2 — Who We Are */}
      <section data-testid="learn-more-who-we-are" className="py-12 md:py-16 px-4 md:px-8 lg:px-16 xl:px-24 text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-4">Who We Are</h2>
        <p className="max-w-3xl mx-auto text-[#A1A1AA] text-base leading-relaxed">
          Estatein is a modern real estate platform connecting buyers, sellers, and investors with premium properties. From dream homes to strategic investments, we provide the tools, insights, and support you need.
        </p>
      </section>

      {/* SECTION 3 — Stats Row */}
      <section className="bg-[#141414] py-12 md:py-16 px-4 md:px-8 lg:px-16 xl:px-24">
        <div data-testid="learn-more-stats" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {[
            { value: "200+", label: "Happy Customers", testId: "stat-card-0" },
            { value: "10k+", label: "Properties For Clients", testId: "stat-card-1" },
            { value: "16+", label: "Years of Experience", testId: "stat-card-2" },
          ].map((stat) => (
            <div key={stat.testId} data-testid={stat.testId} className="bg-[#141414] border border-[#262626] rounded-xl p-6 md:p-8 text-center">
              <p className="text-3xl md:text-4xl font-bold text-[#703BF7]">{stat.value}</p>
              <p className="text-white text-sm md:text-base mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4 — Info Cards */}
      <section data-testid="learn-more-info-cards" className="py-12 md:py-16 px-4 md:px-8 lg:px-16 xl:px-24">
        <div className="flex flex-col gap-4 max-w-5xl mx-auto">
          {[
            { title: "Our Services", desc: "From property search and listing to investment consulting — we cover every step of your real estate journey.", testId: "info-card-0" },
            { title: "Why Choose Estatein", desc: "Deep market expertise, transparent pricing, and a dedicated team committed to your success.", testId: "info-card-1" },
            { title: "How It Works", desc: "Browse listings, connect with agents, schedule viewings, and close deals — all on one platform.", testId: "info-card-2" },
          ].map((card) => (
            <div key={card.testId} data-testid={card.testId} className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-semibold text-white">{card.title}</h3>
              <p className="mt-2 text-[#A1A1AA] text-sm md:text-base leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5 — CTA */}
      <section data-testid="learn-more-cta" className="py-12 md:py-16 text-center">
        <Link
          href="/properties"
          data-testid="browse-properties-btn"
          className="inline-block bg-[#703BF7] hover:bg-[#5f2fd6] text-white px-8 py-3 rounded-lg text-sm md:text-base font-medium transition-colors duration-150"
        >
          Browse Properties
        </Link>
      </section>

      {/* SECTION 6 — Footer mini */}
      <footer data-testid="learn-more-footer" className="border-t border-[#262626] py-6 text-center">
        <p className="text-sm text-[#52525B]">©2024 Estatein. All Rights Reserved.</p>
      </footer>
    </main>
  );
}
