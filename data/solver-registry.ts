export type SolverConfig = {
  slug: string;
  name: string;
  shortDescription: string;
  category: "Wordle Solvers" | "Puzzle Solvers" | "Word Finders";
  icon: "grid" | "bee" | "shuffle" | "search" | "book" | "sparkles";
  inputType: "wordle" | "spelling-bee" | "anagram" | "letter-box" | "directory";
  relatedSolvers: string[];
  seo: {
    title: string;
    description: string;
  };
  implemented: boolean;
  wordLength?: number;
};

const wordleLengthSolvers: SolverConfig[] = Array.from({ length: 10 }, (_, index) => {
  const wordLength = index + 3;
  return {
    slug: `${wordLength}-letter-wordle-solver`,
    name: `${wordLength} Letter Wordle Solver`,
    shortDescription: `Find possible ${wordLength}-letter Wordle-style words from known letters, wrong-position letters, and excluded letters.`,
    category: "Wordle Solvers",
    icon: "grid",
    inputType: "wordle",
    relatedSolvers: ["wordle-solver", "anagram-solver", "word-unscrambler"],
    seo: {
      title: `${wordLength} Letter Wordle Solver - Find ${wordLength}-Letter Words`,
      description: `Use a ${wordLength} letter Wordle solver to filter possible words by green letters, yellow letters, and excluded gray letters.`,
    },
    implemented: true,
    wordLength,
  };
});

export const solverRegistry: SolverConfig[] = [
  {
    slug: "wordle-solver",
    name: "Wordle Solver",
    shortDescription: "Filter possible words by pattern, green letters, yellow letters, and excluded letters.",
    category: "Wordle Solvers",
    icon: "grid",
    inputType: "wordle",
    relatedSolvers: ["anagram-solver", "word-unscrambler", "strands-solver"],
    seo: {
      title: "Wordle Solver - Find Possible Words by Clue Pattern",
      description:
        "Use a local Wordle solver to filter possible answers by known positions, included letters, excluded letters, and word length.",
    },
    implemented: true,
  },
  ...wordleLengthSolvers,
  {
    slug: "spelling-bee-solver",
    name: "Spelling Bee Solver",
    shortDescription: "Enter one center letter and six outer letters to find valid words and pangrams.",
    category: "Puzzle Solvers",
    icon: "bee",
    inputType: "spelling-bee",
    relatedSolvers: ["anagram-solver", "word-unscrambler", "wordle-solver"],
    seo: {
      title: "Spelling Bee Solver - Find Words and Pangrams",
      description:
        "Find Spelling Bee-style words locally using a center letter, six outer letters, pangram detection, and scoring.",
    },
    implemented: true,
  },
  {
    slug: "anagram-solver",
    name: "Anagram Solver",
    shortDescription: "Unscramble letters with length filters, starts-with, ends-with, and required letters.",
    category: "Word Finders",
    icon: "shuffle",
    inputType: "anagram",
    relatedSolvers: ["word-unscrambler", "wordle-solver", "spelling-bee-solver"],
    seo: {
      title: "Anagram Solver - Unscramble Letters Into Words",
      description:
        "Unscramble letters with a local anagram solver that supports wildcard letters, length filters, and required letters.",
    },
    implemented: true,
  },
  {
    slug: "word-unscrambler",
    name: "Word Unscrambler",
    shortDescription: "Use the same anagram engine with word-game friendly filters and copyable results.",
    category: "Word Finders",
    icon: "search",
    inputType: "anagram",
    relatedSolvers: ["anagram-solver", "scrabble-word-finder", "wordle-solver"],
    seo: {
      title: "Word Unscrambler - Find Words From Mixed Letters",
      description:
        "Find words from scrambled letters with local filtering by length, required letters, starting letter, and ending letter.",
    },
    implemented: true,
  },
  {
    slug: "strands-solver",
    name: "Strands Solver",
    shortDescription: "Paste a 6x8 grid and find connected candidate words.",
    category: "Puzzle Solvers",
    icon: "sparkles",
    inputType: "directory",
    relatedSolvers: ["spelling-bee-solver", "anagram-solver", "wordle-solver"],
    seo: {
      title: "Strands Solver - Find Words in a Strands Grid",
      description: "Use the existing Strands grid solver to find connected words in a pasted 6x8 board.",
    },
    implemented: true,
  },
  {
    slug: "letter-box-solver",
    name: "Letter Box Solver",
    shortDescription: "Enter 12 box letters and find efficient word chains for Letter Boxed-style puzzles.",
    category: "Puzzle Solvers",
    icon: "grid",
    inputType: "letter-box",
    relatedSolvers: ["anagram-solver", "word-unscrambler", "crossword-solver"],
    seo: {
      title: "Letter Box Solver - Find Letter Boxed Word Chains",
      description:
        "Use a Letter Box solver to enter 12 side letters and find word chains that follow Letter Boxed-style rules.",
    },
    implemented: true,
  },
  {
    slug: "scrabble-word-finder",
    name: "Scrabble Word Finder",
    shortDescription: "Find playable Scrabble-style words from rack letters with wildcard and length filters.",
    category: "Word Finders",
    icon: "book",
    inputType: "anagram",
    relatedSolvers: ["word-unscrambler", "anagram-solver", "words-with-friends-solver"],
    seo: {
      title: "Scrabble Word Finder - Find High-Scoring Words",
      description: "Use a Scrabble word finder to make words from rack letters, blank tiles, and optional filters.",
    },
    implemented: true,
  },
  {
    slug: "crossword-solver",
    name: "Crossword Solver",
    shortDescription: "A planned pattern solver for crossword-style clues.",
    category: "Puzzle Solvers",
    icon: "grid",
    inputType: "directory",
    relatedSolvers: ["wordle-solver", "anagram-solver", "word-unscrambler"],
    seo: {
      title: "Crossword Solver - Pattern Word Helper",
      description: "A planned crossword helper for clue patterns and known letters.",
    },
    implemented: false,
  },
  {
    slug: "jumble-solver",
    name: "Jumble Solver",
    shortDescription: "A planned quick unscrambler for jumble-style word puzzles.",
    category: "Word Finders",
    icon: "shuffle",
    inputType: "directory",
    relatedSolvers: ["anagram-solver", "word-unscrambler", "wordle-solver"],
    seo: {
      title: "Jumble Solver - Unscramble Jumbled Letters",
      description: "A planned solver for jumble-style scrambled word puzzles.",
    },
    implemented: false,
  },
];

export function getSolver(slug: string) {
  return solverRegistry.find((solver) => solver.slug === slug);
}

export function getImplementedSolvers() {
  return solverRegistry.filter((solver) => solver.implemented);
}
