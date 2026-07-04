import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import { Infinity, Search } from "lucide-react";
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
      <body className={`${inter.variable} bg-white font-sans text-slate-900 antialiased`}>
        <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 lg:flex-row lg:items-center lg:justify-between">
            <Link href="/" className="flex items-center gap-3 text-2xl font-black text-slate-950">
              <Infinity className="h-10 w-10 text-indigo-600" />
              <span>Strands <span className="text-indigo-600">Hint</span></span>
            </Link>
            <nav className="flex flex-wrap gap-1 text-sm lg:items-center">
              {nav.map(([href, label]) => (
                <Link key={href} href={href} className="rounded-md px-3 py-2 font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700">
                  {label}
                </Link>
              ))}
              <Link href="/strands-solver" className="ml-0 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 lg:ml-3">
                <Search className="h-4 w-4" />
                Explore Tools
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
        <footer className="mx-auto max-w-6xl border-t border-slate-200 px-4 py-10 text-sm text-slate-500">
          <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <Link href="/" className="flex items-center gap-2 text-2xl font-black text-slate-950">
                <Infinity className="h-9 w-9 text-indigo-600" />
                Strands <span className="text-indigo-600">Hint</span>
              </Link>
              <p className="mt-4 max-w-xs leading-6">Smart hints. Better solving. More fun.</p>
            </div>
            <div>
              <h2 className="font-black text-slate-950">Tools</h2>
              <nav className="mt-3 grid gap-2">
                <Link href="/strands-solver" className="hover:text-indigo-700">Strands Solver</Link>
                <Link href="/strands-spangram-helper" className="hover:text-indigo-700">Spangram Helper</Link>
                <Link href="/strands-word-finder" className="hover:text-indigo-700">Word Finder</Link>
                <Link href="/todays-strands-answer" className="hover:text-indigo-700">Today&apos;s Answer</Link>
              </nav>
            </div>
            <div>
              <h2 className="font-black text-slate-950">Resources</h2>
              <nav className="mt-3 grid gap-2">
                <Link href="/strands-hints" className="hover:text-indigo-700">How to Play</Link>
                <Link href="/archive" className="hover:text-indigo-700">Archive</Link>
                <Link href="/#faq" className="hover:text-indigo-700">FAQ</Link>
              </nav>
            </div>
            <div>
              <h2 className="font-black text-slate-950">Legal</h2>
              <p className="mt-3 leading-6">{disclaimer}</p>
            </div>
          </div>
          <p className="mt-10 text-center text-xs text-slate-400">© 2026 Strands Hint. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
