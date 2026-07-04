import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArchiveList } from "@/components/ArchiveList";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getAvailableMonths, getAvailableYears, getPuzzlesByYear } from "@/lib/puzzles";
import { pageTitle } from "@/lib/seo";

type Props = {
  params: { year: string };
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAvailableYears().map((year) => ({ year }));
}

export function generateMetadata({ params }: Props): Metadata {
  return {
    title: pageTitle(`Strands Archive ${params.year}`),
    description: `Strands hints, spangrams, and answers for ${params.year}.`,
    alternates: { canonical: `/archive/${params.year}/` },
  };
}

export default function ArchiveYearPage({ params }: Props) {
  const puzzles = getPuzzlesByYear(params.year).reverse();
  if (puzzles.length === 0) notFound();

  const months = getAvailableMonths(params.year);

  return (
    <>
      <Breadcrumbs items={[{ label: "Archive", href: "/archive/" }, { label: params.year }]} />
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-stone-950">
          Strands Archive {params.year}
        </h1>
        <p className="mt-4 text-lg leading-8 text-stone-600">
          All Strands entries currently stored for {params.year}, grouped down to month pages when
          you want a shorter list.
        </p>
      </header>
      <div className="mt-8 flex flex-wrap gap-2">
        {months.map((month) => (
          <Link key={month} href={`/archive/${params.year}/${month}/`} className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-medium hover:bg-stone-50">
            {params.year}-{month}
          </Link>
        ))}
      </div>
      <section className="mt-8">
        <ArchiveList puzzles={puzzles} />
      </section>
    </>
  );
}
