"use client";

import type { GameId } from "@/lib/daily-types";
import { GAME_ORDER } from "@/lib/daily-types";

type Props = {
  activeId: GameId;
  onSelect: (id: GameId) => void;
};

export function Tabs({ activeId, onSelect }: Props) {
  return (
    <div
      role="tablist"
      aria-label="NYT games"
      className="flex flex-wrap gap-2 sm:gap-2.5"
    >
      {GAME_ORDER.map(({ id, label }) => {
        const selected = activeId === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            id={`tab-${id}`}
            aria-selected={selected}
            aria-controls={`panel-${id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onSelect(id)}
            className={`rounded-full px-4 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-400 focus-visible:ring-offset-2 ${
              selected
                ? "bg-ink-900 text-white shadow-sm"
                : "bg-white text-ink-700 ring-1 ring-ink-200 hover:bg-ink-50 hover:ring-ink-300"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
