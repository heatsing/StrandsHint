import type { Difficulty } from "@prisma/client";

const styles: Record<Difficulty, string> = {
  EASY: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  MEDIUM: "bg-amber-50 text-amber-700 ring-amber-200",
  HARD: "bg-rose-50 text-rose-700 ring-rose-200",
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${styles[difficulty]}`}>
      {difficulty.toLowerCase()}
    </span>
  );
}
