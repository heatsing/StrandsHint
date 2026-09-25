import { DailyAnswerPage, buildDailyAnswerMetadata } from "@/components/daily-answers/DailyAnswerPage";

export const metadata = buildDailyAnswerMetadata("connections");

export default function Page() {
  return <DailyAnswerPage game="connections" />;
}
