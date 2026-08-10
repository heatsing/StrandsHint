import type { MetadataRoute } from "next";
import { getIndexableRoutes, indexableUrl } from "@/lib/indexable-routes";

export default function sitemap(): MetadataRoute.Sitemap {
  return getIndexableRoutes().map((route) => ({
    url: indexableUrl(route.path),
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
