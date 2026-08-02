import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Grid3X3, Search, Shuffle, Sparkles } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { solverRegistry } from "@/data/solver-registry";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "All Word Puzzle Solvers - Browse Solver Tools",
  description:
    "Browse Strands Hint solver tools for Wordle, Spelling Bee, anagrams, word unscrambling, and other word puzzle help.",
  alternates: { canonical: "/all-solvers" },
  openGraph: {
    title: "All Word Puzzle Solvers",
    description: "Browse implemented and planned word puzzle solver tools from Strands Hint.",
    url: absoluteUrl("/all-solvers"),
    type: "website",
  },
};

const iconMap = { grid: Grid3X3, bee: Sparkles, shuffle: Shuffle, search: Search, book: Search, sparkles: Sparkles };

export default function AllSolversPage() {
  const categories = Array.from(new Set(solverRegistry.map((solver) => solver.category)));
  const hrefForSolver = (solver: { slug: string; implemented: boolean; inputType: string }) => {
    if (!solver.implemented) return "/all-solvers";
    if (solver.inputType === "directory" && solver.slug === "strands-solver") return "/strands-solver";
    if (solver.inputType === "directory") return "/all-solvers";
    return `/solvers/${solver.slug}`;
  };

  return (
    <article>
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "All Solvers", url: "/all-solvers" }])} />
      <header className="py-10">
        <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-[#315C4C]">Solver directory</p>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl font-black leading-tight text-[#20201E]">
          All word puzzle solvers
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#68645E]">
          Start with a working solver, or browse planned helper pages that will share the same local,
          transparent solving approach.
        </p>
      </header>
      <div className="grid gap-8">
        {categories.map((category) => (
          <section key={category}>
            <h2 className="font-serif text-3xl font-black text-[#20201E]">{category}</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {solverRegistry.filter((solver) => solver.category === category).map((solver) => {
                const Icon = iconMap[solver.icon];
                return (
                  <Link
                    key={solver.slug}
                    href={hrefForSolver(solver)}
                    className="group rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-5 shadow-sm hover:border-[#315C4C]/50"
                  >
                    <Icon className="h-7 w-7 text-[#315C4C]" />
                    <div className="mt-4 flex items-center gap-2">
                      <h3 className="font-serif text-2xl font-black">{solver.name}</h3>
                      {!solver.implemented ? <span className="rounded-full bg-[#EDE6DC] px-2 py-1 text-xs font-bold text-[#68645E]">Planned</span> : null}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#68645E]">{solver.shortDescription}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#315C4C]">
                      {solver.implemented ? "Open solver" : "Coming soon"} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
