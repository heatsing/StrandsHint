import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { dailySeoPages } from "@/lib/daily-seo";
import { absoluteUrl, breadcrumbSchema, disclaimer } from "@/lib/seo";

export const metadata: Metadata = {
  title: "All Daily Puzzle Hints - Wordle, Connections & Strands",
  description:
    "Browse daily puzzle hint pages for Wordle, Connections, Strands, and other manually maintained clue pages.",
  alternates: { canonical: "/daily-hints" },
  openGraph: {
    title: "All Daily Puzzle Hints",
    description: "Daily spoiler-safe hint pages and related word puzzle tools.",
    url: absoluteUrl("/daily-hints"),
    type: "website",
  },
};

const planned = ["Spelling Bee Hints", "Letter Boxed Hints", "Mini Crossword Hints", "Crossword Hints"];

export default function DailyHintsDirectoryPage() {
  return (
    <article>
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Daily Hints", url: "/daily-hints" }])} />
      <header className="py-10">
        <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-[#315C4C]">Daily hints</p>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl font-black leading-tight text-[#20201E]">
          Daily puzzle hints without instant spoilers
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#68645E]">
          Choose a daily clue page, reveal help in layers, and keep answers hidden until you decide
          you are ready.
        </p>
      </header>
      <section>
        <h2 className="font-serif text-3xl font-black">Available today pages</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {dailySeoPages.map((page) => (
            <Link key={page.slug} href={page.path} className="group rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-5 shadow-sm hover:border-[#315C4C]/50">
              <CalendarDays className="h-7 w-7 text-[#315C4C]" />
              <h3 className="mt-4 font-serif text-2xl font-black">{page.h1}</h3>
              <p className="mt-2 text-sm leading-6 text-[#68645E]">{page.searchIntent}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#315C4C]">
                Open hints <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="mt-10">
        <h2 className="font-serif text-3xl font-black">Planned daily pages</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {planned.map((item) => (
            <span key={item} className="rounded-full border border-[#E5DED3] bg-[#EDE6DC] px-4 py-2 text-sm font-bold text-[#68645E]">
              {item}
            </span>
          ))}
        </div>
        <p className="mt-5 rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-5 text-sm leading-6 text-[#68645E]">
          {disclaimer} Daily content is manually prepared and should not be copied from official or competing sites.
        </p>
      </section>
    </article>
  );
}
