import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Estatein — Find Your Dream Home",
  description: "Discover featured properties and read client testimonials on Estatein.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${urbanist.variable} h-full antialiased`}
    >
      <body className={`${urbanist.variable} min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans`}>
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
