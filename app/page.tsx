import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarCheck, Eye, Grid3X3, Sparkles } from "lucide-react";
import { FAQ } from "@/components/FAQ";
import { JsonLd } from "@/components/JsonLd";
import { PuzzleCard } from "@/components/PuzzleCard";
import { getTodayPuzzle } from "@/lib/puzzle-data";
import { breadcrumbSchema, disclaimer } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Strands Hint - Today's Strands Hints, Spangram & Solver",
  description:
    "Get spoiler-safe Strands hints, reveal today's answer in layers, and use simple solver tools for any 6x8 letter grid.",
  alternates: { canonical: "/" },
};

const features = [
  {
    Icon: Eye,
    title: "Spoiler-safe reveal system",
    text: "Open theme hints, spangram hints, spangram, and full answers one layer at a time.",
  },
  {
    Icon: Grid3X3,
    title: "Strands puzzle solver",
    text: "Paste 48 letters, search possible words, and filter by known letters or length.",
  },
  {
    Icon: Sparkles,
    title: "Spangram helper",
    text: "Find longer edge-to-edge candidates and sort them by direction.",
  },
];

const faq = [
  {
    question: "Is Strands Hint affiliated with The New York Times?",
    answer: disclaimer,
  },
  {
    question: "Where does today's Strands answer come from?",
    answer: "Daily content is entered manually by an administrator. The site does not fetch or scrape official NYT puzzle APIs.",
  },
  {
    question: "Can I use the solver without seeing spoilers?",
    answer: "Yes. The solver works from letters you enter and does not reveal the database answer unless you open an answer page.",
  },
];

export default async function HomePage() {
  const today = await getTodayPuzzle();

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }])} />
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Spoiler-safe puzzle help</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Strands Hint for today&apos;s hints, spangram help, and solver tools
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Use a gentle nudge first, reveal answers only when you choose, or test a 6x8 grid with
            the local Strands solver and word finder.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/todays-strands-answer" className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">
              Today&apos;s Strands answer <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/strands-solver" className="rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50">
              Open solver
            </Link>
          </div>
        </div>
        {today ? <PuzzleCard puzzle={today} /> : null}
      </section>

      <section className="mt-14 grid gap-4 md:grid-cols-3">
        {features.map(({ Icon, title, text }) => (
          <div key={title} className="rounded-lg border border-slate-200 bg-white p-5">
            <Icon className="h-6 w-6 text-sky-700" />
            <h2 className="mt-4 font-bold text-slate-950">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
          </div>
        ))}
      </section>

      <section className="mt-14 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <CalendarCheck className="h-6 w-6 text-sky-700" />
          <h2 className="mt-4 text-2xl font-bold text-slate-950">Make it your daily Strands stop</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Start spoiler-free, use only the hint you need, then come back tomorrow for a fresh
            manually reviewed page.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["1", "Open today", "Check the theme and difficulty before revealing anything."],
            ["2", "Nudge first", "Reveal the theme hint or spangram clue without seeing every answer."],
            ["3", "Keep playing", "Use the solver or archive when you want another route forward."],
          ].map(([step, title, text]) => (
            <div key={step} className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">{step}</span>
              <h3 className="mt-4 font-bold text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-bold text-slate-950">Popular tools</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Link href="/strands-hints" className="rounded-md border border-slate-200 p-4 hover:bg-slate-50">NYT Strands hints</Link>
          <Link href="/strands-word-finder" className="rounded-md border border-slate-200 p-4 hover:bg-slate-50">Strands word finder</Link>
          <Link href="/strands-spangram-helper" className="rounded-md border border-slate-200 p-4 hover:bg-slate-50">Strands spangram helper</Link>
        </div>
      </section>

      <FAQ items={faq} />
    </>
  );
}
