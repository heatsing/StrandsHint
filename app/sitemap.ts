import type { MetadataRoute } from "next";
import { solverRegistry } from "@/data/solver-registry";
import { dailySeoPages } from "@/lib/daily-seo";
import { dailyHintGames, getDailyHintSlugs } from "@/lib/daily-hints";
import { getPublishedPuzzles } from "@/lib/puzzle-data";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/",
    "/all-solvers",
    "/daily-hints",
    "/today",
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
    ...solverRegistry
      .filter((solver) => solver.implemented && solver.inputType !== "directory")
      .map((solver) => ({
        url: `${siteUrl}/solvers/${solver.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.85,
      })),
    ...dailyHintGames.map((game) => ({
      url: `${siteUrl}${game.path}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.75,
    })),
    ...getDailyHintSlugs().map((item) => ({
      url: `${siteUrl}/hints/${item.game}/${item.date}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...getPublishedPuzzles().map((puzzle) => ({
      url: `${siteUrl}/archive/${puzzle.date}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
