import { HintStack, RevealSummary } from "@/components/daily-answers/DailyAnswerShell";
import type { DailyAnswerEntry } from "@/lib/daily-answers";

export function WordleAnswerBody({ entry }: { entry: DailyAnswerEntry }) {
  const answer = (entry.answer || "").toUpperCase();
  const slots = answer ? answer.split("") : Array.from({ length: 5 }, () => "?");

  return (
    <>
      <HintStack hints={entry.hints} />

      <section className="rounded-3xl border border-[#E5DED3] bg-[#FFFDF9] px-6 py-8 text-center">
        <h2 className="text-lg font-black text-[#20201E]">Ready for today&apos;s Wordle?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#68645E]">
          Letter boxes stay hidden until you choose to open them.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          {slots.map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              className="grid h-12 w-12 place-items-center rounded-xl border border-[#E5DED3] bg-white text-lg font-black text-[#B8B1A8]"
            >
              ?
            </span>
          ))}
        </div>
        <details className="group mt-6">
          <RevealSummary label="Show Wordle answer" tone="dark" />
          <div className="mt-6 space-y-4">
            <div className="flex justify-center gap-2">
              {slots.map((letter, index) => (
                <span
                  key={`revealed-${letter}-${index}`}
                  className="grid h-12 w-12 place-items-center rounded-xl bg-[#6AAA64] text-lg font-black text-white"
                >
                  {letter}
                </span>
              ))}
            </div>
            <p className="text-2xl font-black tracking-[0.2em] text-[#20201E]">{answer}</p>
            {entry.answerNote ? <p className="text-sm leading-7 text-[#68645E]">{entry.answerNote}</p> : null}
          </div>
        </details>
      </section>
    </>
  );
}
