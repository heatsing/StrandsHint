import type { Puzzle } from "@prisma/client";
import { prisma } from "./db";
import { parseJsonList, toDateOnly } from "./utils";

export type PuzzleView = Puzzle & {
  wordList: string[];
  hintList: string[];
  dateLabel: string;
};

export function hydratePuzzle(puzzle: Puzzle): PuzzleView {
  return {
    ...puzzle,
    wordList: parseJsonList(puzzle.words),
    hintList: parseJsonList(puzzle.wordHints),
    dateLabel: toDateOnly(puzzle.date),
  };
}

export async function getTodayPuzzle() {
  const latest = await prisma.puzzle.findFirst({
    where: { published: true },
    orderBy: { date: "desc" },
  });
  return latest ? hydratePuzzle(latest) : null;
}

export async function getPublishedPuzzles() {
  const puzzles = await prisma.puzzle.findMany({
    where: { published: true },
    orderBy: { date: "desc" },
  });
  return puzzles.map(hydratePuzzle);
}

export async function getPuzzleByDate(date: string) {
  const start = new Date(`${date}T00:00:00.000Z`);
  const end = new Date(`${date}T23:59:59.999Z`);
  const puzzle = await prisma.puzzle.findFirst({
    where: { published: true, date: { gte: start, lte: end } },
  });
  return puzzle ? hydratePuzzle(puzzle) : null;
}
