import type { Puzzle } from "@prisma/client";
import { Difficulty } from "@prisma/client";
import { savePuzzleAction } from "@/app/admin/actions";
import { parseJsonList, toDateOnly } from "@/lib/utils";

export function AdminPuzzleForm({ puzzle }: { puzzle?: Puzzle }) {
  const words = puzzle ? parseJsonList(puzzle.words).join("\n") : "";
  const wordHints = puzzle ? parseJsonList(puzzle.wordHints).join("\n") : "";

  return (
    <form action={savePuzzleAction} className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6">
      {puzzle ? <input type="hidden" name="id" value={puzzle.id} /> : null}
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Date" name="date" type="date" defaultValue={puzzle ? toDateOnly(puzzle.date) : ""} />
        <Field label="Puzzle number" name="puzzleNumber" type="number" defaultValue={puzzle?.puzzleNumber ?? ""} />
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Difficulty
          <select name="difficulty" defaultValue={puzzle?.difficulty ?? "MEDIUM"} className="rounded-md border border-slate-300 px-3 py-2">
            {Object.values(Difficulty).map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </label>
      </div>
      <Field label="Title" name="title" defaultValue={puzzle?.title ?? ""} />
      <Textarea label="Theme hint" name="themeHint" defaultValue={puzzle?.themeHint ?? ""} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Spangram" name="spangram" defaultValue={puzzle?.spangram ?? ""} />
        <Field label="Spangram direction" name="spangramDirection" defaultValue={puzzle?.spangramDirection ?? ""} />
      </div>
      <Textarea label="Spangram hint 1" name="spangramHint1" defaultValue={puzzle?.spangramHint1 ?? ""} />
      <Textarea label="Spangram hint 2" name="spangramHint2" defaultValue={puzzle?.spangramHint2 ?? ""} />
      <div className="grid gap-4 md:grid-cols-2">
        <Textarea label="Words, one per line" name="words" defaultValue={words} rows={8} />
        <Textarea label="Word hints, one per line" name="wordHints" defaultValue={wordHints} rows={8} />
      </div>
      <Textarea label="Short explanation" name="spoilerLevelContent" defaultValue={puzzle?.spoilerLevelContent ?? ""} />
      <Field label="SEO title" name="seoTitle" defaultValue={puzzle?.seoTitle ?? ""} />
      <Textarea label="SEO description" name="seoDescription" defaultValue={puzzle?.seoDescription ?? ""} />
      <Field label="Slug" name="slug" defaultValue={puzzle?.slug ?? ""} />
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input name="published" type="checkbox" defaultChecked={puzzle?.published ?? false} />
        Published
      </label>
      <button className="w-fit rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700">
        Save puzzle
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue: string | number;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      {label}
      <input name={name} type={type} defaultValue={defaultValue} className="rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-800" />
    </label>
  );
}

function Textarea({
  label,
  name,
  defaultValue,
  rows = 4,
}: {
  label: string;
  name: string;
  defaultValue: string;
  rows?: number;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      {label}
      <textarea name={name} defaultValue={defaultValue} rows={rows} className="rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-800" />
    </label>
  );
}
