import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSolver, solverRegistry } from "@/data/solver-registry";
import { absoluteUrl } from "@/lib/seo";
import SolverPage from "@/components/solver-pages/SolverPage";

type RouteParams = { slug: string };
type Props = { params: Promise<RouteParams> };

const rootSolvers = solverRegistry.filter((solver) => solver.implemented && solver.inputType !== "directory");

export const dynamicParams = false;

export function generateStaticParams() {
  return rootSolvers.map((solver) => ({ slug: solver.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const solver = getSolver(slug);
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

export default async function RootWordleSolverPage({ params }: Props) {
  const resolvedParams = await params;
  const solver = getSolver(resolvedParams.slug);
  if (!solver || !solver.implemented || solver.inputType === "directory") notFound();
  return <SolverPage params={resolvedParams} />;
}
