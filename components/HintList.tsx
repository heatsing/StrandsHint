import { RevealBox } from "./RevealBox";

type Props = {
  hints: string[];
};

export function HintList({ hints }: Props) {
  return (
    <div className="space-y-3">
      {hints.map((hint, index) => (
        <RevealBox key={`${index}-${hint}`} title={`Hint ${index + 1}`} buttonLabel="Reveal hint">
          <p className="text-stone-700">{hint}</p>
        </RevealBox>
      ))}
    </div>
  );
}
