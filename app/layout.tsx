import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";
import { siteName, siteUrl } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - Daily Strands Hints and Answers`,
    template: `%s | ${siteName}`,
  },
  description:
    "Daily Strands hints, spangrams, answers, and archive pages maintained by hand.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName,
  },
  robots: { index: true, follow: true },
};

const nav = [
  { href: "/today/", label: "Today" },
  { href: "/yesterday/", label: "Yesterday" },
  { href: "/archive/", label: "Archive" },
  { href: "/solver/", label: "Solver" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} bg-stone-50 font-sans text-stone-900 antialiased`}>
        <header className="border-b border-stone-200 bg-white">
          <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight text-stone-950">
              Strands Hint
            </Link>
            <nav className="flex flex-wrap gap-2 text-sm">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-2 font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-950"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>
        <footer className="mx-auto max-w-5xl border-t border-stone-200 px-4 py-8 text-sm text-stone-500">
          <p>Independent Strands hints and answers. Not affiliated with The New York Times.</p>
        </footer>
      </body>
    </html>
  );
}
