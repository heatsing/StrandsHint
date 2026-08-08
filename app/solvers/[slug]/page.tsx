import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ClipboardList,
  FileText,
  ListChecks,
  RefreshCw,
  Search,
  Shuffle,
  SlidersHorizontal,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { AnagramSolverClient } from "@/components/solvers/AnagramSolverClient";
import { CrosswordSolverClient } from "@/components/solvers/CrosswordSolverClient";
import { JumbleSolverClient } from "@/components/solvers/JumbleSolverClient";
import { LetterBoxSolverClient } from "@/components/solvers/LetterBoxSolverClient";
import { QuordleSolverClient } from "@/components/solvers/QuordleSolverClient";
import { ScrabbleSolverClient } from "@/components/solvers/ScrabbleSolverClient";
import { SpellingBeeSolverClient } from "@/components/solvers/SpellingBeeSolverClient";
import { WordFinderToolClient } from "@/components/solvers/WordFinderToolClient";
import { WordleSolverClient } from "@/components/solvers/WordleSolverClient";
import { getSolver, getSolverPath, solverRegistry } from "@/data/solver-registry";
import { absoluteUrl, breadcrumbSchema, disclaimer } from "@/lib/seo";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return solverRegistry.filter((solver) => solver.implemented && ["wordle", "spelling-bee", "anagram", "letter-box", "crossword", "jumble"].some((kind) => solver.inputType === kind)).map((solver) => ({ slug: solver.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const solver = getSolver(params.slug);
  if (!solver || !solver.implemented) return {};
  const path = getSolverPath(solver);
  const title =
    solver.slug === "scrabble-word-finder" ||
    solver.slug === "scrabble-solver" ||
    solver.slug === "spelling-bee-solver" ||
    solver.slug === "letter-box-solver"
      ? { absolute: solver.seo.title }
      : solver.seo.title;
  return {
    title,
    description: solver.seo.description,
    alternates: { canonical: path },
    openGraph: { title: solver.seo.title, description: solver.seo.description, url: absoluteUrl(path), type: "website" },
    twitter: { card: "summary", title: solver.seo.title, description: solver.seo.description },
  };
}

function SolverWorkspace({ inputType }: { inputType: string }) {
  if (inputType === "wordle") return <WordleSolverClient />;
  if (inputType === "spelling-bee") return <SpellingBeeSolverClient />;
  if (inputType === "anagram") return <AnagramSolverClient />;
  if (inputType === "letter-box") return <LetterBoxSolverClient />;
  if (inputType === "crossword") return <CrosswordSolverClient />;
  if (inputType === "jumble") return <JumbleSolverClient />;
  return null;
}

const spellingBeeFaq = [
  {
    question: "Are the words really valid for the Spelling Bee game?",
    answer:
      "The solver checks a local word list against Spelling Bee-style rules. Treat results as candidates and verify final entries in the game you are playing.",
  },
  {
    question: "Is this Spelling Bee solver free to use?",
    answer: "Yes. The solver is free, runs locally in your browser, and does not require an account.",
  },
  {
    question: "How often are the dictionary and word list updated?",
    answer:
      "The current release uses a compact local list. It can be expanded later with a larger licensed dictionary.",
  },
  {
    question: "Do I need to create an account to use this tool?",
    answer: "No. Enter the center letter and outer letters, then run the solver directly.",
  },
  {
    question: "Can I use this tool on my mobile device?",
    answer: "Yes. The input boxes and result list are built for desktop and mobile screens.",
  },
];

const wordleLengthFaq = [
  {
    question: "Is the 3 Letter Wordle Solver free to use?",
    answer: "Yes. It is free, browser-based, and does not require an account.",
  },
  {
    question: "How accurate are the results?",
    answer:
      "Results are filtered by the letters you enter and the local word list. If a word is missing, try relaxing one filter or using a broader word list later.",
  },
  {
    question: "Can I use this tool on mobile devices?",
    answer: "Yes. The letter boxes, buttons, and result list are designed for phone and desktop screens.",
  },
  {
    question: "Do you store my inputs or search history?",
    answer: "No. The solver runs locally in your browser and does not need an account.",
  },
  {
    question: "Can this solver help improve my Wordle skills?",
    answer: "Yes. It helps you compare possible words and learn how green, yellow, and gray clues narrow the answer set.",
  },
];

const wordleSolverFaq = [
  {
    question: "Is Wordle Solver free to use?",
    answer: "Yes. It is free, browser-based, and does not require an account.",
  },
  {
    question: "How accurate are the results?",
    answer: "Results are filtered by the clues you enter and the local word list. Remove one clue if the answer seems missing.",
  },
  {
    question: "Can I use this solver for other word games?",
    answer: "Yes. It works for Wordle-style games that use green, yellow, and gray letter feedback.",
  },
  {
    question: "Does it work on mobile devices?",
    answer: "Yes. The input boxes, filters, and result list are responsive for phones and desktop screens.",
  },
  {
    question: "Why are some words not shown in results?",
    answer: "The included word list is compact for speed. Some uncommon words may be missing until a larger licensed list is added.",
  },
];

const letterBoxFaq = [
  {
    question: "Is this solver free to use?",
    answer: "Yes. The Letter Boxed Solver is free and runs from a local word list in your browser.",
  },
  {
    question: "How do I enter the letters?",
    answer: "Type the three letters from each side of the box into the matching side inputs.",
  },
  {
    question: "Does it work on mobile?",
    answer: "Yes. The box input and solution cards are responsive for phones and desktop screens.",
  },
  {
    question: "Can it help solve today's puzzle?",
    answer: "It can suggest rule-valid word chains from the letters you enter, but it is not an official answer source.",
  },
  {
    question: "How many words should I aim for?",
    answer: "Fewer words are usually better. Try a two-word chain first, then expand to three if needed.",
  },
];

function InfoRow({
  Icon,
  title,
  children,
}: {
  Icon: typeof Search;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-5 rounded-xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-sm md:grid-cols-[7rem_1fr]">
      <div className="grid h-24 w-24 place-items-center rounded-2xl bg-[#E7F7F4] text-[#008F83]">
        <Icon className="h-12 w-12" />
      </div>
      <div>
        <h2 className="text-2xl font-black text-[#142436]">{title}</h2>
        <div className="mt-3 text-sm leading-6 text-[#344153]">{children}</div>
      </div>
    </section>
  );
}

function SpellingBeeSolverPage() {
  const path = "/solvers/spelling-bee-solver";
  const relatedTools = [
    { href: "/solvers/word-unscrambler", label: "Word Unscrambler", text: "Unscramble letters instantly and find possible words.", Icon: Shuffle, accent: "#D99A00" },
    { href: "/solvers/anagram-solver", label: "Anagram Solver", text: "Find anagrams and solve words from any letters.", Icon: RefreshCw, accent: "#008F83" },
    { href: "/strands-word-finder", label: "Word Finder", text: "Find all words by length, starting letter, and more.", Icon: ListChecks, accent: "#3FA34D" },
    { href: "/all-solvers", label: "Pattern Solver", text: "Use known letters and blanks to find matching words.", Icon: ClipboardList, accent: "#E0544F" },
  ];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: spellingBeeFaq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  };

  return (
    <article className="-mt-10">
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "All Solvers", url: "/all-solvers" }, { name: "Spelling Bee Solver", url: path }])} />
      <JsonLd data={faqSchema} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "Spelling Bee Solver", url: absoluteUrl(path), applicationCategory: "GameApplication", isAccessibleForFree: true }} />

      <section className="relative mx-[calc(50%-50vw)] overflow-hidden bg-[radial-gradient(circle_at_50%_0%,#F1FBFA_0%,#F8F5EF_55%,#F8F5EF_100%)] px-4 py-14">
        <div className="pointer-events-none absolute -left-10 top-20 hidden h-40 w-40 opacity-35 md:block [background-image:radial-gradient(#00A39A_1.4px,transparent_1.4px)] [background-size:14px_14px]" />
        <div className="pointer-events-none absolute -right-20 top-24 hidden h-64 w-64 rounded-full bg-[#DDF4F1] md:block" />
        <div className="pointer-events-none absolute right-8 top-14 hidden h-32 w-32 opacity-25 md:block [background-image:radial-gradient(#00A39A_1.4px,transparent_1.4px)] [background-size:14px_14px]" />
        <div className="mx-auto max-w-6xl">
          <header className="text-center">
            <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-[#FFF4D8] px-4 py-2 text-sm font-black text-[#9A6B24]">
              Bee Tool
            </p>
            <h1 className="mt-5 text-5xl font-black leading-tight text-[#142436] sm:text-6xl">
              Spelling <span className="text-[#E8A300]">Bee</span> Solver
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-[#4A5968]">
              Find all possible words and chase Queen Bee status with an easy-to-use Spelling Bee solver.
            </p>
          </header>

          <div className="mx-auto mt-10 max-w-4xl">
            <Suspense fallback={<div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-sm">Loading Spelling Bee Solver...</div>}>
              <SpellingBeeSolverClient />
            </Suspense>
          </div>

          <div className="mx-auto mt-6 grid max-w-4xl gap-6 md:grid-cols-2">
            <section className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-lg shadow-[#315C4C]/10">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#2F80D8] text-white">
                  <ClipboardList className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-black text-[#142436]">Spelling Bee Rules</h2>
              </div>
              <ul className="mt-5 grid gap-3 text-sm leading-6 text-[#344153]">
                <li>Words must be at least 4 letters long.</li>
                <li>Words must include the center letter.</li>
                <li>Words can only use the given letters.</li>
                <li>Letters can be used multiple times.</li>
                <li>Pangrams use all 7 letters.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-lg shadow-[#315C4C]/10">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#E8A300] text-white">
                  <Star className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-black text-[#142436]">Scoring System</h2>
              </div>
              <ul className="mt-5 grid gap-3 text-sm leading-6 text-[#344153]">
                <li>4-letter words: 1 point</li>
                <li>5+ letter words: 1 point per letter</li>
                <li>Pangrams: 7 bonus points</li>
                <li>Queen Bee status for top scores</li>
              </ul>
            </section>
          </div>
        </div>
      </section>

      <div className="mx-auto mt-8 grid max-w-5xl gap-5">
        <InfoRow Icon={FileText} title="What is Spelling Bee?">
          <p>
            Spelling Bee is a word-finding puzzle built around seven letters: one required center
            letter and six outer letters. Make words of four or more letters while reusing letters
            as needed.
          </p>
        </InfoRow>
        <InfoRow Icon={Search} title="How Does Spelling Bee Solver Work?">
          <p>
            Enter the center letter and six outer letters. The tool checks a local dictionary and
            returns words that include the center letter, use only the given letters, and are at
            least four letters long.
          </p>
        </InfoRow>
        <InfoRow Icon={ClipboardList} title="How to Use Spelling Bee Solver?">
          <ol className="grid gap-2 sm:grid-cols-2">
            <li>1. Type the center letter in the middle.</li>
            <li>2. Enter the six outer letters below.</li>
            <li>3. Click the Find All Words button.</li>
            <li>4. View the complete word list with scores.</li>
            <li>5. Aim for pangrams and higher-value words.</li>
          </ol>
        </InfoRow>
        <InfoRow Icon={Trophy} title="Why Use Our Solver?">
          <ul className="list-disc pl-5">
            <li>Instantly find all valid candidate words and save time.</li>
            <li>See word scores and pangram highlights.</li>
            <li>Use a clean, fast, mobile-friendly experience.</li>
            <li>Free to use with no sign-ups or limits.</li>
          </ul>
        </InfoRow>
        <InfoRow Icon={Users} title="Who Can Use This Tool?">
          <p>
            Anyone can use this Spelling Bee Solver: casual players, word-game fans, students, and
            daily puzzle solvers who want a faster way to explore possible words.
          </p>
        </InfoRow>
      </div>

      <section className="mx-auto mt-10 max-w-5xl">
        <h2 className="text-center text-3xl font-black text-[#142436]">Explore More Word Solvers</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {relatedTools.map(({ href, label, text, Icon, accent }) => (
            <Link key={label} href={href} className="group rounded-xl border border-[#E5DED3] bg-[#FFFDF9] p-6 text-center shadow-md shadow-[#315C4C]/5 hover:-translate-y-1 hover:shadow-lg">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-xl" style={{ backgroundColor: `${accent}18`, color: accent }}>
                <Icon className="h-7 w-7" />
              </span>
              <h3 className="mt-5 text-lg font-black text-[#142436]">{label}</h3>
              <p className="mt-2 min-h-12 text-sm leading-6 text-[#68645E]">{text}</p>
              <span className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-black" style={{ borderColor: accent, color: accent }}>
                Try Now <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-5xl">
        <h2 className="text-center text-3xl font-black text-[#142436]">Frequently Asked Questions</h2>
        <div className="mt-5 divide-y divide-[#E5DED3] overflow-hidden rounded-xl border border-[#E5DED3] bg-[#FFFDF9] shadow-sm">
          {spellingBeeFaq.map((item) => (
            <details key={item.question} className="group p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-[#142436]">
                {item.question}
                <ArrowRight className="h-4 w-4 text-[#008F83] transition group-open:rotate-90" />
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

function WordleInfoCard({
  Icon,
  title,
  children,
  accent = "#008F83",
}: {
  Icon: typeof Search;
  title: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <section className="rounded-xl border border-[#E5DED3] bg-[#FFFDF9] p-6 text-center shadow-md shadow-[#315C4C]/5">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl" style={{ backgroundColor: `${accent}18`, color: accent }}>
        <Icon className="h-8 w-8" />
      </span>
      <h2 className="mt-5 text-xl font-black text-[#142436]">{title}</h2>
      <div className="mt-3 text-sm leading-7 text-[#4A5968]">{children}</div>
    </section>
  );
}

function wordleTheme() {
  return {
    accent: "#3E6EF4",
    accentSoft: "#EAF1FF",
    sideDots: "#3E8BFF",
    tag: "Word Solver Tool",
    gradient: "linear-gradient(90deg,#1F9BEF,#4C5CF5)",
  };
}

function WordleSolverPage({ solver }: { solver: NonNullable<ReturnType<typeof getSolver>> }) {
  const theme = {
    accent: "#008F83",
    accentSoft: "#E7F7F4",
    sideDots: "#2F80D8",
    gradient: "linear-gradient(90deg,#008F83,#12A37F)",
  };
  const path = `/solvers/${solver.slug}`;
  const relatedTools = [
    { href: "/solvers/anagram-solver", label: "Anagram Solver", points: ["Find words from jumbled letters", "Supports multiple lengths", "Great for word games"], Icon: Shuffle, accent: "#008F83", cta: "Try Anagram Solver" },
    { href: "/solvers/word-unscrambler", label: "Word Unscrambler", points: ["Unscramble letters instantly", "Find all possible words", "Sort by length or alphabet"], Icon: FileText, accent: "#D99A00", cta: "Try Unscrambler" },
    { href: "/5-letter-wordle-solver", label: "5-Letter Word Finder", points: ["Find all 5-letter words", "Filter by included letters", "Perfect for Wordle hints"], Icon: ListChecks, accent: "#3FA34D", cta: "Try 5-Letter Finder" },
    { href: "/all-solvers", label: "Pattern Solver", points: ["Use patterns like _A_E_", "Wildcard and position based", "Find words that match"], Icon: ClipboardList, accent: "#8A57D6", cta: "Try Pattern Solver" },
  ];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: wordleSolverFaq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  };

  return (
    <article className="-mt-10">
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "All Solvers", url: "/all-solvers" }, { name: solver.name, url: path }])} />
      <JsonLd data={faqSchema} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: solver.name, url: absoluteUrl(path), applicationCategory: "GameApplication", isAccessibleForFree: true }} />

      <section className="relative mx-[calc(50%-50vw)] overflow-hidden bg-[radial-gradient(circle_at_50%_0%,#F1FBFA_0%,#F8F5EF_55%,#F8F5EF_100%)] px-4 py-14">
        <div className="pointer-events-none absolute -left-10 top-20 hidden h-40 w-40 opacity-35 md:block [background-size:14px_14px]" style={{ backgroundImage: `radial-gradient(${theme.sideDots} 1.4px, transparent 1.4px)` }} />
        <div className="pointer-events-none absolute -right-20 top-24 hidden h-64 w-64 rounded-full bg-[#DDF4F1] md:block" />
        <div className="pointer-events-none absolute right-8 top-14 hidden h-32 w-32 opacity-25 md:block [background-size:14px_14px]" style={{ backgroundImage: `radial-gradient(${theme.sideDots} 1.4px, transparent 1.4px)` }} />

        <div className="mx-auto max-w-6xl">
          <header className="text-center">
            <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#008F83]/40 bg-[#E7F7F4] px-4 py-2 text-sm font-black text-[#008F83]">
              Word Solver Tool
            </p>
            <h1 className="mt-5 text-5xl font-black leading-tight text-[#142436] sm:text-6xl">
              <span className="text-[#008F83]">Wordle</span> Solver
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#4A5968]">
              Enter your known letters and constraints to find the perfect 5-letter word.
            </p>
          </header>

          <div className="mx-auto mt-10 max-w-4xl">
            <Suspense fallback={<div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-sm">Loading Wordle Solver...</div>}>
              <WordleSolverClient initialLength={5} fixedLength accent={theme.accent} />
            </Suspense>
          </div>

          <div className="mx-auto mt-6 grid max-w-4xl gap-6 md:grid-cols-2">
            <section className="rounded-2xl border border-[#BFE5DA] bg-[#F3FBF8] p-6 shadow-md shadow-[#315C4C]/5">
              <h2 className="text-xl font-black text-[#008F83]">Pro Tips</h2>
              <ul className="mt-4 grid gap-2 text-sm leading-6 text-[#344153]">
                <li>Lock in confirmed letters first.</li>
                <li>Avoid overloading yellow letters.</li>
                <li>Try common vowels and consonants.</li>
                <li>Refine results step by step.</li>
              </ul>
            </section>
            <section className="rounded-2xl border border-[#BFD8F7] bg-[#F4FAFF] p-6 shadow-md shadow-[#315C4C]/5">
              <h2 className="text-xl font-black text-[#2F80D8]">How to Use</h2>
              <div className="mt-4 grid gap-2 text-sm leading-6 text-[#344153]">
                <p><strong className="text-[#008F83]">Green</strong> = correct and in the right position.</p>
                <p><strong className="text-[#D99A00]">Yellow</strong> = in the word but wrong position.</p>
                <p><strong className="text-[#68645E]">Gray</strong> = not in the word.</p>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <WordleInfoCard Icon={FileText} title="What is Wordle Solver?">
          <p>A smart tool that helps you find possible 5-letter words based on Wordle clues and letter feedback.</p>
        </WordleInfoCard>
        <WordleInfoCard Icon={RefreshCw} title="How Does Wordle Solver Work?">
          <p>Enter known, misplaced, and excluded letters. The solver checks the local word list and returns matches.</p>
        </WordleInfoCard>
        <WordleInfoCard Icon={ClipboardList} title="How to Use Wordle Solver?" accent="#8A57D6">
          <p>Input your clues, hit search, and get possible words. Keep refining until you find the answer.</p>
        </WordleInfoCard>
        <WordleInfoCard Icon={Star} title="Why Use Our Solver?" accent="#D99A00">
          <p>Save time, sharpen your strategy, and improve your Wordle skills with accurate suggestions.</p>
        </WordleInfoCard>
        <WordleInfoCard Icon={Users} title="Who Can Use This Tool?" accent="#2F80D8">
          <p>Anyone who loves Wordle, from beginners to experienced streak chasers.</p>
        </WordleInfoCard>
      </section>

      <section className="mx-auto mt-10 max-w-6xl">
        <h2 className="text-center text-3xl font-black text-[#142436]">
          Explore More <span className="text-[#008F83]">Word Solvers</span>
        </h2>
        <p className="mt-2 text-center text-sm text-[#68645E]">Try other tools to solve, discover, and master word puzzles.</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {relatedTools.map(({ href, label, points, Icon, accent, cta }) => (
            <Link key={label} href={href} className="group rounded-xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-md shadow-[#315C4C]/5 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-xl" style={{ backgroundColor: `${accent}18`, color: accent }}>
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="text-lg font-black text-[#142436]">{label}</h3>
              </div>
              <ul className="mt-5 grid gap-2 text-sm text-[#68645E]">
                {points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span style={{ color: accent }}>&bull;</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <span className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-black" style={{ borderColor: accent, color: accent }}>
                {cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-5xl">
        <h2 className="text-center text-3xl font-black text-[#142436]">
          FAQs About <span className="text-[#008F83]">Wordle Solver</span>
        </h2>
        <p className="mt-2 text-center text-sm text-[#68645E]">Everything you need to know about using the tool.</p>
        <div className="mt-5 divide-y divide-[#E5DED3] overflow-hidden rounded-xl border border-[#E5DED3] bg-[#FFFDF9] shadow-sm">
          {wordleSolverFaq.map((item) => (
            <details key={item.question} className="group p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-[#142436]">
                {item.question}
                <ArrowRight className="h-4 w-4 text-[#008F83] transition group-open:rotate-90" />
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

function WordleLengthSolverPage({ solver }: { solver: NonNullable<ReturnType<typeof getSolver>> }) {
  const wordLength = solver.wordLength || 5;
  const theme = wordleTheme();
  const path = getSolverPath(solver);
  const relatedTools = [
    { href: "/5-letter-wordle-solver", label: "5-Letter Word Finder", points: ["Find all valid 5-letter words", "Great for Wordle and more", "Sort, filter, and explore"], Icon: ListChecks, accent: "#3FA34D" },
    { href: "/solvers/anagram-solver", label: "Anagram Solver", points: ["Find words from messy letters", "All lengths and dictionary-based", "Perfect for any word game"], Icon: Search, accent: "#008F83" },
    { href: "/solvers/word-unscrambler", label: "Word Unscrambler", points: ["Unscramble letters instantly", "Filter by length and patterns", "Boost your vocabulary"], Icon: Shuffle, accent: "#D99A00" },
    { href: "/all-solvers", label: "Pattern Solver", points: ["Use known letters and blanks", "Find words that match pattern", "Wildcard friendly"], Icon: ClipboardList, accent: "#E0544F" },
  ];
  const faq = wordleLengthFaq.map((item) =>
    item.question.includes("3 Letter") && wordLength !== 3
      ? { ...item, question: item.question.replace("3 Letter", `${wordLength} Letter`) }
      : item,
  );
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  };

  return (
    <article className="-mt-10">
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "All Solvers", url: "/all-solvers" }, { name: solver.name, url: path }])} />
      <JsonLd data={faqSchema} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: solver.name, url: absoluteUrl(path), applicationCategory: "GameApplication", isAccessibleForFree: true }} />

      <section className="relative mx-[calc(50%-50vw)] overflow-hidden bg-[radial-gradient(circle_at_50%_0%,#F1FBFA_0%,#F8F5EF_55%,#F8F5EF_100%)] px-4 py-14">
        <div className="pointer-events-none absolute -left-10 top-20 hidden h-40 w-40 opacity-35 md:block [background-size:14px_14px]" style={{ backgroundImage: `radial-gradient(${theme.sideDots} 1.4px, transparent 1.4px)` }} />
        <div className="pointer-events-none absolute -right-20 top-24 hidden h-64 w-64 rounded-full bg-[#DDF4F1] md:block" />
        <div className="pointer-events-none absolute right-8 top-14 hidden h-32 w-32 opacity-25 md:block [background-size:14px_14px]" style={{ backgroundImage: `radial-gradient(${theme.sideDots} 1.4px, transparent 1.4px)` }} />
        <div className="mx-auto max-w-6xl">
          <header className="text-center">
            <p className="mx-auto inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-black" style={{ borderColor: `${theme.accent}66`, backgroundColor: theme.accentSoft, color: theme.accent }}>
              {theme.tag}
            </p>
            <h1 className="mt-5 text-5xl font-black leading-tight text-[#142436] sm:text-6xl">
              {wordLength} Letter <span style={{ color: theme.accent }}>Wordle</span> Solver
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#4A5968]">
              Enter your known letters and constraints to find the perfect {wordLength}-letter word.
            </p>
          </header>

          <div className="mx-auto mt-10 max-w-4xl">
            <Suspense fallback={<div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-sm">Loading {wordLength} Letter Wordle Solver...</div>}>
              <WordleSolverClient initialLength={wordLength} fixedLength accent={theme.accent} />
            </Suspense>
          </div>

          <aside className="mx-auto mt-6 grid max-w-4xl gap-6 md:grid-cols-2">
            <section className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-lg shadow-[#315C4C]/10">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg" style={{ backgroundColor: theme.accentSoft, color: theme.accent }}>
                  <Star className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-black text-[#142436]">Pro Tips</h2>
              </div>
              <ul className="mt-5 grid gap-3 text-sm leading-6 text-[#344153]">
                <li>Lock in confirmed letters first (green).</li>
                <li>Add common letters to narrow results.</li>
                <li>Don&apos;t overload yellow letters early.</li>
                <li>Refine step by step for better results.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-lg shadow-[#315C4C]/10">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#EAF3FF] text-[#2F80D8]">
                  <ClipboardList className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-black text-[#142436]">How to Use</h2>
              </div>
              <div className="mt-5 grid gap-3 text-sm leading-6 text-[#344153]">
                <p><strong className="text-[#008F83]">Green:</strong> Letter is correct and in the right position.</p>
                <p><strong className="text-[#D99A00]">Yellow:</strong> Letter is in the word but wrong position.</p>
                <p><strong className="text-[#68645E]">Gray:</strong> Letter is not in the word.</p>
              </div>
            </section>
          </aside>
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <WordleInfoCard Icon={FileText} title={`What is ${wordLength} Letter Wordle Solver?`}>
          <p>A smart tool that helps you find possible {wordLength}-letter words based on your clues.</p>
        </WordleInfoCard>
        <WordleInfoCard Icon={RefreshCw} title={`How Does ${wordLength} Letter Wordle Solver Work?`} accent="#8A57D6">
          <p>Enter green, yellow, and gray letters. The algorithm filters the word list and shows matching results.</p>
        </WordleInfoCard>
        <WordleInfoCard Icon={ClipboardList} title={`How to Use ${wordLength} Letter Wordle Solver?`} accent="#D99A00">
          <ol className="text-left">
            <li>1. Enter green letters in order.</li>
            <li>2. Add yellow letters by position.</li>
            <li>3. Exclude gray letters.</li>
            <li>4. Click Find Solutions.</li>
          </ol>
        </WordleInfoCard>
        <WordleInfoCard Icon={Star} title="Why Use Our Solver?">
          <p>Fast, accurate, and easy to use. Built for speed and precision while solving word games.</p>
        </WordleInfoCard>
        <WordleInfoCard Icon={Users} title="Who Can Use This Tool?" accent="#E0544F">
          <p>Perfect for Wordle players of all levels, from pattern learners to streak chasers.</p>
        </WordleInfoCard>
      </section>

      <section className="mx-auto mt-10 max-w-6xl">
        <h2 className="text-center text-3xl font-black text-[#142436]">
          Explore More <span style={{ color: theme.accent }}>Word Solvers</span>
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {relatedTools.map(({ href, label, points, Icon, accent }) => (
            <Link key={label} href={href} className="group rounded-xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-md shadow-[#315C4C]/5 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-xl" style={{ backgroundColor: `${accent}18`, color: accent }}>
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="text-lg font-black text-[#142436]">{label}</h3>
              </div>
              <ul className="mt-5 grid gap-2 text-sm text-[#68645E]">
                {points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span style={{ color: accent }}>&bull;</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <span className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-black" style={{ borderColor: accent, color: accent }}>
                Use Solver <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl">
        <h2 className="text-center text-3xl font-black text-[#142436]">
          FAQs About <span style={{ color: theme.accent }}>{wordLength} Letter Wordle Solver</span>
        </h2>
        <div className="mt-5 divide-y divide-[#E5DED3] overflow-hidden rounded-xl border border-[#E5DED3] bg-[#FFFDF9] shadow-sm">
          {faq.map((item) => (
            <details key={item.question} className="group p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-[#142436]">
                {item.question}
                <ArrowRight className="h-4 w-4 text-[#008F83] transition group-open:rotate-90" />
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

function LetterBoxSolverPage() {
  const path = "/solvers/letter-box-solver";
  const relatedTools = [
    { href: "/solvers/anagram-solver", label: "Anagram Solver", points: ["Find all possible anagrams", "From letters you provide", "Expand your vocabulary"], Icon: ListChecks, accent: "#008F83" },
    { href: "/solvers/word-unscrambler", label: "Word Unscrambler", points: ["Unscramble jumbled letters", "Find all valid words", "Perfect for any word game"], Icon: Shuffle, accent: "#8A57D6" },
    { href: "/solvers/crossword-solver", label: "Crossword Helper", points: ["Get crossword answers", "Clue-based suggestions", "Solve puzzles with ease"], Icon: ClipboardList, accent: "#2F80D8" },
    { href: "/all-solvers", label: "Pattern Solver", points: ["Find words by pattern", "Use wildcards like _ or ?", "Custom length options"], Icon: Star, accent: "#E86F3D" },
  ];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: letterBoxFaq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  };

  return (
    <article className="-mt-10">
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "All Solvers", url: "/all-solvers" }, { name: "Letter Boxed Solver", url: path }])} />
      <JsonLd data={faqSchema} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "Letter Boxed Solver", url: absoluteUrl(path), applicationCategory: "GameApplication", isAccessibleForFree: true }} />

      <section className="relative mx-[calc(50%-50vw)] overflow-hidden bg-[radial-gradient(circle_at_50%_0%,#F4FFFD_0%,#F8F5EF_58%,#F8F5EF_100%)] px-4 py-14">
        <div className="pointer-events-none absolute -left-20 top-24 hidden h-64 w-64 rounded-full bg-[#DDF4F1] md:block" />
        <div className="pointer-events-none absolute right-10 top-20 hidden h-5 w-5 rotate-45 bg-[#E8A300]/60 md:block" />
        <div className="pointer-events-none absolute left-32 top-28 hidden h-4 w-4 rotate-45 bg-[#8A57D6]/40 md:block" />
        <div className="mx-auto max-w-6xl">
          <header className="text-center">
            <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-[#E7F7F4] px-4 py-2 text-sm font-black text-[#008F83]">
              Letter Box Tool
            </p>
            <h1 className="mt-5 text-5xl font-black leading-tight text-[#142436] sm:text-6xl">
              Letter Boxed <span className="text-[#8A57D6]">Solver</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#4A5968]">
              Find optimal word combinations to solve Letter Boxed-style puzzles in minimum moves.
            </p>
          </header>

          <div className="mx-auto mt-10 max-w-4xl">
            <Suspense fallback={<div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-sm">Loading Letter Boxed Solver...</div>}>
              <LetterBoxSolverClient />
            </Suspense>
          </div>

          <div className="mx-auto mt-6 grid max-w-4xl gap-6 md:grid-cols-2">
            <section className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-lg shadow-[#315C4C]/10">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#EAF3FF] text-[#2F80D8]">
                  <ClipboardList className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-black text-[#142436]">Letter Boxed Rules</h2>
              </div>
              <ul className="mt-5 grid gap-3 text-sm leading-6 text-[#344153]">
                <li>Use all 12 letters at least once.</li>
                <li>Words must be at least 3 letters long.</li>
                <li>Cannot use consecutive letters from the same side.</li>
                <li>Next word starts with the last letter of the previous word.</li>
                <li>Complete in as few words as possible.</li>
              </ul>
            </section>
            <section className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-lg shadow-[#315C4C]/10">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#FFF4D8] text-[#D99A00]">
                  <Star className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-black text-[#142436]">Strategy Tips</h2>
              </div>
              <ul className="mt-5 grid gap-3 text-sm leading-6 text-[#344153]">
                <li>Look for long words using many letters.</li>
                <li>Find words that end with uncommon letters.</li>
                <li>Build efficient word chains.</li>
                <li>Maximize unique letters in each word.</li>
                <li>Use vowels strategically.</li>
              </ul>
            </section>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <WordleInfoCard Icon={FileText} title="What is Letter Boxed?">
          <p>Letter Boxed is a word puzzle where you connect letters around a square to form words.</p>
        </WordleInfoCard>
        <WordleInfoCard Icon={RefreshCw} title="How Does Letter Boxed Solver Work?">
          <p>The solver analyzes letters, validates side rules, and finds word chains from the local word list.</p>
        </WordleInfoCard>
        <WordleInfoCard Icon={ClipboardList} title="How to Use Letter Boxed Solver?">
          <ol className="text-left">
            <li>1. Enter the 12 letters around the box.</li>
            <li>2. Choose your target move count.</li>
            <li>3. Click Find Solutions.</li>
            <li>4. Review the best chains.</li>
          </ol>
        </WordleInfoCard>
        <WordleInfoCard Icon={Star} title="Why Use Our Solver?">
          <p>Save time, sharpen word skills, and discover new chain options quickly.</p>
        </WordleInfoCard>
        <WordleInfoCard Icon={Users} title="Who Can Use This Tool?">
          <p>Great for puzzle fans, students, teachers, and anyone improving vocabulary skills.</p>
        </WordleInfoCard>
      </section>

      <section className="mx-auto mt-10 max-w-6xl">
        <h2 className="text-center text-3xl font-black text-[#142436]">
          Explore <span className="text-[#008F83]">More Word Solvers</span>
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {relatedTools.map(({ href, label, points, Icon, accent }) => (
            <Link key={label} href={href} className="group rounded-xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-md shadow-[#315C4C]/5 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-xl" style={{ backgroundColor: `${accent}18`, color: accent }}>
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="text-lg font-black text-[#142436]">{label}</h3>
              </div>
              <ul className="mt-5 grid gap-2 text-sm text-[#68645E]">
                {points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span style={{ color: accent }}>&bull;</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <span className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-black" style={{ borderColor: accent, color: accent }}>
                Try Solver <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl">
        <h2 className="text-center text-3xl font-black text-[#142436]">
          Frequently Asked <span className="text-[#008F83]">Questions</span>
        </h2>
        <div className="mt-5 divide-y divide-[#E5DED3] overflow-hidden rounded-xl border border-[#E5DED3] bg-[#FFFDF9] shadow-sm">
          {letterBoxFaq.map((item) => (
            <details key={item.question} className="group p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-[#142436]">
                {item.question}
                <ArrowRight className="h-4 w-4 text-[#008F83] transition group-open:rotate-90" />
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

type WordFinderVariant = "anagram" | "unscrambler" | "scrabble" | "wordsWithFriends";

const wordFinderPageConfig = {
  "anagram-solver": {
    variant: "anagram",
    badge: "Word Solver Tool",
    titlePrefix: "Anagram",
    titleHighlight: "Solver",
    accent: "#E34B83",
    gradient: "linear-gradient(90deg,#EA70B0,#F16678)",
    intro: "Find all possible anagrams for any word or phrase with advanced filtering options.",
    belowPanels: [
      {
        Icon: Search,
        title: "What are Anagrams?",
        body: "Anagrams are words formed by rearranging the letters of another word. Example: LISTEN becomes SILENT because both words use the same letters.",
        accent: "#E34B83",
      },
      {
        Icon: Star,
        title: "Pro Tips",
        body: "Look for common letter patterns, try different word lengths, use filters to narrow results, and consider proper nouns too.",
        accent: "#E34B83",
      },
    ],
    infoCards: [
      { Icon: FileText, title: "What is Anagram?", body: "An anagram is a word or phrase formed by rearranging the letters of another.", accent: "#008F83" },
      { Icon: ListChecks, title: "How to Use Solver?", body: "Enter text, set filters, and discover all possible anagrams instantly.", accent: "#008F83" },
      { Icon: SlidersHorizontal, title: "Advanced Filtering", body: "Filter by length, prefixes, suffixes, and patterns to find exactly what you need.", accent: "#008F83" },
      { Icon: Trophy, title: "Why Use Our Solver?", body: "Fast, accurate, and easy to use with practical search controls.", accent: "#008F83" },
      { Icon: Users, title: "Who Can Use This Tool?", body: "Students, writers, gamers, and word enthusiasts of all levels.", accent: "#008F83" },
    ],
    related: [
      { href: "/solvers/word-unscrambler", label: "Word Unscrambler", text: "Unscramble letters instantly and find all possible words.", Icon: Shuffle, accent: "#D99A00", cta: "Use Unscrambler" },
      { href: "/solvers/scrabble-word-finder", label: "Scrabble Word Finder", text: "Find valid Scrabble words and maximize your score.", Icon: ListChecks, accent: "#3FA34D", cta: "Find Scrabble Words" },
      { href: "/all-solvers", label: "Pattern Solver", text: "Find words that match specific patterns and blanks.", Icon: ClipboardList, accent: "#E0544F", cta: "Use Pattern Solver" },
      { href: "/solvers/crossword-solver", label: "Crossword Helper", text: "Solve crossword clues faster and discover new words.", Icon: Search, accent: "#2F80D8", cta: "Open Crossword Helper" },
    ],
    faq: [
      ["How does the Anagram Solver work?", "It compares your letters against a local word list and returns words that can be formed from those letters."],
      ["Can I use blanks or wildcard characters?", "Yes. Use ? or a space as a blank tile."],
      ["What is the maximum word length supported?", "The default page supports up to 15 letters, and advanced filters can narrow the result set."],
      ["Are the results verified for real words?", "Results come from the included local dictionary and should be treated as word candidates."],
      ["Is the Anagram Solver free to use?", "Yes. It runs in your browser and does not require an account."],
    ],
  },
  "word-unscrambler": {
    variant: "unscrambler",
    badge: "Word Solver Tool",
    titlePrefix: "Word",
    titleHighlight: "Unscrambler",
    accent: "#008F83",
    gradient: "linear-gradient(90deg,#0EA6AA,#2F80D8)",
    intro: "Unscramble letters to find all possible words with advanced filtering options.",
    belowPanels: [
      {
        Icon: ClipboardList,
        title: "How It Works",
        body: "Enter scrambled letters, set optional filters, click Unscramble Words, then browse all possible words.",
        accent: "#008F83",
      },
      {
        Icon: Star,
        title: "Pro Tips",
        body: "Try different letter combinations, use filters to narrow results, look for common prefixes and suffixes, and consider shorter words too.",
        accent: "#008F83",
      },
    ],
    infoCards: [
      { Icon: FileText, title: "How to Use Word Unscrambler?", body: "Enter up to 15 scrambled letters, use blanks if needed, then browse results.", accent: "#008F83" },
      { Icon: SlidersHorizontal, title: "Advanced Filtering", body: "Refine results with usage limits, points or length, and dictionary matching.", accent: "#008F83" },
      { Icon: Star, title: "Why Use Our Solver?", body: "Free, instant, accurate, and built for puzzle and word-game players.", accent: "#008F83" },
      { Icon: Users, title: "Who Can Use Word Unscrambler?", body: "Word game players, students, learners, puzzle fans, and trivia players.", accent: "#2F80D8" },
    ],
    related: [
      { href: "/solvers/anagram-solver", label: "Anagram Solver", text: "Find words from messy letters with dictionary-based search.", Icon: RefreshCw, accent: "#008F83", cta: "Use Anagram Solver" },
      { href: "/solvers/scrabble-word-finder", label: "Scrabble Word Finder", text: "Find valid Scrabble words and improve your score.", Icon: ListChecks, accent: "#8A57D6", cta: "Find Words" },
      { href: "/all-solvers", label: "Pattern Solver", text: "Use patterns and wildcards to find words that match.", Icon: ClipboardList, accent: "#E0544F", cta: "Use Pattern Solver" },
      { href: "/solvers/crossword-solver", label: "Crossword Helper", text: "Search by clue or pattern with a practical word helper.", Icon: Search, accent: "#2F80D8", cta: "Open Crossword Helper" },
    ],
    faq: [
      ["Is the Word Unscrambler really free?", "Yes. You can use it without signing in."],
      ["How many letters can I use?", "The default setup is tuned for up to 15 letters so results stay fast."],
      ["How do I use blank tiles?", "Use ? or a space as a blank tile."],
      ["Are the results based on real words?", "Results come from the local dictionary included with this site."],
      ["Do you have a mobile app?", "No separate app is required. The web page is mobile friendly."],
      ["Can I request a hint for a past puzzle?", "You can browse site hint pages, but all daily content is manually maintained."],
    ],
  },
  "scrabble-solver": {
    variant: "scrabble",
    badge: "Word Solver Tool",
    titlePrefix: "Scrabble",
    titleHighlight: "Solver",
    accent: "#008F83",
    gradient: "linear-gradient(90deg,#008F83,#00766D)",
    intro: "Find playable Scrabble words from your rack letters, blank tiles, and optional word filters.",
    belowPanels: [
      {
        Icon: Star,
        title: "Letter Values",
        body: "A,E,I,O,U,L,N,S,T,R = 1; D,G = 2; B,C,M,P = 3; F,H,V,W,Y = 4; K = 5; J,X = 8; Q,Z = 10.",
        accent: "#D99A00",
      },
      {
        Icon: Trophy,
        title: "Scoring Tips",
        body: "Try high-value letters first, save blanks for hard letters, and check short words when the board is tight.",
        accent: "#008F83",
      },
    ],
    infoCards: [
      { Icon: FileText, title: "What is Scrabble Solver?", body: "A Scrabble solver helps turn rack letters and blanks into playable word candidates.", accent: "#008F83" },
      { Icon: ClipboardList, title: "How to Use Scrabble Solver?", body: "Enter your rack letters, use ? for blanks, set optional filters, then find words.", accent: "#008F83" },
      { Icon: Star, title: "Key Features", body: "Rack search, blank tile support, word length filters, and score-based results.", accent: "#008F83" },
      { Icon: Trophy, title: "Why Use Our Solver?", body: "Save time, compare possible plays, and spot words you might miss by hand.", accent: "#008F83" },
      { Icon: Users, title: "Who Can Use This Tool?", body: "Casual players, students, word game fans, and competitive puzzle solvers.", accent: "#008F83" },
    ],
    related: [
      { href: "/solvers/scrabble-word-finder", label: "Scrabble Word Finder", text: "Browse high-scoring Scrabble-style words from rack letters.", Icon: ListChecks, accent: "#3FA34D", cta: "Find Scrabble Words" },
      { href: "/solvers/word-unscrambler", label: "Word Unscrambler", text: "Unscramble mixed letters and filter by word length.", Icon: Shuffle, accent: "#D99A00", cta: "Use Unscrambler" },
      { href: "/solvers/anagram-solver", label: "Anagram Solver", text: "Find rearranged words from any letter set.", Icon: Search, accent: "#008F83", cta: "Use Anagram Solver" },
      { href: "/solvers/words-with-friends-solver", label: "Words With Friends Solver", text: "Find word-game candidates with similar rack logic.", Icon: Star, accent: "#2F80D8", cta: "Try WWF Solver" },
    ],
    faq: [
      ["Is this Scrabble Solver free to use?", "Yes. It runs in your browser and does not require an account."],
      ["Can I use blank tiles?", "Yes. Type ? or use a space for a blank tile."],
      ["How are scores calculated?", "Candidate scores use standard English-language Scrabble-style letter values."],
      ["Can I filter by word length?", "Yes. Open Advanced Options to choose minimum and maximum word lengths."],
      ["Is this an official Scrabble tool?", "No. It is an independent word helper for puzzle and word game practice."],
    ],
  },
  "scrabble-word-finder": {
    variant: "scrabble",
    badge: "Word Solver Tool",
    titlePrefix: "Scrabble",
    titleHighlight: "Word Finder",
    accent: "#008F83",
    gradient: "linear-gradient(90deg,#008F83,#00766D)",
    intro: "Find the highest scoring Scrabble words from your letters with advanced filtering options.",
    belowPanels: [
      {
        Icon: Star,
        title: "Letter Values",
        body: "A,E,I,O,U,L,N,S,T,R = 1; D,G = 2; B,C,M,P = 3; F,H,V,W,Y = 4; K = 5; J,X = 8; Q,Z = 10.",
        accent: "#D99A00",
      },
      {
        Icon: Star,
        title: "Pro Tips",
        body: "Look for high value letters, use prefixes and suffixes, consider two-letter words, and save S for plurals.",
        accent: "#D99A00",
      },
    ],
    infoCards: [
      { Icon: FileText, title: "What is Scrabble?", body: "Scrabble is a word game where players create words on a board using seven letters.", accent: "#008F83" },
      { Icon: ClipboardList, title: "How to Use Scrabble Word Finder?", body: "Enter your letters, adjust filters, choose word length, then find top-scoring words.", accent: "#008F83" },
      { Icon: Star, title: "Key Features", body: "Top-scoring results, word length filters, blank tile support, and fast results.", accent: "#008F83" },
      { Icon: Trophy, title: "Why Use Our Solver?", body: "Save time, improve your score, and find words you may have missed.", accent: "#008F83" },
      { Icon: Users, title: "Who Can Use This Tool?", body: "Students, teachers, word game fans, and competitive players.", accent: "#008F83" },
    ],
    related: [
      { href: "/solvers/anagram-solver", label: "Anagram Solver", text: "Find words from messy letters and any dictionary-based set.", Icon: Search, accent: "#008F83", cta: "Use Anagram Solver" },
      { href: "/solvers/word-unscrambler", label: "Word Unscrambler", text: "Unscramble letters instantly and filter by length.", Icon: Shuffle, accent: "#D99A00", cta: "Use Unscrambler" },
      { href: "/solvers/crossword-solver", label: "Crossword Helper", text: "Solve crossword clues faster with pattern search.", Icon: ClipboardList, accent: "#2F80D8", cta: "Open Crossword Helper" },
      { href: "/all-solvers", label: "Pattern Solver", text: "Use known letters and blanks to find matching words.", Icon: Star, accent: "#E0544F", cta: "Use Pattern Solver" },
    ],
    faq: [
      ["Do you support blank tiles in the solver?", "Yes. Use ? or a space as a blank tile."],
      ["Can I filter results by word length?", "Yes. Open Advanced Options and set a minimum and maximum length."],
      ["Does the solver include two-letter words?", "Yes, the default minimum length is 2 for Scrabble-style searches."],
      ["Is this tool free to use?", "Yes. It is free and runs in your browser."],
      ["Where do the word scores come from?", "Scores use standard English-language tile values for candidate ranking."],
    ],
  },
  "words-with-friends-solver": {
    variant: "wordsWithFriends",
    badge: "Word Solver Tool",
    titlePrefix: "Words With Friends",
    titleHighlight: "Solver",
    accent: "#2F80D8",
    gradient: "linear-gradient(90deg,#2F80D8,#0EA6AA)",
    intro: "Find the highest scoring Words With Friends words from your letters with smart filtering options.",
    belowPanels: [
      {
        Icon: Star,
        title: "Letter Values",
        body: "Words With Friends uses standard Scrabble scoring.",
        values: [
          ["A, E, I, O, U, L, N, S, T, R", "1"],
          ["D, G", "2"],
          ["B, C, M, P", "3"],
          ["F, H, V, W, Y", "4"],
          ["K", "5"],
          ["J, X", "8"],
          ["Q, Z", "10"],
        ],
        accent: "#008F83",
      },
      {
        Icon: Star,
        title: "Pro Tips",
        body: "Play smarter with a few simple rack habits.",
        tips: [
          "Use high-value letters like J, Q, X, Z to maximize your score.",
          "Look for prefixes and suffixes to build longer words.",
          "Consider two-letter words - they can be surprising.",
          "Save blank tiles for high-value plays.",
          "Play words on premium squares for bonus points.",
        ],
        accent: "#D99A00",
      },
    ],
    infoCards: [
      { Icon: FileText, title: "What is Words With Friends?", body: "Learn the basics, rules, and scoring system of WWF.", accent: "#008F83", cta: "Learn more" },
      { Icon: ListChecks, title: "How to Use the Solver?", body: "Step-by-step guide to find the best words easily.", accent: "#8A57D6", cta: "View guide" },
      { Icon: Star, title: "Key Features", body: "Powerful features that make our solver stand out.", accent: "#2F80D8", cta: "Explore features" },
      { Icon: Trophy, title: "Why Use Our Solver?", body: "Discover the benefits of using our smart solver tool.", accent: "#3FA34D", cta: "See benefits" },
      { Icon: Users, title: "Who Can Use This Tool?", body: "Perfect for players of all skill levels and ages.", accent: "#F06423", cta: "Learn more" },
    ],
    related: [
      { href: "/solvers/anagram-solver", label: "Anagram Solver", text: "Find words from mixed letters and maximize your score.", Icon: RefreshCw, accent: "#008F83", cta: "Use Anagram Solver" },
      { href: "/solvers/word-unscrambler", label: "Word Unscrambler", text: "Unscramble letters instantly and find all possible words.", Icon: Shuffle, accent: "#D99A00", cta: "Use Unscrambler" },
      { href: "/solvers/scrabble-word-finder", label: "Scrabble Word Finder", text: "Find valid Scrabble words and top-scoring plays.", Icon: ListChecks, accent: "#3FA34D", cta: "Find Words" },
      { href: "/all-solvers", label: "Pattern Solver", text: "Find words that match your pattern or known letters.", Icon: ClipboardList, accent: "#E0544F", cta: "Use Pattern Solver" },
    ],
    faq: [
      ["Is this Words With Friends Solver free to use?", "Yes. It runs in your browser and does not require an account."],
      ["How accurate are the words and scores?", "Words come from the local dictionary and scores use a Words With Friends-style letter value table."],
      ["Can I use this solver on mobile devices?", "Yes. The input, filters, and results are responsive for phone and desktop screens."],
      ["Does the solver support blank tiles?", "Yes. Use ? or a space as a blank tile."],
      ["How often is the word list updated?", "The current release uses a compact local word list that can be expanded with a larger licensed dictionary later."],
    ],
  },
} as const;

function WordFinderInfoCard({
  Icon,
  title,
  body,
  accent,
  cta,
}: {
  Icon: typeof Search;
  title: string;
  body: string;
  accent: string;
  cta?: string;
}) {
  return (
    <section className="rounded-xl border border-[#E5DED3] bg-[#FFFDF9] p-6 text-center shadow-md shadow-[#315C4C]/5">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl" style={{ backgroundColor: `${accent}18`, color: accent }}>
        <Icon className="h-7 w-7" />
      </span>
      <h2 className="mt-5 text-lg font-black text-[#142436]">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-[#4A5968]">{body}</p>
      {cta ? (
        <span className="mt-5 inline-flex items-center justify-center gap-2 text-sm font-black" style={{ color: accent }}>
          {cta} <ArrowRight className="h-4 w-4" />
        </span>
      ) : null}
    </section>
  );
}

function WordFinderMarketingPage({ solver }: { solver: NonNullable<ReturnType<typeof getSolver>> }) {
  const config = wordFinderPageConfig[solver.slug as keyof typeof wordFinderPageConfig];
  if (!config) return null;
  const path = `/solvers/${solver.slug}`;
  const faq = config.faq.map(([question, answer]) => ({ question, answer }));
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  };

  return (
    <article className="-mt-10">
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "All Solvers", url: "/all-solvers" }, { name: solver.name, url: path }])} />
      <JsonLd data={faqSchema} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: solver.name, url: absoluteUrl(path), applicationCategory: "GameApplication", isAccessibleForFree: true }} />

      <section className="relative mx-[calc(50%-50vw)] overflow-hidden bg-[radial-gradient(circle_at_50%_0%,#F1FBFA_0%,#F8F5EF_56%,#F8F5EF_100%)] px-4 py-14">
        <div className="pointer-events-none absolute -left-8 top-20 hidden h-40 w-40 opacity-35 md:block [background-image:radial-gradient(#00A39A_1.4px,transparent_1.4px)] [background-size:14px_14px]" />
        <div className="pointer-events-none absolute -right-20 top-20 hidden h-64 w-64 rounded-full bg-[#DDF4F1] md:block" />
        <div className="pointer-events-none absolute right-8 top-16 hidden h-32 w-32 opacity-25 md:block [background-image:radial-gradient(#00A39A_1.4px,transparent_1.4px)] [background-size:14px_14px]" />
        <div className="mx-auto max-w-6xl">
          <header className="text-center">
            <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-[#DFF6F0] px-4 py-2 text-sm font-black text-[#008F83]">
              {config.badge}
            </p>
            <h1 className="mt-5 text-5xl font-black leading-tight text-[#142436] sm:text-6xl">
              {config.titlePrefix} <span style={{ color: config.accent }}>{config.titleHighlight}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-[#4A5968]">{config.intro}</p>
          </header>

          <section className="mx-auto mt-10 max-w-5xl" aria-label={`${solver.name} workspace`}>
            <Suspense fallback={<div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-sm">Loading {solver.name}...</div>}>
              <WordFinderToolClient variant={config.variant as WordFinderVariant} />
            </Suspense>
          </section>

          <section className="mx-auto mt-6 grid max-w-5xl gap-5 md:grid-cols-2">
            {config.belowPanels.map((panel) => (
              <div key={panel.title} className="rounded-xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-md shadow-[#315C4C]/5">
                <div className="flex items-start gap-5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full" style={{ backgroundColor: `${panel.accent}18`, color: panel.accent }}>
                    <panel.Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h2 className="text-xl font-black text-[#142436]">{panel.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-[#4A5968]">{panel.body}</p>
                    {"values" in panel ? (
                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {panel.values.map(([letters, score]) => (
                          <div key={letters} className="flex items-center justify-between rounded-lg border border-[#E5DED3] bg-white px-3 py-2 font-mono text-xs font-black text-[#344153]">
                            <span>{letters}</span>
                            <span>{score}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    {"tips" in panel ? (
                      <ul className="mt-4 grid gap-2 text-sm leading-6 text-[#4A5968]">
                        {panel.tips.map((tip) => (
                          <li key={tip} className="flex gap-2">
                            <span className="text-[#008F83]">&bull;</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </section>

      <section className={`mx-auto mt-8 grid max-w-6xl gap-5 ${config.infoCards.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-5"}`}>
        {config.infoCards.map((card) => (
          <WordFinderInfoCard key={card.title} Icon={card.Icon} title={card.title} body={card.body} accent={card.accent} cta={"cta" in card ? card.cta : undefined} />
        ))}
      </section>

      <section className="mx-auto mt-10 max-w-6xl">
        <h2 className="text-center text-3xl font-black text-[#142436]">
          Explore More <span className="text-[#008F83]">Word Solvers</span>
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {config.related.map(({ href, label, text, Icon, accent, cta }) => (
            <Link key={label} href={href} className="group rounded-xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-md shadow-[#315C4C]/5 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-xl" style={{ backgroundColor: `${accent}18`, color: accent }}>
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="text-lg font-black text-[#142436]">{label}</h3>
              </div>
              <p className="mt-5 min-h-14 text-sm leading-6 text-[#68645E]">{text}</p>
              <span className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-black" style={{ borderColor: accent, color: accent }}>
                {cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-5xl">
        <h2 className="text-center text-3xl font-black text-[#142436]">
          FAQs About <span className="text-[#008F83]">{solver.name}</span>
        </h2>
        <div className={`mt-5 grid gap-0 overflow-hidden rounded-xl border border-[#E5DED3] bg-[#FFFDF9] shadow-sm ${solver.slug === "word-unscrambler" ? "md:grid-cols-2" : ""}`}>
          {faq.map((item) => (
            <details key={item.question} className="group border-b border-[#E5DED3] p-4 last:border-b-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-[#142436]">
                {item.question}
                <ArrowRight className="h-4 w-4 text-[#008F83] transition group-open:rotate-90" />
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

const scrabbleSolverFaq = [
  { question: "Is this Scrabble Solver free to use?", answer: "Yes. It runs in your browser and does not require an account." },
  { question: "Does the solver consider premium squares?", answer: "Use the board pattern field to model letters already on the board. Score bonuses can still vary by exact board position." },
  { question: "Can I use blank tiles represented by ?", answer: "Yes. Type ? or use a space as a blank tile in your rack." },
  { question: "How are the words ranked?", answer: "Results are ranked by Scrabble-style letter score, then by length and alphabetically." },
  { question: "Is this tool available on mobile devices?", answer: "Yes. The rack fields, filters, and results are responsive on mobile and desktop screens." },
];

function ScrabbleSolverPage({ solver }: { solver: NonNullable<ReturnType<typeof getSolver>> }) {
  const path = `/solvers/${solver.slug}`;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: scrabbleSolverFaq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  };
  const letterValues = [
    ["A, E, I, O, U, L, N, S, T, R", "1"],
    ["D, G", "2"],
    ["B, C, M, P", "3"],
    ["F, H, V, W, Y", "4"],
    ["K", "5"],
    ["J, X", "8"],
    ["Q, Z", "10"],
  ];
  const relatedTools = [
    { href: "/solvers/anagram-solver", label: "Anagram Solver", points: ["Find words from mixed letters", "Word forms and variations", "Maximize your score"], Icon: Shuffle, accent: "#3FA34D", cta: "Try Anagram Solver" },
    { href: "/solvers/word-unscrambler", label: "Word Unscrambler", points: ["Unscramble letters instantly", "All possible word combinations", "Sort by length or score"], Icon: ListChecks, accent: "#2F80D8", cta: "Try Unscrambler" },
    { href: "/solvers/crossword-solver", label: "Crossword Helper", points: ["Find words by pattern length", "Get fitting words for clues", "Supports blanks and patterns"], Icon: ClipboardList, accent: "#8A57D6", cta: "Try Crossword Helper" },
    { href: "/all-solvers", label: "Pattern Solver", points: ["Match specific letter patterns", "Use ? for unknown letters", "Great for tricky puzzles"], Icon: Star, accent: "#D99A00", cta: "Try Pattern Solver" },
  ];

  return (
    <article className="-mt-10">
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "All Solvers", url: "/all-solvers" }, { name: solver.name, url: path }])} />
      <JsonLd data={faqSchema} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: solver.name, url: absoluteUrl(path), applicationCategory: "GameApplication", isAccessibleForFree: true }} />

      <section className="relative mx-[calc(50%-50vw)] overflow-hidden bg-[radial-gradient(circle_at_50%_0%,#F1FBFA_0%,#F8F5EF_56%,#F8F5EF_100%)] px-4 py-14">
        <div className="pointer-events-none absolute -left-8 top-24 hidden h-44 w-44 opacity-35 md:block [background-image:radial-gradient(#2F80D8_1.4px,transparent_1.4px)] [background-size:14px_14px]" />
        <div className="pointer-events-none absolute -right-20 top-24 hidden h-64 w-64 rounded-full bg-[#DDF4F1] md:block" />
        <div className="pointer-events-none absolute right-8 top-20 hidden h-32 w-32 opacity-25 md:block [background-image:radial-gradient(#2F80D8_1.4px,transparent_1.4px)] [background-size:14px_14px]" />

        <div className="mx-auto max-w-6xl">
          <header className="text-center">
            <p className="mx-auto inline-flex items-center gap-2 rounded-lg border border-[#008F83] bg-[#F1FAF8] px-4 py-2 text-sm font-black text-[#008F83]">
              Word Solver Tool
            </p>
            <h1 className="mt-5 text-5xl font-black leading-tight text-[#142436] sm:text-6xl">
              Scrabble <span className="text-[#008F83]">Solver</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#4A5968]">
              Find high-scoring Scrabble words from your letters with smart filtering and board-aware search.
            </p>
          </header>

          <section className="mx-auto mt-10 max-w-5xl" aria-label="Scrabble Solver workspace">
            <Suspense fallback={<div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-sm">Loading Scrabble Solver...</div>}>
              <ScrabbleSolverClient />
            </Suspense>
          </section>

          <section className="mx-auto mt-6 grid max-w-5xl gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-md shadow-[#315C4C]/5">
              <h2 className="text-xl font-black text-[#142436]">Letter Values</h2>
              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-7">
                {letterValues.map(([letters, score]) => (
                  <div key={score} className="rounded-lg border border-[#E5DED3] bg-white p-3 text-center">
                    <p className="min-h-10 text-xs font-black leading-4 text-[#142436]">{letters}</p>
                    <p className="mt-2 text-2xl font-black text-[#008F83]">{score}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-md shadow-[#315C4C]/5">
              <h2 className="text-xl font-black text-[#142436]">Pro Tips</h2>
              <ul className="mt-5 grid gap-2 text-sm leading-6 text-[#344153]">
                {["Use high-value letters like Q, Z, J, and X when possible.", "Look for prefixes and suffixes to build longer words.", "Save blank tiles for tricky spots or high-value plays.", "Check for bingo opportunities with 7+ letter words.", "Consider premium squares on the board for maximum score."].map((tip) => (
                  <li key={tip} className="flex gap-2">
                    <span className="text-[#008F83]">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <WordFinderInfoCard Icon={FileText} title="What is Scrabble Solver?" body="Find the best Scrabble words from your letters using smart dictionary and advanced filtering." accent="#008F83" />
        <WordFinderInfoCard Icon={ClipboardList} title="How to Use It?" body="Enter your rack letters, add board letters if needed, then find ranked scoring results." accent="#2F80D8" />
        <WordFinderInfoCard Icon={SlidersHorizontal} title="Advanced Filtering" body="Refine results by starting letters, word length, required letters, or excluded letters." accent="#8A57D6" />
        <WordFinderInfoCard Icon={Trophy} title="Why Use Our Solver?" body="Get accurate, fast, high-scoring word results with a clean interface and helpful tips." accent="#D99A00" />
        <WordFinderInfoCard Icon={Users} title="Who Can Use This Tool?" body="Perfect for Scrabble players of all levels, from casual players to competitive wordsmiths." accent="#E0544F" />
      </section>

      <section className="mx-auto mt-10 max-w-6xl">
        <h2 className="text-center text-3xl font-black text-[#142436]">
          Explore More <span className="text-[#008F83]">Word Solvers</span>
        </h2>
        <p className="mt-2 text-center text-sm text-[#68645E]">Try our collection of powerful tools for every word puzzle challenge.</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {relatedTools.map(({ href, label, points, Icon, accent, cta }) => (
            <Link key={label} href={href} className="group rounded-xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-md shadow-[#315C4C]/5 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-xl" style={{ backgroundColor: `${accent}18`, color: accent }}>
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="text-lg font-black text-[#142436]">{label}</h3>
              </div>
              <ul className="mt-5 grid gap-2 text-sm text-[#68645E]">
                {points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span style={{ color: accent }}>✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <span className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-black" style={{ borderColor: accent, color: accent }}>
                {cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-5xl">
        <h2 className="text-center text-3xl font-black text-[#142436]">
          FAQs About <span className="text-[#008F83]">Scrabble Solver</span>
        </h2>
        <div className="mt-5 divide-y divide-[#E5DED3] overflow-hidden rounded-xl border border-[#E5DED3] bg-[#FFFDF9] shadow-sm">
          {scrabbleSolverFaq.map((item) => (
            <details key={item.question} className="group p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-[#142436]">
                {item.question}
                <ArrowRight className="h-4 w-4 text-[#008F83] transition group-open:rotate-90" />
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

const quordleFaq = [
  {
    question: "What is Quordle?",
    answer: "Quordle is a word puzzle where you solve four five-letter words at the same time using shared guesses.",
  },
  {
    question: "Is Quordle made by The New York Times?",
    answer: "No. This helper is independent and is not affiliated with any official puzzle publisher.",
  },
  {
    question: "Where can I play Quordle today?",
    answer: "Play Quordle on its official game site, then use this page to reason through possible word candidates.",
  },
  {
    question: "How do I get a Quordle hint today?",
    answer: "Enter green, yellow, and gray clues from your board. The solver will narrow possible five-letter words.",
  },
  {
    question: "Does Quordle repeat old puzzles?",
    answer: "Puzzle schedules vary by publisher. This site does not scrape or store official Quordle answers.",
  },
];

function QuordleInfoCard({
  Icon,
  title,
  children,
}: {
  Icon: typeof Search;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[#E5DED3] bg-[#FFFDF9] p-6 text-center shadow-md shadow-[#315C4C]/5">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#DDF8ED] text-[#12A37F]">
        <Icon className="h-8 w-8" />
      </span>
      <h2 className="mt-5 text-xl font-black text-[#142436]">{title}</h2>
      <div className="mt-3 text-sm leading-7 text-[#4A5968]">{children}</div>
    </section>
  );
}

function QuordleSolverPage() {
  const path = "/solvers/quordle-solver";
  const relatedTools = [
    { href: "/solvers/anagram-solver", label: "Anagram Solver", points: ["Find words from letters", "Perfect for anagram games", "Fast and easy results"], Icon: Shuffle, accent: "#8A57D6", cta: "Try Anagram Solver" },
    { href: "/solvers/word-unscrambler", label: "Word Unscrambler", points: ["Unscramble any letters", "Discover all possible words", "Great for word games"], Icon: RefreshCw, accent: "#2F80D8", cta: "Try Unscrambler" },
    { href: "/all-solvers", label: "Pattern Solver", points: ["Find words by pattern", "Use ? for unknown letters", "Supports custom lengths"], Icon: ListChecks, accent: "#12A37F", cta: "Try Pattern Solver" },
    { href: "/solvers/crossword-solver", label: "Crossword Helper", points: ["Solve crossword clues", "Get suggestions fast", "Boost your puzzle skills"], Icon: ClipboardList, accent: "#F06423", cta: "Try Crossword Helper" },
  ];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: quordleFaq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  };

  return (
    <article className="-mt-10">
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "All Solvers", url: "/all-solvers" }, { name: "Quordle Solver", url: path }])} />
      <JsonLd data={faqSchema} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "Quordle Solver", url: absoluteUrl(path), applicationCategory: "GameApplication", isAccessibleForFree: true }} />

      <section className="relative mx-[calc(50%-50vw)] overflow-hidden bg-[radial-gradient(circle_at_50%_0%,#F8FBFF_0%,#F8F5EF_58%,#F8F5EF_100%)] px-4 py-14">
        <div className="pointer-events-none absolute -left-8 top-28 hidden h-36 w-36 opacity-30 md:block [background-image:radial-gradient(#12A37F_1.4px,transparent_1.4px)] [background-size:14px_14px]" />
        <div className="pointer-events-none absolute right-10 top-24 hidden h-32 w-32 opacity-30 md:block [background-image:radial-gradient(#ED3F68_1.4px,transparent_1.4px)] [background-size:14px_14px]" />
        <div className="mx-auto max-w-6xl">
          <header className="text-center">
            <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-[#FFE8EF] px-4 py-2 text-sm font-black text-[#ED3F68]">
              Word Solver Tool
            </p>
            <h1 className="mt-5 text-5xl font-black leading-tight text-[#142436] sm:text-6xl">
              Quordle <span className="text-[#ED3F68]">Solver</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#4A5968]">
              Enter your known letters and constraints to find the perfect Quordle solution.
            </p>
          </header>

          <section className="mt-10" aria-label="Quordle Solver workspace">
            <Suspense fallback={<div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-sm">Loading Quordle Solver...</div>}>
              <QuordleSolverClient />
            </Suspense>
          </section>

          <section className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-md shadow-[#315C4C]/5">
              <div className="flex items-start gap-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#FFE8EF] text-[#ED3F68]">
                  <Star className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="text-xl font-black text-[#142436]">Pro Tips</h2>
                  <ul className="mt-4 grid gap-2 text-sm leading-6 text-[#4A5968]">
                    <li>Start broad, then narrow down with each guess.</li>
                    <li>Use words with common vowels and consonants early.</li>
                    <li>Read every clue carefully because colors are key.</li>
                    <li>Save your last few guesses for the solver.</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-md shadow-[#315C4C]/5">
              <div className="flex items-start gap-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#DFF6F0] text-[#008F83]">
                  <FileText className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="text-xl font-black text-[#142436]">How to Use</h2>
                  <div className="mt-4 grid gap-2 text-sm leading-6 text-[#4A5968]">
                    <p><strong className="text-[#12A37F]">Green:</strong> Letter is correct and in the right position.</p>
                    <p><strong className="text-[#D99A00]">Yellow:</strong> Letter is in the word but wrong position.</p>
                    <p><strong className="text-[#68645E]">Gray:</strong> Letter is not in the word.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <QuordleInfoCard Icon={Search} title="What is Quordle?">
          <p>Quordle is a daily word puzzle where you solve four five-letter words simultaneously.</p>
        </QuordleInfoCard>
        <QuordleInfoCard Icon={FileText} title="What is Quordle Solver and How to Use It?">
          <p>Our solver helps you find possible words based on the letters you know and clues from your guesses.</p>
        </QuordleInfoCard>
        <QuordleInfoCard Icon={Star} title="Need a Quordle Hint Today">
          <p>Get instant hints and shortlists to keep your streak alive and solve today&apos;s puzzle faster.</p>
        </QuordleInfoCard>
        <QuordleInfoCard Icon={Trophy} title="Features That Set the Quordle Solver Apart">
          <p>No account required, color-based input, unlimited use, and fast results across all four grids.</p>
        </QuordleInfoCard>
        <QuordleInfoCard Icon={ListChecks} title="Summary">
          <p>Use smart strategies and our solver to solve Quordle faster and build your winning streak.</p>
        </QuordleInfoCard>
      </section>

      <section className="mx-auto mt-10 max-w-6xl">
        <h2 className="text-center text-3xl font-black text-[#142436]">
          Explore <span className="text-[#12A37F]">More</span> Word Solvers
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {relatedTools.map(({ href, label, points, Icon, accent, cta }) => (
            <Link key={label} href={href} className="group rounded-xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-md shadow-[#315C4C]/5 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-full" style={{ backgroundColor: `${accent}18`, color: accent }}>
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="text-lg font-black" style={{ color: accent }}>{label}</h3>
              </div>
              <ul className="mt-5 grid gap-2 text-sm text-[#344153]">
                {points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span>&bull;</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <span className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-black" style={{ borderColor: `${accent}66`, backgroundColor: `${accent}10`, color: accent }}>
                {cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-5xl">
        <p className="mx-auto w-fit rounded-full bg-[#DFF6F0] px-4 py-1 text-xs font-black uppercase text-[#008F83]">FAQ</p>
        <h2 className="mt-3 text-center text-3xl font-black text-[#142436]">
          Frequently Asked <span className="text-[#12A37F]">Questions</span>
        </h2>
        <div className="mt-5 divide-y divide-[#E5DED3] overflow-hidden rounded-xl border border-[#E5DED3] bg-[#FFFDF9] shadow-sm">
          {quordleFaq.map((item) => (
            <details key={item.question} className="group p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-[#142436]">
                {item.question}
                <ArrowRight className="h-4 w-4 text-[#008F83] transition group-open:rotate-90" />
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

const crosswordFaq = [
  {
    question: "How does the Crossword Solver work?",
    answer: "It filters a local word list by known-letter pattern, clue text, starts-with, ends-with, and contains filters.",
  },
  {
    question: "Can I use letter patterns with unknown letters?",
    answer: "Yes. Use ? for unknown letters, such as P?ZZ?E.",
  },
  {
    question: "How accurate are the answers provided?",
    answer: "Results are candidate words from the local dictionary. Use the clue and crossing letters to choose the best fit.",
  },
  {
    question: "Is the Crossword Solver free to use?",
    answer: "Yes. It runs in your browser and does not require an account.",
  },
  {
    question: "Can I filter answers by length or start letter?",
    answer: "Yes. A pattern controls exact length, and advanced filters can narrow by start, end, or contained letters.",
  },
];

function CrosswordInfoCard({
  Icon,
  title,
  children,
  accent,
}: {
  Icon: typeof Search;
  title: string;
  children: React.ReactNode;
  accent: string;
}) {
  return (
    <section className="rounded-xl border border-[#E5DED3] bg-[#FFFDF9] p-6 text-center shadow-md shadow-[#315C4C]/5">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-xl" style={{ color: accent }}>
        <Icon className="h-12 w-12" />
      </span>
      <h2 className="mt-5 text-lg font-black text-[#142436]">{title}</h2>
      <div className="mt-3 text-sm leading-7 text-[#4A5968]">{children}</div>
    </section>
  );
}

function CrosswordSolverPage() {
  const path = "/solvers/crossword-solver";
  const relatedTools = [
    { href: "/solvers/anagram-solver", label: "Anagram Solver", text: "Find words from letters and solve anagrams.", Icon: RefreshCw, accent: "#008F83", cta: "Open" },
    { href: "/solvers/word-unscrambler", label: "Word Unscrambler", text: "Unscramble letters to discover words.", Icon: Shuffle, accent: "#D99A00", cta: "Open" },
    { href: "/all-solvers", label: "Pattern Solver", text: "Find words that match your letter pattern.", Icon: ListChecks, accent: "#E0544F", cta: "Open" },
    { href: "/solvers/scrabble-word-finder", label: "Scrabble Word Finder", text: "Find high-scoring words for your next move.", Icon: ClipboardList, accent: "#2F80D8", cta: "Open" },
  ];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: crosswordFaq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  };

  return (
    <article className="-mt-10">
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "All Solvers", url: "/all-solvers" }, { name: "Crossword Solver", url: path }])} />
      <JsonLd data={faqSchema} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "Crossword Solver", url: absoluteUrl(path), applicationCategory: "GameApplication", isAccessibleForFree: true }} />

      <section className="relative mx-[calc(50%-50vw)] overflow-hidden bg-[radial-gradient(circle_at_50%_0%,#F1FBFA_0%,#F8F5EF_58%,#F8F5EF_100%)] px-4 py-14">
        <div className="pointer-events-none absolute -left-8 top-20 hidden h-40 w-40 opacity-35 md:block [background-image:radial-gradient(#00A39A_1.4px,transparent_1.4px)] [background-size:14px_14px]" />
        <div className="pointer-events-none absolute -right-20 top-24 hidden h-64 w-64 rounded-full bg-[#DDF4F1] md:block" />
        <div className="pointer-events-none absolute right-8 top-14 hidden h-32 w-32 opacity-25 md:block [background-image:radial-gradient(#00A39A_1.4px,transparent_1.4px)] [background-size:14px_14px]" />
        <div className="mx-auto max-w-6xl">
          <header className="text-center">
            <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#008F83]/40 bg-[#F1FBFA] px-5 py-2 text-sm font-black text-[#008F83]">
              Word Solver Tool
            </p>
            <h1 className="mt-5 text-5xl font-black leading-tight text-[#142436] sm:text-6xl">
              Crossword <span className="text-[#008F83]">Solver</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#4A5968]">
              Solve crossword clues instantly with our comprehensive word database and intelligent matching system.
            </p>
          </header>

          <section className="mx-auto mt-10 max-w-5xl" aria-label="Crossword Solver workspace">
            <Suspense fallback={<div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-sm">Loading Crossword Solver...</div>}>
              <CrosswordSolverClient />
            </Suspense>
          </section>

          <section className="mx-auto mt-6 grid max-w-5xl gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-md shadow-[#315C4C]/5">
              <div className="flex items-start gap-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#D4CABD] text-[#142436]">
                  <Search className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-xl font-black text-[#142436]">How It Works</h2>
                  <ol className="mt-4 grid gap-2 text-sm leading-6 text-[#4A5968]">
                    <li><strong className="mr-2 rounded-full bg-[#008F83] px-2 py-0.5 text-white">1</strong>Enter the crossword clue</li>
                    <li><strong className="mr-2 rounded-full bg-[#008F83] px-2 py-0.5 text-white">2</strong>Add letter pattern if known</li>
                    <li><strong className="mr-2 rounded-full bg-[#008F83] px-2 py-0.5 text-white">3</strong>Set additional filters</li>
                    <li><strong className="mr-2 rounded-full bg-[#008F83] px-2 py-0.5 text-white">4</strong>Get ranked solutions</li>
                  </ol>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-md shadow-[#315C4C]/5">
              <div className="flex items-start gap-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-[#142436]">
                  <ListChecks className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="text-xl font-black text-[#142436]">Pattern Examples</h2>
                  <div className="mt-4 grid gap-3 text-sm leading-6 text-[#4A5968]">
                    <p><code className="rounded-lg bg-[#DFF6F0] px-3 py-1 font-mono font-black text-[#008F83]">P?ZZ?E</code> - 6 letters, starts with P</p>
                    <p><code className="rounded-lg bg-[#DFF6F0] px-3 py-1 font-mono font-black text-[#008F83]">?A?P</code> - 4 letters, A in middle</p>
                    <p><code className="rounded-lg bg-[#DFF6F0] px-3 py-1 font-mono font-black text-[#008F83]">C?T</code> - 3 letters, starts C, ends T</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <CrosswordInfoCard Icon={ClipboardList} title="What is Crossword Solver?" accent="#008F83">
          <p>Find answers to any crossword clue using our local word list and smart matching technology.</p>
        </CrosswordInfoCard>
        <CrosswordInfoCard Icon={Trophy} title="How to Use It?" accent="#8A57D6">
          <p>Enter your clue, add known letters, and let the solver find matching answers instantly.</p>
        </CrosswordInfoCard>
        <CrosswordInfoCard Icon={ListChecks} title="Advanced Matching" accent="#D99A00">
          <p>Our filtering considers pattern, length, starts-with, ends-with, and required letters.</p>
        </CrosswordInfoCard>
        <CrosswordInfoCard Icon={Star} title="Why Use Our Solver?" accent="#3FA34D">
          <p>Fast, reliable, and regularly improved with practical word-game data.</p>
        </CrosswordInfoCard>
        <CrosswordInfoCard Icon={Users} title="Who Can Use This Tool?" accent="#2F80D8">
          <p>Perfect for crossword enthusiasts, students, and anyone who loves word puzzles.</p>
        </CrosswordInfoCard>
      </section>

      <section className="mx-auto mt-10 max-w-6xl">
        <h2 className="text-center text-3xl font-black text-[#142436]">
          Explore More <span className="text-[#008F83]">Word Solvers</span>
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {relatedTools.map(({ href, label, text, Icon, accent, cta }) => (
            <Link key={label} href={href} className="group rounded-xl border p-6 shadow-md shadow-[#315C4C]/5 hover:-translate-y-1 hover:shadow-lg" style={{ borderColor: `${accent}66`, backgroundColor: `${accent}0D` }}>
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-xl" style={{ backgroundColor: `${accent}18`, color: accent }}>
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="text-lg font-black text-[#142436]">{label}</h3>
              </div>
              <p className="mt-4 min-h-12 text-sm leading-6 text-[#344153]">{text}</p>
              <span className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-white" style={{ borderColor: accent, color: accent }} aria-label={cta}>
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-5xl">
        <h2 className="text-center text-3xl font-black text-[#142436]">
          FAQs About <span className="text-[#008F83]">Crossword Solver</span>
        </h2>
        <div className="mt-5 divide-y divide-[#E5DED3] overflow-hidden rounded-xl border border-[#E5DED3] bg-[#FFFDF9] shadow-sm">
          {crosswordFaq.map((item) => (
            <details key={item.question} className="group p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-[#142436]">
                {item.question}
                <ArrowRight className="h-4 w-4 text-[#008F83] transition group-open:rotate-90" />
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

const jumbleFaq = [
  {
    question: "What is Jumble Solver?",
    answer: "Jumble Solver helps unscramble jumbled letters into word candidates and suggests final answer possibilities.",
  },
  {
    question: "How do I use Jumble Solver?",
    answer: "Enter the scrambled words, add the final clue if you have it, then click Solve Jumble.",
  },
  {
    question: "Do I need to provide the clue?",
    answer: "No. The clue is optional, but it can help you choose better final answer candidates.",
  },
  {
    question: "Is Jumble Solver free to use?",
    answer: "Yes. It is free and runs in your browser using a local word list.",
  },
  {
    question: "Can Jumble Solver solve every puzzle?",
    answer: "It provides candidates from the included dictionary. Use the clue and puzzle context to pick the best answer.",
  },
];

function JumbleInfoCard({
  Icon,
  title,
  children,
  accent,
}: {
  Icon: typeof Search;
  title: string;
  children: React.ReactNode;
  accent: string;
}) {
  return (
    <section className="rounded-xl border border-[#E5DED3] bg-[#FFFDF9] p-6 text-center shadow-md shadow-[#315C4C]/5">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-xl" style={{ color: accent }}>
        <Icon className="h-10 w-10" />
      </span>
      <h2 className="mt-5 text-lg font-black text-[#142436]">{title}</h2>
      <div className="mt-3 text-sm leading-7 text-[#4A5968]">{children}</div>
    </section>
  );
}

function JumbleSolverPage() {
  const path = "/solvers/jumble-solver";
  const relatedTools = [
    { href: "/solvers/anagram-solver", label: "Anagram Solver", points: ["Find words from scrambled letters", "Great for anagram and jumble games", "Instant results and suggestions"], Icon: Shuffle, accent: "#008F83", cta: "Try Anagram Solver" },
    { href: "/solvers/word-unscrambler", label: "Word Unscrambler", points: ["Unscramble letters into valid words", "Supports long and short words", "Perfect for any word puzzle"], Icon: Star, accent: "#8A57D6", cta: "Try Word Unscrambler" },
    { href: "/solvers/crossword-solver", label: "Crossword Helper", points: ["Find answers for crossword clues", "Search by length or known letters", "Boost your crossword skills"], Icon: ClipboardList, accent: "#F39C12", cta: "Try Crossword Helper" },
    { href: "/all-solvers", label: "Pattern Solver", points: ["Find words that match patterns", "Use ? or _ as wildcard letters", "Ideal for word game players"], Icon: ListChecks, accent: "#56B23F", cta: "Try Pattern Solver" },
  ];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: jumbleFaq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  };

  return (
    <article className="-mt-10">
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "All Solvers", url: "/all-solvers" }, { name: "Jumble Solver", url: path }])} />
      <JsonLd data={faqSchema} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "Jumble Solver", url: absoluteUrl(path), applicationCategory: "GameApplication", isAccessibleForFree: true }} />

      <section className="relative mx-[calc(50%-50vw)] overflow-hidden bg-[radial-gradient(circle_at_50%_0%,#F8FBFF_0%,#F8F5EF_58%,#F8F5EF_100%)] px-4 py-14">
        <div className="pointer-events-none absolute -left-8 top-24 hidden h-40 w-40 opacity-30 md:block [background-image:radial-gradient(#8BBED0_1.4px,transparent_1.4px)] [background-size:16px_16px]" />
        <div className="pointer-events-none absolute -right-20 top-20 hidden h-64 w-64 rounded-full bg-[#DDF4F1] md:block" />
        <div className="pointer-events-none absolute right-8 top-16 hidden h-32 w-32 opacity-30 md:block [background-image:radial-gradient(#8BBED0_1.4px,transparent_1.4px)] [background-size:16px_16px]" />
        <div className="mx-auto max-w-6xl">
          <header className="text-center">
            <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-[#FFE4D8] px-5 py-2 text-sm font-black text-[#F06423]">
              Word Solver Tool
            </p>
            <h1 className="mt-5 text-5xl font-black leading-tight text-[#142436] sm:text-6xl">
              Jumble <span className="text-[#F06423]">Solver</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#4A5968]">
              Solve daily jumble puzzles instantly by unscrambling words and finding the final answer.
            </p>
          </header>

          <section className="mx-auto mt-10 max-w-4xl" aria-label="Jumble Solver workspace">
            <Suspense fallback={<div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-sm">Loading Jumble Solver...</div>}>
              <JumbleSolverClient />
            </Suspense>
          </section>

          <section className="mx-auto mt-6 grid max-w-4xl gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-md shadow-[#315C4C]/5">
              <div className="flex items-start gap-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[#AEE5DF] text-[#008F83]">
                  <ClipboardList className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-xl font-black text-[#142436]">How It Works</h2>
                  <ol className="mt-4 grid gap-2 text-sm leading-6 text-[#4A5968]">
                    <li><strong className="mr-2 rounded-full border border-[#008F83] px-2 py-0.5 text-[#008F83]">1</strong>Enter the scrambled words</li>
                    <li><strong className="mr-2 rounded-full border border-[#008F83] px-2 py-0.5 text-[#008F83]">2</strong>Add the final clue (optional)</li>
                    <li><strong className="mr-2 rounded-full border border-[#008F83] px-2 py-0.5 text-[#008F83]">3</strong>Click Solve Jumble</li>
                    <li><strong className="mr-2 rounded-full border border-[#008F83] px-2 py-0.5 text-[#008F83]">4</strong>Get unscrambled words and final answer</li>
                  </ol>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-md shadow-[#315C4C]/5">
              <div className="flex items-start gap-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#FFF4D8] text-[#F39C12]">
                  <Star className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-xl font-black text-[#142436]">Jumble Tips</h2>
                  <ul className="mt-4 grid gap-2 text-sm leading-6 text-[#4A5968]">
                    <li className="flex gap-2"><span className="text-[#F06423]">&bull;</span>Look for common letter patterns</li>
                    <li className="flex gap-2"><span className="text-[#F06423]">&bull;</span>Try different vowel positions</li>
                    <li className="flex gap-2"><span className="text-[#F06423]">&bull;</span>Consider word endings like -ING, -ED</li>
                    <li className="flex gap-2"><span className="text-[#F06423]">&bull;</span>Use the final clue for context</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <JumbleInfoCard Icon={FileText} title="What is Jumble?" accent="#008F83">
          <p>Jumble is a popular word puzzle that challenges you to unscramble letters and solve the final mystery word using a helpful clue.</p>
        </JumbleInfoCard>
        <JumbleInfoCard Icon={SlidersHorizontal} title="How to Use Jumble Solver?" accent="#8A57D6">
          <p>Enter scrambled words and an optional clue. Our tool quickly finds possible solutions and the final answer.</p>
        </JumbleInfoCard>
        <JumbleInfoCard Icon={Users} title="Who Can Use Jumble Solver?" accent="#2F80D8">
          <p>Students, puzzle lovers, and word game players of all ages can use Jumble Solver to learn and have fun.</p>
        </JumbleInfoCard>
        <JumbleInfoCard Icon={Trophy} title="Why Use Our Solver?" accent="#F39C12">
          <p>Fast, accurate, and easy to use. Save time and improve your vocabulary with smart solving help.</p>
        </JumbleInfoCard>
        <JumbleInfoCard Icon={ListChecks} title="Summary" accent="#56B23F">
          <p>Jumble Solver helps you unscramble words and solve the puzzle with confidence and ease every day.</p>
        </JumbleInfoCard>
      </section>

      <section className="mx-auto mt-10 max-w-6xl">
        <h2 className="text-center text-3xl font-black text-[#142436]">
          Explore More <span className="text-[#008F83]">Word Solvers</span>
        </h2>
        <p className="mt-2 text-center text-sm text-[#68645E]">Try our other powerful tools to solve any word puzzle with ease.</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {relatedTools.map(({ href, label, points, Icon, accent, cta }) => (
            <Link key={label} href={href} className="group rounded-xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-md shadow-[#315C4C]/5 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-xl text-white" style={{ backgroundColor: accent }}>
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="text-lg font-black text-[#142436]">{label}</h3>
              </div>
              <ul className="mt-5 grid gap-2 text-sm text-[#344153]">
                {points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span style={{ color: accent }}>&bull;</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <span className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-black text-white" style={{ backgroundColor: accent }}>
                {cta}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-5xl">
        <h2 className="text-center text-3xl font-black text-[#142436]">
          FAQs About <span className="text-[#008F83]">Jumble Solver</span>
        </h2>
        <div className="mt-5 divide-y divide-[#E5DED3] overflow-hidden rounded-xl border border-[#E5DED3] bg-[#FFFDF9] shadow-sm">
          {jumbleFaq.map((item, index) => (
            <details key={item.question} className="group p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-[#142436]">
                <span>{index + 1}. {item.question}</span>
                <ArrowRight className="h-4 w-4 text-[#008F83] transition group-open:rotate-90" />
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

export default function SolverPage({ params }: Props) {
  const solver = getSolver(params.slug);
  if (!solver || !solver.implemented || solver.inputType === "directory") notFound();
  if (solver.slug === "wordle-solver") return <WordleSolverPage solver={solver} />;
  if (solver.slug === "scrabble-solver") return <ScrabbleSolverPage solver={solver} />;
  if (solver.slug === "quordle-solver") return <QuordleSolverPage />;
  if (solver.slug === "crossword-solver") return <CrosswordSolverPage />;
  if (solver.slug === "jumble-solver") return <JumbleSolverPage />;
  if (solver.inputType === "wordle" && solver.wordLength) return <WordleLengthSolverPage solver={solver} />;
  if (solver.slug === "letter-box-solver") return <LetterBoxSolverPage />;
  if (solver.slug === "spelling-bee-solver") return <SpellingBeeSolverPage />;
  if (solver.slug === "anagram-solver" || solver.slug === "word-unscrambler" || solver.slug === "scrabble-solver" || solver.slug === "scrabble-word-finder" || solver.slug === "words-with-friends-solver") return <WordFinderMarketingPage solver={solver} />;
  const path = `/solvers/${solver.slug}`;
  const related = solver.relatedSolvers.map(getSolver).filter(Boolean);
  const faq = [
    { question: `What is the ${solver.name}?`, answer: `${solver.name} is a local helper that narrows word candidates from the information you enter.` },
    { question: "Does this call an AI API?", answer: "No. The first version runs deterministic local filters against a local word list." },
    { question: "Why are some words missing?", answer: "The included word list is intentionally small for the first release and can be replaced with a larger licensed list later." },
  ];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  };

  return (
    <article>
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }, { name: "All Solvers", url: "/all-solvers" }, { name: solver.name, url: path }])} />
      <JsonLd data={faqSchema} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: solver.name, url: absoluteUrl(path), applicationCategory: "GameApplication", isAccessibleForFree: true }} />
      <header className="py-10">
        <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-[#315C4C]">{solver.category}</p>
        <h1 className="mt-4 max-w-3xl break-words font-serif text-5xl font-black leading-tight text-[#20201E]">{solver.name}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#68645E]">{solver.shortDescription}</p>
      </header>

      <section aria-label={`${solver.name} workspace`}>
        <Suspense fallback={<div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-5 shadow-sm">Loading solver. Find possible words in a moment...</div>}>
          <SolverWorkspace inputType={solver.inputType} />
        </Suspense>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-sm">
          <h2 className="font-serif text-3xl font-black">How to use this tool</h2>
          <ol className="mt-4 grid gap-3 text-sm leading-6 text-[#68645E]">
            <li>1. Enter only the letters or clue information you know.</li>
            <li>2. Use the example button if you want to see the expected format.</li>
            <li>3. Review the result count, then loosen or tighten filters.</li>
          </ol>
        </div>
        <div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-sm">
          <h2 className="font-serif text-3xl font-black">How results are calculated</h2>
          <p className="mt-4 text-sm leading-6 text-[#68645E]">
            Results come from deterministic local filtering. The tool checks length, required
            letters, excluded letters, and game-specific rules against the local word list.
          </p>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-sm">
        <h2 className="font-serif text-3xl font-black">FAQ</h2>
        <div className="mt-4 grid gap-3">
          {faq.map((item) => (
            <details key={item.question} className="rounded-xl border border-[#E5DED3] bg-white p-4">
              <summary className="cursor-pointer list-none font-bold">{item.question}</summary>
              <p className="mt-3 text-sm leading-6 text-[#68645E]">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-sm">
        <h2 className="font-serif text-3xl font-black">Related solvers</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {related.map((item) => item ? (
            <Link key={item.slug} href={item.implemented && item.inputType !== "directory" ? `/solvers/${item.slug}` : "/all-solvers"} className="group rounded-xl border border-[#E5DED3] bg-white p-4 hover:border-[#315C4C]/50">
              <h3 className="font-serif text-xl font-black">{item.name}</h3>
              <p className="mt-2 text-sm leading-6 text-[#68645E]">{item.shortDescription}</p>
              <span className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#315C4C]">Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </Link>
          ) : null)}
        </div>
        <p className="mt-5 text-sm leading-6 text-[#68645E]">{disclaimer}</p>
      </section>
    </article>
  );
}
