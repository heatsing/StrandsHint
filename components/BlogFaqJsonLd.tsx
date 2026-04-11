import type { FaqItem } from "@/lib/daily-types";

type Props = { items: FaqItem[] };

export function BlogFaqJsonLd({ items }: Props) {
  const filtered = items.filter((f) => f.question.trim() && f.answer.trim());
  if (filtered.length === 0) return null;

  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: filtered.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
