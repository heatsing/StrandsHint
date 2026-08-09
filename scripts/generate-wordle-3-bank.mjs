import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const length = Number(process.argv[2] || 3);
if (!Number.isInteger(length) || length < 3 || length > 12) {
  throw new Error("Pass a word length from 3 to 12.");
}

const sourcePath = path.join(root, "node_modules", "an-array-of-english-words", "index.json");
const outputPath = path.join(root, "data", `wordle-${length}-letter-bank.ts`);
const exportName = `wordle${length}LetterBank`;

const sourceWords = JSON.parse(readFileSync(sourcePath, "utf8"));
const words = Array.from(
  new Set(
    sourceWords
      .filter((word) => new RegExp(`^[a-z]{${length}}$`).test(word))
      .map((word) => word.toUpperCase()),
  ),
).sort();

const lines = [
  "// Generated from an-array-of-english-words@2.0.0 (MIT).",
  `// Regenerate with: node scripts/generate-wordle-3-bank.mjs ${length}`,
  `export const ${exportName} = [`,
  ...words.map((word) => `  ${JSON.stringify(word)},`),
  "];",
  "",
];

writeFileSync(outputPath, lines.join("\n"));
console.log(`Wrote ${words.length} ${length}-letter words to ${path.relative(root, outputPath)}`);
