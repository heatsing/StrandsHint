import Link from "next/link";
import { getPublishedPuzzles } from "@/lib/puzzle-data";

export default function AdminPuzzlesPage() {
  const puzzles = getPublishedPuzzles();
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-slate-950">Manual puzzle entries</h1>
        <Link href="/admin/puzzles/new" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white">New JSON entry</Link>
      </div>
      <div className="mt-8 grid gap-3">
        {puzzles.map((puzzle) => (
          <div key={puzzle.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">{puzzle.date}</p>
            <h2 className="font-bold text-slate-950">{puzzle.title}</h2>
          </div>
        ))}
      </div>
    </>
  );
}
