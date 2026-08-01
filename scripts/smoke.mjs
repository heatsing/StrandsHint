import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "out");

const requiredFiles = [
  "index.html",
  "todays-strands-answer/index.html",
  "strands-hints/index.html",
  "strands-solver/index.html",
  "strands-spangram-helper/index.html",
  "strands-word-finder/index.html",
  "today/wordle-hints/index.html",
  "today/connections-hints/index.html",
  "today/strands-hints/index.html",
  "archive/index.html",
  "admin/puzzles/new/index.html",
  "admin/daily/new/index.html",
  "404.html",
  "robots.txt",
  "sitemap.xml",
];

const pageChecks = [
  ["index.html", ["Reveal today", "Companion solving tools", "Frequently asked questions", "Independent"]],
  ["todays-strands-answer/index.html", ["Today's Strands Answer", "Spoiler warning", "Reveal All Answers", "FAQPage", "BreadcrumbList"]],
  ["strands-hints/index.html", ["Strands Hints Today", "Reveal Theme Hint", "Open spangram helper", "FAQPage", "BreadcrumbList"]],
  ["strands-solver/index.html", ["Strands Solver", "Find words", "No candidates yet", "rel=\"canonical\"", "FAQPage", "BreadcrumbList"]],
  ["strands-spangram-helper/index.html", ["Strands Spangram Helper", "Find spangram candidates", "not official answers", "FAQPage", "BreadcrumbList"]],
  ["strands-word-finder/index.html", ["Strands Word Finder", "Find words", "FAQPage", "BreadcrumbList"]],
  ["today/wordle-hints/index.html", ["Today's Wordle hints for August 1, 2026", "Progressive hints", "Related puzzle pages", "FAQPage", "BreadcrumbList"]],
  ["today/connections-hints/index.html", ["Today's Connections hints for August 1, 2026", "Progressive hints", "Related puzzle pages", "FAQPage", "BreadcrumbList"]],
  ["today/strands-hints/index.html", ["Today's Strands hints for August 1, 2026", "Progressive hints", "Related puzzle pages", "FAQPage", "BreadcrumbList"]],
  ["admin/puzzles/new/index.html", ["noindex", "Slug preview", "Copy JSON"]],
  ["admin/daily/new/index.html", ["noindex", "Generate a daily SEO JSON entry", "Generated daily JSON", "Copy JSON"]],
  ["404.html", ["Page not found", "Today's answer", "Solver"]],
];

function fail(message) {
  console.error(`Smoke check failed: ${message}`);
  process.exitCode = 1;
}

function readOutFile(relativePath) {
  return readFileSync(path.join(outDir, relativePath), "utf8");
}

if (!existsSync(outDir)) {
  fail("out directory is missing. Run npm run build first.");
} else {
  for (const file of requiredFiles) {
    if (!existsSync(path.join(outDir, file))) fail(`${file} is missing`);
  }

  for (const [file, snippets] of pageChecks) {
    if (!existsSync(path.join(outDir, file))) continue;
    const html = readOutFile(file);
    for (const snippet of snippets) {
      if (!html.includes(snippet)) fail(`${file} does not contain ${JSON.stringify(snippet)}`);
    }
  }

  const robots = readOutFile("robots.txt");
  if (!robots.includes("Disallow: /admin/")) fail("robots.txt should disallow /admin/");

  const sitemap = readOutFile("sitemap.xml");
  if (sitemap.includes("/admin")) fail("sitemap.xml should not include admin URLs");
  for (const route of ["/", "/todays-strands-answer", "/strands-hints", "/strands-solver", "/strands-spangram-helper", "/strands-word-finder", "/archive", "/today/wordle-hints", "/today/connections-hints", "/today/strands-hints"]) {
    if (!sitemap.includes(`https://strandshint.net${route}`)) fail(`sitemap.xml is missing ${route}`);
  }
}

if (!process.exitCode) {
  console.log("Smoke checks passed.");
}
