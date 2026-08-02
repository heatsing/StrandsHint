import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "out");
const siteUrl = "https://strandshint.net";
const sitemapPath = path.join(outDir, "sitemap.xml");
let failures = 0;

function fail(message) {
  failures += 1;
  console.error(`SEO audit failed: ${message}`);
}

function matchAll(source, regex) {
  return Array.from(source.matchAll(regex));
}

function getJsonLdTypes(html) {
  return matchAll(html, /<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gis)
    .map((match) => {
      try {
        return JSON.parse(match[1]);
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .flatMap((data) => {
      if (Array.isArray(data)) return data.map((item) => item?.["@type"]).filter(Boolean);
      if (Array.isArray(data["@graph"])) return data["@graph"].map((item) => item?.["@type"]).filter(Boolean);
      return data["@type"] ? [data["@type"]] : [];
    });
}

function routeToFile(url) {
  const pathname = new URL(url).pathname;
  if (pathname === "/") return path.join(outDir, "index.html");
  return path.join(outDir, pathname.replace(/^\//, ""), "index.html");
}

if (!existsSync(sitemapPath)) {
  fail("out/sitemap.xml is missing. Run npm run build first.");
} else {
  const sitemap = readFileSync(sitemapPath, "utf8");
  const urls = matchAll(sitemap, /<loc>(.*?)<\/loc>/g).map((match) => match[1]);

  if (!urls.length) fail("sitemap has no URLs");
  if (urls.some((url) => url.includes("/admin"))) fail("sitemap must not include admin URLs");

  for (const url of urls) {
    const file = routeToFile(url);
    if (!existsSync(file)) {
      fail(`${url} does not have a matching exported HTML file`);
      continue;
    }

    const html = readFileSync(file, "utf8");
    const title = html.match(/<title>(.*?)<\/title>/is)?.[1]?.trim();
    const description = html.match(/<meta name="description" content="(.*?)"/is)?.[1]?.trim();
    const h1Count = matchAll(html, /<h1[\s>]/gi).length;
    const canonical = html.match(/<link rel="canonical" href="(.*?)"/is)?.[1]?.replace(/\/$/, "");
    const linkCount = matchAll(html, /<a\s+[^>]*href=/gi).length;
    const jsonLdTypes = getJsonLdTypes(html);

    if (!title) fail(`${url} is missing a title`);
    if (!description) fail(`${url} is missing a meta description`);
    if (h1Count !== 1) fail(`${url} should have exactly one H1, found ${h1Count}`);
    if (canonical !== url.replace(/\/$/, "")) fail(`${url} canonical mismatch: ${canonical || "missing"}`);
    if (!jsonLdTypes.includes("BreadcrumbList")) fail(`${url} is missing BreadcrumbList JSON-LD`);
    if (!linkCount) fail(`${url} has no internal links`);
    if (url.includes("/solvers/") && !jsonLdTypes.includes("WebApplication")) {
      fail(`${url} solver page is missing WebApplication JSON-LD`);
    }
  }
}

if (failures) {
  process.exit(1);
}

console.log("SEO audit passed.");
