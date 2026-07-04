import type { Metadata } from "next";
import { FAQ } from "@/components/FAQ";
import { JsonLd } from "@/components/JsonLd";
import { SolverTool } from "@/components/SolverTool";
import { breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Strands Spangram Helper",
  description:
    "Find long edge-to-edge word candidates in a Strands grid and see likely spangram directions.",
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
      <div className="mt-8"><SolverTool mode="spangram" /></div>
      <FAQ items={[{ question: "What makes a spangram candidate?", answer: "This helper marks longer words that can connect edge to edge in the grid." }]} />
    </>
  );
}
