import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fraunces, IBM_Plex_Mono, Public_Sans } from "next/font/google";
import { Search } from "lucide-react";
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
  twitter: {
    card: "summary",
    title: "Strands Hint - Today's Strands Hints, Spangram & Solver",
    description:
      "Spoiler-safe Strands hints, answer reveals, a local word finder, and a grid solver for puzzle fans.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
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

function BrandLogo() {
  return (
    <span className="inline-flex rounded-xl bg-[#FFFDF9] px-3 py-2 shadow-sm ring-1 ring-[#E5DED3]">
      <Image
        src="/strandshint_logo.png"
        alt="Strands Hint"
        width={221}
        height={36}
        priority
        className="h-8 w-auto"
      />
    </span>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${publicSans.variable} ${plexMono.variable} bg-[#F8F5EF] font-sans text-[#20201E] antialiased`}
      >
        <GoogleAnalytics />
        <header className="sticky top-0 z-30 border-b border-[#E5DED3] bg-[#F8F5EF]/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 lg:flex-row lg:items-center lg:justify-between">
            <Link href="/" className="flex items-center gap-3" aria-label="Strands Hint home">
              <BrandLogo />
            </Link>
            <nav className="flex flex-wrap gap-1 text-sm lg:items-center">
              {nav.map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-md px-3 py-2 font-semibold text-[#68645E] hover:bg-[#EDE6DC] hover:text-[#20201E]"
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/all-solvers"
                className="ml-0 inline-flex items-center gap-2 rounded-lg bg-[#315C4C] px-4 py-2 font-bold text-white shadow-sm hover:bg-[#274B3E] lg:ml-3"
              >
                <Search className="h-4 w-4" />
                Explore Tools
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
        <footer className="mx-auto max-w-6xl border-t border-[#E5DED3] px-4 py-10 text-sm text-[#68645E]">
          <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <Link href="/" className="flex items-center gap-2" aria-label="Strands Hint home">
                <BrandLogo />
              </Link>
              <p className="mt-4 max-w-xs leading-6">Smart hints. Better solving. More fun.</p>
            </div>
            <div>
              <h2 className="font-black text-[#20201E]">Tools</h2>
              <nav className="mt-3 grid gap-2">
                <Link href="/all-solvers" className="hover:text-[#315C4C]">All Solvers</Link>
                <Link href="/solvers/wordle-solver" className="hover:text-[#315C4C]">Wordle Solver</Link>
                <Link href="/solvers/spelling-bee-solver" className="hover:text-[#315C4C]">Spelling Bee Solver</Link>
                <Link href="/solvers/anagram-solver" className="hover:text-[#315C4C]">Anagram Solver</Link>
                <Link href="/strands-solver" className="hover:text-[#315C4C]">Strands Solver</Link>
              </nav>
            </div>
            <div>
              <h2 className="font-black text-[#20201E]">Resources</h2>
              <nav className="mt-3 grid gap-2">
                <Link href="/daily-hints" className="hover:text-[#315C4C]">Daily Hints</Link>
                <Link href="/strands-hints" className="hover:text-[#315C4C]">How to Play</Link>
                <Link href="/archive" className="hover:text-[#315C4C]">Archive</Link>
                <Link href="/#faq" className="hover:text-[#315C4C]">FAQ</Link>
              </nav>
            </div>
            <div>
              <h2 className="font-black text-[#20201E]">Legal</h2>
              <p className="mt-3 leading-6">
                {disclaimer} All trademarks belong to their respective owners. Users should follow
                the original game platforms&apos; terms.
              </p>
            </div>
          </div>
          <p className="mt-10 text-center text-xs text-[#68645E]">
            (c) 2026 Strands Hint. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
