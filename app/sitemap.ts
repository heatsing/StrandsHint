import type { MetadataRoute } from "next";
import {
  getAllPuzzles,
  getAvailableMonths,
  getAvailableYears,
} from "@/lib/puzzles";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["/", "/today/", "/yesterday/", "/archive/", "/solver/"];
  const answerRoutes = getAllPuzzles().map((puzzle) => `/answers/${puzzle.date}/`);
  const yearRoutes = getAvailableYears().map((year) => `/archive/${year}/`);
  const monthRoutes = getAvailableYears().flatMap((year) =>
    getAvailableMonths(year).map((month) => `/archive/${year}/${month}/`),
  );

  return [...staticRoutes, ...answerRoutes, ...yearRoutes, ...monthRoutes].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "/today/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : 0.8,
  }));
}
