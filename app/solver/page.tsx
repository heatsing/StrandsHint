import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { pageTitle } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageTitle("Strands Solver"),
  description:
    "A lightweight Strands helper for writing down letters, known word lengths, and notes before checking hints.",
  alternates: { canonical: "/solver/" },
};

export default function SolverPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Solver" }]} />
      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-stone-950">Strands Solver</h1>
        <p className="mt-4 text-lg leading-8 text-stone-600">
          A small workspace for letters and guesses. It does not call an AI service and it does
          not promise official answers.
        </p>
      </header>

      <form className="mt-8 grid gap-5 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-stone-800">Board letters</span>
          <textarea
            rows={6}
            className="rounded-md border border-stone-300 px-3 py-2 font-mono text-sm outline-none focus:border-stone-600"
            placeholder="Paste or type the letters you can see..."
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-stone-800">Known word lengths</span>
          <input
            className="rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-600"
            placeholder="Example: 4, 5, 7"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-stone-800">Notes</span>
          <textarea
            rows={4}
            className="rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-600"
            placeholder="Theme ideas, letters that seem connected, possible spangram..."
          />
        </label>
      </form>

      <section className="mt-10 max-w-3xl border-t border-stone-200 pt-8 text-stone-700">
        <h2 className="text-2xl font-semibold text-stone-950">What this helper does</h2>
        <div className="mt-4 space-y-4 leading-7">
          <p>
            This page is a lightweight scratchpad. It helps you keep track of the board, possible
            word lengths, and guesses without sending anything to a server-side solver.
          </p>
          <p>
            A future version can add a DFS plus dictionary pass: normalize the board, walk adjacent
            letters, filter by length, then rank candidates against the theme. The daily JSON format
            already keeps answers separate, so that upgrade can stay independent from the archive.
          </p>
        </div>
      </section>
    </>
  );
}
