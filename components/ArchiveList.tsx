import Link from "next/link";
import type { Puzzle } from "@/lib/puzzles";
import { formatDisplayDate } from "@/lib/puzzles";

type Props = {
  puzzles: Puzzle[];
};

export function ArchiveList({ puzzles }: Props) {
  if (puzzles.length === 0) {
    return <p className="text-stone-600">No puzzles have been added for this range yet.</p>;
  }

  return (
    <div className="divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white">
      {puzzles.map((puzzle) => (
        <Link
          key={puzzle.date}
          href={`/answers/${puzzle.date}/`}
          className="grid gap-2 p-4 hover:bg-stone-50 sm:grid-cols-[10rem_1fr_6rem] sm:items-center"
        >
          <span className="text-sm font-medium text-stone-600">{formatDisplayDate(puzzle.date)}</span>
          <span className="font-semibold text-stone-950">{puzzle.theme}</span>
          <span className="text-sm text-stone-500">Level {puzzle.difficulty}</span>
        </Link>
      ))}
    </div>
  );
}
