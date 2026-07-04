"use client";

import type { SolverWord } from "@/lib/solver";

export function SolverResultList({ results, emptyMessage = "No candidates yet." }: { results: SolverWord[]; emptyMessage?: string }) {
  if (results.length === 0) {
    return <p className="rounded-lg border border-dashed border-slate-300 p-5 text-sm leading-6 text-slate-500">{emptyMessage}</p>;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-4 text-sm font-semibold text-slate-950">
        {results.length} candidate{results.length === 1 ? "" : "s"} found
      </div>
      <div className="divide-y divide-slate-200">
        {results.map((result) => (
          <div key={result.word} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-mono text-lg font-bold text-slate-950">{result.word}</p>
              <p className="text-xs text-slate-500">
                {result.length} letters{result.direction ? ` - ${result.direction}` : ""}
              </p>
            </div>
            {result.possibleSpangram ? (
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-200">
                possible spangram
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
