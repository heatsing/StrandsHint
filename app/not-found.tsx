import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl rounded-lg border border-slate-200 bg-white p-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Page not found</p>
      <h1 className="mt-3 text-3xl font-bold text-slate-950">This Strands helper page is not available</h1>
      <p className="mt-4 text-slate-600">
        The page may have moved, or the puzzle entry may not be published yet. You can still use
        the spoiler-safe tools below.
      </p>
      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <Link href="/todays-strands-answer" className="rounded-md bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-700">Today&apos;s answer</Link>
        <Link href="/strands-solver" className="rounded-md border border-slate-300 px-4 py-2 hover:bg-slate-50">Solver</Link>
        <Link href="/archive" className="rounded-md border border-slate-300 px-4 py-2 hover:bg-slate-50">Archive</Link>
      </div>
    </section>
  );
}
