import fs from "fs/promises";
import path from "path";
import type { ConnectionsGroup, DailyPostJson, FaqItem } from "./daily-types";

const CONTENT_DIR = path.join(process.cwd(), "content");

const DATE_RE = /^\d{4}-\d{2}-\d{2}\.json$/;

export function getContentDir(): string {
  return CONTENT_DIR;
}

export async function listContentDates(): Promise<string[]> {
  try {
    const entries = await fs.readdir(CONTENT_DIR);
    return entries
      .filter((f) => DATE_RE.test(f))
      .map((f) => f.replace(/\.json$/, ""))
      .sort();
  } catch {
    return [];
  }
}

function padHints3(h: string[] | undefined): [string, string, string] {
  const a = [...(h ?? [])];
  while (a.length < 3) a.push("");
  return [a[0] ?? "", a[1] ?? "", a[2] ?? ""];
}

function defaultGroup(title: string): ConnectionsGroup {
  return { title, words: ["—", "—", "—", "—"] };
}

function normalizePost(parsed: Partial<DailyPostJson>): DailyPostJson | null {
  if (typeof parsed?.intro !== "string" || !parsed.intro.trim()) return null;

  const w = parsed.wordle;
  const hints = padHints3(w?.hints as string[] | undefined);
  const wordle = {
    hints,
    answer: typeof w?.answer === "string" ? w.answer : "—",
  };

  const s = parsed.strands;
  const strands = {
    theme: typeof s?.theme === "string" ? s.theme : "",
    hints: Array.isArray(s?.hints) ? s.hints : [],
    spangramHint: typeof s?.spangramHint === "string" ? s.spangramHint : "",
    spangram: typeof s?.spangram === "string" ? s.spangram : "",
    themeWords: Array.isArray(s?.themeWords) ? s.themeWords : [],
  };

  const g = parsed.connections?.groups;
  const groups = [
    g?.[0] ?? defaultGroup("Group 1"),
    g?.[1] ?? defaultGroup("Group 2"),
    g?.[2] ?? defaultGroup("Group 3"),
    g?.[3] ?? defaultGroup("Group 4"),
  ] as [ConnectionsGroup, ConnectionsGroup, ConnectionsGroup, ConnectionsGroup];

  const rawFaq = parsed.faq;
  let faq: FaqItem[] = Array.isArray(rawFaq)
    ? rawFaq
        .map((f) => ({
          question: typeof f?.question === "string" ? f.question.trim() : "",
          answer: typeof f?.answer === "string" ? f.answer.trim() : "",
        }))
        .filter((f) => f.question && f.answer)
    : [];
  if (faq.length < 2) {
    faq = [
      {
        question: "Are these the official New York Times answers?",
        answer:
          "This site is an independent reference for hints and solutions. For the authentic experience, play Wordle, Strands, and Connections on NYTimes.com or in the official NYT Games app.",
      },
      {
        question: "Why are some solutions hidden behind a button?",
        answer:
          "So you can read progressive hints first and only reveal full answers when you want them—without spoiling the puzzle by accident.",
      },
    ];
  }
  if (faq.length > 3) faq = faq.slice(0, 3);

  return {
    intro: parsed.intro.trim(),
    wordle,
    strands,
    connections: { groups },
    faq,
  };
}

export async function readDailyPost(date: string): Promise<DailyPostJson | null> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const file = path.join(CONTENT_DIR, `${date}.json`);
  try {
    const raw = await fs.readFile(file, "utf8");
    const parsed = JSON.parse(raw) as Partial<DailyPostJson>;
    return normalizePost(parsed);
  } catch {
    return null;
  }
}

export function parseDateParam(date: string): Date | null {
  const d = new Date(`${date}T12:00:00.000Z`);
  if (Number.isNaN(d.getTime())) return null;
  const [y, m, day] = date.split("-").map(Number);
  if (d.getUTCFullYear() !== y || d.getUTCMonth() + 1 !== m || d.getUTCDate() !== day)
    return null;
  return d;
}

export function formatDisplayDate(date: string): string {
  const d = parseDateParam(date);
  if (!d) return date;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

export function addDaysIso(dateStr: string, delta: number): string {
  const d = parseDateParam(dateStr);
  if (!d) return dateStr;
  d.setUTCDate(d.getUTCDate() + delta);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayIsoUtc(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
