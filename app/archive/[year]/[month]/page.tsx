import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchiveList } from "@/components/ArchiveList";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getAvailableMonths, getAvailableYears, getPuzzlesByMonth } from "@/lib/puzzles";
import { pageTitle } from "@/lib/seo";

type Props = {
  params: { year: string; month: string };
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const dynamicParams = false;

export function generateStaticParams() {
  return getAvailableYears().flatMap((year) =>
    getAvailableMonths(year).map((month) => ({ year, month })),
  );
}

export function generateMetadata({ params }: Props): Metadata {
  const label = `${monthNames[Number(params.month) - 1] ?? params.month} ${params.year}`;
  return {
    title: pageTitle(`Strands Archive ${label}`),
    description: `Browse Strands hints, spangrams, and answers for ${label}.`,
    alternates: { canonical: `/archive/${params.year}/${params.month}/` },
  };
}

export default function ArchiveMonthPage({ params }: Props) {
  const puzzles = getPuzzlesByMonth(params.year, params.month).reverse();
  if (puzzles.length === 0) notFound();

  const label = `${monthNames[Number(params.month) - 1] ?? params.month} ${params.year}`;

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Archive", href: "/archive/" },
          { label: params.year, href: `/archive/${params.year}/` },
          { label },
        ]}
      />
      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-stone-950">
          Strands Archive {label}
        </h1>
        <p className="mt-4 text-lg leading-8 text-stone-600">
          A focused list for {label}. Open any date to reveal the theme, a few hints, the
          spangram, and the full set of theme words.
        </p>
      </header>
      <section className="mt-8">
        <ArchiveList puzzles={puzzles} />
      </section>
    </>
  );
}
