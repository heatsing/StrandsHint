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
    title: page.dailyContent?.headline ?? page.title,
    description: page.metaDescription,
    alternates: { canonical: page.path },
    openGraph: {
      title: page.dailyContent?.headline ?? page.title,
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
          <p className="font-mono text-sm font-bold uppercase tracking-[0.22em] text-[#315C4C]">
            Daily puzzle hints
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl font-black leading-tight text-[#20201E]">
            {page.h1}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#68645E]">{page.intro}</p>
        </div>
        <aside className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-5">
          <div className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#315C4C]">
            <RefreshCw className="h-4 w-4" />
            Freshness target
          </div>
          {page.dailyContent ? (
            <p className="mt-3 font-mono text-sm font-bold text-[#20201E]">
              Last updated: {page.dailyContent.date}
            </p>
          ) : null}
          <p className="mt-3 text-sm leading-6 text-[#68645E]">{page.freshContentNote}</p>
        </aside>
      </header>

      <section className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6">
          <CalendarDays className="h-8 w-8 text-[#315C4C]" />
          <h2 className="mt-4 font-serif text-3xl font-black text-[#20201E]">Search intent</h2>
          <dl className="mt-5 grid gap-4 text-sm">
            <div>
              <dt className="font-mono font-bold uppercase tracking-[0.14em] text-[#315C4C]">Keyword</dt>
              <dd className="mt-1 text-[#68645E]">{page.targetKeyword}</dd>
            </div>
            <div>
              <dt className="font-mono font-bold uppercase tracking-[0.14em] text-[#315C4C]">Intent</dt>
              <dd className="mt-1 text-[#68645E]">{page.searchIntent}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6">
          <h2 className="font-serif text-3xl font-black text-[#20201E]">Progressive hints</h2>
          <div className="mt-5 grid gap-3">
            {page.progressiveHints.map((hint, index) => (
              <details key={hint} className="group rounded-xl bg-[#FFFFFF] p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-mono text-sm font-bold uppercase tracking-[0.14em] text-[#20201E]">
                  Hint {index + 1}
                  <Lightbulb className="h-5 w-5 text-[#315C4C]" />
                </summary>
                <p className="mt-3 text-sm leading-6 text-[#68645E]">{hint}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6">
          <ListChecks className="h-8 w-8 text-[#2F8F7E]" />
          <h2 className="mt-4 font-serif text-3xl font-black text-[#20201E]">
            {page.dailyContent?.answerLabel ?? "Answer explanation framework"}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#68645E]">{page.answerExplanation}</p>
          <p className="mt-4 rounded-xl bg-[#FFFFFF] p-4 text-sm leading-6 text-[#68645E]">
            {disclaimer}
          </p>
        </div>
        <div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6">
          <h2 className="font-serif text-3xl font-black text-[#20201E]">Helpful tips</h2>
          <ul className="mt-5 grid gap-3">
            {page.tips.map((tip) => (
              <li key={tip} className="rounded-xl bg-[#FFFFFF] p-4 text-sm leading-6 text-[#68645E]">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6">
        <h2 className="font-serif text-3xl font-black text-[#20201E]">Related puzzle pages</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {page.relatedPages.map((related) => (
            <Link
              key={related.href}
              href={related.href}
              className="group rounded-xl border border-[#E5DED3] bg-[#FFFFFF] p-5 hover:border-[#315C4C]/70"
            >
              <h3 className="font-serif text-xl font-black text-[#20201E]">{related.label}</h3>
              <p className="mt-2 text-sm leading-6 text-[#68645E]">{related.description}</p>
              <span className="mt-4 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#315C4C]">
                Next step <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6">
        <h2 className="font-serif text-3xl font-black text-[#20201E]">FAQ</h2>
        <div className="mt-5 grid gap-3">
          {page.faq.map((item) => (
            <details key={item.question} className="group rounded-xl bg-[#FFFFFF] p-4">
              <summary className="cursor-pointer list-none font-semibold text-[#20201E]">{item.question}</summary>
              <p className="mt-3 text-sm leading-6 text-[#68645E]">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </article>
  );
}
