"use client";

import { useMemo, useState } from "react";
import { wordFinderWordBanks } from "@/data/tool-word-banks";
import { solveAnagrams } from "@/lib/word-game-solvers";
import { CopyButton } from "./CopyButton";

export function AnagramSolverClient() {
  const [letters, setLetters] = useState("");
  const [minLength, setMinLength] = useState("3");
  const [maxLength, setMaxLength] = useState("12");
  const [required, setRequired] = useState("");
  const [startsWith, setStartsWith] = useState("");
  const [endsWith, setEndsWith] = useState("");
  const [searched, setSearched] = useState(false);
  const results = useMemo(
    () => searched ? solveAnagrams(wordFinderWordBanks.anagram, { letters, minLength: Number(minLength), maxLength: Number(maxLength), required, startsWith, endsWith }) : [],
    [letters, minLength, maxLength, required, startsWith, endsWith, searched],
  );

  function example() {
    setLetters("REACT?");
    setMinLength("4");
    setMaxLength("6");
    setRequired("A");
    setStartsWith("");
    setEndsWith("");
    setSearched(true);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold sm:col-span-2">
            Letters
            <input value={letters} onChange={(e) => setLetters(e.target.value.toUpperCase())} placeholder="REACT?" className="rounded-lg border border-[#D4CABD] bg-white px-3 py-2 text-[#20201E] placeholder:text-[#8A857E] outline-none focus:border-[#315C4C] focus:ring-4 focus:ring-[#315C4C]/20" />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            Min length
            <input value={minLength} onChange={(e) => setMinLength(e.target.value.replace(/\D/g, ""))} className="rounded-lg border border-[#D4CABD] bg-white px-3 py-2 outline-none focus:border-[#315C4C] focus:ring-4 focus:ring-[#315C4C]/20" />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            Max length
            <input value={maxLength} onChange={(e) => setMaxLength(e.target.value.replace(/\D/g, ""))} className="rounded-lg border border-[#D4CABD] bg-white px-3 py-2 outline-none focus:border-[#315C4C] focus:ring-4 focus:ring-[#315C4C]/20" />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            Must contain
            <input value={required} onChange={(e) => setRequired(e.target.value.toUpperCase())} className="rounded-lg border border-[#D4CABD] bg-white px-3 py-2 outline-none focus:border-[#315C4C] focus:ring-4 focus:ring-[#315C4C]/20" />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            Starts with
            <input value={startsWith} onChange={(e) => setStartsWith(e.target.value.toUpperCase())} className="rounded-lg border border-[#D4CABD] bg-white px-3 py-2 outline-none focus:border-[#315C4C] focus:ring-4 focus:ring-[#315C4C]/20" />
          </label>
          <label className="grid gap-2 text-sm font-bold sm:col-span-2">
            Ends with
            <input value={endsWith} onChange={(e) => setEndsWith(e.target.value.toUpperCase())} className="rounded-lg border border-[#D4CABD] bg-white px-3 py-2 outline-none focus:border-[#315C4C] focus:ring-4 focus:ring-[#315C4C]/20" />
          </label>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={() => setSearched(true)} className="rounded-lg bg-[#315C4C] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#274B3E]">Unscramble letters</button>
          <button type="button" onClick={example} className="rounded-lg border border-[#D4CABD] bg-[#EDE6DC] px-5 py-2.5 text-sm font-bold hover:bg-[#E3D9CC]">Load example</button>
          <button type="button" onClick={() => { setLetters(""); setRequired(""); setStartsWith(""); setEndsWith(""); setSearched(false); }} className="rounded-lg border border-[#D4CABD] px-5 py-2.5 text-sm font-bold hover:bg-[#EDE6DC]">Clear</button>
        </div>
        <p className="mt-4 text-sm leading-6 text-[#68645E]">Use ? as a wildcard. Results are deduplicated and sorted by length first.</p>
      </div>
      <aside className="min-w-0 rounded-2xl border border-[#E5DED3] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-black">Words</h2>
          <span className="rounded-full bg-[#EDE6DC] px-3 py-1 text-sm font-bold">{results.length}</span>
        </div>
        {searched && results.length ? <div className="mt-4"><CopyButton text={results.join("\n")} /></div> : null}
        <div className="mt-4 flex max-h-96 flex-wrap gap-2 overflow-auto">
          {!searched ? <p className="text-sm text-[#68645E]">Enter letters, then unscramble.</p> : null}
          {searched && !results.length ? <p className="text-sm text-[#68645E]">No words found. Try a wildcard or wider length range.</p> : null}
          {results.map((word: string) => (
            <span key={word} className="rounded-full border border-[#E5DED3] bg-[#FFFDF9] px-3 py-1.5 font-mono text-sm font-bold">{word}</span>
          ))}
        </div>
      </aside>
    </div>
  );
}
