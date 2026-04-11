import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogFaqJsonLd } from "@/components/BlogFaqJsonLd";
import { DayNav } from "@/components/DayNav";
import { Spoiler } from "@/components/Spoiler";
import {
  addDaysIso,
  formatDisplayDate,
  listContentDates,
  parseDateParam,
  readDailyPost,
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

  const data = await readDailyPost(date);
  if (!data) return { title: "NYT hints" };

  const display = formatDisplayDate(date);
  const title = `NYT Hints & Answers for ${display}`;
  const description = data.intro.slice(0, 155).trim();

  return {
    title,
    description: description.length < data.intro.length ? `${description}…` : description,
    alternates: { canonical: `/${date}/` },
    openGraph: {
      title,
      description: data.intro.slice(0, 200),
      type: "article",
    },
  };
}

export default async function DatePage({ params }: Props) {
  const { date } = params;
  if (!parseDateParam(date)) notFound();

  const data = await readDailyPost(date);
  if (!data) notFound();

  const display = formatDisplayDate(date);
  const neighbors = await getNeighborDates(date);
  const allDates = await listContentDates();
  const dateSet = new Set(allDates);
  const yIso = addDaysIso(date, -1);
  const tIso = addDaysIso(date, 1);
  const yesterdayHref = dateSet.has(yIso) ? `/${yIso}/` : undefined;
  const tomorrowHref = dateSet.has(tIso) ? `/${tIso}/` : undefined;

  const faqItems = Array.isArray(data.faq) ? [...data.faq] : [];

  return (
    <>
      <BlogFaqJsonLd items={faqItems} />

      <nav className="mb-8 text-sm text-ink-500 not-prose" aria-label="Breadcrumb">
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

      <article
        className="prose prose-stone max-w-none prose-headings:scroll-mt-24 prose-h1:text-ink-900 prose-a:text-ink-800 prose-a:underline-offset-2 hover:prose-a:text-ink-950 lg:prose-lg"
        itemScope
        itemType="https://schema.org/Article"
      >
        <meta itemProp="datePublished" content={`${date}T12:00:00.000Z`} />
        <header>
          <h1 className="!mb-4 font-serif text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
            NYT Hints &amp; Answers for {display}
          </h1>
          <p className="!mb-10 text-xl leading-relaxed text-ink-600">{data.intro}</p>
        </header>

        <section id="wordle" aria-labelledby="wordle-heading">
          <h2 id="wordle-heading">Wordle Hint Today</h2>
          <p>Work through these clues from broad to specific—then reveal the answer only when you are ready.</p>
          <ol>
            {data.wordle.hints.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ol>
          <div className="not-prose">
            <Spoiler label="Reveal Wordle answer">
              <p className="font-mono text-lg font-semibold uppercase tracking-wide text-ink-900">
                {data.wordle.answer}
              </p>
            </Spoiler>
          </div>
        </section>

        <section id="strands" aria-labelledby="strands-heading">
          <h2 id="strands-heading">Strands Hint Today</h2>

          <h3>Theme</h3>
          <p>{data.strands.theme}</p>

          <h3>Hints</h3>
          <ol>
            {data.strands.hints.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ol>

          <h3>Spangram</h3>
          <p>{data.strands.spangramHint}</p>

          <h3>Answers</h3>
          <div className="not-prose">
            <Spoiler label="Reveal Strands answers">
              <div className="space-y-3 text-ink-900">
                <p>
                  <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                    Spangram
                  </span>
                  <br />
                  <span className="font-mono text-lg font-semibold uppercase">
                    {data.strands.spangram}
                  </span>
                </p>
                {data.strands.themeWords.length > 0 ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                      Theme words
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {data.strands.themeWords.map((w) => (
                        <li
                          key={w}
                          className="rounded-lg bg-white px-2.5 py-1 font-mono text-sm ring-1 ring-ink-200"
                        >
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </Spoiler>
          </div>
        </section>

        <section id="connections" aria-labelledby="connections-heading">
          <h2 id="connections-heading">Connections Answers Today</h2>
          <p>
            Below are the four groups for today&apos;s Connections puzzle. Expand each if you want
            to check your categories before you play.
          </p>
          <div className="not-prose space-y-4">
            {data.connections.groups.map((group, i) => (
              <div
                key={`${group.title}-${i}`}
                className="rounded-xl border border-ink-200 bg-ink-50/80 p-4 shadow-sm"
              >
                <Spoiler label={`Reveal group ${i + 1}`}>
                  <p className="text-sm font-semibold text-ink-800">{group.title}</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {group.words.map((w) => (
                      <li
                        key={w}
                        className="rounded-md bg-white px-2 py-1 font-mono text-sm ring-1 ring-ink-200"
                      >
                        {w}
                      </li>
                    ))}
                  </ul>
                </Spoiler>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" aria-labelledby="faq-heading">
          <h2 id="faq-heading">FAQ</h2>
          {faqItems.map((item, i) => (
            <div key={i}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </section>
      </article>

      <footer className="not-prose mt-14 border-t border-ink-200 pt-10">
        <DayNav
          prevDate={neighbors.prev}
          nextDate={neighbors.next}
          yesterdayHref={yesterdayHref}
          tomorrowHref={tomorrowHref}
        />
        <p className="mt-6 text-center text-sm text-ink-500">
          <Link href="/" className="underline-offset-4 hover:underline">
            ← Back to calendar
          </Link>
        </p>
      </footer>
    </>
  );
}
