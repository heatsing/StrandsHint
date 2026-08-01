import type { MetadataRoute } from "next";
import { dailySeoPages } from "@/lib/daily-seo";
import { getPublishedPuzzles } from "@/lib/puzzle-data";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/",
    "/todays-strands-answer",
    "/strands-hints",
    "/strands-solver",
    "/strands-spangram-helper",
    "/strands-word-finder",
    "/archive",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "/" ? 1 : 0.8,
    })),
    ...dailySeoPages.map((page) => ({
      url: `${siteUrl}${page.path}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: page.game === "Strands" ? 0.95 : 0.75,
    })),
    ...getPublishedPuzzles().map((puzzle) => ({
      url: `${siteUrl}/archive/${puzzle.date}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
