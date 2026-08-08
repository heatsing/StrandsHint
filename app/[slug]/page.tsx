import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSolver, solverRegistry } from "@/data/solver-registry";
import { absoluteUrl } from "@/lib/seo";
import SolverPage from "../solvers/[slug]/page";

type Props = { params: { slug: string } };

const rootWordleSolvers = solverRegistry.filter((solver) => solver.implemented && Boolean(solver.wordLength));

export const dynamicParams = false;

export function generateStaticParams() {
  return rootWordleSolvers.map((solver) => ({ slug: solver.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const solver = getSolver(params.slug);
  if (!solver || !solver.implemented || !solver.wordLength) return {};
  const path = `/${solver.slug}`;
  return {
    title: solver.seo.title,
    description: solver.seo.description,
    alternates: { canonical: path },
    openGraph: { title: solver.seo.title, description: solver.seo.description, url: absoluteUrl(path), type: "website" },
    twitter: { card: "summary", title: solver.seo.title, description: solver.seo.description },
  };
}

export default function RootWordleSolverPage({ params }: Props) {
  const solver = getSolver(params.slug);
  if (!solver || !solver.implemented || !solver.wordLength) notFound();
  return <SolverPage params={params} />;
}
