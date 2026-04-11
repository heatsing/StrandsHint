import fs from "fs/promises";
import path from "path";
import type { DailyHintsJson, GameHintsBlock, GameId } from "./daily-types";
import { GAME_ORDER } from "./daily-types";

const CONTENT_DIR = path.join(process.cwd(), "content");

const DATE_RE = /^\d{4}-\d{2}-\d{2}\.json$/;

export function getContentDir(): string {
  return CONTENT_DIR;
}

export async function listContentDates(): Promise<string[]> {
  try {
    const entries = await fs.readdir(CONTENT_DIR);
    return entries
      .filter((f) => DATE_RE.test(f))
      .map((f) => f.replace(/\.json$/, ""))
      .sort();
  } catch {
    return [];
  }
}

function defaultGame(): GameHintsBlock {
  return { hints: [], answer: "—" };
}

function normalizeDailyHints(parsed: Partial<DailyHintsJson>): DailyHintsJson | null {
  if (!parsed?.pageTitle || !parsed?.games) return null;
  const games = {} as Record<GameId, GameHintsBlock>;
  for (const { id } of GAME_ORDER) {
    const g = parsed.games![id];
    games[id] = {
      ...defaultGame(),
      ...g,
      hints: Array.isArray(g?.hints) ? g!.hints : [],
      answer: typeof g?.answer === "string" ? g.answer : defaultGame().answer,
    };
  }
  return { pageTitle: parsed.pageTitle, games };
}

/** Daily tabbed hints (unified schema with `pageTitle` + `games`). */
export async function readDailyHints(date: string): Promise<DailyHintsJson | null> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const file = path.join(CONTENT_DIR, `${date}.json`);
  try {
    const raw = await fs.readFile(file, "utf8");
    const parsed = JSON.parse(raw) as Partial<DailyHintsJson>;
    return normalizeDailyHints(parsed);
  } catch {
    return null;
  }
}

export function parseDateParam(date: string): Date | null {
  const d = new Date(`${date}T12:00:00.000Z`);
  if (Number.isNaN(d.getTime())) return null;
  const [y, m, day] = date.split("-").map(Number);
  if (d.getUTCFullYear() !== y || d.getUTCMonth() + 1 !== m || d.getUTCDate() !== day)
    return null;
  return d;
}

export function formatDisplayDate(date: string): string {
  const d = parseDateParam(date);
  if (!d) return date;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

export function addDaysIso(dateStr: string, delta: number): string {
  const d = parseDateParam(dateStr);
  if (!d) return dateStr;
  d.setUTCDate(d.getUTCDate() + delta);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayIsoUtc(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
