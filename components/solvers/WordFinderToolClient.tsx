"use client";

import { useMemo, useState } from "react";
import { RefreshCw, Search, SlidersHorizontal } from "lucide-react";
import { wordBank } from "@/data/word-bank";
import { solveAnagrams } from "@/lib/word-game-solvers";
import { CopyButton } from "./CopyButton";

type Variant = "anagram" | "unscrambler" | "scrabble" | "wordsWithFriends";

const copy = {
  anagram: {
    label: "Enter Word or Phrase",
    placeholder: "Enter word to find anagrams (e.g., LISTEN)",
    button: "Find Anagrams",
    advanced: "Advanced Filters",
    helper: "Use ? or spacebar for blank tiles",
    min: "2",
    max: "15",
  },
  unscrambler: {
    label: "Scrambled Letters",
    placeholder: "Enter scrambled letters (e.g., LISTEN)",
    button: "Unscramble Words",
    advanced: "Advanced Filters",
    helper: "Use ? or spacebar for blank tiles",
    min: "2",
    max: "15",
  },
  scrabble: {
    label: "Your Letters (Rack)",
    placeholder: "Enter your letters (e.g., ABCDEFG)",
    button: "Find Words",
    advanced: "Advanced Options",
    helper: "Use ? or spacebar for blank tiles",
    min: "2",
    max: "15",
  },
  wordsWithFriends: {
    label: "Your Letters",
    placeholder: "Enter your letters (e.g., ABCDEFG)",
    button: "Find Words",
    advanced: "Advanced Options",
    helper: "Use ? or spacebar for blank tiles",
    min: "2",
    max: "15",
  },
} satisfies Record<Variant, Record<string, string>>;

const accents = {
  anagram: "#E34B83",
  unscrambler: "#2F80D8",
  scrabble: "#008F83",
  wordsWithFriends: "#2F80D8",
} satisfies Record<Variant, string>;

function scoreScrabble(word: string) {
  const scores: Record<string, number> = {
    A: 1, E: 1, I: 1, O: 1, U: 1, L: 1, N: 1, S: 1, T: 1, R: 1,
    D: 2, G: 2,
    B: 3, C: 3, M: 3, P: 3,
    F: 4, H: 4, V: 4, W: 4, Y: 4,
    K: 5,
    J: 8, X: 8,
    Q: 10, Z: 10,
  };
  return word.split("").reduce((total, letter) => total + (scores[letter] || 0), 0);
}

function scoreWordsWithFriends(word: string) {
  const scores: Record<string, number> = {
    A: 1, E: 1, I: 1, O: 1, R: 1, S: 1, T: 1,
    D: 2, L: 2, N: 2, U: 2,
    G: 3, H: 3, Y: 3,
    B: 4, C: 4, F: 4, M: 4, P: 4, W: 4,
    V: 5,
    K: 6,
    X: 8,
    J: 10, Q: 10, Z: 10,
  };
  return word.split("").reduce((total, letter) => total + (scores[letter] || 0), 0);
}

export function WordFinderToolClient({ variant }: { variant: Variant }) {
  const [letters, setLetters] = useState("");
  const [minLength, setMinLength] = useState(copy[variant].min);
  const [maxLength, setMaxLength] = useState(copy[variant].max);
  const [required, setRequired] = useState("");
  const [startsWith, setStartsWith] = useState("");
  const [endsWith, setEndsWith] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searched, setSearched] = useState(false);
  const accent = accents[variant];

  const results = useMemo(() => {
    if (!searched) return [];
    const found = solveAnagrams(wordBank, {
      letters,
      minLength: Number(minLength) || 2,
      maxLength: Number(maxLength) || 15,
      required,
      startsWith,
      endsWith,
    });
    if (variant === "scrabble") {
      return [...found].sort((a, b) => scoreScrabble(b) - scoreScrabble(a) || b.length - a.length || a.localeCompare(b));
    }
    if (variant === "wordsWithFriends") {
      return [...found].sort((a, b) => scoreWordsWithFriends(b) - scoreWordsWithFriends(a) || b.length - a.length || a.localeCompare(b));
    }
    return found;
  }, [letters, minLength, maxLength, required, startsWith, endsWith, searched, variant]);

  function reset() {
    setLetters("");
    setRequired("");
    setStartsWith("");
    setEndsWith("");
    setMinLength(copy[variant].min);
    setMaxLength(copy[variant].max);
    setSearched(false);
  }

  return (
    <div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-lg shadow-[#315C4C]/10">
      <label className="grid gap-3 text-lg font-black text-[#142436]">
        {copy[variant].label}
        <input
          value={letters}
          onChange={(event) => setLetters(event.target.value.toUpperCase().replace(/ /g, "?"))}
          placeholder={copy[variant].placeholder}
          className="h-14 rounded-xl border border-[#D4CABD] bg-white px-5 font-mono text-base text-[#20201E] outline-none placeholder:text-[#8A857E] focus:border-[#008F83] focus:ring-4 focus:ring-[#008F83]/20"
        />
      </label>
      <p className="mt-3 text-sm font-medium text-[#4A5968]">{copy[variant].helper}</p>

      <div className="mt-7 rounded-xl border border-[#E5DED3] bg-white p-4">
        <button
          type="button"
          onClick={() => setShowAdvanced((value) => !value)}
          className="flex w-full items-center justify-between gap-4 text-left font-black text-[#142436]"
        >
          <span className="inline-flex items-center gap-3">
            <SlidersHorizontal className="h-5 w-5" style={{ color: accent }} />
            {copy[variant].advanced}
          </span>
          <span className="text-sm" style={{ color: accent }}>{showAdvanced ? "Hide" : "Show"}</span>
        </button>
        {showAdvanced ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">
              Min length
              <input value={minLength} onChange={(event) => setMinLength(event.target.value.replace(/\D/g, ""))} className="rounded-lg border border-[#D4CABD] bg-white px-3 py-2 outline-none focus:border-[#008F83] focus:ring-4 focus:ring-[#008F83]/20" />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Max length
              <input value={maxLength} onChange={(event) => setMaxLength(event.target.value.replace(/\D/g, ""))} className="rounded-lg border border-[#D4CABD] bg-white px-3 py-2 outline-none focus:border-[#008F83] focus:ring-4 focus:ring-[#008F83]/20" />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Must contain
              <input value={required} onChange={(event) => setRequired(event.target.value.toUpperCase())} className="rounded-lg border border-[#D4CABD] bg-white px-3 py-2 outline-none focus:border-[#008F83] focus:ring-4 focus:ring-[#008F83]/20" />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Starts with
              <input value={startsWith} onChange={(event) => setStartsWith(event.target.value.toUpperCase())} className="rounded-lg border border-[#D4CABD] bg-white px-3 py-2 outline-none focus:border-[#008F83] focus:ring-4 focus:ring-[#008F83]/20" />
            </label>
            <label className="grid gap-2 text-sm font-bold sm:col-span-2">
              Ends with
              <input value={endsWith} onChange={(event) => setEndsWith(event.target.value.toUpperCase())} className="rounded-lg border border-[#D4CABD] bg-white px-3 py-2 outline-none focus:border-[#008F83] focus:ring-4 focus:ring-[#008F83]/20" />
            </label>
          </div>
        ) : null}
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-[1fr_11rem]">
        <button
          type="button"
          onClick={() => setSearched(true)}
          className="inline-flex h-14 items-center justify-center gap-3 rounded-xl px-6 text-base font-black text-white shadow-sm"
          style={{ background: variant === "anagram" ? "linear-gradient(90deg,#EA70B0,#F16678)" : variant === "unscrambler" || variant === "wordsWithFriends" ? "linear-gradient(90deg,#2F80D8,#0EA6AA)" : "#008F83" }}
        >
          <Search className="h-5 w-5" />
          {copy[variant].button}
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-14 items-center justify-center gap-3 rounded-xl border border-[#D4CABD] bg-white px-6 text-base font-black text-[#142436] hover:bg-[#EDE6DC]"
        >
          <RefreshCw className="h-5 w-5" />
          Reset
        </button>
      </div>

      <section className="mt-7 rounded-xl border border-[#E5DED3] bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-black text-[#142436]">Results</h2>
          <span className="rounded-full bg-[#E7F7F4] px-3 py-1 text-sm font-black text-[#008F83]">{results.length} words</span>
        </div>
        {searched && results.length ? <div className="mt-4"><CopyButton text={results.join("\n")} /></div> : null}
        <div className="mt-4 flex max-h-72 flex-wrap gap-2 overflow-auto">
          {!searched ? <p className="text-sm leading-6 text-[#68645E]">Enter letters and run the finder to see word candidates.</p> : null}
          {searched && !results.length ? <p className="text-sm leading-6 text-[#68645E]">No matches yet. Try more letters, a wildcard, or wider filters.</p> : null}
          {results.slice(0, 160).map((word) => (
            <span key={word} className="rounded-full border border-[#E5DED3] bg-[#FFFDF9] px-3 py-1.5 font-mono text-sm font-black text-[#142436]">
              {word}{variant === "scrabble" ? ` - ${scoreScrabble(word)}` : ""}{variant === "wordsWithFriends" ? ` - ${scoreWordsWithFriends(word)}` : ""}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
