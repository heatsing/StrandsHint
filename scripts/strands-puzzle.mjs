import fs from "node:fs";
import path from "node:path";

const DATA_FILE = path.join(process.cwd(), "data", "puzzles.json");
const SOURCE_BASE_URL = "https://www.strands.today/strands-hint-and-answer";
const START_DATE = "2026-01-01";

function parseArgs(argv) {
  const [command = "missing", ...rest] = argv;
  const args = Object.fromEntries(
    rest.map((arg) => {
      const [key, value = "true"] = arg.replace(/^--/, "").split("=");
      return [key, value];
    }),
  );
  return { command, args };
}

function todayInShanghai() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function isDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function dateRange(from, to) {
  if (!isDate(from) || !isDate(to)) {
    throw new Error("Date must use YYYY-MM-DD.");
  }
  const cursor = new Date(`${from}T00:00:00Z`);
  const end = new Date(`${to}T00:00:00Z`);
  if (cursor > end) {
    throw new Error("--from must be before or equal to --to.");
  }

  const dates = [];
  while (cursor <= end) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}

function readPuzzles() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writePuzzles(puzzles) {
  const sorted = [...puzzles].sort((a, b) => b.date.localeCompare(a.date));
  fs.writeFileSync(DATA_FILE, `${JSON.stringify(sorted, null, 2)}\n`);
}

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripTags(value) {
  return decodeHtml(value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
}

function titleDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function createTemplate(date, overrides = {}) {
  const theme = overrides.themeHint || "Manual theme hint needed.";
  const slug = `${date}-nyt-strands-hints-answers`;
  return {
    id: slug,
    date,
    puzzleNumber: overrides.puzzleNumber,
    title: overrides.title || `NYT Strands Hints & Answers ${titleDate(date)}`,
    themeHint: theme,
    difficulty: overrides.difficulty || "MEDIUM",
    spangram: overrides.spangram || "ADDSPANGRAM",
    spangramHint1: overrides.spangramHint1 || "Add the first spoiler-safe spangram hint.",
    spangramHint2: overrides.spangramHint2 || "Add the second, stronger spangram hint.",
    spangramDirection: overrides.spangramDirection || "unknown",
    words: overrides.words || [],
    wordHints: overrides.wordHints || [],
    spoilerLevelContent:
      overrides.spoilerLevelContent ||
      "Manual editorial note needed. Keep answers hidden behind reveal controls and verify all data before publishing.",
    seoTitle: `NYT Strands Hints & Answers ${titleDate(date)}`,
    seoDescription:
      overrides.seoDescription ||
      `Spoiler-safe NYT Strands hints, spangram help, and answer reveals for ${titleDate(date)}.`,
    slug,
    published: overrides.published ?? false,
    sourceUrl: overrides.sourceUrl,
    importedAt: overrides.importedAt,
    importedWordPrefixes: overrides.importedWordPrefixes,
  };
}

function upsertPuzzle(puzzle, { force = false } = {}) {
  const puzzles = readPuzzles();
  const index = puzzles.findIndex((item) => item.date === puzzle.date);
  if (index >= 0 && !force) {
    throw new Error(`Puzzle already exists for ${puzzle.date}. Use --force=true to replace it.`);
  }
  if (index >= 0) {
    puzzles[index] = { ...puzzles[index], ...puzzle };
  } else {
    puzzles.push(puzzle);
  }
  writePuzzles(puzzles);
}

function missingDates({ from = START_DATE, to = todayInShanghai() }) {
  const existing = new Set(readPuzzles().map((puzzle) => puzzle.date));
  return dateRange(from, to).filter((date) => !existing.has(date));
}

function newestPuzzle() {
  return readPuzzles().sort((a, b) => b.date.localeCompare(a.date))[0] ?? null;
}

function extractSourcePuzzle(html, date) {
  const sourceUrl = `${SOURCE_BASE_URL}/${date}/`;
  const spangramMatch = html.match(/Today&#x27;s spangram is:[\s\S]*?<div[^>]*>([A-Z][A-Z\s-]{2,})<\/div>/i);
  const altThemeMatch = html.match(/alt="Spangram for NYT Strands of [^:"]+:\s*([^"]+)"/i);
  const spoilerThemeMatch = html.match(/Spoiler Warning[\s\S]*?<span[^>]*>([^<]+)<\/span>/i);
  const theme = stripTags(altThemeMatch?.[1] || spoilerThemeMatch?.[1] || "");
  const spangram = stripTags(spangramMatch?.[1] || "").replace(/[^A-Z]/g, "");
  const themeHintMatch = html.match(/Today&#x27;s theme &#x27;.*?&#x27;([\s\S]*?)<\/p>/i);
  const themeHint = themeHintMatch
    ? stripTags(themeHintMatch[1]).replace(/^is\s+/i, "").trim()
    : "";
  const prefixes = Array.from(html.matchAll(/<span[^>]*>\s*([A-Z]{3})\.\.\.\s*<\/span>/g)).map((match) => match[1]);
  const uniquePrefixes = [...new Set(prefixes)];

  return createTemplate(date, {
    title: theme ? `NYT Strands Hints & Answers ${titleDate(date)}: ${theme}` : undefined,
    themeHint: theme || "Manual theme hint needed.",
    spangram: spangram || "ADDSPANGRAM",
    spangramHint1: themeHint || (theme ? `Think about the theme "${theme}" without revealing the full answer.` : undefined),
    spangramHint2: spangram
      ? `The spangram has ${spangram.length} letters and ties the whole theme together.`
      : undefined,
    wordHints: uniquePrefixes.map((prefix) => `Starts with ${prefix}. Verify the full word manually before publishing.`),
    spoilerLevelContent:
      "Imported as an editorial draft from a public third-party page. Verify the theme, spangram, full words, and explanation before publishing.",
    seoDescription: theme
      ? `Spoiler-safe NYT Strands hints, spangram help, and answer reveals for ${titleDate(date)}. Theme: ${theme}.`
      : undefined,
    published: false,
    sourceUrl,
    importedAt: new Date().toISOString(),
    importedWordPrefixes: uniquePrefixes,
  });
}

async function importFromSource(date, options) {
  const sourceUrl = `${SOURCE_BASE_URL}/${date}/`;
  const response = await fetch(sourceUrl, {
    headers: {
      "user-agent": "StrandsHintBot/1.0 (+https://strandshint.net; editorial draft importer)",
      accept: "text/html",
    },
  });
  if (!response.ok) {
    throw new Error(`Source returned ${response.status} for ${sourceUrl}`);
  }
  const html = await response.text();
  const puzzle = extractSourcePuzzle(html, date);

  const wantsPublish = options.publish === "true";
  const allowIncomplete = options["allow-incomplete"] === "true";
  if (wantsPublish && puzzle.words.length === 0 && !allowIncomplete) {
    throw new Error(
      "Imported source did not expose full theme words as text. Use --allow-incomplete=true or fill words manually before publishing.",
    );
  }
  puzzle.published = wantsPublish;
  upsertPuzzle(puzzle, { force: options.force === "true" });
  return puzzle;
}

async function main() {
  const { command, args } = parseArgs(process.argv.slice(2));

  if (command === "missing") {
    const dates = missingDates({ from: args.from || START_DATE, to: args.to || todayInShanghai() });
    if (dates.length === 0) {
      console.log("No missing Strands puzzle dates.");
      return;
    }
    console.log(dates.join("\n"));
    console.log(`\nMissing ${dates.length} dates.`);
    return;
  }

  if (command === "new") {
    const date = args.date || todayInShanghai();
    const puzzle = createTemplate(date, { published: args.publish === "true" });
    upsertPuzzle(puzzle, { force: args.force === "true" });
    console.log(`Created ${puzzle.published ? "published" : "draft"} puzzle for ${date}.`);
    return;
  }

  if (command === "today") {
    const puzzle = newestPuzzle();
    if (!puzzle) {
      console.log("No Strands puzzle entries yet.");
      return;
    }
    console.log(`${puzzle.date} ${puzzle.published ? "published" : "draft"} ${puzzle.title}`);
    return;
  }

  if (command === "import") {
    const date = args.date || todayInShanghai();
    const puzzle = await importFromSource(date, args);
    console.log(`Imported ${puzzle.published ? "published" : "draft"} puzzle for ${date}.`);
    console.log(`Source: ${puzzle.sourceUrl}`);
    console.log(`Theme: ${puzzle.themeHint}`);
    console.log(`Spangram: ${puzzle.spangram}`);
    console.log(`Word prefixes: ${(puzzle.importedWordPrefixes || []).join(", ") || "none"}`);
    return;
  }

  if (command === "import-missing") {
    const dates = missingDates({ from: args.from || START_DATE, to: args.to || todayInShanghai() });
    const limit = Number(args.limit || dates.length);
    for (const date of dates.slice(0, limit)) {
      try {
        const puzzle = await importFromSource(date, args);
        console.log(`Imported ${puzzle.date}: ${puzzle.themeHint}`);
      } catch (error) {
        console.error(`Skipped ${date}: ${error.message}`);
      }
    }
    return;
  }

  console.error("Unknown command. Use missing, new, today, import, or import-missing.");
  process.exit(1);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
