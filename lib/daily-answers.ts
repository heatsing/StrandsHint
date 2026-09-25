import answers from "@/data/daily-answers.json";

export type DailyAnswerGame =
  | "wordle"
  | "connections"
  | "spelling-bee"
  | "pips"
  | "mini-crossword"
  | "crossword";

export type ClueAnswer = {
  number?: number;
  clue: string;
  answer: string;
  hint?: string;
};

export type ConnectionsGroup = {
  color: "yellow" | "green" | "blue" | "purple";
  title: string;
  words: string[];
  hint?: string;
};

export type DailyAnswerEntry = {
  id: string;
  date: string;
  game: DailyAnswerGame;
  published: boolean;
  title: string;
  summary: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  hints: string[];
  answerNote?: string;
  // Wordle
  answer?: string;
  // Connections
  boardWords?: string[];
  groups?: ConnectionsGroup[];
  // Spelling Bee
  centerLetter?: string;
  outerLetters?: string[];
  pangrams?: string[];
  wordsByLength?: Record<string, string[]>;
  geniusScore?: number;
  // Pips / generic layered reveals
  sections?: { title: string; hint?: string; answer: string; detail?: string }[];
  // Crossword family
  across?: ClueAnswer[];
  down?: ClueAnswer[];
};

export type DailyAnswerGameConfig = {
  game: DailyAnswerGame;
  name: string;
  path: string;
  accent: string;
  description: string;
  howToUpdate: string;
};

export const dailyAnswerGames: DailyAnswerGameConfig[] = [
  {
    game: "wordle",
    name: "Wordle",
    path: "/todays-wordle-answer",
    accent: "#6AAA64",
    description: "Spoiler-safe Wordle hints and today's answer reveal.",
    howToUpdate: "Set answer, 3 progressive hints, then publish.",
  },
  {
    game: "connections",
    name: "Connections",
    path: "/todays-connections-answer",
    accent: "#8A57D6",
    description: "Category hints and four-group answer reveals.",
    howToUpdate: "Add 16 board words, four color groups, and soft hints.",
  },
  {
    game: "spelling-bee",
    name: "Spelling Bee",
    path: "/todays-spelling-bee-answer",
    accent: "#F7D560",
    description: "Hive letters, pangrams, and words by length.",
    howToUpdate: "Fill center/outer letters, pangrams, and wordsByLength.",
  },
  {
    game: "pips",
    name: "Pips",
    path: "/todays-pips-answer",
    accent: "#2F80D8",
    description: "Layered Pips clues with optional answer notes.",
    howToUpdate: "Add section hints and answers for each domino group.",
  },
  {
    game: "mini-crossword",
    name: "Mini Crossword",
    path: "/todays-mini-crossword-answer",
    accent: "#315C4C",
    description: "Across and Down reveals one clue at a time.",
    howToUpdate: "Fill across/down clue lists, then publish.",
  },
  {
    game: "crossword",
    name: "Crossword",
    path: "/todays-crossword-answer",
    accent: "#20201E",
    description: "Full crossword clue help with progressive reveals.",
    howToUpdate: "Fill across/down entries for the day.",
  },
];

function todayInEastern() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function getDailyAnswerGame(game: string): DailyAnswerGameConfig | null {
  return dailyAnswerGames.find((item) => item.game === game) ?? null;
}

export function getPublishedAnswers(game: DailyAnswerGame): DailyAnswerEntry[] {
  return (answers as DailyAnswerEntry[])
    .filter((entry) => entry.game === game && entry.published)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getTodayAnswer(game: DailyAnswerGame): DailyAnswerEntry | null {
  const published = getPublishedAnswers(game);
  const today = todayInEastern();
  return published.find((entry) => entry.date === today) ?? published[0] ?? null;
}

export function formatAnswerDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
