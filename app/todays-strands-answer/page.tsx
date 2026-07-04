import type { Metadata } from "next";
import { FAQ } from "@/components/FAQ";
import { JsonLd } from "@/components/JsonLd";
import { PuzzleAnswerContent } from "@/components/PuzzleAnswerContent";
import { getTodayPuzzle } from "@/lib/puzzle-data";
import { breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Today's Strands Answer, Hints & Spangram",
  description:
    "Reveal today's Strands theme hint, spangram hint, spangram, and answer list one step at a time.",
  alternates: { canonical: "/todays-strands-answer" },
};

export default async function TodaysAnswerPage() {
  const puzzle = await getTodayPuzzle();
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Today's Strands Answer", url: "/todays-strands-answer" }])} />
      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Today&apos;s Strands Answer, Hints & Spangram</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Start with a theme nudge, then reveal the spangram and full word list only when you are ready.
        </p>
      </header>
      <div className="mt-8">{puzzle ? <PuzzleAnswerContent puzzle={puzzle} /> : <p>No published puzzle yet.</p>}</div>
      <FAQ
        items={[
          { question: "Are answers shown immediately?", answer: "No. Every answer section is hidden behind a Reveal button." },
          { question: "Is this official?", answer: "No. Strands Hint is an independent fan-made helper." },
        ]}
      />
    </>
  );
}
