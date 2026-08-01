import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DailyHintPageContent } from "@/components/hints/DailyHintPageContent";
import { dailyHintGames, getDailyHint, getDailyHintSlugs, isDateString, todayInTimeZone } from "@/lib/daily-hints";

type Props = { params: { game: string; date: string } };

export function generateStaticParams() {
  return getDailyHintSlugs();
}

export function generateMetadata({ params }: Props): Metadata {
  const game = dailyHintGames.find((item) => item.game === params.game);
  if (!game || !isDateString(params.date) || params.date > todayInTimeZone()) return {};
  return {
    title: `${game.name} Hints for ${params.date}`,
    description: `Read manually maintained ${game.name} hints for ${params.date}, with progressive clues and answers hidden by default.`,
    alternates: { canonical: `/hints/${params.game}/${params.date}` },
  };
}

export default function DatedHintPage({ params }: Props) {
  const game = dailyHintGames.find((item) => item.game === params.game);
  if (!game || !isDateString(params.date) || params.date > todayInTimeZone()) notFound();
  const puzzle = getDailyHint(params.game, params.date);
  if (!puzzle) notFound();
  return <DailyHintPageContent gameName={game.name} canonicalPath={`/hints/${params.game}/${params.date}`} puzzle={puzzle} />;
}
