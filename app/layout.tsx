import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, IBM_Plex_Mono, Public_Sans } from "next/font/google";
import { Infinity, Search } from "lucide-react";
import "./globals.css";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { disclaimer, siteName, siteUrl } from "@/lib/seo";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-serif", display: "swap" });
const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Strands Hint - Today's Strands Hints, Spangram & Solver",
    template: `%s | ${siteName}`,
  },
  description:
    "Spoiler-safe Strands hints, answer reveals, a local word finder, and a grid solver for puzzle fans.",
  openGraph: { type: "website", locale: "en_US", siteName },
  robots: { index: true, follow: true },
};

const nav = [
  ["/today", "Daily"],
  ["/todays-strands-answer", "Today's Answer"],
  ["/strands-hints", "Hints"],
  ["/strands-solver", "Solver"],
  ["/strands-spangram-helper", "Spangram Helper"],
  ["/strands-word-finder", "Word Finder"],
  ["/archive", "Archive"],
  ["/#faq", "About"],
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${publicSans.variable} ${plexMono.variable} bg-[#12172B] font-sans text-[#F6F1E6] antialiased`}
      >
        <GoogleAnalytics />
        <header className="sticky top-0 z-30 border-b border-[#F3ECDD]/10 bg-[#12172B]/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 lg:flex-row lg:items-center lg:justify-between">
            <Link href="/" className="flex items-center gap-3 text-2xl font-black text-[#F6F1E6]">
              <Infinity className="h-10 w-10 text-[#E8A93D]" />
              <span className="font-serif">
                Strands <span className="text-[#E8A93D]">Hint</span>
              </span>
            </Link>
            <nav className="flex flex-wrap gap-1 text-sm lg:items-center">
              {nav.map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-md px-3 py-2 font-semibold text-[#F6F1E6]/75 hover:bg-[#F3ECDD]/10 hover:text-[#F6F1E6]"
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/strands-solver"
                className="ml-0 inline-flex items-center gap-2 rounded-lg bg-[#E1573F] px-4 py-2 font-bold text-white shadow-lg shadow-[#E1573F]/20 hover:bg-[#f06a52] lg:ml-3"
              >
                <Search className="h-4 w-4" />
                Explore Tools
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
        <footer className="mx-auto max-w-6xl border-t border-[#F3ECDD]/10 px-4 py-10 text-sm text-[#F6F1E6]/65">
          <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <Link href="/" className="flex items-center gap-2 text-2xl font-black text-[#F6F1E6]">
                <Infinity className="h-9 w-9 text-[#E8A93D]" />
                <span className="font-serif">
                  Strands <span className="text-[#E8A93D]">Hint</span>
                </span>
              </Link>
              <p className="mt-4 max-w-xs leading-6">Smart hints. Better solving. More fun.</p>
            </div>
            <div>
              <h2 className="font-black text-[#F6F1E6]">Tools</h2>
              <nav className="mt-3 grid gap-2">
                <Link href="/strands-solver" className="hover:text-[#E8A93D]">Strands Solver</Link>
                <Link href="/strands-spangram-helper" className="hover:text-[#E8A93D]">Spangram Helper</Link>
                <Link href="/strands-word-finder" className="hover:text-[#E8A93D]">Word Finder</Link>
                <Link href="/todays-strands-answer" className="hover:text-[#E8A93D]">Today&apos;s Answer</Link>
                <Link href="/today" className="hover:text-[#E8A93D]">Daily Hints</Link>
              </nav>
            </div>
            <div>
              <h2 className="font-black text-[#F6F1E6]">Resources</h2>
              <nav className="mt-3 grid gap-2">
                <Link href="/strands-hints" className="hover:text-[#E8A93D]">How to Play</Link>
                <Link href="/archive" className="hover:text-[#E8A93D]">Archive</Link>
                <Link href="/#faq" className="hover:text-[#E8A93D]">FAQ</Link>
              </nav>
            </div>
            <div>
              <h2 className="font-black text-[#F6F1E6]">Legal</h2>
              <p className="mt-3 leading-6">{disclaimer}</p>
            </div>
          </div>
          <p className="mt-10 text-center text-xs text-[#F6F1E6]/45">
            © 2026 Strands Hint. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
