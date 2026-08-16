import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, RefreshCw, Sparkles } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { dailySeoPages } from "@/lib/daily-seo";
import { absoluteUrl, breadcrumbSchema, disclaimer, itemListSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Today's Puzzle Hints - Daily Wordle, Connections & Strands Help",
  description:
    "Find today's spoiler-safe puzzle hints in one place, including Strands hints, Wordle clues, Connections nudges, and related solving tools.",
  alternates: { canonical: "/today" },
  openGraph: {
    title: "Today's Puzzle Hints",
    description:
      "Daily spoiler-safe hints and related tools for word puzzle players who want help without immediate answers.",
    url: absoluteUrl("/today"),
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Today's Puzzle Hints",
    description: "Daily spoiler-safe hints for Wordle, Connections, Strands, and related puzzle tools.",
  },
};

const faq = [
  {
    question: "Are these daily puzzle pages official?",
    answer: disclaimer,
  },
  {
    question: "Do daily pages reveal answers immediately?",
    answer:
      "No. The daily pages are structured around progressive hints first, with stronger answer help separated into later sections.",
  },
  {
    question: "How are daily pages updated?",
    answer:
      "Daily content is manually prepared by the site admin. The site does not scrape or fetch official puzzle feeds.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Today's Puzzle Hints",
  description: metadata.description,
  url: absoluteUrl("/today"),
  hasPart: dailySeoPages.map((page) => ({
    "@type": "WebPage",
    name: page.title,
    url: absoluteUrl(page.path),
    about: page.game,
  })),
};

export default function TodayHubPage() {
  return (
    <article className="-mt-4">
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Today", url: "/today" }])} />
      <JsonLd data={collectionSchema} />
      <JsonLd
        data={itemListSchema(
          "Today's Puzzle Hints",
          dailySeoPages.map((page) => ({
            name: page.h1,
            url: page.path,
            description: page.searchIntent,
          })),
        )}
      />
      <JsonLd data={faqSchema} />

      <header className="grid gap-8 py-10 lg:grid-cols-[1fr_22rem] lg:items-end">
        <div>
          <p className="font-mono text-sm font-bold uppercase tracking-[0.22em] text-[#315C4C]">
            Daily hint hub
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl font-black leading-tight text-[#20201E]">
            Today&apos;s puzzle hints, organized by game.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#68645E]">
            Start with the daily page you need, reveal clues one layer at a time, then move into
            solver tools only when a puzzle still feels stuck.
          </p>
        </div>
        <aside className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-5">
          <div className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#315C4C]">
            <RefreshCw className="h-4 w-4" />
            Fresh daily structure
          </div>
          <p className="mt-3 text-sm leading-6 text-[#68645E]">
            Built for recurring players, Google freshness signals, and spoiler-safe daily puzzle
            routines without automated official-feed scraping.
          </p>
        </aside>
      </header>

      <section className="grid gap-5 md:grid-cols-3">
        {dailySeoPages.map((page) => (
          <Link prefetch={false}
            key={page.slug}
            href={page.path}
            className="group rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-lg shadow-black/10 motion-safe:transition hover:-translate-y-1 hover:border-[#315C4C]/70"
          >
            <CalendarDays className="h-8 w-8 text-[#315C4C]" />
            <h2 className="mt-5 font-serif text-3xl font-black text-[#20201E]">{page.h1}</h2>
            <p className="mt-3 text-sm leading-6 text-[#68645E]">{page.searchIntent}</p>
            <span className="mt-5 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#315C4C]">
              Open daily hints <ArrowRight className="h-4 w-4 motion-safe:transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6">
          <Sparkles className="h-8 w-8 text-[#2F8F7E]" />
          <h2 className="mt-4 font-serif text-3xl font-black text-[#20201E]">
            Next steps after a hint
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#68645E]">
            Strands players can continue into the solver, spangram helper, word finder, or archive
            when a single clue is not enough.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              ["/strands-solver", "Use solver"],
              ["/strands-spangram-helper", "Find spangram"],
              ["/strands-word-finder", "Open word finder"],
              ["/archive", "Browse archive"],
            ].map(([href, label]) => (
              <Link prefetch={false}
                key={href}
                href={href}
                className="rounded-full border border-[#D4CABD] px-4 py-2 text-sm font-bold text-[#20201E] hover:bg-[#E5DED3]/10"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6">
          <h2 className="font-serif text-3xl font-black text-[#20201E]">FAQ</h2>
          <div className="mt-5 grid gap-3">
            {faq.map((item) => (
              <details key={item.question} className="rounded-xl bg-[#FFFFFF] p-4">
                <summary className="cursor-pointer list-none font-semibold text-[#20201E]">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-6 text-[#68645E]">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
