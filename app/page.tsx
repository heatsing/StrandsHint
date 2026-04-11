import Link from "next/link";
import { MonthCalendar } from "@/components/MonthCalendar";
import { listContentDates, todayIsoUtc } from "@/lib/content";

export default async function HomePage() {
  const contentDates = await listContentDates();
  const todayIso = todayIsoUtc();

  return (
    <main>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          NYT games hints calendar
        </h1>
        <p className="mt-3 max-w-prose text-ink-600">
          Pick a date for Wordle, Strands, Connections, Crossword, Mini, and more—tabbed hints with
          spoiler answers and anchor links like{" "}
          <code className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-sm">#connections</code>.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={`/${todayIso}`}
            className="inline-flex items-center rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-ink-800"
          >
            Open today&apos;s page
          </Link>
          <Link
            href="/strands-hint"
            className="inline-flex items-center rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-800 hover:border-ink-400"
          >
            Legacy /strands-hint → today
          </Link>
        </div>
      </div>

      <div id="calendar">
        <MonthCalendar contentDates={contentDates} todayIso={todayIso} />
      </div>

      <section className="mt-12 rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-ink-900">Internal links</h2>
        <ul className="mt-3 space-y-2 text-sm text-ink-600">
          <li>
            <Link className="text-ink-800 underline-offset-4 hover:underline" href="/sitemap.xml">
              Sitemap
            </Link>
          </li>
          {contentDates.slice(-5).map((d) => (
            <li key={d}>
              <Link className="text-ink-800 underline-offset-4 hover:underline" href={`/${d}`}>
                {d}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
