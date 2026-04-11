"use client";

import type { ComponentType } from "react";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import type { DailyHintsJson, GameHintsBlock, GameId } from "@/lib/daily-types";
import { GAME_ORDER } from "@/lib/daily-types";
import { Tabs } from "@/components/Tabs";
import { ConnectionsSection } from "@/components/sections/ConnectionsSection";
import { CrosswordSection } from "@/components/sections/CrosswordSection";
import { MiniSection } from "@/components/sections/MiniSection";
import { PipsSection } from "@/components/sections/PipsSection";
import { SportsSection } from "@/components/sections/SportsSection";
import { StrandsSection } from "@/components/sections/StrandsSection";
import { WordleSection } from "@/components/sections/WordleSection";

const SECTIONS: Record<GameId, ComponentType<{ data: GameHintsBlock }>> = {
  wordle: WordleSection,
  strands: StrandsSection,
  pips: PipsSection,
  connections: ConnectionsSection,
  sports: SportsSection,
  crossword: CrosswordSection,
  mini: MiniSection,
};

function isGameId(s: string): s is GameId {
  return (GAME_ORDER as readonly { id: GameId }[]).some((g) => g.id === s);
}

export function DailyHintsTabs({ data }: { data: DailyHintsJson }) {
  const [active, setActive] = useState<GameId>("wordle");

  useLayoutEffect(() => {
    const h = window.location.hash.slice(1);
    if (h && isGameId(h)) setActive(h);
  }, []);

  const onSelect = useCallback((id: GameId) => {
    setActive(id);
    window.history.replaceState(null, "", `#${id}`);
  }, []);

  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.slice(1);
      if (h && isGameId(h)) setActive(h);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <div className="space-y-8">
      <Tabs activeId={active} onSelect={onSelect} />
      {GAME_ORDER.map(({ id }) => {
        const Cmp = SECTIONS[id];
        return (
          <section
            key={id}
            id={id}
            role="tabpanel"
            aria-labelledby={`tab-${id}`}
            hidden={active !== id}
            className="scroll-mt-28 outline-none"
            tabIndex={active === id ? 0 : -1}
          >
            <Cmp data={data.games[id]} />
          </section>
        );
      })}
    </div>
  );
}
