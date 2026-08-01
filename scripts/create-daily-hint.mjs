import fs from "node:fs";
import path from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, value = ""] = arg.replace(/^--/, "").split("=");
    return [key, value];
  }),
);

const game = args.game || "strands";
const date = args.date || new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

if (!/^[a-z0-9-]+$/.test(game)) {
  console.error("Game must use lowercase letters, numbers, and hyphens.");
  process.exit(1);
}

if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  console.error("Date must use YYYY-MM-DD.");
  process.exit(1);
}

const dir = path.join(process.cwd(), "content", "hints", game);
const file = path.join(dir, `${date}.json`);
fs.mkdirSync(dir, { recursive: true });

if (fs.existsSync(file)) {
  console.error(`Daily hint already exists: ${file}`);
  process.exit(1);
}

const titleGame = game
  .split("-")
  .map((part) => part[0].toUpperCase() + part.slice(1))
  .join(" ");

const template = {
  game,
  date,
  puzzleNumber: undefined,
  title: `${titleGame} hints for ${date}`,
  shortHint: "Write one gentle, spoiler-safe hint here.",
  mediumHints: [
    "Add a slightly stronger hint here.",
    "Add a second progressive hint here.",
    "Add a final pre-answer hint here.",
  ],
  categoryHints: [],
  answers: [],
  explanation: "Add a short original explanation after answers are manually entered.",
  updatedAt: new Date().toISOString(),
};

fs.writeFileSync(file, `${JSON.stringify(template, null, 2)}\n`);
console.log(`Created ${file}`);
