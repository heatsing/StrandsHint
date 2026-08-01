"use client";

import { useState } from "react";

export function CopyButton({ text, label = "Copy results" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-lg bg-[#315C4C] px-4 py-2 text-sm font-bold text-white hover:bg-[#274B3E] focus-visible:ring-4 focus-visible:ring-[#315C4C]/30"
    >
      {copied ? "Copied" : label}
    </button>
  );
}
