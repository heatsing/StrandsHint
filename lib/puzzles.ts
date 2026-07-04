import fs from "fs";
import path from "path";

export type Puzzle = {
  id: number;
  date: string;
  theme: string;
  difficulty: number;
  spangram: string;
  answers: string[];
  hints: string[];
  editorNote: string;
};

const DATA_DIR = path.join(process.cwd(), "data", "puzzles");
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isPuzzle(value: unknown): value is Puzzle {
  const p = value as Partial<Puzzle>;
  return (
    typeof p.id === "number" &&
    typeof p.date === "string" &&
    DATE_RE.test(p.date) &&
    typeof p.theme === "string" &&
    typeof p.difficulty === "number" &&
    typeof p.spangram === "string" &&
    Array.isArray(p.answers) &&
    Array.isArray(p.hints) &&
    typeof p.editorNote === "string"
  );
}

function readPuzzleFile(file: string): Puzzle | null {
  try {
    const raw = fs.readFileSync(file, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!isPuzzle(parsed)) return null;
    return {
      ...parsed,
      spangram: parsed.spangram.trim().toUpperCase(),
      answers: parsed.answers.map((a) => String(a).trim().toUpperCase()).filter(Boolean),
      hints: parsed.hints.map((h) => String(h).trim()).filter(Boolean),
    };
  } catch {
    return null;
  }
}

export function getAllPuzzles(): Puzzle[] {
  try {
    if (!fs.existsSync(DATA_DIR)) return [];
    const years = fs
      .readdirSync(DATA_DIR, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();

    const puzzles = years.flatMap((year) => {
      const yearDir = path.join(DATA_DIR, year);
      return fs
        .readdirSync(yearDir)
        .filter((file) => /^\d{4}-\d{2}-\d{2}\.json$/.test(file))
        .map((file) => readPuzzleFile(path.join(yearDir, file)))
        .filter((puzzle): puzzle is Puzzle => puzzle !== null);
    });

    return puzzles.sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return [];
  }
}

export function getLatestPuzzle(): Puzzle | null {
  const puzzles = getAllPuzzles();
  return puzzles[puzzles.length - 1] ?? null;
}

export function getTodayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDaysIso(date: string, delta: number): string {
  const parsed = new Date(`${date}T12:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return date;
  parsed.setUTCDate(parsed.getUTCDate() + delta);
  const y = parsed.getUTCFullYear();
  const m = String(parsed.getUTCMonth() + 1).padStart(2, "0");
  const d = String(parsed.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getTodayPuzzle(): Puzzle | null {
  return getPuzzleByDate(getTodayIso()) ?? getLatestPuzzle();
}

export function getYesterdayPuzzle(): Puzzle | null {
  return getPuzzleByDate(addDaysIso(getTodayIso(), -1)) ?? getLatestPuzzle();
}

export function getPuzzleByDate(date: string): Puzzle | null {
  if (!DATE_RE.test(date)) return null;
  const [year] = date.split("-");
  return readPuzzleFile(path.join(DATA_DIR, year, `${date}.json`));
}

export function getPreviousPuzzle(date: string): Puzzle | null {
  const puzzles = getAllPuzzles();
  const index = puzzles.findIndex((puzzle) => puzzle.date === date);
  return index > 0 ? puzzles[index - 1] : null;
}

export function getNextPuzzle(date: string): Puzzle | null {
  const puzzles = getAllPuzzles();
  const index = puzzles.findIndex((puzzle) => puzzle.date === date);
  return index >= 0 && index < puzzles.length - 1 ? puzzles[index + 1] : null;
}

export function getPuzzlesByYear(year: string): Puzzle[] {
  return getAllPuzzles().filter((puzzle) => puzzle.date.startsWith(`${year}-`));
}

export function getPuzzlesByMonth(year: string, month: string): Puzzle[] {
  return getAllPuzzles().filter((puzzle) => puzzle.date.startsWith(`${year}-${month}`));
}

export function getAvailableYears(): string[] {
  return Array.from(new Set(getAllPuzzles().map((puzzle) => puzzle.date.slice(0, 4)))).sort();
}

export function getAvailableMonths(year: string): string[] {
  return Array.from(
    new Set(getPuzzlesByYear(year).map((puzzle) => puzzle.date.slice(5, 7))),
  ).sort();
}

export function formatDisplayDate(date: string): string {
  const parsed = new Date(`${date}T12:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}
