type Props = {
  answers: string[];
};

export function AnswerList({ answers }: Props) {
  return (
    <ul className="flex flex-wrap gap-2">
      {answers.map((answer) => (
        <li
          key={answer}
          className="rounded-md border border-stone-200 bg-stone-50 px-3 py-1.5 font-mono text-sm font-semibold uppercase tracking-wide text-stone-900"
        >
          {answer}
        </li>
      ))}
    </ul>
  );
}
