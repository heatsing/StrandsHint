import { JsonLd } from "./JsonLd";

type FAQItem = {
  question: string;
  answer: string;
};

export function FAQ({ items }: { items: FAQItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section className="mt-12 border-t border-slate-200 pt-8">
      <JsonLd data={schema} />
      <h2 className="text-2xl font-bold text-slate-950">FAQ</h2>
      <div className="mt-5 grid gap-4">
        {items.map((item) => (
          <div key={item.question} className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="font-semibold text-slate-950">{item.question}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
