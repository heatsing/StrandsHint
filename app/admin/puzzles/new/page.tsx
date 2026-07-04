import { AdminPuzzleForm } from "@/components/AdminPuzzleForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Puzzle JSON Entry",
  robots: { index: false, follow: false },
};

export default function NewPuzzlePage() {
  return (
    <>
      <h1 className="mb-4 text-3xl font-bold text-slate-950">Generate a puzzle JSON entry</h1>
      <p className="mb-6 max-w-3xl text-slate-600">
        This helper does not save data. It creates a JSON object for manual maintenance.
      </p>
      <AdminPuzzleForm />
    </>
  );
}
