/** Unified daily JSON in /content/YYYY-MM-DD.json */
export type GameId =
  | "wordle"
  | "strands"
  | "pips"
  | "connections"
  | "sports"
  | "crossword"
  | "mini";

export type GameHintsBlock = {
  /** Optional H2 override; defaults from tab label */
  title?: string;
  hints: string[];
  answer: string;
};

export type DailyHintsJson = {
  /** Main H1 for the page */
  pageTitle: string;
  games: Record<GameId, GameHintsBlock>;
};

export const GAME_ORDER: { id: GameId; label: string }[] = [
  { id: "wordle", label: "Wordle" },
  { id: "strands", label: "Strands" },
  { id: "pips", label: "Pips" },
  { id: "connections", label: "Connections" },
  { id: "sports", label: "Sports" },
  { id: "crossword", label: "Crossword" },
  { id: "mini", label: "Mini" },
];
