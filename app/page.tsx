import Link from "next/link";
import { MonthCalendar } from "@/components/MonthCalendar";
import { formatDisplayDate, listContentDates, todayIsoUtc } from "@/lib/content";

export default async function HomePage() {
  const contentDates = await listContentDates();
  const todayIso = todayIsoUtc();

  return (
    <main className="max-w-3xl">
      <header className="mb-10">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
          NYT Hints &amp; Answers — calendar
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-600">
          Choose a date below to open a full blog-style post with Wordle hints, Strands (theme + spangram),
          Connections groups, and an FAQ—built for reading top to bottom, with spoilers tucked away.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/${todayIso}/`}
            className="inline-flex items-center rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-ink-800"
          >
            Today&apos;s article
          </Link>
          <Link
            href="/sitemap.xml"
            className="inline-flex items-center rounded-full border border-ink-200 bg-white px-5 py-2.5 text-sm font-medium text-ink-800 hover:border-ink-400"
          >
            Sitemap
          </Link>
        </div>
      </header>

      <div id="calendar">
        <h2 className="mb-4 font-serif text-xl font-semibold text-ink-900">Pick a date</h2>
        <MonthCalendar contentDates={contentDates} todayIso={todayIso} />
      </div>

      <section className="prose prose-stone mt-14 max-w-none border-t border-ink-200 pt-10 prose-headings:font-serif">
        <h2>Recent posts</h2>
        <ul>
          {contentDates.slice(-6).map((d) => (
            <li key={d}>
              <Link href={`/${d}/`}>{formatDisplayDate(d)}</Link>{" "}
              <span className="text-ink-400">({d})</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
