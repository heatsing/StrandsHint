"use client";

import { Search } from "lucide-react";
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

  const results = useMemo(() => {
    const parsed = parseGrid(grid);
    const base = mode === "spangram" ? findSpangramCandidates(parsed, dictionary) : findWordsInGrid(parsed, dictionary);
    return base.filter((result) => {
      if (query && !result.word.includes(query.toUpperCase())) return false;
      if (knownLetters && !knownLetters.toUpperCase().split("").every((letter) => result.word.includes(letter))) return false;
      if (length && result.length !== Number(length)) return false;
      return true;
    });
  }, [grid, knownLetters, length, mode, query]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
      <div className="space-y-4">
        <LetterGridInput value={grid} onChange={setGrid} />
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
      </div>
      <aside>
        <label className="mb-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter results"
            className="w-full text-sm outline-none"
          />
        </label>
        <SolverResultList results={results} />
      </aside>
    </div>
  );
}
