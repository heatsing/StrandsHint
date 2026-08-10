import { getSolverPath, solverRegistry } from "@/data/solver-registry";
import { dailyHintGames, getDailyHintSlugs } from "@/lib/daily-hints";
import { dailySeoPages } from "@/lib/daily-seo";
import { getPublishedPuzzles } from "@/lib/puzzle-data";
import { siteUrl } from "@/lib/seo";

export type IndexableRoute = {
  path: string;
  label: string;
  category: "Core" | "Daily Hints" | "Solvers" | "Game Hints" | "Archive" | "Legal";
  changeFrequency: "daily" | "weekly";
  priority: number;
};

const staticRoutes: IndexableRoute[] = [
  { path: "/", label: "Home", category: "Core", changeFrequency: "weekly", priority: 1 },
  { path: "/all-solvers", label: "All Word Puzzle Solvers", category: "Core", changeFrequency: "weekly", priority: 0.8 },
  { path: "/daily-hints", label: "All Daily Puzzle Hints", category: "Core", changeFrequency: "weekly", priority: 0.8 },
  { path: "/today", label: "Today's Puzzle Hints", category: "Daily Hints", changeFrequency: "weekly", priority: 0.8 },
  { path: "/todays-strands-answer", label: "Today's Strands Answer", category: "Daily Hints", changeFrequency: "weekly", priority: 0.8 },
  { path: "/strands-hints", label: "Strands Hints", category: "Daily Hints", changeFrequency: "weekly", priority: 0.8 },
  { path: "/strands-solver", label: "Strands Solver", category: "Solvers", changeFrequency: "weekly", priority: 0.8 },
  { path: "/strands-spangram-helper", label: "Strands Spangram Helper", category: "Solvers", changeFrequency: "weekly", priority: 0.8 },
  { path: "/strands-word-finder", label: "Strands Word Finder", category: "Solvers", changeFrequency: "weekly", priority: 0.8 },
  { path: "/archive", label: "Strands Archive", category: "Archive", changeFrequency: "weekly", priority: 0.8 },
  { path: "/sitemap", label: "HTML Sitemap", category: "Core", changeFrequency: "weekly", priority: 0.7 },
  { path: "/privacy-policy", label: "Privacy Policy", category: "Legal", changeFrequency: "weekly", priority: 0.5 },
  { path: "/terms-of-use", label: "Terms of Use", category: "Legal", changeFrequency: "weekly", priority: 0.5 },
];

export function withTrailingSlash(route: string) {
  if (route === "/") return "/";
  return route.endsWith("/") ? route : `${route}/`;
}

export function indexableUrl(route: string) {
  return `${siteUrl}${withTrailingSlash(route)}`;
}

export function getIndexableRoutes(): IndexableRoute[] {
  return [
    ...staticRoutes,
    ...dailySeoPages.map((page) => ({
      path: page.path,
      label: page.h1,
      category: "Daily Hints" as const,
      changeFrequency: "daily" as const,
      priority: page.game === "Strands" ? 0.95 : 0.75,
    })),
    ...solverRegistry
      .filter((solver) => solver.implemented && solver.inputType !== "directory")
      .map((solver) => ({
        path: getSolverPath(solver),
        label: solver.name,
        category: "Solvers" as const,
        changeFrequency: "weekly" as const,
        priority: 0.85,
      })),
    ...dailyHintGames.map((game) => ({
      path: game.path,
      label: `${game.name} Hints`,
      category: "Game Hints" as const,
      changeFrequency: "daily" as const,
      priority: 0.75,
    })),
    ...getDailyHintSlugs().map((item) => ({
      path: `/hints/${item.game}/${item.date}`,
      label: `${item.game.replace(/-/g, " ")} hints ${item.date}`,
      category: "Game Hints" as const,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...getPublishedPuzzles().map((puzzle) => ({
      path: `/archive/${puzzle.date}`,
      label: `${puzzle.title} - ${puzzle.date}`,
      category: "Archive" as const,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
