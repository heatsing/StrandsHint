"use client";

import { useId, useState } from "react";

type Props = {
  children: React.ReactNode;
  /** Button label when collapsed */
  label?: string;
};

export function Spoiler({ children, label = "Reveal answer" }: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="mt-5 rounded-2xl border border-amber-200/80 bg-amber-50/60 p-4 shadow-sm">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 text-left text-sm font-medium text-ink-900 shadow-sm ring-1 ring-ink-200/80 transition hover:ring-ink-300"
      >
        <span>{open ? "Hide answer" : label}</span>
        <span className="text-ink-400 tabular-nums">{open ? "−" : "+"}</span>
      </button>
      <div
        id={panelId}
        role="region"
        hidden={!open}
        className={open ? "mt-4 border-t border-amber-200/80 pt-4 text-ink-900" : undefined}
      >
        {open ? children : null}
      </div>
    </div>
  );
}
