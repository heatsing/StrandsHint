import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import type { DailyPuzzle } from "@/lib/daily-hints";
import { breadcrumbSchema, disclaimer } from "@/lib/seo";

export function DailyHintPageContent({
  gameName,
  canonicalPath,
  puzzle,
}: {
  gameName: string;
  canonicalPath: string;
  puzzle: DailyPuzzle | null;
}) {
  const faq = [
    { question: "Are answers shown immediately?", answer: "No. Answers stay hidden inside a reveal control until you choose to open them." },
    { question: "Where does the daily content come from?", answer: "Daily content is manually entered for this site and should be original editorial work." },
  ];

  return (
    <article>
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Daily Hints", url: "/daily-hints" }, { name: gameName, url: canonicalPath }])} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }} />
      <header className="py-10">
        <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-[#315C4C]">Daily puzzle hints</p>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl font-black leading-tight text-[#20201E]">
          {puzzle ? puzzle.title : `${gameName} hints are not published yet`}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#68645E]">
          {puzzle
            ? `Updated ${puzzle.updatedAt}. Reveal clues one layer at a time and keep answers hidden until you need them.`
            : "This page is ready for manually entered daily content. Check back after the editor publishes today's hints."}
        </p>
      </header>

      {!puzzle ? (
        <section className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-sm">
          <h2 className="font-serif text-3xl font-black">No daily hint yet</h2>
          <p className="mt-3 text-sm leading-6 text-[#68645E]">
            The content file is missing for this game/date. Use `npm run create:daily-hint`
            to create a local template.
          </p>
        </section>
      ) : (
        <section className="grid gap-4">
          <details className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-5 shadow-sm">
            <summary className="cursor-pointer list-none font-mono text-sm font-bold uppercase tracking-[0.16em] text-[#315C4C]">
              Reveal short hint
            </summary>
            <p className="mt-4 text-lg leading-7">{puzzle.shortHint}</p>
          </details>
          {puzzle.mediumHints.map((hint, index) => (
            <details key={hint} className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-5 shadow-sm">
              <summary className="cursor-pointer list-none font-mono text-sm font-bold uppercase tracking-[0.16em] text-[#315C4C]">
                Reveal hint {index + 2}
              </summary>
              <p className="mt-4 leading-7 text-[#68645E]">{hint}</p>
            </details>
          ))}
          <details className="rounded-2xl border border-[#E5DED3] bg-white p-5 shadow-sm">
            <summary className="cursor-pointer list-none font-mono text-sm font-bold uppercase tracking-[0.16em] text-[#A7473D]">
              Reveal answers
            </summary>
            {puzzle.answers.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {puzzle.answers.map((answer) => (
                  <span key={answer} className="rounded-full bg-[#EDE6DC] px-3 py-1.5 font-mono text-sm font-bold">{answer}</span>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-[#68645E]">No answers have been manually entered yet.</p>
            )}
          </details>
          <section className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-sm">
            <h2 className="font-serif text-3xl font-black">Explanation</h2>
            <p className="mt-3 text-sm leading-6 text-[#68645E]">{puzzle.explanation || "No explanation has been added yet."}</p>
            <p className="mt-4 text-sm leading-6 text-[#68645E]">{disclaimer}</p>
          </section>
        </section>
      )}

      <section className="mt-10 flex flex-wrap gap-3">
        <Link href="/daily-hints" className="rounded-lg border border-[#D4CABD] bg-[#EDE6DC] px-4 py-2 text-sm font-bold hover:bg-[#E3D9CC]">All daily hints</Link>
        <Link href="/all-solvers" className="rounded-lg bg-[#315C4C] px-4 py-2 text-sm font-bold text-white hover:bg-[#274B3E]">Browse solvers</Link>
      </section>
    </article>
  );
}
