"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function SpoilerReveal({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
      >
        {open ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        {open ? "Hide" : label}
      </button>
      {open ? <div className="mt-4 text-slate-800">{children}</div> : null}
    </div>
  );
}
