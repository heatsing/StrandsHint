"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, RefreshCw, Search, XCircle } from "lucide-react";
import { getWordleWordBank } from "@/data/tool-word-banks";
import { explainWordleLogic, solveWordle } from "@/lib/word-game-solvers";
import { CopyButton } from "./CopyButton";

type Props = {
  initialLength?: number;
  fixedLength?: boolean;
  accent?: string;
};

function normalizeLetter(value: string) {
  return value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 1);
}

function letterCells(value: string, length: number) {
  return value
    .padEnd(length, "_")
    .slice(0, length)
    .split("")
    .map((letter) => (letter === "_" ? "" : letter));
}

export function WordleSolverClient({ initialLength = 5, fixedLength = false, accent = "#008F83" }: Props) {
  const searchParams = useSearchParams();
  const queryLength = searchParams.get("length");
  const [length, setLength] = useState(String(initialLength));
  const numericLength = Number(length);
  const [green, setGreen] = useState("");
  const [yellow, setYellow] = useState("");
  const [excluded, setExcluded] = useState("");
  const [searched, setSearched] = useState(false);

  const greenCells = letterCells(green, numericLength);
  const yellowCells = letterCells(yellow, numericLength);
  const pattern = greenCells.map((letter) => letter || "_").join("");
  const misplaced = yellowCells
    .map((letter, index) => (letter ? `${letter}:${index + 1}` : ""))
    .filter(Boolean)
    .join(" ");
  const includes = yellowCells.filter(Boolean).join("");
  const validLength = numericLength >= 3 && numericLength <= 12;
  const results = useMemo(
    () => (searched ? solveWordle(getWordleWordBank(numericLength), { length: numericLength, pattern, includes, misplaced, excluded }) : []),
    [searched, numericLength, pattern, includes, misplaced, excluded],
  );

  useEffect(() => {
    if (!fixedLength && queryLength && Number(queryLength) >= 3 && Number(queryLength) <= 12) {
      setLength(queryLength);
      setSearched(false);
    }
  }, [fixedLength, queryLength]);

  function updateCell(kind: "green" | "yellow", index: number, value: string) {
    const cells = kind === "green" ? greenCells.slice() : yellowCells.slice();
    cells[index] = normalizeLetter(value);
    if (kind === "green") setGreen(cells.map((letter) => letter || "_").join(""));
    else setYellow(cells.map((letter) => letter || "_").join(""));
    setSearched(false);
  }

  function reset() {
    setGreen("");
    setYellow("");
    setExcluded("");
    setSearched(false);
    if (!fixedLength) setLength(String(initialLength));
  }

  return (
    <div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-xl shadow-[#315C4C]/10">
      {!fixedLength ? (
        <label className="mb-6 grid max-w-44 gap-2 text-sm font-black text-[#142436]">
          Word length
          <input
            value={length}
            onChange={(event) => setLength(event.target.value.replace(/\D/g, ""))}
            className="rounded-lg border border-[#D4CABD] bg-white px-3 py-2 text-[#20201E] outline-none focus:border-[#008F83] focus:ring-4 focus:ring-[#008F83]/20"
          />
        </label>
      ) : null}

      <section>
        <h2 className="flex items-center gap-2 text-lg font-black text-[#142436]">
          <CheckCircle2 className="h-6 w-6 text-[#12A37F]" />
          Known Letters (Green)
        </h2>
        <div className="mt-5 flex flex-wrap justify-center gap-4">
          {greenCells.map((letter, index) => (
            <input
              key={`green-${index}`}
              value={letter}
              maxLength={1}
              aria-label={`Green letter ${index + 1}`}
              onChange={(event) => updateCell("green", index, event.target.value)}
              placeholder={`${index + 1}`}
              className="h-14 w-14 rounded-lg border border-[#12A37F] bg-[#E8FFF7] text-center text-lg font-black text-[#142436] outline-none placeholder:text-[#8A96A3] focus:ring-4 focus:ring-[#12A37F]/20"
            />
          ))}
        </div>
      </section>

      <hr className="my-7 border-[#E5DED3]" />

      <section>
        <h2 className="flex items-center gap-2 text-lg font-black text-[#142436]">
          <span className="h-5 w-5 rounded-full bg-[#E8A300]" />
          Wrong Position Letters (Yellow)
        </h2>
        <div className="mt-5 flex flex-wrap justify-center gap-4">
          {yellowCells.map((letter, index) => (
            <input
              key={`yellow-${index}`}
              value={letter}
              maxLength={1}
              aria-label={`Yellow letter ${index + 1}`}
              onChange={(event) => updateCell("yellow", index, event.target.value)}
              placeholder={`${index + 1}`}
              className="h-14 w-14 rounded-lg border border-[#E8A300] bg-[#FFF8E7] text-center text-lg font-black text-[#142436] outline-none placeholder:text-[#8A96A3] focus:ring-4 focus:ring-[#E8A300]/20"
            />
          ))}
        </div>
      </section>

      <hr className="my-7 border-[#E5DED3]" />

      <label className="grid gap-3 text-lg font-black text-[#142436]">
        <span className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-[#8A96A3]" />
          Excluded Letters (Gray)
        </span>
        <input
          value={excluded}
          onChange={(event) => {
            setExcluded(event.target.value.toUpperCase().replace(/[^A-Z]/g, ""));
            setSearched(false);
          }}
          placeholder="Enter excluded letters (e.g., QWT)"
          className="rounded-lg border border-[#BFC8D2] bg-white px-4 py-3 text-center text-[#20201E] placeholder:text-[#8A96A3] outline-none focus:border-[#008F83] focus:ring-4 focus:ring-[#008F83]/20"
        />
      </label>

      {!validLength ? <p className="mt-3 text-sm font-semibold text-[#A7473D]">Choose a length from 3 to 12.</p> : null}

      <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto]">
        <button
          type="button"
          onClick={() => setSearched(true)}
          disabled={!validLength}
          className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-4 text-sm font-black text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: accent }}
        >
          <Search className="h-5 w-5" />
          Find Solutions
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-8 py-4 text-sm font-black hover:bg-[#F1FAF8]"
          style={{ borderColor: accent, color: accent }}
        >
          <RefreshCw className="h-5 w-5" />
          Reset
        </button>
      </div>

      <p className="mt-4 text-sm leading-6 text-[#68645E]">
        {explainWordleLogic({ length: numericLength, pattern, includes, misplaced, excluded })}
      </p>

      <div className="mt-6 rounded-xl border border-[#E5DED3] bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-black text-[#142436]">Solutions</h3>
          <span className="rounded-full bg-[#EDE6DC] px-3 py-1 text-sm font-bold">{results.length}</span>
        </div>
        {searched && results.length ? <div className="mt-4"><CopyButton text={results.join("\n")} /></div> : null}
        <div className="mt-4 flex max-h-72 flex-wrap gap-2 overflow-auto">
          {!searched ? <p className="text-sm text-[#68645E]">Enter clues, then find solutions.</p> : null}
          {searched && !results.length ? <p className="text-sm text-[#68645E]">No matches. Remove one filter or check repeated letters.</p> : null}
          {results.map((word: string) => (
            <span key={word} className="rounded-full border border-[#E5DED3] bg-[#FFFDF9] px-3 py-1.5 font-mono text-sm font-bold">
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
