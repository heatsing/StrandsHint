"use client";

import { useMemo, useState } from "react";
import { wordBank } from "@/data/word-bank";
import { solveSpellingBee } from "@/lib/word-game-solvers";
import { CopyButton } from "./CopyButton";

export function SpellingBeeSolverClient() {
  const [center, setCenter] = useState("");
  const [outer, setOuter] = useState("");
  const [searched, setSearched] = useState(false);
  const results = useMemo(() => (searched ? solveSpellingBee(wordBank, { center, outer }) : []), [center, outer, searched]);
  const ready = center.replace(/[^A-Za-z]/g, "").length === 1 && outer.replace(/[^A-Za-z]/g, "").length === 6;

  function example() {
    setCenter("E");
    setOuter("ABLTCN");
    setSearched(true);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
          <label className="grid gap-2 text-sm font-bold">
            Center letter
            <input value={center} maxLength={1} onChange={(e) => setCenter(e.target.value.toUpperCase())} className="rounded-lg border border-[#D4CABD] bg-white px-3 py-2 text-center text-2xl font-black outline-none focus:border-[#315C4C] focus:ring-4 focus:ring-[#315C4C]/20" />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            Six outer letters
            <input value={outer} maxLength={6} onChange={(e) => setOuter(e.target.value.toUpperCase())} placeholder="ABLTCN" className="rounded-lg border border-[#D4CABD] bg-white px-3 py-2 text-[#20201E] placeholder:text-[#8A857E] outline-none focus:border-[#315C4C] focus:ring-4 focus:ring-[#315C4C]/20" />
          </label>
        </div>
        {!ready && searched ? <p className="mt-3 text-sm font-semibold text-[#A7473D]">Enter exactly one center letter and six outer letters.</p> : null}
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={() => setSearched(true)} className="rounded-lg bg-[#315C4C] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#274B3E]">Find words</button>
          <button type="button" onClick={example} className="rounded-lg border border-[#D4CABD] bg-[#EDE6DC] px-5 py-2.5 text-sm font-bold hover:bg-[#E3D9CC]">Load example</button>
          <button type="button" onClick={() => { setCenter(""); setOuter(""); setSearched(false); }} className="rounded-lg border border-[#D4CABD] px-5 py-2.5 text-sm font-bold hover:bg-[#EDE6DC]">Clear</button>
        </div>
        <p className="mt-4 text-sm leading-6 text-[#68645E]">
          Words must use only the seven letters, include the center letter, and be at least four letters long. Pangrams use all seven letters.
        </p>
      </div>
      <aside className="rounded-2xl border border-[#E5DED3] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-black">Results</h2>
          <span className="rounded-full bg-[#EDE6DC] px-3 py-1 text-sm font-bold">{results.length}</span>
        </div>
        {searched && results.length ? <div className="mt-4"><CopyButton text={results.map((r: { word: string }) => r.word).join("\n")} /></div> : null}
        <div className="mt-4 grid max-h-96 gap-2 overflow-auto">
          {!searched ? <p className="text-sm text-[#68645E]">Enter letters, then run the solver.</p> : null}
          {searched && !results.length ? <p className="text-sm text-[#68645E]">No words found in the current local word list.</p> : null}
          {results.map((result: { word: string; score: number; pangram: boolean }) => (
            <div key={result.word} className="flex items-center justify-between rounded-xl border border-[#E5DED3] bg-[#FFFDF9] px-3 py-2">
              <span className="font-mono font-bold">{result.word}</span>
              <span className="text-sm text-[#68645E]">{result.pangram ? "Pangram · " : ""}{result.score} pts</span>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
