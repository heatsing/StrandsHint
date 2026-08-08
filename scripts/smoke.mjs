import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "out");

const requiredFiles = [
  "index.html",
  "all-solvers/index.html",
  "daily-hints/index.html",
  "today/index.html",
  "todays-strands-answer/index.html",
  "strands-hints/index.html",
  "strands-solver/index.html",
  "strands-spangram-helper/index.html",
  "strands-word-finder/index.html",
  "today/wordle-hints/index.html",
  "today/connections-hints/index.html",
  "today/strands-hints/index.html",
  "hints/connections/index.html",
  "3-letter-wordle-solver/index.html",
  "12-letter-wordle-solver/index.html",
  "solvers/wordle-solver/index.html",
  "solvers/spelling-bee-solver/index.html",
  "solvers/anagram-solver/index.html",
  "solvers/word-unscrambler/index.html",
  "solvers/scrabble-solver/index.html",
  "solvers/scrabble-word-finder/index.html",
  "solvers/quordle-solver/index.html",
  "solvers/crossword-solver/index.html",
  "solvers/words-with-friends-solver/index.html",
  "solvers/jumble-solver/index.html",
  "hints/strands/2026-08-02/index.html",
  "archive/index.html",
  "admin/puzzles/new/index.html",
  "admin/daily/new/index.html",
  "404.html",
  "robots.txt",
  "sitemap.xml",
];

const pageChecks = [
  ["index.html", ["Strands Hint - Strands Hints, Daily Answers", "Featured Daily", "Helpful", "FAQs About"]],
  ["all-solvers/index.html", ["All word puzzle solvers", "Wordle Solver", "Spelling Bee Solver"]],
  ["daily-hints/index.html", ["Daily puzzle hints without instant spoilers", "Available today pages"]],
  ["today/index.html", ["Today's puzzle hints", "Daily hint hub", "Open daily hints", "FAQPage", "BreadcrumbList"]],
  ["todays-strands-answer/index.html", ["Today's Strands Answer", "Spoiler warning", "Reveal All Answers", "FAQPage", "BreadcrumbList"]],
  ["strands-hints/index.html", ["Strands Hints Today", "Reveal Theme Hint", "Open spangram helper", "FAQPage", "BreadcrumbList"]],
  ["strands-solver/index.html", ["Strands Solver", "Find words", "No candidates yet", "rel=\"canonical\"", "FAQPage", "BreadcrumbList"]],
  ["strands-spangram-helper/index.html", ["Strands Spangram Helper", "Find spangram candidates", "not official answers", "FAQPage", "BreadcrumbList"]],
  ["strands-word-finder/index.html", ["Strands Word Finder", "Find words", "FAQPage", "BreadcrumbList"]],
  ["today/wordle-hints/index.html", ["Today's Wordle hints for August 1, 2026", "Progressive hints", "Related puzzle pages", "FAQPage", "BreadcrumbList"]],
  ["today/connections-hints/index.html", ["Today's Connections hints for August 1, 2026", "Progressive hints", "Related puzzle pages", "FAQPage", "BreadcrumbList"]],
  ["today/strands-hints/index.html", ["Today's Strands hints for August 1, 2026", "Progressive hints", "Related puzzle pages", "FAQPage", "BreadcrumbList"]],
  ["hints/connections/index.html", ["Connections Hints", "Daily Games Hints", "Key Takeaways", "Frequently Asked Questions About", "FAQPage", "BreadcrumbList"]],
  ["3-letter-wordle-solver/index.html", ["3 Letter Wordle Solver", "Pro Tips", "How to Use", "FAQPage", "BreadcrumbList"]],
  ["12-letter-wordle-solver/index.html", ["12 Letter Wordle Solver", "Pro Tips", "How to Use", "FAQPage", "BreadcrumbList"]],
  ["solvers/wordle-solver/index.html", ["Wordle Solver", "Pro Tips", "How to Use", "FAQPage", "BreadcrumbList", "WebApplication"]],
  ["solvers/spelling-bee-solver/index.html", ["Spelling Bee Solver", "Center letter", "Pangram", "FAQPage", "BreadcrumbList"]],
  ["solvers/anagram-solver/index.html", ["Anagram Solver", "Find Anagrams", "What are Anagrams?", "FAQPage", "BreadcrumbList"]],
  ["solvers/word-unscrambler/index.html", ["Word Unscrambler", "Unscramble Words", "How It Works", "FAQPage", "BreadcrumbList"]],
  ["solvers/scrabble-solver/index.html", ["Scrabble Solver", "Find Words", "Letter Values", "FAQPage", "BreadcrumbList"]],
  ["solvers/scrabble-word-finder/index.html", ["Scrabble Word Finder", "Find Words", "Letter Values", "FAQPage", "BreadcrumbList"]],
  ["solvers/quordle-solver/index.html", ["Quordle Solver", "Known Letters", "Pro Tips", "Frequently Asked", "FAQPage", "BreadcrumbList"]],
  ["solvers/crossword-solver/index.html", ["Crossword Solver", "Solve Clue", "Pattern Examples", "FAQPage", "BreadcrumbList"]],
  ["solvers/words-with-friends-solver/index.html", ["Words With Friends Solver", "Find Words", "Letter Values", "FAQPage", "BreadcrumbList"]],
  ["solvers/jumble-solver/index.html", ["Jumble Solver", "Solve Jumble", "Jumble Tips", "FAQPage", "BreadcrumbList"]],
  ["hints/strands/2026-08-02/index.html", ["Strands hints for 2026-08-02", "Reveal short hint", "Reveal answers", "FAQPage", "BreadcrumbList"]],
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
  for (const route of ["/", "/all-solvers", "/daily-hints", "/today", "/todays-strands-answer", "/strands-hints", "/strands-solver", "/strands-spangram-helper", "/strands-word-finder", "/archive", "/today/wordle-hints", "/today/connections-hints", "/today/strands-hints", "/hints/connections", "/3-letter-wordle-solver", "/12-letter-wordle-solver", "/solvers/wordle-solver", "/solvers/spelling-bee-solver", "/solvers/anagram-solver", "/solvers/word-unscrambler", "/solvers/scrabble-solver", "/solvers/scrabble-word-finder", "/solvers/quordle-solver", "/solvers/crossword-solver", "/solvers/words-with-friends-solver", "/solvers/jumble-solver", "/hints/strands/2026-08-02"]) {
    if (!sitemap.includes(`https://strandshint.net${route}`)) fail(`sitemap.xml is missing ${route}`);
  }
}

if (!process.exitCode) {
  console.log("Smoke checks passed.");
}
