"use client";

import { Search, Wand2 } from "lucide-react";
import { useMemo, useState } from "react";
import dictionary from "@/public/word-list.json";
import { findSpangramCandidates, findWordsInGrid, parseGrid } from "@/lib/solver";
import { LetterGridInput } from "./LetterGridInput";
import { SolverResultList } from "./SolverResultList";

type Props = {
  mode?: "words" | "spangram";
};

export function SolverTool({ mode = "words" }: Props) {
  const [grid, setGrid] = useState("");
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState("");
  const [knownLetters, setKnownLetters] = useState("");
  const [length, setLength] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const filledLetters = grid.toUpperCase().replace(/[^A-Z]/g, "").length;
  const normalizedQuery = query.toUpperCase().replace(/[^A-Z]/g, "");
  const normalizedKnownLetters = knownLetters.toUpperCase().replace(/[^A-Z]/g, "");

  const results = useMemo(() => {
    if (!hasSearched || filledLetters !== 48) return [];
    const parsed = parseGrid(grid);
    const base = mode === "spangram" ? findSpangramCandidates(parsed, dictionary) : findWordsInGrid(parsed, dictionary);
    return base.filter((result) => {
      if (normalizedQuery && !result.word.includes(normalizedQuery)) return false;
      if (normalizedKnownLetters && !normalizedKnownLetters.split("").every((letter) => result.word.includes(letter))) return false;
      if (length && result.length !== Number(length)) return false;
      return true;
    });
  }, [filledLetters, grid, hasSearched, length, mode, normalizedKnownLetters, normalizedQuery]);
  const readyLabel =
    filledLetters === 48
      ? "Grid complete. Candidates update as you type filters."
      : `${filledLetters}/48 letters filled. Paste a full grid or try the example.`;
  const actionLabel = mode === "spangram" ? "Find spangram candidates" : "Find words";
  const emptyMessage =
    mode === "spangram"
      ? "No spangram candidates yet. Paste a complete 6x8 grid, then run the helper."
      : "No candidates yet. Paste a complete 6x8 grid, then run the solver.";

  function updateGrid(nextGrid: string) {
    setGrid(nextGrid);
    setHasSearched(false);
  }

  function runSearch() {
    setHasSearched(true);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
      <div className="space-y-4">
        <LetterGridInput value={grid} onChange={updateGrid} />
        <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-3">
          <input
            value={theme}
            onChange={(event) => setTheme(event.target.value)}
            placeholder="Optional theme clue"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-800"
          />
          <input
            value={knownLetters}
            onChange={(event) => setKnownLetters(event.target.value)}
            placeholder="Known letters"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-800"
          />
          <input
            value={length}
            onChange={(event) => setLength(event.target.value.replace(/\D/g, ""))}
            placeholder="Word length"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-800"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={runSearch}
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            <Wand2 className="h-4 w-4" />
            {actionLabel}
          </button>
          {hasSearched && filledLetters !== 48 ? (
            <p className="text-sm font-medium text-amber-700" role="alert">
              Add {48 - filledLetters} more letter{48 - filledLetters === 1 ? "" : "s"} to fill the 6x8 grid.
            </p>
          ) : null}
          {hasSearched && filledLetters === 48 ? (
            <p className="text-sm font-medium text-emerald-700" role="status">
              Search complete. Results are sorted by length.
            </p>
          ) : null}
        </div>
      </div>
      <aside>
        <div className="mb-3 rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-950">{readyLabel}</p>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Results run in your browser. The theme clue is kept as context for you while filters
            narrow the candidate list.
          </p>
        </div>
        <label className="mb-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter results"
            className="w-full text-sm outline-none"
          />
        </label>
        <SolverResultList
          results={results}
          emptyMessage={hasSearched && filledLetters === 48 ? "No matching candidates found. Try fewer filters or a different grid." : emptyMessage}
        />
      </aside>
    </div>
  );
}
