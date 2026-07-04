import type { Metadata } from "next";
import Link from "next/link";
import { FAQ } from "@/components/FAQ";
import { JsonLd } from "@/components/JsonLd";
import { SpoilerReveal } from "@/components/SpoilerReveal";
import { getTodayPuzzle } from "@/lib/puzzle-data";
import { breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "NYT Strands Hints Today",
  description: "Spoiler-light strands hints for today's puzzle, with deeper clues hidden until you reveal them.",
  alternates: { canonical: "/strands-hints" },
};

export default async function StrandsHintsPage() {
  const puzzle = await getTodayPuzzle();
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Strands Hints", url: "/strands-hints" }])} />
      <h1 className="text-3xl font-bold text-slate-950">Strands Hints Today</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
        Use these hints when you want a nudge without opening the full Strands answer today.
      </p>
      <div className="mt-8 grid gap-4">
        {puzzle ? (
          <>
            <SpoilerReveal label="Reveal Theme Hint"><p>{puzzle.themeHint}</p></SpoilerReveal>
            <SpoilerReveal label="Reveal Spangram Hint 1"><p>{puzzle.spangramHint1}</p></SpoilerReveal>
            <SpoilerReveal label="Reveal Spangram Hint 2"><p>{puzzle.spangramHint2}</p></SpoilerReveal>
          </>
        ) : (
          <p>No published puzzle yet.</p>
        )}
      </div>
      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link href="/todays-strands-answer" className="rounded-md border border-slate-300 px-4 py-2 hover:bg-slate-50">Reveal today&apos;s answer</Link>
        <Link href="/strands-spangram-helper" className="rounded-md border border-slate-300 px-4 py-2 hover:bg-slate-50">Open spangram helper</Link>
        <Link href="/archive" className="rounded-md border border-slate-300 px-4 py-2 hover:bg-slate-50">Browse archive</Link>
      </div>
      <FAQ items={[{ question: "Can I avoid answers here?", answer: "Yes. This page focuses on hints and keeps direct answers hidden." }]} />
    </>
  );
}
