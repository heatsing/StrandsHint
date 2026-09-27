import { HintStack, RevealSummary } from "@/components/daily-answers/DailyAnswerShell";
import type { ClueAnswer, DailyAnswerEntry } from "@/lib/daily-answers";

function CrosswordGrid({ rows, compact }: { rows: string[]; compact?: boolean }) {
  const cell = compact ? "h-7 w-7 text-[10px] sm:h-8 sm:w-8 sm:text-xs" : "h-5 w-5 text-[8px] sm:h-6 sm:w-6 sm:text-[10px]";

  return (
    <div className="mx-auto inline-block rounded-md border-2 border-[#20201E] bg-[#20201E] p-[2px] shadow-sm">
      <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${rows[0]?.length || 1}, minmax(0, 1fr))` }}>
        {rows.flatMap((row, rowIndex) =>
          row.split("").map((char, colIndex) => {
            const black = char === "#";
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={[
                  "grid place-items-center font-black uppercase",
                  cell,
                  black ? "bg-[#20201E]" : "bg-white text-[#20201E]",
                ].join(" ")}
              >
                {black || char === "." ? "" : char}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}

function buildSchematicGrid(across: ClueAnswer[], down: ClueAnswer[], compact: boolean) {
  if (compact) {
    // Simple 5x5 mini-style frame for demo when no explicit grid is provided.
    return [".....", ".#.#.", ".....", ".#.#.", "....."];
  }
  // 15x15 crossword silhouette for full crossword pages without a stored grid.
  const pattern = [
    "....#....#.....",
    "....#....#.....",
    "....#....#.....",
    "...............",
    "###....###.....",
    "....#....#.....",
    "....#....#.....",
    "...............",
    "....#....#.....",
    "....#....#.....",
    ".....###....###",
    "...............",
    ".....#....#....",
    ".....#....#....",
    ".....#....#....",
  ];
  void across;
  void down;
  return pattern;
}

function ClueColumn({ title, items }: { title: string; items: ClueAnswer[] }) {
  return (
    <div>
      <h3 className="border-b border-[#E5DED3] pb-2 text-sm font-black uppercase tracking-[0.14em] text-[#315C4C]">
        {title}
      </h3>
      <div className="mt-3 divide-y divide-[#EFE8DE]">
        {items.map((item) => (
          <details key={`${title}-${item.number}-${item.clue}`} className="group py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
              <span className="min-w-0 text-left text-sm leading-6 text-[#20201E]">
                <span className="mr-2 font-black text-[#315C4C]">{item.number}.</span>
                {item.clue}
              </span>
              <span className="shrink-0 rounded-full bg-[#20201E] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white group-open:bg-[#315C4C]">
                <span className="group-open:hidden">Reveal</span>
                <span className="hidden group-open:inline">Hide</span>
              </span>
            </summary>
            {item.hint ? <p className="mt-2 text-sm leading-6 text-[#68645E]">{item.hint}</p> : null}
            <p className="mt-2 font-mono text-base font-black uppercase tracking-[0.16em] text-[#20201E]">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

export function CrosswordAnswerBody({
  entry,
  compact = false,
}: {
  entry: DailyAnswerEntry;
  compact?: boolean;
}) {
  const across = entry.across || [];
  const down = entry.down || [];
  const grid = entry.grid?.length ? entry.grid : buildSchematicGrid(across, down, compact);

  return (
    <>
      <section className="rounded-3xl border border-[#E5DED3] bg-[#FFFDF9] px-5 py-7 text-center sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#315C4C]">
          {compact ? "Mini grid" : "Crossword grid"}
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#68645E]">
          {compact
            ? "Solve the Mini with Across/Down reveals, or open the full answer list when you are stuck."
            : "Use one clue at a time. The grid silhouette keeps the NYT crossword feel without dumping every letter first."}
        </p>
        <div className="mt-6 overflow-x-auto pb-2">
          <CrosswordGrid rows={grid} compact={compact} />
        </div>
        <details className="group mt-6">
          <RevealSummary label="Reveal full answers" tone="dark" />
          <div className="mt-5 grid gap-6 text-left sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#315C4C]">Across</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-[#68645E]">
                {across.map((item) => (
                  <li key={`full-a-${item.number}`}>
                    {item.number}. {item.clue} —{" "}
                    <span className="font-mono font-black uppercase text-[#20201E]">{item.answer}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#315C4C]">Down</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-[#68645E]">
                {down.map((item) => (
                  <li key={`full-d-${item.number}`}>
                    {item.number}. {item.clue} —{" "}
                    <span className="font-mono font-black uppercase text-[#20201E]">{item.answer}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </details>
      </section>

      <HintStack hints={entry.hints} />

      <section className="rounded-3xl border border-[#E5DED3] bg-[#FFFDF9] px-5 py-6 sm:px-6">
        <h2 className="text-lg font-black text-[#20201E]">Reveal one clue at a time</h2>
        <p className="mt-2 text-sm leading-6 text-[#68645E]">
          Keep solving with crossings. Only tap Reveal on the clue that is blocking you.
        </p>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <ClueColumn title="Across" items={across} />
          <ClueColumn title="Down" items={down} />
        </div>
      </section>

      <section className="rounded-3xl border border-[#E5DED3] bg-[#FFFDF9] px-5 py-6 sm:px-6">
        <h2 className="text-lg font-black text-[#20201E]">
          Full {compact ? "Mini" : "NYT Crossword"} answers
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#68645E]">
          Plain list for quick scanning after you finish, or if you only need to confirm one entry.
        </p>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#315C4C]">Across</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-[#68645E]">
              {across.map((item) => (
                <li key={`scan-a-${item.number}`}>
                  {item.number}. {item.clue}:{" "}
                  <span className="font-mono font-black uppercase text-[#20201E]">{item.answer}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#315C4C]">Down</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-[#68645E]">
              {down.map((item) => (
                <li key={`scan-d-${item.number}`}>
                  {item.number}. {item.clue}:{" "}
                  <span className="font-mono font-black uppercase text-[#20201E]">{item.answer}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {entry.answerNote ? <p className="mt-5 text-sm leading-7 text-[#68645E]">{entry.answerNote}</p> : null}
      </section>
    </>
  );
}
