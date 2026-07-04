"use client";

import { RotateCcw, Wand2 } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const sample = "FIREWORKSBRIGHTCOLORFULDAZZLINGEXCITINGSPARKLINGWORD";

export function LetterGridInput({ value, onChange }: Props) {
  const letters = value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 48).padEnd(48, " ");

  function update(index: number, letter: string) {
    const chars = letters.split("");
    chars[index] = letter.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 1) || " ";
    onChange(chars.join(""));
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="grid grid-cols-8 gap-1.5">
        {letters.split("").map((letter, index) => (
          <input
            key={index}
            value={letter.trim()}
            maxLength={1}
            aria-label={`Grid letter ${index + 1}`}
            onChange={(event) => update(index, event.target.value)}
            onPaste={(event) => {
              const pasted = event.clipboardData.getData("text");
              const clean = pasted.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 48);
              if (clean.length > 1) {
                event.preventDefault();
                onChange(clean);
              }
            }}
            className="aspect-square rounded-md border border-slate-300 text-center text-sm font-bold uppercase outline-none focus:border-slate-800 sm:text-base"
          />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange("")}
          className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50"
        >
          <RotateCcw className="h-4 w-4" />
          Clear
        </button>
        <button
          type="button"
          onClick={() => onChange(sample)}
          className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50"
        >
          <Wand2 className="h-4 w-4" />
          Example
        </button>
      </div>
    </div>
  );
}
