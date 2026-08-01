"use client";

import { useMemo, useState } from "react";

const pageOptions = [
  ["strands-hints", "Strands hints"],
  ["wordle-hints", "Wordle hints"],
  ["connections-hints", "Connections hints"],
];

export function AdminDailyContentForm() {
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    date: "",
    slug: "strands-hints",
    headline: "",
    summary: "",
    progressiveHints: "",
    answerLabel: "",
    answerExplanation: "",
    relatedPuzzlePages: "Today's Strands Answer|/todays-strands-answer|Reveal today's Strands answer in layers.",
  });

  const normalized = useMemo(() => {
    const progressiveHints = form.progressiveHints
      .split(/\r?\n/)
      .map((hint) => hint.trim())
      .filter(Boolean);

    const relatedPuzzlePages = form.relatedPuzzlePages
      .split(/\r?\n/)
      .map((line) => line.split("|").map((part) => part.trim()))
      .filter(([label, href]) => label && href)
      .map(([label, href, description]) => ({
        label,
        href,
        description: description || `Open ${label}.`,
      }));

    return {
      id: [form.date, form.slug].filter(Boolean).join("-"),
      progressiveHints,
      relatedPuzzlePages,
    };
  }, [form]);

  const output = useMemo(
    () =>
      JSON.stringify(
        {
          id: normalized.id,
          date: form.date,
          slug: form.slug,
          published: true,
          headline: form.headline,
          summary: form.summary,
          progressiveHints: normalized.progressiveHints,
          answerLabel: form.answerLabel,
          answerExplanation: form.answerExplanation,
          relatedPuzzlePages: normalized.relatedPuzzlePages,
        },
        null,
        2,
      ),
    [form, normalized],
  );

  const errors = [
    form.date && !/^\d{4}-\d{2}-\d{2}$/.test(form.date) ? "Date must use YYYY-MM-DD." : "",
    !normalized.id ? "Choose a page and enter a date to generate an id." : "",
    normalized.progressiveHints.length < 3 ? "Add at least three progressive hints, one per line." : "",
    normalized.relatedPuzzlePages.length < 2 ? "Add at least two related pages as Label|href|description." : "",
  ].filter(Boolean);

  function update(name: string, value: string) {
    setCopied(false);
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form className="grid gap-4 rounded-2xl border border-[#12172B]/10 bg-[#F3ECDD] p-5 text-[#12172B]">
        <div className="rounded-xl bg-white/70 p-3 text-sm">
          Entry id: <span className="font-mono font-semibold">{normalized.id || "not-ready"}</span>
        </div>
        {errors.length > 0 ? (
          <div className="rounded-xl border border-[#E8A93D] bg-[#E8A93D]/20 p-3 text-sm leading-6" role="alert">
            {errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        ) : null}

        <label className="grid gap-2 text-sm font-semibold">
          date
          <input value={form.date} onChange={(event) => update("date", event.target.value)} className="rounded-lg border border-[#12172B]/20 px-3 py-2" placeholder="2026-08-01" />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          page
          <select value={form.slug} onChange={(event) => update("slug", event.target.value)} className="rounded-lg border border-[#12172B]/20 px-3 py-2">
            {pageOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        {(["headline", "summary", "answerLabel", "answerExplanation"] as const).map((name) => (
          <label key={name} className="grid gap-2 text-sm font-semibold">
            {name}
            {name === "summary" || name === "answerExplanation" ? (
              <textarea value={form[name]} onChange={(event) => update(name, event.target.value)} rows={4} className="rounded-lg border border-[#12172B]/20 px-3 py-2" />
            ) : (
              <input value={form[name]} onChange={(event) => update(name, event.target.value)} className="rounded-lg border border-[#12172B]/20 px-3 py-2" />
            )}
          </label>
        ))}
        <label className="grid gap-2 text-sm font-semibold">
          progressiveHints
          <textarea value={form.progressiveHints} onChange={(event) => update("progressiveHints", event.target.value)} rows={5} className="rounded-lg border border-[#12172B]/20 px-3 py-2" placeholder="One hint per line" />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          relatedPuzzlePages
          <textarea value={form.relatedPuzzlePages} onChange={(event) => update("relatedPuzzlePages", event.target.value)} rows={5} className="rounded-lg border border-[#12172B]/20 px-3 py-2" placeholder="Label|/path|Short description" />
        </label>
      </form>

      <div className="rounded-2xl border border-[#F3ECDD]/15 bg-[#1B2138] p-5 text-[#F6F1E6]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-2xl font-black">Generated daily JSON</h2>
          <button type="button" onClick={copyOutput} className="rounded-full bg-[#E8A93D] px-4 py-2 text-sm font-bold text-[#12172B] hover:bg-[#f0bd63]">
            {copied ? "Copied" : "Copy JSON"}
          </button>
        </div>
        <p className="mt-3 text-sm text-[#F6F1E6]/70">
          Paste this object into <code>data/daily-content.json</code>, then commit and deploy.
        </p>
        <pre className="mt-4 max-h-[42rem] overflow-auto rounded-xl bg-black/35 p-4 text-xs">{output}</pre>
      </div>
    </div>
  );
}
