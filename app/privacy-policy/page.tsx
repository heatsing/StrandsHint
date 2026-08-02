import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, disclaimer } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Strands Hint privacy policy for this independent puzzle helper website.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <article className="mx-auto max-w-3xl rounded-xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-sm sm:p-10">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Privacy Policy", url: "/privacy-policy" },
        ])}
      />
      <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#008F83]">
        Legal
      </p>
      <h1 className="mt-3 font-serif text-4xl font-black text-[#20201E]">Privacy Policy</h1>
      <p className="mt-5 leading-7 text-[#68645E]">
        Strands Hint is built as a lightweight puzzle helper. We do not require user accounts for
        the public hint and solver pages, and the solver tools run locally in your browser.
      </p>
      <h2 className="mt-8 font-serif text-2xl font-black text-[#20201E]">Analytics</h2>
      <p className="mt-3 leading-7 text-[#68645E]">
        The site may use basic analytics to understand aggregate traffic, page performance, and
        which tools are useful. Analytics are used to improve the website experience.
      </p>
      <h2 className="mt-8 font-serif text-2xl font-black text-[#20201E]">Puzzle Content</h2>
      <p className="mt-3 leading-7 text-[#68645E]">
        Daily hint and answer content is prepared manually. The site does not scrape official
        puzzle feeds or copy official game interfaces.
      </p>
      <h2 className="mt-8 font-serif text-2xl font-black text-[#20201E]">Independence</h2>
      <p className="mt-3 leading-7 text-[#68645E]">{disclaimer}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link className="rounded-lg bg-[#315C4C] px-4 py-2 font-bold text-white" href="/">
          Back Home
        </Link>
        <Link
          className="rounded-lg border border-[#D4CABD] bg-[#EDE6DC] px-4 py-2 font-bold text-[#20201E]"
          href="/all-solvers"
        >
          View Solver Tools
        </Link>
      </div>
    </article>
  );
}
