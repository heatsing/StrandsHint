"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, RefreshCw, Search } from "lucide-react";
import { wordFinderWordBanks } from "@/data/tool-word-banks";
import { solveAnagrams } from "@/lib/word-game-solvers";
import { CopyButton } from "./CopyButton";

const scores: Record<string, number> = {
  A: 1, E: 1, I: 1, O: 1, U: 1, L: 1, N: 1, S: 1, T: 1, R: 1,
  D: 2, G: 2,
  B: 3, C: 3, M: 3, P: 3,
  F: 4, H: 4, V: 4, W: 4, Y: 4,
  K: 5,
  J: 8, X: 8,
  Q: 10, Z: 10,
};

function cleanLetters(value: string) {
  return value.toUpperCase().replace(/ /g, "?").replace(/[^A-Z?]/g, "");
}

function cleanPattern(value: string) {
  return value.toUpperCase().replace(/[^A-Z?_]/g, "");
}

function scoreWord(word: string) {
  return word.split("").reduce((total, letter) => total + (scores[letter] || 0), 0);
}

export function ScrabbleSolverClient() {
  const [letters, setLetters] = useState("");
  const [pattern, setPattern] = useState("");
  const [startsWith, setStartsWith] = useState("");
  const [endsWith, setEndsWith] = useState("");
  const [contains, setContains] = useState("");
  const [mustInclude, setMustInclude] = useState("");
  const [length, setLength] = useState("");
  const [excluded, setExcluded] = useState("");
  const [searched, setSearched] = useState(false);

  const results = useMemo(() => {
    if (!searched) return [];
    const cleanLength = Number(length);
    const found = solveAnagrams(wordFinderWordBanks.scrabble, {
      letters,
      minLength: cleanLength || 2,
      maxLength: cleanLength || 15,
      required: `${contains}${mustInclude}`,
      startsWith,
      endsWith,
    }).filter((word: string) => {
      if (excluded && excluded.split("").some((letter) => word.includes(letter))) return false;
      if (!pattern) return true;
      if (word.length !== pattern.length) return false;
      return pattern.split("").every((letter, index) => letter === "?" || letter === "_" || word[index] === letter);
    });
    return [...found].sort((a, b) => scoreWord(b) - scoreWord(a) || b.length - a.length || a.localeCompare(b));
  }, [letters, pattern, startsWith, endsWith, contains, mustInclude, length, excluded, searched]);

  function reset() {
    setLetters("");
    setPattern("");
    setStartsWith("");
    setEndsWith("");
    setContains("");
    setMustInclude("");
    setLength("");
    setExcluded("");
    setSearched(false);
  }

  return (
    <div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-xl shadow-[#315C4C]/10">
      <div className="grid gap-8 lg:grid-cols-[1fr_18rem]">
        <div className="min-w-0">
          <label className="grid gap-3 text-lg font-black text-[#142436]">
            <span className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#008F83] text-sm text-white">1</span>
              Your Letters (Rack)
            </span>
            <input
              value={letters}
              onChange={(event) => {
                setLetters(cleanLetters(event.target.value));
                setSearched(false);
              }}
              placeholder="Enter your letters (e.g., ADEGIRT)"
              className="h-14 rounded-xl border border-[#D4CABD] bg-white px-5 font-mono text-base text-[#20201E] outline-none placeholder:text-[#8A857E] focus:border-[#008F83] focus:ring-4 focus:ring-[#008F83]/20"
            />
          </label>
          <p className="mt-2 text-sm text-[#68645E]">Use ? or spacebar for blank tiles</p>

          <label className="mt-6 grid gap-3 text-lg font-black text-[#142436]">
            <span className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#008F83] text-sm text-white">2</span>
              Board Letters / Pattern (Optional)
            </span>
            <input
              value={pattern}
              onChange={(event) => {
                setPattern(cleanPattern(event.target.value));
                setSearched(false);
              }}
              placeholder="Enter known board letters or pattern (e.g., A??E)"
              className="h-14 rounded-xl border border-[#D4CABD] bg-white px-5 font-mono text-base text-[#20201E] outline-none placeholder:text-[#8A857E] focus:border-[#008F83] focus:ring-4 focus:ring-[#008F83]/20"
            />
          </label>
          <p className="mt-2 text-sm text-[#68645E]">Use ? or _ for any single letter</p>

          <div className="mt-6 border-t border-[#E5DED3] pt-5">
            <h2 className="flex items-center gap-3 text-lg font-black text-[#142436]">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#008F83] text-sm text-white">3</span>
              Advanced Options
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {[
                ["Starts With", startsWith, setStartsWith, "e.g., RE"],
                ["Ends With", endsWith, setEndsWith, "e.g., ING"],
                ["Contains", contains, setContains, "e.g., QUI"],
                ["Word Length", length, setLength, "Any"],
                ["Must Include", mustInclude, setMustInclude, "e.g., AE"],
                ["Exclude Letters", excluded, setExcluded, "e.g., QXZ"],
              ].map(([label, value, setter, placeholder]) => (
                <label key={label as string} className="grid gap-1 text-xs font-black text-[#142436]">
                  {label as string}
                  <input
                    value={value as string}
                    onChange={(event) => {
                      (setter as (next: string) => void)(label === "Word Length" ? event.target.value.replace(/\D/g, "") : cleanLetters(event.target.value));
                      setSearched(false);
                    }}
                    placeholder={placeholder as string}
                    className="h-11 rounded-lg border border-[#D4CABD] bg-white px-3 text-sm outline-none placeholder:text-[#8A857E] focus:border-[#008F83] focus:ring-4 focus:ring-[#008F83]/20"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_12rem]">
            <button
              type="button"
              onClick={() => setSearched(true)}
              className="inline-flex h-14 items-center justify-center gap-3 rounded-xl bg-[#008F83] px-6 text-base font-black text-white shadow-sm hover:bg-[#00766D]"
            >
              <Search className="h-5 w-5" />
              Find Words
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-14 items-center justify-center gap-3 rounded-xl border border-[#D4CABD] bg-white px-6 text-base font-black text-[#008F83] hover:bg-[#F1FAF8]"
            >
              <RefreshCw className="h-5 w-5" />
              Reset
            </button>
          </div>
        </div>

        <aside className="grid content-start gap-5">
          <section className="rounded-xl border border-[#E5DED3] bg-white/70 p-5">
            <h2 className="text-lg font-black text-[#142436]">Quick Help</h2>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-[#344153]">
              {["Enter the letters on your rack.", "Add any board letters already on the board.", "Use ? for blanks or unknown letters.", "Set filters to narrow specific words.", "Click Find Words to see matches ranked by score."].map((tip) => (
                <li key={tip} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#3FA34D]" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-xl border border-[#BCE7E2] bg-[#EAF8F6] p-5">
            <h2 className="text-lg font-black text-[#008F83]">Board-Aware Search</h2>
            <p className="mt-2 text-sm leading-6 text-[#344153]">Use the pattern box to account for board letters and open spaces.</p>
          </section>
        </aside>
      </div>

      {searched ? (
        <section className="mt-7 rounded-xl border border-[#E5DED3] bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-black text-[#142436]">Results</h2>
            <span className="rounded-full bg-[#E7F7F4] px-3 py-1 text-sm font-black text-[#008F83]">{results.length} words</span>
          </div>
          {results.length ? <div className="mt-4"><CopyButton text={results.join("\n")} /></div> : null}
          <div className="mt-4 flex max-h-72 flex-wrap gap-2 overflow-auto">
            {!results.length ? <p className="text-sm leading-6 text-[#68645E]">No matches yet. Try more rack letters, a blank, or wider filters.</p> : null}
            {results.slice(0, 160).map((word: string) => (
              <span key={word} className="rounded-full border border-[#E5DED3] bg-[#FFFDF9] px-3 py-1.5 font-mono text-sm font-black text-[#142436]">
                {word} - {scoreWord(word)}
              </span>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
