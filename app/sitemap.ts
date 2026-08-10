import type { MetadataRoute } from "next";
import { getSolverPath, solverRegistry } from "@/data/solver-registry";
import { dailySeoPages } from "@/lib/daily-seo";
import { dailyHintGames, getDailyHintSlugs } from "@/lib/daily-hints";
import { getPublishedPuzzles } from "@/lib/puzzle-data";
import { siteUrl } from "@/lib/seo";

function withTrailingSlash(route: string) {
  if (route === "/") return "/";
  return route.endsWith("/") ? route : `${route}/`;
}

function sitemapUrl(route: string) {
  return `${siteUrl}${withTrailingSlash(route)}`;
}

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
    "/privacy-policy",
    "/terms-of-use",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: sitemapUrl(route),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "/" ? 1 : 0.8,
    })),
    ...dailySeoPages.map((page) => ({
      url: sitemapUrl(page.path),
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: page.game === "Strands" ? 0.95 : 0.75,
    })),
    ...solverRegistry
      .filter((solver) => solver.implemented && solver.inputType !== "directory")
      .map((solver) => ({
        url: sitemapUrl(getSolverPath(solver)),
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.85,
      })),
    ...dailyHintGames.map((game) => ({
      url: sitemapUrl(game.path),
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.75,
    })),
    ...getDailyHintSlugs().map((item) => ({
      url: sitemapUrl(`/hints/${item.game}/${item.date}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...getPublishedPuzzles().map((puzzle) => ({
      url: sitemapUrl(`/archive/${puzzle.date}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
