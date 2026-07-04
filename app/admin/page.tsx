import Link from "next/link";

export default function AdminPage() {
  return (
    <>
      <h1 className="text-3xl font-bold text-slate-950">Static Admin Notes</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
        This no-database version is deployed as a static site. It cannot save edits from the browser
        on the live site. Use the local JSON helper to prepare a puzzle entry, then update
        <code className="mx-1 rounded bg-slate-100 px-1">data/puzzles.json</code>.
      </p>
      <Link href="/admin/puzzles/new" className="mt-6 inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
        Open JSON helper
      </Link>
    </>
  );
}
