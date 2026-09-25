import { DailyAnswerPage, buildDailyAnswerMetadata } from "@/components/daily-answers/DailyAnswerPage";

export const metadata = buildDailyAnswerMetadata("spelling-bee");

export default function Page() {
  return <DailyAnswerPage game="spelling-bee" />;
}
