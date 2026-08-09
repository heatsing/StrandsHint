import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const length = Number(process.argv[2] || 3);
if (!Number.isInteger(length) || length < 3 || length > 12) {
  throw new Error("Pass a word length from 3 to 12.");
}

const sourcePath = path.join(root, "node_modules", "an-array-of-english-words", "index.json");
const outputDir = path.join(root, "public", "wordle-banks");
const outputPath = path.join(outputDir, `${length}.json`);

const sourceWords = JSON.parse(readFileSync(sourcePath, "utf8"));
const words = Array.from(
  new Set(
    sourceWords
      .filter((word) => new RegExp(`^[a-z]{${length}}$`).test(word))
      .map((word) => word.toUpperCase()),
  ),
).sort();

mkdirSync(outputDir, { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(words)}\n`);
console.log(`Wrote ${words.length} ${length}-letter words to ${path.relative(root, outputPath)}`);
