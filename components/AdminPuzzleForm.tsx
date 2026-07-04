"use client";

import { useMemo, useState } from "react";

export function AdminPuzzleForm() {
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    date: "",
    title: "",
    themeHint: "",
    difficulty: "MEDIUM",
    spangram: "",
    spangramHint1: "",
    spangramHint2: "",
    spangramDirection: "left to right",
    words: "",
    wordHints: "",
    seoTitle: "",
    seoDescription: "",
  });

  const normalized = useMemo(() => {
    const words = form.words.split(/\r?\n/).map((word) => word.trim().toUpperCase()).filter(Boolean);
    const wordHints = form.wordHints.split(/\r?\n/).map((hint) => hint.trim()).filter(Boolean);
    const titleSlug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const slug = [form.date, titleSlug].filter(Boolean).join("-");
    return { words, wordHints, slug };
  }, [form]);
  const output = useMemo(
    () =>
      JSON.stringify(
        {
          id: normalized.slug,
          date: form.date,
          title: form.title,
          themeHint: form.themeHint,
          difficulty: form.difficulty,
          spangram: form.spangram.toUpperCase(),
          spangramHint1: form.spangramHint1,
          spangramHint2: form.spangramHint2,
          spangramDirection: form.spangramDirection,
          words: normalized.words,
          wordHints: normalized.wordHints,
          spoilerLevelContent: "Manual editorial note goes here.",
          seoTitle: form.seoTitle,
          seoDescription: form.seoDescription,
          slug: normalized.slug,
          published: true,
        },
        null,
        2,
      ),
    [form, normalized],
  );
  const errors = [
    form.date && !/^\d{4}-\d{2}-\d{2}$/.test(form.date) ? "Date must use YYYY-MM-DD." : "",
    normalized.words.length !== normalized.wordHints.length ? "Words and word hints should have the same number of lines." : "",
    !normalized.slug ? "Add a date and title to generate a stable slug." : "",
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
      <form className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5">
        <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-600">
          Slug preview: <span className="font-mono font-semibold text-slate-950">{normalized.slug || "not-ready"}</span>
        </div>
        {errors.length > 0 ? (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900" role="alert">
            {errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        ) : null}
        {Object.entries(form).map(([name, value]) => (
          <label key={name} className="grid gap-2 text-sm font-medium text-slate-700">
            {name}
            {name === "words" || name === "wordHints" ? (
              <textarea value={value} onChange={(event) => update(name, event.target.value)} rows={5} className="rounded-md border border-slate-300 px-3 py-2" />
            ) : (
              <input value={value} onChange={(event) => update(name, event.target.value)} className="rounded-md border border-slate-300 px-3 py-2" />
            )}
          </label>
        ))}
      </form>
      <div className="rounded-lg border border-slate-200 bg-slate-950 p-5 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold">Generated JSON</h2>
          <button type="button" onClick={copyOutput} className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-200">
            {copied ? "Copied" : "Copy JSON"}
          </button>
        </div>
        <p className="mt-2 text-sm text-slate-300">Paste this object into <code>data/puzzles.json</code>, then commit and deploy.</p>
        <pre className="mt-4 max-h-[36rem] overflow-auto rounded-md bg-black/40 p-4 text-xs">{output}</pre>
      </div>
    </div>
  );
}
