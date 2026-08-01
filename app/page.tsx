import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, Grid3X3, Search, ShieldCheck, Sparkles } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { getImplementedSolvers, solverRegistry } from "@/data/solver-registry";
import { dailySeoPages } from "@/lib/daily-seo";
import { breadcrumbSchema, disclaimer } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Strands Hint - Word Puzzle Solvers and Daily Hints",
  description:
    "Use spoiler-safe daily hints and local word puzzle solvers for Wordle, Strands, Spelling Bee, anagrams, and word finding.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Strands Hint - Word Puzzle Solvers and Daily Hints",
    description: "A warm, spoiler-safe helper for daily word puzzles and local solver tools.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Strands Hint",
    description: "Daily hints and local word puzzle solver tools.",
  },
};

const faq = [
  {
    question: "Is Strands Hint an official puzzle site?",
    answer: disclaimer,
  },
  {
    question: "Do the solvers use AI?",
    answer: "No. The first solver tools use local deterministic filters against a local word list.",
  },
  {
    question: "Are answers shown immediately?",
    answer: "Daily hint pages use progressive reveal sections so you choose when to see stronger help.",
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

const solverSearchLinks = getImplementedSolvers().filter((solver) => solver.inputType !== "directory");

export default function HomePage() {
  const categories = Array.from(new Set(solverRegistry.map((solver) => solver.category)));

  return (
    <div>
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }])} />
      <JsonLd data={faqSchema} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Strands Hint",
          url: "https://strandshint.net",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://strandshint.net/all-solvers?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }}
      />

      <section className="py-12 lg:py-16">
        <div className="max-w-3xl">
          <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-[#315C4C]">
            Independent word puzzle helper
          </p>
          <h1 className="mt-5 font-serif text-5xl font-black leading-tight text-[#20201E] sm:text-6xl">
            Daily hints and quiet solver tools for word puzzle players.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#68645E]">
            Reveal clues at your own pace, search for a solver, and keep answers hidden until you
            actually want the spoiler.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-5 shadow-sm">
        <label className="grid gap-3">
          <span className="font-serif text-2xl font-black">Find a solver</span>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex min-h-12 flex-1 items-center gap-3 rounded-xl border border-[#D4CABD] bg-white px-4">
              <Search className="h-5 w-5 text-[#68645E]" />
              <span className="text-sm text-[#68645E]">Choose a tool below. Search UI will expand in the next iteration.</span>
            </div>
            <Link href="/all-solvers" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#315C4C] px-5 py-3 text-sm font-bold text-white hover:bg-[#274B3E]">
              Browse all solvers <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </label>
      </section>

      <section className="py-12">
        <h2 className="font-serif text-3xl font-black">Popular puzzle shortcuts</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            ["/daily-hints", "Daily hints", CalendarDays, "Open spoiler-safe daily clue pages."],
            ["/solvers/wordle-solver", "Wordle Solver", Grid3X3, "Filter candidates by pattern and letters."],
            ["/solvers/spelling-bee-solver", "Spelling Bee Solver", Sparkles, "Find words and pangrams locally."],
          ].map(([href, title, Icon, text]) => (
            <Link key={href as string} href={href as string} className="group rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-5 shadow-sm hover:border-[#315C4C]/50">
              <Icon className="h-7 w-7 text-[#315C4C]" />
              <h3 className="mt-4 font-serif text-2xl font-black">{title as string}</h3>
              <p className="mt-2 text-sm leading-6 text-[#68645E]">{text as string}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-serif text-3xl font-black">Featured solvers</h2>
          <Link href="/all-solvers" className="text-sm font-bold text-[#315C4C]">All solvers</Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {solverSearchLinks.map((solver) => (
            <Link key={solver.slug} href={`/solvers/${solver.slug}`} className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-5 shadow-sm hover:border-[#315C4C]/50">
              <h3 className="font-serif text-xl font-black">{solver.name}</h3>
              <p className="mt-2 text-sm leading-6 text-[#68645E]">{solver.shortDescription}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-serif text-3xl font-black">Today&apos;s puzzle hints</h2>
          <Link href="/daily-hints" className="text-sm font-bold text-[#315C4C]">All daily hints</Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {dailySeoPages.map((page) => (
            <Link key={page.slug} href={page.path} className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-5 shadow-sm hover:border-[#315C4C]/50">
              <CalendarDays className="h-7 w-7 text-[#315C4C]" />
              <h3 className="mt-4 font-serif text-2xl font-black">{page.h1}</h3>
              <p className="mt-2 text-sm leading-6 text-[#68645E]">{page.searchIntent}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-sm">
        <h2 className="font-serif text-3xl font-black">All solver categories</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {categories.map((category) => (
            <div key={category} className="rounded-xl border border-[#E5DED3] bg-[#F8F5EF] p-4">
              <h3 className="font-bold">{category}</h3>
              <p className="mt-2 text-sm text-[#68645E]">
                {solverRegistry.filter((solver) => solver.category === category).length} tools and planned helpers
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 py-12 md:grid-cols-3">
        {[
          ["1. Choose a page", "Start with a daily hint or a solver tool."],
          ["2. Enter only what you know", "Use patterns, letters, or puzzle-specific clues."],
          ["3. Reveal carefully", "Keep answers hidden until you want the full spoiler."],
        ].map(([title, text]) => (
          <div key={title} className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-5 shadow-sm">
            <h2 className="font-serif text-2xl font-black">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-[#68645E]">{text}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <ShieldCheck className="h-9 w-9 text-[#315C4C]" />
          <h2 className="mt-4 font-serif text-3xl font-black">Why use these tools?</h2>
          <p className="mt-3 text-sm leading-6 text-[#68645E]">
            The platform is designed for quiet, useful puzzle help: local algorithms, manual daily
            content, visible spoiler control, and clear non-affiliation.
          </p>
        </div>
        <div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-sm">
          <h2 className="font-serif text-3xl font-black">Latest puzzle guides</h2>
          <div className="mt-4 grid gap-3">
            {[
              ["What is a spangram?", "/strands-spangram-helper"],
              ["How to use a word puzzle solver", "/all-solvers"],
              ["How progressive hints avoid spoilers", "/daily-hints"],
            ].map(([title, href]) => (
              <Link key={href} href={href} className="flex items-center justify-between rounded-xl border border-[#E5DED3] bg-white px-4 py-3 font-bold hover:border-[#315C4C]/50">
                <span><BookOpen className="mr-2 inline h-4 w-4 text-[#315C4C]" />{title}</span>
                <ArrowRight className="h-4 w-4 text-[#315C4C]" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-12">
        <h2 className="font-serif text-3xl font-black">Frequently asked questions</h2>
        <div className="mt-5 divide-y divide-[#E5DED3] overflow-hidden rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] shadow-sm">
          {faq.map((item) => (
            <details key={item.question} className="p-5">
              <summary className="cursor-pointer list-none font-bold">{item.question}</summary>
              <p className="mt-3 text-sm leading-6 text-[#68645E]">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
