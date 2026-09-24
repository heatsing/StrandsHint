import puzzles from "@/data/puzzles.json";

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export type PuzzleView = {
  id: string;
  date: string;
  puzzleNumber?: number;
  title: string;
  themeHint: string;
  difficulty: Difficulty;
  spangram: string;
  spangramHint1: string;
  spangramHint2: string;
  spangramDirection: string;
  words: string[];
  wordHints: string[];
  spoilerLevelContent: string;
  seoTitle: string;
  seoDescription: string;
  slug: string;
  published: boolean;
  dateLabel: string;
  wordList: string[];
  hintList: string[];
};

function hydrate(puzzle: (typeof puzzles)[number]): PuzzleView {
  return {
    ...puzzle,
    difficulty: puzzle.difficulty as Difficulty,
    dateLabel: puzzle.date,
    wordList: puzzle.words,
    hintList: puzzle.wordHints,
  };
}

export function getPublishedPuzzles(): PuzzleView[] {
  return puzzles
    .filter((puzzle) => puzzle.published)
    .map(hydrate)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function todayPuzzleDate(timeZone = "America/New_York") {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function getTodayPuzzle(): PuzzleView | null {
  const published = getPublishedPuzzles();
  const today = todayPuzzleDate();
  return published.find((puzzle) => puzzle.date === today) ?? published[0] ?? null;
}

export function getPuzzleByDate(date: string): PuzzleView | null {
  return getPublishedPuzzles().find((puzzle) => puzzle.date === date) ?? null;
}
