"use client";

import { useMemo, useState } from "react";
import { RefreshCw, Search, SlidersHorizontal } from "lucide-react";
import { wordBank } from "@/data/word-bank";
import { CopyButton } from "./CopyButton";

function normalizePattern(value: string) {
  return value.toUpperCase().replace(/[^A-Z?_]/g, "").replace(/_/g, "?");
}

function normalizeLetters(value: string) {
  return value.toUpperCase().replace(/[^A-Z]/g, "");
}

function matchesPattern(word: string, pattern: string) {
  if (!pattern) return true;
  if (word.length !== pattern.length) return false;
  for (let index = 0; index < pattern.length; index += 1) {
    const letter = pattern[index];
    if (letter !== "?" && word[index] !== letter) return false;
  }
  return true;
}

function clueScore(word: string, clue: string) {
  const terms = clue
    .toUpperCase()
    .split(/[^A-Z]+/)
    .filter((term) => term.length >= 3);
  if (!terms.length) return 0;
  return terms.reduce((score, term) => score + (word.includes(term) ? 4 : 0) + (term.includes(word) ? 2 : 0), 0);
}

export function CrosswordSolverClient() {
  const [clue, setClue] = useState("");
  const [pattern, setPattern] = useState("");
  const [startsWith, setStartsWith] = useState("");
  const [endsWith, setEndsWith] = useState("");
  const [contains, setContains] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searched, setSearched] = useState(false);

  const results = useMemo(() => {
    if (!searched) return [];
    const cleanPattern = normalizePattern(pattern);
    const start = normalizeLetters(startsWith);
    const end = normalizeLetters(endsWith);
    const required = normalizeLetters(contains);
    return Array.from(new Set(wordBank.map((word) => normalizeLetters(word)).filter(Boolean)))
      .filter((word) => word.length >= 3)
      .filter((word) => matchesPattern(word, cleanPattern))
      .filter((word) => !start || word.startsWith(start))
      .filter((word) => !end || word.endsWith(end))
      .filter((word) => !required || word.includes(required))
      .sort((a, b) => clueScore(b, clue) - clueScore(a, clue) || a.length - b.length || a.localeCompare(b))
      .slice(0, 160);
  }, [clue, pattern, startsWith, endsWith, contains, searched]);

  function reset() {
    setClue("");
    setPattern("");
    setStartsWith("");
    setEndsWith("");
    setContains("");
    setSearched(false);
  }

  return (
    <div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-xl shadow-[#315C4C]/10">
      <label className="grid gap-3 text-lg font-black text-[#142436]">
        Enter Crossword Clue
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8A96A3]" />
          <input
            value={clue}
            onChange={(event) => {
              setClue(event.target.value);
              setSearched(false);
            }}
            placeholder="Enter the crossword clue (e.g., 'Game that tests ingenuity')"
            className="h-14 w-full rounded-xl border border-[#D4CABD] bg-white pl-12 pr-5 text-[#20201E] outline-none placeholder:text-[#8A857E] focus:border-[#008F83] focus:ring-4 focus:ring-[#008F83]/20"
          />
        </div>
      </label>

      <label className="mt-6 grid gap-3 text-lg font-black text-[#142436]">
        Letter Pattern (Optional)
        <input
          value={pattern}
          onChange={(event) => {
            setPattern(normalizePattern(event.target.value));
            setSearched(false);
          }}
          placeholder="Enter known letters with ? for unknowns (e.g., P?ZZ?E)"
          className="h-14 rounded-xl border border-[#D4CABD] bg-white px-5 font-mono text-[#20201E] outline-none placeholder:text-[#8A857E] focus:border-[#008F83] focus:ring-4 focus:ring-[#008F83]/20"
        />
      </label>
      <p className="mt-3 text-sm font-medium text-[#4A5968]">Use ? for unknown letters, _ for spaces.</p>

      <div className="mt-5 rounded-xl border border-[#E5DED3] bg-white p-4">
        <button
          type="button"
          onClick={() => setShowAdvanced((value) => !value)}
          className="flex w-full items-center justify-between gap-4 text-left font-black text-[#142436]"
        >
          <span className="inline-flex items-center gap-3">
            <SlidersHorizontal className="h-5 w-5 text-[#008F83]" />
            Advanced Filters
          </span>
          <span className="text-sm text-[#008F83]">{showAdvanced ? "Hide" : "Show"}</span>
        </button>
        {showAdvanced ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <label className="grid gap-2 text-sm font-bold">
              Starts with
              <input value={startsWith} onChange={(event) => setStartsWith(normalizeLetters(event.target.value))} className="rounded-lg border border-[#D4CABD] bg-white px-3 py-2 outline-none focus:border-[#008F83] focus:ring-4 focus:ring-[#008F83]/20" />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Ends with
              <input value={endsWith} onChange={(event) => setEndsWith(normalizeLetters(event.target.value))} className="rounded-lg border border-[#D4CABD] bg-white px-3 py-2 outline-none focus:border-[#008F83] focus:ring-4 focus:ring-[#008F83]/20" />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Contains
              <input value={contains} onChange={(event) => setContains(normalizeLetters(event.target.value))} className="rounded-lg border border-[#D4CABD] bg-white px-3 py-2 outline-none focus:border-[#008F83] focus:ring-4 focus:ring-[#008F83]/20" />
            </label>
          </div>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_18rem]">
        <button
          type="button"
          onClick={() => setSearched(true)}
          className="inline-flex h-14 items-center justify-center gap-3 rounded-xl bg-[#008F83] px-7 text-base font-black text-white shadow-sm hover:bg-[#00766D]"
        >
          <Search className="h-5 w-5" />
          Solve Clue
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-14 items-center justify-center gap-3 rounded-xl border border-[#D4CABD] bg-white px-7 text-base font-black text-[#142436] hover:bg-[#EDE6DC]"
        >
          <RefreshCw className="h-5 w-5" />
          Reset
        </button>
      </div>

      <section className="mt-7 rounded-xl border border-[#E5DED3] bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-black text-[#142436]">Ranked Solutions</h2>
          <span className="rounded-full bg-[#DFF6F0] px-3 py-1 text-sm font-black text-[#008F83]">{results.length} matches</span>
        </div>
        {searched && results.length ? <div className="mt-4"><CopyButton text={results.join("\n")} /></div> : null}
        <div className="mt-4 flex max-h-72 flex-wrap gap-2 overflow-auto">
          {!searched ? <p className="text-sm leading-6 text-[#68645E]">Enter a clue or pattern, then solve to see candidates.</p> : null}
          {searched && !results.length ? <p className="text-sm leading-6 text-[#68645E]">No matches yet. Try a looser pattern or remove one filter.</p> : null}
          {results.map((word) => (
            <span key={word} className="rounded-full border border-[#E5DED3] bg-[#FFFDF9] px-3 py-1.5 font-mono text-sm font-black text-[#142436]">
              {word}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
