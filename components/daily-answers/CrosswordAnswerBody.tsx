import { HintStack, RevealSummary } from "@/components/daily-answers/DailyAnswerShell";
import type { ClueAnswer, DailyAnswerEntry } from "@/lib/daily-answers";

function ClueList({ title, items }: { title: string; items: ClueAnswer[] }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#315C4C]">{title}</h3>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <details
            key={`${title}-${item.number ?? item.clue}`}
            className="group rounded-2xl border border-[#E5DED3] bg-white px-4 py-3"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-sm text-[#20201E]">
              <span className="font-semibold leading-6">
                {item.number ? <span className="mr-2 font-black text-[#315C4C]">{item.number}.</span> : null}
                {item.clue}
              </span>
              <span className="shrink-0 text-xs font-bold uppercase tracking-[0.14em] text-[#68645E] group-open:hidden">
                Show
              </span>
              <span className="hidden shrink-0 text-xs font-bold uppercase tracking-[0.14em] text-[#68645E] group-open:inline">
                Hide
              </span>
            </summary>
            {item.hint ? <p className="mt-2 text-sm leading-6 text-[#68645E]">{item.hint}</p> : null}
            <p className="mt-3 font-mono text-sm font-black uppercase tracking-wide text-[#20201E]">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

export function CrosswordAnswerBody({
  entry,
  compact = false,
}: {
  entry: DailyAnswerEntry;
  compact?: boolean;
}) {
  const across = entry.across || [];
  const down = entry.down || [];

  return (
    <>
      <HintStack hints={entry.hints} />

      <section className="rounded-3xl border border-[#E5DED3] bg-[#FFFDF9] px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-black text-[#20201E]">
            {compact ? "Mini clues" : "Clues & answers"}
          </h2>
          <details className="group">
            <RevealSummary label="Reveal all answers" tone="dark" />
            <div className="mt-4 max-w-md rounded-2xl border border-[#E5DED3] bg-white px-4 py-4 text-left text-sm leading-7 text-[#68645E]">
              <p className="font-bold text-[#20201E]">Across</p>
              <ul className="mt-2 space-y-1">
                {across.map((item) => (
                  <li key={`all-a-${item.number}-${item.answer}`}>
                    {item.number}. {item.clue}: <span className="font-mono font-black text-[#20201E]">{item.answer}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 font-bold text-[#20201E]">Down</p>
              <ul className="mt-2 space-y-1">
                {down.map((item) => (
                  <li key={`all-d-${item.number}-${item.answer}`}>
                    {item.number}. {item.clue}: <span className="font-mono font-black text-[#20201E]">{item.answer}</span>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </div>

        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <ClueList title="Across" items={across} />
          <ClueList title="Down" items={down} />
        </div>
        {entry.answerNote ? <p className="mt-5 text-sm leading-7 text-[#68645E]">{entry.answerNote}</p> : null}
      </section>
    </>
  );
}
