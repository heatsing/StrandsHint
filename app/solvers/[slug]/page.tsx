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
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { AnagramSolverClient } from "@/components/solvers/AnagramSolverClient";
import { SpellingBeeSolverClient } from "@/components/solvers/SpellingBeeSolverClient";
import { WordleSolverClient } from "@/components/solvers/WordleSolverClient";
import { getSolver, solverRegistry } from "@/data/solver-registry";
import { absoluteUrl, breadcrumbSchema, disclaimer } from "@/lib/seo";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return solverRegistry.filter((solver) => solver.implemented && ["wordle", "spelling-bee", "anagram"].some((kind) => solver.inputType === kind)).map((solver) => ({ slug: solver.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const solver = getSolver(params.slug);
  if (!solver || !solver.implemented) return {};
  const path = `/solvers/${solver.slug}`;
  return {
    title: solver.seo.title,
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

          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_23rem]">
            <Suspense fallback={<div className="rounded-2xl border border-[#E5DED3] bg-[#FFFDF9] p-6 shadow-sm">Loading Spelling Bee Solver...</div>}>
              <SpellingBeeSolverClient />
            </Suspense>

            <aside className="grid content-start gap-6">
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
            </aside>
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

export default function SolverPage({ params }: Props) {
  const solver = getSolver(params.slug);
  if (!solver || !solver.implemented || solver.inputType === "directory") notFound();
  if (solver.slug === "spelling-bee-solver") return <SpellingBeeSolverPage />;
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
