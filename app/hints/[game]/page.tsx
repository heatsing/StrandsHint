import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConnectionsHintsPage } from "@/components/hints/ConnectionsHintsPage";
import { DailyHintPageContent } from "@/components/hints/DailyHintPageContent";
import { dailyHintGames, getLatestDailyHint } from "@/lib/daily-hints";
import { absoluteUrl } from "@/lib/seo";

type Props = { params: Promise<{ game: string }> };

export function generateStaticParams() {
  return dailyHintGames.map((item) => ({ game: item.game }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game: gameSlug } = await params;
  const game = dailyHintGames.find((item) => item.game === gameSlug);
  if (!game) return {};
  if (gameSlug === "connections") {
    return {
      title: "Connections Hints - Spoiler-Free Clues & Answers",
      description:
        "Get spoiler-free Connections hints, category clues, color explanations, solving tips, and answer guidance.",
      alternates: { canonical: "/hints/connections" },
      openGraph: {
        title: "Connections Hints - Spoiler-Free Clues & Answers",
        description:
          "Get spoiler-free Connections hints, category clues, color explanations, solving tips, and answer guidance.",
        url: absoluteUrl("/hints/connections"),
        type: "article",
      },
      twitter: {
        card: "summary",
        title: "Connections Hints",
        description: "Spoiler-free Connections hints, category clues, and answer guidance.",
      },
    };
  }
  const path = `/hints/${gameSlug}`;
  const title = `${game.name} Hints Today - Progressive Daily Clues`;
  const description = `Get spoiler-safe ${game.name} hints with progressive clues, hidden answers, and manually maintained daily notes.`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: absoluteUrl(path), type: "article" },
    twitter: { card: "summary", title, description },
  };
}

export default async function LatestHintPage({ params }: Props) {
  const { game: gameSlug } = await params;
  const game = dailyHintGames.find((item) => item.game === gameSlug);
  if (!game) notFound();
  if (gameSlug === "connections") return <ConnectionsHintsPage />;
  const puzzle = getLatestDailyHint(gameSlug);
  return <DailyHintPageContent gameName={game.name} canonicalPath={`/hints/${gameSlug}`} puzzle={puzzle} />;
}
