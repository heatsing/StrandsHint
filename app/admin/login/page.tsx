import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <>
      <h1 className="text-3xl font-bold text-slate-950">Admin login</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
        Login is disabled in the no-database static build. Content is maintained by editing
        <code className="mx-1 rounded bg-slate-100 px-1">data/puzzles.json</code> locally.
      </p>
      <Link href="/admin/puzzles/new" className="mt-6 inline-flex rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold">
        Generate JSON entry
      </Link>
    </>
  );
}
