import { DailyAnswerPage, buildDailyAnswerMetadata } from "@/components/daily-answers/DailyAnswerPage";

export const metadata = buildDailyAnswerMetadata("crossword");

export default function Page() {
  return <DailyAnswerPage game="crossword" />;
}
