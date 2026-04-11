import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NYT Games Hints — Wordle, Strands, Connections & more",
    template: "%s | NYT Hints",
  },
  description:
    "Daily NYT games hints: Wordle, Strands, Pips, Connections, Sports, Crossword, and Mini—with tabbed UI and anchor links.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "NYT Hints",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <div className="mx-auto min-h-screen max-w-3xl px-4 pb-16 pt-8 sm:px-6 lg:max-w-4xl lg:px-8">
          <header className="mb-10 border-b border-ink-200 pb-6">
            <a href="/" className="text-lg font-semibold tracking-tight text-ink-900">
              NYT Hints
            </a>
            <p className="mt-1 text-sm text-ink-500">
              Tabbed daily hints for NYT Wordle, Strands, Connections, and more.
            </p>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
