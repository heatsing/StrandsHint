# Phase 1-2 Architecture Deliverables

Date: 2026-08-02  
Scope: Phase 1 and Phase 2 only. This document defines the audit output, planned sitemap, data models, and implementation plan. It intentionally does not add large batches of content pages.

## 1. Proposed Site Map

### Canonical Pages To Keep Or Support Now

| URL | Type | Source | SSG support | Metadata support |
| --- | --- | --- | --- | --- |
| `/` | Homepage | `app/page.tsx` | Static | Static `metadata` |
| `/all-solvers` | Solver directory | `app/all-solvers/page.tsx` | Static | Static `metadata` |
| `/daily-hints` | Daily hints directory | `app/daily-hints/page.tsx` | Static | Static `metadata` |
| `/solvers/[slug]` | Solver detail | `data/solver-registry.ts` | `generateStaticParams` | `generateMetadata` |
| `/hints/[game]` | Latest hint by game | `lib/daily-hints.ts` | `generateStaticParams` | `generateMetadata` |
| `/hints/[game]/[date]` | Date archive hint | `content/hints/{game}/{date}.json` | `generateStaticParams` | `generateMetadata` |
| `/today` | Daily SEO hub | `lib/daily-seo.ts` | Static | Static `metadata` |
| `/today/[slug]` | Daily SEO page | `lib/daily-seo.ts` | `generateStaticParams` | `generateMetadata` |
| `/todays-strands-answer` | Existing Strands answer | `data/puzzles.json` | Static | Static `metadata` |
| `/strands-hints` | Existing Strands hints | Existing page | Static | Static `metadata` |
| `/strands-solver` | Existing Strands grid solver | `components/SolverTool.tsx` | Static shell + client workspace | Static `metadata` |
| `/strands-spangram-helper` | Existing Spangram helper | `components/SolverTool.tsx` | Static shell + client workspace | Static `metadata` |
| `/strands-word-finder` | Existing word finder | Existing page | Static shell + client workspace | Static `metadata` |
| `/archive` | Existing Strands archive | `data/puzzles.json` | Static | Static `metadata` |
| `/archive/[date]` | Existing Strands archive detail | `data/puzzles.json` | `generateStaticParams` | `generateMetadata` |

### Pages Not To Add In Phase 1/2

These should remain planned until there is real content or functionality:

- `/blog`
- `/blog/[slug]`
- `/definitions`
- `/definitions/[term]`
- `/privacy`
- `/terms`
- `/contact`
- `/disclaimer`
- Long-tail solver pages such as `/wordle-solver/3-letter-wordle-solver`

Reason: adding them now as empty shells would create thin or placeholder pages.

## 2. Sitemap Rules

`app/sitemap.ts` should include only:

- 200-status canonical pages.
- Implemented solver pages from `solverRegistry`.
- Daily hint game pages from `dailyHintGames`.
- Date archive pages that have real local JSON files.
- Existing Strands archive pages with published puzzle data.

`app/sitemap.ts` must not include:

- `/admin/*`
- Query/filter parameter pages.
- Planned solver entries with `implemented: false`.
- Missing daily hint dates.
- Empty blog/definition/legal placeholders.

Current support check:

- `solverRegistry.filter((solver) => solver.implemented && solver.inputType !== "directory")` is used for `/solvers/*`.
- `dailyHintGames` and `getDailyHintSlugs()` are used for `/hints/*`.
- `/admin/*` is excluded.

## 3. Data Models

### SolverConfig

Source: `data/solver-registry.ts`

```ts
type SolverConfig = {
  slug: string
  name: string
  shortDescription: string
  category: "Wordle Solvers" | "Puzzle Solvers" | "Word Finders"
  icon: "grid" | "bee" | "shuffle" | "search" | "book" | "sparkles"
  inputType: "wordle" | "spelling-bee" | "anagram" | "directory"
  relatedSolvers: string[]
  seo: {
    title: string
    description: string
  }
  implemented: boolean
}
```

Use this model for:

- `/all-solvers` cards.
- `/solvers/[slug]` static params.
- `/solvers/[slug]` metadata.
- Related solver links.
- Sitemap inclusion.
- Footer/navigation expansion in later phases.

Implementation rule:

- Only `implemented: true` and non-directory entries should produce live `/solvers/[slug]` pages.
- Planned entries can appear in directory UI only if clearly marked as planned and not linked as live detail pages.

### DailyPuzzle

Source: `lib/daily-hints.ts`

```ts
type DailyPuzzle = {
  game: string
  date: string
  puzzleNumber?: number
  title: string
  shortHint: string
  mediumHints: string[]
  categoryHints?: string[]
  answers: string[]
  explanation?: string
  updatedAt: string
}
```

Storage convention:

```text
content/hints/{game}/{yyyy-mm-dd}.json
```

Use this model for:

- `/hints/[game]` latest daily page.
- `/hints/[game]/[date]` archive page.
- Daily hint sitemap entries.
- Local content creation script.

Implementation rule:

- Future dates must not render.
- Missing JSON files should not be included in sitemap.
- Answers remain hidden behind a reveal control.
- Daily content must be manually entered and original.

### Daily SEO Page

Source: `lib/daily-seo.ts`

This legacy/current model supports `/today/[slug]` pages for Wordle, Connections, and Strands. It currently overlaps with the newer `/hints/[game]` system.

Phase 2 decision:

- Keep it for now to avoid deleting existing SEO routes.
- Future consolidation should map `/today/*` and `/hints/*` to one canonical source of truth before adding more daily games.

## 4. SSG Support Check

| Route | SSG-ready? | Evidence |
| --- | --- | --- |
| `/solvers/[slug]` | Yes | Uses `generateStaticParams()` from `solverRegistry` |
| `/hints/[game]` | Yes | Uses `generateStaticParams()` from `dailyHintGames` |
| `/hints/[game]/[date]` | Yes | Uses `generateStaticParams()` from `getDailyHintSlugs()` |
| `/today/[slug]` | Yes | Uses `generateStaticParams()` from `dailySeoPages` |
| `/archive/[date]` | Yes | Existing archive dynamic route uses local puzzle data |

Static export support:

- `next.config.mjs` has `output: "export"` and `trailingSlash: true`.
- All dynamic pages intended for public indexing should have finite static params.
- Client interactivity is isolated inside solver workspaces and reveal controls.

## 5. Metadata Support Check

| Route group | Independent metadata? | Notes |
| --- | --- | --- |
| Static core pages | Yes | Static `metadata` exports are present on new directory pages |
| `/solvers/[slug]` | Yes | `generateMetadata()` reads `solver.seo` |
| `/hints/[game]` | Yes | `generateMetadata()` uses game registry |
| `/hints/[game]/[date]` | Yes | `generateMetadata()` uses game/date params |
| `/today/[slug]` | Yes | `generateMetadata()` reads daily page model |

Metadata rules for later phases:

- Never reuse a generic description across all pages.
- Canonical must match the public canonical path.
- Do not emit metadata for invalid dynamic params; return 404.
- Add Twitter Card to older pages where still missing.

## 6. Unified Solver Configuration Check

Current support:

- `data/solver-registry.ts` exists.
- Directory cards can read from `solverRegistry`.
- Dynamic solver pages can read from `solverRegistry`.
- Sitemap can read from `solverRegistry`.
- Related tool links can read `relatedSolvers`.

Gaps to address later:

- Navigation still has some hard-coded links.
- Footer partially uses hard-coded links.
- Strands legacy solver route is separate from `/solvers/[slug]`.
- Planned solvers need either real implementations or remain directory-only.

## 7. Phase 2 Implementation Plan

### Phase 2A: Architecture Stabilization

1. Keep `solverRegistry` as the only source for solver metadata.
2. Add a small helper for `implementedSolverPages` to avoid repeating filters.
3. Keep `dailyHintGames` as the source for daily hint route params.
4. Do not add blog, definitions, or legal pages until original content exists.

### Phase 2B: Design System Alignment

1. Preserve global warm background `#F8F5EF`.
2. Use `#FFFDF9` for cards and `#FFFFFF` only for elevated/tool result areas.
3. Keep `#315C4C` as the main action/focus color.
4. Avoid dark full-page sections and purple/blue AI-style gradients.

### Phase 2C: SEO Foundation

1. Ensure every indexable route has unique title/description/canonical.
2. Keep sitemap limited to canonical pages with real content.
3. Keep admin out of sitemap and disallowed in robots.
4. Continue using BreadcrumbList JSON-LD on dynamic pages.
5. Use WebApplication schema only for real solver pages.

### Phase 2D: QA Gates

Before Phase 3 begins, run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run smoke
```

Acceptance for Phase 2:

- Build passes.
- Sitemap excludes admin and empty planned pages.
- Dynamic solver pages build through SSG.
- Dynamic hint pages build through SSG.
- Metadata is generated independently for dynamic routes.
- No new large content-page batches are introduced.

## 8. Phase 3+ Deferred Work

- Accessible desktop dropdown navigation.
- Mobile drawer navigation.
- Larger licensed word list.
- Legal pages with original text.
- Blog and definitions content system.
- Long-tail solver pages only when there is true functional differentiation.
- Lighthouse and browser interaction testing.
