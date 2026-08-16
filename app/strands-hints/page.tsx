import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { FAQ } from "@/components/FAQ";
import { JsonLd } from "@/components/JsonLd";
import { getPublishedPuzzles } from "@/lib/puzzle-data";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Strands Hint Calendar - Daily Strands Hints & Answers",
  description:
    "Browse the Strands Hint calendar and open manually updated daily Strands hints, spangram clues, and answer pages.",
  alternates: { canonical: "/strands-hints" },
  openGraph: {
    title: "Strands Hint Calendar",
    description: "Daily Strands hints, spangram clues, and answer pages in a simple calendar view.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Strands Hint Calendar",
    description: "Open daily Strands hint and answer pages from a calendar.",
  },
};

function monthStart(date: string) {
  const value = new Date(`${date}T00:00:00Z`);
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), 1));
}

function formatMonth(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function buildCalendarDates(anchorDate: string) {
  const start = monthStart(anchorDate);
  const firstWeekday = start.getUTCDay();
  const cursor = new Date(start);
  cursor.setUTCDate(start.getUTCDate() - firstWeekday);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(cursor);
    date.setUTCDate(cursor.getUTCDate() + index);
    return {
      date,
      key: date.toISOString().slice(0, 10),
      inMonth: date.getUTCMonth() === start.getUTCMonth(),
      day: date.getUTCDate(),
    };
  });
}

export default async function StrandsHintsPage() {
  const puzzles = await getPublishedPuzzles();
  const latest = puzzles[0];
  const anchorDate = latest?.date ?? new Date().toISOString().slice(0, 10);
  const puzzleByDate = new Map(puzzles.map((puzzle) => [puzzle.date, puzzle]));
  const calendarDates = buildCalendarDates(anchorDate);

  return (
    <article className="mx-auto max-w-6xl">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Strands Hint", url: "/strands-hints" },
        ])}
      />
      <JsonLd
        data={itemListSchema(
          "Strands Hint Daily Calendar",
          puzzles.map((puzzle) => ({
            name: `NYT Strands Hints & Answers ${formatDate(puzzle.date)}`,
            url: `/archive/${puzzle.date}`,
            description: puzzle.seoDescription,
          })),
        )}
      />

      <header className="grid gap-6 py-8 lg:grid-cols-[1fr_20rem] lg:items-end">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-[#E9F7F2] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#008F83]">
            <CalendarDays className="h-4 w-4" />
            Strands Hint Calendar
          </p>
          <h1 className="mt-5 max-w-3xl text-balance text-4xl font-black leading-tight text-[#142436] md:text-5xl">
            Daily Strands hints and answers by date
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#68645E]">
            Pick a date to open that day&apos;s spoiler-safe Strands theme hint, spangram clue,
            spangram reveal, and full answer page. Daily entries are manually maintained.
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-5 shadow-lg shadow-[#315C4C]/8">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-[#008F83]" />
            <h2 className="text-lg font-black text-[#142436]">Daily update plan</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-[#68645E]">
            Add one manual Strands entry each day: theme hint, progressive clues, spangram hint,
            answer explanation, and related links.
          </p>
        </div>
      </header>

      <section className="rounded-3xl border border-[#E5DED3] bg-[#FFFDF9] p-5 shadow-lg shadow-[#315C4C]/8">
        <div className="flex flex-col gap-3 border-b border-[#E5DED3] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-[#142436]">{formatMonth(monthStart(anchorDate))}</h2>
            <p className="mt-1 text-sm text-[#68645E]">
              Published dates are highlighted. Select one to view hints and answers.
            </p>
          </div>
          <Link
            prefetch={false}
            href="/todays-strands-answer/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#008F83] px-5 py-3 text-sm font-black text-white hover:bg-[#00766D]"
          >
            Today&apos;s Answers <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-7 gap-2 text-center text-xs font-black uppercase tracking-[0.12em] text-[#8A857E]">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-7 gap-2">
          {calendarDates.map((item) => {
            const puzzle = puzzleByDate.get(item.key);
            const content = (
              <div
                className={[
                  "min-h-24 rounded-2xl border p-3 text-left transition",
                  puzzle
                    ? "border-[#008F83]/35 bg-[#E9F7F2] shadow-sm hover:-translate-y-0.5 hover:border-[#008F83]"
                    : "border-[#E5DED3] bg-[#F8F5EF] text-[#B8B1A8]",
                  item.inMonth ? "" : "opacity-45",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-black text-[#142436]">{item.day}</span>
                  {puzzle ? <CheckCircle2 className="h-4 w-4 text-[#008F83]" /> : <Clock className="h-4 w-4" />}
                </div>
                {puzzle ? (
                  <>
                    <p className="mt-3 line-clamp-2 text-xs font-bold leading-5 text-[#142436]">{puzzle.themeHint}</p>
                    <p className="mt-2 text-[0.7rem] font-black uppercase tracking-[0.12em] text-[#008F83]">
                      View hints
                    </p>
                  </>
                ) : (
                  <p className="mt-3 text-xs leading-5">No entry</p>
                )}
              </div>
            );

            return puzzle ? (
              <Link prefetch={false} key={item.key} href={`/archive/${item.key}/`} aria-label={`Open Strands hints for ${formatDate(item.key)}`}>
                {content}
              </Link>
            ) : (
              <div key={item.key}>{content}</div>
            );
          })}
        </div>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        {puzzles.slice(0, 6).map((puzzle) => (
          <Link
            prefetch={false}
            key={puzzle.id}
            href={`/archive/${puzzle.date}/`}
            className="group rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-5 shadow-md shadow-[#315C4C]/5 hover:border-[#008F83]/50"
          >
            <p className="text-sm font-black text-[#008F83]">{formatDate(puzzle.date)}</p>
            <h2 className="mt-3 text-xl font-black text-[#142436]">{puzzle.title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#68645E]">{puzzle.themeHint}</p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#008F83]">
              Open hints <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </section>

      <FAQ
        items={[
          {
            question: "Should Strands Hint be updated every day?",
            answer:
              "Yes. The site should publish one manually written daily page with spoiler-safe hints, spangram help, and answer explanation.",
          },
          {
            question: "Does the calendar auto-copy official puzzle content?",
            answer:
              "No. The calendar only links to manually published entries. It does not fetch or scrape official puzzle feeds.",
          },
          {
            question: "What should each daily page include?",
            answer:
              "Each page should include a date, theme hint, progressive hints, spangram hint, hidden spangram, hidden full answers, explanation, FAQ, and related links.",
          },
        ]}
      />
    </article>
  );
}
