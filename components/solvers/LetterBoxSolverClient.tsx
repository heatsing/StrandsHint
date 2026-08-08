"use client";

import { useMemo, useState } from "react";
import { CalendarDays, RefreshCw, Search } from "lucide-react";
import { letterBoxWordBank } from "@/data/tool-word-banks";
import { solveLetterBoxed } from "@/lib/word-game-solvers";

const exampleSides = ["CAR", "DLE", "PON", "TIS"];

function cleanLetter(value: string) {
  return value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 1);
}

function sideFromCells(cells: string[], side: number) {
  return cells.slice(side * 3, side * 3 + 3).join("");
}

export function LetterBoxSolverClient() {
  const [cells, setCells] = useState(Array(12).fill(""));
  const [targetMoves, setTargetMoves] = useState(2);
  const [searched, setSearched] = useState(false);
  const sides = [0, 1, 2, 3].map((side) => sideFromCells(cells, side));
  const ready = sides.every((side) => side.length === 3) && new Set(cells.filter(Boolean)).size === 12;
  const results = useMemo(
    () => (searched && ready ? solveLetterBoxed(letterBoxWordBank, { sides, targetMoves }) : []),
    [ready, searched, sides, targetMoves],
  );

  function updateCell(index: number, value: string) {
    const next = cells.slice();
    next[index] = cleanLetter(value);
    setCells(next);
    setSearched(false);
  }

  function autofill() {
    setCells(exampleSides.join("").split(""));
    setTargetMoves(2);
    setSearched(false);
  }

  function reset() {
    setCells(Array(12).fill(""));
    setTargetMoves(2);
    setSearched(false);
  }

  const sideClasses = [
    "top-0 left-1/2 -translate-x-1/2 grid-cols-3",
    "right-0 top-1/2 -translate-y-1/2 grid-rows-3",
    "bottom-0 left-1/2 -translate-x-1/2 grid-cols-3",
    "left-0 top-1/2 -translate-y-1/2 grid-rows-3",
  ];
  const colors = ["#E0544F", "#2F80D8", "#12A37F", "#E8A300"];

  return (
    <div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-xl shadow-[#315C4C]/10">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#E7F7F4] text-[#008F83]">
          <Search className="h-5 w-5" />
        </span>
        <h2 className="text-xl font-black text-[#142436]">Enter Box Letters</h2>
      </div>

      <div className="mx-auto mt-6 h-80 max-w-md sm:h-96">
        <div className="relative mx-auto h-full w-full max-w-sm">
          <div className="absolute inset-12 rounded-lg border-4 border-[#BFC8D2]" />
          {[0, 1, 2, 3].map((side) => (
            <div key={side} className={`absolute grid gap-4 ${sideClasses[side]}`}>
              {[0, 1, 2].map((offset) => {
                const index = side * 3 + offset;
                return (
                  <input
                    key={index}
                    value={cells[index]}
                    maxLength={1}
                    aria-label={`Box letter ${index + 1}`}
                    onChange={(event) => updateCell(index, event.target.value)}
                    className="h-12 w-12 rounded-lg border bg-white text-center text-lg font-black text-[#142436] outline-none focus:ring-4 sm:h-14 sm:w-14"
                    style={{ borderColor: colors[side] }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {!ready && searched ? (
        <p className="mt-4 text-sm font-semibold text-[#A7473D]">
          Enter 12 unique letters around the box before searching.
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-[auto_1fr_auto]">
        <button
          type="button"
          onClick={autofill}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#D4CABD] bg-white px-5 py-3 text-sm font-black text-[#142436] hover:bg-[#F7F2EA]"
        >
          <CalendarDays className="h-5 w-5" />
          Autofill Today
        </button>
        <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-[#E5DED3] bg-white">
          {[1, 2, 3].map((move) => (
            <button
              key={move}
              type="button"
              onClick={() => setTargetMoves(move)}
              className={[
                "px-5 py-3 text-sm font-black",
                targetMoves === move ? "bg-[#008F83] text-white" : "text-[#142436] hover:bg-[#F1FAF8]",
              ].join(" ")}
            >
              {move}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSearched(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#008F83] px-7 py-3 text-sm font-black text-white hover:bg-[#00766D]"
        >
          <Search className="h-5 w-5" />
          Find Solutions
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#008F83] bg-white px-5 py-3 text-sm font-black text-[#008F83] hover:bg-[#F1FAF8] lg:col-start-3"
        >
          <RefreshCw className="h-5 w-5" />
          Reset
        </button>
      </div>

      <div className="mt-6 rounded-xl border border-[#E5DED3] bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-black text-[#142436]">Solutions</h3>
          <span className="rounded-full bg-[#EDE6DC] px-3 py-1 text-sm font-bold">{results.length}</span>
        </div>
        <div className="mt-4 grid max-h-72 gap-2 overflow-auto">
          {!searched ? <p className="text-sm text-[#68645E]">Enter the box letters, then find solutions.</p> : null}
          {searched && ready && !results.length ? (
            <p className="text-sm text-[#68645E]">No complete chain found in the current local word list. Try 3 moves or adjust letters.</p>
          ) : null}
          {results.map((result: { words: string[]; moves: number; covered: number }) => (
            <div key={result.words.join("-")} className="rounded-xl border border-[#E5DED3] bg-[#FFFDF9] px-4 py-3">
              <p className="font-black text-[#142436]">{result.words.join(" → ")}</p>
              <p className="mt-1 text-sm text-[#68645E]">{result.moves} words · {result.covered}/12 letters covered</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
