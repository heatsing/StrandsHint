import type { GameHintsBlock } from "@/lib/daily-types";
import { GameSectionCard } from "./GameSectionCard";

export function WordleSection({ data }: { data: GameHintsBlock }) {
  return <GameSectionCard defaultTitle="Wordle" data={data} />;
}
