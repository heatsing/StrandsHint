"use client";

import { useMemo, useState } from "react";
import { RefreshCw, Search } from "lucide-react";
import { jumbleWordBank } from "@/data/tool-word-banks";
import { solveAnagrams } from "@/lib/word-game-solvers";
import { CopyButton } from "./CopyButton";

function normalizeLetters(value: string) {
  return value.toUpperCase().replace(/[^A-Z?]/g, "");
}

function clueScore(word: string, clue: string) {
  const terms = clue.toUpperCase().split(/[^A-Z]+/).filter((term) => term.length >= 3);
  if (!terms.length) return 0;
  return terms.reduce((score, term) => score + (term.includes(word) ? 3 : 0) + (word.includes(term) ? 2 : 0), 0);
}

export function JumbleSolverClient() {
  const [words, setWords] = useState(["", "", "", ""]);
  const [clue, setClue] = useState("");
  const [searched, setSearched] = useState(false);

  const solvedWords = useMemo(() => {
    if (!searched) return [];
    return words.map((letters) => {
      const clean = normalizeLetters(letters);
      const results = clean
        ? solveAnagrams(jumbleWordBank, { letters: clean, minLength: Math.max(2, clean.length - 1), maxLength: clean.length }).slice(0, 12)
        : [];
      return { letters: clean, results };
    });
  }, [searched, words]);

  const finalCandidates = useMemo(() => {
    if (!searched) return [];
    const combined = normalizeLetters(words.join(""));
    if (combined.length < 3) return [];
    return solveAnagrams(jumbleWordBank, {
      letters: combined,
      minLength: 3,
      maxLength: Math.min(12, combined.length),
    })
      .sort((a, b) => clueScore(b, clue) - clueScore(a, clue) || b.length - a.length || a.localeCompare(b))
      .slice(0, 40);
  }, [clue, searched, words]);

  function updateWord(index: number, value: string) {
    const next = words.slice();
    next[index] = normalizeLetters(value);
    setWords(next);
    setSearched(false);
  }

  function reset() {
    setWords(["", "", "", ""]);
    setClue("");
    setSearched(false);
  }

  return (
    <div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-xl shadow-[#315C4C]/10">
      <h2 className="text-2xl font-black text-[#142436]">Scrambled Words</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {words.map((word, index) => (
          <label key={`jumble-word-${index}`} className="grid gap-2 text-sm font-black text-[#142436]">
            Word {index + 1}
            <input
              value={word}
              onChange={(event) => updateWord(index, event.target.value)}
              placeholder={`Enter scrambled word ${index + 1}`}
              className="h-12 rounded-lg border border-[#D4CABD] bg-white px-4 text-[#20201E] outline-none placeholder:text-[#8A857E] focus:border-[#F06423] focus:ring-4 focus:ring-[#F06423]/20"
            />
          </label>
        ))}
      </div>

      <hr className="my-6 border-[#E5DED3]" />

      <label className="grid gap-2 text-lg font-black text-[#142436]">
        Final Answer Clue
        <textarea
          value={clue}
          onChange={(event) => {
            setClue(event.target.value);
            setSearched(false);
          }}
          placeholder="Enter the clue for the final answer (optional)"
          className="min-h-24 rounded-lg border border-[#D4CABD] bg-white px-4 py-3 text-[#20201E] outline-none placeholder:text-[#8A857E] focus:border-[#F06423] focus:ring-4 focus:ring-[#F06423]/20"
        />
      </label>

      <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_18rem]">
        <button
          type="button"
          onClick={() => setSearched(true)}
          className="inline-flex h-14 items-center justify-center gap-3 rounded-lg bg-[linear-gradient(90deg,#FF6B2C,#EF3F61)] px-7 text-base font-black text-white shadow-sm"
        >
          <Search className="h-5 w-5" />
          Solve Jumble
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-14 items-center justify-center gap-3 rounded-lg border border-[#D4CABD] bg-white px-7 text-base font-black text-[#142436] hover:bg-[#EDE6DC]"
        >
          <RefreshCw className="h-5 w-5" />
          Reset
        </button>
      </div>

      {searched ? (
        <section className="mt-7 grid gap-5">
          <div className="rounded-xl border border-[#E5DED3] bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xl font-black text-[#142436]">Unscrambled Words</h3>
              <span className="rounded-full bg-[#FFF0E8] px-3 py-1 text-sm font-black text-[#F06423]">{solvedWords.reduce((total, item) => total + item.results.length, 0)} matches</span>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {solvedWords.map((item, index) => (
                <div key={`solved-${index}`} className="rounded-lg border border-[#E5DED3] bg-[#FFFDF9] p-4">
                  <p className="text-sm font-black text-[#68645E]">Word {index + 1}: {item.letters || "-"}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {!item.results.length ? <span className="text-sm text-[#68645E]">No candidates yet.</span> : null}
                    {item.results.map((result) => (
                      <span key={`${index}-${result}`} className="rounded-full border border-[#E5DED3] bg-white px-3 py-1 font-mono text-sm font-black text-[#142436]">{result}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#E5DED3] bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xl font-black text-[#142436]">Final Answer Candidates</h3>
              {finalCandidates.length ? <CopyButton text={finalCandidates.join("\n")} /> : null}
            </div>
            <div className="mt-4 flex max-h-56 flex-wrap gap-2 overflow-auto">
              {!finalCandidates.length ? <p className="text-sm leading-6 text-[#68645E]">Enter scrambled words to see final answer candidates.</p> : null}
              {finalCandidates.map((word) => (
                <span key={word} className="rounded-full border border-[#E5DED3] bg-[#FFFDF9] px-3 py-1.5 font-mono text-sm font-black text-[#142436]">{word}</span>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
