import fs from "node:fs";
import path from "node:path";

const DATA_FILE = path.join(process.cwd(), "data", "daily-answers.json");
const GAMES = ["wordle", "connections", "spelling-bee", "pips", "mini-crossword", "crossword"];

function parseArgs(argv) {
  const [command = "today", ...rest] = argv;
  const args = Object.fromEntries(
    rest.map((arg) => {
      const [key, value = "true"] = arg.replace(/^--/, "").split("=");
      return [key, value];
    }),
  );
  return { command, args };
}

function todayInEastern() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function readAnswers() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeAnswers(answers) {
  const sorted = [...answers].sort((a, b) => {
    const dateCmp = b.date.localeCompare(a.date);
    if (dateCmp !== 0) return dateCmp;
    return a.game.localeCompare(b.game);
  });
  fs.writeFileSync(DATA_FILE, `${JSON.stringify(sorted, null, 2)}\n`);
}

function titleCaseGame(game) {
  return game
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function createTemplate(game, date, published = false) {
  const name = titleCaseGame(game);
  const base = {
    id: `${date}-${game}`,
    date,
    game,
    published,
    title: `Today's ${name} Hint & Answer`,
    summary: `Spoiler-safe ${name} hints and answer reveals for ${date}.`,
    difficulty: "MEDIUM",
    hints: ["Add a soft first hint.", "Add a stronger second hint.", "Add a final nudge before the answer."],
    answerNote: "Editorial draft. Verify before publishing.",
  };

  if (game === "wordle") {
    return { ...base, answer: "WORDS" };
  }
  if (game === "connections") {
    return {
      ...base,
      boardWords: Array.from({ length: 16 }, (_, index) => `WORD${index + 1}`),
      groups: [
        { color: "yellow", title: "Yellow group", words: ["WORD1", "WORD2", "WORD3", "WORD4"], hint: "Easiest group" },
        { color: "green", title: "Green group", words: ["WORD5", "WORD6", "WORD7", "WORD8"], hint: "Next group" },
        { color: "blue", title: "Blue group", words: ["WORD9", "WORD10", "WORD11", "WORD12"], hint: "Trickier group" },
        { color: "purple", title: "Purple group", words: ["WORD13", "WORD14", "WORD15", "WORD16"], hint: "Hardest group" },
      ],
    };
  }
  if (game === "spelling-bee") {
    return {
      ...base,
      centerLetter: "A",
      outerLetters: ["B", "C", "D", "E", "F", "G"],
      pangrams: ["FEEDBAG"],
      wordsByLength: { "4": ["BADE", "CAFE"], "5": ["BADGE"], "7": ["FEEDBAG"] },
      geniusScore: 50,
    };
  }
  if (game === "pips") {
    return {
      ...base,
      sections: [
        { title: "Step 1", hint: "Add a placement hint.", answer: "Add the step answer.", detail: "Optional detail." },
        { title: "Step 2", hint: "Add the next hint.", answer: "Add the next answer." },
      ],
    };
  }
  return {
    ...base,
    across: [{ number: 1, clue: "Sample across clue", answer: "ANSWER", hint: "Optional hint" }],
    down: [{ number: 1, clue: "Sample down clue", answer: "DOWN", hint: "Optional hint" }],
  };
}

function upsert(entry, { force = false } = {}) {
  const answers = readAnswers();
  const index = answers.findIndex((item) => item.date === entry.date && item.game === entry.game);
  if (index >= 0 && !force) {
    throw new Error(`${entry.game} already exists for ${entry.date}. Use --force=true to replace.`);
  }
  if (index >= 0) answers[index] = { ...answers[index], ...entry };
  else answers.push(entry);
  writeAnswers(answers);
}

function main() {
  const { command, args } = parseArgs(process.argv.slice(2));
  const game = args.game;
  const date = args.date || todayInEastern();

  if (command === "games") {
    console.log(GAMES.join("\n"));
    return;
  }

  if (command === "today") {
    const answers = readAnswers()
      .filter((item) => (game ? item.game === game : true))
      .sort((a, b) => b.date.localeCompare(a.date) || a.game.localeCompare(b.game));
    for (const item of answers.slice(0, game ? 5 : 20)) {
      console.log(`${item.date} ${item.game} ${item.published ? "published" : "draft"} ${item.title}`);
    }
    return;
  }

  if (command === "new") {
    if (!game || !GAMES.includes(game)) {
      throw new Error(`Pass --game= one of: ${GAMES.join(", ")}`);
    }
    const entry = createTemplate(game, date, args.publish === "true");
    upsert(entry, { force: args.force === "true" });
    console.log(`Created ${entry.published ? "published" : "draft"} ${game} for ${date}.`);
    return;
  }

  if (command === "publish") {
    if (!game || !GAMES.includes(game)) {
      throw new Error(`Pass --game= one of: ${GAMES.join(", ")}`);
    }
    const answers = readAnswers();
    const index = answers.findIndex((item) => item.date === date && item.game === game);
    if (index < 0) throw new Error(`No ${game} entry for ${date}. Run daily:answer new first.`);
    answers[index] = { ...answers[index], published: true };
    writeAnswers(answers);
    console.log(`Published ${game} for ${date}.`);
    return;
  }

  console.error("Unknown command. Use games, today, new, or publish.");
  process.exit(1);
}

main();
