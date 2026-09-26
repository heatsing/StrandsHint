import Link from "next/link";
import { HintStack, RevealSummary } from "@/components/daily-answers/DailyAnswerShell";
import type { DailyAnswerEntry } from "@/lib/daily-answers";

function scoreWord(word: string, hiveLetters: string[]) {
  const unique = new Set(word.split(""));
  const pangram = hiveLetters.every((letter) => unique.has(letter));
  const score = pangram ? Math.max(7, word.length) + 7 : word.length === 4 ? 1 : word.length;
  return { score, pangram };
}

function HexCell({
  letter,
  center = false,
  size = 64,
}: {
  letter: string;
  center?: boolean;
  size?: number;
}) {
  return (
    <div
      className={[
        "relative grid place-items-center font-black uppercase tracking-wide text-[#20201E]",
        center ? "bg-[#F7D560] text-[1.35rem]" : "bg-[#EDE6DC] text-[1.15rem]",
      ].join(" ")}
      style={{
        width: size,
        height: size * 0.92,
        clipPath: "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)",
      }}
      aria-label={center ? `Center letter ${letter}` : `Letter ${letter}`}
    >
      {letter}
    </div>
  );
}

function BeeHive({ center, outer }: { center: string; outer: string[] }) {
  const letters = [...outer.slice(0, 6)];
  while (letters.length < 6) letters.push("?");

  // Flat-top honeycomb around the required center letter.
  const slots = [
    { letter: letters[0], x: 38, y: 0 },
    { letter: letters[1], x: 98, y: 0 },
    { letter: letters[2], x: 128, y: 52 },
    { letter: letters[3], x: 98, y: 104 },
    { letter: letters[4], x: 38, y: 104 },
    { letter: letters[5], x: 8, y: 52 },
  ];

  return (
    <div className="relative mx-auto h-[180px] w-[200px]" role="img" aria-label={`Spelling Bee hive centered on ${center}`}>
      {slots.map((slot) => (
        <div key={`${slot.letter}-${slot.x}-${slot.y}`} className="absolute" style={{ left: slot.x, top: slot.y }}>
          <HexCell letter={slot.letter} size={64} />
        </div>
      ))}
      <div className="absolute left-[68px] top-[52px]">
        <HexCell letter={center} center size={64} />
      </div>
    </div>
  );
}

export function SpellingBeeAnswerBody({ entry }: { entry: DailyAnswerEntry }) {
  const center = (entry.centerLetter || "?").toUpperCase();
  const outer = (entry.outerLetters || []).map((letter) => letter.toUpperCase()).slice(0, 6);
  const hive = [center, ...outer];
  const lengths = Object.keys(entry.wordsByLength || {})
    .map(Number)
    .sort((a, b) => a - b)
    .map(String);

  const flatWords = lengths.flatMap((length) =>
    (entry.wordsByLength?.[length] || []).map((word) => {
      const upper = word.toUpperCase();
      return { word: upper, length: Number(length), ...scoreWord(upper, hive) };
    }),
  );

  const maxScore = flatWords.reduce((sum, item) => sum + item.score, 0);
  const pangramWords = [
    ...new Set([...(entry.pangrams || []).map((word) => word.toUpperCase()), ...flatWords.filter((item) => item.pangram).map((item) => item.word)]),
  ];
  const geniusScore = entry.geniusScore || Math.max(1, Math.round(maxScore * 0.7));
  const pointsToGenius = Math.max(0, geniusScore);

  const startsWith = flatWords.reduce<Record<string, number>>((acc, item) => {
    const key = item.word[0] || "?";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <section className="rounded-3xl border border-[#E5DED3] bg-[#FFFDF9] px-5 py-7 sm:px-6">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9A6B24]">Today&apos;s hive</p>
          <p className="mt-2 text-sm leading-6 text-[#68645E]">
            Every word must use the yellow center letter. Letters can be reused.
          </p>
        </div>

        <div className="mt-6">
          <BeeHive center={center} outer={outer} />
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            [String(flatWords.length), "Words"],
            [String(maxScore), "Max pts"],
            [String(pointsToGenius), "Genius"],
            [String(pangramWords.length), "Pangrams"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl bg-[#F7F3EC] px-3 py-4 text-center">
              <p className="text-2xl font-black tabular-nums text-[#20201E]">{value}</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#68645E]">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-[#FFF8E8] px-4 py-3 text-sm leading-6 text-[#68645E]">
          <p>
            <span className="font-bold text-[#20201E]">Scoring:</span> 4-letter words = 1 pt. Longer words = 1 pt per
            letter. Pangrams add +7.
          </p>
        </div>
      </section>

      <HintStack hints={entry.hints} />

      <section className="rounded-3xl border border-[#E5DED3] bg-[#FFFDF9] px-6 py-6 text-center">
        <h2 className="text-lg font-black text-[#20201E]">Pangram</h2>
        <p className="mt-2 text-sm leading-6 text-[#68645E]">Uses every letter in the hive at least once.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {hive.map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              className={[
                "grid h-10 w-10 place-items-center rounded-full text-sm font-black",
                letter === center ? "bg-[#F7D560] text-[#20201E]" : "bg-[#EDE6DC] text-[#20201E]",
              ].join(" ")}
            >
              {letter}
            </span>
          ))}
        </div>
        <details className="group mt-5">
          <RevealSummary label="Show pangram" tone="soft" />
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {pangramWords.map((word) => (
              <span key={word} className="rounded-full bg-[#F7D560] px-4 py-2 text-sm font-black uppercase text-[#20201E]">
                {word}
              </span>
            ))}
          </div>
        </details>
      </section>

      <section className="rounded-3xl border border-[#E5DED3] bg-[#FFFDF9] px-6 py-6">
        <h2 className="text-lg font-black text-[#20201E]">Answers by length</h2>
        <p className="mt-2 text-sm leading-6 text-[#68645E]">
          Open one length at a time — the same way most Spelling Bee solvers unlock help.
        </p>
        <div className="mt-5 space-y-3">
          {lengths.map((length) => {
            const words = entry.wordsByLength?.[length] || [];
            return (
              <details key={length} className="group rounded-2xl border border-[#E5DED3] bg-white px-4 py-3">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-[#20201E]">
                  <span>
                    {length}-letter words
                    <span className="ml-2 font-semibold text-[#68645E]">({words.length})</span>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#9A6B24] group-open:hidden">
                    Reveal
                  </span>
                  <span className="hidden text-xs font-bold uppercase tracking-[0.14em] text-[#68645E] group-open:inline">
                    Hide
                  </span>
                </summary>
                <div className="mt-3 flex flex-wrap gap-2">
                  {words.map((word) => {
                    const meta = scoreWord(word.toUpperCase(), hive);
                    return (
                      <span
                        key={word}
                        className={[
                          "rounded-full px-3 py-1.5 text-xs font-black uppercase",
                          meta.pangram ? "bg-[#F7D560] text-[#20201E]" : "bg-[#E8F2C8] text-[#3F5A1C]",
                        ].join(" ")}
                      >
                        {word}
                      </span>
                    );
                  })}
                </div>
              </details>
            );
          })}
        </div>
      </section>

      {Object.keys(startsWith).length ? (
        <section className="rounded-3xl border border-[#E5DED3] bg-[#FFFDF9] px-6 py-6">
          <h2 className="text-lg font-black text-[#20201E]">Starts-with hints</h2>
          <p className="mt-2 text-sm leading-6 text-[#68645E]">
            How many answers begin with each letter — useful before you open the full lists.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {Object.entries(startsWith)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([letter, count]) => (
                <div key={letter} className="rounded-2xl bg-[#F7F3EC] px-3 py-3 text-center">
                  <p className="text-lg font-black text-[#20201E]">{letter}</p>
                  <p className="text-xs font-semibold text-[#68645E]">
                    {count} word{count === 1 ? "" : "s"}
                  </p>
                </div>
              ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-3xl border border-[#E5DED3] bg-[#FFFDF9] px-6 py-6">
        <h2 className="text-lg font-black text-[#20201E]">How Spelling Bee works</h2>
        <ul className="mt-3 space-y-2 text-sm leading-7 text-[#68645E]">
          <li>Make words of 4+ letters from the hive.</li>
          <li>Every word must include the yellow center letter.</li>
          <li>Letters may be used more than once.</li>
          <li>A pangram uses all 7 letters and scores bonus points.</li>
        </ul>
        <Link
          prefetch={false}
          href="/spelling-bee-solver/"
          className="mt-5 inline-flex rounded-2xl bg-[#315C4C] px-4 py-3 text-sm font-bold text-white hover:bg-[#274B3E]"
        >
          Open Spelling Bee solver
        </Link>
        {entry.answerNote ? <p className="mt-4 text-sm leading-7 text-[#68645E]">{entry.answerNote}</p> : null}
      </section>
    </>
  );
}
