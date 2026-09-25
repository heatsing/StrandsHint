import { DailyAnswerPage, buildDailyAnswerMetadata } from "@/components/daily-answers/DailyAnswerPage";

export const metadata = buildDailyAnswerMetadata("wordle");

export default function Page() {
  return <DailyAnswerPage game="wordle" />;
}
