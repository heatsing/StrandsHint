import Link from "next/link";
import { logoutAction, togglePublishedAction } from "../actions";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { toDateOnly } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPuzzlesPage() {
  requireAdmin();
  const puzzles = await prisma.puzzle.findMany({ orderBy: { date: "desc" } });
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Manage puzzles</h1>
          <p className="mt-2 text-slate-600">Create, edit, publish, or unpublish manual Strands Hint content.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/puzzles/new" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white">New puzzle</Link>
          <form action={logoutAction}><button className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold">Logout</button></form>
        </div>
      </div>
      <div className="mt-8 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
        {puzzles.map((puzzle) => (
          <div key={puzzle.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
            <div>
              <p className="text-sm text-slate-500">{toDateOnly(puzzle.date)} {puzzle.published ? "published" : "draft"}</p>
              <h2 className="font-bold text-slate-950">{puzzle.title}</h2>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/puzzles/${puzzle.id}/edit`} className="rounded-md border border-slate-300 px-3 py-2 text-sm">Edit</Link>
              <form action={togglePublishedAction}>
                <input type="hidden" name="id" value={puzzle.id} />
                <input type="hidden" name="published" value={String(puzzle.published)} />
                <button className="rounded-md border border-slate-300 px-3 py-2 text-sm">{puzzle.published ? "Unpublish" : "Publish"}</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
