import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "out");
const sitemapPath = path.join(outDir, "sitemap.xml");
const solverRoutes = new Set([
  "/wordle-solver",
  "/spelling-bee-solver",
  "/anagram-solver",
  "/word-unscrambler",
  "/scrabble-solver",
  "/scrabble-word-finder",
  "/quordle-solver",
  "/crossword-solver",
  "/words-with-friends-solver",
  "/jumble-solver",
]);
let failures = 0;

function fail(message) {
  failures += 1;
  console.error(`SEO audit failed: ${message}`);
}

function matchAll(source, regex) {
  return Array.from(source.matchAll(regex));
}

function getJsonLdBlocks(html) {
  return matchAll(html, /<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gis)
    .map((match) => {
      try {
        return JSON.parse(match[1]);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function getJsonLdTypes(html) {
  return getJsonLdBlocks(html).flatMap((data) => {
    if (Array.isArray(data)) return data.map((item) => item?.["@type"]).filter(Boolean);
    if (Array.isArray(data["@graph"])) return data["@graph"].map((item) => item?.["@type"]).filter(Boolean);
    return data["@type"] ? [data["@type"]] : [];
  });
}

function collectJsonLdUrls(value, urls = []) {
  if (!value) return urls;
  if (typeof value === "string") {
    if (value.startsWith("https://strandshint.net/")) urls.push(value);
    return urls;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectJsonLdUrls(item, urls));
    return urls;
  }
  if (typeof value === "object") {
    Object.values(value).forEach((item) => collectJsonLdUrls(item, urls));
  }
  return urls;
}

function readDirRecursive(dir) {
  const entries = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) entries.push(...readDirRecursive(entryPath));
    else entries.push(entryPath);
  }
  return entries;
}

function getExportedHtmlFiles(dir) {
  return readDirRecursive(dir).filter((file) => path.basename(file) === "index.html");
}

function routeToFile(url) {
  const pathname = new URL(url).pathname;
  if (pathname === "/") return path.join(outDir, "index.html");
  return path.join(outDir, pathname.replace(/^\//, "").replace(/\/$/, ""), "index.html");
}

function isFinalStaticUrl(url) {
  const pathname = new URL(url).pathname;
  return pathname === "/" || pathname.endsWith("/");
}

if (!existsSync(sitemapPath)) {
  fail("out/sitemap.xml is missing. Run npm run build first.");
} else {
  const sitemap = readFileSync(sitemapPath, "utf8");
  const urls = matchAll(sitemap, /<loc>(.*?)<\/loc>/g).map((match) => match[1]);

  if (!urls.length) fail("sitemap has no URLs");
  if (urls.some((url) => url.includes("/admin"))) fail("sitemap must not include admin URLs");

  for (const url of urls) {
    if (!isFinalStaticUrl(url)) fail(`${url} should include the final trailing slash URL`);

    const file = routeToFile(url);
    if (!existsSync(file)) {
      fail(`${url} does not have a matching exported HTML file`);
      continue;
    }

    const html = readFileSync(file, "utf8");
    const title = html.match(/<title>(.*?)<\/title>/is)?.[1]?.trim();
    const description = html.match(/<meta name="description" content="(.*?)"/is)?.[1]?.trim();
    const h1Count = matchAll(html, /<h1[\s>]/gi).length;
    const canonical = html.match(/<link rel="canonical" href="(.*?)"/is)?.[1];
    const linkCount = matchAll(html, /<a\s+[^>]*href=/gi).length;
    const ogTitle = html.match(/<meta property="og:title" content="(.*?)"/is)?.[1]?.trim();
    const twitterCard = html.match(/<meta name="twitter:card" content="(.*?)"/is)?.[1]?.trim();
    const jsonLdBlocks = getJsonLdBlocks(html);
    const jsonLdTypes = getJsonLdTypes(html);

    if (!title) fail(`${url} is missing a title`);
    if (!description) fail(`${url} is missing a meta description`);
    if (h1Count !== 1) fail(`${url} should have exactly one H1, found ${h1Count}`);
    if (canonical !== url) fail(`${url} canonical mismatch: ${canonical || "missing"}`);
    if (!ogTitle) fail(`${url} is missing og:title`);
    if (!twitterCard) fail(`${url} is missing twitter:card`);
    if (new URL(url).pathname === "/" && !jsonLdTypes.includes("WebSite")) fail(`${url} is missing WebSite JSON-LD`);
    if (!jsonLdTypes.includes("BreadcrumbList")) fail(`${url} is missing BreadcrumbList JSON-LD`);
    if (["/all-solvers/", "/daily-hints/", "/today/"].includes(new URL(url).pathname) && !jsonLdTypes.includes("ItemList")) {
      fail(`${url} directory page is missing ItemList JSON-LD`);
    }
    if (!linkCount) fail(`${url} has no internal links`);
    if (solverRoutes.has(new URL(url).pathname.replace(/\/$/, "")) && !jsonLdTypes.includes("WebApplication")) {
      fail(`${url} solver page is missing WebApplication JSON-LD`);
    }

    for (const schemaUrl of jsonLdBlocks.flatMap((block) => collectJsonLdUrls(block))) {
      if (!isFinalStaticUrl(schemaUrl)) fail(`${url} JSON-LD references non-final URL ${schemaUrl}`);
    }
  }
}

for (const file of getExportedHtmlFiles(outDir)) {
  const html = readFileSync(file, "utf8");
  const hrefs = matchAll(html, /<a\s+[^>]*href="([^"]+)"/g).map((match) => match[1]);
  for (const href of hrefs) {
    if (!href.startsWith("/") || href === "/" || href.includes("#") || href.includes(".")) continue;
    if (!href.endsWith("/")) fail(`${file} links to non-final internal URL ${href}`);
  }
}

if (failures) {
  process.exit(1);
}

console.log("SEO audit passed.");
