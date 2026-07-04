import type { Metadata } from "next";
import { FAQ } from "@/components/FAQ";
import { JsonLd } from "@/components/JsonLd";
import { SolverTool } from "@/components/SolverTool";
import { breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Strands Word Finder",
  description:
    "Use a 6x8 grid word finder to search possible connected words for Strands-style puzzles.",
};

export default function WordFinderPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Strands Word Finder", url: "/strands-word-finder" }])} />
      <h1 className="text-3xl font-bold text-slate-950">Strands Word Finder</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
        A simple word finder for Strands-style grids. Filter by letters, length, or search text to
        narrow the candidate list.
      </p>
      <div className="mt-8"><SolverTool /></div>
      <FAQ items={[{ question: "Can I paste a whole grid?", answer: "Yes. Paste 48 letters and the grid fills itself." }]} />
    </>
  );
}
