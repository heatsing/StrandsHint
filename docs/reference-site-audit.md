# Reference Site Audit: nytsolvers.com

Audit date: 2026-08-02  
Project: Strands Hint / independent word puzzle helper  
Reference use: product architecture, SEO patterns, page-type taxonomy, and tool ecosystem only. Do not copy UI, copy, code, images, logo, or proprietary daily puzzle content.

## Current Codebase Audit

### Framework And Runtime

- Framework: Next.js 14.2.35.
- Router: App Router under `app/`.
- React: 18.3.1.
- TypeScript: 5.6.3 with `strict: true`, `moduleResolution: bundler`, JSON imports enabled.
- Styling: Tailwind CSS 3.4 with `@tailwindcss/typography`, local shadcn-style UI primitives.
- Data: local JSON and TypeScript modules. No database dependency.
- Deployment: static build output deployed through Cloudflare Pages/Wrangler.

### Existing Pages And Features

| Area | Existing routes | Notes |
| --- | --- | --- |
| Home | `/` | Strong Strands-specific marketing/tool hub, currently dark palette. |
| Daily SEO | `/today`, `/today/[slug]` | Wordle, Connections, Strands daily page templates from `lib/daily-seo.ts`. |
| Strands content | `/todays-strands-answer`, `/strands-hints`, `/archive`, `/archive/[date]` | Manual JSON puzzle content. Spoiler reveals exist. |
| Strands tools | `/strands-solver`, `/strands-spangram-helper`, `/strands-word-finder` | Browser-side 6x8 grid DFS solver exists. |
| Admin helpers | `/admin`, `/admin/puzzles/new`, `/admin/daily/new` | JSON generation helpers, no database. |
| SEO infra | `app/sitemap.ts`, `app/robots.ts`, `lib/seo.ts`, `components/JsonLd.tsx` | Sitemap excludes admin; robots disallows `/admin/`. |
| Assets | favicon set, `strandshint_logo.png`, word list JSON | Logo recently added. |

### Reusable Components

| Component | Use |
| --- | --- |
| `JsonLd` | Structured data output. |
| `Breadcrumbs` | Visual breadcrumbs. |
| `FAQ` | FAQ rendering. |
| `SpoilerReveal` | Progressive spoiler disclosure. |
| `LetterGridInput` | 6x8 Strands grid input. |
| `SolverTool` / `SolverResultList` | Current Strands grid solving UI. |
| `AdminPuzzleForm` / `AdminDailyContentForm` | Static JSON content helpers. |

### Risks And Gaps

- Visual system conflicts with latest brand requirement: current global background is dark `#12172B`, but required site-wide background is `#F8F5EF`.
- Navigation is flat and Strands-specific; requested architecture needs grouped Solvers, Daily Hints, and Resources.
- No shared solver registry exists yet, so new solver pages would become duplicated unless a data-driven system is added.
- No Wordle Solver, Spelling Bee Solver, or Anagram/Unscrambler algorithms exist yet.
- `npm run typecheck` and `npm run test` scripts are absent, while the requested QA flow requires them.
- Footer legal copy exists but should be expanded to cover independent third-party status and trademarks.
- Current `public/word-list.json` is very small, useful for smoke/demo but not enough for production-quality word game results.
- Several pages are client-heavy only where needed, but future solver tools must remain isolated client components to protect first-load performance.
- Accessibility baseline is acceptable for native links/details/buttons, but dropdown navigation and mobile drawer do not yet exist.

## Reference Site Map

Observed from the public sitemap:

| Group | URL examples | Pattern |
| --- | --- | --- |
| Homepage | `/` | Main hub. |
| Daily hints | `/wordle-hints`, `/connections-hints`, `/spelling-bee-hints`, `/strands-hints`, `/crossword-hints` | One route per game intent. |
| Solver tools | `/wordle-solver`, `/spelling-bee-solver`, `/letter-boxed-solver`, `/word-unscrambler`, `/anagram-solver`, `/crossword-solver` | One route per tool. |
| Solver directory | `/all-solvers` | Index/hub. |
| Long-tail solver pages | `/wordle-solver/3-letter-wordle-solver` through `/12-letter-wordle-solver` except 5-letter root | Programmatic length pages. |
| Resources | `/grammar`, `/definitions`, `/blog`, several blog posts | Supporting informational cluster. |
| Static legal pages | `/about-us`, `/contact-us`, `/terms-conditions`, `/privacy-policy`, `/disclaimer` | Trust and compliance. |

## Page Type Matrix

| Page type | Search intent | Core modules | Our implementation direction |
| --- | --- | --- | --- |
| Homepage | Discover available puzzle help fast | Hero, search, featured tools, daily hints, solver directory, FAQ | Keep original visual style and brand; do not copy text or colors. |
| Solver page | Complete a specific tool task | Input form, validation, results, how-to, examples, FAQ, related tools | Data-driven `solvers/[slug]` with specific client workspace per implemented tool. |
| Daily hint page | Get today’s clue/answer safely | Date header, progressive hints, answer reveal, explanation, related pages | Data-driven `hints/[game]` and `hints/[game]/[date]` with local JSON. |
| Directory page | Browse tools or hints | Category cards, filters/search, internal links | `/all-solvers`, `/daily-hints`. |
| Long-tail page | Specific word length/pattern need | Specialized tool prefilter, explanation, FAQ | Add only when there is real functionality, not keyword swaps. |
| Resource/blog page | Learn strategy or definitions | Article, examples, related tools | Later phase; build original content templates. |
| Legal page | Trust and compliance | Disclaimer, privacy, terms | Add original pages. |

## Component Matrix

| Component pattern | Reference role | Safe borrowing principle |
| --- | --- | --- |
| Header dropdowns | Organizes Solvers, Hints, Resources | Build our own accessible grouped nav with different visual design. |
| Search entry | Quick route to tools/answers | Implement original solver search/filter component. |
| Tool cards | Internal links to high-value pages | Generate from local registry. |
| Daily hint cards | Freshness and return visits | Generate from local daily hint registry/content. |
| FAQ accordions | Rich snippets and trust | Use original questions and answers. |
| Footer clusters | Crawl paths and trust links | Use our own legal and resource pages. |

## Function Matrix

| Function | Reference pattern | Current project | Gap |
| --- | --- | --- | --- |
| Strands grid solver | Solver category page | Implemented for 6x8 Strands | Needs warmer UI consistency. |
| Wordle solver | Dedicated tool | Missing | High priority. |
| Spelling Bee solver | Dedicated tool | Missing | High priority. |
| Anagram/unscrambler | Dedicated tools | Missing | High priority. |
| All solvers directory | Directory page | Missing | High priority. |
| All hints directory | Daily hub exists but limited | Partial | Add `/daily-hints`. |
| Daily archive by date | Date content pages | Partial for Strands archive and `/today/[slug]` | Add `content/hints/{game}/{date}.json` model. |

## SEO Matrix

| SEO element | Reference observation | Current project | Needed |
| --- | --- | --- | --- |
| Title/description | Unique for many key pages; blog page appears to share all-solvers metadata in one request check | Mostly unique for existing pages | Ensure every new route has unique metadata. |
| Canonical | Present on sampled pages | Present on many current pages | Preserve self-referencing canonicals. |
| Sitemap | Groups hints, solvers, resources, legal pages | Current sitemap includes existing public pages | Add only implemented canonical pages. |
| Breadcrumb JSON-LD | Common SEO expectation | Present on current core pages | Add to new directory/tool pages. |
| FAQ JSON-LD | Useful for tool/hint pages | Present on many existing pages | Add when FAQ exists. |
| WebSite/WebApplication schema | Needed for platform/tool identity | Partial | Add reusable schema helpers. |

## Borrowable Parts

- Page-type taxonomy: solver pages, daily hint pages, resource pages, legal pages.
- Internal linking strategy: homepage to directories; directories to tools; tools to related tools and hints.
- Programmatic SEO approach: use a registry to scale page generation and sitemap inclusion.
- Tool-page content expectations: input, validation, results, examples, rules, FAQ.

## Parts Not To Copy

- Logo, brand name, favicon, images, icons, color palette, exact layout, copy, headings, FAQ text, article text, HTML/CSS/JS implementation, daily puzzle answers, and any official-looking NYT presentation.
- Any claim of being official, authorized, real-time, AI-powered, or professionally reviewed unless it is true.

## Current Project Gap Against Target

| Priority | Gap | Why it matters |
| --- | --- | --- |
| Critical | Full site palette violates new `#F8F5EF` requirement | Brand consistency and user request compliance. |
| Critical | Missing Wordle, Spelling Bee, Anagram/Unscrambler tools | Required first-round functional scope. |
| Critical | Missing `typecheck` and `test` scripts | Required QA commands cannot run. |
| Major | Missing solver registry and `/solvers/[slug]` route | Scaling pages manually will create duplicate code. |
| Major | Missing `/all-solvers` and `/daily-hints` directories | SEO hub structure incomplete. |
| Major | Daily hints are split between `data/daily-content.json` and Strands archive | Need normalized `content/hints/{game}/{date}.json`. |
| Major | Navigation lacks accessible grouped dropdowns/mobile drawer | Required IA not reflected in UI. |
| Minor | Word list is too small for production usefulness | Algorithms can work but results will be thin until word data grows. |

## Recommended Implementation Priority

1. Apply warm editorial design tokens globally and update layout/footer/legal copy.
2. Add registry-driven solver and daily hint data structures.
3. Add `/all-solvers`, `/daily-hints`, and `/solvers/[slug]`.
4. Implement Wordle Solver, Spelling Bee Solver, and Anagram/Unscrambler with pure functions and tests.
5. Add normalized daily hint content model, archive route, and `create:daily-hint` script.
6. Expand sitemap/robots/schema helpers for new canonical pages only.
7. Add typecheck/test scripts, run lint/typecheck/test/build/smoke, and fix issues.
