import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { dailyAnswerGames, formatAnswerDate, getTodayAnswer } from "@/lib/daily-answers";
import { breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Today's Puzzle Answers",
  description:
    "Spoiler-safe daily answer pages for Wordle, Connections, Spelling Bee, Pips, Mini Crossword, Crossword, and Strands.",
  alternates: { canonical: "/todays-answers" },
};

export default function TodaysAnswersHubPage() {
  return (
    <article className="mx-auto max-w-3xl">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Today's Answers", url: "/todays-answers" },
        ])}
      />

      <header className="py-8 text-center">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-[#315C4C]">Daily hub</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-[#20201E] sm:text-5xl">Today&apos;s Answers</h1>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-[#68645E]">
          Pick a game, open only the spoilers you need, and keep the rest of the day fresh.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          prefetch={false}
          href="/todays-strands-answer/"
          className="rounded-3xl border border-[#E5DED3] bg-[#FFFDF9] px-5 py-6 transition hover:border-[#315C4C]/35 hover:bg-white"
        >
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#16A66A]">Strands</p>
          <h2 className="mt-2 text-xl font-black text-[#20201E]">Today&apos;s Strands Answer</h2>
          <p className="mt-2 text-sm leading-6 text-[#68645E]">Theme, spangram, and theme-word reveals.</p>
        </Link>

        {dailyAnswerGames.map((game) => {
          const entry = getTodayAnswer(game.game);
          return (
            <Link
              key={game.path}
              prefetch={false}
              href={game.path}
              className="rounded-3xl border border-[#E5DED3] bg-[#FFFDF9] px-5 py-6 transition hover:border-[#315C4C]/35 hover:bg-white"
            >
              <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: game.accent }}>
                {game.name}
              </p>
              <h2 className="mt-2 text-xl font-black text-[#20201E]">{game.name} Answer</h2>
              <p className="mt-2 text-sm leading-6 text-[#68645E]">
                {entry ? formatAnswerDate(entry.date) : "Awaiting today's publish"}
              </p>
            </Link>
          );
        })}
      </div>
    </article>
  );
}
