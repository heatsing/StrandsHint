import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Grid3X3,
  Heart,
  Lightbulb,
  Lock,
  Mail,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  Wrench,
  Zap,
} from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { getTodayPuzzle } from "@/lib/puzzle-data";
import { breadcrumbSchema, disclaimer } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Strands Hint - Today's Strands Hints, Spangram & Solver",
  description:
    "Get spoiler-safe Strands hints, reveal today's answer in layers, and use simple solver tools for any 6x8 letter grid.",
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
    answer: "Hints are layered so you can reveal a theme clue, then spangram help, then answers only when needed.",
  },
  {
    question: "Can I play Strands on this site?",
    answer: "No. Strands Hint is an independent helper with hints, answers, and solving tools.",
  },
  {
    question: "How is the spangram different?",
    answer: "The spangram is the theme answer that spans the board. Our helper only suggests candidates.",
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

const toolCards = [
  {
    href: "/strands-solver",
    Icon: Grid3X3,
    title: "Strands Solver",
    text: "Enter the grid and find all possible words.",
    cta: "Open Solver",
  },
  {
    href: "/strands-spangram-helper",
    Icon: Sparkles,
    title: "Spangram Helper",
    text: "Find all possible spangrams in any direction.",
    cta: "Find Spangrams",
  },
  {
    href: "/strands-word-finder",
    Icon: Search,
    title: "Word Finder",
    text: "Search words by length, pattern or letters.",
    cta: "Find Words",
  },
  {
    href: "/archive",
    Icon: Calendar,
    title: "Archive",
    text: "Browse past hints and answer pages.",
    cta: "View Archive",
  },
];

const gridRows = ["CRANETS", "ALOIHGD", "BWRSLAP", "QUIETYU", "ZXCVBNM", "FJKOPLE"];

function HeroGrid() {
  return (
    <div className="relative mx-auto max-w-[32rem]">
      <div className="rounded-2xl border border-indigo-100 bg-white/90 p-5 shadow-[0_20px_70px_rgba(79,70,229,0.12)]">
        <div className="grid grid-cols-7 gap-3">
          {gridRows.join("").split("").map((letter, index) => {
            const wordA = index >= 3 && index <= 5;
            const wordB = index >= 16 && index <= 19;
            const wordC = index >= 21 && index <= 25;
            const wordD = index === 41;
            return (
              <span
                key={`${letter}-${index}`}
                className={[
                  "flex aspect-square items-center justify-center rounded-full text-lg font-black text-slate-950 shadow-sm ring-1 ring-slate-200",
                  wordA ? "bg-yellow-300 ring-yellow-300" : "",
                  wordB ? "bg-violet-300 ring-violet-300" : "",
                  wordC ? "bg-lime-300 ring-lime-300" : "",
                  wordD ? "bg-sky-300 ring-sky-300" : "",
                  !wordA && !wordB && !wordC && !wordD ? "bg-white" : "",
                ].join(" ")}
              >
                {letter}
              </span>
            );
          })}
        </div>
      </div>
      <div className="absolute -right-7 top-2 hidden w-36 rounded-xl bg-yellow-100 p-4 text-sm shadow-lg ring-1 ring-yellow-200 lg:block">
        <p className="font-bold text-slate-950">Theme Hint</p>
        <p className="mt-2 text-xs leading-5 text-slate-700">Things that make noise</p>
        <p className="mt-1 tracking-widest">•••••</p>
      </div>
      <div className="absolute -right-10 top-36 hidden w-40 rounded-xl bg-violet-100 p-4 text-sm shadow-lg ring-1 ring-violet-200 lg:block">
        <p className="font-bold text-slate-950">Spangram</p>
        <p className="mt-2 font-black">SOUNDWAVES</p>
        <p className="mt-1 tracking-widest">•••••••••</p>
      </div>
      <div className="absolute -right-5 bottom-1 hidden w-40 rounded-xl bg-lime-100 p-4 text-sm shadow-lg ring-1 ring-lime-200 lg:block">
        <p className="font-bold text-slate-950">Words</p>
        <p className="mt-2 text-xs leading-5 text-slate-700">SLAP, QUIET, ECHO, LOUD...</p>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const today = await getTodayPuzzle();

  return (
    <div className="-mt-10">
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }])} />
      <JsonLd data={faqSchema} />

      <section className="grid gap-12 py-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:py-20">
        <div>
          <h1 className="max-w-xl text-5xl font-black leading-tight tracking-tight text-slate-950 sm:text-6xl">
            Strands Hint, Solve <span className="text-indigo-600">Smarter</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Get hints, answers, and smart tools for NYT Strands. Solve today&apos;s puzzle with
            clues, spangrams, and our powerful solver.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/strands-hints" className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700">
              Get Today&apos;s Hint <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/strands-solver" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-950 hover:bg-slate-50">
              <Grid3X3 className="h-4 w-4" /> Try the Solver
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-5 text-sm font-medium text-slate-600">
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-indigo-600" />100% Independent</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-indigo-600" />No NYT Affiliation</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-indigo-600" />Spoiler-Safe</span>
          </div>
        </div>
        <HeroGrid />
      </section>

      <section className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-[0_20px_70px_rgba(79,70,229,0.08)] lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_0.9fr_0.65fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-3 rounded-lg bg-indigo-50 px-4 py-3 text-sm font-medium text-slate-700">
              <Calendar className="h-5 w-5 text-indigo-600" />
              {today?.dateLabel ?? "Today"}
            </div>
            <h2 className="mt-5 text-3xl font-black text-slate-950">Today&apos;s Strands</h2>
            <p className="mt-6 text-sm font-bold text-slate-950">Theme Hint</p>
            <p className="mt-2 text-lg font-black text-slate-950">{today?.themeHint ?? "A spoiler-safe clue is ready."}</p>
            <Link href="/todays-strands-answer" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700">
              View Hints & Answer <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="border-y border-slate-200 py-6 lg:border-x lg:border-y-0 lg:px-10 lg:py-0">
            {[
              ["Reveal in Steps", "Get hints step-by-step without spoiling it all.", Wrench],
              ["Spangram Hint", "Need a nudge? Get help with the spangram.", Sparkles],
              ["Full Answer", "Stuck? Reveal all answers and explanation.", ShieldCheck],
            ].map(([title, text, Icon]) => (
              <div key={title as string} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-100 text-indigo-600">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-950">{title as string}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{text as string}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            {["Theme Hint", "Spangram Hint", "Spangram", "All Words"].map((label, index) => (
              <div key={label} className="mb-3 flex items-center justify-between rounded-lg bg-white px-4 py-3 text-sm font-bold text-slate-950 last:mb-0">
                <span className="inline-flex items-center gap-3">
                  <CheckCircle2 className={index < 2 ? "h-5 w-5 text-lime-500" : "h-5 w-5 text-amber-400"} />
                  {label}
                </span>
                <Lock className="h-4 w-4 text-slate-400" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <h2 className="text-center text-3xl font-black text-slate-950">Powerful Tools for Every Player</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {toolCards.map(({ href, Icon, title, text, cta }) => (
            <Link key={title} href={href} className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-xl font-black text-slate-950">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-indigo-600">
                {cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-[calc(50%-50vw)] bg-indigo-50/60 px-4 py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-black text-slate-950">How Strands Hint Works</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {[
              ["1. Get a Hint", "Stuck on today&apos;s puzzle? Reveal hints one step at a time.", Lightbulb],
              ["2. Solve Smarter", "Use our solver and helpers to find words and spangrams.", Grid3X3],
              ["3. Finish Strong", "Learn, improve, and keep your streak going.", Trophy],
            ].map(([title, text, Icon]) => (
              <div key={title as string} className="flex items-center gap-5">
                <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-violet-100 text-indigo-600 ring-1 ring-violet-200">
                  <Icon className="h-9 w-9" />
                </span>
                <div>
                  <h3 className="font-black text-slate-950">{title as string}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{text as string}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <h2 className="text-center text-3xl font-black text-slate-950">Why Players Love Strands Hint</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Independent & Safe", "We are not affiliated with The New York Times.", ShieldCheck],
            ["Fast & Easy", "Clean tools, quick results, and mobile-friendly.", Zap],
            ["Spoiler Control", "You choose what to reveal and when.", Lock],
            ["Made for Players", "Built by puzzle lovers, for puzzle lovers.", Heart],
          ].map(([title, text, Icon]) => (
            <div key={title as string} className="flex gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-100 text-indigo-600">
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-black text-slate-950">{title as string}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text as string}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="border-t border-slate-200 py-10">
        <h2 className="text-3xl font-black text-slate-950">Frequently Asked Questions</h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
          <div className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {faq.map((item) => (
              <details key={item.question} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-slate-950">
                  {item.question}
                  <span className="text-indigo-600 group-open:rotate-180">⌄</span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-8">
            <ShieldCheck className="h-12 w-12 text-indigo-600" />
            <h3 className="mt-5 text-xl font-black text-slate-950">Independent & Fan-Made</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{disclaimer}</p>
          </div>
        </div>
      </section>

      <section className="mb-10 rounded-xl bg-yellow-100 p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_28rem] lg:items-center">
          <div className="flex items-center gap-5">
            <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-white text-indigo-600">
              <Mail className="h-7 w-7" />
            </span>
            <div>
              <h2 className="text-xl font-black text-slate-950">Get Daily Strands Hints</h2>
              <p className="mt-1 text-sm text-slate-700">Join our newsletter and never miss a puzzle.</p>
            </div>
          </div>
          <form className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input className="rounded-lg border border-yellow-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500" placeholder="Enter your email" />
            <button className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700" type="button">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
