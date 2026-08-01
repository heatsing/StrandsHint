import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Notes",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <section className="rounded-2xl bg-[#F3ECDD] p-6 text-[#12172B]">
      <h1 className="font-serif text-4xl font-black">Static Admin Notes</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-[#12172B]/70">
        This no-database version is deployed as a static site. It cannot save edits from the browser
        on the live site. Use the local JSON helper to prepare a puzzle entry, then update
        <code className="mx-1 rounded bg-white px-1">data/puzzles.json</code> or
        <code className="mx-1 rounded bg-white px-1">data/daily-content.json</code>.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/puzzles/new" className="inline-flex rounded-full bg-[#12172B] px-4 py-2 text-sm font-semibold text-[#F6F1E6]">
          Puzzle JSON helper
        </Link>
        <Link href="/admin/daily/new" className="inline-flex rounded-full bg-[#E1573F] px-4 py-2 text-sm font-semibold text-white">
          Daily SEO JSON helper
        </Link>
      </div>
    </section>
  );
}
