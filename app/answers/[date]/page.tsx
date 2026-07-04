import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PuzzleDetails } from "@/components/PuzzleDetails";
import {
  formatDisplayDate,
  getAllPuzzles,
  getNextPuzzle,
  getPreviousPuzzle,
  getPuzzleByDate,
} from "@/lib/puzzles";
import { pageTitle, puzzleDescription } from "@/lib/seo";

type Props = {
  params: { date: string };
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPuzzles().map((puzzle) => ({ date: puzzle.date }));
}

export function generateMetadata({ params }: Props): Metadata {
  const puzzle = getPuzzleByDate(params.date);
  if (!puzzle) return { title: pageTitle("Puzzle not found") };
  const display = formatDisplayDate(puzzle.date);
  const title = pageTitle(`Strands Answers for ${display}`);
  const description = puzzleDescription(puzzle);
  return {
    title,
    description,
    alternates: { canonical: `/answers/${puzzle.date}/` },
    openGraph: { title, description, type: "article" },
  };
}

export default function AnswerPage({ params }: Props) {
  const puzzle = getPuzzleByDate(params.date);
  if (!puzzle) notFound();

  const previous = getPreviousPuzzle(puzzle.date);
  const next = getNextPuzzle(puzzle.date);
  const display = formatDisplayDate(puzzle.date);

  return (
    <PuzzleDetails
      puzzle={puzzle}
      title={`Strands Answers for ${display}`}
      intro={puzzleDescription(puzzle)}
      crumbs={[
        { label: "Archive", href: "/archive/" },
        { label: display },
      ]}
      previousDate={previous?.date}
      nextDate={next?.date}
    />
  );
}
