import type { GameHintsBlock } from "@/lib/daily-types";
import { GameSectionCard } from "./GameSectionCard";

export function MiniSection({ data }: { data: GameHintsBlock }) {
  return <GameSectionCard defaultTitle="Mini" data={data} />;
}
