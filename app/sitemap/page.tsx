import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { getIndexableRoutes, withTrailingSlash } from "@/lib/indexable-routes";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sitemap - Strands Hint Pages and Solver Tools",
  description:
    "Browse every indexable Strands Hint page, including daily hints, solver tools, archive pages, and legal resources.",
  alternates: { canonical: "/sitemap" },
  openGraph: {
    title: "Sitemap - Strands Hint",
    description: "A complete HTML sitemap for Strands Hint pages and solver tools.",
    url: absoluteUrl("/sitemap"),
    type: "website",
  },
};

const categoryOrder = ["Core", "Daily Hints", "Solvers", "Game Hints", "Archive", "Legal"];

export default function HtmlSitemapPage() {
  const routes = getIndexableRoutes();
  const grouped = categoryOrder.map((category) => ({
    category,
    routes: routes.filter((route) => route.category === category),
  }));

  return (
    <article>
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Sitemap", url: "/sitemap" }])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Strands Hint Sitemap",
          description: metadata.description,
          url: absoluteUrl("/sitemap"),
          hasPart: routes.map((route) => ({
            "@type": "WebPage",
            name: route.label,
            url: absoluteUrl(withTrailingSlash(route.path)),
          })),
        }}
      />

      <header className="py-10">
        <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-[#315C4C]">
          Site index
        </p>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl font-black leading-tight text-[#20201E]">
          Sitemap
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#68645E]">
          Use this page to browse every public Strands Hint page that is included in the XML sitemap.
        </p>
      </header>

      <div className="grid gap-8">
        {grouped.map(({ category, routes: categoryRoutes }) =>
          categoryRoutes.length ? (
            <section key={category}>
              <h2 className="font-serif text-3xl font-black text-[#20201E]">{category}</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {categoryRoutes.map((route) => (
                  <Link prefetch={false}
                    key={`${category}-${route.path}`}
                    href={withTrailingSlash(route.path)}
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-4 font-bold text-[#20201E] shadow-sm hover:border-[#315C4C]/50 hover:text-[#315C4C]"
                  >
                    <span>{route.label}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </section>
          ) : null,
        )}
      </div>
    </article>
  );
}
