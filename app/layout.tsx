import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Roboto } from "next/font/google";
import { ChevronDown, Heart, Search } from "lucide-react";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { disclaimer, siteName, siteUrl, websiteSchema } from "@/lib/seo";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
  weight: ["300", "400", "500", "700", "900"],
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

const hintMenu = [
  { href: "/hints/connections", label: "Connections Hints" },
  { href: "/hints/wordle", label: "Wordle Hints" },
  { href: "/hints/spelling-bee", label: "Spelling Bee Hints" },
  { href: "/hints/letter-boxed", label: "Letter Boxed Hints" },
  { href: "/hints/strands", label: "Strands Hints" },
  { href: "/hints/crossword", label: "Crossword Hints" },
  { href: "/hints/mini-crossword", label: "Mini Crossword Hints" },
  { href: "/hints/connections-sports-edition", label: "Connections: Sports Edition Hints" },
  { href: "/hints/pips", label: "Pips Hints" },
];

const wordleLengthMenu = Array.from({ length: 10 }, (_, index) => {
  const length = index + 3;
  return {
    href: `/${length}-letter-wordle-solver`,
    label: `${length} Letter Wordle Solver`,
  };
});

const puzzleSolverMenu = [
  { href: "/wordle-solver", label: "Wordle Solver" },
  { href: "/spelling-bee-solver", label: "Spelling Bee Solver" },
  { href: "/letter-box-solver", label: "Letter Boxed Solver" },
  { href: "/scrabble-solver", label: "Scrabble Solver" },
  { href: "/scrabble-word-finder", label: "Scrabble Word Finder" },
  { href: "/word-unscrambler", label: "Word Unscrambler" },
  { href: "/anagram-solver", label: "Anagram Solver" },
  { href: "/quordle-solver", label: "Quordle Solver" },
  { href: "/crossword-solver", label: "Crossword Solver" },
  { href: "/words-with-friends-solver", label: "Words With Friends Solver" },
  { href: "/jumble-solver", label: "Jumble Solver" },
];

function BrandLogo() {
  return (
    <span className="inline-flex">
      <Image
        src="/strandshint_logo.png"
        alt="Strands Hint"
        width={221}
        height={36}
        priority
        unoptimized
        className="h-8 w-auto"
      />
    </span>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} bg-[#F8F5EF] font-sans text-[#20201E] antialiased`}
      >
        <GoogleAnalytics />
        <JsonLd data={websiteSchema()} />
        <header className="sticky top-0 z-30 border-b border-[#E5DED3] bg-[#FFFDF9]/95 shadow-sm shadow-[#315C4C]/5 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
            <Link prefetch={false} href="/" className="flex items-center gap-3" aria-label="Strands Hint home">
              <BrandLogo />
            </Link>
            <nav className="flex flex-wrap gap-2 text-sm lg:items-center">
              <Link prefetch={false}
                href="/todays-strands-answer"
                className="inline-flex items-center gap-1 rounded-full px-3 py-2 font-black text-[#24333A] hover:bg-[#EDE6DC] hover:text-[#008F83]"
              >
                Today&apos;s Answers
              </Link>

              <div className="group relative">
                <button type="button" className="inline-flex cursor-default items-center gap-1 rounded-full px-3 py-2 font-black text-[#24333A] hover:bg-[#EDE6DC] hover:text-[#008F83] focus-visible:bg-[#EDE6DC] focus-visible:text-[#008F83] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#008F83]/20">
                  Daily Game Hints
                  <ChevronDown className="h-3.5 w-3.5 transition group-hover:rotate-180 group-focus-within:rotate-180" />
                </button>
                <div className="absolute left-0 top-full z-40 hidden max-h-[70vh] w-80 overflow-y-auto rounded-xl border border-[#E5DED3] bg-[#FFFDF9] p-2 shadow-xl shadow-[#315C4C]/10 group-hover:block group-focus-within:block">
                  {hintMenu.map((item) => (
                    <Link prefetch={false}
                      key={item.href}
                      href={item.href}
                      className="block rounded-lg px-3 py-2.5 font-bold text-[#24333A] hover:bg-[#EDE6DC] hover:text-[#008F83]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="group relative">
                <button type="button" className="inline-flex cursor-default items-center gap-1 rounded-full px-3 py-2 font-black text-[#24333A] hover:bg-[#EDE6DC] hover:text-[#008F83] focus-visible:bg-[#EDE6DC] focus-visible:text-[#008F83] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#008F83]/20">
                  Word Solvers
                  <ChevronDown className="h-3.5 w-3.5 transition group-hover:rotate-180 group-focus-within:rotate-180" />
                </button>
                <div className="absolute left-0 top-full z-40 hidden max-h-[70vh] w-72 overflow-y-auto rounded-xl border border-[#E5DED3] bg-[#FFFDF9] p-2 shadow-xl shadow-[#315C4C]/10 group-hover:block group-focus-within:block">
                  {wordleLengthMenu.map((item) => (
                    <Link prefetch={false}
                      key={item.href}
                      href={item.href}
                      className="block rounded-lg px-3 py-2.5 font-bold text-[#24333A] hover:bg-[#EDE6DC] hover:text-[#008F83]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="group relative">
                <button type="button" className="inline-flex cursor-default items-center gap-1 rounded-full px-3 py-2 font-black text-[#24333A] hover:bg-[#EDE6DC] hover:text-[#008F83] focus-visible:bg-[#EDE6DC] focus-visible:text-[#008F83] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#008F83]/20">
                  Puzzle Solver
                  <ChevronDown className="h-3.5 w-3.5 transition group-hover:rotate-180 group-focus-within:rotate-180" />
                </button>
                <div className="absolute left-0 top-full z-40 hidden max-h-[70vh] w-80 overflow-y-auto rounded-xl border border-[#E5DED3] bg-[#FFFDF9] p-2 shadow-xl shadow-[#315C4C]/10 group-hover:block group-focus-within:block">
                  {puzzleSolverMenu.map((item) => (
                    <Link prefetch={false}
                      key={`${item.href}-${item.label}`}
                      href={item.href}
                      className="block rounded-lg px-3 py-2.5 font-bold text-[#24333A] hover:bg-[#EDE6DC] hover:text-[#008F83]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <Link prefetch={false}
                href="/all-solvers"
                className="ml-0 grid h-11 w-11 place-items-center rounded-lg bg-[#008F83] text-white shadow-sm shadow-[#008F83]/20 hover:bg-[#00766D] lg:ml-3"
                aria-label="Search word solvers"
              >
                <Search className="h-4 w-4" />
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
        <footer className="mx-[calc(50%-50vw)] bg-[#062D38] text-sm text-[#B9D5D3]">
          <div className="relative mx-auto max-w-6xl overflow-hidden px-4 py-14">
            <div className="pointer-events-none absolute -right-12 top-12 h-40 w-40 rounded-full border border-[#008F83]/40" />
            <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <Link prefetch={false} href="/" className="flex items-center gap-2" aria-label="Strands Hint home">
                <BrandLogo />
              </Link>
              <p className="mt-5 max-w-xs leading-6">
                Your spoiler-safe home for daily puzzle hints, answer reveals, and practical word
                solver tools.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#1D6670] px-4 py-3 text-xs font-bold text-[#E7FFFA]">
                Made for puzzle lovers around the world
                <Heart className="h-4 w-4 fill-[#E0544F] text-[#E0544F]" />
              </div>
            </div>
            <div>
              <h2 className="font-black text-white">Hint Categories</h2>
              <nav className="mt-3 grid gap-2">
                <Link prefetch={false} href="/today/strands-hints" className="hover:text-white">Today&apos;s Strands Hint</Link>
                <Link prefetch={false} href="/today/connections-hints" className="hover:text-white">Connections Hints</Link>
                <Link prefetch={false} href="/today/wordle-hints" className="hover:text-white">Wordle Hint</Link>
                <Link prefetch={false} href="/hints/spelling-bee" className="hover:text-white">Spelling Bee Hint</Link>
                <Link prefetch={false} href="/daily-hints" className="hover:text-white">All Puzzle Hints</Link>
              </nav>
            </div>
            <div>
              <h2 className="font-black text-white">Solver Tools</h2>
              <nav className="mt-3 grid gap-2">
                <Link prefetch={false} href="/anagram-solver" className="hover:text-white">Anagram Solver</Link>
                <Link prefetch={false} href="/word-unscrambler" className="hover:text-white">Word Unscrambler</Link>
                <Link prefetch={false} href="/wordle-solver" className="hover:text-white">Wordle Solver</Link>
                <Link prefetch={false} href="/strands-solver" className="hover:text-white">Strands Solver</Link>
                <Link prefetch={false} href="/all-solvers" className="hover:text-white">All Word Solvers</Link>
              </nav>
            </div>
            <div>
              <h2 className="font-black text-white">Resources</h2>
              <nav className="mt-3 grid gap-2">
                <Link prefetch={false} href="/#faq" className="hover:text-white">About Us</Link>
                <Link prefetch={false} href="/strands-hints" className="hover:text-white">How It Works</Link>
                <Link prefetch={false} href="/archive" className="hover:text-white">Archive</Link>
                <Link prefetch={false} href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
                <Link prefetch={false} href="/terms-of-use" className="hover:text-white">Terms of Use</Link>
                <Link prefetch={false} href="/sitemap/" className="hover:text-white">Sitemap</Link>
              </nav>
            </div>
          </div>
            <div className="mt-12 border-t border-[#1D6670]/70 pt-8 text-xs">
              <p className="leading-6">{disclaimer}</p>
              <div className="mt-6 flex flex-col gap-3 text-[#B9D5D3] sm:flex-row sm:items-center sm:justify-between">
                <p>(c) 2026 Strands Hint. All rights reserved.</p>
                <p>Built with care for puzzle solvers.</p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
