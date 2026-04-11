import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NYT Hints & Answers — Wordle, Strands, Connections",
    template: "%s | NYT Hints Blog",
  },
  description:
    "Daily blog-style hints and answers for NYT Wordle, Strands, and Connections—static pages, clear headings, and spoiler-friendly toggles.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "NYT Hints Blog",
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
      <body className={`${inter.variable} ${lora.variable} font-sans`}>
        <div className="mx-auto min-h-screen max-w-3xl px-4 pb-20 pt-10 sm:px-6 lg:max-w-3xl lg:px-8">
          <header className="mb-12 border-b border-ink-200 pb-8">
            <a
              href="/"
              className="font-serif text-xl font-semibold tracking-tight text-ink-900 hover:text-ink-700"
            >
              NYT Hints Blog
            </a>
            <p className="mt-2 text-sm text-ink-500">
              Static articles for Wordle, Strands, and Connections—one page per day.
            </p>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
