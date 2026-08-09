import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourcePath = path.join(root, "node_modules", "an-array-of-english-words", "index.json");
const outputPath = path.join(root, "data", "wordle-3-letter-bank.ts");

const sourceWords = JSON.parse(readFileSync(sourcePath, "utf8"));
const words = Array.from(
  new Set(
    sourceWords
      .filter((word) => /^[a-z]{3}$/.test(word))
      .map((word) => word.toUpperCase()),
  ),
).sort();

const lines = [
  "// Generated from an-array-of-english-words@2.0.0 (MIT).",
  "// Regenerate with: node scripts/generate-wordle-3-bank.mjs",
  "export const wordle3LetterBank = [",
  ...words.map((word) => `  ${JSON.stringify(word)},`),
  "];",
  "",
];

writeFileSync(outputPath, lines.join("\n"));
console.log(`Wrote ${words.length} 3-letter words to ${path.relative(root, outputPath)}`);
