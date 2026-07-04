import type { Metadata } from "next";
import Link from "next/link";
import { ArchiveList } from "@/components/ArchiveList";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getAllPuzzles, getAvailableMonths, getAvailableYears } from "@/lib/puzzles";
import { pageTitle } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageTitle("Strands Archive"),
  description:
    "Browse past Strands hints, spangrams, and answers by date. Each entry links to a full puzzle page.",
  alternates: { canonical: "/archive/" },
};

export default function ArchivePage() {
  const puzzles = getAllPuzzles().reverse();
  const years = getAvailableYears();

  return (
    <>
      <Breadcrumbs items={[{ label: "Archive" }]} />
      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-stone-950">Strands Archive</h1>
        <p className="mt-4 text-lg leading-8 text-stone-600">
          Pick a date to open the theme, hints, spangram, and answer list. New JSON files appear
          here automatically after a build.
        </p>
      </header>

      <div className="mt-8 flex flex-wrap gap-2">
        {years.map((year) => (
          <Link key={year} href={`/archive/${year}/`} className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-medium hover:bg-stone-50">
            {year}
          </Link>
        ))}
      </div>

      <section className="mt-8">
        <ArchiveList puzzles={puzzles} />
      </section>

      <section className="mt-12 max-w-3xl border-t border-stone-200 pt-8 text-stone-700">
        <h2 className="text-2xl font-semibold text-stone-950">A simple date trail</h2>
        <p className="mt-4 leading-7">
          The archive is meant for quick backtracking. Use it when you want to compare a theme
          from an older day, check a spangram, or fill a missing answer list without scrolling
          through a long feed. If a year has many entries, the year and month pages make it easier
          to narrow the list.
        </p>
        {years.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            {years.flatMap((year) =>
              getAvailableMonths(year).map((month) => (
                <Link key={`${year}-${month}`} href={`/archive/${year}/${month}/`} className="rounded-md border border-stone-300 bg-white px-3 py-2 hover:bg-stone-50">
                  {year}-{month}
                </Link>
              )),
            )}
          </div>
        ) : null}
      </section>
    </>
  );
}
