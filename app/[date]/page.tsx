import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DailyHintsTabs } from "@/components/DailyHintsTabs";
import { DayNav } from "@/components/DayNav";
import {
  addDaysIso,
  formatDisplayDate,
  listContentDates,
  parseDateParam,
  readDailyHints,
} from "@/lib/content";
import { getNeighborDates } from "@/lib/neighbors";

type Props = { params: { date: string } };

export const dynamicParams = false;

export async function generateStaticParams() {
  const dates = await listContentDates();
  return dates.map((date) => ({ date }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = params;
  if (!parseDateParam(date)) return { title: "NYT hints" };

  const data = await readDailyHints(date);
  if (!data) return { title: "NYT hints" };

  const display = formatDisplayDate(date);
  const title = `${data.pageTitle} — Hints & answers`;
  const description = `NYT games hints for ${display}: Wordle, Strands, Connections, Crossword, Mini, and more. Anchor links: #wordle, #connections.`;

  return {
    title,
    description,
    alternates: { canonical: `/${date}` },
    openGraph: {
      title,
      description,
      type: "article",
    },
  };
}

export default async function DatePage({ params }: Props) {
  const { date } = params;
  if (!parseDateParam(date)) notFound();

  const data = await readDailyHints(date);
  if (!data) notFound();

  const display = formatDisplayDate(date);
  const neighbors = await getNeighborDates(date);
  const allDates = await listContentDates();
  const dateSet = new Set(allDates);
  const yIso = addDaysIso(date, -1);
  const tIso = addDaysIso(date, 1);
  const yesterdayHref = dateSet.has(yIso) ? `/${yIso}` : undefined;
  const tomorrowHref = dateSet.has(tIso) ? `/${tIso}` : undefined;

  return (
    <main>
      <nav className="text-sm text-ink-500" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-ink-800 hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-ink-800">{display}</li>
        </ol>
      </nav>

      <header className="mt-6">
        <h1 className="text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          {data.pageTitle}
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          Jump to:{" "}
          <a href={`/${date}#wordle`} className="underline-offset-2 hover:underline">
            Wordle
          </a>
          {" · "}
          <a href={`/${date}#connections`} className="underline-offset-2 hover:underline">
            Connections
          </a>
          {" · "}
          <a href={`/${date}#strands`} className="underline-offset-2 hover:underline">
            Strands
          </a>
        </p>
      </header>

      <div className="mt-8">
        <DailyHintsTabs data={data} />
      </div>

      <div className="mt-12 space-y-6 border-t border-ink-200 pt-8">
        <DayNav
          prevDate={neighbors.prev}
          nextDate={neighbors.next}
          yesterdayHref={yesterdayHref}
          tomorrowHref={tomorrowHref}
        />
        <p className="text-center text-sm text-ink-500">
          <Link href="/" className="underline-offset-4 hover:underline">
            Back to calendar
          </Link>
        </p>
      </div>
    </main>
  );
}
