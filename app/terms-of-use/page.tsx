import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, disclaimer } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Read the terms for using Strands Hint, an independent puzzle helper website.",
  alternates: { canonical: "/terms-of-use" },
};

export default function TermsOfUsePage() {
  return (
    <article className="mx-auto max-w-3xl rounded-xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-sm sm:p-10">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Terms of Use", url: "/terms-of-use" },
        ])}
      />
      <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#008F83]">
        Legal
      </p>
      <h1 className="mt-3 font-serif text-4xl font-black text-[#20201E]">Terms of Use</h1>
      <p className="mt-5 leading-7 text-[#68645E]">
        By using Strands Hint, you agree to use the site as a fan-made puzzle helper for personal
        solving support. Solver outputs are suggestions and may not match any official puzzle
        answer.
      </p>
      <h2 className="mt-8 font-serif text-2xl font-black text-[#20201E]">No Official Affiliation</h2>
      <p className="mt-3 leading-7 text-[#68645E]">{disclaimer}</p>
      <h2 className="mt-8 font-serif text-2xl font-black text-[#20201E]">Responsible Use</h2>
      <p className="mt-3 leading-7 text-[#68645E]">
        Do not use this site to bypass official game restrictions, impersonate an official puzzle
        publisher, or redistribute copyrighted puzzle material.
      </p>
      <h2 className="mt-8 font-serif text-2xl font-black text-[#20201E]">Manual Content</h2>
      <p className="mt-3 leading-7 text-[#68645E]">
        Daily pages are maintained manually and may be updated, corrected, or removed as the site
        improves.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link className="rounded-lg bg-[#315C4C] px-4 py-2 font-bold text-white" href="/">
          Back Home
        </Link>
        <Link
          className="rounded-lg border border-[#D4CABD] bg-[#EDE6DC] px-4 py-2 font-bold text-[#20201E]"
          href="/daily-hints"
        >
          Browse Daily Hints
        </Link>
      </div>
    </article>
  );
}
