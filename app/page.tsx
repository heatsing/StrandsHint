import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Archive,
  Calendar,
  Grid3X3,
  Heart,
  Lightbulb,
  Lock,
  Mail,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { getTodayPuzzle } from "@/lib/puzzle-data";
import { breadcrumbSchema, disclaimer } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Strands Hint - Today's Strands Hints, Spangram & Solver",
  description:
    "Reveal spoiler-safe Strands hints at your own pace, then use companion solver tools when you need a stronger nudge.",
  alternates: { canonical: "/" },
};

const faq = [
  {
    question: "What is NYT Strands?",
    answer: "Strands is a word puzzle where players find themed words and a spangram in a letter grid.",
  },
  {
    question: "Is this site affiliated with The New York Times?",
    answer: disclaimer,
  },
  {
    question: "How do the hints work?",
    answer: "Open the theme hint first, then the spangram hint, then the full answer only when you choose.",
  },
  {
    question: "Can I play Strands on this site?",
    answer: "No. Strands Hint is an independent helper with hints, answers, and solving tools.",
  },
  {
    question: "How is the spangram different?",
    answer: "The spangram is the theme answer that spans the board. Our helper can suggest candidates.",
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

const gridLetters = ["SUNTOP", "ARCADE", "NPKINS", "BLANKT", "LEMONS", "BASKET"];
const spangramIndexes = new Set([30, 31, 32, 33, 34, 35]);
const foundIndexes = new Set([2, 3, 12, 13, 14, 15, 24, 25, 26, 27]);

const tools = [
  {
    href: "/strands-solver",
    Icon: Grid3X3,
    title: "Strands Solver",
    text: "Paste a grid and look for connected words.",
    cta: "Open solver",
  },
  {
    href: "/strands-spangram-helper",
    Icon: Sparkles,
    title: "Spangram Helper",
    text: "Find long edge-to-edge candidates.",
    cta: "Find spangrams",
  },
  {
    href: "/strands-word-finder",
    Icon: Search,
    title: "Word Finder",
    text: "Search by length, letters, or pattern.",
    cta: "Find words",
  },
  {
    href: "/archive",
    Icon: Archive,
    title: "Archive",
    text: "Browse manually published hint pages.",
    cta: "View archive",
  },
];

function HeroGrid() {
  return (
    <div className="relative mx-auto max-w-sm rotate-2 rounded-[1.75rem] border border-[#F3ECDD]/20 bg-[#E7DEC9] p-5 shadow-2xl shadow-black/30 motion-safe:transition motion-safe:hover:rotate-0 sm:max-w-md">
      <div className="grid grid-cols-6 gap-2.5">
        {gridLetters.join("").split("").map((letter, index) => {
          const isSpangram = spangramIndexes.has(index);
          const isFound = foundIndexes.has(index);
          return (
            <span
              key={`${letter}-${index}`}
              className={[
                "flex aspect-square items-center justify-center rounded-xl font-mono text-xl font-bold text-[#12172B] ring-1 ring-[#12172B]/10",
                isSpangram ? "bg-[#E8A93D]" : "",
                isFound ? "bg-[#2F8F7E] text-[#F6F1E6]" : "",
                !isSpangram && !isFound ? "bg-[#F3ECDD]" : "",
              ].join(" ")}
            >
              {letter}
            </span>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-between font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#12172B]/65">
        <span>6 x 6 grid</span>
        <span>spoiler safe</span>
      </div>
    </div>
  );
}

function StickyNotes() {
  const notes = [
    ["Theme Hint", "Start with a soft clue.", "bg-[#F3ECDD] rotate-[-5deg]"],
    ["Spangram Hint", "Reveal the shape, not the answer.", "bg-[#E8A93D] rotate-[2deg]"],
    ["Full Answer", "Open only when you are ready.", "bg-[#2F8F7E] text-[#F6F1E6] rotate-[7deg]"],
  ];

  return (
    <div className="group relative min-h-44">
      {notes.map(([title, text, className], index) => (
        <div
          key={title}
          className={[
            "absolute left-0 top-0 w-60 rounded-2xl p-5 text-[#12172B] shadow-xl shadow-black/25 ring-1 ring-black/10 motion-safe:transition motion-safe:duration-300",
            "group-hover:translate-x-[calc(var(--note)*1.75rem)] group-hover:translate-y-[calc(var(--note)*1rem)]",
            className,
          ].join(" ")}
          style={{ ["--note" as string]: index }}
        >
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em]">{title}</p>
          <p className="mt-3 font-serif text-2xl font-black leading-tight">{text}</p>
        </div>
      ))}
    </div>
  );
}

function RevealBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <details className="group rounded-2xl border border-[#F3ECDD]/15 bg-[#1B2138] p-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-mono text-sm font-bold uppercase tracking-[0.14em] text-[#F6F1E6]">
        {label}
        <Plus className="h-5 w-5 text-[#E8A93D] motion-safe:transition group-open:rotate-45" />
      </summary>
      <div className="mt-4 rounded-xl bg-[#F3ECDD] p-5 text-[#12172B]">{children}</div>
    </details>
  );
}

export default async function HomePage() {
  const today = await getTodayPuzzle();

  return (
    <div className="-mt-10">
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }])} />
      <JsonLd data={faqSchema} />

      <section className="grid gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-20">
        <div>
          <p className="font-mono text-sm font-bold uppercase tracking-[0.22em] text-[#E8A93D]">
            Independent Strands helper
          </p>
          <h1 className="mt-5 max-w-2xl font-serif text-5xl font-black leading-[0.95] text-[#F6F1E6] sm:text-7xl">
            Reveal today&apos;s Strands hint without spoiling the solve.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#F6F1E6]/75">
            Open one clue at a time, keep the answer hidden, and jump into solver tools only when
            you want a stronger nudge.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/todays-strands-answer"
              className="inline-flex items-center gap-2 rounded-full bg-[#E1573F] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#E1573F]/25 hover:bg-[#f06a52]"
            >
              View today&apos;s hint <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/strands-solver"
              className="inline-flex items-center gap-2 rounded-full border border-[#F3ECDD]/25 px-6 py-3 text-sm font-bold text-[#F6F1E6] hover:bg-[#F3ECDD]/10"
            >
              <Grid3X3 className="h-4 w-4" /> Try the solver
            </Link>
          </div>
        </div>
        <HeroGrid />
      </section>

      <section className="rounded-[2rem] border border-[#F3ECDD]/15 bg-[#1B2138] p-6 shadow-2xl shadow-black/20 lg:p-10">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1fr] lg:items-start">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full bg-[#2A3151] px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#E8A93D]">
              <Calendar className="h-4 w-4" />
              {today?.dateLabel ?? "Today"}
            </div>
            <h2 className="mt-5 font-serif text-4xl font-black text-[#F6F1E6]">Today&apos;s Strands</h2>
            <p className="mt-4 max-w-lg leading-7 text-[#F6F1E6]/70">
              Start with the lightest clue. Each layer stays closed until you open it.
            </p>
            <div className="mt-8">
              <StickyNotes />
            </div>
          </div>
          <div className="grid gap-4">
            <RevealBlock label="Reveal theme hint">
              <p className="font-serif text-2xl font-black">{today?.themeHint ?? "A gentle theme clue is ready."}</p>
            </RevealBlock>
            <RevealBlock label="Reveal spangram hint">
              <div className="space-y-2">
                <p>{today?.spangramHint1 ?? "Look for the phrase that crosses the board."}</p>
                <p>{today?.spangramHint2 ?? "It ties the theme together."}</p>
              </div>
            </RevealBlock>
            <RevealBlock label="Reveal full answer">
              <div className="space-y-4">
                <p className="font-mono text-sm font-bold uppercase tracking-[0.18em]">Spangram</p>
                <p className="font-serif text-3xl font-black">{today?.spangram ?? "Available on the answer page"}</p>
                {today ? (
                  <div className="flex flex-wrap gap-2">
                    {today.words.map((word) => (
                      <span key={word} className="rounded-full bg-[#12172B] px-3 py-1.5 font-mono text-sm font-bold text-[#F6F1E6]">
                        {word}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </RevealBlock>
          </div>
        </div>
      </section>

      <section className="py-14">
        <h2 className="font-serif text-4xl font-black text-[#F6F1E6]">Companion solving tools</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map(({ href, Icon, title, text, cta }) => (
            <Link
              key={title}
              href={href}
              className="group rounded-2xl border border-[#F3ECDD]/15 bg-[#1B2138] p-6 shadow-lg shadow-black/10 motion-safe:transition hover:-translate-y-1 hover:border-[#E8A93D]/70 hover:shadow-[#E8A93D]/10"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2A3151] text-[#E8A93D]">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-6 font-serif text-2xl font-black text-[#F6F1E6]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#F6F1E6]/70">{text}</p>
              <span className="mt-5 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#E8A93D]">
                {cta} <ArrowRight className="h-4 w-4 motion-safe:transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-[calc(50%-50vw)] bg-[#1B2138] px-4 py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-serif text-4xl font-black text-[#F6F1E6]">How it works</h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              ["1", "Open a hint", "Start with the smallest clue and keep the answer closed.", Lightbulb],
              ["2", "Use a tool", "Paste a grid, search words, or scan for spangram candidates.", Grid3X3],
              ["3", "Finish clean", "Reveal the answer only after you have tried the solve.", Trophy],
            ].map(([step, title, text, Icon]) => (
              <div key={title as string} className="rounded-2xl border border-[#F3ECDD]/15 bg-[#12172B] p-6">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8A93D] font-mono font-black text-[#12172B]">
                    {step as string}
                  </span>
                  <Icon className="h-7 w-7 text-[#2F8F7E]" />
                </div>
                <h3 className="mt-5 font-serif text-2xl font-black text-[#F6F1E6]">{title as string}</h3>
                <p className="mt-3 text-sm leading-6 text-[#F6F1E6]/70">{text as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <h2 className="text-center font-serif text-4xl font-black text-[#F6F1E6]">Why players love it</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Independent", "Not affiliated with The New York Times.", ShieldCheck],
            ["Fast", "The next useful clue is always one tap away.", Zap],
            ["Spoiler control", "You decide when the answer appears.", Lock],
            ["Player built", "Made for daily puzzle routines.", Heart],
          ].map(([title, text, Icon]) => (
            <div key={title as string} className="rounded-2xl border border-[#F3ECDD]/15 bg-[#1B2138] p-6">
              <Icon className="h-7 w-7 text-[#E8A93D]" />
              <h3 className="mt-5 font-serif text-2xl font-black text-[#F6F1E6]">{title as string}</h3>
              <p className="mt-3 text-sm leading-6 text-[#F6F1E6]/70">{text as string}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="border-t border-[#F3ECDD]/10 py-12">
        <h2 className="font-serif text-4xl font-black text-[#F6F1E6]">Frequently asked questions</h2>
        <div className="mt-8 divide-y divide-[#F3ECDD]/10 overflow-hidden rounded-2xl border border-[#F3ECDD]/15 bg-[#1B2138]">
          {faq.map((item) => (
            <details key={item.question} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[#F6F1E6]">
                {item.question}
                <Plus className="h-5 w-5 text-[#E8A93D] motion-safe:transition group-open:rotate-45" />
              </summary>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#F6F1E6]/70">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mb-10 rounded-[2rem] bg-[#F3ECDD] p-6 text-[#12172B]">
        <div className="grid gap-5 lg:grid-cols-[1fr_28rem] lg:items-center">
          <div className="flex items-center gap-5">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8A93D]">
              <Mail className="h-7 w-7" />
            </span>
            <div>
              <h2 className="font-serif text-3xl font-black">Get daily Strands hints</h2>
              <p className="mt-1 text-sm text-[#12172B]/70">One reminder, one puzzle, no official feed scraping.</p>
            </div>
          </div>
          <form className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              className="rounded-full border border-[#12172B]/15 bg-white px-5 py-3 text-sm outline-none placeholder:text-[#12172B]/45 focus:border-[#E8A93D]"
              placeholder="Enter your email"
            />
            <button className="rounded-full bg-[#E1573F] px-6 py-3 text-sm font-bold text-white hover:bg-[#f06a52]" type="button">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
