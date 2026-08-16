import type { Metadata } from "next";
import Link from "next/link";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { FAQ } from "@/components/FAQ";
import { JsonLd } from "@/components/JsonLd";
import { getPublishedPuzzles } from "@/lib/puzzle-data";
import { breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Strands Archive",
  description:
    "Browse manually published Strands Hint editorial pages. Nothing here is auto-scraped from official puzzle sources.",
  alternates: { canonical: "/archive" },
};

export default async function ArchivePage() {
  const puzzles = await getPublishedPuzzles();
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Archive", url: "/archive" }])} />
      <h1 className="text-3xl font-bold text-slate-950">Strands Archive</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
        Manually entered daily pages for Strands hints and answers. The archive only shows content
        published from the admin area.
      </p>
      <div className="mt-8 grid gap-4">
        {puzzles.length > 0 ? (
          puzzles.map((puzzle) => (
            <Link prefetch={false} key={puzzle.id} href={`/archive/${puzzle.dateLabel}`} className="rounded-lg border border-slate-200 bg-white p-5 hover:bg-slate-50">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">{puzzle.dateLabel}{puzzle.puzzleNumber ? ` - #${puzzle.puzzleNumber}` : ""}</p>
                  <h2 className="mt-1 text-xl font-bold text-slate-950">{puzzle.title}</h2>
                  <p className="mt-2 text-sm text-slate-600">{puzzle.themeHint}</p>
                </div>
                <DifficultyBadge difficulty={puzzle.difficulty} />
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-5 text-sm leading-6 text-slate-500">
            No archive entries are published yet. Check today&apos;s hint page or use the solver while new editorial pages are prepared.
          </div>
        )}
      </div>
      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link prefetch={false} href="/todays-strands-answer" className="rounded-md border border-slate-300 px-4 py-2 hover:bg-slate-50">Today&apos;s answer</Link>
        <Link prefetch={false} href="/strands-solver" className="rounded-md border border-slate-300 px-4 py-2 hover:bg-slate-50">Use solver</Link>
      </div>
      <FAQ items={[{ question: "Is this archive scraped?", answer: "No. Archive entries are manually created and published by an administrator." }]} />
    </>
  );
}
