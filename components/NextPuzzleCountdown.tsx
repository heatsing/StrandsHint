"use client";

import { useEffect, useState } from "react";

function getNextMidnightEastern(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const lookup = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  const year = Number(lookup.year);
  const month = Number(lookup.month);
  const day = Number(lookup.day);
  const hour = Number(lookup.hour) % 24;
  const minute = Number(lookup.minute);
  const second = Number(lookup.second);

  const asUtcGuess = Date.UTC(year, month - 1, day, hour, minute, second);
  const offsetMs = asUtcGuess - now.getTime();
  const nextLocalMidnight = Date.UTC(year, month - 1, day + 1, 0, 0, 0);
  return new Date(nextLocalMidnight - offsetMs);
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function NextPuzzleCountdown() {
  const [remaining, setRemaining] = useState({ hours: "--", minutes: "--", seconds: "--" });

  useEffect(() => {
    function tick() {
      const target = getNextMidnightEastern();
      const diff = Math.max(0, target.getTime() - Date.now());
      const hours = Math.floor(diff / 3_600_000);
      const minutes = Math.floor((diff % 3_600_000) / 60_000);
      const seconds = Math.floor((diff % 60_000) / 1_000);
      setRemaining({
        hours: pad(hours),
        minutes: pad(minutes),
        seconds: pad(seconds),
      });
    }

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] px-6 py-8 text-center shadow-sm">
      <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#315C4C]">Next Strands in</p>
      <div className="mt-5 flex items-end justify-center gap-4 sm:gap-8">
        {[
          ["Hours", remaining.hours],
          ["Minutes", remaining.minutes],
          ["Seconds", remaining.seconds],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-4xl font-black tabular-nums tracking-tight text-[#20201E] sm:text-5xl">{value}</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#68645E]">{label}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 text-sm leading-6 text-[#68645E]">
        Countdown targets midnight Eastern Time, when many Strands solvers look for the next board.
      </p>
    </section>
  );
}
