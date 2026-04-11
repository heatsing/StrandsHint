import type { GameHintsBlock } from "@/lib/daily-types";
import { GameSectionCard } from "./GameSectionCard";

export function SportsSection({ data }: { data: GameHintsBlock }) {
  return <GameSectionCard defaultTitle="Sports" data={data} />;
}
