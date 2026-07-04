import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import { Puzzle } from "lucide-react";
import "./globals.css";
import { disclaimer, siteName, siteUrl } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

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
  ["/todays-strands-answer", "Today"],
  ["/strands-hints", "Hints"],
  ["/strands-solver", "Solver"],
  ["/strands-spangram-helper", "Spangram"],
  ["/strands-word-finder", "Word Finder"],
  ["/archive", "Archive"],
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} bg-slate-50 font-sans text-slate-900 antialiased`}>
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-slate-950">
              <span className="rounded-lg bg-slate-900 p-2 text-white">
                <Puzzle className="h-5 w-5" />
              </span>
              Strands Hint
            </Link>
            <nav className="flex flex-wrap gap-1 text-sm">
              {nav.map(([href, label]) => (
                <Link key={href} href={href} className="rounded-md px-3 py-2 font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950">
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
        <footer className="mx-auto max-w-6xl border-t border-slate-200 px-4 py-8 text-sm text-slate-500">
          <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-start">
            <p>{disclaimer}</p>
            <nav className="flex flex-wrap gap-3 sm:justify-end" aria-label="Footer">
              <Link href="/todays-strands-answer" className="hover:text-slate-900">Today</Link>
              <Link href="/strands-solver" className="hover:text-slate-900">Solver</Link>
              <Link href="/strands-word-finder" className="hover:text-slate-900">Word Finder</Link>
              <Link href="/archive" className="hover:text-slate-900">Archive</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
