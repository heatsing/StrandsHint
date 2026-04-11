import type { GameHintsBlock } from "@/lib/daily-types";
import { GameSectionCard } from "./GameSectionCard";

export function ConnectionsSection({ data }: { data: GameHintsBlock }) {
  return <GameSectionCard defaultTitle="Connections" data={data} />;
}
