import type { Metadata } from "next";
import { DailyAnswerShell } from "@/components/daily-answers/DailyAnswerShell";
import { ConnectionsAnswerBody } from "@/components/daily-answers/ConnectionsAnswerBody";
import { CrosswordAnswerBody } from "@/components/daily-answers/CrosswordAnswerBody";
import { PipsAnswerBody } from "@/components/daily-answers/PipsAnswerBody";
import { SpellingBeeAnswerBody } from "@/components/daily-answers/SpellingBeeAnswerBody";
import { WordleAnswerBody } from "@/components/daily-answers/WordleAnswerBody";
import { JsonLd } from "@/components/JsonLd";
import {
  formatAnswerDate,
  getDailyAnswerGame,
  getTodayAnswer,
  type DailyAnswerGame,
} from "@/lib/daily-answers";
import { breadcrumbSchema } from "@/lib/seo";

const faqByGame: Record<DailyAnswerGame, [string, string][]> = {
  crossword: [
    ["Will this dump the whole grid?", "No. You get a grid silhouette, per-clue Reveal buttons, and an optional full answer list."],
    ["Is this affiliated with The New York Times?", "No. Strands Hint is an independent helper site."],
  ],
  "mini-crossword": [
    ["Can I reveal one clue only?", "Yes. Each Across and Down row has its own Reveal control."],
    ["How do I publish a new day?", "Fill across/down arrays for the date, set published true, then deploy."],
  ],
  connections: [
    ["Do colors reveal difficulty?", "Yes. Yellow is usually easiest and purple is usually hardest."],
    ["Can I open one group only?", "Yes. Use the Answers tab and reveal one color at a time."],
  ],
  pips: [
    ["How should I use the steps?", "Tap Next clue to open constraints one by one, or reveal remaining clues when stuck."],
    ["Is this official NYT content?", "No. This is an independent fan-made helper page."],
  ],
  wordle: [
    ["Are answers shown immediately?", "No. Layered hints come first, then five tiles, then the answer behind Reveal."],
    ["Can I update this daily?", "Yes. Edit data/daily-answers.json or use npm run daily:answer, then publish and deploy."],
  ],
  "spelling-bee": [
    ["What is a pangram?", "A pangram uses every hive letter at least once and scores a bonus."],
    ["Do words need the center letter?", "Yes. Every Spelling Bee answer must include the yellow center letter."],
    ["How is scoring calculated?", "4-letter words score 1 point. Longer words score 1 point per letter. Pangrams add +7."],
  ],
};

export function buildDailyAnswerMetadata(game: DailyAnswerGame): Metadata {
  const config = getDailyAnswerGame(game)!;
  const entry = getTodayAnswer(game);
  const dateLabel = entry ? formatAnswerDate(entry.date) : "Today";
  return {
    title: entry?.title ?? `${config.name} Answer ${dateLabel}`,
    description: entry?.summary ?? config.description,
    alternates: { canonical: config.path },
  };
}

export function DailyAnswerPage({ game }: { game: DailyAnswerGame }) {
  const config = getDailyAnswerGame(game)!;
  const entry = getTodayAnswer(game);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: config.name, url: config.path },
        ])}
      />
      <DailyAnswerShell config={config} entry={entry} faq={faqByGame[game]}>
        {entry && game === "wordle" ? <WordleAnswerBody entry={entry} /> : null}
        {entry && game === "connections" ? <ConnectionsAnswerBody entry={entry} /> : null}
        {entry && game === "spelling-bee" ? <SpellingBeeAnswerBody entry={entry} /> : null}
        {entry && game === "pips" ? <PipsAnswerBody entry={entry} /> : null}
        {entry && game === "mini-crossword" ? <CrosswordAnswerBody entry={entry} compact /> : null}
        {entry && game === "crossword" ? <CrosswordAnswerBody entry={entry} /> : null}
      </DailyAnswerShell>
    </>
  );
}
