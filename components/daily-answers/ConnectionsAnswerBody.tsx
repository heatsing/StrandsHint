import { HintStack, RevealSummary } from "@/components/daily-answers/DailyAnswerShell";
import type { ConnectionsGroup, DailyAnswerEntry } from "@/lib/daily-answers";

const colorStyles: Record<ConnectionsGroup["color"], string> = {
  yellow: "bg-[#F2E7A8] text-[#5C4E10]",
  green: "bg-[#C7E3C1] text-[#1F4D28]",
  blue: "bg-[#C2D6F2] text-[#1D3557]",
  purple: "bg-[#D9C4F0] text-[#4A2C6A]",
};

export function ConnectionsAnswerBody({ entry }: { entry: DailyAnswerEntry }) {
  const words = entry.boardWords || [];
  const groups = entry.groups || [];

  return (
    <>
      {words.length ? (
        <section className="rounded-3xl border border-[#E5DED3] bg-[#FFFDF9] px-5 py-6">
          <h2 className="text-lg font-black text-[#20201E]">Today&apos;s board</h2>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {words.map((word) => (
              <div
                key={word}
                className="rounded-xl bg-[#F3F0EA] px-3 py-4 text-center text-sm font-black tracking-wide text-[#20201E]"
              >
                {word}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <HintStack hints={entry.hints} />

      <section className="rounded-3xl border border-[#E5DED3] bg-[#FFFDF9] px-6 py-6">
        <h2 className="text-lg font-black text-[#20201E]">Category reveals</h2>
        <p className="mt-2 text-sm leading-7 text-[#68645E]">
          Open one color at a time, from easiest to hardest.
        </p>
        <div className="mt-5 space-y-3">
          {groups.map((group) => (
            <details key={group.title} className="group rounded-2xl border border-[#E5DED3] bg-white px-4 py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold capitalize text-[#20201E]">
                <span className={`rounded-full px-3 py-1 text-xs font-black ${colorStyles[group.color]}`}>
                  {group.color}
                </span>
                <span className="text-[#68645E] group-open:hidden">{group.hint || "Show group"}</span>
                <span className="hidden text-[#68645E] group-open:inline">Hide</span>
              </summary>
              <div className="mt-4">
                <p className="font-black text-[#20201E]">{group.title}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.words.map((word) => (
                    <span key={word} className={`rounded-full px-3 py-1.5 text-xs font-black ${colorStyles[group.color]}`}>
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </details>
          ))}
        </div>

        <details className="group mt-5 text-center">
          <RevealSummary label="Show all Connections answers" tone="dark" />
          <div className="mt-5 space-y-3 text-left">
            {groups.map((group) => (
              <div key={`all-${group.title}`} className={`rounded-2xl px-4 py-4 ${colorStyles[group.color]}`}>
                <p className="text-sm font-black">{group.title}</p>
                <p className="mt-2 text-sm font-semibold tracking-wide">{group.words.join(" · ")}</p>
              </div>
            ))}
            {entry.answerNote ? <p className="text-sm leading-7 text-[#68645E]">{entry.answerNote}</p> : null}
          </div>
        </details>
      </section>
    </>
  );
}
