export const siteName = "Strands Hint";
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://strandshint.net";

export const disclaimer =
  "This site is an independent fan-made helper and is not affiliated with The New York Times.";

export function finalUrlPath(path = "/") {
  if (!path || path === "/") return "/";
  if (/^https?:\/\//.test(path)) {
    const url = new URL(path);
    url.pathname = finalUrlPath(url.pathname);
    return url.toString();
  }

  const [pathname, suffix = ""] = path.split(/(?=[?#])/);
  const normalizedPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (normalizedPathname === "/") return `/${suffix}`;
  if (normalizedPathname.includes(".") || normalizedPathname.endsWith("/")) {
    return `${normalizedPathname}${suffix}`;
  }
  return `${normalizedPathname}/${suffix}`;
}

export function absoluteUrl(path: string) {
  if (/^https?:\/\//.test(path)) return finalUrlPath(path);
  return `${siteUrl}${finalUrlPath(path)}`;
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: absoluteUrl("/"),
    description:
      "Spoiler-safe daily puzzle hints, answer reveals, and local word solver tools for puzzle players.",
    inLanguage: "en-US",
    isAccessibleForFree: true,
  };
}

export function itemListSchema(
  name: string,
  items: { name: string; url: string; description?: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.url),
      ...(item.description ? { description: item.description } : {}),
    })),
  };
}

export function webApplicationSchema({
  name,
  url,
  description,
  featureList,
}: {
  name: string;
  url: string;
  description: string;
  featureList?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    url: absoluteUrl(url),
    description,
    applicationCategory: "GameApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript in a modern web browser.",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    ...(featureList?.length ? { featureList } : {}),
  };
}
