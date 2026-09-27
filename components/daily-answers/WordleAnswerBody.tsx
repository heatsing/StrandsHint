import Link from "next/link";
import { RevealSummary } from "@/components/daily-answers/DailyAnswerShell";
import { formatAnswerDate, getPublishedAnswers, type DailyAnswerEntry } from "@/lib/daily-answers";

export function WordleAnswerBody({ entry }: { entry: DailyAnswerEntry }) {
  const answer = (entry.answer || "").toUpperCase();
  const slots = answer ? answer.split("") : Array.from({ length: 5 }, () => "?");
  const recent = getPublishedAnswers("wordle").filter((item) => item.date !== entry.date).slice(0, 7);

  const layeredHints = [
    entry.hints[0] ? { label: "Hint 1: About the word", body: entry.hints[0] } : null,
    entry.hints[1]
      ? {
          label: "Hint 2: Any repeated letters?",
          body:
            entry.repeatedLetters === undefined
              ? entry.hints[1]
              : typeof entry.repeatedLetters === "string"
                ? entry.repeatedLetters
                : entry.repeatedLetters
                  ? `${entry.hints[1]} Yes — today's answer repeats a letter.`
                  : `${entry.hints[1]} No repeated letters.`,
        }
      : null,
    entry.firstLetter || entry.hints[2]
      ? {
          label: "Hint 3: First letter",
          body: entry.firstLetter
            ? `It starts with ${entry.firstLetter.toUpperCase()}. ${entry.hints[2] || ""}`.trim()
            : entry.hints[2],
        }
      : null,
  ].filter(Boolean) as { label: string; body: string }[];

  return (
    <>
      <section className="rounded-3xl border border-[#E5DED3] bg-[#FFFDF9] px-5 py-6 sm:px-6">
        <h2 className="text-lg font-black text-[#20201E]">Today&apos;s Wordle hints</h2>
        <p className="mt-2 text-sm leading-6 text-[#68645E]">
          Stay in Wordle mode: soft clues first, then the five tiles, then the answer.
        </p>
        <div className="mt-5 space-y-3">
          {layeredHints.map((hint) => (
            <details
              key={hint.label}
              className="group overflow-hidden rounded-2xl border border-[#B7D7B0] bg-[#F3FAF1]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-bold text-[#2F6B3A]">
                {hint.label}
                <span className="text-xs uppercase tracking-[0.14em] text-[#6AAA64] group-open:hidden">Open</span>
                <span className="hidden text-xs uppercase tracking-[0.14em] text-[#68645E] group-open:inline">Hide</span>
              </summary>
              <p className="border-t border-[#D8EBD4] px-4 py-3 text-sm leading-7 text-[#48624C]">{hint.body}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-[#E5DED3] bg-[#FFFDF9] px-5 py-8 text-center sm:px-6">
        <p className="text-base font-bold text-[#20201E]">Are you ready for the answer?</p>
        <p className="mt-2 text-sm leading-6 text-[#68645E]">Reveal it below only after you have used your guesses.</p>

        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#68645E]">Reveal today&apos;s Wordle answer</p>
          <div className="mt-4 flex justify-center gap-2">
            {slots.map((letter, index) => (
              <span
                key={`hidden-${index}`}
                className="grid h-12 w-12 place-items-center rounded-md border-2 border-[#D4CABD] bg-[#EFE8DE] text-lg font-black text-[#9A9186] sm:h-14 sm:w-14"
              >
                ?
              </span>
            ))}
          </div>
        </div>

        <details className="group mt-6">
          <RevealSummary label="Reveal Answer" tone="dark" />
          <div className="mt-6 space-y-4">
            <div className="flex justify-center gap-2">
              {slots.map((letter, index) => (
                <span
                  key={`shown-${letter}-${index}`}
                  className="grid h-12 w-12 place-items-center rounded-md bg-[#6AAA64] text-lg font-black text-white sm:h-14 sm:w-14"
                >
                  {letter}
                </span>
              ))}
            </div>
            <p className="text-2xl font-black tracking-[0.28em] text-[#20201E]">{answer}</p>
            {entry.answerNote ? <p className="text-sm leading-7 text-[#68645E]">{entry.answerNote}</p> : null}
          </div>
        </details>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          ["Difficulty", entry.difficultyScore || entry.difficulty?.toLowerCase() || "medium"],
          ["Luck factor", entry.luckScore || "depends on starter"],
          ["Letters", String(answer.length || 5)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl border border-[#E5DED3] bg-[#FFFDF9] px-4 py-5 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#68645E]">{label}</p>
            <p className="mt-2 text-lg font-black capitalize text-[#20201E]">{value}</p>
          </div>
        ))}
      </section>

      {recent.length ? (
        <section className="rounded-3xl border border-[#E5DED3] bg-[#FFFDF9] px-5 py-6 sm:px-6">
          <div className="flex items-end justify-between gap-3">
            <h2 className="text-lg font-black text-[#20201E]">Recent Wordle answers</h2>
            <Link prefetch={false} href="/todays-wordle-answer/" className="text-sm font-bold text-[#315C4C]">
              Today
            </Link>
          </div>
          <div className="mt-4 divide-y divide-[#EFE8DE]">
            {recent.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#68645E]">
                    {formatAnswerDate(item.date)}
                  </p>
                  <p className="mt-1 font-black tracking-[0.18em] text-[#20201E]">{(item.answer || "?????").toUpperCase()}</p>
                </div>
                <span className="rounded-full bg-[#E9F2EE] px-3 py-1 text-xs font-bold uppercase text-[#315C4C]">
                  {item.difficulty?.toLowerCase() || "daily"}
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
