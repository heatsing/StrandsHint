import type { Metadata } from "next";
import Link from "next/link";
import { FAQ } from "@/components/FAQ";
import { JsonLd } from "@/components/JsonLd";
import { SolverTool } from "@/components/SolverTool";
import { breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Strands Solver - Find Words in Any Strands Grid",
  description:
    "Paste a 6x8 Strands grid and find possible connected words using a local dictionary and DFS search.",
  alternates: { canonical: "/strands-solver" },
};

export default function StrandsSolverPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Strands Solver", url: "/strands-solver" }])} />
      <h1 className="text-3xl font-bold text-slate-950">Strands Solver</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
        Enter a 6x8 grid, paste 48 letters, then search possible words. This runs locally from a
        word list and does not call an AI API.
      </p>
      <div className="mt-5 grid gap-3 rounded-lg border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600 sm:grid-cols-3">
        <p><strong className="text-slate-950">Paste or type</strong> the 48 letters from your 6x8 grid.</p>
        <p><strong className="text-slate-950">Use filters</strong> for known letters or word length.</p>
        <p><strong className="text-slate-950">Review candidates</strong>; this helper is independent and not official.</p>
      </div>
      <div className="mt-8"><SolverTool /></div>
      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link href="/todays-strands-answer/" className="rounded-md border border-slate-300 px-4 py-2 hover:bg-slate-50">Today&apos;s answer</Link>
        <Link href="/strands-spangram-helper/" className="rounded-md border border-slate-300 px-4 py-2 hover:bg-slate-50">Spangram helper</Link>
      </div>
      <FAQ items={[{ question: "Does the solver guarantee official answers?", answer: "No. It finds connected dictionary words that may fit your grid." }]} />
    </>
  );
}
