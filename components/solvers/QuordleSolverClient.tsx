"use client";

import { useMemo, useState } from "react";
import { RefreshCw, Search } from "lucide-react";
import { quordleWordBank } from "@/data/tool-word-banks";
import { solveWordle } from "@/lib/word-game-solvers";
import { CopyButton } from "./CopyButton";

function normalizeLetter(value: string) {
  return value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 1);
}

function cellsToPattern(cells: string[]) {
  return cells.map((letter) => letter || "_").join("");
}

export function QuordleSolverClient() {
  const [green, setGreen] = useState<string[]>(Array(5).fill(""));
  const [yellow, setYellow] = useState<string[]>(Array(5).fill(""));
  const [excluded, setExcluded] = useState("");
  const [searched, setSearched] = useState(false);

  const results = useMemo(() => {
    if (!searched) return [];
    const misplaced = yellow
      .map((letter, index) => (letter ? `${letter}:${index + 1}` : ""))
      .filter(Boolean)
      .join(" ");
    return solveWordle(quordleWordBank, {
      length: 5,
      pattern: cellsToPattern(green),
      includes: yellow.filter(Boolean).join(""),
      misplaced,
      excluded,
    });
  }, [green, yellow, excluded, searched]);

  function updateCell(kind: "green" | "yellow", index: number, value: string) {
    const next = kind === "green" ? green.slice() : yellow.slice();
    next[index] = normalizeLetter(value);
    if (kind === "green") setGreen(next);
    else setYellow(next);
    setSearched(false);
  }

  function reset() {
    setGreen(Array(5).fill(""));
    setYellow(Array(5).fill(""));
    setExcluded("");
    setSearched(false);
  }

  return (
    <div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-xl shadow-[#315C4C]/10">
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr_1.2fr] lg:divide-x lg:divide-[#E5DED3]">
        <section className="lg:pr-6">
          <h2 className="flex items-center gap-3 text-lg font-black text-[#142436]">
            <span className="h-4 w-4 rounded-full bg-[#12A37F]" />
            Known Letters (Green)
          </h2>
          <div className="mt-5 flex flex-wrap gap-4">
            {green.map((letter, index) => (
              <input
                key={`green-${index}`}
                value={letter}
                aria-label={`Green letter ${index + 1}`}
                maxLength={1}
                placeholder={`${index + 1}`}
                onChange={(event) => updateCell("green", index, event.target.value)}
                className="h-14 w-14 rounded-lg border border-[#12A37F] bg-[#E8FFF7] text-center text-lg font-black text-[#008F83] outline-none placeholder:text-[#008F83] focus:ring-4 focus:ring-[#12A37F]/20"
              />
            ))}
          </div>
        </section>

        <section className="lg:px-6">
          <h2 className="flex items-center gap-3 text-lg font-black text-[#142436]">
            <span className="h-4 w-4 rounded-full bg-[#E8A300]" />
            Wrong Position Letters (Yellow)
          </h2>
          <div className="mt-5 flex flex-wrap gap-4">
            {yellow.map((letter, index) => (
              <input
                key={`yellow-${index}`}
                value={letter}
                aria-label={`Yellow letter ${index + 1}`}
                maxLength={1}
                placeholder={`${index + 1}`}
                onChange={(event) => updateCell("yellow", index, event.target.value)}
                className="h-14 w-14 rounded-lg border border-[#E8A300] bg-[#FFF8E7] text-center text-lg font-black text-[#D99A00] outline-none placeholder:text-[#D99A00] focus:ring-4 focus:ring-[#E8A300]/20"
              />
            ))}
          </div>
        </section>

        <label className="grid content-start gap-5 lg:pl-6">
          <span className="flex items-center gap-3 text-lg font-black text-[#142436]">
            <span className="h-4 w-4 rounded-full bg-[#9AA4AF]" />
            Excluded Letters (Gray)
          </span>
          <input
            value={excluded}
            onChange={(event) => {
              setExcluded(event.target.value.toUpperCase().replace(/[^A-Z]/g, ""));
              setSearched(false);
            }}
            placeholder="Enter excluded letters (e.g., QWERT)"
            className="h-14 rounded-lg border border-[#BFC8D2] bg-white px-5 text-[#20201E] outline-none placeholder:text-[#8A96A3] focus:border-[#ED3F68] focus:ring-4 focus:ring-[#ED3F68]/20"
          />
        </label>
      </div>

      <hr className="my-7 border-[#E5DED3]" />

      <div className="mx-auto grid max-w-lg gap-4 sm:grid-cols-[1fr_auto]">
        <button
          type="button"
          onClick={() => setSearched(true)}
          className="inline-flex h-14 items-center justify-center gap-3 rounded-lg bg-[linear-gradient(90deg,#F13E4F,#E83EA2)] px-7 text-base font-black text-white shadow-sm"
        >
          <Search className="h-5 w-5" />
          Find Solutions
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-14 items-center justify-center gap-3 rounded-lg border border-[#D4CABD] bg-white px-8 text-base font-black text-[#142436] hover:bg-[#EDE6DC]"
        >
          <RefreshCw className="h-5 w-5" />
          Reset
        </button>
      </div>

      <section className="mt-7 rounded-xl border border-[#E5DED3] bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-black text-[#142436]">Solutions</h2>
          <span className="rounded-full bg-[#FFE8EF] px-3 py-1 text-sm font-black text-[#ED3F68]">{results.length} words</span>
        </div>
        {searched && results.length ? <div className="mt-4"><CopyButton text={results.join("\n")} /></div> : null}
        <div className="mt-4 flex max-h-72 flex-wrap gap-2 overflow-auto">
          {!searched ? <p className="text-sm leading-6 text-[#68645E]">Enter Quordle clues, then find possible five-letter words.</p> : null}
          {searched && !results.length ? <p className="text-sm leading-6 text-[#68645E]">No matches yet. Remove one clue or check repeated letters.</p> : null}
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
