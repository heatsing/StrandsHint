import { DailyAnswerPage, buildDailyAnswerMetadata } from "@/components/daily-answers/DailyAnswerPage";

export const metadata = buildDailyAnswerMetadata("mini-crossword");

export default function Page() {
  return <DailyAnswerPage game="mini-crossword" />;
}
