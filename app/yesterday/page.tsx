import type { Metadata } from "next";
import { PuzzleDetails } from "@/components/PuzzleDetails";
import { getNextPuzzle, getPreviousPuzzle, getYesterdayPuzzle } from "@/lib/puzzles";
import { pageTitle, puzzleDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageTitle("Yesterday's Strands Hints and Answers"),
  description:
    "Missed yesterday's Strands? Check the theme, hints, spangram, and full answer list.",
  alternates: { canonical: "/yesterday/" },
};

export default function YesterdayPage() {
  const puzzle = getYesterdayPuzzle();

  if (!puzzle) {
    return <p className="text-stone-600">No previous Strands puzzle has been added yet.</p>;
  }

  const previous = getPreviousPuzzle(puzzle.date);
  const next = getNextPuzzle(puzzle.date);

  return (
    <PuzzleDetails
      puzzle={puzzle}
      title="Yesterday's Strands Hints and Answers"
      intro={puzzleDescription(puzzle)}
      crumbs={[{ label: "Yesterday" }]}
      previousDate={previous?.date}
      nextDate={next?.date}
    />
  );
}
