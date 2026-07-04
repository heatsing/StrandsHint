import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FAQ } from "@/components/FAQ";
import { JsonLd } from "@/components/JsonLd";
import { PuzzleAnswerContent } from "@/components/PuzzleAnswerContent";
import { getPuzzleByDate } from "@/lib/puzzle-data";
import { breadcrumbSchema } from "@/lib/seo";

type Props = { params: { date: string } };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const puzzle = await getPuzzleByDate(params.date);
  if (!puzzle) return { title: "Archive puzzle not found" };
  return {
    title: puzzle.seoTitle,
    description: puzzle.seoDescription,
    alternates: { canonical: `/archive/${params.date}` },
  };
}

export default async function ArchiveDatePage({ params }: Props) {
  const puzzle = await getPuzzleByDate(params.date);
  if (!puzzle) notFound();
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Archive", url: "/archive" }, { name: puzzle.dateLabel, url: `/archive/${puzzle.dateLabel}` }])} />
      <h1 className="text-3xl font-bold text-slate-950">{puzzle.title}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{puzzle.seoDescription}</p>
      <div className="mt-8"><PuzzleAnswerContent puzzle={puzzle} /></div>
      <FAQ items={[{ question: "Can I add or edit this page?", answer: "Yes. Use the admin area to update manually entered puzzle content." }]} />
    </>
  );
}
