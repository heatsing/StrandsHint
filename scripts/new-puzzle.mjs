import fs from "fs";
import path from "path";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";

const rl = readline.createInterface({ input, output });

async function ask(label) {
  const value = await rl.question(`${label}: `);
  return value.trim();
}

function cleanList(value, separator) {
  return value
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);
}

async function main() {
  try {
    const id = Number(await ask("Puzzle ID"));
    const date = await ask("Date (YYYY-MM-DD)");
    const theme = await ask("Theme");
    const difficulty = Number(await ask("Difficulty (1-5)"));
    const spangram = (await ask("Spangram")).toUpperCase();
    const answers = cleanList(await ask("Answers (comma separated)"), ",").map((answer) =>
      answer.toUpperCase(),
    );
    const hints = cleanList(await ask("Hints (use | between hints)"), "|");
    const editorNote = await ask("Editor note");

    if (!Number.isInteger(id) || id < 1) throw new Error("Puzzle ID must be a number.");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Date must be YYYY-MM-DD.");
    if (!Number.isInteger(difficulty) || difficulty < 1 || difficulty > 5) {
      throw new Error("Difficulty must be an integer from 1 to 5.");
    }
    if (!theme || !spangram || answers.length === 0 || hints.length === 0 || !editorNote) {
      throw new Error("Theme, spangram, answers, hints, and editor note are required.");
    }

    const year = date.slice(0, 4);
    const dir = path.join(process.cwd(), "data", "puzzles", year);
    const file = path.join(dir, `${date}.json`);

    if (fs.existsSync(file)) {
      throw new Error(`${file} already exists. Refusing to overwrite it.`);
    }

    fs.mkdirSync(dir, { recursive: true });
    const puzzle = { id, date, theme, difficulty, spangram, answers, hints, editorNote };
    fs.writeFileSync(file, `${JSON.stringify(puzzle, null, 2)}\n`, "utf8");
    console.log(`Created ${file}`);
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
