import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PuzzleAnswerContent } from "@/components/PuzzleAnswerContent";
import { getPublishedPuzzles, getTodayPuzzle } from "@/lib/puzzle-data";
import { breadcrumbSchema } from "@/lib/seo";

function metaDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export async function generateMetadata(): Promise<Metadata> {
  const puzzle = await getTodayPuzzle();
  const dateLabel = puzzle ? metaDate(puzzle.date) : "Today";
  return {
    title: `Today's Strands Hint & Answer ${dateLabel}`,
    description:
      "Reveal today's Strands theme hint, spangram hint, spangram, and answer list one step at a time.",
    alternates: { canonical: "/todays-strands-answer" },
  };
}

export default async function TodaysAnswerPage() {
  const puzzle = await getTodayPuzzle();
  const recentPuzzles = getPublishedPuzzles();
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Today's Strands Answer", url: "/todays-strands-answer" },
        ])}
      />
      {puzzle ? (
        <PuzzleAnswerContent puzzle={puzzle} recentPuzzles={recentPuzzles} mode="today" />
      ) : (
        <p>No published puzzle yet.</p>
      )}
    </>
  );
}
