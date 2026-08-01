import { absoluteUrl } from "@/lib/seo";

export type DailySeoPage = {
  game: "Wordle" | "Connections" | "Strands";
  slug: string;
  path: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  targetKeyword: string;
  searchIntent: string;
  freshContentNote: string;
  progressiveHints: string[];
  answerExplanation: string;
  tips: string[];
  relatedPages: { label: string; href: string; description: string }[];
  faq: { question: string; answer: string }[];
};

export const dailySeoPages: DailySeoPage[] = [
  {
    game: "Wordle",
    slug: "wordle-hints",
    path: "/today/wordle-hints",
    title: "Today's Wordle Hints - Spoiler-Safe Clues",
    metaDescription:
      "Use today's Wordle hints one step at a time, with gentle clues, solving tips, and related word tools before you reveal the answer.",
    h1: "Today's Wordle Hints",
    intro:
      "Need a small push before you spend another guess? Start with a broad clue, then move toward stronger hints only if you need them.",
    targetKeyword: "today's wordle hints",
    searchIntent: "Daily players want fast hints without immediately seeing the answer.",
    freshContentNote:
      "This page is designed for daily updates and returning players. Admin-entered content can replace these safe placeholder hints each day.",
    progressiveHints: [
      "Start by checking common vowels before you commit to a rare letter.",
      "Look for repeated letter patterns only after your first two guesses narrow the shape.",
      "If you are stuck, compare likely endings before revealing the final answer.",
    ],
    answerExplanation:
      "A useful Wordle explanation should describe why the answer fits the clues and which guesses would naturally lead there, not just list the word.",
    tips: [
      "Use one broad starter hint before looking for letter positions.",
      "Keep spoiler sections closed until you have made a real attempt.",
      "Move to a word finder only when you want a larger candidate list.",
    ],
    relatedPages: [
      { label: "Strands hints today", href: "/today/strands-hints", description: "Switch to today's Strands clue page." },
      { label: "Connections hints today", href: "/today/connections-hints", description: "Get category-style puzzle nudges." },
      { label: "Word Finder", href: "/strands-word-finder", description: "Search words by letters and patterns." },
    ],
    faq: [
      {
        question: "Are today's Wordle hints spoiler-free?",
        answer: "Yes. The page is structured from broad clues to stronger reveals so players can stop early.",
      },
      {
        question: "Is this an official Wordle page?",
        answer: "No. This is an independent helper page and does not copy official puzzle content.",
      },
    ],
  },
  {
    game: "Connections",
    slug: "connections-hints",
    path: "/today/connections-hints",
    title: "Today's Connections Hints - Category Clues",
    metaDescription:
      "Get today's Connections hints with spoiler-safe category nudges, solving strategy, and related daily puzzle pages.",
    h1: "Today's Connections Hints",
    intro:
      "When the grid looks noisy, start by finding one clean group. These hints are arranged to help you see category logic before any answer reveal.",
    targetKeyword: "today's connections hints",
    searchIntent: "Daily players want category nudges and confidence before making a mistake.",
    freshContentNote:
      "This daily template supports manually entered category clues, difficulty notes, and answer explanations.",
    progressiveHints: [
      "Scan for words that share a context rather than a spelling pattern.",
      "Separate obvious pairs, but wait before submitting a full group.",
      "If two groups overlap, identify which word has the narrower meaning.",
    ],
    answerExplanation:
      "A strong Connections explanation should name the category logic, show why confusing decoys do not belong, and help players learn the pattern.",
    tips: [
      "Do not submit the first four words that merely feel related.",
      "Use color or difficulty notes only after trying a category yourself.",
      "Check related daily pages after finishing to keep the puzzle routine going.",
    ],
    relatedPages: [
      { label: "Wordle hints today", href: "/today/wordle-hints", description: "Use gentle word clues before revealing." },
      { label: "Strands hints today", href: "/today/strands-hints", description: "Open Strands theme and spangram hints." },
      { label: "Strands Solver", href: "/strands-solver", description: "Paste a letter grid and find connected words." },
    ],
    faq: [
      {
        question: "Do these Connections hints reveal categories immediately?",
        answer: "No. The template is built for progressive hints first, then explanation when needed.",
      },
      {
        question: "Can this page be updated daily?",
        answer: "Yes. The data model separates the daily text from the page template.",
      },
    ],
  },
  {
    game: "Strands",
    slug: "strands-hints",
    path: "/today/strands-hints",
    title: "Today's Strands Hints - Theme, Spangram & Answers",
    metaDescription:
      "Reveal today's Strands hints progressively, including theme help, spangram guidance, answer explanation, and related solving tools.",
    h1: "Today's Strands Hints",
    intro:
      "Start with the theme, then move to spangram guidance, then use tools only if the board still will not open up.",
    targetKeyword: "today's strands hints",
    searchIntent: "Strands players want today's theme hint, spangram hint, and optional answer help.",
    freshContentNote:
      "This is the primary daily SEO page for Strands Hint and can be updated with manually reviewed daily puzzle content.",
    progressiveHints: [
      "Begin with the theme clue and look for a cluster of short related words.",
      "The spangram usually explains why the smaller answers belong together.",
      "Reveal the full answer only when you are done trying the grid yourself.",
    ],
    answerExplanation:
      "A helpful Strands explanation should connect the theme, spangram, and word list so players understand the puzzle rather than only seeing answers.",
    tips: [
      "Use the theme hint before opening the spangram.",
      "Try the spangram helper when you suspect a long edge-to-edge word.",
      "Use the archive to compare older editorial explanations.",
    ],
    relatedPages: [
      { label: "Today's Strands Answer", href: "/todays-strands-answer", description: "Reveal today in spoiler-safe layers." },
      { label: "Spangram Helper", href: "/strands-spangram-helper", description: "Find possible edge-to-edge candidates." },
      { label: "Archive", href: "/archive", description: "Browse manually published Strands pages." },
    ],
    faq: [
      {
        question: "Does this page copy official Strands content?",
        answer: "No. Daily content is designed for manual editorial entry and does not fetch official APIs.",
      },
      {
        question: "What should I reveal first?",
        answer: "Open the theme hint first, then the spangram hint, then answers only if you want them.",
      },
    ],
  },
];

export function getDailySeoPage(slug: string) {
  return dailySeoPages.find((page) => page.slug === slug) ?? null;
}

export function dailyPageSchema(page: DailySeoPage) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.metaDescription,
    mainEntityOfPage: absoluteUrl(page.path),
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    isAccessibleForFree: true,
    about: page.game,
  };
}

export function dailyFaqSchema(page: DailySeoPage) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
