import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const length = Number(process.argv[2] || 3);
if (!Number.isInteger(length) || length < 3 || length > 12) {
  throw new Error("Pass a word length from 3 to 12.");
}

const jsonSourcePath = path.join(root, "node_modules", "an-array-of-english-words", "index.json");
const textSourcePath = path.join(root, "node_modules", "word-list", "words.txt");
const wordNetDictDir = path.join(root, "node_modules", "wordnet-db", "dict");
const outputDir = path.join(root, "public", "wordle-banks");
const outputPath = path.join(outputDir, `${length}.json`);
const wordNetIndexFiles = ["index.adj", "index.adv", "index.noun", "index.verb"];

function readSourceWords() {
  const words = [];

  if (existsSync(jsonSourcePath)) {
    for (const word of JSON.parse(readFileSync(jsonSourcePath, "utf8"))) {
      words.push(word);
    }
  }

  if (existsSync(textSourcePath)) {
    for (const word of readFileSync(textSourcePath, "utf8").split(/\r?\n/)) {
      words.push(word);
    }
  }

  for (const fileName of wordNetIndexFiles) {
    const filePath = path.join(wordNetDictDir, fileName);
    if (!existsSync(filePath)) continue;

    for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
      const word = line.trim().split(/\s+/, 1)[0];
      if (word) words.push(word);
    }
  }

  if (!words.length) {
    throw new Error("No word sources found. Run npm install first.");
  }

  return words;
}

const sourceWords = readSourceWords();
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
