import type { Metadata } from "next";
import Link from "next/link";
import {
  Archive,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  EyeOff,
  Grid3X3,
  Lightbulb,
  Lock,
  Puzzle,
  Search,
  ShieldCheck,
  Shuffle,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { getImplementedSolvers, getSolverPath } from "@/data/solver-registry";
import { breadcrumbSchema, disclaimer } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Strands Hint - Strands Hints, Daily Answers & Word Solvers",
  description:
    "Get spoiler-safe Strands hints, daily puzzle clues, answer reveals, and local word solver tools for Wordle, Spelling Bee, anagrams, and more.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Strands Hint - Strands Hints, Daily Answers & Word Solvers",
    description: "Spoiler-safe daily puzzle hints and local word solver tools.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Strands Hint",
    description: "Daily hints, answer reveals, and local word solver tools.",
  },
};

const faq = [
  {
    question: "Are the hints spoiler-free?",
    answer: "Yes. Hint pages use progressive reveal sections so you can stop before seeing full answers.",
  },
  {
    question: "Is Strands Hint free to use?",
    answer: "Yes. The current hint pages and solver tools are free and do not require an account.",
  },
  {
    question: "How often are hints and answers updated?",
    answer: "Daily content is prepared manually. The site does not scrape official puzzle feeds or competing sites.",
  },
  {
    question: "Is this site affiliated with The New York Times?",
    answer: disclaimer,
  },
  {
    question: "Do the solvers use random or AI-generated results?",
    answer: "No. Solver results come from deterministic local algorithms against a local word list.",
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

const quickLinks = [
  { href: "/today/strands-hints", label: "Today's Hint", Icon: Lightbulb },
  { href: "/strands-hints", label: "Theme", Icon: Puzzle },
  { href: "/todays-strands-answer", label: "Answers", Icon: CheckCircle2 },
  { href: "/archive", label: "Archive", Icon: CalendarDays },
  { href: "/all-solvers", label: "Word Solver", Icon: Grid3X3 },
];

const dailyHintCards = [
  {
    href: "/today/strands-hints",
    title: "Today's Strands Hint",
    text: "Gentle clues, theme help, and spoiler-safe answer reveals for today's Strands.",
    Icon: Sparkles,
    accent: "#008F83",
  },
  {
    href: "/today/connections-hints",
    title: "Connections Hints",
    text: "Category nudges and solving notes without revealing every group first.",
    Icon: Grid3X3,
    accent: "#8A57D6",
  },
  {
    href: "/today/wordle-hints",
    title: "Wordle Hint",
    text: "A step-by-step hint path for narrowing today's Wordle answer.",
    Icon: CheckCircle2,
    accent: "#359B46",
  },
  {
    href: "/hints/crossword",
    title: "Mini Crossword Hint",
    text: "Clue nudges and short-form answer help for compact daily crossword play.",
    Icon: CalendarDays,
    accent: "#2F80D8",
  },
  {
    href: "/hints/spelling-bee",
    title: "Spelling Bee Hint",
    text: "Daily hint structure for center-letter puzzles, pangrams, and word clues.",
    Icon: Puzzle,
    accent: "#D99A00",
  },
  {
    href: "/daily-hints",
    title: "Letter Boxed Hint",
    text: "Letter-combination help, theme notes, and a path into related word tools.",
    Icon: Archive,
    accent: "#E0544F",
  },
];

const solverCards = [
  {
    href: "/anagram-solver",
    title: "Anagram Solver",
    points: ["Find words from messy letters", "Supports wildcard letters", "Sorted by length"],
    Icon: Shuffle,
    accent: "#008F83",
  },
  {
    href: "/word-unscrambler",
    title: "Word Unscrambler",
    points: ["Unscramble letters locally", "Filter by length and pattern", "Copy results"],
    Icon: Shuffle,
    accent: "#D99A00",
  },
  {
    href: "/wordle-solver",
    title: "Wordle Solver",
    points: ["Use known positions", "Include and exclude letters", "Handles repeated letters"],
    Icon: Grid3X3,
    accent: "#359B46",
  },
  {
    href: "/strands-solver",
    title: "Strands Solver",
    points: ["Paste a 6x8 grid", "Find connected words", "Runs in your browser"],
    Icon: Grid3X3,
    accent: "#2F80D8",
  },
  {
    href: "/spelling-bee-solver",
    title: "Spelling Bee Solver",
    points: ["Center-letter rules", "Pangram detection", "Score calculation"],
    Icon: Sparkles,
    accent: "#8A57D6",
  },
  {
    href: "/strands-spangram-helper",
    title: "Spangram Helper",
    points: ["Edge-to-edge candidates", "Direction labels", "Not official answers"],
    Icon: Puzzle,
    accent: "#E0544F",
  },
];

export default function HomePage() {
  const implementedSolvers = getImplementedSolvers().filter((solver) => solver.inputType !== "directory");

  return (
    <div className="-mt-10">
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }])} />
      <JsonLd data={faqSchema} />
      <section className="relative mx-[calc(50%-50vw)] overflow-hidden bg-[radial-gradient(circle_at_50%_0%,#EEF9F8_0%,#F8F5EF_52%,#F8F5EF_100%)] px-4 py-16 text-center">
        <div className="pointer-events-none absolute -left-10 top-40 hidden h-36 w-36 opacity-40 md:block [background-image:radial-gradient(#00A39A_1.4px,transparent_1.4px)] [background-size:14px_14px]" />
        <div className="pointer-events-none absolute -right-20 top-56 hidden h-64 w-64 rounded-full bg-[#DDF4F1] md:block" />
        <div className="pointer-events-none absolute right-0 top-24 hidden h-32 w-32 opacity-25 md:block [background-image:radial-gradient(#00A39A_1.4px,transparent_1.4px)] [background-size:14px_14px]" />
        <div className="mx-auto max-w-4xl">
          <h1 className="font-serif text-4xl font-black leading-tight text-[#142436] sm:text-6xl">
            Strands <span className="text-[#008F83]">Hints</span> &amp; Daily Answers
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-7 text-[#68645E]">
            Get spoiler-safe hints, clue nudges, and answer reveals for today&apos;s Strands puzzle.
            Play smarter, solve faster, and keep your puzzle routine moving.
          </p>

          <div className="mx-auto mt-8 flex max-w-2xl items-center gap-3 rounded-2xl border border-[#E5DED3] bg-white p-2 shadow-lg shadow-[#315C4C]/10">
            <Search className="ml-3 h-5 w-5 text-[#8A857E]" />
            <span className="flex-1 text-left text-sm text-[#8A857E]">Search puzzles, hints, answers...</span>
            <Link prefetch={false}
              href="/all-solvers"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#008F83] text-white hover:bg-[#00766D]"
              aria-label="Search solver tools"
            >
              <Search className="h-5 w-5" />
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {quickLinks.map(({ href, label, Icon }) => (
              <Link prefetch={false}
                key={href}
                href={href}
                className="inline-flex min-w-36 items-center justify-center gap-2 rounded-full border border-[#E5DED3] bg-[#FFFDF9] px-5 py-3 text-sm font-black text-[#24333A] shadow-sm hover:-translate-y-0.5 hover:border-[#008F83]/50 hover:text-[#008F83]"
              >
                <Icon className="h-4 w-4 text-[#008F83]" />
                {label}
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link prefetch={false}
              href="/today/strands-hints"
              className="inline-flex items-center gap-2 rounded-xl bg-[#008F83] px-7 py-4 text-sm font-black text-white shadow-sm hover:bg-[#00766D]"
            >
              Find Today&apos;s Hint <ArrowRight className="h-4 w-4" />
            </Link>
            <Link prefetch={false}
              href="/archive"
              className="inline-flex items-center gap-2 rounded-xl border border-[#008F83] bg-[#FFFDF9] px-7 py-4 text-sm font-black text-[#008F83] hover:bg-[#F1FAF8]"
            >
              <Archive className="h-4 w-4" />
              Browse Archives
            </Link>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-0 overflow-hidden rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] shadow-lg shadow-[#315C4C]/10 sm:grid-cols-4">
            {[
              [ShieldCheck, "100% Free", "No login required"],
              [EyeOff, "Spoiler Control", "Reveal when ready"],
              [Puzzle, "Local Solvers", "No AI guesswork"],
              [Zap, "Fast Access", "Built for quick visits"],
            ].map(([Icon, value, label], index) => (
              <div key={value as string} className={["p-6", index ? "border-t border-[#E5DED3] sm:border-l sm:border-t-0" : ""].join(" ")}>
                <Icon className="mx-auto mb-3 h-6 w-6 text-[#008F83]" />
                <p className="font-serif text-xl font-black text-[#142436]">{value as string}</p>
                <p className="mt-1 text-sm font-semibold text-[#68645E]">{label as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="text-center">
          <h2 className="font-serif text-4xl font-black text-[#20201E]">
            Featured Daily <span className="text-[#008F83]">Puzzle Hints</span>
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#68645E]">
            Quick nudges and spoiler-safe answer paths for the puzzles you play every day.
          </p>
        </div>
        <div className="mx-auto mt-8 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {dailyHintCards.map(({ href, title, text, Icon, accent }) => (
            <Link prefetch={false} key={href} href={href} className="group rounded-xl border border-[#E5DED3] bg-[#FFFDF9] p-6 text-center shadow-md shadow-[#315C4C]/5 hover:-translate-y-1 hover:shadow-lg">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-xl text-white" style={{ backgroundColor: accent }}>
                <Icon className="h-7 w-7" />
              </span>
              <h3 className="mt-5 font-serif text-xl font-black text-[#20201E]">{title}</h3>
              <p className="mt-3 min-h-16 text-sm leading-6 text-[#68645E]">{text}</p>
              <span className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-black text-white" style={{ backgroundColor: accent }}>
                Get Today&apos;s Hint <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-8">
        <div className="text-center">
          <h2 className="font-serif text-4xl font-black text-[#20201E]">
            Helpful <span className="text-[#008F83]">Word Solver</span> Tools
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#68645E]">
            Real local tools to help you find words, solve clues, and keep playing.
          </p>
        </div>
        <div className="mx-auto mt-8 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {solverCards.map(({ href, title, points, Icon, accent }) => (
            <Link prefetch={false} key={href} href={href} className="group rounded-xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-md shadow-[#315C4C]/5 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-xl" style={{ backgroundColor: `${accent}18`, color: accent }}>
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="font-serif text-xl font-black text-[#20201E]">{title}</h3>
              </div>
              <ul className="mt-5 grid gap-2 text-sm text-[#68645E]">
                {points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span style={{ color: accent }}>&bull;</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <span className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-black" style={{ borderColor: accent, color: accent }}>
                Open Tool <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="my-14 rounded-[2rem] bg-[#EEF8F6] px-6 py-10 shadow-sm shadow-[#315C4C]/5">
        <h2 className="text-center font-serif text-4xl font-black text-[#20201E]">
          Why Choose <span className="text-[#008F83]">StrandsHint</span>
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
          {[
            [Lock, "100% Free Access", "Hints and tools are free to use."],
            [CalendarDays, "Daily Updates", "Fresh pages for daily puzzle routines."],
            [EyeOff, "Spoiler Control", "Reveal only what you want to see."],
            [Smartphone, "Mobile Friendly", "Clear layouts for small screens."],
            [Zap, "Quick Navigation", "Useful pages are only a few taps away."],
            [Puzzle, "Puzzle Focused", "Built around word-game workflows."],
          ].map(([Icon, title, text]) => (
            <div key={title as string} className="text-center">
              <Icon className="mx-auto h-8 w-8 text-[#008F83]" />
              <h3 className="mt-4 text-sm font-black text-[#20201E]">{title as string}</h3>
              <p className="mt-2 text-xs leading-5 text-[#68645E]">{text as string}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl py-10">
        <div className="text-center">
          <h2 className="font-serif text-4xl font-black text-[#20201E]">
            FAQs About <span className="text-[#008F83]">StrandsHint</span>
          </h2>
          <p className="mt-3 text-sm text-[#68645E]">Common questions about our hints and tools.</p>
        </div>
        <div className="mt-8 divide-y divide-[#E5DED3] overflow-hidden rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] shadow-sm">
          {faq.map((item) => (
            <details key={item.question} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-[#20201E]">
                {item.question}
                <ArrowRight className="h-4 w-4 text-[#008F83] transition group-open:rotate-90" />
              </summary>
              <p className="mt-3 text-sm leading-6 text-[#68645E]">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="sr-only" aria-label="Implemented solver links">
        {implementedSolvers.map((solver) => (
          <Link prefetch={false} key={solver.slug} href={getSolverPath(solver)}>
            {solver.name}
          </Link>
        ))}
        <Link prefetch={false} href="/all-solvers">All Solvers</Link>
        <Link prefetch={false} href="/daily-hints">All Daily Hints</Link>
        <Link prefetch={false} href="/strands-solver">Strands Solver</Link>
      </section>
    </div>
  );
}
