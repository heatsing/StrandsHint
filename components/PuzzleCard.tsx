import Link from "next/link";
import type { PuzzleView } from "@/lib/puzzle-data";
import { DifficultyBadge } from "./DifficultyBadge";

export function PuzzleCard({ puzzle }: { puzzle: PuzzleView }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{puzzle.dateLabel}</p>
        <DifficultyBadge difficulty={puzzle.difficulty} />
      </div>
      <h2 className="mt-3 text-2xl font-bold text-slate-950">{puzzle.title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{puzzle.themeHint}</p>
      <Link
        href="/todays-strands-answer"
        className="mt-5 inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
      >
        View spoiler-safe hints
      </Link>
    </article>
  );
}
