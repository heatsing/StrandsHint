import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DailyHintPageContent } from "@/components/hints/DailyHintPageContent";
import { dailyHintGames, getDailyHint, getDailyHintSlugs, isDateString, todayInTimeZone } from "@/lib/daily-hints";

type Props = { params: Promise<{ game: string; date: string }> };

export function generateStaticParams() {
  return getDailyHintSlugs();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game: gameSlug, date } = await params;
  const game = dailyHintGames.find((item) => item.game === gameSlug);
  if (!game || !isDateString(date) || date > todayInTimeZone()) return {};
  return {
    title: `${game.name} Hints for ${date}`,
    description: `Read manually maintained ${game.name} hints for ${date}, with progressive clues and answers hidden by default.`,
    alternates: { canonical: `/hints/${gameSlug}/${date}` },
  };
}

export default async function DatedHintPage({ params }: Props) {
  const { game: gameSlug, date } = await params;
  const game = dailyHintGames.find((item) => item.game === gameSlug);
  if (!game || !isDateString(date) || date > todayInTimeZone()) notFound();
  const puzzle = getDailyHint(gameSlug, date);
  if (!puzzle) notFound();
  return <DailyHintPageContent gameName={game.name} canonicalPath={`/hints/${gameSlug}/${date}`} puzzle={puzzle} />;
}
