"use client";

import { useMemo, useState } from "react";

export function AdminPuzzleForm() {
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

  const output = useMemo(() => {
    const words = form.words.split(/\r?\n/).map((word) => word.trim().toUpperCase()).filter(Boolean);
    const wordHints = form.wordHints.split(/\r?\n/).map((hint) => hint.trim()).filter(Boolean);
    return JSON.stringify(
      {
        id: `${form.date}-${form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
        date: form.date,
        title: form.title,
        themeHint: form.themeHint,
        difficulty: form.difficulty,
        spangram: form.spangram.toUpperCase(),
        spangramHint1: form.spangramHint1,
        spangramHint2: form.spangramHint2,
        spangramDirection: form.spangramDirection,
        words,
        wordHints,
        spoilerLevelContent: "Manual editorial note goes here.",
        seoTitle: form.seoTitle,
        seoDescription: form.seoDescription,
        slug: `${form.date}-${form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
        published: true,
      },
      null,
      2,
    );
  }, [form]);

  function update(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5">
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
        <h2 className="font-semibold">Generated JSON</h2>
        <p className="mt-2 text-sm text-slate-300">Paste this object into <code>data/puzzles.json</code>, then commit and deploy.</p>
        <pre className="mt-4 max-h-[36rem] overflow-auto rounded-md bg-black/40 p-4 text-xs">{output}</pre>
      </div>
    </div>
  );
}
