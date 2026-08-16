import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { PuzzleAnswerContent } from "@/components/PuzzleAnswerContent";
import { getPublishedPuzzles, getPuzzleByDate } from "@/lib/puzzle-data";
import { breadcrumbSchema } from "@/lib/seo";

type Props = { params: Promise<{ date: string }> };

function metaDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function generateStaticParams() {
  return getPublishedPuzzles().map((puzzle) => ({ date: puzzle.date }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  const puzzle = await getPuzzleByDate(date);
  if (!puzzle) return { title: "Archive puzzle not found" };
  return {
    title: `NYT Strands Hints & Answers ${metaDate(puzzle.date)}`,
    description: puzzle.seoDescription,
    alternates: { canonical: `/archive/${date}` },
  };
}

export default async function ArchiveDatePage({ params }: Props) {
  const { date } = await params;
  const puzzle = await getPuzzleByDate(date);
  if (!puzzle) notFound();
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Archive", url: "/archive" }, { name: puzzle.dateLabel, url: `/archive/${puzzle.date}` }])} />
      <PuzzleAnswerContent puzzle={puzzle} />
    </>
  );
}
