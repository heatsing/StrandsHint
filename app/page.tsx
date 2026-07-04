import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PuzzleCard } from "@/components/PuzzleCard";
import { getLatestPuzzle } from "@/lib/puzzles";
import { websiteSchema } from "@/lib/seo";

export default function HomePage() {
  const latest = getLatestPuzzle();

  return (
    <>
      <JsonLd data={websiteSchema()} />
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
            Daily Strands help
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
            Strands hints, spangram, and answers
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">
            Start with a small nudge, reveal the spangram if you need it, or jump straight to
            the answer list. Every puzzle page is kept simple on purpose.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/today/" className="rounded-md bg-stone-900 px-5 py-3 text-sm font-medium text-white hover:bg-stone-700">
              Today&apos;s hints
            </Link>
            <Link href="/archive/" className="rounded-md border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-800 hover:border-stone-500">
              Browse archive
            </Link>
          </div>
        </div>
        {latest ? <PuzzleCard puzzle={latest} href="/today/" /> : null}
      </section>

      <section className="mt-14 grid gap-4 sm:grid-cols-3">
        <Link href="/yesterday/" className="rounded-lg border border-stone-200 bg-white p-5 hover:bg-stone-50">
          <h2 className="font-semibold text-stone-950">Yesterday</h2>
          <p className="mt-2 text-sm text-stone-600">Missed one? Open the previous daily page.</p>
        </Link>
        <Link href="/archive/" className="rounded-lg border border-stone-200 bg-white p-5 hover:bg-stone-50">
          <h2 className="font-semibold text-stone-950">Archive</h2>
          <p className="mt-2 text-sm text-stone-600">Browse older Strands puzzles by date.</p>
        </Link>
        <Link href="/solver/" className="rounded-lg border border-stone-200 bg-white p-5 hover:bg-stone-50">
          <h2 className="font-semibold text-stone-950">Solver</h2>
          <p className="mt-2 text-sm text-stone-600">A lightweight helper for sorting letters.</p>
        </Link>
      </section>

      <section className="mt-16 max-w-3xl border-t border-stone-200 pt-10 text-stone-700">
        <h2 className="text-2xl font-semibold text-stone-950">How this Strands archive works</h2>
        <div className="mt-5 space-y-4 leading-7">
          <p>
            Strands is easier to enjoy when the page does not spoil everything at once. That is
            the idea here. The daily page starts with the theme and a few small hints, then lets
            you reveal the spangram and answer list only when you are ready.
          </p>
          <p>
            The archive is maintained from local JSON files, one puzzle per date. There is no AI
            answer generator, no database, and no login wall. If a date has been added, it gets
            its own answer page and appears in the archive and sitemap automatically.
          </p>
          <p>
            The solver page is intentionally modest for now. It is there for letter notes and
            basic checking, not as a promise that it can recreate the official grid. A dictionary
            search can be added later without changing the daily puzzle format.
          </p>
        </div>
      </section>
    </>
  );
}
