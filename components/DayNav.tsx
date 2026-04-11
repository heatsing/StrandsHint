import Link from "next/link";

type Props = {
  prevDate?: string;
  nextDate?: string;
  yesterdayHref?: string;
  tomorrowHref?: string;
};

function OptionalLink({
  href,
  label,
}: {
  href?: string;
  label: string;
}) {
  if (!href) {
    return (
      <span className="rounded-lg border border-transparent px-3 py-1.5 text-ink-300">{label}</span>
    );
  }
  return (
    <Link
      href={href}
      className="rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-ink-700 hover:border-ink-400 hover:bg-ink-50"
    >
      {label}
    </Link>
  );
}

export function DayNav({ prevDate, nextDate, yesterdayHref, tomorrowHref }: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2 text-sm">
        <OptionalLink href={yesterdayHref} label="Yesterday" />
        <OptionalLink href={tomorrowHref} label="Tomorrow" />
      </div>
      <div className="flex flex-wrap gap-2 text-sm">
        {prevDate ? (
          <Link
            href={`/${prevDate}/`}
            className="rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-ink-700 hover:border-ink-400 hover:bg-ink-50"
          >
            ← Previous puzzle
          </Link>
        ) : (
          <span className="rounded-lg border border-transparent px-3 py-1.5 text-ink-300">
            ← Previous puzzle
          </span>
        )}
        {nextDate ? (
          <Link
            href={`/${nextDate}/`}
            className="rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-ink-700 hover:border-ink-400 hover:bg-ink-50"
          >
            Next puzzle →
          </Link>
        ) : (
          <span className="rounded-lg border border-transparent px-3 py-1.5 text-ink-300">
            Next puzzle →
          </span>
        )}
      </div>
    </div>
  );
}
