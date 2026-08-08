import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSolver, solverRegistry } from "@/data/solver-registry";
import { absoluteUrl } from "@/lib/seo";
import SolverPage from "@/components/solver-pages/SolverPage";

type Props = { params: { slug: string } };

const rootSolvers = solverRegistry.filter((solver) => solver.implemented && solver.inputType !== "directory");

export const dynamicParams = false;

export function generateStaticParams() {
  return rootSolvers.map((solver) => ({ slug: solver.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const solver = getSolver(params.slug);
  if (!solver || !solver.implemented || solver.inputType === "directory") return {};
  const path = `/${solver.slug}`;
  const title =
    solver.slug === "scrabble-word-finder" ||
    solver.slug === "scrabble-solver" ||
    solver.slug === "spelling-bee-solver" ||
    solver.slug === "letter-box-solver"
      ? { absolute: solver.seo.title }
      : solver.seo.title;
  return {
    title,
    description: solver.seo.description,
    alternates: { canonical: path },
    openGraph: { title: solver.seo.title, description: solver.seo.description, url: absoluteUrl(path), type: "website" },
    twitter: { card: "summary", title: solver.seo.title, description: solver.seo.description },
  };
}

export default function RootWordleSolverPage({ params }: Props) {
  const solver = getSolver(params.slug);
  if (!solver || !solver.implemented || solver.inputType === "directory") notFound();
  return <SolverPage params={params} />;
}
