import type { Puzzle } from "./puzzles";
import { formatDisplayDate } from "./puzzles";

export const siteName = "Strands Hint";
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://strandshint.net";

export function pageTitle(title: string): string {
  return `${title} | ${siteName}`;
}

export function puzzleDescription(puzzle: Puzzle): string {
  return `Hints, spangram, and answers for the ${formatDisplayDate(
    puzzle.date,
  )} Strands puzzle. Start small, then reveal the full answer list when you need it.`;
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
  };
}

export function puzzlePageSchema(puzzle: Puzzle) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageTitle(`Strands Answers for ${formatDisplayDate(puzzle.date)}`),
    url: `${siteUrl}/answers/${puzzle.date}/`,
    datePublished: `${puzzle.date}T12:00:00.000Z`,
    description: puzzleDescription(puzzle),
  };
}
