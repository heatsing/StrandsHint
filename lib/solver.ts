const SIZE = { rows: 6, cols: 8 };
const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
] as const;

export type SolverWord = {
  word: string;
  path: [number, number][];
  length: number;
  possibleSpangram: boolean;
  direction?: string;
};

export function parseGrid(input: string): string[][] {
  const letters = input.toUpperCase().replace(/[^A-Z]/g, "").slice(0, SIZE.rows * SIZE.cols);
  const padded = letters.padEnd(SIZE.rows * SIZE.cols, " ");
  const grid: string[][] = [];
  for (let row = 0; row < SIZE.rows; row++) {
    grid.push(padded.slice(row * SIZE.cols, row * SIZE.cols + SIZE.cols).split(""));
  }
  return grid;
}

export function getNeighbors(row: number, col: number): [number, number][] {
  return DIRECTIONS.map(([dr, dc]) => [row + dr, col + dc] as [number, number]).filter(
    ([r, c]) => r >= 0 && r < SIZE.rows && c >= 0 && c < SIZE.cols,
  );
}

function normalizeDictionary(dictionary: string[]) {
  return dictionary
    .slice(0, 50000)
    .map((word) => word.trim().toUpperCase())
    .filter((word) => /^[A-Z]{4,}$/.test(word));
}

function makePrefixSet(words: string[]) {
  const prefixes = new Set<string>();
  for (const word of words) {
    for (let i = 1; i <= word.length; i++) prefixes.add(word.slice(0, i));
  }
  return prefixes;
}

export function canFormWord(grid: string[][], word: string): boolean {
  return findWordPath(grid, word.toUpperCase()) !== null;
}

function findWordPath(grid: string[][], word: string): [number, number][] | null {
  const used = Array.from({ length: SIZE.rows }, () => Array(SIZE.cols).fill(false));

  function dfs(row: number, col: number, index: number, path: [number, number][]): [number, number][] | null {
    if (grid[row]?.[col] !== word[index] || used[row][col]) return null;
    const nextPath = [...path, [row, col] as [number, number]];
    if (index === word.length - 1) return nextPath;
    used[row][col] = true;
    for (const [nr, nc] of getNeighbors(row, col)) {
      const found = dfs(nr, nc, index + 1, nextPath);
      if (found) {
        used[row][col] = false;
        return found;
      }
    }
    used[row][col] = false;
    return null;
  }

  for (let row = 0; row < SIZE.rows; row++) {
    for (let col = 0; col < SIZE.cols; col++) {
      const found = dfs(row, col, 0, []);
      if (found) return found;
    }
  }
  return null;
}

function edgeDirection(path: [number, number][]) {
  const first = path[0];
  const last = path[path.length - 1];
  if (!first || !last) return undefined;
  if (first[0] === 0 && last[0] === SIZE.rows - 1) return "top to bottom";
  if (first[0] === SIZE.rows - 1 && last[0] === 0) return "bottom to top";
  if (first[1] === 0 && last[1] === SIZE.cols - 1) return "left to right";
  if (first[1] === SIZE.cols - 1 && last[1] === 0) return "right to left";
  if (
    (first[0] === 0 || first[0] === SIZE.rows - 1 || first[1] === 0 || first[1] === SIZE.cols - 1) &&
    (last[0] === 0 || last[0] === SIZE.rows - 1 || last[1] === 0 || last[1] === SIZE.cols - 1)
  ) {
    return "edge to edge";
  }
  return undefined;
}

export function findWordsInGrid(grid: string[][], dictionary: string[]): SolverWord[] {
  const words = normalizeDictionary(dictionary);
  const prefixes = makePrefixSet(words);
  const wordSet = new Set(words);
  const found = new Map<string, SolverWord>();
  const used = Array.from({ length: SIZE.rows }, () => Array(SIZE.cols).fill(false));

  function dfs(row: number, col: number, current: string, path: [number, number][]) {
    const letter = grid[row]?.[col];
    if (!letter || letter === " " || used[row][col]) return;
    const next = current + letter;
    if (!prefixes.has(next)) return;

    const nextPath = [...path, [row, col] as [number, number]];
    if (wordSet.has(next)) {
      const direction = edgeDirection(nextPath);
      found.set(next, {
        word: next,
        path: nextPath,
        length: next.length,
        possibleSpangram: Boolean(direction && next.length >= 6),
        direction,
      });
    }

    used[row][col] = true;
    for (const [nr, nc] of getNeighbors(row, col)) dfs(nr, nc, next, nextPath);
    used[row][col] = false;
  }

  for (let row = 0; row < SIZE.rows; row++) {
    for (let col = 0; col < SIZE.cols; col++) dfs(row, col, "", []);
  }

  return Array.from(found.values()).sort((a, b) => b.length - a.length || a.word.localeCompare(b.word));
}

export function findSpangramCandidates(grid: string[][], dictionary: string[]): SolverWord[] {
  return findWordsInGrid(grid, dictionary).filter((result) => result.possibleSpangram);
}
