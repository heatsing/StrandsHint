import type { GameHintsBlock } from "@/lib/daily-types";
import { GameSectionCard } from "./GameSectionCard";

export function CrosswordSection({ data }: { data: GameHintsBlock }) {
  return <GameSectionCard defaultTitle="Crossword" data={data} />;
}
