import { DailyAnswerPage, buildDailyAnswerMetadata } from "@/components/daily-answers/DailyAnswerPage";

export const metadata = buildDailyAnswerMetadata("pips");

export default function Page() {
  return <DailyAnswerPage game="pips" />;
}
