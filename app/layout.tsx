import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Roboto } from "next/font/google";
import { ChevronDown, Heart, Search } from "lucide-react";
import "./globals.css";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { disclaimer, siteName, siteUrl } from "@/lib/seo";

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
  { href: "/solvers/wordle-solver", label: "Wordle Solver" },
  { href: "/solvers/spelling-bee-solver", label: "Spelling Bee Solver" },
  { href: "/solvers/letter-box-solver", label: "Letter Boxed Solver" },
  { href: "/solvers/scrabble-solver", label: "Scrabble Solver" },
  { href: "/solvers/scrabble-word-finder", label: "Scrabble Word Finder" },
  { href: "/solvers/word-unscrambler", label: "Word Unscrambler" },
  { href: "/solvers/anagram-solver", label: "Anagram Solver" },
  { href: "/solvers/quordle-solver", label: "Quordle Solver" },
  { href: "/solvers/crossword-solver", label: "Crossword Solver" },
  { href: "/solvers/words-with-friends-solver", label: "Words With Friends Solver" },
  { href: "/solvers/jumble-solver", label: "Jumble Solver" },
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
        <header className="sticky top-0 z-30 border-b border-[#E5DED3] bg-[#FFFDF9]/95 shadow-sm shadow-[#315C4C]/5 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
            <Link href="/" className="flex items-center gap-3" aria-label="Strands Hint home">
              <BrandLogo />
            </Link>
            <nav className="flex flex-wrap gap-2 text-sm lg:items-center">
              <Link
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
                    <Link
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
                    <Link
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
                    <Link
                      key={`${item.href}-${item.label}`}
                      href={item.href}
                      className="block rounded-lg px-3 py-2.5 font-bold text-[#24333A] hover:bg-[#EDE6DC] hover:text-[#008F83]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
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
              <Link href="/" className="flex items-center gap-2" aria-label="Strands Hint home">
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
                <Link href="/today/strands-hints" className="hover:text-white">Today&apos;s Strands Hint</Link>
                <Link href="/today/connections-hints" className="hover:text-white">Connections Hints</Link>
                <Link href="/today/wordle-hints" className="hover:text-white">Wordle Hint</Link>
                <Link href="/hints/spelling-bee" className="hover:text-white">Spelling Bee Hint</Link>
                <Link href="/daily-hints" className="hover:text-white">All Puzzle Hints</Link>
              </nav>
            </div>
            <div>
              <h2 className="font-black text-white">Solver Tools</h2>
              <nav className="mt-3 grid gap-2">
                <Link href="/solvers/anagram-solver" className="hover:text-white">Anagram Solver</Link>
                <Link href="/solvers/word-unscrambler" className="hover:text-white">Word Unscrambler</Link>
                <Link href="/solvers/wordle-solver" className="hover:text-white">Wordle Solver</Link>
                <Link href="/strands-solver" className="hover:text-white">Strands Solver</Link>
                <Link href="/all-solvers" className="hover:text-white">All Word Solvers</Link>
              </nav>
            </div>
            <div>
              <h2 className="font-black text-white">Resources</h2>
              <nav className="mt-3 grid gap-2">
                <Link href="/#faq" className="hover:text-white">About Us</Link>
                <Link href="/strands-hints" className="hover:text-white">How It Works</Link>
                <Link href="/archive" className="hover:text-white">Archive</Link>
                <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
                <Link href="/terms-of-use" className="hover:text-white">Terms of Use</Link>
                <Link href="/sitemap.xml" className="hover:text-white">Sitemap</Link>
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
