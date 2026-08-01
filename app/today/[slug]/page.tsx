import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, Lightbulb, ListChecks, RefreshCw } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import {
  dailyFaqSchema,
  dailyPageSchema,
  dailySeoPages,
  getDailySeoPage,
} from "@/lib/daily-seo";
import { absoluteUrl, breadcrumbSchema, disclaimer } from "@/lib/seo";

type PageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return dailySeoPages.map((page) => ({ slug: page.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const page = getDailySeoPage(params.slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.metaDescription,
    alternates: { canonical: page.path },
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      url: absoluteUrl(page.path),
      type: "article",
    },
  };
}

export default function DailySeoPage({ params }: PageProps) {
  const page = getDailySeoPage(params.slug);
  if (!page) notFound();

  return (
    <article className="-mt-4">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Today", url: "/today/strands-hints" },
          { name: page.h1, url: page.path },
        ])}
      />
      <JsonLd data={dailyPageSchema(page)} />
      <JsonLd data={dailyFaqSchema(page)} />

      <header className="grid gap-8 py-10 lg:grid-cols-[1fr_22rem] lg:items-end">
        <div>
          <p className="font-mono text-sm font-bold uppercase tracking-[0.22em] text-[#E8A93D]">
            Daily puzzle hints
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl font-black leading-tight text-[#F6F1E6]">
            {page.h1}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#F6F1E6]/75">{page.intro}</p>
        </div>
        <aside className="rounded-2xl border border-[#F3ECDD]/15 bg-[#1B2138] p-5">
          <div className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#E8A93D]">
            <RefreshCw className="h-4 w-4" />
            Freshness target
          </div>
          <p className="mt-3 text-sm leading-6 text-[#F6F1E6]/70">{page.freshContentNote}</p>
        </aside>
      </header>

      <section className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="rounded-2xl border border-[#F3ECDD]/15 bg-[#1B2138] p-6">
          <CalendarDays className="h-8 w-8 text-[#E8A93D]" />
          <h2 className="mt-4 font-serif text-3xl font-black text-[#F6F1E6]">Search intent</h2>
          <dl className="mt-5 grid gap-4 text-sm">
            <div>
              <dt className="font-mono font-bold uppercase tracking-[0.14em] text-[#E8A93D]">Keyword</dt>
              <dd className="mt-1 text-[#F6F1E6]/75">{page.targetKeyword}</dd>
            </div>
            <div>
              <dt className="font-mono font-bold uppercase tracking-[0.14em] text-[#E8A93D]">Intent</dt>
              <dd className="mt-1 text-[#F6F1E6]/75">{page.searchIntent}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-[#F3ECDD]/15 bg-[#1B2138] p-6">
          <h2 className="font-serif text-3xl font-black text-[#F6F1E6]">Progressive hints</h2>
          <div className="mt-5 grid gap-3">
            {page.progressiveHints.map((hint, index) => (
              <details key={hint} className="group rounded-xl bg-[#12172B] p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-mono text-sm font-bold uppercase tracking-[0.14em] text-[#F6F1E6]">
                  Hint {index + 1}
                  <Lightbulb className="h-5 w-5 text-[#E8A93D]" />
                </summary>
                <p className="mt-3 text-sm leading-6 text-[#F6F1E6]/75">{hint}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#F3ECDD]/15 bg-[#1B2138] p-6">
          <ListChecks className="h-8 w-8 text-[#2F8F7E]" />
          <h2 className="mt-4 font-serif text-3xl font-black text-[#F6F1E6]">Answer explanation framework</h2>
          <p className="mt-4 text-sm leading-7 text-[#F6F1E6]/75">{page.answerExplanation}</p>
          <p className="mt-4 rounded-xl bg-[#12172B] p-4 text-sm leading-6 text-[#F6F1E6]/65">
            {disclaimer}
          </p>
        </div>
        <div className="rounded-2xl border border-[#F3ECDD]/15 bg-[#1B2138] p-6">
          <h2 className="font-serif text-3xl font-black text-[#F6F1E6]">Helpful tips</h2>
          <ul className="mt-5 grid gap-3">
            {page.tips.map((tip) => (
              <li key={tip} className="rounded-xl bg-[#12172B] p-4 text-sm leading-6 text-[#F6F1E6]/75">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-[#F3ECDD]/15 bg-[#1B2138] p-6">
        <h2 className="font-serif text-3xl font-black text-[#F6F1E6]">Related puzzle pages</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {page.relatedPages.map((related) => (
            <Link
              key={related.href}
              href={related.href}
              className="group rounded-xl border border-[#F3ECDD]/15 bg-[#12172B] p-5 hover:border-[#E8A93D]/70"
            >
              <h3 className="font-serif text-xl font-black text-[#F6F1E6]">{related.label}</h3>
              <p className="mt-2 text-sm leading-6 text-[#F6F1E6]/65">{related.description}</p>
              <span className="mt-4 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#E8A93D]">
                Next step <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-[#F3ECDD]/15 bg-[#1B2138] p-6">
        <h2 className="font-serif text-3xl font-black text-[#F6F1E6]">FAQ</h2>
        <div className="mt-5 grid gap-3">
          {page.faq.map((item) => (
            <details key={item.question} className="group rounded-xl bg-[#12172B] p-4">
              <summary className="cursor-pointer list-none font-semibold text-[#F6F1E6]">{item.question}</summary>
              <p className="mt-3 text-sm leading-6 text-[#F6F1E6]/70">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </article>
  );
}
