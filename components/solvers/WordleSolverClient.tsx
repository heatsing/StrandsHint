"use client";

import { useMemo, useState } from "react";
import { wordBank } from "@/data/word-bank";
import { explainWordleLogic, solveWordle } from "@/lib/word-game-solvers";
import { CopyButton } from "./CopyButton";

export function WordleSolverClient() {
  const [length, setLength] = useState("5");
  const [pattern, setPattern] = useState("");
  const [includes, setIncludes] = useState("");
  const [misplaced, setMisplaced] = useState("");
  const [excluded, setExcluded] = useState("");
  const [searched, setSearched] = useState(false);

  const results = useMemo(
    () => (searched ? solveWordle(wordBank, { length: Number(length), pattern, includes, misplaced, excluded }) : []),
    [searched, length, pattern, includes, misplaced, excluded],
  );
  const validLength = Number(length) >= 3 && Number(length) <= 12;

  function loadExample() {
    setLength("5");
    setPattern("A__LE");
    setIncludes("P");
    setMisplaced("");
    setExcluded("RT");
    setSearched(true);
  }

  function clear() {
    setPattern("");
    setIncludes("");
    setMisplaced("");
    setExcluded("");
    setSearched(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold">
            Word length
            <input
              value={length}
              onChange={(event) => setLength(event.target.value.replace(/\D/g, ""))}
              className="rounded-lg border border-[#D4CABD] bg-white px-3 py-2 text-[#20201E] outline-none focus:border-[#315C4C] focus:ring-4 focus:ring-[#315C4C]/20"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            Pattern
            <input
              value={pattern}
              onChange={(event) => setPattern(event.target.value.toUpperCase())}
              placeholder="A__LE"
              className="rounded-lg border border-[#D4CABD] bg-white px-3 py-2 text-[#20201E] placeholder:text-[#8A857E] outline-none focus:border-[#315C4C] focus:ring-4 focus:ring-[#315C4C]/20"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            Must include
            <input
              value={includes}
              onChange={(event) => setIncludes(event.target.value.toUpperCase())}
              placeholder="AE"
              className="rounded-lg border border-[#D4CABD] bg-white px-3 py-2 text-[#20201E] placeholder:text-[#8A857E] outline-none focus:border-[#315C4C] focus:ring-4 focus:ring-[#315C4C]/20"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            Misplaced letters
            <input
              value={misplaced}
              onChange={(event) => setMisplaced(event.target.value.toUpperCase())}
              placeholder="A:1 E:4"
              className="rounded-lg border border-[#D4CABD] bg-white px-3 py-2 text-[#20201E] placeholder:text-[#8A857E] outline-none focus:border-[#315C4C] focus:ring-4 focus:ring-[#315C4C]/20"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold sm:col-span-2">
            Excluded letters
            <input
              value={excluded}
              onChange={(event) => setExcluded(event.target.value.toUpperCase())}
              placeholder="RST"
              className="rounded-lg border border-[#D4CABD] bg-white px-3 py-2 text-[#20201E] placeholder:text-[#8A857E] outline-none focus:border-[#315C4C] focus:ring-4 focus:ring-[#315C4C]/20"
            />
          </label>
        </div>
        {!validLength ? <p className="mt-3 text-sm font-semibold text-[#A7473D]">Choose a length from 3 to 12.</p> : null}
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setSearched(true)}
            disabled={!validLength}
            className="rounded-lg bg-[#315C4C] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#274B3E] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Find possible words
          </button>
          <button type="button" onClick={loadExample} className="rounded-lg border border-[#D4CABD] bg-[#EDE6DC] px-5 py-2.5 text-sm font-bold hover:bg-[#E3D9CC]">
            Load example
          </button>
          <button type="button" onClick={clear} className="rounded-lg border border-[#D4CABD] px-5 py-2.5 text-sm font-bold hover:bg-[#EDE6DC]">
            Clear
          </button>
        </div>
        <p className="mt-4 text-sm leading-6 text-[#68645E]">
          {explainWordleLogic({ length: Number(length), pattern, includes, misplaced, excluded })}
        </p>
      </div>
      <aside className="rounded-2xl border border-[#E5DED3] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-black">Matches</h2>
          <span className="rounded-full bg-[#EDE6DC] px-3 py-1 text-sm font-bold">{results.length}</span>
        </div>
        {searched && results.length ? <div className="mt-4"><CopyButton text={results.join("\n")} /></div> : null}
        <div className="mt-4 flex max-h-96 flex-wrap gap-2 overflow-auto">
          {!searched ? <p className="text-sm text-[#68645E]">Enter clues, then run the solver.</p> : null}
          {searched && !results.length ? <p className="text-sm text-[#68645E]">No matches. Remove one filter or check repeated letters.</p> : null}
          {results.map((word: string) => (
            <span key={word} className="rounded-full border border-[#E5DED3] bg-[#FFFDF9] px-3 py-1.5 font-mono text-sm font-bold">
              {word}
            </span>
          ))}
        </div>
      </aside>
    </div>
  );
}
