import Link from "next/link";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <header className="sticky top-0 z-50 w-full border-b border-zinc-900/40 bg-zinc-950/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-[1920px] items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-bold text-white tracking-wider hover:opacity-90">
                ESTATEIN
              </Link>
              <nav className="flex items-center gap-6">
                <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                  Home
                </Link>
                <Link href="/properties" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                  Properties
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
