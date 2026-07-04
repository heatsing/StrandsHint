"use client";

import type { SolverWord } from "@/lib/solver";

export function SolverResultList({ results }: { results: SolverWord[] }) {
  if (results.length === 0) {
    return <p className="rounded-lg border border-dashed border-slate-300 p-5 text-sm text-slate-500">No candidates yet.</p>;
  }

  return (
    <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
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
  );
}
