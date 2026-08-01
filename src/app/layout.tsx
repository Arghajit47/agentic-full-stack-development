import type { Metadata, Viewport } from "next";
import { Urbanist } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#090909",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://estatein.vercel.app"),
  title: {
    default: "Estatein — Find Your Dream Home",
    template: "%s | Estatein",
  },
  description: "Discover featured properties, investment advisory, and real estate services on Estatein.",
  keywords: ["real estate", "properties", "investment", "home buying", "Estatein"],
  authors: [{ name: "Estatein" }],
  creator: "Estatein",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://estatein.vercel.app",
    siteName: "Estatein",
    title: "Estatein — Find Your Dream Home",
    description: "Discover featured properties, investment advisory, and real estate services on Estatein.",
    images: [{ url: "/favicon.ico", width: 32, height: 32, alt: "Estatein" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Estatein — Find Your Dream Home",
    description: "Discover featured properties, investment advisory, and real estate services on Estatein.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Estatein",
    url: "https://estatein.vercel.app",
    description: "Premium real estate services including property selling, management, and investment advisory.",
  };

  return (
    <html lang="en" className={`${urbanist.variable} h-full antialiased`}>
      <body className={`${urbanist.variable} min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:bg-violet-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
