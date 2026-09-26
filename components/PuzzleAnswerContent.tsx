import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Eye,
  Grid3X3,
  Lightbulb,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { DailyAnswerSwitcher } from "@/components/daily-answers/DailyAnswerSwitcher";
import { NextPuzzleCountdown } from "@/components/NextPuzzleCountdown";
import type { PuzzleView } from "@/lib/puzzle-data";
import { disclaimer } from "@/lib/seo";
import { DifficultyBadge } from "./DifficultyBadge";

const faqItems = [
  ["What is Strands?", "Strands is a word puzzle where theme words connect through a letter grid."],
  [
    "How do I use this page?",
    "Start with the theme hint, then reveal the spangram hint, spangram, and answers only when needed.",
  ],
  ["What is a spangram?", "A spangram is the long theme answer that ties the rest of the puzzle together."],
  ["Are answers shown immediately?", "No. The spangram and full answers are hidden behind reveal controls."],
  ["Is this an official puzzle page?", "No. Strands Hint is an independent fan-made helper."],
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map(([question, answer]) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

const relatedTools = [
  { href: "/strands-hints/", label: "Strands Hints", Icon: Lightbulb },
  { href: "/strands-solver/", label: "Strands Solver", Icon: Grid3X3 },
  { href: "/strands-spangram-helper/", label: "Spangram Helper", Icon: Sparkles },
  { href: "/strands-word-finder/", label: "Word Finder", Icon: Search },
  { href: "/today/connections-hints/", label: "Connections Hints", Icon: Grid3X3 },
  { href: "/today/wordle-hints/", label: "Wordle Hints", Icon: CheckCircle2 },
  { href: "/archive/", label: "Strands Archive", Icon: CalendarDays },
  { href: "/all-solvers/", label: "All Solvers", Icon: Star },
];

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function shortDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function wordPreview(word: string) {
  if (word.length <= 3) return `${word.slice(0, 1)}...`;
  return `${word.slice(0, 3)}...`;
}

function RevealButton({
  closedLabel,
  openLabel = "Hide",
  tone = "primary",
}: {
  closedLabel: string;
  openLabel?: string;
  tone?: "primary" | "dark" | "soft";
}) {
  const toneClass =
    tone === "dark"
      ? "bg-[#20201E] text-white hover:bg-[#315C4C]"
      : tone === "soft"
        ? "bg-[#EDE6DC] text-[#20201E] hover:bg-[#E3D9CC]"
        : "bg-[#315C4C] text-white hover:bg-[#274B3E]";

  return (
    <summary
      className={[
        "inline-flex cursor-pointer list-none items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold shadow-sm transition",
        toneClass,
      ].join(" ")}
    >
      <Eye className="h-4 w-4" />
      <span className="group-open:hidden">{closedLabel}</span>
      <span className="hidden group-open:inline">{openLabel}</span>
    </summary>
  );
}

function LetterSlots({
  length,
  revealed,
  word,
}: {
  length: number;
  revealed?: boolean;
  word?: string;
}) {
  const letters = revealed && word ? word.toUpperCase().split("") : Array.from({ length }, () => "?");
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {letters.map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          className={[
            "grid h-10 w-10 place-items-center rounded-xl border text-sm font-black uppercase",
            revealed
              ? "border-[#315C4C]/20 bg-[#E9F2EE] text-[#315C4C]"
              : "border-[#E5DED3] bg-white text-[#B8B1A8]",
          ].join(" ")}
        >
          {letter}
        </span>
      ))}
    </div>
  );
}

export function PuzzleAnswerContent({
  puzzle,
  recentPuzzles = [],
  mode = "today",
}: {
  puzzle: PuzzleView;
  recentPuzzles?: PuzzleView[];
  mode?: "today" | "archive";
}) {
  const pastPuzzles = recentPuzzles.filter((item) => item.date !== puzzle.date).slice(0, 8);
  const titlePrefix = mode === "today" ? "Today's Strands Hint & Answer" : "Strands Hint & Answer";

  return (
    <article className="mx-auto max-w-3xl">
      <JsonLd data={faqSchema} />
      <DailyAnswerSwitcher active="strands" />

      <header className="mt-8 text-center">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#315C4C]">
          Spoiler-safe daily page
        </p>
        <h1 className="mt-3 text-balance text-4xl font-black leading-tight text-[#20201E] md:text-5xl">
          {titlePrefix}
        </h1>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#D4CABD] bg-[#FFFDF9] px-4 py-2 text-sm font-bold text-[#315C4C]">
          <CalendarDays className="h-4 w-4" />
          {formatDate(puzzle.date)}
          {puzzle.puzzleNumber ? <span className="text-[#68645E]">· #{puzzle.puzzleNumber}</span> : null}
        </div>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#68645E]">
          Reveal only what you need: theme first, then spangram help, then individual theme words, and
          finally the full answer list.
        </p>
      </header>

      <section className="mt-8 rounded-2xl border border-[#D6E8DF] bg-[#E9F2EE] p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[#315C4C]">
            <Lightbulb className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-black text-[#20201E]">Today&apos;s theme hint</h2>
            <p className="mt-2 text-base leading-7 text-[#315C4C]">
              Think about: <span className="font-black">{puzzle.themeHint}</span>
            </p>
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#F7E9B8] text-[#9A6B24]">
            <Star className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-black text-[#20201E]">Spangram today</h2>
            <p className="text-sm text-[#68645E]">{puzzle.spangram.length} letters · direction {puzzle.spangramDirection}</p>
          </div>
        </div>

        <div className="mt-6">
          <LetterSlots length={Math.min(puzzle.spangram.length, 16)} />
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <details className="group">
            <RevealButton closedLabel="Show spangram hint" tone="soft" />
            <div className="mt-4 max-w-xl rounded-xl border border-[#E5DED3] bg-white p-4 text-left text-sm leading-7 text-[#68645E]">
              <p>{puzzle.spangramHint1}</p>
              <p className="mt-2">{puzzle.spangramHint2}</p>
            </div>
          </details>
          <details className="group">
            <RevealButton closedLabel="Show spangram" tone="dark" />
            <div className="mt-4 space-y-4 text-center">
              <LetterSlots length={puzzle.spangram.length} revealed word={puzzle.spangram} />
              <p className="text-2xl font-black uppercase tracking-wide text-[#315C4C]">{puzzle.spangram}</p>
            </div>
          </details>
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-sm">
        <h2 className="text-lg font-black text-[#20201E]">Theme word hints</h2>
        <p className="mt-2 text-sm leading-6 text-[#68645E]">
          Open one card at a time. Each preview hides the full word until you choose to reveal it.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {(puzzle.wordList.length ? puzzle.wordList : puzzle.hintList).map((item, index) => {
            const word = puzzle.wordList[index];
            const hint = puzzle.hintList[index] || (word ? `A theme word related to "${puzzle.themeHint}".` : item);
            const preview = word ? wordPreview(word) : String(item).slice(0, 8);
            return (
              <details key={`${preview}-${index}`} className="group rounded-xl border border-[#E5DED3] bg-white p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-black text-[#68645E]">
                  <span>
                    Word {index + 1}: <span className="font-mono text-[#20201E]">{preview}</span>
                  </span>
                  <Eye className="h-4 w-4 text-[#315C4C]" />
                </summary>
                <div className="mt-3 space-y-2">
                  {word ? <p className="text-base font-black uppercase tracking-wide text-[#20201E]">{word}</p> : null}
                  <p className="text-sm leading-6 text-[#68645E]">{hint}</p>
                </div>
              </details>
            );
          })}
        </div>
        {!puzzle.wordList.length && puzzle.hintList.length ? (
          <p className="mt-4 text-xs leading-5 text-[#9A6B24]">
            Full theme words are still being verified for this date. Prefixes and hints are shown first.
          </p>
        ) : null}
      </section>

      <section className="mt-5 rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 text-center shadow-sm">
        <h2 className="text-lg font-black text-[#20201E]">Reveal today&apos;s Strands answers</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#68645E]">
          Ready for the complete list? This section keeps the spangram and theme words behind one final reveal.
        </p>
        <details className="group mt-6">
          <RevealButton closedLabel="Show all answers" tone="dark" />
          <div className="mt-6 rounded-2xl border border-[#E5DED3] bg-white p-5 text-left">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#315C4C]">Theme</p>
            <p className="mt-2 text-xl font-black text-[#20201E]">{puzzle.themeHint}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#F7E9B8] px-3 py-1.5 font-mono text-xs font-black uppercase text-[#9A6B24]">
                {puzzle.spangram}
              </span>
              {puzzle.wordList.map((word) => (
                <span key={word} className="rounded-full bg-[#E9F2EE] px-3 py-1.5 font-mono text-xs font-black uppercase text-[#315C4C]">
                  {word}
                </span>
              ))}
            </div>
            {puzzle.spoilerLevelContent ? (
              <p className="mt-5 text-sm leading-6 text-[#68645E]">{puzzle.spoilerLevelContent}</p>
            ) : null}
          </div>
        </details>
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-5 text-center shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#68645E]">Spangram</p>
          <p className="mt-2 text-2xl font-black text-[#20201E]">{puzzle.spangram.length}</p>
          <p className="mt-1 text-sm text-[#68645E]">letters</p>
        </div>
        <div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-5 text-center shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#68645E]">Theme words</p>
          <p className="mt-2 text-2xl font-black text-[#20201E]">{puzzle.wordList.length || puzzle.hintList.length}</p>
          <p className="mt-1 text-sm text-[#68645E]">to find</p>
        </div>
        <div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-5 text-center shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#68645E]">Difficulty</p>
          <div className="mt-3 flex justify-center">
            <DifficultyBadge difficulty={puzzle.difficulty} />
          </div>
        </div>
      </section>

      <div className="mt-8">
        <NextPuzzleCountdown />
      </div>

      <section className="mt-8">
        <h2 className="text-center text-2xl font-black text-[#20201E]">More puzzle helpers</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {relatedTools.map(({ href, label, Icon }) => (
            <Link
              key={href}
              prefetch={false}
              href={href}
              className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-4 text-center shadow-sm transition hover:border-[#315C4C]/30 hover:bg-white"
            >
              <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-[#E9F2EE] text-[#315C4C]">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-3 text-sm font-bold text-[#20201E]">{label}</p>
            </Link>
          ))}
        </div>
      </section>

      {pastPuzzles.length ? (
        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-black text-[#20201E]">Past Strands answers</h2>
            <Link prefetch={false} href="/archive/" className="text-sm font-bold text-[#315C4C] hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 divide-y divide-[#E5DED3] overflow-hidden rounded-2xl border border-[#E5DED3] bg-[#FFFDF9]">
            {pastPuzzles.map((item) => (
              <Link
                key={item.id}
                prefetch={false}
                href={`/archive/${item.date}/`}
                className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-white"
              >
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#68645E]">
                    {shortDate(item.date)}
                  </p>
                  <p className="mt-1 font-bold text-[#20201E]">{item.themeHint}</p>
                </div>
                <DifficultyBadge difficulty={item.difficulty} />
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-10 rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-sm">
        <h2 className="text-2xl font-black text-[#20201E]">How to use today&apos;s Strands page</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-[#68645E]">
          <p>
            Start with the theme hint if you want a gentle push. If that is not enough, open the
            spangram hint before revealing the full spangram. Theme-word cards let you unlock one answer
            at a time instead of spoiling the whole board.
          </p>
          <p>
            When you are ready to check the complete solution, use the final reveal. The archive keeps
            earlier published days so you can revisit yesterday&apos;s board without digging through old
            search results.
          </p>
          <p>{disclaimer}</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-center text-2xl font-black text-[#20201E]">Frequently asked questions</h2>
        <div className="mt-5 divide-y divide-[#E5DED3] overflow-hidden rounded-2xl border border-[#E5DED3] bg-[#FFFDF9]">
          {faqItems.map(([question, answer]) => (
            <details key={question} className="group p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-[#20201E]">
                {question}
                <ArrowRight className="h-4 w-4 text-[#315C4C] transition group-open:rotate-90" />
              </summary>
              <p className="mt-3 text-sm leading-6 text-[#68645E]">{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </article>
  );
}
