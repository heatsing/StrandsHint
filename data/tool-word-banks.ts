import { wordBank } from "./word-bank";
import { wordle3LetterBank } from "./wordle-3-letter-bank";
import { wordle4LetterBank } from "./wordle-4-letter-bank";
import { wordle5LetterBank } from "./wordle-5-letter-bank";
import { wordle6LetterBank } from "./wordle-6-letter-bank";

function uniqueWords(words: string[]) {
  return Array.from(new Set(words.map((word) => word.toUpperCase().replace(/[^A-Z]/g, "")).filter(Boolean)));
}

const baseWords = uniqueWords(wordBank);

export const wordleWordBanks = Object.fromEntries(
  Array.from({ length: 10 }, (_, index) => {
    const length = index + 3;
    if (length === 3) return [length, wordle3LetterBank];
    if (length === 4) return [length, wordle4LetterBank];
    if (length === 5) return [length, wordle5LetterBank];
    if (length === 6) return [length, wordle6LetterBank];
    return [length, baseWords.filter((word) => word.length === length)];
  }),
) as Record<number, string[]>;

export function getWordleWordBank(length: number) {
  return wordleWordBanks[length] || baseWords.filter((word) => word.length === length);
}

export const spellingBeeWordBank = baseWords.filter((word) => word.length >= 4);
export const letterBoxWordBank = baseWords.filter((word) => word.length >= 3);
export const quordleWordBank = getWordleWordBank(5);
export const crosswordWordBank = baseWords.filter((word) => word.length >= 3);
export const jumbleWordBank = baseWords.filter((word) => word.length >= 2);

export const wordFinderWordBanks = {
  anagram: baseWords.filter((word) => word.length >= 2),
  unscrambler: baseWords.filter((word) => word.length >= 2),
  scrabble: baseWords.filter((word) => word.length >= 2),
  wordsWithFriends: baseWords.filter((word) => word.length >= 2),
};
