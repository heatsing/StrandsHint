import type { Metadata } from "next";
import { FAQ } from "@/components/FAQ";
import { JsonLd } from "@/components/JsonLd";
import { SolverTool } from "@/components/SolverTool";
import { breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Strands Solver - Find Words in Any Strands Grid",
  description:
    "Paste a 6x8 Strands grid and find possible connected words using a local dictionary and DFS search.",
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
      <div className="mt-8"><SolverTool /></div>
      <FAQ items={[{ question: "Does the solver guarantee official answers?", answer: "No. It finds connected dictionary words that may fit your grid." }]} />
    </>
  );
}
