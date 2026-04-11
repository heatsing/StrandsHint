import type { GameHintsBlock } from "@/lib/daily-types";
import { GameSectionCard } from "./GameSectionCard";

export function StrandsSection({ data }: { data: GameHintsBlock }) {
  return <GameSectionCard defaultTitle="Strands" data={data} />;
}
