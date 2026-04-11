import type { GameHintsBlock } from "@/lib/daily-types";
import { Spoiler } from "@/components/Spoiler";

type Props = {
  defaultTitle: string;
  data: GameHintsBlock;
};

export function GameSectionCard({ defaultTitle, data }: Props) {
  const heading = data.title?.trim() || defaultTitle;

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-xl font-semibold tracking-tight text-ink-900">{heading}</h2>
      <div className="mt-4 space-y-3">
        {data.hints.length === 0 ? (
          <p className="text-sm text-ink-500">No hints for this game yet.</p>
        ) : (
          <ol className="list-decimal space-y-2 pl-5 text-ink-700 marker:text-ink-400">
            {data.hints.map((hint, i) => (
              <li key={i} className="leading-relaxed">
                {hint}
              </li>
            ))}
          </ol>
        )}
      </div>
      <Spoiler>
        <p className="font-mono text-lg font-semibold tracking-wide text-ink-900">{data.answer}</p>
      </Spoiler>
    </div>
  );
}
