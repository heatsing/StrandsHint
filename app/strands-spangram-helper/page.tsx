import type { Metadata } from "next";
import Link from "next/link";
import { FAQ } from "@/components/FAQ";
import { JsonLd } from "@/components/JsonLd";
import { SolverTool } from "@/components/SolverTool";
import { breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Strands Spangram Helper",
  description:
    "Find long edge-to-edge word candidates in a Strands grid and see likely spangram directions.",
  alternates: { canonical: "/strands-spangram-helper" },
};

export default function SpangramHelperPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Spangram Helper", url: "/strands-spangram-helper" }])} />
      <h1 className="text-3xl font-bold text-slate-950">Strands Spangram Helper</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
        Paste your grid to surface longer candidates that connect opposite or outer edges, including
        top to bottom and left to right directions.
      </p>
      <div className="mt-5 rounded-lg border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600">
        A spangram is the theme word or phrase that spans the board. Results here are only possible
        candidates from your letters, not official answers.
      </div>
      <div className="mt-8"><SolverTool mode="spangram" /></div>
      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link prefetch={false} href="/strands-hints/" className="rounded-md border border-slate-300 px-4 py-2 hover:bg-slate-50">Today&apos;s hints</Link>
        <Link prefetch={false} href="/strands-solver/" className="rounded-md border border-slate-300 px-4 py-2 hover:bg-slate-50">Full solver</Link>
      </div>
      <FAQ items={[{ question: "What makes a spangram candidate?", answer: "This helper marks longer words that can connect edge to edge in the grid. It does not guarantee the official answer." }]} />
    </>
  );
}
