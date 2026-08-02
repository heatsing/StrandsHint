import fs from "node:fs";
import path from "node:path";

export type DailyPuzzle = {
  game: string;
  date: string;
  puzzleNumber?: number;
  title: string;
  shortHint: string;
  mediumHints: string[];
  categoryHints?: string[];
  answers: string[];
  explanation?: string;
  updatedAt: string;
};

const contentRoot = path.join(process.cwd(), "content", "hints");

export const dailyHintGames = [
  { game: "wordle", name: "Wordle", path: "/hints/wordle" },
  { game: "connections", name: "Connections", path: "/hints/connections" },
  { game: "strands", name: "Strands", path: "/hints/strands" },
  { game: "spelling-bee", name: "Spelling Bee", path: "/hints/spelling-bee" },
  { game: "letter-boxed", name: "Letter Boxed", path: "/hints/letter-boxed" },
  { game: "crossword", name: "Crossword", path: "/hints/crossword" },
  { game: "mini-crossword", name: "Mini Crossword", path: "/hints/mini-crossword" },
  { game: "connections-sports-edition", name: "Connections: Sports Edition", path: "/hints/connections-sports-edition" },
  { game: "pips", name: "Pips", path: "/hints/pips" },
];

export function isDateString(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function todayInTimeZone(timeZone = "Asia/Shanghai") {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date());
}

export function getDailyHintSlugs() {
  if (!fs.existsSync(contentRoot)) return [];
  const params: { game: string; date: string }[] = [];
  for (const game of fs.readdirSync(contentRoot)) {
    const gameDir = path.join(contentRoot, game);
    if (!fs.statSync(gameDir).isDirectory()) continue;
    for (const file of fs.readdirSync(gameDir)) {
      if (file.endsWith(".json")) params.push({ game, date: file.replace(/\.json$/, "") });
    }
  }
  return params;
}

export function getDailyHint(game: string, date: string): DailyPuzzle | null {
  if (!isDateString(date)) return null;
  if (date > todayInTimeZone()) return null;
  const file = path.join(contentRoot, game, `${date}.json`);
  if (!fs.existsSync(file)) return null;
  const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as DailyPuzzle;
  return parsed;
}

export function getLatestDailyHint(game: string): DailyPuzzle | null {
  const slugs = getDailyHintSlugs()
    .filter((item) => item.game === game && item.date <= todayInTimeZone())
    .sort((a, b) => b.date.localeCompare(a.date));
  const latest = slugs[0];
  return latest ? getDailyHint(game, latest.date) : null;
}
