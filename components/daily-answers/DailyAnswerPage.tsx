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
  wordle: [
    ["Are answers shown immediately?", "No. Hints come first and the Wordle answer stays behind a reveal."],
    ["Can I update this daily?", "Yes. Edit data/daily-answers.json or use npm run daily:answer, then publish and deploy."],
  ],
  connections: [
    ["Do colors reveal difficulty?", "Yes. Yellow is usually easiest and purple is usually hardest."],
    ["Can I open one group only?", "Yes. Each category has its own reveal control."],
  ],
  "spelling-bee": [
    ["What is a pangram?", "A pangram uses every letter in the hive at least once."],
    ["Are all words shown at once?", "No. Pangrams and length lists stay behind reveals."],
  ],
  pips: [
    ["How should I use the steps?", "Open earlier constraints first and keep later answers closed."],
    ["Is this official NYT content?", "No. This is an independent fan-made helper page."],
  ],
  "mini-crossword": [
    ["Can I reveal one clue only?", "Yes. Each Across and Down row has its own Show control."],
    ["How do I publish a new day?", "Fill across/down arrays for the date, set published true, then deploy."],
  ],
  crossword: [
    ["Will this dump the whole grid?", "Not by default. Clues reveal one at a time, with an optional full list."],
    ["Is this affiliated with The New York Times?", "No. Strands Hint is an independent helper site."],
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
          { name: "Today's Answers", url: "/todays-answers" },
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
