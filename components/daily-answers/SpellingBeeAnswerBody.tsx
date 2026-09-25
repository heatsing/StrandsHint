import { HintStack, RevealSummary } from "@/components/daily-answers/DailyAnswerShell";
import type { DailyAnswerEntry } from "@/lib/daily-answers";

export function SpellingBeeAnswerBody({ entry }: { entry: DailyAnswerEntry }) {
  const center = (entry.centerLetter || "?").toUpperCase();
  const outer = (entry.outerLetters || []).map((letter) => letter.toUpperCase());
  const lengths = Object.keys(entry.wordsByLength || {}).sort((a, b) => Number(a) - Number(b));

  return (
    <>
      <section className="rounded-3xl border border-[#E5DED3] bg-[#FFFDF9] px-6 py-8 text-center">
        <h2 className="text-lg font-black text-[#20201E]">Today&apos;s hive</h2>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#F7D560] text-xl font-black text-[#20201E]">
            {center}
          </span>
          {outer.map((letter) => (
            <span
              key={letter}
              className="grid h-12 w-12 place-items-center rounded-2xl bg-[#F3F0EA] text-lg font-black text-[#20201E]"
            >
              {letter}
            </span>
          ))}
        </div>
        {entry.geniusScore ? (
          <p className="mt-5 text-sm font-semibold text-[#68645E]">Genius around {entry.geniusScore} pts</p>
        ) : null}
      </section>

      <HintStack hints={entry.hints} />

      <section className="rounded-3xl border border-[#E5DED3] bg-[#FFFDF9] px-6 py-6 text-center">
        <h2 className="text-lg font-black text-[#20201E]">Pangram</h2>
        <details className="group mt-4">
          <RevealSummary label="Show pangram" tone="soft" />
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {(entry.pangrams || []).map((word) => (
              <span key={word} className="rounded-full bg-[#F7D560] px-4 py-2 text-sm font-black uppercase text-[#20201E]">
                {word}
              </span>
            ))}
          </div>
        </details>
      </section>

      <section className="rounded-3xl border border-[#E5DED3] bg-[#FFFDF9] px-6 py-6">
        <h2 className="text-lg font-black text-[#20201E]">Answers by length</h2>
        <details className="group mt-4 text-center">
          <RevealSummary label="Show all Spelling Bee answers" tone="dark" />
          <div className="mt-5 space-y-5 text-left">
            {lengths.map((length) => (
              <div key={length}>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#68645E]">{length}-letter words</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(entry.wordsByLength?.[length] || []).map((word) => (
                    <span key={word} className="rounded-full bg-[#E9F2EE] px-3 py-1.5 text-xs font-black uppercase text-[#315C4C]">
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {entry.answerNote ? <p className="text-sm leading-7 text-[#68645E]">{entry.answerNote}</p> : null}
          </div>
        </details>
      </section>
    </>
  );
}
