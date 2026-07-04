import { AdminPuzzleForm } from "@/components/AdminPuzzleForm";
import { requireAdmin } from "@/lib/auth";

export default function NewPuzzlePage() {
  requireAdmin();
  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-slate-950">New Strands content</h1>
      <AdminPuzzleForm />
    </>
  );
}
