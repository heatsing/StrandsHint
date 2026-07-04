import Link from "next/link";
import type { PuzzleView } from "@/lib/puzzle-data";
import { DifficultyBadge } from "./DifficultyBadge";
import { SpoilerReveal } from "./SpoilerReveal";

export function PuzzleAnswerContent({ puzzle }: { puzzle: PuzzleView }) {
  return (
    <article className="space-y-5">
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Spoiler warning: open each section only when you want that layer.
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center gap-3">
          <span>{puzzle.dateLabel}</span>
          {puzzle.puzzleNumber ? <span>#{puzzle.puzzleNumber}</span> : null}
          <DifficultyBadge difficulty={puzzle.difficulty} />
        </div>
        <p className="mt-4 text-slate-600">{puzzle.spoilerLevelContent}</p>
      </div>

      <SpoilerReveal label="Reveal Theme Hint">
        <p>{puzzle.themeHint}</p>
      </SpoilerReveal>
      <SpoilerReveal label="Reveal Spangram Hint">
        <div className="space-y-2">
          <p>{puzzle.spangramHint1}</p>
          <p>{puzzle.spangramHint2}</p>
          <p className="text-sm text-slate-500">Direction: {puzzle.spangramDirection}</p>
        </div>
      </SpoilerReveal>
      <SpoilerReveal label="Reveal Spangram">
        <p className="font-mono text-2xl font-bold uppercase tracking-wide">{puzzle.spangram}</p>
      </SpoilerReveal>
      <SpoilerReveal label="Reveal All Answers">
        <ul className="flex flex-wrap gap-2">
          {puzzle.wordList.map((word) => (
            <li key={word} className="rounded-md bg-slate-100 px-3 py-1.5 font-mono text-sm font-bold">
              {word}
            </li>
          ))}
        </ul>
      </SpoilerReveal>
      <SpoilerReveal label="Reveal Word Hints">
        <ol className="list-decimal space-y-2 pl-5">
          {puzzle.hintList.map((hint) => (
            <li key={hint}>{hint}</li>
          ))}
        </ol>
      </SpoilerReveal>

      <div className="flex flex-wrap gap-3 pt-3 text-sm">
        <Link href="/strands-hints" className="rounded-md border border-slate-300 px-4 py-2 hover:bg-slate-50">Back to hints only</Link>
        <Link href="/strands-solver" className="rounded-md border border-slate-300 px-4 py-2 hover:bg-slate-50">Try the solver</Link>
        <Link href="/strands-word-finder" className="rounded-md border border-slate-300 px-4 py-2 hover:bg-slate-50">Open word finder</Link>
        <Link href="/archive" className="rounded-md border border-slate-300 px-4 py-2 hover:bg-slate-50">Browse archive</Link>
      </div>
    </article>
  );
}
