import type { GameHintsBlock } from "@/lib/daily-types";
import { GameSectionCard } from "./GameSectionCard";

export function PipsSection({ data }: { data: GameHintsBlock }) {
  return <GameSectionCard defaultTitle="Pips" data={data} />;
}
