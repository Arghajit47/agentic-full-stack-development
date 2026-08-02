const sections = [
  {
    testId: "terms-section-acceptance",
    heading: "Acceptance of Terms",
    body: "By accessing or using Estatein, you confirm that you are at least 18 years old and capable of entering into a binding agreement. If you do not agree to these terms, please do not use our services.",
  },
  {
    testId: "terms-section-services",
    heading: "Our Services",
    body: "Estatein provides a platform to discover, list, and inquire about real estate properties. We do not guarantee the accuracy of third-party listings and recommend verifying all property details independently.",
  },
  {
    testId: "terms-section-user-conduct",
    heading: "User Conduct",
    body: "You agree to use Estatein only for lawful purposes. You must not post misleading information, harass other users, attempt to breach our systems, or use automated tools to scrape data without permission.",
  },
  {
    testId: "terms-section-data",
    heading: "Privacy and Data",
    body: "Information you submit through our forms is handled in accordance with our Privacy Policy. We take reasonable measures to protect your data but cannot guarantee absolute security.",
  },
  {
    testId: "terms-section-liability",
    heading: "Limitation of Liability",
    body: 'Estatein is provided "as is" without warranties of any kind. We are not liable for any direct, indirect, or consequential damages arising from your use of the platform.',
  },
  {
    testId: "terms-section-changes",
    heading: "Changes to These Terms",
    body: "We may update these Terms of Use from time to time. Continued use of the platform after changes constitutes acceptance of the revised terms.",
  },
  {
    testId: "terms-section-contact",
    heading: "Contact Us",
    body: null,
  },
];

export default function TermsPage() {
  return (
    <main data-testid="terms-page" className="flex min-h-screen flex-col bg-[#0A0A0A] text-zinc-100">
      {/* Header */}
      <section
        data-testid="terms-header"
        className="relative overflow-hidden bg-[#141414] px-4 pb-12 pt-20 sm:px-6 sm:pb-16 sm:pt-24 lg:px-8 lg:pb-20 lg:pt-28"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, transparent 0, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
          }}
        />
        <div className="relative mx-auto max-w-7xl">
          {/* Eyebrow pill */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#262626] px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-[#703BF7]" aria-hidden="true" />
            <span className="text-sm font-medium text-zinc-300">Legal</span>
          </div>

          <h1
            data-testid="terms-heading"
            className="font-sans font-semibold tracking-tight text-white text-[30px] sm:text-[36px] lg:text-[42px] xl:text-[48px]"
          >
            Terms of Use
          </h1>
          <p
            data-testid="terms-subheading"
            className="mt-4 max-w-[800px] text-base leading-relaxed text-[#A1A1AA] sm:text-lg"
          >
            Welcome to Estatein. These Terms of Use govern your access to and use of our
            website, services, and platform. By using Estatein, you agree to these terms.
            Please read them carefully.
          </p>
        </div>
      </section>

      {/* Content */}
      <section
        data-testid="terms-content"
        className="flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
      >
        <div className="mx-auto max-w-4xl space-y-6">
          {sections.map((sec) => (
            <div
              key={sec.testId}
              data-testid={sec.testId}
              className="rounded-2xl border border-[#262626] bg-[#141414] p-5 sm:rounded-2xl sm:p-8"
            >
              <h2 className="text-xl font-semibold text-white sm:text-2xl">{sec.heading}</h2>
              {sec.body ? (
                <p className="mt-3 leading-[1.7] text-[#A1A1AA]">{sec.body}</p>
              ) : (
                <p className="mt-3 leading-[1.7] text-[#A1A1AA]">
                  If you have any questions about these Terms of Use, please contact us at{" "}
                  <a href="mailto:info@estatein.com" className="text-violet-400 hover:underline">
                    info@estatein.com
                  </a>
                  .
                </p>
              )}
            </div>
          ))}

          <p className="pt-4 text-sm text-[#52525B]" data-testid="terms-last-updated">
            Last updated: August 2026
          </p>
        </div>
      </section>
    </main>
  );
}
