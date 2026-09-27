"use client";

import { useState } from "react";
import type { DailyAnswerEntry, SectionAnswer } from "@/lib/daily-answers";

function DominoFace({ value }: { value: number }) {
  const dots = Math.max(0, Math.min(6, value));
  const positions: Record<number, Array<[number, number]>> = {
    0: [],
    1: [[2, 2]],
    2: [[1, 1], [3, 3]],
    3: [[1, 1], [2, 2], [3, 3]],
    4: [[1, 1], [1, 3], [3, 1], [3, 3]],
    5: [[1, 1], [1, 3], [2, 2], [3, 1], [3, 3]],
    6: [[1, 1], [1, 2], [1, 3], [3, 1], [3, 2], [3, 3]],
  };

  return (
    <div className="relative grid h-12 w-12 grid-cols-3 grid-rows-3 place-items-center rounded-md border border-[#D9D2C7] bg-[#FFFDF9] p-1">
      {positions[dots].map(([r, c]) => (
        <span
          key={`${r}-${c}`}
          className="h-2 w-2 rounded-full bg-[#315C4C]"
          style={{ gridRow: r, gridColumn: c }}
        />
      ))}
    </div>
  );
}

export function PipsAnswerBody({ entry }: { entry: DailyAnswerEntry }) {
  const sections = entry.sections || [];
  const [openCount, setOpenCount] = useState(0);
  const visible = sections.slice(0, Math.max(1, openCount + 1));

  return (
    <>
      <section className="rounded-3xl border border-[#E5DED3] bg-[#FFFDF9] px-5 py-7 text-center sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#315C4C]">Pips board</p>
        <h2 className="mt-2 text-xl font-black text-[#20201E]">Today&apos;s domino layout</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#68645E]">
          Work constraint by constraint. Open the next clue only when the current region is locked in.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {[
            [1, 4],
            [2, 5],
            [0, 3],
            [6, 2],
            [4, 4],
          ].map(([a, b], index) => (
            <div
              key={`${a}-${b}-${index}`}
              className="flex items-center gap-1 rounded-xl border border-[#E5DED3] bg-white p-2 shadow-sm"
            >
              <DominoFace value={a} />
              <div className="h-8 w-px bg-[#E5DED3]" />
              <DominoFace value={b} />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-[#E5DED3] bg-[#FFFDF9] px-5 py-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-[#20201E]">Clues & solution steps</h2>
            <p className="mt-1 text-sm leading-6 text-[#68645E]">
              Showing {visible.length} of {sections.length} steps
            </p>
          </div>
          {openCount < sections.length - 1 ? (
            <button
              type="button"
              onClick={() => setOpenCount((value) => Math.min(sections.length - 1, value + 1))}
              className="rounded-full bg-[#20201E] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#315C4C]"
            >
              Next clue
            </button>
          ) : (
            <span className="rounded-full bg-[#E9F2EE] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#315C4C]">
              All clues open
            </span>
          )}
        </div>

        <div className="mt-5 space-y-3">
          {visible.map((section, index) => (
            <ClueStep key={section.title} section={section} index={index} />
          ))}
        </div>

        {openCount < sections.length - 1 ? (
          <button
            type="button"
            onClick={() => setOpenCount(sections.length - 1)}
            className="mt-5 w-full rounded-2xl border border-[#E5DED3] bg-white px-4 py-3 text-sm font-bold text-[#315C4C] hover:border-[#315C4C]"
          >
            Reveal remaining clues
          </button>
        ) : null}

        {entry.answerNote ? <p className="mt-5 text-sm leading-7 text-[#68645E]">{entry.answerNote}</p> : null}
      </section>
    </>
  );
}

function ClueStep({ section, index }: { section: SectionAnswer; index: number }) {
  return (
    <details className="group rounded-2xl border border-[#E5DED3] bg-white px-4 py-4">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-3">
        <div className="text-left">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#68645E]">Clue {index + 1}</p>
          <p className="mt-1 text-sm font-black text-[#20201E]">{section.title}</p>
          {section.hint ? <p className="mt-2 text-sm leading-6 text-[#68645E]">{section.hint}</p> : null}
        </div>
        <span className="shrink-0 rounded-full bg-[#20201E] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white group-open:bg-[#315C4C]">
          <span className="group-open:hidden">Hint</span>
          <span className="hidden group-open:inline">Hide</span>
        </span>
      </summary>
      <div className="mt-4 rounded-xl bg-[#E9F2EE] px-4 py-3">
        <p className="text-sm font-bold text-[#315C4C]">{section.answer}</p>
        {section.detail ? <p className="mt-2 text-sm leading-7 text-[#68645E]">{section.detail}</p> : null}
      </div>
    </details>
  );
}
