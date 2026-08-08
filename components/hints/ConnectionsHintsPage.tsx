import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Grid3X3,
  HelpCircle,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, disclaimer } from "@/lib/seo";

const faq = [
  {
    question: "Are Connections hints spoiler-free?",
    answer: "Yes. This page is designed to start with broad hints before users choose to reveal answers.",
  },
  {
    question: "How often is the Connections puzzle updated?",
    answer: "Daily hint content is maintained manually for this site.",
  },
  {
    question: "Can I see all the Connections answers?",
    answer: "Answer areas are intentionally separated from early hints so players can avoid accidental spoilers.",
  },
  {
    question: "What does each color mean in Connections?",
    answer: "Yellow is usually easiest, then green, blue, and purple as the hardest group.",
  },
  {
    question: "How many mistakes can I make in Connections?",
    answer: "In the standard game format, players have a limited number of mistakes before the puzzle ends.",
  },
  {
    question: "Do you have a Connections solver tool?",
    answer: "A dedicated solver can be added later. For now, use the hints and word tools linked on this page.",
  },
  {
    question: "Is Connections harder than Wordle?",
    answer: "It tests a different skill: category recognition, word associations, and spotting misleading groups.",
  },
  {
    question: "Can I play past Connections puzzles?",
    answer: "This site only shows manually maintained helper pages and does not scrape official puzzle archives.",
  },
];

const dailyGames = [
  { href: "/hints/strands", label: "Strands Hint", color: "#008F83", Icon: Sparkles },
  { href: "/hints/connections", label: "Connections Hint", color: "#8A57D6", Icon: Grid3X3 },
  { href: "/hints/wordle", label: "Wordle Hint", color: "#35A853", Icon: Grid3X3 },
  { href: "/hints/mini-crossword", label: "Mini Crossword", color: "#2F80D8", Icon: Grid3X3 },
  { href: "/hints/spelling-bee", label: "Spelling Bee", color: "#D99A00", Icon: Sparkles },
];

const contentBlocks = [
  {
    title: "Key Takeaways",
    items: [
      "Use category thinking to group words and find connections.",
      "Look for themes like synonyms, phrases, and pop culture.",
      "Eliminate words that do not fit anywhere to narrow options.",
      "The colors reveal difficulty from Yellow to Purple.",
    ],
  },
  {
    title: "Quick Hints for Today's Connections",
    text: "Start by spotting obvious pairs or groups. Think about shared themes, categories, and wordplay. If stuck, rearrange words in your head and look for less common meanings.",
  },
  {
    title: "See the Connections Categories",
    text: "Each puzzle has four hidden categories. They can be based on topics, word relationships, phrases, or pop culture references. Group the words in your mind to uncover the hidden links.",
  },
  {
    title: "Find All of Today's Connections Answers",
    text: "When you are ready, reveal all four categories and the correct groups. Our answers are manually prepared so you can keep your streak going with confidence.",
  },
  {
    title: "What Is Connections?",
    text: "Connections is a word grouping game where you sort 16 words into four groups of four based on something they have in common. Each group has a unique theme, and the difficulty increases from Yellow to Purple.",
  },
  {
    title: "How to Play Connections",
    items: [
      "You will see 16 words. Your goal is to group them into 4 sets of 4.",
      "Each set has a hidden connection or category.",
      "Select 4 words and submit. If correct, they are removed.",
      "Mistakes deduct tries, so think carefully before choosing.",
    ],
  },
  {
    title: "What the Connections Colors Mean",
    items: [
      "Yellow: easiest group, usually the most obvious connection.",
      "Green: moderate, may require more thought.",
      "Blue: harder, often needs trickier association.",
      "Purple: hardest, often puns, wordplay, or less common links.",
    ],
  },
  {
    title: "Tips for Solving Connections Faster",
    items: [
      "Scan for obvious categories first.",
      "Look for synonyms, themes, and common phrases.",
      "Do not overthink with your first good guess.",
      "Use elimination to your advantage.",
    ],
  },
  {
    title: "Common Connections Mistakes to Avoid",
    items: [
      "Focusing on a trick that does not actually connect.",
      "Ignoring simple or obvious categories.",
      "Overthinking second-guessing correct groups.",
      "Forgetting that words can have multiple meanings.",
    ],
  },
  {
    title: "Advanced Tips From Experienced Players",
    items: [
      "Think beyond definitions and consider idioms or pop culture.",
      "Try different combinations if you hit a wall.",
      "Practice daily to sharpen pattern recognition.",
      "Learn from mistakes to spot patterns faster next time.",
    ],
  },
  {
    title: "Fun Facts About Connections",
    items: [
      "Connections rewards lateral thinking and vocabulary range.",
      "The game is updated daily with a new puzzle.",
      "Purple groups are often intentionally the trickiest.",
      "It is a fan-favorite for clever wordplay and challenge.",
    ],
  },
  {
    title: "More Puzzle Answers, Hints, and Solvers",
    text: "Explore more daily puzzle help on StrandsHint. From Strands and Wordle to Mini Crosswords and Spelling Bee, we have hints, answers, and smart solvers to keep you winning every day.",
  },
];

function ConnectionsBoard() {
  const rows = [
    { color: "#F5C51B", label: "Easy" },
    { color: "#56C982", label: "Medium" },
    { color: "#5EA1F4", label: "Hard" },
    { color: "#B877E8", label: "Tricky" },
  ];
  return (
    <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-xl shadow-[#315C4C]/10">
      <div className="mb-5 text-center">
        <span className="rounded-lg bg-[#142436] px-4 py-2 text-sm font-black text-white">Today&apos;s Puzzle</span>
      </div>
      <div className="grid gap-3">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[1fr_auto] gap-3 rounded-lg p-2" style={{ backgroundColor: row.color }}>
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="rounded-md border border-white/70 bg-white/20 py-3 text-center font-black text-[#142436]">?</div>
              ))}
            </div>
            <span className="grid min-w-20 place-items-center rounded-md bg-[#142436] px-3 text-sm font-black text-white">{row.label}</span>
          </div>
        ))}
      </div>
      <p className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-[#4A5968]">
        <Lightbulb className="h-4 w-4 text-[#008F83]" />
        Hints are spoiler-free. Reveal answers only when you are ready.
      </p>
    </div>
  );
}

export function ConnectionsHintsPage() {
  return (
    <article className="-mt-10">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Daily Hints", url: "/daily-hints" },
          { name: "Connections Hints", url: "/hints/connections" },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />

      <section className="relative mx-[calc(50%-50vw)] overflow-hidden bg-[radial-gradient(circle_at_50%_0%,#F1FBFA_0%,#F8F5EF_58%,#F8F5EF_100%)] px-4 py-14 text-center">
        <div className="pointer-events-none absolute -left-8 top-40 hidden h-40 w-40 opacity-40 md:block [background-image:radial-gradient(#00A39A_1.4px,transparent_1.4px)] [background-size:14px_14px]" />
        <div className="pointer-events-none absolute -right-20 top-32 hidden h-64 w-64 rounded-full bg-[#DDF4F1] md:block" />
        <div className="pointer-events-none absolute right-4 top-36 hidden h-32 w-32 opacity-25 md:block [background-image:radial-gradient(#00A39A_1.4px,transparent_1.4px)] [background-size:14px_14px]" />
        <div className="mx-auto max-w-6xl">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-[#DFF6F0] px-4 py-2 text-xs font-black uppercase tracking-wide text-[#008F83]">
            Daily Puzzle Help
          </p>
          <h1 className="mt-5 text-5xl font-black leading-tight text-[#142436] sm:text-6xl">
            <span className="text-[#2F80D8]">Connections</span> Hints
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#4A5968]">
            Get spoiler-free hints, clever clues, and answer guidance for today&apos;s Connections puzzle.
            Play smarter and keep your streak alive.
          </p>
          <Link
            href="/today/connections-hints"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#2F80D8] px-7 py-3 text-sm font-black text-white shadow-sm hover:bg-[#236DC5]"
          >
            Show All Answers <ArrowRight className="h-4 w-4" />
          </Link>
          <ConnectionsBoard />
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-5xl text-center">
        <h2 className="text-3xl font-black text-[#142436]">Daily Games Hints &amp; Answers</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {dailyGames.map(({ href, label, color, Icon }) => (
            <Link key={href} href={href} className="group rounded-xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-md shadow-[#315C4C]/5 hover:-translate-y-1 hover:shadow-lg">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-xl text-white" style={{ backgroundColor: color }}>
                <Icon className="h-7 w-7" />
              </span>
              <h3 className="mt-4 text-sm font-black text-[#142436]">{label}</h3>
              <ArrowRight className="mx-auto mt-4 h-5 w-5 text-[#008F83] transition group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 grid max-w-5xl gap-x-12 gap-y-8 lg:grid-cols-2">
        {contentBlocks.map((block) => (
          <section key={block.title} className="border-b border-[#E5DED3] pb-6">
            <h2 className="text-xl font-black text-[#142436]">{block.title}</h2>
            {block.text ? <p className="mt-3 text-sm leading-7 text-[#344153]">{block.text}</p> : null}
            {block.items ? (
              <ul className="mt-3 grid gap-2 text-sm leading-6 text-[#344153]">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#008F83]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </section>

      <section className="mx-auto mt-10 max-w-3xl">
        <h2 className="text-center text-3xl font-black text-[#142436]">
          Frequently Asked Questions About <span className="text-[#008F83]">Connections</span>
        </h2>
        <div className="mt-6 divide-y divide-[#E5DED3] overflow-hidden rounded-xl border border-[#E5DED3] bg-[#FFFDF9] shadow-sm">
          {faq.map((item) => (
            <details key={item.question} className="group p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-[#142436]">
                {item.question}
                <HelpCircle className="h-4 w-4 text-[#008F83] transition group-open:rotate-45" />
              </summary>
              <p className="mt-3 text-sm leading-6 text-[#68645E]">{item.answer}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 text-center text-sm leading-6 text-[#68645E]">{disclaimer}</p>
      </section>
    </article>
  );
}
