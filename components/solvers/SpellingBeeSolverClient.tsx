"use client";

import { useMemo, useState } from "react";
import { Pencil, RefreshCw, Search } from "lucide-react";
import { spellingBeeWordBank } from "@/data/tool-word-banks";
import { solveSpellingBee } from "@/lib/word-game-solvers";
import { CopyButton } from "./CopyButton";

export function SpellingBeeSolverClient() {
  const [center, setCenter] = useState("");
  const [outer, setOuter] = useState("");
  const [searched, setSearched] = useState(false);
  const results = useMemo(() => (searched ? solveSpellingBee(spellingBeeWordBank, { center, outer }) : []), [center, outer, searched]);
  const ready = center.replace(/[^A-Za-z]/g, "").length === 1 && outer.replace(/[^A-Za-z]/g, "").length === 6;
  const outerLetters = outer.padEnd(6, " ").slice(0, 6).split("");

  function updateOuter(index: number, value: string) {
    const next = outerLetters.slice();
    next[index] = value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 1) || " ";
    setOuter(next.join("").replace(/\s/g, ""));
    setSearched(false);
  }

  return (
    <div className="min-w-0 rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-xl shadow-[#315C4C]/10">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#008F83] text-white">
          <Pencil className="h-5 w-5" />
        </span>
        <h2 className="text-xl font-black text-[#142436]">Enter Letters</h2>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm font-black text-[#24333A]">Center Letter (Required)</p>
        <label className="relative mx-auto mt-4 grid h-24 w-24 place-items-center">
          <span className="absolute inset-0 rotate-12 rounded-[1.7rem] border-[6px] border-[#E8A300]" />
          <span className="absolute inset-3 rounded-[1.2rem] bg-white shadow-inner" />
          <input
            value={center}
            maxLength={1}
            aria-label="Center letter"
            onChange={(event) => {
              setCenter(event.target.value.toUpperCase().replace(/[^A-Z]/g, ""));
              setSearched(false);
            }}
            className="relative z-10 h-16 w-16 bg-transparent text-center text-3xl font-black text-[#142436] outline-none"
            placeholder="A"
          />
        </label>

        <p className="mt-8 text-sm font-black text-[#24333A]">Outer Letters (6 letters)</p>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {outerLetters.map((letter, index) => (
            <input
              key={index}
              value={letter.trim()}
              maxLength={1}
              aria-label={`Outer letter ${index + 1}`}
              onChange={(event) => updateOuter(index, event.target.value)}
              placeholder={`${index + 1}`}
              className="h-14 w-14 rounded-lg border border-[#008F83] bg-white text-center text-lg font-black text-[#142436] outline-none placeholder:text-[#24333A] focus:border-[#E8A300] focus:ring-4 focus:ring-[#E8A300]/20"
            />
          ))}
        </div>
      </div>

      {!ready && searched ? (
        <p className="mt-5 text-sm font-semibold text-[#A7473D]">Enter exactly one center letter and six outer letters.</p>
      ) : null}

      <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
        <button
          type="button"
          onClick={() => setSearched(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#E8A300] px-6 py-4 text-sm font-black text-white shadow-sm hover:bg-[#D99A00]"
        >
          <Search className="h-5 w-5" />
          Find All Words
        </button>
        <button
          type="button"
          onClick={() => {
            setCenter("");
            setOuter("");
            setSearched(false);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#008F83] bg-white px-6 py-4 text-sm font-black text-[#008F83] hover:bg-[#F1FAF8]"
        >
          <RefreshCw className="h-5 w-5" />
          Reset
        </button>
      </div>

      <div className="mt-6 rounded-xl border border-[#E5DED3] bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-black text-[#142436]">Word Results</h3>
          <span className="rounded-full bg-[#EDE6DC] px-3 py-1 text-sm font-bold">{results.length}</span>
        </div>
        {!ready && searched ? (
          <p className="mt-3 text-sm text-[#68645E]">Fix the letter inputs, then run the solver again.</p>
        ) : null}
        {searched && results.length ? (
          <div className="mt-4">
            <CopyButton text={results.map((result: { word: string }) => result.word).join("\n")} />
          </div>
        ) : null}
        <div className="mt-4 grid max-h-96 gap-2 overflow-auto">
          {!searched ? <p className="text-sm text-[#68645E]">Enter letters, then run the solver.</p> : null}
          {searched && !results.length ? <p className="text-sm text-[#68645E]">No words found in the current local word list.</p> : null}
          {results.map((result: { word: string; score: number; pangram: boolean }) => (
            <div key={result.word} className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-[#E5DED3] bg-[#FFFDF9] px-3 py-2">
              <span className="break-all font-mono font-bold">{result.word}</span>
              <span className="shrink-0 text-sm text-[#68645E]">
                {result.pangram ? "Pangram - " : ""}
                {result.score} pts
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
