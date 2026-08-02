import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { AnagramSolverClient } from "@/components/solvers/AnagramSolverClient";
import { SpellingBeeSolverClient } from "@/components/solvers/SpellingBeeSolverClient";
import { WordleSolverClient } from "@/components/solvers/WordleSolverClient";
import { getSolver, solverRegistry } from "@/data/solver-registry";
import { absoluteUrl, breadcrumbSchema, disclaimer } from "@/lib/seo";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return solverRegistry.filter((solver) => solver.implemented && ["wordle", "spelling-bee", "anagram"].some((kind) => solver.inputType === kind)).map((solver) => ({ slug: solver.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const solver = getSolver(params.slug);
  if (!solver || !solver.implemented) return {};
  const path = `/solvers/${solver.slug}`;
  return {
    title: solver.seo.title,
    description: solver.seo.description,
    alternates: { canonical: path },
    openGraph: { title: solver.seo.title, description: solver.seo.description, url: absoluteUrl(path), type: "website" },
    twitter: { card: "summary", title: solver.seo.title, description: solver.seo.description },
  };
}

function SolverWorkspace({ inputType }: { inputType: string }) {
  if (inputType === "wordle") return <WordleSolverClient />;
  if (inputType === "spelling-bee") return <SpellingBeeSolverClient />;
  if (inputType === "anagram") return <AnagramSolverClient />;
  return null;
}

export default function SolverPage({ params }: Props) {
  const solver = getSolver(params.slug);
  if (!solver || !solver.implemented || solver.inputType === "directory") notFound();
  const path = `/solvers/${solver.slug}`;
  const related = solver.relatedSolvers.map(getSolver).filter(Boolean);
  const faq = [
    { question: `What is the ${solver.name}?`, answer: `${solver.name} is a local helper that narrows word candidates from the information you enter.` },
    { question: "Does this call an AI API?", answer: "No. The first version runs deterministic local filters against a local word list." },
    { question: "Why are some words missing?", answer: "The included word list is intentionally small for the first release and can be replaced with a larger licensed list later." },
  ];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  };

  return (
    <article>
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "All Solvers", url: "/all-solvers" }, { name: solver.name, url: path }])} />
      <JsonLd data={faqSchema} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: solver.name, url: absoluteUrl(path), applicationCategory: "GameApplication", isAccessibleForFree: true }} />
      <header className="py-10">
        <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-[#315C4C]">{solver.category}</p>
        <h1 className="mt-4 max-w-3xl break-words font-serif text-5xl font-black leading-tight text-[#20201E]">{solver.name}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#68645E]">{solver.shortDescription}</p>
      </header>

      <section aria-label={`${solver.name} workspace`}>
        <SolverWorkspace inputType={solver.inputType} />
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-sm">
          <h2 className="font-serif text-3xl font-black">How to use this tool</h2>
          <ol className="mt-4 grid gap-3 text-sm leading-6 text-[#68645E]">
            <li>1. Enter only the letters or clue information you know.</li>
            <li>2. Use the example button if you want to see the expected format.</li>
            <li>3. Review the result count, then loosen or tighten filters.</li>
          </ol>
        </div>
        <div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-sm">
          <h2 className="font-serif text-3xl font-black">How results are calculated</h2>
          <p className="mt-4 text-sm leading-6 text-[#68645E]">
            Results come from deterministic local filtering. The tool checks length, required
            letters, excluded letters, and game-specific rules against the local word list.
          </p>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-sm">
        <h2 className="font-serif text-3xl font-black">FAQ</h2>
        <div className="mt-4 grid gap-3">
          {faq.map((item) => (
            <details key={item.question} className="rounded-xl border border-[#E5DED3] bg-white p-4">
              <summary className="cursor-pointer list-none font-bold">{item.question}</summary>
              <p className="mt-3 text-sm leading-6 text-[#68645E]">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-sm">
        <h2 className="font-serif text-3xl font-black">Related solvers</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {related.map((item) => item ? (
            <Link key={item.slug} href={item.implemented && item.inputType !== "directory" ? `/solvers/${item.slug}` : "/all-solvers"} className="group rounded-xl border border-[#E5DED3] bg-white p-4 hover:border-[#315C4C]/50">
              <h3 className="font-serif text-xl font-black">{item.name}</h3>
              <p className="mt-2 text-sm leading-6 text-[#68645E]">{item.shortDescription}</p>
              <span className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#315C4C]">Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </Link>
          ) : null)}
        </div>
        <p className="mt-5 text-sm leading-6 text-[#68645E]">{disclaimer}</p>
      </section>
    </article>
  );
}
