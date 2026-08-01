import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DailyHintPageContent } from "@/components/hints/DailyHintPageContent";
import { dailyHintGames, getLatestDailyHint } from "@/lib/daily-hints";

type Props = { params: { game: string } };

export function generateStaticParams() {
  return dailyHintGames.map((item) => ({ game: item.game }));
}

export function generateMetadata({ params }: Props): Metadata {
  const game = dailyHintGames.find((item) => item.game === params.game);
  if (!game) return {};
  return {
    title: `${game.name} Hints Today - Progressive Daily Clues`,
    description: `Get spoiler-safe ${game.name} hints with progressive clues, hidden answers, and manually maintained daily notes.`,
    alternates: { canonical: `/hints/${params.game}` },
  };
}

export default function LatestHintPage({ params }: Props) {
  const game = dailyHintGames.find((item) => item.game === params.game);
  if (!game) notFound();
  const puzzle = getLatestDailyHint(params.game);
  return <DailyHintPageContent gameName={game.name} canonicalPath={`/hints/${params.game}`} puzzle={puzzle} />;
}
