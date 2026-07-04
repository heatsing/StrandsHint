import Link from "next/link";
import type { Puzzle } from "@/lib/puzzles";
import { formatDisplayDate } from "@/lib/puzzles";

type Props = {
  puzzle: Puzzle;
  href?: string;
};

export function PuzzleCard({ puzzle, href = `/answers/${puzzle.date}/` }: Props) {
  return (
    <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-stone-500">{formatDisplayDate(puzzle.date)}</p>
      <h2 className="mt-2 text-2xl font-semibold text-stone-950">{puzzle.theme}</h2>
      <p className="mt-3 text-sm text-stone-600">Difficulty {puzzle.difficulty}/5</p>
      <Link
        href={href}
        className="mt-5 inline-flex rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
      >
        Open puzzle
      </Link>
    </article>
  );
}
