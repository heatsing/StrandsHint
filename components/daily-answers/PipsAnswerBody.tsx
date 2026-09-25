import { HintStack, RevealSummary } from "@/components/daily-answers/DailyAnswerShell";
import type { DailyAnswerEntry } from "@/lib/daily-answers";

export function PipsAnswerBody({ entry }: { entry: DailyAnswerEntry }) {
  const sections = entry.sections || [];

  return (
    <>
      <HintStack hints={entry.hints} />

      <section className="rounded-3xl border border-[#E5DED3] bg-[#FFFDF9] px-6 py-6">
        <h2 className="text-lg font-black text-[#20201E]">Step-by-step reveals</h2>
        <p className="mt-2 text-sm leading-7 text-[#68645E]">
          Keep later steps closed while you work through earlier constraints.
        </p>
        <div className="mt-5 space-y-3">
          {sections.map((section, index) => (
            <details key={section.title} className="group rounded-2xl border border-[#E5DED3] bg-white px-4 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-[#20201E]">
                <span>
                  {index + 1}. {section.title}
                </span>
                <span className="text-[#68645E] group-open:hidden">Show</span>
                <span className="hidden text-[#68645E] group-open:inline">Hide</span>
              </summary>
              {section.hint ? <p className="mt-3 text-sm leading-7 text-[#68645E]">{section.hint}</p> : null}
              <details className="group/answer mt-3">
                <RevealSummary label="Reveal this step" tone="soft" />
                <div className="mt-3 rounded-xl bg-[#E9F2EE] px-4 py-3">
                  <p className="text-sm font-bold text-[#315C4C]">{section.answer}</p>
                  {section.detail ? <p className="mt-2 text-sm leading-7 text-[#68645E]">{section.detail}</p> : null}
                </div>
              </details>
            </details>
          ))}
        </div>
        {entry.answerNote ? (
          <p className="mt-5 text-sm leading-7 text-[#68645E]">{entry.answerNote}</p>
        ) : null}
      </section>
    </>
  );
}
