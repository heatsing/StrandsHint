"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Props = {
  contentDates: string[];
  todayIso: string;
  initialMonth?: number;
  initialYear?: number;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toIso(y: number, m: number, day: number) {
  return `${y}-${pad(m + 1)}-${pad(day)}`;
}

export function MonthCalendar({
  contentDates,
  todayIso,
  initialMonth,
  initialYear,
}: Props) {
  const now = new Date();
  const [cursor, setCursor] = useState(() => {
    const y = initialYear ?? now.getFullYear();
    const m = initialMonth ?? now.getMonth();
    return new Date(y, m, 1);
  });

  const contentSet = useMemo(() => new Set(contentDates), [contentDates]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const label = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(cursor);

  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const grid = useMemo(() => {
    const rows: { day: number; iso: string; inMonth: boolean }[] = [];
    const startPad = firstDow;
    const prevLast = new Date(year, month, 0).getDate();
    for (let i = 0; i < startPad; i++) {
      const day = prevLast - startPad + i + 1;
      const dt = new Date(year, month - 1, day);
      rows.push({
        day,
        iso: toIso(dt.getFullYear(), dt.getMonth(), dt.getDate()),
        inMonth: false,
      });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      rows.push({ day: d, iso: toIso(year, month, d), inMonth: true });
    }
    const rem = rows.length % 7;
    const padCount = rem === 0 ? 0 : 7 - rem;
    for (let i = 1; i <= padCount; i++) {
      const dt = new Date(year, month + 1, i);
      rows.push({
        day: i,
        iso: toIso(dt.getFullYear(), dt.getMonth(), dt.getDate()),
        inMonth: false,
      });
    }
    return rows;
  }, [year, month, firstDow, daysInMonth]);

  function shift(delta: number) {
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => shift(-1)}
          className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-700 hover:bg-ink-50"
        >
          ←
        </button>
        <h2 className="text-lg font-semibold text-ink-900">{label}</h2>
        <button
          type="button"
          onClick={() => shift(1)}
          className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-700 hover:bg-ink-50"
        >
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-ink-500 sm:gap-2">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-2">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {grid.map((cell) => {
          const has = contentSet.has(cell.iso);
          const isToday = cell.iso === todayIso;
          const base =
            "flex min-h-[2.75rem] items-center justify-center rounded-lg text-sm transition-colors sm:min-h-[3rem]";
          const muted = !cell.inMonth ? " text-ink-300" : "";
          const todayRing = isToday ? " ring-2 ring-ink-800 ring-offset-2" : "";

          if (has) {
            return (
              <Link
                key={`${cell.iso}-${cell.day}`}
                href={`/${cell.iso}`}
                className={`${base} border border-ink-200 bg-white font-medium text-ink-900 hover:border-ink-500 hover:bg-ink-50${muted}${todayRing}`}
              >
                {cell.day}
              </Link>
            );
          }

          return (
            <div
              key={`${cell.iso}-${cell.day}`}
              className={`${base} border border-transparent bg-ink-50/50 text-ink-400${muted}${todayRing}`}
              title={cell.inMonth ? "No puzzle for this day yet" : undefined}
            >
              {cell.day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
