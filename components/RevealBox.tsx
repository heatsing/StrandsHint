"use client";

import { useId, useState } from "react";

type Props = {
  title: string;
  children: React.ReactNode;
  buttonLabel?: string;
};

export function RevealBox({ title, children, buttonLabel = "Reveal" }: Props) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-stone-950">{title}</h2>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((value) => !value)}
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
        >
          {open ? "Hide" : buttonLabel}
        </button>
      </div>
      <div id={id} hidden={!open} className={open ? "mt-4 border-t border-stone-100 pt-4" : ""}>
        {open ? children : null}
      </div>
    </section>
  );
}
