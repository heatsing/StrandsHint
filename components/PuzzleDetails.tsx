import Link from "next/link";
import { AnswerList } from "./AnswerList";
import { Breadcrumbs } from "./Breadcrumbs";
import { HintList } from "./HintList";
import { JsonLd } from "./JsonLd";
import { RevealBox } from "./RevealBox";
import type { Puzzle } from "@/lib/puzzles";
import { formatDisplayDate } from "@/lib/puzzles";
import { puzzlePageSchema } from "@/lib/seo";

type Props = {
  puzzle: Puzzle;
  title: string;
  intro: string;
  crumbs?: { label: string; href?: string }[];
  previousDate?: string;
  nextDate?: string;
};

export function PuzzleDetails({ puzzle, title, intro, crumbs = [], previousDate, nextDate }: Props) {
  return (
    <>
      <JsonLd data={puzzlePageSchema(puzzle)} />
      <Breadcrumbs items={crumbs} />
      <article className="space-y-6">
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
            {formatDisplayDate(puzzle.date)}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-lg leading-8 text-stone-600">{intro}</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
          <div className="space-y-4">
            <RevealBox title="Theme">
              <p className="text-xl font-semibold text-stone-950">{puzzle.theme}</p>
            </RevealBox>
            <RevealBox title="Hints" buttonLabel="Reveal hints">
              <HintList hints={puzzle.hints} />
            </RevealBox>
            <RevealBox title="Spangram">
              <p className="font-mono text-xl font-bold uppercase tracking-wide text-stone-950">
                {puzzle.spangram}
              </p>
            </RevealBox>
            <RevealBox title="Answers">
              <AnswerList answers={puzzle.answers} />
            </RevealBox>
          </div>

          <aside className="h-fit rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-stone-950">Puzzle notes</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-stone-500">Puzzle ID</dt>
                <dd className="font-medium text-stone-900">#{puzzle.id}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Difficulty</dt>
                <dd className="font-medium text-stone-900">{puzzle.difficulty}/5</dd>
              </div>
            </dl>
            <p className="mt-5 text-sm leading-6 text-stone-600">{puzzle.editorNote}</p>
          </aside>
        </div>
      </article>

      <nav className="mt-10 flex flex-wrap gap-3 border-t border-stone-200 pt-8 text-sm">
        {previousDate ? (
          <Link className="rounded-md border border-stone-300 bg-white px-4 py-2 hover:bg-stone-50" href={`/answers/${previousDate}/`}>
            Previous puzzle
          </Link>
        ) : null}
        {nextDate ? (
          <Link className="rounded-md border border-stone-300 bg-white px-4 py-2 hover:bg-stone-50" href={`/answers/${nextDate}/`}>
            Next puzzle
          </Link>
        ) : null}
        <Link className="rounded-md border border-stone-300 bg-white px-4 py-2 hover:bg-stone-50" href="/archive/">
          Archive
        </Link>
        <Link className="rounded-md border border-stone-300 bg-white px-4 py-2 hover:bg-stone-50" href="/solver/">
          Solver
        </Link>
      </nav>
    </>
  );
}
