import Link from "next/link";
import { ArrowRight, CalendarDays, Eye } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { NextPuzzleCountdown } from "@/components/NextPuzzleCountdown";
import {
  dailyAnswerGames,
  formatAnswerDate,
  type DailyAnswerEntry,
  type DailyAnswerGameConfig,
} from "@/lib/daily-answers";
import { disclaimer } from "@/lib/seo";

export function RevealSummary({
  label,
  tone = "primary",
}: {
  label: string;
  tone?: "primary" | "soft" | "dark";
}) {
  const toneClass =
    tone === "dark"
      ? "bg-[#20201E] text-white hover:bg-[#315C4C]"
      : tone === "soft"
        ? "bg-[#EDE6DC] text-[#20201E] hover:bg-[#E3D9CC]"
        : "bg-[#315C4C] text-white hover:bg-[#274B3E]";

  return (
    <summary
      className={[
        "inline-flex cursor-pointer list-none items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold shadow-sm transition",
        toneClass,
      ].join(" ")}
    >
      <Eye className="h-4 w-4" />
      <span className="group-open:hidden">{label}</span>
      <span className="hidden group-open:inline">Hide</span>
    </summary>
  );
}

export function DailyAnswerShell({
  config,
  entry,
  children,
  faq,
}: {
  config: DailyAnswerGameConfig;
  entry: DailyAnswerEntry | null;
  children: React.ReactNode;
  faq: [string, string][];
}) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <article className="mx-auto max-w-2xl pb-8">
      <JsonLd data={faqSchema} />

      <nav className="text-xs font-semibold text-[#68645E]" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link prefetch={false} href="/" className="hover:text-[#315C4C]">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link prefetch={false} href="/todays-answers/" className="hover:text-[#315C4C]">
              Today&apos;s Answers
            </Link>
          </li>
          <li>/</li>
          <li className="text-[#20201E]">{config.name}</li>
        </ol>
      </nav>

      <header className="mt-10 text-center">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-[#315C4C]">
          Spoiler-safe daily page
        </p>
        <h1 className="mt-4 text-balance text-[2rem] font-black leading-tight tracking-tight text-[#20201E] sm:text-5xl">
          {entry?.title ?? `${config.name} Answer Today`}
        </h1>
        {entry ? (
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#E5DED3] bg-[#FFFDF9] px-4 py-2 text-sm font-semibold text-[#315C4C]">
            <CalendarDays className="h-4 w-4" />
            {formatAnswerDate(entry.date)}
          </div>
        ) : null}
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-7 text-[#68645E]">
          {entry?.summary ?? config.description}
        </p>
      </header>

      {!entry ? (
        <section className="mt-10 rounded-3xl border border-dashed border-[#D4CABD] bg-[#FFFDF9] px-6 py-10 text-center">
          <h2 className="text-xl font-black text-[#20201E]">No published answer yet</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#68645E]">
            {config.howToUpdate} Use{" "}
            <code className="rounded bg-[#EDE6DC] px-1.5 py-0.5 text-xs">npm run daily:answer</code> to
            create today&apos;s draft, then publish and deploy.
          </p>
        </section>
      ) : (
        <div className="mt-10 space-y-5">{children}</div>
      )}

      <div className="mt-10">
        <NextPuzzleCountdown />
      </div>

      <section className="mt-12">
        <h2 className="text-center text-2xl font-black text-[#20201E]">More daily answers</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {dailyAnswerGames.map((game) => (
            <Link
              key={game.path}
              prefetch={false}
              href={game.path}
              className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] px-4 py-5 text-center transition hover:border-[#315C4C]/35 hover:bg-white"
            >
              <span
                className="mx-auto mb-3 block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: game.accent }}
              />
              <p className="text-sm font-bold text-[#20201E]">{game.name}</p>
            </Link>
          ))}
          <Link
            prefetch={false}
            href="/todays-strands-answer/"
            className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] px-4 py-5 text-center transition hover:border-[#315C4C]/35 hover:bg-white"
          >
            <span className="mx-auto mb-3 block h-2.5 w-2.5 rounded-full bg-[#16A66A]" />
            <p className="text-sm font-bold text-[#20201E]">Strands</p>
          </Link>
        </div>
      </section>

      <section className="mt-12 rounded-3xl border border-[#E5DED3] bg-[#FFFDF9] px-6 py-7">
        <h2 className="text-xl font-black text-[#20201E]">How to use this page</h2>
        <p className="mt-3 text-sm leading-7 text-[#68645E]">
          Open only the help you need. Soft hints come first; full answers stay behind a reveal so you
          can keep solving.
        </p>
        <p className="mt-4 text-sm leading-7 text-[#68645E]">{disclaimer}</p>
      </section>

      <section className="mt-10">
        <h2 className="text-center text-2xl font-black text-[#20201E]">FAQ</h2>
        <div className="mt-5 divide-y divide-[#E5DED3] overflow-hidden rounded-3xl border border-[#E5DED3] bg-[#FFFDF9]">
          {faq.map(([question, answer]) => (
            <details key={question} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-[#20201E]">
                {question}
                <ArrowRight className="h-4 w-4 shrink-0 text-[#315C4C] transition group-open:rotate-90" />
              </summary>
              <p className="mt-3 text-sm leading-7 text-[#68645E]">{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </article>
  );
}

export function HintStack({ hints }: { hints: string[] }) {
  if (!hints.length) return null;
  return (
    <section className="rounded-3xl border border-[#D6E8DF] bg-[#E9F2EE] px-6 py-6">
      <h2 className="text-lg font-black text-[#20201E]">Gentle hints</h2>
      <div className="mt-4 space-y-3">
        {hints.map((hint, index) => (
          <details key={hint} className="group rounded-2xl bg-white/80 px-4 py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-[#315C4C]">
              Hint {index + 1}
              <Eye className="h-4 w-4" />
            </summary>
            <p className="mt-2 text-sm leading-7 text-[#68645E]">{hint}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
