import { notFound } from "next/navigation";
import { AdminPuzzleForm } from "@/components/AdminPuzzleForm";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

type Props = { params: { id: string } };

export default async function EditPuzzlePage({ params }: Props) {
  requireAdmin();
  const puzzle = await prisma.puzzle.findUnique({ where: { id: Number(params.id) } });
  if (!puzzle) notFound();
  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-slate-950">Edit Strands content</h1>
      <AdminPuzzleForm puzzle={puzzle} />
    </>
  );
}
