import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { siteUrl } from "@/lib/seo";
import { toDateOnly } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "/",
    "/todays-strands-answer",
    "/strands-hints",
    "/strands-solver",
    "/strands-spangram-helper",
    "/strands-word-finder",
    "/archive",
  ];
  const puzzles = await prisma.puzzle.findMany({ where: { published: true }, select: { date: true, updatedAt: true } });
  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: route === "/" ? 1 : 0.8,
    })),
    ...puzzles.map((puzzle) => ({
      url: `${siteUrl}/archive/${toDateOnly(puzzle.date)}`,
      lastModified: puzzle.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
