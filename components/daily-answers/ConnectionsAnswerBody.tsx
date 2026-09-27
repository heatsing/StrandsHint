"use client";

import { useState } from "react";
import type { ConnectionsGroup, DailyAnswerEntry } from "@/lib/daily-answers";

const colorStyles: Record<
  ConnectionsGroup["color"],
  { chip: string; block: string; label: string }
> = {
  yellow: {
    chip: "bg-[#F9DF6D] text-[#5C4E10]",
    block: "bg-[#F9DF6D] text-[#5C4E10]",
    label: "Yellow",
  },
  green: {
    chip: "bg-[#A0C35A] text-[#1F4D28]",
    block: "bg-[#A0C35A] text-[#1F4D28]",
    label: "Green",
  },
  blue: {
    chip: "bg-[#B0C4EF] text-[#1D3557]",
    block: "bg-[#B0C4EF] text-[#1D3557]",
    label: "Blue",
  },
  purple: {
    chip: "bg-[#BA81C5] text-[#3B1F4A]",
    block: "bg-[#BA81C5] text-white",
    label: "Purple",
  },
};

export function ConnectionsAnswerBody({ entry }: { entry: DailyAnswerEntry }) {
  const [tab, setTab] = useState<"hints" | "answers">("hints");
  const words = entry.boardWords || [];
  const groups = entry.groups || [];

  return (
    <>
      {words.length ? (
        <section className="rounded-3xl border border-[#E5DED3] bg-[#FFFDF9] px-4 py-5 sm:px-6">
          <h2 className="text-lg font-black text-[#20201E]">Today&apos;s Connections board</h2>
          <p className="mt-2 text-sm leading-6 text-[#68645E]">
            Sixteen words. Find four groups of four — easier colors first if you want a soft start.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {words.map((word) => (
              <div
                key={word}
                className="rounded-xl bg-[#EFECE7] px-2 py-5 text-center text-[13px] font-black uppercase tracking-wide text-[#20201E] sm:text-sm"
              >
                {word}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-3xl border border-[#E5DED3] bg-[#FFFDF9] px-4 py-5 sm:px-6">
        <div className="flex items-center justify-center gap-2">
          {(
            [
              ["hints", "Hints"],
              ["answers", "Answers"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={[
                "rounded-full px-5 py-2 text-sm font-bold transition",
                tab === key ? "bg-[#20201E] text-white" : "bg-[#EFE8DE] text-[#68645E]",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "hints" ? (
          <div className="mt-6 space-y-3">
            <p className="text-center text-sm leading-6 text-[#68645E]">
              Soft category nudges only — no full word lists yet.
            </p>
            {groups.map((group) => (
              <details key={`hint-${group.color}`} className="group rounded-2xl border border-[#E5DED3] bg-white px-4 py-3">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${colorStyles[group.color].chip}`}>
                    {colorStyles[group.color].label}
                  </span>
                  <span className="text-sm font-bold text-[#68645E] group-open:hidden">Show hint</span>
                  <span className="hidden text-sm font-bold text-[#68645E] group-open:inline">Hide</span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-[#48624C]">{group.hint || entry.hints[0]}</p>
              </details>
            ))}
            {entry.hints.length ? (
              <div className="rounded-2xl bg-[#F3F0EA] px-4 py-4 text-sm leading-7 text-[#68645E]">
                {entry.hints.map((hint) => (
                  <p key={hint} className="mt-2 first:mt-0">
                    {hint}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <p className="text-center text-sm leading-6 text-[#68645E]">
              Reveal one color at a time, then check the full board below.
            </p>
            {groups.map((group) => (
              <details key={`ans-${group.color}`} className="group overflow-hidden rounded-2xl border border-[#E5DED3]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 bg-white px-4 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${colorStyles[group.color].chip}`}>
                    {colorStyles[group.color].label}
                  </span>
                  <span className="text-sm font-bold text-[#68645E] group-open:hidden">Reveal group</span>
                  <span className="hidden text-sm font-bold text-[#68645E] group-open:inline">Hide</span>
                </summary>
                <div className={`px-4 py-4 ${colorStyles[group.color].block}`}>
                  <p className="text-sm font-black uppercase tracking-[0.08em]">{group.title}</p>
                  <p className="mt-2 text-sm font-bold tracking-wide">{group.words.join(" · ")}</p>
                </div>
              </details>
            ))}

            <div className="pt-2 text-center text-[#C9C2B8]">♥</div>

            <div className="space-y-3">
              <h3 className="text-center text-sm font-black uppercase tracking-[0.14em] text-[#20201E]">
                All Connections answers
              </h3>
              {groups.map((group) => (
                <div key={`all-${group.title}`} className={`rounded-2xl px-4 py-4 ${colorStyles[group.color].block}`}>
                  <p className="text-sm font-black uppercase tracking-[0.08em]">{group.title}</p>
                  <p className="mt-2 text-sm font-bold tracking-wide">{group.words.join(" · ")}</p>
                </div>
              ))}
            </div>
            {entry.answerNote ? <p className="text-sm leading-7 text-[#68645E]">{entry.answerNote}</p> : null}
          </div>
        )}
      </section>
    </>
  );
}
