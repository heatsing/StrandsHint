import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Eye,
  HelpCircle,
  Lightbulb,
  Play,
  ShieldCheck,
  Star,
} from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import type { PuzzleView } from "@/lib/puzzle-data";
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

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function shiftDate(date: string, days: number) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

function wordPreview(word: string) {
  if (word.length <= 3) return `${word.slice(0, 1)}...`;
  return `${word.slice(0, 3)}...`;
}

function buildGrid(puzzle: PuzzleView, rows = 8, cols = 6) {
  const letters = [...puzzle.spangram, ...puzzle.words.join("")].join("").toUpperCase();
  const fallback = "STRANDSHINTPUZZLEHELPERWORDS";
  const source = `${letters}${fallback}`;
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => source[(row * cols + col) % source.length]),
  );
}

function PuzzleGrid({
  puzzle,
  mode,
}: {
  puzzle: PuzzleView;
  mode: "spangram" | "answers";
}) {
  const grid = buildGrid(puzzle);
  const spangramSet = new Set(Array.from({ length: Math.min(puzzle.spangram.length, 12) }, (_, i) => i));
  const answerSet = new Set(Array.from({ length: Math.min(puzzle.words.join("").length, 34) }, (_, i) => i + 3));

  return (
    <div className="mx-auto w-full max-w-[15.5rem] rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-3 shadow-lg shadow-[#315C4C]/10">
      <div className="grid grid-cols-6 gap-1.5">
        {grid.flatMap((row, rowIndex) =>
          row.map((letter, colIndex) => {
            const index = rowIndex * row.length + colIndex;
            const isSpangram = spangramSet.has(index);
            const isAnswer = answerSet.has(index);
            const active = mode === "spangram" ? isSpangram : isSpangram || isAnswer;
            return (
              <span
                key={`${rowIndex}-${colIndex}`}
                className={[
                  "grid aspect-square place-items-center rounded-full text-xs font-black shadow-sm",
                  active
                    ? isSpangram
                      ? "bg-[#F3C330] text-[#142436]"
                      : "bg-[#6CA8E6] text-white"
                    : "bg-white text-[#142436]",
                ].join(" ")}
              >
                {letter}
              </span>
            );
          }),
        )}
      </div>
    </div>
  );
}

function RevealDetails({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <details className={["group", className].join(" ")}>
      <summary className="inline-flex cursor-pointer list-none items-center justify-center gap-2 rounded-xl bg-[#16A66A] px-5 py-3 text-sm font-black text-white shadow-md shadow-[#16A66A]/20 hover:bg-[#0F8F5A] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#16A66A]/25">
        <Eye className="h-4 w-4" />
        <span className="group-open:hidden">{label}</span>
        <span className="hidden group-open:inline">Hide section</span>
      </summary>
      <div className="mt-5">{children}</div>
    </details>
  );
}

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-lg shadow-[#315C4C]/8">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#E9F7F2] text-[#16A66A]">{icon}</span>
        <h2 className="text-xl font-black text-[#16A66A]">{title}</h2>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function PuzzleAnswerContent({ puzzle }: { puzzle: PuzzleView }) {
  const previousDate = shiftDate(puzzle.date, -1);
  const nextDate = shiftDate(puzzle.date, 1);

  return (
    <article className="mx-auto max-w-5xl">
      <JsonLd data={faqSchema} />
      <nav className="text-xs font-semibold text-[#6B7280]" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link prefetch={false} href="/" className="hover:text-[#16A66A]">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link prefetch={false} href="/strands-hints/" className="hover:text-[#16A66A]">
              Strands Today
            </Link>
          </li>
          <li>/</li>
          <li className="text-[#20201E]">Hints &amp; Answers</li>
        </ol>
      </nav>

      <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="rounded-xl bg-[#EEF5FF] p-4 text-sm font-bold text-[#344153]">
          <div className="flex items-center gap-1 text-xs text-[#6B7280]">
            <ArrowLeft className="h-3.5 w-3.5" />
            Previous Day
          </div>
          <p>{formatDate(previousDate)}</p>
        </div>
        <span className="rounded-full border border-[#9DBEF6] bg-[#F6FAFF] px-8 py-3 text-sm font-black text-[#3F6FB5]">
          Today
        </span>
        <div className="rounded-xl bg-[#EEF5FF] p-4 text-right text-sm font-bold text-[#344153]">
          <div className="flex items-center justify-end gap-1 text-xs text-[#6B7280]">
            Next Day
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
          <p>{formatDate(nextDate)}</p>
        </div>
      </div>

      <header className="mt-8 text-center">
        <h1 className="text-balance text-4xl font-black leading-tight text-[#142436] md:text-5xl">
          Strands Hints &amp; Answers for {formatDate(puzzle.date)}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#68645E]">
          Get spoiler-safe help for today&apos;s Strands puzzle. Start with the theme hint, then
          reveal the spangram and full answers only when you are ready.
        </p>
      </header>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_17rem]">
        <div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-lg shadow-[#315C4C]/8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-[#8BD8F7] to-[#F8CE45] text-3xl font-black text-[#142436] shadow-sm">
                SH
              </span>
              <div>
                <h2 className="text-lg font-black text-[#142436]">Today&apos;s Strands Puzzle</h2>
                <p className="mt-2 flex items-center gap-2 text-sm text-[#68645E]">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(puzzle.date)}
                </p>
                <p className="mt-2 text-sm text-[#68645E]">
                  Theme: <span className="font-black text-[#16A66A]">{puzzle.themeHint}</span>
                </p>
              </div>
            </div>
            <Link
              prefetch={false}
              href="/strands-solver/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#16A66A] px-6 py-3 text-sm font-black text-white hover:bg-[#0F8F5A]"
            >
              <Play className="h-4 w-4 fill-white" />
              Open Solver
            </Link>
          </div>
        </div>

        <aside className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-lg shadow-[#315C4C]/8">
          <h2 className="text-lg font-black text-[#142436]">About Strands</h2>
          <p className="mt-3 text-sm leading-6 text-[#68645E]">
            Find hidden words using connected letters. The theme connects the answers, and the
            spangram ties the board together.
          </p>
          <Link prefetch={false} href="/strands-hints/" className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#16A66A]">
            How to play <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_17rem]">
        <div className="grid gap-5">
          <SectionCard icon={<Lightbulb className="h-5 w-5" />} title="Today&apos;s Strands Hint">
            <div className="rounded-xl bg-[#ECF8F2] p-5 text-sm leading-7 text-[#344153]">
              This theme is about: <span className="font-black text-[#142436]">{puzzle.themeHint}</span>
            </div>
            <div className="mt-6 text-center">
              <p className="text-xs font-semibold text-[#8A857E]">
                Reveal the theme clue first, then continue only if you want more.
              </p>
              <div className="mt-4 flex justify-center gap-2">
                {Array.from({ length: Math.min(puzzle.spangram.length, 12) }).map((_, index) => (
                  <span key={index} className="grid h-8 w-8 place-items-center rounded-lg border border-[#E5DED3] bg-white text-xs font-black text-[#B8B1A8]">
                    ?
                  </span>
                ))}
              </div>
              <RevealDetails label="Reveal Spangram Hint" className="mt-5">
                <div className="rounded-xl border border-[#D6EFE4] bg-white p-5 text-left text-sm leading-7 text-[#344153]">
                  <p>{puzzle.spangramHint1}</p>
                  <p className="mt-2">{puzzle.spangramHint2}</p>
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-[#16A66A]">
                    Direction: {puzzle.spangramDirection}
                  </p>
                </div>
              </RevealDetails>
            </div>
          </SectionCard>

          <SectionCard icon={<Star className="h-5 w-5" />} title="Today&apos;s Strands Spangram">
            <div className="grid gap-6 md:grid-cols-[0.85fr_1fr] md:items-center">
              <div className="rounded-2xl bg-white p-6 text-center">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#68645E]">Today&apos;s Spangram</p>
                <RevealDetails label="Reveal Spangram" className="mt-5">
                  <p className="break-words text-3xl font-black uppercase tracking-wide text-[#16A66A]">
                    {puzzle.spangram}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[#68645E]">
                    This spangram captures the theme and gives the puzzle its center line.
                  </p>
                </RevealDetails>
              </div>
              <PuzzleGrid puzzle={puzzle} mode="spangram" />
            </div>
          </SectionCard>

          <SectionCard icon={<HelpCircle className="h-5 w-5" />} title="Hints for Today&apos;s Theme Words">
            <p className="text-sm leading-6 text-[#68645E]">
              Click a clue to reveal one theme word. These are separate from the full answer reveal.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {puzzle.wordList.map((word, index) => (
                <details key={word} className="group rounded-xl border border-[#E5DED3] bg-white p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-black text-[#68645E]">
                    {wordPreview(word)}
                    <Eye className="h-4 w-4 text-[#16A66A]" />
                  </summary>
                  <p className="mt-3 text-sm font-black uppercase text-[#142436]">{word}</p>
                  {puzzle.hintList[index] ? (
                    <p className="mt-1 text-xs leading-5 text-[#68645E]">{puzzle.hintList[index]}</p>
                  ) : null}
                </details>
              ))}
            </div>
          </SectionCard>

          <SectionCard icon={<CheckCircle2 className="h-5 w-5" />} title="Today&apos;s Strands Answers">
            <p className="text-sm leading-6 text-[#68645E]">
              Full theme words and spangram stay hidden until you choose to reveal them.
            </p>
            <RevealDetails label="Reveal All Answers" className="mt-5">
              <div className="grid gap-6 md:grid-cols-[0.85fr_1fr] md:items-center">
                <div className="rounded-2xl bg-white p-6 text-center">
                  <p className="rounded-t-xl bg-[#EAF2FF] py-3 text-xs font-black uppercase tracking-[0.12em] text-[#142436]">
                    Today&apos;s Theme
                  </p>
                  <p className="mt-5 text-xl font-black text-[#142436]">{puzzle.themeHint}</p>
                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    {[puzzle.spangram, ...puzzle.wordList].map((word) => (
                      <span key={word} className="rounded-lg bg-[#F3F0E9] px-3 py-2 font-mono text-xs font-black uppercase text-[#142436]">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
                <PuzzleGrid puzzle={puzzle} mode="answers" />
              </div>
            </RevealDetails>
          </SectionCard>
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-lg shadow-[#315C4C]/8">
            <h2 className="text-lg font-black text-[#142436]">Today&apos;s Puzzle Stats</h2>
            <dl className="mt-5 grid gap-4 text-sm">
              <div>
                <dt className="text-[#68645E]">Theme</dt>
                <dd className="mt-1 font-black text-[#16A66A]">{puzzle.themeHint}</dd>
              </div>
              <div>
                <dt className="text-[#68645E]">Spangram</dt>
                <dd className="mt-1 font-black text-[#16A66A]">{puzzle.spangram.length} letters</dd>
              </div>
              <div>
                <dt className="text-[#68645E]">Theme Words</dt>
                <dd className="mt-1 font-black text-[#142436]">{puzzle.wordList.length}</dd>
              </div>
              <div>
                <dt className="text-[#68645E]">Difficulty</dt>
                <dd className="mt-2">
                  <DifficultyBadge difficulty={puzzle.difficulty} />
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-lg shadow-[#315C4C]/8">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-[#16A66A]" />
              <h2 className="text-lg font-black text-[#142436]">Spoiler Safe</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#68645E]">
              Open only the help you need. The full word list is separated from the hint cards.
            </p>
          </div>
        </aside>
      </div>

      <section className="mx-auto mt-12 max-w-4xl">
        <h2 className="text-center text-2xl font-black text-[#142436]">Frequently Asked Questions</h2>
        <div className="mt-5 divide-y divide-[#E5DED3] overflow-hidden rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] shadow-sm">
          {faqItems.map(([question, answer]) => (
            <details key={question} className="group p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-[#142436]">
                {question}
                <ArrowRight className="h-4 w-4 text-[#16A66A] transition group-open:rotate-90" />
              </summary>
              <p className="mt-3 text-sm leading-6 text-[#68645E]">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
        <Link prefetch={false} href="/strands-hints/" className="rounded-xl border border-[#D4CABD] bg-[#FFFDF9] px-4 py-2 font-black hover:bg-[#EDE6DC]">
          Back to hints
        </Link>
        <Link prefetch={false} href="/strands-solver/" className="rounded-xl border border-[#D4CABD] bg-[#FFFDF9] px-4 py-2 font-black hover:bg-[#EDE6DC]">
          Try the solver
        </Link>
        <Link prefetch={false} href="/strands-word-finder/" className="rounded-xl border border-[#D4CABD] bg-[#FFFDF9] px-4 py-2 font-black hover:bg-[#EDE6DC]">
          Open word finder
        </Link>
        <Link prefetch={false} href="/archive/" className="rounded-xl border border-[#D4CABD] bg-[#FFFDF9] px-4 py-2 font-black hover:bg-[#EDE6DC]">
          Browse archive
        </Link>
      </section>

      <p className="mt-8 text-center text-sm leading-6 text-[#68645E]">
        This site is an independent fan-made helper and is not affiliated with The New York Times.
      </p>
    </article>
  );
}
