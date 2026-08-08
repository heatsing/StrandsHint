import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConnectionsHintsPage } from "@/components/hints/ConnectionsHintsPage";
import { DailyHintPageContent } from "@/components/hints/DailyHintPageContent";
import { dailyHintGames, getLatestDailyHint } from "@/lib/daily-hints";

type Props = { params: { game: string } };

export function generateStaticParams() {
  return dailyHintGames.map((item) => ({ game: item.game }));
}

export function generateMetadata({ params }: Props): Metadata {
  const game = dailyHintGames.find((item) => item.game === params.game);
  if (!game) return {};
  if (params.game === "connections") {
    return {
      title: "Connections Hints - Spoiler-Free Clues & Answers",
      description:
        "Get spoiler-free Connections hints, category clues, color explanations, solving tips, and answer guidance.",
      alternates: { canonical: "/hints/connections" },
    };
  }
  return {
    title: `${game.name} Hints Today - Progressive Daily Clues`,
    description: `Get spoiler-safe ${game.name} hints with progressive clues, hidden answers, and manually maintained daily notes.`,
    alternates: { canonical: `/hints/${params.game}` },
  };
}

export default function LatestHintPage({ params }: Props) {
  const game = dailyHintGames.find((item) => item.game === params.game);
  if (!game) notFound();
  if (params.game === "connections") return <ConnectionsHintsPage />;
  const puzzle = getLatestDailyHint(params.game);
  return <DailyHintPageContent gameName={game.name} canonicalPath={`/hints/${params.game}`} puzzle={puzzle} />;
}
